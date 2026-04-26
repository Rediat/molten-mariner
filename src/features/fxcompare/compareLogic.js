export const TENURES = [28, 91, 182, 364];

/**
 * Returns YYYY-MM-DD in local time
 */
function toLocalISO(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getMonthKey(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

export function calculateMaturityDate(date, tenureDays) {
    const d = new Date(date);
    // If input is YYYY-MM-DD string, new Date(string) is UTC.
    // If it's a timestamp, it's UTC but d.getDate() is Local.
    // To be safe, we always handle as local.
    if (typeof date === 'string' && date.includes('-')) {
        const [y, m, day] = date.split('-').map(Number);
        d.setFullYear(y, m - 1, day);
    }
    d.setDate(d.getDate() + tenureDays);
    return toLocalISO(d);
}

/**
 * Finds the FX rate for a given currency and month.
 * If data is missing, it looks back at previous months.
 */
export function getFxRateWithFallback(fxDataObj, currency, targetMonth) {
    const monthlyPrices = fxDataObj.monthlyPrices;
    
    // Sort months descending to make searching backwards easier
    const sortedMonths = [...monthlyPrices].sort((a, b) => b.month.localeCompare(a.month));
    
    // Find the index of the target month or the first month before it
    let startIndex = sortedMonths.findIndex(m => m.month <= targetMonth);
    
    if (startIndex === -1) return null;

    // Look back up to 12 months for a valid rate
    for (let i = startIndex; i < Math.min(startIndex + 12, sortedMonths.length); i++) {
        const entry = sortedMonths[i];
        if (entry.value[currency] != null) {
            return {
                rate: entry.value[currency],
                monthUsed: entry.month,
                isFallback: entry.month !== targetMonth
            };
        }
    }
    
    return null;
}

export function compareReturns(budget, tbillAuction, fxDataObj, currency, brokerageRate = 0.1) {
    const startMonth = getMonthKey(tbillAuction.timestamp);
    const issueDateStr = toLocalISO(tbillAuction.timestamp);
    
    // Check if start month FX data exists (with fallback)
    const startRateInfo = getFxRateWithFallback(fxDataObj, currency, startMonth);
    if (!startRateInfo) {
        return { error: `No FX data for ${currency} available on or before ${startMonth}` };
    }
    const fxStartRate = startRateInfo.rate;
    const startMonthUsed = startRateInfo.monthUsed;
    const startIsFallback = startRateInfo.isFallback;

    const results = {};

    TENURES.forEach(tenure => {
        const yieldKey = `${tenure}_days`;
        const yieldAnnual = tbillAuction.weightedAverageYields[yieldKey];
        
        if (yieldAnnual == null) {
            results[tenure] = { error: `No T-Bill yield for ${tenure} days` };
            return;
        }

        const maturityDate = calculateMaturityDate(issueDateStr, tenure);
        const endMonth = getMonthKey(maturityDate);

        const endRateInfo = getFxRateWithFallback(fxDataObj, currency, endMonth);
        if (!endRateInfo) {
            results[tenure] = { error: `No FX data for ${currency} available on or before ${endMonth}` };
            return;
        }
        const fxEndRate = endRateInfo.rate;
        const endMonthUsed = endRateInfo.monthUsed;
        const endIsFallback = endRateInfo.isFallback;

        // T-Bill Logic
        const UNIT_FV = 5000;
        const unitPrice = UNIT_FV / (1 + (yieldAnnual / 100) * (tenure / 365));
        const unitPriceInclBrok = unitPrice * (1 + (brokerageRate / 100));
        
        const quantity = Math.floor(budget / unitPriceInclBrok);
        if (quantity === 0) {
             results[tenure] = { error: `Budget too low to buy 1 unit` };
             return;
        }

        const tbillInvestment = quantity * unitPriceInclBrok;
        const tbillEndValue = quantity * UNIT_FV;
        const tbillProfit = tbillEndValue - tbillInvestment;

        // FX Logic (investing the exact same amount actually spent on T-Bills)
        const fxUnitsBought = tbillInvestment / fxStartRate;
        const fxEndValue = fxUnitsBought * fxEndRate;
        const fxProfit = fxEndValue - tbillInvestment;

        const tbillROI = (tbillProfit / tbillInvestment) * 100;
        const tbillEffectiveYield = (tbillProfit / tbillInvestment) * (365 / tenure) * 100;
        const fxROI = (fxProfit / tbillInvestment) * 100;

        results[tenure] = {
            maturityDate,
            tbillInvestment,
            tbillEndValue,
            tbillProfit,
            tbillROI,
            tbillEffectiveYield,
            tbillYield: yieldAnnual,
            tbillCutOffYield: (tbillAuction.cutOffYields && tbillAuction.cutOffYields[yieldKey]) || 
                              (tbillAuction.cutOffYield && tbillAuction.cutOffYield[yieldKey]) || 
                              null,
            fxStartRate,
            fxEndRate,
            fxUnitsBought,
            fxEndValue,
            fxProfit,
            fxROI,
            startMonthUsed,
            startIsFallback,
            endMonthUsed,
            endIsFallback,
            winner: fxEndValue > tbillEndValue ? 'FX' : 'T-BILL',
            diffAmount: Math.abs(fxEndValue - tbillEndValue),
            diffROI: Math.abs(tbillROI - fxROI)
        };
    });

    return {
        issueDate: issueDateStr,
        currency,
        startMonth,
        results
    };
}

/**
 * Rolling T-Bill reinvestment comparison.
 * Simulates reinvesting matured T-Bill proceeds into the next available auction
 * repeatedly, and compares cumulative returns vs holding FX over the full period.
 */
export function compareRollingReturns(budget, startAuction, tbillDataAll, fxDataObj, currency, brokerageRate, selectedTenure) {
    const UNIT_FV = 5000;
    const yieldKey = `${selectedTenure}_days`;

    const startMonth = getMonthKey(startAuction.timestamp);
    const issueDateStr = toLocalISO(startAuction.timestamp);

    // Check start month FX data (with fallback)
    const startRateInfo = getFxRateWithFallback(fxDataObj, currency, startMonth);
    if (!startRateInfo) {
        return { error: `No FX data for ${currency} available on or before ${startMonth}` };
    }
    const fxStartRate = startRateInfo.rate;
    const startMonthUsed = startRateInfo.monthUsed;
    const startIsFallback = startRateInfo.isFallback;

    // Sort auctions chronologically
    const sortedAuctions = [...tbillDataAll].sort((a, b) => a.timestamp - b.timestamp);

    const rounds = [];
    let currentCash = budget;
    let currentAuction = startAuction;
    let totalInvested = budget; // original budget

    /* eslint-disable-next-line no-constant-condition */
    while (true) {
        const auctionDateStr = toLocalISO(currentAuction.timestamp);
        const yieldAnnual = currentAuction.weightedAverageYields[yieldKey];
        const cutOffYield = (currentAuction.cutOffYields && currentAuction.cutOffYields[yieldKey]) || null;

        // Check if this auction has a valid yield for selected tenure
        if (yieldAnnual == null) {
            // Skip this auction, find next one
            const nextAuction = sortedAuctions.find(a => a.timestamp > currentAuction.timestamp);
            if (!nextAuction) break;
            currentAuction = nextAuction;
            continue;
        }

        const maturityDate = calculateMaturityDate(auctionDateStr, selectedTenure);
        const endMonth = getMonthKey(maturityDate);

        // Stop if maturity month has no FX data available (even with lookback)
        const checkEndRate = getFxRateWithFallback(fxDataObj, currency, endMonth);
        if (!checkEndRate) {
            break;
        }

        // Buy T-Bill units
        const unitPrice = UNIT_FV / (1 + (yieldAnnual / 100) * (selectedTenure / 365));
        const unitPriceInclBrok = unitPrice * (1 + (brokerageRate / 100));
        const quantity = Math.floor(currentCash / unitPriceInclBrok);

        if (quantity === 0) {
            // Can't buy any units, chain ends
            break;
        }

        const invested = quantity * unitPriceInclBrok;
        const leftover = currentCash - invested;
        const endValue = quantity * UNIT_FV;
        const profit = endValue - invested;

        rounds.push({
            auctionNo: currentAuction.auctionNo,
            auctionDate: currentAuction.date,
            maturityDate,
            yield: yieldAnnual,
            cutOffYield,
            quantity,
            invested,
            endValue,
            profit,
            leftover,
            roi: (profit / invested) * 100
        });

        // Proceeds = matured value + leftover cash
        currentCash = endValue + leftover;

        // Find next auction on or after maturity
        // Use a 00:00:00 Local interpretation for comparison
        const [y, m, day] = maturityDate.split('-').map(Number);
        const maturityTs = new Date(y, m - 1, day).getTime();
        const nextAuction = sortedAuctions.find(a => a.timestamp >= maturityTs);

        if (!nextAuction) break;
        currentAuction = nextAuction;
    }

    if (rounds.length === 0) {
        return { error: `No valid auctions found for ${selectedTenure}-day tenure with FX data coverage` };
    }

    // firstRound intentionally removed to fix lint warning
    const lastRound = rounds[rounds.length - 1];
    const tbillFinalValue = lastRound.endValue + lastRound.leftover;
    const tbillTotalProfit = tbillFinalValue - totalInvested;
    const tbillTotalROI = (tbillTotalProfit / totalInvested) * 100;

    // Calculate total days for annualized ROI
    // Note: use local dates for totalDays consistency
    const [sy, sm, sd] = issueDateStr.split('-').map(Number);
    const startDate = new Date(sy, sm - 1, sd);
    const [ey, em, ed] = lastRound.maturityDate.split('-').map(Number);
    const endDate = new Date(ey, em - 1, ed);
    const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    const tbillAnnualizedROI = totalDays > 0 ? (tbillTotalProfit / totalInvested) * (365 / totalDays) * 100 : 0;

    // FX comparison: buy at start, hold till final maturity, sell (with fallback)
    const finalMonth = getMonthKey(lastRound.maturityDate);
    const endRateInfo = getFxRateWithFallback(fxDataObj, currency, finalMonth);
    
    const fxEndRate = endRateInfo ? endRateInfo.rate : fxStartRate;
    const endMonthUsed = endRateInfo ? endRateInfo.monthUsed : startMonthUsed;
    const endIsFallback = endRateInfo ? endRateInfo.isFallback : false;

    const fxUnitsBought = totalInvested / fxStartRate;
    const fxEndValue = fxUnitsBought * fxEndRate;
    const fxProfit = fxEndValue - totalInvested;
    const fxROI = (fxProfit / totalInvested) * 100;
    const fxAnnualizedROI = totalDays > 0 ? (fxProfit / totalInvested) * (365 / totalDays) * 100 : 0;

    return {
        issueDate: issueDateStr,
        currency,
        startMonth,
        finalMaturityDate: lastRound.maturityDate,
        totalRounds: rounds.length,
        totalDays,
        rounds,
        tbillFinalValue,
        tbillTotalProfit,
        tbillTotalROI,
        tbillAnnualizedROI,
        fxStartRate,
        fxEndRate,
        fxUnitsBought,
        fxEndValue,
        fxProfit,
        fxROI,
        fxAnnualizedROI,
        startMonthUsed,
        startIsFallback,
        endMonthUsed,
        endIsFallback,
        winner: fxEndValue > tbillFinalValue ? 'FX' : 'T-BILL',
        diffAmount: Math.abs(fxEndValue - tbillFinalValue),
        diffROI: Math.abs(tbillTotalROI - fxROI)
    };
}

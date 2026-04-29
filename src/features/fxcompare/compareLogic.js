import { calculateLoan } from '../../utils/financial-utils';

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
    if (typeof date === 'string' && date.includes('-')) {
        const [y, m, day] = date.split('-').map(Number);
        d.setFullYear(y, m - 1, day);
    }
    d.setDate(d.getDate() + tenureDays);
    return toLocalISO(d);
}

// Auction Schedule Logic (Wednesday every 2 weeks)
const AUCTION_REF_DATE = new Date(2026, 3, 1); // April 01, 2026 (Wednesday)
const AUCTION_INTERVAL_DAYS = 14;

/**
 * Finds the next available auction date on or after fromDate.
 * @param {Date} fromDate The starting date to search from.
 * @param {boolean} strictlyAfter If true, the auction must be strictly after fromDate.
 */
function getNextAuctionDate(fromDate, strictlyAfter = false) {
    const refTs = AUCTION_REF_DATE.getTime();
    const fromTs = fromDate.getTime();
    const intervalMs = AUCTION_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
    
    // Calculate intervals since reference
    const diff = fromTs - refTs;
    let n = Math.ceil(diff / intervalMs);
    if (n < 0) n = 0;
    
    let auctionTs = refTs + n * intervalMs;
    
    // Ensure it's strictly after if requested
    if (strictlyAfter && auctionTs <= fromTs) {
        auctionTs += intervalMs;
    }
    
    return new Date(auctionTs);
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

function getLeverageFinalValue(budget, yieldAnnual, loanYears, brokerageRate, selectedTenure) {
    const UNIT_FV = 5000;
    const startDate = new Date(2026, 3, 29); // Base simulation on current date (Apr 29, 2026)
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + loanYears);
    
    let currentCash = budget;
    let currentRoundDate = getNextAuctionDate(startDate, false); 

    // Skip the first auction if it's less than 1 day away from simulation start (ignoring hours)
    const startDateClean = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const auctionDateClean = new Date(currentRoundDate.getFullYear(), currentRoundDate.getMonth(), currentRoundDate.getDate());
    const firstAuctionGapDays = Math.round((auctionDateClean - startDateClean) / (1000 * 60 * 60 * 24));
    
    if (firstAuctionGapDays < 1) {
        currentRoundDate = getNextAuctionDate(currentRoundDate, true);
    }

    while (true) {
        const maturityDate = new Date(currentRoundDate);
        maturityDate.setDate(maturityDate.getDate() + selectedTenure);
        
        if (maturityDate > endDate) break;
        
        const unitPrice = UNIT_FV / (1 + (yieldAnnual / 100) * (selectedTenure / 365));
        const unitPriceInclBrok = unitPrice * (1 + (brokerageRate / 100));
        
        const quantity = Math.floor(currentCash / unitPriceInclBrok);
        if (quantity === 0) break;

        const invested = quantity * unitPriceInclBrok;
        const leftover = currentCash - invested;
        const endValue = quantity * UNIT_FV;
        currentCash = endValue + leftover;
        
        // Find next auction strictly AFTER maturity
        currentRoundDate = getNextAuctionDate(maturityDate, true);
    }
    return currentCash;
}

export function findBreakEvenTbillRate(budget, loanRate, loanYears, loanFrequency, brokerageRate, selectedTenure) {
    const loanResult = calculateLoan(budget, loanRate, loanYears, 0, loanFrequency);
    const targetValue = loanResult.totalPayment;
    
    let low = 0;
    let high = 100; // 100% is a safe upper bound for T-bills
    let breakEven = 0;
    
    for (let i = 0; i < 20; i++) {
        let mid = (low + high) / 2;
        let fv = getLeverageFinalValue(budget, mid, loanYears, brokerageRate, selectedTenure);
        if (fv >= targetValue) {
            breakEven = mid;
            high = mid;
        } else {
            low = mid;
        }
    }
    return breakEven;
}

export function compareLeverageReturns(budget, loanRate, loanYears, loanFrequency, customTbillRate, brokerageRate, selectedTenure) {
    const UNIT_FV = 5000;
    const yieldAnnual = customTbillRate;

    if (yieldAnnual == null || isNaN(yieldAnnual) || yieldAnnual <= 0) {
        return { error: `Please provide a valid T-Bill discount rate.` };
    }

    // 1. Loan Calculation
    const loanResult = calculateLoan(budget, loanRate, loanYears, 0, loanFrequency);
    
    // 2. Future Rolling T-Bill Simulation
    const startDate = new Date(2026, 3, 29); // Base simulation on current date (Apr 29, 2026)
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + loanYears);
    
    let currentCash = budget;
    const totalInvested = budget;
    const rounds = [];
    
    // Start with the first available auction on or after simulation start
    let currentRoundDate = getNextAuctionDate(startDate, false); 
    
    // Skip the first auction if it's less than 1 day away from simulation start (ignoring hours)
    const startDateClean = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const auctionDateClean = new Date(currentRoundDate.getFullYear(), currentRoundDate.getMonth(), currentRoundDate.getDate());
    const firstAuctionGapDays = Math.round((auctionDateClean - startDateClean) / (1000 * 60 * 60 * 24));
    
    if (firstAuctionGapDays < 1) {
        currentRoundDate = getNextAuctionDate(currentRoundDate, true);
    }
    
    while (true) {
        const maturityDate = new Date(currentRoundDate);
        maturityDate.setDate(maturityDate.getDate() + selectedTenure);
        
        // Cannot mature after loan term
        if (maturityDate > endDate) break;

        const unitPrice = UNIT_FV / (1 + (yieldAnnual / 100) * (selectedTenure / 365));
        const unitPriceInclBrok = unitPrice * (1 + (brokerageRate / 100));

        const quantity = Math.floor(currentCash / unitPriceInclBrok);
        if (quantity === 0) break; // Can't buy any more units

        const invested = quantity * unitPriceInclBrok;
        const leftover = currentCash - invested;
        const endValue = quantity * UNIT_FV;
        const profit = endValue - invested;

        rounds.push({
            roundNo: rounds.length + 1,
            auctionDate: toLocalISO(currentRoundDate),
            maturityDate: toLocalISO(maturityDate),
            yield: yieldAnnual,
            quantity,
            invested,
            endValue,
            profit,
            leftover,
            roi: (profit / invested) * 100
        });

        currentCash = endValue + leftover;
        
        // Find next auction strictly AFTER maturity
        currentRoundDate = getNextAuctionDate(maturityDate, true);
    }

    if (rounds.length === 0) {
        return { error: `Budget too low to buy 1 unit or loan term too short.` };
    }

    const lastRound = rounds[rounds.length - 1];
    const tbillFinalValue = lastRound.endValue + lastRound.leftover;
    const tbillTotalProfit = tbillFinalValue - totalInvested;
    const tbillTotalROI = (tbillTotalProfit / totalInvested) * 100;
    
    const netProfit = tbillFinalValue - loanResult.totalPayment;
    const isProfitable = netProfit > 0;

    const breakEvenTbillRate = findBreakEvenTbillRate(budget, loanRate, loanYears, loanFrequency, brokerageRate, selectedTenure);

    // Calculate actual days from simulation start to final maturity
    const finalMaturityDate = new Date(lastRound.maturityDate.split('-')[0], lastRound.maturityDate.split('-')[1]-1, lastRound.maturityDate.split('-')[2]);
    const accumulatedDays = Math.round((finalMaturityDate - startDate) / (1000 * 60 * 60 * 24));

    return {
        loanResult,
        tbillFinalValue,
        tbillTotalProfit,
        tbillTotalROI,
        netProfit,
        isProfitable,
        rounds,
        totalRounds: rounds.length,
        accumulatedDays,
        breakEvenTbillRate,
        startDate: toLocalISO(startDate),
        endDate: toLocalISO(endDate)
    };
}

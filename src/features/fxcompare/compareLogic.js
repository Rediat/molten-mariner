export const TENURES = [28, 91, 182, 364];

function getMonthKey(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

export function calculateMaturityDate(issueStr, tenureDays) {
    const issue = new Date(issueStr);
    issue.setDate(issue.getDate() + tenureDays);
    return issue.toISOString().split('T')[0];
}

export function compareReturns(budget, tbillAuction, fxDataObj, currency, brokerageRate = 0.1) {
    const issueDateStr = new Date(tbillAuction.timestamp).toISOString().split('T')[0];
    const startMonth = getMonthKey(issueDateStr);
    
    // Check if start month FX data exists
    const startFxData = fxDataObj.monthlyPrices.find(m => m.month === startMonth);
    if (!startFxData || !startFxData.value[currency]) {
        return { error: `No FX data for ${currency} in ${startMonth}` };
    }
    const fxStartRate = startFxData.value[currency];

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

        const endFxData = fxDataObj.monthlyPrices.find(m => m.month === endMonth);
        if (!endFxData || !endFxData.value[currency]) {
            results[tenure] = { error: `No FX data for ${currency} in ${endMonth}` };
            return;
        }
        const fxEndRate = endFxData.value[currency];

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
 *
 * @param {number} budget - ETB amount to invest
 * @param {object} startAuction - The first auction object to participate in
 * @param {Array} tbillDataAll - All auction data (from data.json)
 * @param {object} fxDataObj - FX data (from fxData.json)
 * @param {string} currency - Currency code (e.g. 'USD')
 * @param {number} brokerageRate - Brokerage percentage (e.g. 0.1 for 0.1%)
 * @param {number} selectedTenure - Tenure in days (28, 91, 182, or 364)
 */
export function compareRollingReturns(budget, startAuction, tbillDataAll, fxDataObj, currency, brokerageRate, selectedTenure) {
    const UNIT_FV = 5000;
    const yieldKey = `${selectedTenure}_days`;

    const issueDateStr = new Date(startAuction.timestamp).toISOString().split('T')[0];
    const startMonth = getMonthKey(issueDateStr);

    // Check start month FX data
    const startFxData = fxDataObj.monthlyPrices.find(m => m.month === startMonth);
    if (!startFxData || !startFxData.value[currency]) {
        return { error: `No FX data for ${currency} in ${startMonth}` };
    }
    const fxStartRate = startFxData.value[currency];

    // All available FX months for boundary checking
    const fxMonthsSet = new Set(fxDataObj.monthlyPrices.map(m => m.month));
    const allFxMonths = fxDataObj.monthlyPrices.map(m => m.month).sort();
    const latestFxMonth = allFxMonths[allFxMonths.length - 1];

    // Sort auctions chronologically
    const sortedAuctions = [...tbillDataAll].sort((a, b) => a.timestamp - b.timestamp);

    const rounds = [];
    let currentCash = budget;
    let currentAuction = startAuction;
    let totalInvested = budget; // original budget

    while (true) {
        const auctionDateStr = new Date(currentAuction.timestamp).toISOString().split('T')[0];
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

        // Stop if maturity month has no FX data
        if (!fxMonthsSet.has(endMonth) || endMonth > latestFxMonth) {
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
        const maturityTs = new Date(maturityDate).getTime();
        const nextAuction = sortedAuctions.find(a => a.timestamp >= maturityTs);

        if (!nextAuction) break;
        currentAuction = nextAuction;
    }

    if (rounds.length === 0) {
        return { error: `No valid auctions found for ${selectedTenure}-day tenure with FX data coverage` };
    }

    const firstRound = rounds[0];
    const lastRound = rounds[rounds.length - 1];
    const tbillFinalValue = lastRound.endValue + lastRound.leftover;
    const tbillTotalProfit = tbillFinalValue - totalInvested;
    const tbillTotalROI = (tbillTotalProfit / totalInvested) * 100;

    // Calculate total days for annualized ROI
    const startDate = new Date(issueDateStr);
    const endDate = new Date(lastRound.maturityDate);
    const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    const tbillAnnualizedROI = totalDays > 0 ? (tbillTotalProfit / totalInvested) * (365 / totalDays) * 100 : 0;

    // FX comparison: buy at start, hold till final maturity, sell
    const finalMonth = getMonthKey(lastRound.maturityDate);
    const endFxData = fxDataObj.monthlyPrices.find(m => m.month === finalMonth);
    const fxEndRate = endFxData ? endFxData.value[currency] : fxStartRate;

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
        winner: fxEndValue > tbillFinalValue ? 'FX' : 'T-BILL',
        diffAmount: Math.abs(fxEndValue - tbillFinalValue),
        diffROI: Math.abs(tbillTotalROI - fxROI)
    };
}

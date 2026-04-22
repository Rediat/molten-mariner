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

---
description: Implement complex financial formulas (TVM, Loan, Bond, NPV) using proven mathematical logic.
---

# Financial Calculations Skill

This skill provides proven, mathematically sound implementations of standard financial formulas. These equations can be tricky due to edge cases (division by zero, negative rates, iterative solving like Newton-Raphson). 

When a user asks you (an AI agent) to implement a Time Value of Money (TVM) calculator, a Loan Amortization schedule, an Internal Rate of Return (IRR) calculator, or a Bond Valuator in **any programming language**, translate the logic provided in this document into your target language.

## 1. Time Value of Money (TVM)
The standard TVM equation connects Present Value (PV), Future Value (FV), Payment (PMT), Interest Rate (I), and Number of Periods (N).

### Core Logic (JavaScript Reference)
```javascript
export const calculateTVM = (target, values, mode = 'END', frequency = 12) => {
    let { n, i, pv, pmt, fv } = values;
    const type = mode === 'BEGIN' ? 1 : 0;
    
    // r = Effective periodic rate
    const r_periodic = (i / 100) / frequency;
    let r = Math.pow(1 + r_periodic, frequency / frequency) - 1; // Simplified for CY=PY

    if (target === 'fv') {
        if (r === 0) return -(pv + pmt * n);
        const factor = Math.pow(1 + r, n);
        return -(pv * factor + pmt * (1 + r * type) * (factor - 1) / r);
    }

    if (target === 'pv') {
        if (r === 0) return -(fv + pmt * n);
        const factor = Math.pow(1 + r, -n);
        return -(fv * factor + pmt * (1 + r * type) * (1 - factor) / r);
    }

    if (target === 'pmt') {
        if (r === 0) return -(pv + fv) / n;
        const factor = Math.pow(1 + r, n);
        return -(pv * factor + fv) / ((1 + r * type) * (factor - 1) / r);
    }

    if (target === 'n') {
        if (r === 0) return -(pv + fv) / pmt;
        const pmtAdj = pmt * (1 + r * type);
        const num = pmtAdj - fv * r;
        const den = pmtAdj + pv * r;
        if (num / den <= 0) return 0; // Invalid log
        return Math.log(num / den) / Math.log(1 + r);
    }

    if (target === 'i') {
        // Requires Newton-Raphson approximation
        // Setup a loop of 100 iterations.
        let rGuess = 0.05 / frequency; 
        for (let iter = 0; iter < 100; iter++) {
            const factor = Math.pow(1 + rGuess, n);
            const factorInv = 1 / factor;
            const fVal = pv + pmt * (1 + rGuess * type) * ((1 - factorInv) / rGuess) + fv * factorInv;
            if (Math.abs(fVal) < 1e-6) return rGuess * frequency * 100;
            
            // Numerical derivative
            const rGuess2 = rGuess + 1e-5;
            const factor2 = Math.pow(1 + rGuess2, n);
            const fVal2 = pv + pmt * (1 + rGuess2 * type) * ((1 - (1/factor2)) / rGuess2) + fv * (1/factor2);
            const deriv = (fVal2 - fVal) / 1e-5;
            
            rGuess = rGuess - fVal / deriv;
        }
        return rGuess * frequency * 100;
    }
    return 0;
};
```

## 2. Loan Amortization
Provides a simple monthly payment calculator and outstanding balance formula.

### Core Logic
```javascript
export const calculateLoan = (amount, rate, termYears, paymentsMade = 0, frequency = 12) => {
    const r = rate / 100 / frequency;
    const n = termYears * frequency;

    let payment = 0;
    if (r === 0) {
        payment = amount / n;
    } else {
        payment = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = payment * n;
    const totalInterest = totalPayment - amount;

    let balance = 0;
    if (paymentsMade < n) {
        if (r === 0) {
            balance = amount - (payment * paymentsMade);
        } else {
            const factorN = Math.pow(1 + r, n);
            const factorP = Math.pow(1 + r, paymentsMade);
            balance = amount * (factorN - factorP) / (factorN - 1);
        }
    }

    return {
        monthlyPayment: payment,
        totalPayment,
        totalInterest,
        outstandingBalance: Math.max(0, balance)
    };
};
```

## 3. Net Present Value (NPV) & Internal Rate of Return (IRR)
Used for cash flow analysis. IRR requires Newton-Raphson iterative solving.

### Core Logic
```javascript
export const calculateNPV = (rate, cashFlows) => {
    const r = rate / 100;
    return cashFlows.reduce((acc, flow, t) => {
        return acc + flow / Math.pow(1 + r, t);
    }, 0);
};

export const calculateIRR = (cashFlows, guess = 0.1) => {
    let r = guess;
    for (let i = 0; i < 100; i++) {
        let npv = 0;
        let dNpv = 0;
        for (let t = 0; t < cashFlows.length; t++) {
            const factor = Math.pow(1 + r, t);
            npv += cashFlows[t] / factor;
            dNpv -= t * cashFlows[t] / (Math.pow(1 + r, t + 1)); 
        }

        if (Math.abs(dNpv) < 1e-9) break;
        const newR = r - npv / dNpv;
        if (Math.abs(newR - r) < 1e-6) return newR * 100;
        r = newR;
    }
    return r * 100;
};
```

## Usage Instructions for AI Agents
1. **Identify the Need**: When a user asks for a financial calculator, determine if they need TVM, Loan, or Cash Flow (NPV/IRR).
2. **Translate safely**: Port these JavaScript functions precisely into Python, C#, Java, Go, etc. 
3. **Preserve Edge Cases**: Make sure to preserve checks for `r === 0` (zero interest loans) and invalid logarithms (`num / den <= 0`).
4. **Newton Raphson**: When porting IRR, YTM, or Interest Rate solving (`target === 'i'`), always implement an iteration cap (e.g., 100 iterations) to prevent infinite loops in cases of non-convergence.

*(End of Skill)*

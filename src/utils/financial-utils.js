export const calculateTVM = (target, values, mode = 'END', frequency = 12, interestType = 'COMPOUND', compoundingFrequency = null) => {
    let { n, i, pv, pmt, fv } = values;
    const type = mode === 'BEGIN' ? 1 : 0;

    // If compoundingFrequency is not provided, assume it equals payment frequency (Standard TVM)
    const cy = compoundingFrequency || frequency;
    const py = frequency;

    // Standard Financial Calculator Logic
    // r = Effective Rate per Payment Period
    let r;

    if (interestType === 'SIMPLE') {
        // Simple Interest logic remains based on Payment Frequency
        r = (i / 100) / py;
    } else {
        // Compound Interest
        // When CY != PY, we need to find the effective rate per payment period
        // 
        // Standard approach (used by financial calculators like TI BA II+):
        // 1. Convert nominal annual rate to effective annual rate using CY
        //    EAR = (1 + i/CY)^CY - 1
        // 2. Convert EAR to rate per payment period
        //    r = (1 + EAR)^(1/PY) - 1
        // 
        // Combined formula: r = (1 + i/CY)^(CY/PY) - 1

        const r_periodic = (i / 100) / cy;

        // Convert to Effective Rate per Payment Period
        r = Math.pow(1 + r_periodic, cy / py) - 1;
    }

    if (interestType === 'SIMPLE') {
        const t = n; // Time in periods

        // Factors
        // PV Factor: (1 + r*n)
        const pvFactor = 1 + r * n;

        // Annuity Factor (Sum of simple interest on payments)
        // END: n + r*n*(n-1)/2
        // BEGIN: n + r*n*(n+1)/2
        let pmtFactor = 0;
        if (mode === 'END') {
            pmtFactor = n + r * n * (n - 1) / 2;
        } else {
            pmtFactor = n + r * n * (n + 1) / 2;
        }

        if (target === 'fv') {
            // FV + PV(1+rn) + PMT(Factor) = 0
            return -(pv * pvFactor + pmt * pmtFactor);
        }

        if (target === 'pv') {
            // PV = -(FV + PMT*Factor) / (1+rn)
            if (pvFactor === 0) return 0; // Should not happen for positive rates
            return -(fv + pmt * pmtFactor) / pvFactor;
        }

        if (target === 'pmt') {
            // PMT = -(FV + PV(1+rn)) / Factor
            if (pmtFactor === 0) return 0;
            return -(fv + pv * pvFactor) / pmtFactor;
        }

        if (target === 'i') {
            // Solve for r (Linear)
            // FV + PV(1+rn) + PMT(n + r*k) = 0 where k is the n(n-1)/2 or similar
            // FV + PV + PV*r*n + PMT*n + PMT*r*k = 0
            // r(PV*n + PMT*k) = -(FV + PV + PMT*n)
            // r = -(FV + PV + PMT*n) / (PV*n + PMT*k)

            const k = mode === 'END' ? n * (n - 1) / 2 : n * (n + 1) / 2;
            const numerator = -(fv + pv + pmt * n);
            const denominator = pv * n + pmt * k;

            if (Math.abs(denominator) < 1e-9) return 0;
            const calculatedR = numerator / denominator;
            return calculatedR * py * 100; // Use py for simple interest annualization
        }

        if (target === 'n') {
            // Solve for n (Quadratic for PMT != 0, Linear for PMT == 0)
            // FV + PV(1+rn) + PMT(n + r*n(n-1)/2) = 0    (assuming END)
            // FV + PV + PVrn + PMT*n + PMT*r/2 * (n^2 - n) = 0
            // (PMT*r/2) n^2 + (PV*r + PMT - PMT*r/2) n + (FV + PV) = 0

            // If PMT = 0: FV + PV + PVrn = 0 => PVrn = -(FV+PV) => n = -(FV+PV)/(PV*r)
            if (Math.abs(pmt) < 1e-9) {
                if (Math.abs(pv * r) < 1e-9) return 0;
                return -(fv + pv) / (pv * r);
            }

            // Quadratic Ax^2 + Bx + C = 0
            let A, B, C;
            C = fv + pv;

            if (mode === 'END') {
                // pmtFactor = n + r/2 * (n^2 - n) = (r/2)n^2 + (1 - r/2)n
                A = pmt * r / 2;
                B = pv * r + pmt * (1 - r / 2);
            } else {
                // pmtFactor = n + r/2 * (n^2 + n) = (r/2)n^2 + (1 + r/2)n
                A = pmt * r / 2;
                B = pv * r + pmt * (1 + r / 2);
            }

            if (Math.abs(A) < 1e-9) {
                // Linear
                return -C / B;
            }

            // Quadratic formula (-B +/- sqrt(B^2 - 4AC)) / 2A
            const discriminant = B * B - 4 * A * C;
            if (discriminant < 0) return 0; // No real solution

            const sqrtD = Math.sqrt(discriminant);
            const r1 = (-B + sqrtD) / (2 * A);
            const r2 = (-B - sqrtD) / (2 * A);

            // Return positive reasonable root
            if (r1 > 0) return r1;
            if (r2 > 0) return r2;
            return 0;
        }

        return 0;
    }

    // COMPOUND (General Logic)
    if (target === 'fv') {
        if (r === 0) {
            return -(pv + pmt * n);
        }
        const factor = Math.pow(1 + r, n);
        const fvVal = -(pv * factor + pmt * (1 + r * type) * (factor - 1) / r);
        return fvVal;
    }

    if (target === 'pv') {
        if (r === 0) {
            return -(fv + pmt * n);
        }
        const factor = Math.pow(1 + r, -n);
        const pvVal = -(fv * factor + pmt * (1 + r * type) * (1 - factor) / r);
        return pvVal;
    }

    if (target === 'pmt') {
        if (r === 0) {
            return -(pv + fv) / n;
        }
        const factor = Math.pow(1 + r, n);
        const pmtVal = -(pv * factor + fv) / ((1 + r * type) * (factor - 1) / r);
        return pmtVal;
    }

    if (target === 'n') {
        if (r === 0) {
            return -(pv + fv) / pmt;
        }
        // n = log((PMT*(1+r*type) - FV*r) / (PMT*(1+r*type) + PV*r)) / log(1+r)
        const pmtAdj = pmt * (1 + r * type);
        const num = pmtAdj - fv * r;
        const den = pmtAdj + pv * r;

        // Safety check for log issues
        if (num / den <= 0) return 0;

        const nVal = Math.log(num / den) / Math.log(1 + r);
        return nVal;
    }

    if (target === 'i') {
        // Newton-Raphson approximation for I/Y (Annual Interest Rate)

        // 1. Validate Signs: There must be at least one positive and one negative cash flow
        // unless all are zero.
        // We consider PV, PMT, FV.
        // Note: This assumes standard financing where r > -100%
        const hasPositive = pv > 0 || pmt > 0 || fv > 0;
        const hasNegative = pv < 0 || pmt < 0 || fv < 0;
        const allZero = values.n > 0 && Math.abs(pv) < 1e-9 && Math.abs(pmt) < 1e-9 && Math.abs(fv) < 1e-9;

        if (!allZero && (!hasPositive || !hasNegative)) {
            return 'INVALID_SIGN';
        }

        let iGuess = 5.0; // Initial guess 5% annual

        const calculateF_Deriv = (iVal) => {
            const r_p = (iVal / 100) / cy;
            const r_eff = Math.pow(1 + r_p, cy / py) - 1;

            // If r is effectively 0
            if (Math.abs(r_eff) < 1e-9) {
                const fValue = pv + pmt * n + fv;
                return { fValue, r_eff };
            }

            const factor = Math.pow(1 + r_eff, n);
            const factorInv = 1 / factor;
            const term1 = (1 + r_eff * type);
            const geometricSeries = (1 - factorInv) / r_eff;

            const fValue = pv + pmt * term1 * geometricSeries + fv * factorInv;
            return { fValue, r_eff };
        };

        let iter = 0;
        let x0 = iGuess;

        for (iter = 0; iter < 100; iter++) {
            const y0 = calculateF_Deriv(x0).fValue;
            if (Math.abs(y0) < 1e-6) return x0;

            // Numerical Derivative
            const delta = 1e-4;
            const x1 = x0 + delta;
            const y1 = calculateF_Deriv(x1).fValue;
            const derivative = (y1 - y0) / delta;

            if (Math.abs(derivative) < 1e-9) break; // Flats

            const nextX = x0 - y0 / derivative;

            // Damping or bounds check could go here, but for now just check convergence
            if (Math.abs(nextX - x0) < 1e-7) {
                // Check if it's a root
                if (Math.abs(calculateF_Deriv(nextX).fValue) < 1e-4) return nextX;
                return NaN; // Converged to non-root
            }
            x0 = nextX;
        }

        // Final check
        if (Math.abs(calculateF_Deriv(x0).fValue) < 1e-4) return x0;
        return NaN;
    }

    return 0;
};

export const calculateLoan = (amount, rate, termYears, paymentsMade = 0, frequency = 12) => {
    const r = rate / 100 / frequency;
    const n = termYears * frequency;

    // Periodic Payment Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    let payment = 0;
    if (r === 0) {
        payment = amount / n;
    } else {
        payment = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = payment * n;
    const totalInterest = totalPayment - amount;

    // Calculate Outstanding Balance
    // B = P * ((1+r)^n - (1+r)^p) / ((1+r)^n - 1)
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
        monthlyPayment: payment, // Kept key name for compatibility, but represents periodic payment
        totalPayment,
        totalInterest,
        outstandingBalance: Math.max(0, balance)
    };
};

export const calculateBond = (faceValue, couponRate, ytm, years, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency; // Coupon payment
    const r = (ytm / 100) / frequency; // Periodic yield
    const n = years * frequency; // Total periods

    // Bond Price = C * (1 - (1+r)^-n)/r + F * (1+r)^-n
    let price = 0;
    if (r === 0) {
        price = c * n + faceValue;
    } else {
        const factor = Math.pow(1 + r, -n);
        price = c * ((1 - factor) / r) + faceValue * factor;
    }
    return price;
};

export const calculateBondYTM = (faceValue, couponRate, price, years, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency;
    const n = years * frequency;

    // Newton-Raphson to find periodic rate r
    // f(r) = c * ((1 - (1+r)^-n) / r) + faceValue * (1+r)^-n - price = 0
    let r = (couponRate / 100) / frequency; // Start guess with coupon rate
    if (r === 0) r = 0.05 / frequency;

    for (let i = 0; i < 100; i++) {
        const factor = Math.pow(1 + r, -n);
        const f = c * ((1 - factor) / r) + faceValue * factor - price;

        // Derivative: f'(r) = c * [ (n*r*(1+r)^-(n+1) - (1-(1+r)^-n)) / r^2 ] - n*faceValue*(1+r)^-(n+1)
        const dF = c * ((n * r * Math.pow(1 + r, -n - 1) - (1 - factor)) / (r * r)) - n * faceValue * Math.pow(1 + r, -n - 1);

        if (Math.abs(dF) < 1e-12) break;

        const nextR = r - f / dF;
        if (Math.abs(nextR - r) < 1e-8) {
            return nextR * frequency * 100;
        }
        r = nextR;
    }
    return r * frequency * 100;
};

export const getAmortizationSchedule = (amount, rate, termYears, frequency = 12, startDate = null) => {
    const r = rate / 100 / frequency;
    const n = termYears * frequency;
    let payment = 0;
    if (r === 0) {
        payment = amount / n;
    } else {
        payment = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const schedule = [];
    let balance = amount;

    // Parse start date if provided
    let currentDate = startDate ? new Date(startDate) : new Date();

    for (let i = 1; i <= n; i++) {
        const interest = balance * r;
        const principal = payment - interest;
        balance -= principal;

        // Calculate date for this payment
        // Assuming end of period payments, so add 1 period to start date initially?
        // Usually Amortization starts one period AFTER start date.
        // Let's increment date based on frequency.

        let dateStr = '';
        if (startDate) {
            // Format the current date FIRST (so first payment starts on start date)
            dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            // THEN increment date for the next iteration
            // This is a simple approximation. For rigorous financial calc, libraries like date-fns or moment might be better but we stick to vanilla JS.
            if (frequency === 12) {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else if (frequency === 4) {
                currentDate.setMonth(currentDate.getMonth() + 3);
            } else if (frequency === 2) {
                currentDate.setMonth(currentDate.getMonth() + 6);
            } else if (frequency === 1) {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            } else if (frequency === 26) {
                currentDate.setDate(currentDate.getDate() + 14);
            } else if (frequency === 52) {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (frequency === 365) {
                currentDate.setDate(currentDate.getDate() + 1);
            } else if (frequency === 24) {
                // Semi-monthly: 1st and 15th logic or simple 15/16 day split
                const d = currentDate.getDate();
                if (d <= 15) {
                    if (d < 15) currentDate.setDate(15);
                    else {
                        currentDate.setMonth(currentDate.getMonth() + 1);
                        currentDate.setDate(1);
                    }
                } else {
                    currentDate.setDate(currentDate.getDate() + 15);
                }
            }
        }

        schedule.push({
            month: i,
            date: dateStr,
            payment,
            interest,
            principal,
            balance: Math.max(0, balance)
        });
    }

    return schedule;
};

export const calculateNPV = (rate, cashFlows) => {
    const r = rate / 100;
    return cashFlows.reduce((acc, flow, t) => {
        return acc + flow / Math.pow(1 + r, t);
    }, 0);
};

export const calculateIRR = (cashFlows, guess = 0.1) => {
    // Newton-Raphson for IRR
    // 0 = Sum(CFt / (1+r)^t)
    let r = guess;
    for (let i = 0; i < 100; i++) {
        let npv = 0;
        let dNpv = 0;
        for (let t = 0; t < cashFlows.length; t++) {
            const factor = Math.pow(1 + r, t);
            npv += cashFlows[t] / factor;
            dNpv -= t * cashFlows[t] / (Math.pow(1 + r, t + 1)); // Derivate wrt r: -t * CFt * (1+r)^-(t+1)
        }

        if (Math.abs(dNpv) < 1e-9) break;
        const newR = r - npv / dNpv;
        if (Math.abs(newR - r) < 1e-6) return newR * 100;
        r = newR;
    }
    return r * 100;
};


export const calculateEAR = (nominal, n) => {
    // EAR = (1 + r/n)^n - 1
    const r = nominal / 100;
    const val = Math.pow(1 + r / n, n) - 1;
    return val * 100;
};

export const calculateMIRR = (cashFlows, financeRate, reinvestRate) => {
    // MIRR = (FV(positive flows, reinvestRate) / -PV(negative flows, financeRate))^(1/n) - 1
    const n = cashFlows.length - 1; // Number of periods
    const rFinance = financeRate / 100;
    const rReinvest = reinvestRate / 100;

    let pvNeg = 0;
    let fvPos = 0;

    cashFlows.forEach((flow, t) => {
        if (flow < 0) {
            pvNeg += flow / Math.pow(1 + rFinance, t);
        } else {
            fvPos += flow * Math.pow(1 + rReinvest, n - t);
        }
    });

    if (pvNeg === 0 || fvPos === 0) return 0; // Avoid division by zero or log of negative/zero

    // Formula: (FV_pos / -PV_neg)^(1/n) - 1
    const mirr = Math.pow(fvPos / -pvNeg, 1 / n) - 1;
    return mirr * 100;
};

export const calculatePaybackPeriod = (cashFlows) => {
    let cumulativeCashFlow = 0;
    for (let t = 0; t < cashFlows.length; t++) {
        cumulativeCashFlow += cashFlows[t];
        if (cumulativeCashFlow >= 0) {
            // Payback occurred in this period
            if (t === 0) return 0;
            const prevCumulative = cumulativeCashFlow - cashFlows[t];
            // Fraction of period: amount needed / amount received
            // prevCumulative is negative, so -prevCumulative is the amount needed
            return (t - 1) + (-prevCumulative / cashFlows[t]);
        }
    }
    return null; // No payback
};

export const calculateDiscountedPaybackPeriod = (cashFlows, rate) => {
    let cumulativeDCF = 0;
    const r = rate / 100;
    for (let t = 0; t < cashFlows.length; t++) {
        const dcf = cashFlows[t] / Math.pow(1 + r, t);
        cumulativeDCF += dcf;
        if (cumulativeDCF >= 0) {
            if (t === 0) return 0;
            const prevCumulative = cumulativeDCF - dcf;
            return (t - 1) + (-prevCumulative / dcf);
        }
    }
    return null;
};

export const calculateProfitabilityIndex = (cashFlows, rate) => {
    // PI = PV of Future Cash Flows / Initial Investment
    // Assuming CF0 is the initial investment (negative), we take absolute value.
    // If CF0 >= 0, it's conceptually undefined or infinite for standard projects, but we can treat CF0 as 0 investment?
    // Standard text: PI = (NPV + Initial Investment) / Initial Investment = PV_all / Initial_Investment

    const r = rate / 100;
    let initialInvestment = 0;
    let pvFuture = 0;

    // We assume period 0 is initial investment
    if (cashFlows.length > 0) {
        if (cashFlows[0] < 0) {
            initialInvestment = Math.abs(cashFlows[0]);
        } else {
            // If CF0 is positive, it's not an investment. We need to find negative flows? 
            // Simplified: PI usually refers to Time 0 investment.
            // If no initial investment, PI is undefined or not applicable.
            // Let's count CF0 as investment if negative.
            // If CF0 is positive, we treat it as a return.
            // Let's stick to: Sum of PVs of all *positive* flows / Sum of PVs of all *negative* flows (absolute)?
            // Or simpler standard definition: PV of future flows / Initial Outlay.

            // Implementation:
            // 1. PV of all flows from t=1..n
            // 2. Initial Investment = abs(CF0) if CF0 < 0
        }

        // Calculate PV of flows t=1 to n
        for (let t = 1; t < cashFlows.length; t++) {
            pvFuture += cashFlows[t] / Math.pow(1 + r, t);
        }
    }

    if (initialInvestment === 0) return 0; // Avoid division by zero

    return pvFuture / initialInvestment;
};

export const calculateBondYTC = (faceValue, couponRate, price, yearsToCall, callPrice, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency;
    const n = yearsToCall * frequency;

    // Newton-Raphson to find periodic rate r
    let r = (couponRate / 100) / frequency;
    if (r === 0) r = 0.05 / frequency;

    for (let i = 0; i < 100; i++) {
        const factor = Math.pow(1 + r, -n); // (1+r)^-n
        // Price formula using CallPrice instead of FaceValue for redemption
        const f = c * ((1 - factor) / r) + callPrice * factor - price;

        // Derivative
        // Term 1 (Coupons): c * [ (n*r*(1+r)^-(n+1) - (1-(1+r)^-n)) / r^2 ]
        // Term 2 (Redemption): -n * callPrice * (1+r)^-(n+1)
        const term1 = c * ((n * r * Math.pow(1 + r, -n - 1) - (1 - factor)) / (r * r));
        const term2 = -n * callPrice * Math.pow(1 + r, -n - 1);
        const dF = term1 + term2;

        if (Math.abs(dF) < 1e-12) break;

        const nextR = r - f / dF;
        if (Math.abs(nextR - r) < 1e-8) {
            return nextR * frequency * 100;
        }
        r = nextR;
    }
    return r * frequency * 100;
};

export const calculateBondDuration = (faceValue, couponRate, ytm, years, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency;
    const r = (ytm / 100) / frequency;
    const n = years * frequency;
    let price = 0;
    let weightedTime = 0;

    for (let t = 1; t <= n; t++) {
        const cashFlow = (t === n) ? (c + faceValue) : c;
        const pvFactor = Math.pow(1 + r, -t);
        const pv = cashFlow * pvFactor;
        price += pv;
        weightedTime += pv * (t / frequency); // t/frequency is time in years
    }

    if (price === 0) return { macaulay: 0, modified: 0 };

    const macaulay = weightedTime / price;
    const modified = macaulay / (1 + r); // Modified = Mac / (1 + y/k)

    return { macaulay, modified };
};

export const calculateBondConvexity = (faceValue, couponRate, ytm, years, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency;
    const r = (ytm / 100) / frequency;
    const n = years * frequency;
    let price = 0;
    let convexitySum = 0;

    for (let t = 1; t <= n; t++) {
        const cashFlow = (t === n) ? (c + faceValue) : c;
        const pvFactor = Math.pow(1 + r, -t);
        const pv = cashFlow * pvFactor;
        price += pv;

        // Convexity term: CF_t / (1+r)^t * t * (t+1)
        // But standard formula involves terms divided by Price * (1+y)^2
        // Let's sum [ CF_t * (t * (t+1)) / (1+r)^(t+2) ] ?
        // Or simpler: Second derivative / Price
        // dP/dy = -1/(1+y) * Sum( t * PV )
        // d2P/dy2 = 1/(1+y)^2 * Sum( t(t+1) * PV )
        // Convexity = (d2P/dy2) / P

        // Calculating Sum( t * (t+1) * PV )
        convexitySum += pv * t * (t + 1);
    }

    if (price === 0) return 0;

    // Convexity (annualized approx)
    // C = [1 / (P * (1+r)^2)] * Sum( t(t+1) * CF / (1+r)^t ) * (1/freq^2)
    // Wait, if t is periods, we need to adjust for frequency.

    const factor = 1 / (Math.pow(1 + r, 2));
    const rawConvexity = (convexitySum * factor) / price;

    // Adjust for annual
    return rawConvexity / (frequency * frequency);
};

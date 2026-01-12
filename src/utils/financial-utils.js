export const calculateTVM = (target, values, mode = 'END', frequency = 12, interestType = 'COMPOUND') => {
    let { n, i, pv, pmt, fv } = values;
    const type = mode === 'BEGIN' ? 1 : 0;

    // Periodic rate
    const r = (i / 100) / frequency;

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
            return calculatedR * frequency * 100;
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

    // COMPOUND (Existing Logic)
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
        // Formula derived from PV formula solving for n
        // PV + PMT/r * (1+r*type) * (1 - (1+r)^-n) + FV * (1+r)^-n = 0
        // This is complex, using a simplified version usually:
        // n = log((PMT*(1+r*type) - FV*r) / (PMT*(1+r*type) + PV*r)) / log(1+r)
        const pmtAdj = pmt * (1 + r * type);
        const num = pmtAdj - fv * r;
        const den = pmtAdj + pv * r;
        const nVal = Math.log(num / den) / Math.log(1 + r);
        return nVal;
    }

    if (target === 'i') {
        // Newton-Raphson approximation for periodic rate r
        // Function f(r) = PV + PMT * (1+r*type) * ((1 - (1+r)^-n) / r) + FV * (1+r)^-n

        let rGuess = 0.05 / frequency; // Initial guess 5% annual
        if (n <= 0) return 0;

        for (let iter = 0; iter < 100; iter++) {
            let fValue, fDerivative;
            const factor = Math.pow(1 + rGuess, n);
            const factorInv = 1 / factor;

            if (Math.abs(rGuess) < 1e-8) {
                // Handle near zero case
                fValue = pv + pmt * n + fv;
                fDerivative = pmt * n * (n - 1) / 2 + fv * n;
            } else {
                const term1 = (1 + rGuess * type);
                const geometricSeries = (1 - factorInv) / rGuess;

                fValue = pv + pmt * term1 * geometricSeries + fv * factorInv;

                // Numerical derivative
                const delta = 1e-5;
                const r2 = rGuess + delta;
                const factor2 = Math.pow(1 + r2, n);
                const factorInv2 = 1 / factor2;
                const term1_2 = (1 + r2 * type);
                const geometricSeries2 = (1 - factorInv2) / r2;
                const fValue2 = pv + pmt * term1_2 * geometricSeries2 + fv * factorInv2;

                fDerivative = (fValue2 - fValue) / delta;
            }

            if (Math.abs(fDerivative) < 1e-9) break;

            const nextR = rGuess - fValue / fDerivative;
            // Converged
            if (Math.abs(nextR - rGuess) < 1e-8) {
                return nextR * frequency * 100; // Return Annual %
            }
            rGuess = nextR;
        }
        return rGuess * frequency * 100;
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

export const getAmortizationSchedule = (amount, rate, termYears, frequency = 12) => {
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

    for (let i = 1; i <= n; i++) {
        const interest = balance * r;
        const principal = payment - interest;
        balance -= principal;

        schedule.push({
            month: i, // Kept key name for compatibility
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

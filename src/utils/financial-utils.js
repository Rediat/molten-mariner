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
        // 1. Calculate Periodic Rate for compounding period
        const r_periodic = (i / 100) / cy;

        // 2. Convert to Effective Rate per Payment Period
        // formula: r_eff = ((1 + r_periodic) ^ (CY / PY)) - 1
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
        // This solves for the Nominal Rate (I), not the effective rate r directly
        // Because r depends on I, CY, and PY non-linearly.

        let iGuess = 5.0; // Initial guess 5% annual
        // Or better: use rate function approximation? 
        // We'll stick to a robust NR on the annual rate percentage directly.

        const calculateF_Deriv = (iVal) => {
            const r_p = (iVal / 100) / cy;
            const r_eff = Math.pow(1 + r_p, cy / py) - 1;

            // If r is effectively 0
            if (Math.abs(r_eff) < 1e-9) {
                const fValue = pv + pmt * n + fv;
                // Derivative w.r.t iVal (rough approx or 0) - lets rely on secant/numerical if possible
                // But for simplicity in this general function, let's just do numerical derivative
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

        for (iter = 0; iter < 50; iter++) {
            const y0 = calculateF_Deriv(x0).fValue;
            if (Math.abs(y0) < 1e-6) return x0;

            // Numerical Derivative
            const delta = 1e-4;
            const x1 = x0 + delta;
            const y1 = calculateF_Deriv(x1).fValue;
            const derivative = (y1 - y0) / delta;

            if (Math.abs(derivative) < 1e-9) break; // Flats

            const nextX = x0 - y0 / derivative;
            if (Math.abs(nextX - x0) < 1e-6) return nextX;
            x0 = nextX;
        }
        return x0;
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


const calculateTVM_Current = (target, values, mode = 'END', frequency = 12) => {
    let { n, i, pv, pmt, fv } = values;
    const type = mode === 'BEGIN' ? 1 : 0;
    const r = (i / 100) / frequency; // Current logic: implicit P/Y = C/Y = frequency

    if (target === 'fv') {
        const factor = Math.pow(1 + r, n);
        const fvVal = -(pv * factor + pmt * (1 + r * type) * (factor - 1) / r);
        return fvVal;
    }
    return 0;
};

// Correct logic for P/Y != C/Y
// P/Y = payments per year, C/Y = compounding periods per year
const calculateTVM_Correct = (target, values, mode = 'END', py = 12, cy = 12) => {
    let { n, i, pv, pmt, fv } = values; // i is nominal annual rate
    const type = mode === 'BEGIN' ? 1 : 0;

    // Effective rate per payment period
    // r_eff = (1 + i/cy)^(cy/py) - 1
    const r_annual_nominal = i / 100;
    const r_periodic_compounding = r_annual_nominal / cy;
    const r_payment = Math.pow(1 + r_periodic_compounding, cy / py) - 1;

    // n is number of payments (Total periods)

    if (target === 'fv') {
        const factor = Math.pow(1 + r_payment, n);
        const fvVal = -(pv * factor + pmt * (1 + r_payment * type) * (factor - 1) / r_payment);
        return fvVal;
    }
    return 0;
};

// Example 1: $300/quarter, 6% interest compounded monthly. 5 years.
// P/Y = 4, C/Y = 12. n = 20.
console.log("--- Example 1 ---");
console.log("Input: $300/qtr, 6% comp monthly, 5 years (20 payments)");
const val1 = { n: 20, i: 6, pv: 0, pmt: 300, fv: 0 };

const fv1_correct = calculateTVM_Correct('fv', val1, 'END', 4, 12);
console.log(`Correct FV (P/Y=4, C/Y=12): ${fv1_correct.toFixed(2)}`);

// Current tool forced to P/Y=4 (Frequency=4) implies C/Y=4 (Quarterly compounding)
const fv1_current = calculateTVM_Current('fv', val1, 'END', 4);
console.log(`Current Tool (Frequency=4 -> C/Y=4): ${fv1_current.toFixed(2)}`);
console.log("Difference: Current tool underestimates because Monthly compounding (correct) > Quarterly compounding (tool assumption)");


// Example 2: $100/month, 6% interest compounded quarterly. 5 years.
// P/Y = 12, C/Y = 4. n = 60.
console.log("\n--- Example 2 ---");
console.log("Input: $100/mo, 6% comp quarterly, 5 years (60 payments)");
const val2 = { n: 60, i: 6, pv: 0, pmt: 100, fv: 0 };

const fv2_correct = calculateTVM_Correct('fv', val2, 'END', 12, 4);
console.log(`Correct FV (P/Y=12, C/Y=4): ${fv2_correct.toFixed(2)}`);

// Current tool forced to P/Y=12 (Frequency=12) implies C/Y=12 (Monthly compounding)
const fv2_current = calculateTVM_Current('fv', val2, 'END', 12);
console.log(`Current Tool (Frequency=12 -> C/Y=12): ${fv2_current.toFixed(2)}`);
console.log("Difference: Current tool overestimates because Monthly compounding (tool assumption) > Quarterly compounding (correct)");

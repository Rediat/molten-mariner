
import { calculateTVM } from '../src/utils/financial-utils.js';

// Example 1: $300/qtr, 6% interest compounded monthly. 5 years.
// P/Y = 4, C/Y = 12. n = 20.
console.log("--- Example 1 ---");
console.log("Input: $300/qtr, 6% comp monthly, 5 years (20 payments)");
const val1 = { n: 20, i: 6, pv: 0, pmt: 300, fv: 0 };

// New Signature: calculateTVM(target, values, mode, frequency(PY), interestType, compoundingFrequency(CY))
const fv1_new = calculateTVM('fv', val1, 'END', 4, 'COMPOUND', 12);
console.log(`New Tool Result (P/Y=4, C/Y=12): ${fv1_new.toFixed(2)}`);
console.log("Expected: -6942.23");

// Example 2: $100/mo, 6% interest compounded quarterly. 5 years.
// P/Y = 12, C/Y = 4. n = 60.
console.log("\n--- Example 2 ---");
console.log("Input: $100/mo, 6% comp quarterly, 5 years (60 payments)");
const val2 = { n: 60, i: 6, pv: 0, pmt: 100, fv: 0 };

const fv2_new = calculateTVM('fv', val2, 'END', 12, 'COMPOUND', 4);
console.log(`New Tool Result (P/Y=12, C/Y=4): ${fv2_new.toFixed(2)}`);
console.log("Expected: -6971.67");

// Example 3: Standard Case (Monthly/Monthly) 
console.log("\n--- Example 3 (Standard) ---");
console.log("Input: $100/mo, 6% comp monthly, 5 years");
const val3 = { n: 60, i: 6, pv: 0, pmt: 100, fv: 0 };
const fv3 = calculateTVM('fv', val3, 'END', 12, 'COMPOUND', 12);
console.log(`Result: ${fv3.toFixed(2)}`);



// Simulation of TVMCalculator logic for N Mode

let nMode = 'YEARS'; // Default
let frequency = 12; // Monthly
let values = { n: 360 }; // 30 Years * 12

console.log("--- Initial State ---");
console.log(`Mode: ${nMode}, Frequency: ${frequency}, Internal N: ${values.n}`);
console.log(`Displayed Value (should be 30): ${values.n / frequency}`);

// 1. User changes input to "5" years
console.log("\n--- User types '5' in Years Mode ---");
const inputVal = 5;
if (nMode === 'YEARS') {
    values.n = inputVal * frequency;
}
console.log(`New Internal N (should be 60): ${values.n}`);
console.log(`Displayed Value: ${values.n / frequency}`);

// 2. Switch to Periods Mode
console.log("\n--- Switch to Periods Mode ---");
nMode = 'PERIODS';
console.log(`Mode: ${nMode}`);
console.log(`Displayed Value (should be 60): ${values.n}`);

// 3. Change Frequency to Quarterly (4) while in Periods Mode (Standard behavior: N shouldn't change)
console.log("\n--- Change Frequency to 4 (Quarterly) in PERIODS Mode ---");
frequency = 4;
// No special logic in Periods mode
console.log(`Internal N (should stay 60): ${values.n}`);
console.log(`Displayed Value: ${values.n}`);

// 4. Switch back to Years Mode
console.log("\n--- Switch back to Years Mode ---");
nMode = 'YEARS';
console.log(`Displayed Value (should be 15): ${values.n / frequency}`); // 60 / 4 = 15 Years

// 5. Change Frequency to Annual (1) while in YEARS Mode (Special logic: Preserve Years)
console.log("\n--- Change Frequency to 1 (Annual) in YEARS Mode ---");
const oldFreq = frequency;
const newFreq = 1;

// Logic from component:
const currentYears = values.n / oldFreq;
const newN = currentYears * newFreq;
values.n = newN;
frequency = newFreq;

console.log(`Internal N (should be 15): ${values.n}`); // 15 years * 1 = 15
console.log(`Displayed Value (should be 15): ${values.n / frequency}`);


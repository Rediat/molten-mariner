
const { getAmortizationSchedule } = require('../src/utils/financial-utils');

console.log("--- Testing Amortization Schedule Dates ---");

// Test Case 1: Monthly (Aug 2018 Start)
const scheduleMonthly = getAmortizationSchedule(10000, 5, 1, 12, '2018-08-01');
const firstMonth = scheduleMonthly[0];
console.log(`Monthly - Period 1 Date (Expect Sep 2018): ${firstMonth.date} (${firstMonth.month})`);

// Test Case 2: Annual (Aug 2018 Start)
const scheduleAnnual = getAmortizationSchedule(10000, 5, 1, 1, '2018-08-01');
const firstYear = scheduleAnnual[0];
console.log(`Annual - Period 1 Date (Expect 2019): ${firstYear.date} (${firstYear.month})`);

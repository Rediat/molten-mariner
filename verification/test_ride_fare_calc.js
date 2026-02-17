const testRideFare = (distance, mileage, costPerLiter, serviceFactor) => {
    const totalFuelCost = distance * mileage * costPerLiter;
    const reasonablePrice = totalFuelCost * serviceFactor;
    const revenuePerKm = distance > 0 ? reasonablePrice / distance : 0;
    const netGain = reasonablePrice - totalFuelCost;
    const netGainPerKm = distance > 0 ? netGain / distance : 0;
    return { totalFuelCost, reasonablePrice, revenuePerKm, netGain, netGainPerKm };
};

const runTests = () => {
    const testCases = [
        { d: 15, m: 0.1, c: 130, s: 3, expectedFuel: 195, expectedPrice: 585, expectedRevenue: 39, expectedNetGain: 390, expectedNetGainPerKm: 26 },
        { d: 100, m: 0.1, c: 130, s: 2, expectedFuel: 1300, expectedPrice: 2600, expectedRevenue: 26, expectedNetGain: 1300, expectedNetGainPerKm: 13 },
    ];

    testCases.forEach((tc, i) => {
        const result = testRideFare(tc.d, tc.m, tc.c, tc.s);
        const fuelPassed = Math.abs(result.totalFuelCost - tc.expectedFuel) < 0.01;
        const pricePassed = Math.abs(result.reasonablePrice - tc.expectedPrice) < 0.01;
        const revenuePassed = Math.abs(result.revenuePerKm - tc.expectedRevenue) < 0.01;
        const netGainPassed = Math.abs(result.netGain - tc.expectedNetGain) < 0.01;
        const netGainPerKmPassed = Math.abs(result.netGainPerKm - tc.expectedNetGainPerKm) < 0.01;

        console.log(`Test Case ${i + 1}:`);
        console.log(`  Distance: ${tc.d}, Fuel Cost: ${tc.c}, Service Factor: ${tc.s}`);
        console.log(`  Total Fuel Cost: ${result.totalFuelCost} (Expected: ${tc.expectedFuel}) - ${fuelPassed ? 'PASS' : 'FAIL'}`);
        console.log(`  Reasonable Price: ${result.reasonablePrice} (Expected: ${tc.expectedPrice}) - ${pricePassed ? 'PASS' : 'FAIL'}`);
        console.log(`  Revenue per Km: ${result.revenuePerKm} (Expected: ${tc.expectedRevenue}) - ${revenuePassed ? 'PASS' : 'FAIL'}`);
        console.log(`  Net Gain: ${result.netGain} (Expected: ${tc.expectedNetGain}) - ${netGainPassed ? 'PASS' : 'FAIL'}`);
        console.log(`  Net Gain per Km: ${result.netGainPerKm} (Expected: ${tc.expectedNetGainPerKm}) - ${netGainPerKmPassed ? 'PASS' : 'FAIL'}`);
    });
};

runTests();

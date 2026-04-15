// Helper for Holt's Linear Exponential Smoothing
export function holtLinearUpdate(series, alpha = 0.5, beta = 0.3) {
    if (series.length < 2) return series[0] || null;
    
    let L = series[0];
    let T = series[1] - series[0];
    
    for (let i = 1; i < series.length; i++) {
        let Y = series[i];
        let lastL = L;
        L = alpha * Y + (1 - alpha) * (lastL + T);
        T = beta * (L - lastL) + (1 - beta) * T;
    }
    
    return L + T;
}

// Advanced Prediction Engine: Two-Stage Market Simulation
export function predictNextYield(data, period) {
    // 1. Minimum data check
    const validPoints = data.filter(d => 
        d.cutOffYields && d.cutOffYields[period] !== null &&
        d.amountOffered && d.amountOffered[period] !== null &&
        d.bidsReceived && d.bidsReceived[period] !== null
    );

    if (validPoints.length < 3) return null;

    // 2. Predict Future Supply (Amount Offered)
    const supplySeries = validPoints.map(d => d.amountOffered[period]).slice(-18);
    const predictedSupply = holtLinearUpdate(supplySeries, 0.4, 0.2);

    // 3. Predict Future Demand (Bids Received)
    const demandSeries = validPoints.map(d => d.bidsReceived[period]).slice(-18);
    const predictedDemand = holtLinearUpdate(demandSeries, 0.4, 0.2);

    // 4. Calculate Predicted Bid-to-Cover (BTC) Ratio
    const predictedBTC = (predictedSupply > 0) ? (predictedDemand / predictedSupply) : 1.0;

    // 5. Predict Yield Trend (Base Forecast)
    const yieldSeries = validPoints.map(d => d.cutOffYields[period]).slice(-18);
    // Use higher alpha for yields to respond to recent market shifts
    const baseYieldForecast = holtLinearUpdate(yieldSeries, 0.7, 0.3);

    // 6. Apply Demand-Supply Sensitivity Adjustment
    const demandSensitivity = -0.45; // Yield % change per unit of BTC deviation from 1.2
    const btcDeviation = predictedBTC - 1.20;
    
    const finalYield = baseYieldForecast + (btcDeviation * demandSensitivity);

    return {
        yield: finalYield,
        btc: predictedBTC,
        supply: predictedSupply,
        demand: predictedDemand
    };
}

/**
 * ARIMA(p, d, q) Time-Series Forecasting
 * 
 * Implements Auto-Regressive Integrated Moving Average model
 * for client-side inflation prediction.
 * 
 * - AR(p): Autoregressive component using OLS estimation
 * - I(d):  Differencing to achieve stationarity
 * - MA(q): Moving Average component via iterative residual estimation
 */

/**
 * Apply differencing to make the series stationary.
 * @param {number[]} series - Input time series
 * @param {number} d - Order of differencing
 * @returns {number[]} Differenced series
 */
const difference = (series, d = 1) => {
    let result = [...series];
    for (let i = 0; i < d; i++) {
        const diffed = [];
        for (let j = 1; j < result.length; j++) {
            diffed.push(result[j] - result[j - 1]);
        }
        result = diffed;
    }
    return result;
};

/**
 * Reverse differencing to recover original scale.
 * @param {number[]} diffSeries - Differenced series (forecasts)
 * @param {number[]} originalTail - Last d values from the original series before differencing
 * @param {number} d - Order of differencing
 * @returns {number[]} Un-differenced forecasts
 */
const undifference = (diffForecasts, originalTail, d = 1) => {
    let result = [...diffForecasts];
    for (let i = 0; i < d; i++) {
        const lastOriginal = originalTail[originalTail.length - 1 - i];
        const undiffed = [];
        let prev = lastOriginal;
        for (const val of result) {
            prev = prev + val;
            undiffed.push(prev);
        }
        result = undiffed;
    }
    return result;
};

/**
 * Estimate AR coefficients using OLS (Ordinary Least Squares).
 * Solves the normal equations: (X'X)^-1 X'y
 * @param {number[]} series - Stationary time series
 * @param {number} p - AR order
 * @returns {{ coefficients: number[], intercept: number }}
 */
const estimateAR = (series, p) => {
    if (series.length <= p) {
        return { coefficients: new Array(p).fill(0), intercept: 0 };
    }

    const n = series.length - p;
    // Build design matrix X and target vector y
    const X = [];
    const y = [];

    for (let i = p; i < series.length; i++) {
        const row = [1]; // intercept term
        for (let j = 1; j <= p; j++) {
            row.push(series[i - j]);
        }
        X.push(row);
        y.push(series[i]);
    }

    // Solve normal equations: (X'X) beta = X'y
    const cols = p + 1;
    const XtX = Array.from({ length: cols }, () => new Array(cols).fill(0));
    const Xty = new Array(cols).fill(0);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < cols; k++) {
                XtX[j][k] += X[i][j] * X[i][k];
            }
            Xty[j] += X[i][j] * y[i];
        }
    }

    // Add small ridge regularization for numerical stability
    for (let j = 0; j < cols; j++) {
        XtX[j][j] += 1e-8;
    }

    // Gaussian elimination with partial pivoting
    const beta = solveLinearSystem(XtX, Xty);

    return {
        intercept: beta[0],
        coefficients: beta.slice(1),
    };
};

/**
 * Solve a linear system Ax = b via Gaussian elimination with partial pivoting.
 * @param {number[][]} A - Coefficient matrix (will be modified)
 * @param {number[]} b - RHS vector (will be modified)
 * @returns {number[]} Solution vector
 */
const solveLinearSystem = (A, b) => {
    const n = b.length;
    const augmented = A.map((row, i) => [...row, b[i]]);

    for (let col = 0; col < n; col++) {
        // Partial pivoting
        let maxRow = col;
        let maxVal = Math.abs(augmented[col][col]);
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(augmented[row][col]) > maxVal) {
                maxVal = Math.abs(augmented[row][col]);
                maxRow = row;
            }
        }
        [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];

        if (Math.abs(augmented[col][col]) < 1e-12) continue;

        // Eliminate below
        for (let row = col + 1; row < n; row++) {
            const factor = augmented[row][col] / augmented[col][col];
            for (let j = col; j <= n; j++) {
                augmented[row][j] -= factor * augmented[col][j];
            }
        }
    }

    // Back substitution
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = augmented[i][n];
        for (let j = i + 1; j < n; j++) {
            sum -= augmented[i][j] * x[j];
        }
        x[i] = Math.abs(augmented[i][i]) > 1e-12 ? sum / augmented[i][i] : 0;
    }
    return x;
};

/**
 * Estimate MA coefficients from residuals using iterative OLS.
 * @param {number[]} series - Stationary series
 * @param {number} p - AR order
 * @param {number[]} arCoeffs - AR coefficients
 * @param {number} arIntercept - AR intercept
 * @param {number} q - MA order
 * @returns {{ maCoefficients: number[], residuals: number[] }}
 */
const estimateMA = (series, p, arCoeffs, arIntercept, q) => {
    if (q === 0) {
        // No MA component, just compute residuals
        const residuals = computeResiduals(series, p, arCoeffs, arIntercept, [], 0);
        return { maCoefficients: [], residuals };
    }

    // Iterative estimation: compute residuals, then regress on lagged residuals
    let maCoeffs = new Array(q).fill(0);
    let residuals = computeResiduals(series, p, arCoeffs, arIntercept, maCoeffs, q);

    // 3 iterations of refinement
    for (let iter = 0; iter < 3; iter++) {
        // Build regression of current residuals on lagged residuals
        const n = residuals.length - q;
        if (n <= 0) break;

        const X = [];
        const y = [];
        for (let i = q; i < residuals.length; i++) {
            const row = [];
            for (let j = 1; j <= q; j++) {
                row.push(residuals[i - j]);
            }
            X.push(row);
            // Target: the portion of residual not explained by AR
            y.push(residuals[i]);
        }

        // OLS for MA coefficients
        const XtX = Array.from({ length: q }, () => new Array(q).fill(0));
        const Xty = new Array(q).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < q; j++) {
                for (let k = 0; k < q; k++) {
                    XtX[j][k] += X[i][j] * X[i][k];
                }
                Xty[j] += X[i][j] * y[i];
            }
        }
        for (let j = 0; j < q; j++) XtX[j][j] += 1e-6;

        maCoeffs = solveLinearSystem(XtX, Xty);

        // Clamp MA coefficients for stability (invertibility condition)
        maCoeffs = maCoeffs.map(c => Math.max(-0.95, Math.min(0.95, c)));

        // Recompute residuals with updated MA coefficients
        residuals = computeResiduals(series, p, arCoeffs, arIntercept, maCoeffs, q);
    }

    return { maCoefficients: maCoeffs, residuals };
};

/**
 * Compute residuals given AR and MA parameters.
 */
const computeResiduals = (series, p, arCoeffs, arIntercept, maCoeffs, q) => {
    const residuals = new Array(series.length).fill(0);
    const start = Math.max(p, q);

    for (let i = start; i < series.length; i++) {
        let arPart = arIntercept;
        for (let j = 0; j < p; j++) {
            arPart += arCoeffs[j] * series[i - 1 - j];
        }
        let maPart = 0;
        for (let j = 0; j < q; j++) {
            if (i - 1 - j >= 0) {
                maPart += maCoeffs[j] * residuals[i - 1 - j];
            }
        }
        const predicted = arPart + maPart;
        residuals[i] = series[i] - predicted;
    }

    return residuals;
};

/**
 * Forecast future values using fitted ARIMA model.
 * @param {object} model - Fitted model parameters
 * @param {number[]} originalSeries - Original (undifferenced) series
 * @param {number} steps - Number of future steps to forecast
 * @returns {number[]} Forecasted values in original scale
 */
const forecast = (model, originalSeries, steps) => {
    const { p, d, q, arCoeffs, arIntercept, maCoeffs, residuals, diffSeries } = model;

    // Forecast on the differenced series
    const history = [...diffSeries];
    const resHistory = [...residuals];
    const forecasts = [];

    for (let s = 0; s < steps; s++) {
        let arPart = arIntercept;
        for (let j = 0; j < p; j++) {
            const idx = history.length - 1 - j;
            arPart += arCoeffs[j] * (idx >= 0 ? history[idx] : 0);
        }
        let maPart = 0;
        for (let j = 0; j < q; j++) {
            const idx = resHistory.length - 1 - j;
            maPart += maCoeffs[j] * (idx >= 0 ? resHistory[idx] : 0);
        }
        const nextVal = arPart + maPart;
        forecasts.push(nextVal);
        history.push(nextVal);
        resHistory.push(0); // Future residuals assumed zero
    }

    // Un-difference to get back to original scale
    const tail = originalSeries.slice(-d);
    return undifference(forecasts, tail.length > 0 ? tail : [originalSeries[originalSeries.length - 1]], d);
};

/**
 * Fit an ARIMA(p, d, q) model to a time series.
 * @param {number[]} series - Original time series values
 * @param {number} p - AR order (default: 2)
 * @param {number} d - Differencing order (default: 1)
 * @param {number} q - MA order (default: 1)
 * @returns {object} Fitted model with AIC/BIC diagnostics
 */
export const fitARIMA = (series, p = 2, d = 1, q = 1) => {
    // Step 1: Difference the series
    const diffSeries = difference(series, d);

    // Step 2: Estimate AR parameters
    const { coefficients: arCoeffs, intercept: arIntercept } = estimateAR(diffSeries, p);

    // Step 3: Estimate MA parameters
    const { maCoefficients: maCoeffs, residuals } = estimateMA(
        diffSeries, p, arCoeffs, arIntercept, q
    );

    // Compute model diagnostics
    const start = Math.max(p, q);
    const fittedResiduals = residuals.slice(start);
    const n = fittedResiduals.length;

    if (n === 0) {
        return {
            p, d, q, arCoeffs, arIntercept, maCoeffs, residuals, diffSeries,
            rmse: Infinity, mse: Infinity, aic: Infinity, bic: Infinity,
        };
    }

    const sse = fittedResiduals.reduce((sum, r) => sum + r * r, 0);
    const mse = sse / n;
    const rmse = Math.sqrt(mse);

    // Number of estimated parameters: p AR + q MA + 1 intercept + 1 variance
    const k = p + q + 2;

    // AIC = n * ln(MSE) + 2k
    // BIC = n * ln(MSE) + k * ln(n)
    const logMSE = mse > 0 ? Math.log(mse) : -Infinity;
    const aic = n * logMSE + 2 * k;
    const bic = n * logMSE + k * Math.log(n);

    return {
        p, d, q,
        arCoeffs,
        arIntercept,
        maCoeffs,
        residuals,
        diffSeries,
        rmse,
        mse,
        aic,
        bic,
    };
};

/**
 * Automatic ARIMA model selection using AIC/BIC.
 * Grid searches over candidate (p, d, q) orders and selects the model
 * with the lowest AIC.
 *
 * @param {number[]} series - Historical time series values
 * @param {{ maxP?: number, maxD?: number, maxQ?: number, criterion?: 'aic'|'bic' }} options
 * @returns {object} Best fitted model
 */
export const autoARIMA = (series, {
    maxP = 4,
    maxD = 2,
    maxQ = 3,
    criterion = 'aic',
} = {}) => {
    let bestModel = null;
    let bestScore = Infinity;
    const candidates = [];

    for (let d = 0; d <= maxD; d++) {
        const diffSeries = difference(series, d);
        // Need enough data points after differencing
        if (diffSeries.length < 10) continue;

        for (let p = 0; p <= maxP; p++) {
            for (let q = 0; q <= maxQ; q++) {
                // Skip trivial model (no AR, no MA, no differencing)
                if (p === 0 && q === 0 && d === 0) continue;
                // Need enough observations for the parameters
                if (diffSeries.length <= p + q + 2) continue;

                try {
                    const model = fitARIMA(series, p, d, q);
                    const score = criterion === 'bic' ? model.bic : model.aic;

                    if (isFinite(score)) {
                        candidates.push({
                            p, d, q,
                            aic: model.aic,
                            bic: model.bic,
                            rmse: model.rmse,
                        });

                        if (score < bestScore) {
                            bestScore = score;
                            bestModel = model;
                        }
                    }
                } catch {
                    // Skip models that fail to fit
                    continue;
                }
            }
        }
    }

    // Sort candidates by the chosen criterion for reporting
    candidates.sort((a, b) => (criterion === 'bic' ? a.bic - b.bic : a.aic - b.aic));

    // Fallback to ARIMA(1,1,0) if nothing worked
    if (!bestModel) {
        bestModel = fitARIMA(series, 1, 1, 0);
    }

    bestModel.criterion = criterion;
    bestModel.topCandidates = candidates.slice(0, 5); // Top 5 for display

    return bestModel;
};

/**
 * Run ARIMA forecast with automatic model selection via AIC/BIC.
 * @param {number[]} series - Historical time series values
 * @param {number} steps - Number of future periods to predict
 * @param {{ auto?: boolean, p?: number, d?: number, q?: number, criterion?: 'aic'|'bic' }} options
 * @returns {{ predictions: number[], model: object }}
 */
export const arimaForecast = (series, steps, { auto = true, p = 2, d = 1, q = 1, criterion = 'aic' } = {}) => {
    const model = auto
        ? autoARIMA(series, { criterion })
        : fitARIMA(series, p, d, q);

    const predictions = forecast(model, series, steps);

    // Clamp predictions to reasonable bounds for inflation (-20% to 100%)
    const clamped = predictions.map(v => Math.max(-20, Math.min(100, v)));

    return {
        predictions: clamped,
        model,
    };
};

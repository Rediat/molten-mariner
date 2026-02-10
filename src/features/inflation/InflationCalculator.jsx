import React, { useState, useMemo } from 'react';
import { TrendingUp, Info, HelpCircle, Trash2, Settings, History, ChevronDown, ChevronUp } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import { useHistory } from '../../context/HistoryContext';
import { arimaForecast } from '../../utils/arima';

// Historical inflation rates for Ethiopia (1966-2025)
// Source: https://www.worlddata.info/africa/ethiopia/inflation-rates.php
const INFLATION_DATA = [
    { year: 1966, rate: 2.58 },
    { year: 1967, rate: -2.81 },
    { year: 1968, rate: 0.60 },
    { year: 1969, rate: 2.25 },
    { year: 1970, rate: 1.18 },
    { year: 1971, rate: 0.58 },
    { year: 1972, rate: 4.09 },
    { year: 1973, rate: 7.78 },
    { year: 1974, rate: 5.89 },
    { year: 1975, rate: 12.50 },
    { year: 1976, rate: 17.59 },
    { year: 1977, rate: 15.71 },
    { year: 1978, rate: 13.27 },
    { year: 1979, rate: 16.17 },
    { year: 1980, rate: 5.77 },
    { year: 1981, rate: 5.98 },
    { year: 1982, rate: 7.78 },
    { year: 1983, rate: -2.47 },
    { year: 1984, rate: 7.00 },
    { year: 1985, rate: 18.41 },
    { year: 1986, rate: -6.14 },
    { year: 1987, rate: -7.66 },
    { year: 1988, rate: 2.24 },
    { year: 1989, rate: 9.57 },
    { year: 1990, rate: 5.15 },
    { year: 1991, rate: 20.89 },
    { year: 1992, rate: 21.03 },
    { year: 1993, rate: 10.03 },
    { year: 1994, rate: 1.22 },
    { year: 1995, rate: 13.43 },
    { year: 1996, rate: 0.87 },
    { year: 1997, rate: -6.42 },
    { year: 1998, rate: 3.63 },
    { year: 1999, rate: 7.92 },
    { year: 2000, rate: 6.21 },
    { year: 2001, rate: -5.24 },
    { year: 2002, rate: -7.23 },
    { year: 2003, rate: 15.10 },
    { year: 2004, rate: 8.63 },
    { year: 2005, rate: 6.81 },
    { year: 2006, rate: 12.31 },
    { year: 2007, rate: 15.84 },
    { year: 2008, rate: 44.39 },
    { year: 2009, rate: 36.44 },
    { year: 2010, rate: 2.80 },
    { year: 2011, rate: 18.13 },
    { year: 2012, rate: 33.25 },
    { year: 2013, rate: 24.12 },
    { year: 2014, rate: 8.14 },
    { year: 2015, rate: 7.67 },
    { year: 2016, rate: 10.68 },
    { year: 2017, rate: 7.22 },
    { year: 2018, rate: 13.83 },
    { year: 2019, rate: 15.81 },
    { year: 2020, rate: 12.59 },
    { year: 2021, rate: 20.22 },
    { year: 2022, rate: 26.56 },
    { year: 2023, rate: 33.81 },
    { year: 2024, rate: 28.67 },
    { year: 2025, rate: 23.10 },
];

const MIN_YEAR = INFLATION_DATA[0].year;
const MAX_YEAR = INFLATION_DATA[INFLATION_DATA.length - 1].year;
const FORECAST_END = 2050;
const FORECAST_STEPS = FORECAST_END - MAX_YEAR;

const InflationCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    const [startYear, setStartYear] = useState(2025);
    const [endYear, setEndYear] = useState(new Date().getFullYear() + 4);
    const [amount, setAmount] = useState(1000);
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showPrediction, setShowPrediction] = useState(false);
    const [showInterpretation, setShowInterpretation] = useState(false);

    // Auto ARIMA: selects best (p,d,q) via AIC
    const { predictions, modelInfo } = useMemo(() => {
        const series = INFLATION_DATA.map(d => d.rate);
        // Auto-select best order using AIC criterion
        const { predictions: rawPreds, model } = arimaForecast(series, FORECAST_STEPS, { auto: true, criterion: 'aic' });

        const preds = rawPreds.map((rate, i) => ({
            year: MAX_YEAR + 1 + i,
            rate: parseFloat(rate.toFixed(2)),
        }));

        return {
            predictions: preds,
            modelInfo: {
                order: `(${model.p}, ${model.d}, ${model.q})`,
                p: model.p,
                d: model.d,
                q: model.q,
                rmse: model.rmse.toFixed(2),
                aic: model.aic.toFixed(2),
                bic: model.bic.toFixed(2),
                arCoeffs: model.arCoeffs.map(c => c.toFixed(4)),
                maCoeffs: model.maCoeffs.map(c => c.toFixed(4)),
                topCandidates: model.topCandidates || [],
            },
        };
    }, []);

    const handleCalculate = () => {
        const sYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, Math.round(startYear)));
        const eYear = Math.max(MIN_YEAR, Math.min(FORECAST_END, Math.round(endYear)));

        if (sYear >= eYear) {
            setResult({ error: 'End year must be after start year' });
            return;
        }

        // Combine historical + predicted data
        const allData = [...INFLATION_DATA, ...predictions];

        // Calculate cumulative inflation between years
        let cumulativeMultiplier = 1;
        const yearlyBreakdown = [];

        for (let y = sYear + 1; y <= eYear; y++) {
            const entry = allData.find(d => d.year === y);
            if (entry) {
                const factor = 1 + entry.rate / 100;
                cumulativeMultiplier *= factor;
                yearlyBreakdown.push({ year: y, rate: entry.rate, cumulative: ((cumulativeMultiplier - 1) * 100), predicted: y > MAX_YEAR });
            }
        }

        const adjustedValue = amount * cumulativeMultiplier;
        const cumulativeRate = (cumulativeMultiplier - 1) * 100;
        const avgAnnualRate = yearlyBreakdown.length > 0
            ? (Math.pow(cumulativeMultiplier, 1 / yearlyBreakdown.length) - 1) * 100
            : 0;

        // Purchasing power: how much would you need today to match the amount from startYear
        const purchasingPower = amount / cumulativeMultiplier;

        const isPredicted = eYear > MAX_YEAR;

        const res = {
            startYear: sYear,
            endYear: eYear,
            amount,
            adjustedValue,
            cumulativeRate,
            avgAnnualRate,
            purchasingPower,
            yearlyBreakdown,
            isPredicted,
        };

        setResult(res);
        addToHistory('INFLATION', { startYear: sYear, endYear: eYear, amount }, res);
    };

    const handleClear = () => {
        setStartYear(2025);
        setEndYear(new Date().getFullYear() + 4);
        setAmount(1000);
        setResult(null);
        setShowPrediction(false);
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-2 shrink-0">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Inflation Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        Ethiopian Birr · 1966–{FORECAST_END}
                    </p>
                </div>
                <div className="flex gap-1.5">
                    <button
                        onClick={() => setShowPrediction(!showPrediction)}
                        className={`flex items-center justify-center px-2 py-1 rounded-full transition-all text-[9px] font-bold uppercase tracking-wider ${showPrediction ? 'bg-amber-600/20 text-amber-400 ring-1 ring-amber-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="ARIMA Forecast"
                    >
                        Forecast
                    </button>
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Ethiopian Birr Inflation</p>
                    <p className="text-[11px] leading-relaxed mb-2">
                        Historical data from 1966–{MAX_YEAR}. Future predictions ({MAX_YEAR + 1}–{FORECAST_END}) use an
                        <strong className="text-amber-400"> ARIMA{modelInfo.order}</strong> model,
                        auto-selected via <strong className="text-cyan-400">AIC</strong> from {modelInfo.topCandidates.length}+ candidates.
                    </p>
                    <ul className="text-[11px] leading-relaxed list-disc list-inside space-y-1">
                        <li>Average annual inflation (1966–2025): ~10.6%</li>
                        <li>Overall price increase since 1966: ~29,915%</li>
                        <li>Model RMSE: {modelInfo.rmse}%</li>
                    </ul>
                    <div className="mt-2 bg-neutral-900/50 rounded-lg p-2">
                        <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-1">Best Model: ARIMA{modelInfo.order} (via AIC)</p>
                        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-neutral-400">
                            <span>AIC: <span className="text-cyan-400 font-bold">{modelInfo.aic}</span></span>
                            <span>BIC: <span className="text-cyan-400 font-bold">{modelInfo.bic}</span></span>
                            <span>AR({modelInfo.arCoeffs.length}): [{modelInfo.arCoeffs.join(', ')}]</span>
                            <span>MA({modelInfo.maCoeffs.length}): [{modelInfo.maCoeffs.join(', ')}]</span>
                        </div>
                        {modelInfo.topCandidates.length > 1 && (
                            <div className="mt-1.5 pt-1.5 border-t border-neutral-700">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Top 5 Candidates by AIC</p>
                                {modelInfo.topCandidates.slice(0, 5).map((c, i) => (
                                    <div key={i} className={`text-[9px] font-mono flex justify-between ${i === 0 ? 'text-primary-400' : 'text-neutral-500'}`}>
                                        <span>{i === 0 ? '►' : ' '} ({c.p},{c.d},{c.q})</span>
                                        <span>AIC: {c.aic.toFixed(1)}</span>
                                        <span>BIC: {c.bic.toFixed(1)}</span>
                                        <span>RMSE: {c.rmse.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-[9px] text-neutral-500 mt-2">
                        Source: worlddata.info/africa/ethiopia/inflation-rates.php
                    </p>
                </div>
            )}

            {/* ARIMA Prediction Table */}
            {showPrediction && (
                <div className="bg-gradient-to-r from-amber-900/20 to-neutral-800/50 border border-amber-500/30 rounded-xl p-3 mb-4 text-left">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-amber-400 text-[10px] uppercase tracking-wider">
                            ARIMA{modelInfo.order} Forecast
                        </p>
                        <span className="text-[8px] text-neutral-500 font-mono bg-neutral-900/60 px-1.5 py-0.5 rounded">
                            RMSE: {modelInfo.rmse}%
                        </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                        <div className="grid grid-cols-5 gap-1.5">
                            {predictions.map(p => (
                                <div key={p.year} className="bg-neutral-900/60 rounded-lg p-1.5 text-center">
                                    <p className="text-[9px] text-neutral-500 font-bold">{p.year}</p>
                                    <p className={`text-[11px] font-black ${p.rate >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {p.rate.toFixed(1)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-[9px] text-neutral-500 mt-2 italic">
                        ARIMA(p={modelInfo.arCoeffs.length}, d=1, q={modelInfo.maCoeffs.length}) · {FORECAST_STEPS}-year forecast
                    </p>
                </div>
            )}

            {/* Scrollable Content: Inputs + Results */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">

                {/* Input Fields */}
                <div className="space-y-1">
                    {/* Start Year */}
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label className="text-sm font-bold text-white block leading-tight text-left">Start Year</label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">{MIN_YEAR}–{MAX_YEAR}</span>
                            </div>
                            <FormattedNumberInput
                                value={startYear}
                                onChange={(e) => setStartYear(parseFloat(e.target.value.replace(/,/g, '')) || MIN_YEAR)}
                                decimals={0}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                                placeholder="2000"
                            />
                        </div>
                    </div>

                    {/* End Year */}
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label className="text-sm font-bold text-white block leading-tight text-left">End Year</label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">{MIN_YEAR}–{FORECAST_END} (ARIMA)</span>
                            </div>
                            <FormattedNumberInput
                                value={endYear}
                                onChange={(e) => setEndYear(parseFloat(e.target.value.replace(/,/g, '')) || MAX_YEAR)}
                                decimals={0}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                                placeholder="2024"
                            />
                        </div>
                    </div>

                    {/* Amount in Birr */}
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-primary-500/50 ring-1 ring-primary-500/10">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label className="text-sm font-bold text-primary-400 block leading-tight text-left">Amount (Birr)</label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Value in Start Year</span>
                            </div>
                            <FormattedNumberInput
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-primary-400 font-black min-w-0 flex-1"
                                placeholder="1,000"
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                {result && !result.error && (
                    <div className="mt-1.5 bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2.5 space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                Results {result.isPredicted && <span className="text-amber-400">(ARIMA predicted)</span>}
                            </span>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                            >
                                <History size={12} /> View History
                            </button>
                        </div>

                        {/* Adjusted Value - Compact */}
                        <div className="bg-neutral-900/80 rounded-lg p-2 border border-primary-500/30 text-center">
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                {formatCurrency(result.amount)} Birr in {result.startYear} equals
                            </p>
                            <p className="text-xl font-black text-primary-400 leading-tight">
                                {formatCurrency(result.adjustedValue)}
                            </p>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                Birr in {result.endYear}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Cumulative</p>
                                <p className={`text-sm font-black ${result.cumulativeRate >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {result.cumulativeRate.toFixed(2)}%
                                </p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Avg/Year</p>
                                <p className="text-sm font-black text-amber-400">
                                    {result.avgAnnualRate.toFixed(2)}%
                                </p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Buy Power</p>
                                <p className="text-sm font-black text-emerald-400">
                                    {formatCurrency(result.purchasingPower)}
                                </p>
                            </div>
                        </div>

                        {result.yearlyBreakdown.length > 0 && (
                            <div className="pt-1.5 border-t border-neutral-700">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Year-by-Year</p>
                                <div className="max-h-32 overflow-y-auto scrollbar-hide space-y-0.5">
                                    {result.yearlyBreakdown.map(yb => (
                                        <div key={yb.year} className={`flex justify-between items-center px-2 py-0.5 rounded text-[10px] ${yb.predicted ? 'bg-amber-900/20' : 'bg-neutral-900/30'}`}>
                                            <span className={`font-bold ${yb.predicted ? 'text-amber-400' : 'text-neutral-400'}`}>
                                                {yb.year}{yb.predicted ? '*' : ''}
                                            </span>
                                            <span className={`font-black ${yb.rate >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {yb.rate >= 0 ? '+' : ''}{yb.rate.toFixed(2)}%
                                            </span>
                                            <span className="text-neutral-500 font-mono">
                                                cum: {yb.cumulative.toFixed(1)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {result.isPredicted && (
                                    <p className="text-[8px] text-amber-400/70 mt-1 italic">* ARIMA-predicted values</p>
                                )}
                            </div>
                        )}

                        {/* Plain-English Interpretation */}
                        <div className="pt-1.5 border-t border-neutral-700">
                            <button
                                onClick={() => setShowInterpretation(!showInterpretation)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Interpretation</p>
                                {showInterpretation
                                    ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                                    : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                                }
                            </button>

                            {showInterpretation && (
                                <div className="mt-2 space-y-2 text-left">
                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        Inflation-adjusted purchasing power at the beginning of {result.endYear}:{' '}
                                        <strong className="text-primary-400">{formatCurrency(result.purchasingPower)} Birr</strong>.
                                        Increase in prices in {result.endYear - result.startYear} years:{' '}
                                        <strong className="text-red-400">{result.cumulativeRate.toFixed(2)}%</strong>.
                                        Decrease in value in {result.endYear - result.startYear} years:{' '}
                                        <strong className="text-red-400">{((1 - 1 / (1 + result.cumulativeRate / 100)) * 100).toFixed(2)}%</strong>.
                                    </p>

                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        Conversely, if an item had a price of{' '}
                                        <strong className="text-white">{formatCurrency(result.amount)} Birr</strong> in {result.startYear},
                                        it will cost{' '}
                                        <strong className="text-primary-400">{formatCurrency(result.adjustedValue)} Birr</strong> at
                                        the beginning of {result.endYear} due to inflation.
                                    </p>

                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        This corresponds to an average depreciation of{' '}
                                        <strong className="text-amber-400">
                                            {formatCurrency((result.adjustedValue - result.amount) / (result.endYear - result.startYear))} Birr
                                        </strong>{' '}
                                        per year. The amount of the price increase corresponds to the
                                        overall inflation over this period.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Error */}
                {result && result.error && (
                    <div className="mt-1.5 bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-center">
                        <p className="text-red-400 font-bold text-sm">{result.error}</p>
                    </div>
                )}

            </div> {/* End scrollable content */}

            {/* Action Buttons */}
            <div className="mt-1.5 flex gap-1.5 shrink-0">
                <button
                    onClick={handleClear}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="Inflation"
                title="Inflation"
            />
        </div >
    );
};

export default InflationCalculator;

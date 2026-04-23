import React, { useState, useMemo, useRef } from 'react';
import { TrendingUp, Info, HelpCircle, Trash2, Settings, History, ChevronDown, ChevronUp } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import { useHistory } from '../../context/HistoryContext';
import { arimaForecast } from '../../utils/arima';

import { INFLATION_DATA, MIN_YEAR, MAX_YEAR, FORECAST_END } from './data';

const FORECAST_STEPS = FORECAST_END - MAX_YEAR;

const InflationCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    const [startYear, setStartYear] = useState(2025);
    const [endYear, setEndYear] = useState(new Date().getFullYear() + 4);
    const [endYearMode, setEndYearMode] = useState('YEAR'); // 'YEAR' or 'DURATION'
    const [amount, setAmount] = useState(1000);
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showPrediction, setShowPrediction] = useState(false);
    const [showInterpretation, setShowInterpretation] = useState(false);

    // Refs for input focus
    const amountRef = useRef(null);
    const startYearRef = useRef(null);
    const endYearRef = useRef(null);

    const clearAmount = () => {
        setAmount(null);
        setResult(null);
        setTimeout(() => amountRef.current?.focus(), 0);
    };

    const clearYear = (setter, ref) => {
        setter(null);
        setResult(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    // Auto ARIMA: selects best (p,d,q) via AIC
    const { predictions, modelInfo, usaModelInfo } = useMemo(() => {
        const etSeries = INFLATION_DATA.map(d => d.rate);
        const usaSeries = INFLATION_DATA.map(d => d.usaRate).filter(v => v !== null && v !== undefined);
        
        // Forecast ET
        const { predictions: etRawPreds, model: etModel } = arimaForecast(etSeries, FORECAST_STEPS, { auto: true, criterion: 'aic' });
        
        // Forecast USA
        const { predictions: usaRawPreds, model: usaModel } = arimaForecast(usaSeries, FORECAST_STEPS, { auto: true, criterion: 'aic' });

        const preds = etRawPreds.map((rate, i) => ({
            year: MAX_YEAR + 1 + i,
            rate: parseFloat(rate.toFixed(2)),
            usaRate: parseFloat(usaRawPreds[i].toFixed(2)),
        }));

        const getModelStats = (model) => ({
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
        });

        return {
            predictions: preds,
            modelInfo: getModelStats(etModel),
            usaModelInfo: getModelStats(usaModel),
        };
    }, []);

    // Overall historical statistics
    const { overallIncrease, avgAnnualInflation } = useMemo(() => {
        let multiplier = 1;
        for (let i = 0; i < INFLATION_DATA.length - 1; i++) {
            multiplier *= (1 + INFLATION_DATA[i].rate / 100);
        }
        return {
            overallIncrease: (multiplier - 1) * 100,
            avgAnnualInflation: (Math.pow(multiplier, 1 / (INFLATION_DATA.length - 1)) - 1) * 100,
        };
    }, []);

    const handleCalculate = () => {
        const sYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, Math.round(startYear)));
        const eYear = Math.max(MIN_YEAR, Math.min(FORECAST_END, Math.round(endYear)));

        if (sYear >= eYear) {
            setResult({ error: 'End year must be after start year' });
            return;
        }

        const allData = [...INFLATION_DATA, ...predictions];
        let cumulativeMultiplier = 1;
        const yearlyBreakdown = [];

        for (let y = sYear; y < eYear; y++) {
            const entry = allData.find(d => d.year === y);
            if (entry) {
                const factor = 1 + entry.rate / 100;
                cumulativeMultiplier *= factor;
                yearlyBreakdown.push({ 
                    year: y, 
                    rate: entry.rate, 
                    usaRate: entry.usaRate,
                    cumulative: ((cumulativeMultiplier - 1) * 100), 
                    predicted: y > MAX_YEAR 
                });
            }
        }

        const amt = amount || 0;
        const adjustedValue = amt * cumulativeMultiplier;
        const cumulativeRate = (cumulativeMultiplier - 1) * 100;
        const avgAnnualRate = yearlyBreakdown.length > 0
            ? (Math.pow(cumulativeMultiplier, 1 / yearlyBreakdown.length) - 1) * 100
            : 0;
        const purchasingPower = amt / cumulativeMultiplier;
        const isPredicted = yearlyBreakdown.some(yb => yb.predicted);

        const res = {
            startYear: sYear,
            endYear: eYear,
            amount: amt,
            adjustedValue,
            cumulativeRate,
            avgAnnualRate,
            purchasingPower,
            yearlyBreakdown,
            isPredicted,
        };

        setResult(res);
        addToHistory('INFLATION', { startYear: sYear, endYear: eYear, amount: amt }, res);
    };

    const handleClear = () => {
        setStartYear(2025);
        setEndYear(new Date().getFullYear() + 4);
        setEndYearMode('YEAR');
        setAmount(1000);
        setResult(null);
        setShowPrediction(false);
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Pinned Header & Inputs */}
            <div className="sticky top-0 z-30 bg-neutral-800 -mx-6 -mt-6 px-6 pt-5 pb-3 shrink-0">
                {/* Header */}
                <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                        <TrendingUp className="w-4 h-4 text-primary-500 shrink-0" />
                        <div className="min-w-0">
                            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">
                                Inflation Calculator
                            </h1>
                            <p className="text-neutral-500 text-[8px] font-medium uppercase tracking-wider text-left">
                                ETB · 1966–{FORECAST_END}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setShowPrediction(!showPrediction)}
                            className={`flex items-center justify-center px-2 py-1 rounded-full transition-all text-[8px] font-bold uppercase tracking-wider ${showPrediction ? 'bg-amber-600/20 text-amber-400 ring-1 ring-amber-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
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

                {/* Input Fields (Pinned) */}
                <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-1">
                        {/* Start Year */}
                        <div className="bg-neutral-800/40 rounded-lg p-2.5 border border-transparent hover:border-neutral-700">
                            <div className="flex justify-between items-center gap-1 min-w-0">
                                <label 
                                    onClick={() => clearYear(setStartYear, startYearRef)}
                                    className="text-sm font-bold text-white leading-tight cursor-pointer hover:text-primary-400 whitespace-nowrap shrink-0 text-left"
                                >
                                    Start Year
                                </label>
                                <FormattedNumberInput
                                    ref={startYearRef}
                                    value={startYear}
                                    onChange={(e) => {
                                        const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                        setStartYear(val);
                                        setResult(null);
                                    }}
                                    decimals={0}
                                    useGrouping={false}
                                    className="bg-transparent text-right text-[15px] font-mono focus:outline-none text-white flex-1 min-w-0"
                                    placeholder="2000"
                                />
                            </div>
                        </div>

                        {/* End Year */}
                        <div className="bg-neutral-800/40 rounded-lg p-2.5 border border-transparent hover:border-neutral-700">
                            <div className="flex justify-between items-center gap-1 min-w-0">
                                <div className="flex items-center gap-1 shrink-0">
                                    <label 
                                        onClick={() => clearYear(setEndYear, endYearRef)}
                                        className="text-sm font-bold text-white leading-tight cursor-pointer hover:text-primary-400 whitespace-nowrap text-left"
                                    >
                                        End Year
                                    </label>
                                    <button
                                        onClick={() => setEndYearMode(m => m === 'YEAR' ? 'DURATION' : 'YEAR')}
                                        className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 hover:text-white uppercase shrink-0 leading-none"
                                    >
                                        {endYearMode === 'YEAR' ? 'Yr' : 'Dur'}
                                    </button>
                                </div>
                                <FormattedNumberInput
                                    ref={endYearRef}
                                    value={endYearMode === 'YEAR' ? endYear : (endYear - new Date().getFullYear())}
                                    onChange={(e) => {
                                        const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                        if (endYearMode === 'YEAR') {
                                            setEndYear(val);
                                        } else {
                                            setEndYear(val === null ? null : (new Date().getFullYear() + val));
                                        }
                                        setResult(null);
                                    }}
                                    decimals={0}
                                    useGrouping={false}
                                    className="bg-transparent text-right text-[15px] font-mono focus:outline-none text-white flex-1 min-w-0"
                                    placeholder={endYearMode === 'YEAR' ? "2024" : "4"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount in Birr */}
                    <div className="bg-neutral-800/40 rounded-lg p-2.5 border border-primary-500/30 ring-1 ring-primary-500/5">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <label 
                                onClick={clearAmount}
                                className="text-sm font-bold text-primary-400 cursor-pointer hover:text-white shrink-0 whitespace-nowrap text-left"
                            >
                                Amount (ETB)
                            </label>
                            <FormattedNumberInput
                                ref={amountRef}
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setAmount(val);
                                    setResult(null);
                                }}
                                decimals={2}
                                className="bg-transparent text-right text-[15px] font-mono focus:outline-none text-primary-400 font-black flex-1 min-w-0"
                                placeholder="1,000"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content: Results + Extra Info */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-4 pb-2">
                
                {/* Explanation Panel */}
                {showExplanation && (
                    <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                        <p className="font-bold text-primary-400 mb-1">Ethiopian Birr Inflation</p>
                        <p className="text-[11px] leading-relaxed mb-2">
                            Historical data from 1966–{MAX_YEAR}. Future predictions ({MAX_YEAR + 1}–{FORECAST_END}) use 
                            <strong className="text-amber-400"> ARIMA</strong> models (ET: {modelInfo.order}, USA: {usaModelInfo.order}), 
                            auto-selected via <strong className="text-cyan-400">AIC</strong>.
                        </p>
                        <ul className="text-[11px] leading-relaxed list-disc list-inside space-y-1">
                            <li>Average annual inflation ({MIN_YEAR}–{MAX_YEAR}): ~{avgAnnualInflation.toFixed(1)}% <span className="text-primary-500/70 ml-1 text-[9px] font-bold uppercase">(CAGR)</span></li>
                            <li>Overall price increase since {MIN_YEAR}: ~{overallIncrease.toLocaleString('en-US', { maximumFractionDigits: 0 })}%</li>
                            <li>Model RMSE: {modelInfo.rmse}%</li>
                        </ul>
                        <p className="text-[9px] text-neutral-500 mt-2 leading-relaxed italic">
                            * Statistics are dynamically calculated using the geometric mean (Compound Annual Growth Rate) for financial accuracy based on verified WorldData records.
                        </p>
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
                                        <p className="text-[9px] text-neutral-500 font-bold mb-1">{p.year}</p>
                                        <div className="space-y-0.5">
                                            <div className="flex justify-between items-center gap-1">
                                                <span className="text-[7px] text-neutral-600 font-bold uppercase">ET</span>
                                                <span className={`text-[10px] font-black ${p.rate >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {p.rate.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center gap-1 border-t border-neutral-800/50 pt-0.5">
                                                <span className="text-[7px] text-neutral-600 font-bold uppercase">US</span>
                                                <span className={`text-[10px] font-black ${p.usaRate >= 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                                                    {p.usaRate.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-[9px] text-neutral-500 mt-2 italic">
                            ARIMA(p={modelInfo.arCoeffs.length}, d=1, q={modelInfo.maCoeffs.length}) · {FORECAST_STEPS}-year forecast
                        </p>
                    </div>
                )}

                {/* Results */}
                {result && !result.error && (
                    <div className="mt-3 bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2 space-y-1">
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
                        <div className="bg-neutral-900/80 rounded-lg p-1.5 border border-primary-500/30 text-center">
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider leading-tight">
                                {formatCurrency(result.amount)} Birr on Jan 1, {result.startYear} equals
                            </p>
                            <p className="text-xl font-black text-primary-400 leading-none py-0.5">
                                {formatCurrency(result.adjustedValue)}
                            </p>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider leading-tight">
                                Birr on Jan 1, {result.endYear}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-1">
                            <div className="bg-neutral-900/50 rounded-lg p-1.5">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Cumulative</p>
                                <p className={`text-sm font-black ${result.cumulativeRate >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {result.cumulativeRate.toFixed(2)}%
                                </p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-1.5">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Avg/Year</p>
                                <p className="text-sm font-black text-amber-400">
                                    {result.avgAnnualRate.toFixed(2)}%
                                </p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-1.5">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Buy Power</p>
                                <p className="text-sm font-black text-emerald-400">
                                    {formatCurrency(result.purchasingPower)}
                                </p>
                            </div>
                        </div>

                        {result.yearlyBreakdown.length > 0 && (
                            <div className="pt-1 border-t border-neutral-700">
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Year-by-Year Breakdown</p>
                                <div className="flex justify-between items-center px-2 py-1.5 text-[9px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-800/50 mb-1">
                                    <span className="w-10">Year</span>
                                    <span className="w-14 text-right">ET Rate</span>
                                    <span className="w-14 text-right">US Rate</span>
                                    <span className="w-20 text-right">Cumulative</span>
                                </div>
                                <div className="max-h-[180px] overflow-y-auto space-y-1">
                                    {result.yearlyBreakdown.map(yb => (
                                        <div key={yb.year} className={`flex justify-between items-center px-2 py-1.5 rounded-lg text-xs ${yb.predicted ? 'bg-amber-900/25 border border-amber-500/20' : 'bg-neutral-900/40 border border-transparent'}`}>
                                            <span className={`font-mono font-bold w-10 text-[11px] ${yb.predicted ? 'text-amber-400' : 'text-neutral-300'}`}>
                                                {yb.year}{yb.predicted ? '*' : ''}
                                            </span>
                                            <span className={`font-mono font-bold ${yb.rate >= 0 ? 'text-red-400' : 'text-emerald-400'} w-14 text-right text-[11px]`}>
                                                {yb.rate >= 0 ? '+' : ''}{yb.rate.toFixed(1)}%
                                            </span>
                                            <span className="text-neutral-400 font-mono font-bold text-[11px] w-14 text-right">
                                                {yb.usaRate !== undefined && yb.usaRate !== null ? `${yb.usaRate.toFixed(1)}%` : '—'}
                                            </span>
                                            <span className="text-neutral-500 font-mono font-bold text-[11px] w-20 text-right">
                                                {yb.cumulative.toFixed(1)}%
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
                                        Inflation-adjusted purchasing power on <strong className="text-white">Jan 1, {result.endYear}</strong>:{' '}
                                        <strong className="text-primary-400">{formatCurrency(result.purchasingPower)} Birr</strong>.
                                        Rise in prices over {result.endYear - result.startYear} years:{' '}
                                        <strong className="text-red-400">{result.cumulativeRate.toFixed(2)}%</strong>.
                                        Drop in currency value over {result.endYear - result.startYear} years:{' '}
                                        <strong className="text-red-400">{((1 - 1 / (1 + result.cumulativeRate / 100)) * 100).toFixed(2)}%</strong>.
                                    </p>

                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        In other words, if an item cost{' '}
                                        <strong className="text-white">{formatCurrency(result.amount)} Birr</strong> on Jan 1, {result.startYear},
                                        it will cost{' '}
                                        <strong className="text-primary-400">{formatCurrency(result.adjustedValue)} Birr</strong> by
                                        Jan 1, {result.endYear} because of inflation.
                                    </p>

                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        This corresponds to an average price increase of{' '}
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

import React, { useState, useMemo } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Target, TrendingUp, Wallet, PiggyBank, Calculator, Info } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';

// Constants
const FREQUENCIES = [
    { label: 'Annually (1)', value: 1 },
    { label: 'Semi-Annually (2)', value: 2 },
    { label: 'Quarterly (4)', value: 4 },
    { label: 'Monthly (12)', value: 12 },
    { label: 'Semi-Monthly (24)', value: 24 },
    { label: 'Bi-Weekly (26)', value: 26 },
    { label: 'Weekly (52)', value: 52 },
];

const SOLVE_MODES = [
    { id: 'pmt', label: 'Annuity Only', desc: 'No initial deposit, regular payments only', icon: TrendingUp },
    { id: 'pv', label: 'Lump Sum Only', desc: 'Single deposit, no regular payments', icon: Wallet },
    { id: 'combo', label: 'PV + Annuity', desc: 'Combine initial deposit with payments', icon: PiggyBank },
];

const GoalPlanner = () => {
    const { addToHistory } = useHistory();

    // Core state
    const [mode, setMode] = useState('END');
    const [frequency, setFrequency] = useState(12);
    const [solveMode, setSolveMode] = useState('pmt'); // 'pmt', 'pv', or 'combo'

    // Input values
    const [targetFV, setTargetFV] = useState(1000000); // Target Future Value
    const [years, setYears] = useState(30); // Years to goal
    const [rate, setRate] = useState(10); // Annual interest rate
    const [pvRatio, setPvRatio] = useState(0); // For combo mode: % of total contributions from PV (0-100)
    const [knownPV, setKnownPV] = useState(0); // For combo mode: known PV amount
    const [knownPMT, setKnownPMT] = useState(0); // For combo mode: known PMT amount

    // Results
    const [results, setResults] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Calculate effective rate per period
    const getPeriodicRate = () => {
        return Math.pow(1 + rate / 100, 1 / frequency) - 1;
    };

    // Calculate FV factor for PV
    const getFVFactorPV = (r, n) => {
        return Math.pow(1 + r, n);
    };

    // Calculate FV factor for PMT (annuity)
    const getFVFactorPMT = (r, n, isBegin) => {
        if (Math.abs(r) < 1e-9) return n;
        const factor = (Math.pow(1 + r, n) - 1) / r;
        return isBegin ? factor * (1 + r) : factor;
    };

    const handleCalculate = () => {
        try {
            const r = getPeriodicRate();
            const n = years * frequency;
            const isBegin = mode === 'BEGIN';

            const fvFactorPV = getFVFactorPV(r, n);
            const fvFactorPMT = getFVFactorPMT(r, n, isBegin);

            let calculatedPV = 0;
            let calculatedPMT = 0;
            let totalContributions = 0;
            let totalInterestEarned = 0;

            if (solveMode === 'pmt') {
                // Solve for PMT only (PV = 0)
                calculatedPV = 0;
                calculatedPMT = targetFV / fvFactorPMT;
                totalContributions = calculatedPMT * n;
            } else if (solveMode === 'pv') {
                // Solve for PV only (PMT = 0)
                calculatedPMT = 0;
                calculatedPV = targetFV / fvFactorPV;
                totalContributions = calculatedPV;
            } else if (solveMode === 'combo') {
                // Combo mode: Calculate based on ratio or known values
                if (knownPV > 0 && knownPMT === 0) {
                    // User specified PV, solve for PMT
                    calculatedPV = knownPV;
                    const remainingFV = targetFV - (calculatedPV * fvFactorPV);
                    calculatedPMT = remainingFV > 0 ? remainingFV / fvFactorPMT : 0;
                    totalContributions = calculatedPV + (calculatedPMT * n);
                } else if (knownPMT > 0 && knownPV === 0) {
                    // User specified PMT, solve for PV
                    calculatedPMT = knownPMT;
                    const pmtContributionToFV = calculatedPMT * fvFactorPMT;
                    calculatedPV = pmtContributionToFV < targetFV
                        ? (targetFV - pmtContributionToFV) / fvFactorPV
                        : 0;
                    totalContributions = calculatedPV + (calculatedPMT * n);
                } else if (pvRatio > 0 && pvRatio < 100) {
                    // Use ratio: pvRatio% comes from PV, (100-pvRatio)% from PMT contributions
                    // We need to solve: PV * fvFactorPV + PMT * fvFactorPMT = targetFV
                    // And: PV / (PV + PMT*n) = pvRatio/100
                    // This is a system of equations. Let's solve it:
                    // Let totalContrib = PV + PMT*n
                    // PV = totalContrib * (pvRatio/100)
                    // PMT = totalContrib * (1 - pvRatio/100) / n
                    // Substitute into FV equation:
                    // totalContrib * (pvRatio/100) * fvFactorPV + totalContrib * (1-pvRatio/100)/n * fvFactorPMT = targetFV
                    // totalContrib * [(pvRatio/100)*fvFactorPV + (1-pvRatio/100)/n * fvFactorPMT] = targetFV

                    const pvPortion = pvRatio / 100;
                    const pmtPortion = 1 - pvPortion;
                    const combinedFactor = (pvPortion * fvFactorPV) + ((pmtPortion / n) * fvFactorPMT);
                    totalContributions = targetFV / combinedFactor;
                    calculatedPV = totalContributions * pvPortion;
                    calculatedPMT = (totalContributions * pmtPortion) / n;
                } else {
                    // Default: Equal weight to PV and total PMT contributions
                    // PV = PMT * n (total contributions split 50/50)
                    // Solve: PV * fvFactorPV + PMT * fvFactorPMT = targetFV
                    // And: PV = PMT * n
                    // Substitute: PMT * n * fvFactorPV + PMT * fvFactorPMT = targetFV
                    // PMT * (n * fvFactorPV + fvFactorPMT) = targetFV
                    const combinedFactor = (n * fvFactorPV) + fvFactorPMT;
                    calculatedPMT = targetFV / combinedFactor;
                    calculatedPV = calculatedPMT * n;
                    totalContributions = calculatedPV + (calculatedPMT * n);
                }
            }

            totalInterestEarned = targetFV - totalContributions;

            // Calculate actionable insights
            const insights = calculateInsights(calculatedPMT, calculatedPV, totalContributions, totalInterestEarned, years, frequency, rate);

            const newResults = {
                pv: Math.abs(calculatedPV),
                pmt: Math.abs(calculatedPMT),
                annualPMT: Math.abs(calculatedPMT) * frequency,
                totalContributions: Math.abs(totalContributions),
                totalInterest: Math.abs(totalInterestEarned),
                targetFV,
                years,
                rate,
                frequency,
                mode,
                solveMode,
                insights
            };

            setResults(newResults);

            // Add to history
            addToHistory('GoalPlanner',
                { targetFV, years, rate, frequency, mode, solveMode, pvRatio, knownPV, knownPMT },
                newResults
            );

        } catch (error) {
            console.error('Calculation error:', error);
            setResults({ error: 'Calculation Error' });
        }
    };

    // Calculate actionable insights
    const calculateInsights = (pmt, pv, totalContrib, totalInterest, yrs, freq, annualRate) => {
        const freqLabels = { 1: 'year', 2: 'six months', 4: 'quarter', 12: 'month', 24: 'half-month', 26: 'two weeks', 52: 'week' };
        const freqLabel = freqLabels[freq] || 'period';

        // Calculate interest as percentage of final value
        const interestPercent = ((totalInterest / (totalContrib + totalInterest)) * 100).toFixed(0);

        // Calculate daily equivalent
        const dailySavings = (pmt * freq) / 365;

        // Calculate what happens if you wait 5 years
        const r = Math.pow(1 + annualRate / 100, 1 / freq) - 1;
        const shorterYears = Math.max(1, yrs - 5);
        const shorterN = shorterYears * freq;
        const isBegin = mode === 'BEGIN';
        const fvFactorShorter = getFVFactorPMT(r, shorterN, isBegin);
        const pmtIfWait5Years = targetFV / fvFactorShorter;
        const increasedPmt = pmtIfWait5Years - pmt;
        const increasePercent = ((increasedPmt / pmt) * 100).toFixed(0);

        return {
            freqLabel,
            interestPercent,
            dailySavings,
            pmtIfWait5Years,
            increasedPmt,
            increasePercent,
            shorterYears
        };
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary-500" />
                        Goal Planner
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        PV + Annuity to Target FV
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title="Show Explanation"
                        >
                            <Info className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setMode(m => m === 'END' ? 'BEGIN' : 'END')}
                            className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-primary-500 hover:bg-neutral-700 transition-all"
                        >
                            {mode}
                        </button>
                    </div>
                    <select
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-neutral-300 focus:outline-none"
                    >
                        {FREQUENCIES.map(f => (
                            <option key={f.value} value={f.value}>
                                {f.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Financial Goal Planner</p>
                    <p className="text-[11px] leading-relaxed">
                        Calculate exactly how much to save to reach your target. Choose between
                        regular payments only, a one-time lump sum, or a combination of both.
                        Get clear action steps based on your timeline and expected returns.
                    </p>
                </div>
            )}

            {/* Solve Mode Selector */}
            <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl mb-4">
                {SOLVE_MODES.map(sm => (
                    <button
                        key={sm.id}
                        onClick={() => setSolveMode(sm.id)}
                        className={`flex-1 py-2 px-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${solveMode === sm.id
                            ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                            : 'bg-transparent text-neutral-500 hover:bg-neutral-800'}`}
                    >
                        <sm.icon className="w-3.5 h-3.5" />
                        <span>{sm.label}</span>
                    </button>
                ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-1.5 flex-1">
                {/* Target FV */}
                <div className="group relative bg-neutral-800/40 rounded-lg p-2 transition-all duration-300 border border-primary-500/50 ring-1 ring-primary-500/10 bg-neutral-800/60">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col items-start text-left shrink-0">
                            <label className="text-xs font-bold text-primary-400 whitespace-nowrap">Target FV</label>
                            <span className="text-[8px] uppercase tracking-tighter text-neutral-500 font-bold whitespace-nowrap">Goal Amount</span>
                        </div>
                        <FormattedNumberInput
                            value={targetFV}
                            onChange={(e) => setTargetFV(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                            decimals={0}
                            className="bg-transparent text-right text-base font-mono focus:outline-none w-full placeholder-neutral-700 text-primary-400 font-black"
                            placeholder="1,000,000"
                        />
                    </div>
                </div>

                {/* Years */}
                <div className="group relative bg-neutral-800/40 rounded-lg p-2 transition-all duration-300 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col items-start text-left shrink-0">
                            <label className="text-xs font-bold text-neutral-300 whitespace-nowrap">Years</label>
                            <span className="text-[8px] uppercase tracking-tighter text-neutral-500 font-bold whitespace-nowrap">Time to Goal</span>
                        </div>
                        <FormattedNumberInput
                            value={years}
                            onChange={(e) => setYears(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                            decimals={0}
                            className="bg-transparent text-right text-base font-mono focus:outline-none w-full placeholder-neutral-700 text-white"
                            placeholder="30"
                        />
                    </div>
                </div>

                {/* Interest Rate */}
                <div className="group relative bg-neutral-800/40 rounded-lg p-2 transition-all duration-300 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col items-start text-left shrink-0">
                            <label className="text-xs font-bold text-neutral-300 whitespace-nowrap">I/Y %</label>
                            <span className="text-[8px] uppercase tracking-tighter text-neutral-500 font-bold whitespace-nowrap">Annual Rate</span>
                        </div>
                        <FormattedNumberInput
                            value={rate}
                            onChange={(e) => setRate(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                            decimals={2}
                            className="bg-transparent text-right text-base font-mono focus:outline-none w-full placeholder-neutral-700 text-white"
                            placeholder="10"
                        />
                    </div>
                </div>

                {/* Combo Mode Options */}
                {solveMode === 'combo' && (
                    <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-700 space-y-2">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            Specify one: PV, PMT, or Ratio
                        </p>

                        {/* Known PV */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col items-start text-left">
                                <label className="text-xs font-bold text-neutral-400">Initial PV</label>
                                <span className="text-[8px] uppercase tracking-tighter text-neutral-600 font-bold">Lump Sum</span>
                            </div>
                            <FormattedNumberInput
                                value={knownPV}
                                onChange={(e) => {
                                    setKnownPV(parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setKnownPMT(0);
                                    setPvRatio(0);
                                }}
                                decimals={0}
                                className="bg-neutral-800 rounded-lg px-2 py-1 text-right text-sm font-mono focus:outline-none w-24 placeholder-neutral-700 text-white"
                                placeholder="0"
                            />
                        </div>

                        {/* Known PMT */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col items-start text-left">
                                <label className="text-xs font-bold text-neutral-400">Fixed PMT</label>
                                <span className="text-[8px] uppercase tracking-tighter text-neutral-600 font-bold">Per Period</span>
                            </div>
                            <FormattedNumberInput
                                value={knownPMT}
                                onChange={(e) => {
                                    setKnownPMT(parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setKnownPV(0);
                                    setPvRatio(0);
                                }}
                                decimals={0}
                                className="bg-neutral-800 rounded-lg px-2 py-1 text-right text-sm font-mono focus:outline-none w-24 placeholder-neutral-700 text-white"
                                placeholder="0"
                            />
                        </div>

                        {/* PV Ratio */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col items-start text-left">
                                <label className="text-xs font-bold text-neutral-400">PV Ratio %</label>
                                <span className="text-[8px] uppercase tracking-tighter text-neutral-600 font-bold">% from Lump Sum</span>
                            </div>
                            <FormattedNumberInput
                                value={pvRatio}
                                onChange={(e) => {
                                    setPvRatio(parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setKnownPV(0);
                                    setKnownPMT(0);
                                }}
                                decimals={0}
                                className="bg-neutral-800 rounded-lg px-2 py-1 text-right text-sm font-mono focus:outline-none w-24 placeholder-neutral-700 text-white"
                                placeholder="0"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            {results && !results.error && (
                <div className="mt-4 bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {results.pv > 0 && (
                            <div className="bg-neutral-900/50 rounded-lg p-2.5">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Initial Deposit (PV)</p>
                                <p className="text-lg font-black text-primary-400">
                                    ${results.pv.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        )}
                        {results.pmt > 0 && (
                            <div className="bg-neutral-900/50 rounded-lg p-2.5">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Payment (PMT)</p>
                                <p className="text-lg font-black text-green-400">
                                    ${results.pmt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-[9px] text-neutral-500">
                                    ${results.annualPMT.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-700">
                        <div>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Total Contributions</p>
                            <p className="text-sm font-bold text-white">
                                ${results.totalContributions.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Interest Earned</p>
                            <p className="text-sm font-bold text-emerald-400">
                                ${results.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>

                    {/* Actionable Recommendations */}
                    {results.insights && results.pmt > 0 && (
                        <div className="pt-2 border-t border-neutral-700">
                            <p className="text-[9px] font-bold text-primary-400 uppercase tracking-wider mb-2">
                                📋 Your Action Plan
                            </p>
                            <div className="text-[10px] text-neutral-300 space-y-2">
                                <div className="bg-neutral-900/50 rounded-lg p-2">
                                    <p className="font-bold text-white mb-1">✅ What to do:</p>
                                    <p>Save <span className="text-green-400 font-bold">${results.pmt.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span> every {results.insights.freqLabel} for {results.years} years.</p>
                                    <p className="text-neutral-500 mt-1">That's just ${results.insights.dailySavings.toFixed(2)}/day</p>
                                </div>

                                <div className="bg-neutral-900/50 rounded-lg p-2">
                                    <p className="font-bold text-white mb-1">💰 What you'll get:</p>
                                    <p><span className="text-emerald-400 font-bold">{results.insights.interestPercent}%</span> of your final ${results.targetFV.toLocaleString()} comes from compound interest — money working for you.</p>
                                </div>

                                {results.years > 5 && (
                                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-2">
                                        <p className="font-bold text-amber-400 mb-1">⚠️ Don't delay:</p>
                                        <p>Waiting 5 years means paying <span className="text-amber-400 font-bold">${Math.abs(results.insights.increasedPmt).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> more per {results.insights.freqLabel} ({results.insights.increasePercent}% increase).</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {results.insights && results.pv > 0 && results.pmt === 0 && (
                        <div className="pt-2 border-t border-neutral-700">
                            <p className="text-[9px] font-bold text-primary-400 uppercase tracking-wider mb-2">
                                📋 Your Action Plan
                            </p>
                            <div className="text-[10px] text-neutral-300 space-y-2">
                                <div className="bg-neutral-900/50 rounded-lg p-2">
                                    <p className="font-bold text-white mb-1">✅ What to do:</p>
                                    <p>Invest <span className="text-primary-400 font-bold">${results.pv.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> today and let it grow for {results.years} years.</p>
                                </div>

                                <div className="bg-neutral-900/50 rounded-lg p-2">
                                    <p className="font-bold text-white mb-1">💰 What you'll get:</p>
                                    <p>Your money will grow <span className="text-emerald-400 font-bold">{(results.targetFV / results.pv).toFixed(1)}x</span> through compound interest alone.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => {
                        setTargetFV(1000000);
                        setYears(30);
                        setRate(10);
                        setPvRatio(0);
                        setKnownPV(0);
                        setKnownPMT(0);
                        setResults(null);
                    }}
                    className="w-1/4 bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1.5 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    CLR
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>
        </div>
    );
};

export default GoalPlanner;

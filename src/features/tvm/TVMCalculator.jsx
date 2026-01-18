import React, { useState } from 'react';
import { calculateTVM } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Settings2, Info } from 'lucide-react';
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
    { label: 'Daily (365)', value: 365 },
];

const DEFAULT_VALUES = {
    n: 360,
    i: 6,
    pv: -100000,
    pmt: 0,
    fv: 0
};

// Helper: Calculate TVM factors for algebraic solving
const calcTVMFactors = (rate, n, isBeginMode) => {
    const type = isBeginMode ? 1 : 0;
    const pow = Math.pow(1 + rate, n);

    let fvFactorPmt = 0;
    if (Math.abs(rate) < 1e-9) {
        fvFactorPmt = -n;
    } else {
        fvFactorPmt = -((pow - 1) / rate) * (type ? (1 + rate) : 1);
    }

    return {
        termPV: 1 - pow,
        termPMT: n + fvFactorPmt
    };
};


const TVMCalculator = () => {
    const { addToHistory } = useHistory();

    // Core state
    const [mode, setMode] = useState('END');
    const [target, setTarget] = useState('fv');
    const [frequency, setFrequency] = useState(12);
    const [compoundingFrequency, setCompoundingFrequency] = useState(12);
    const [isCompoundingManuallySet, setIsCompoundingManuallySet] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [nMode, setNMode] = useState('YEARS');
    const [interestType, setInterestType] = useState('COMPOUND');
    const [showExplanation, setShowExplanation] = useState(false);

    const [values, setValues] = useState(DEFAULT_VALUES);
    const [calculatedValue, setCalculatedValue] = useState(null);
    const [totalInterest, setTotalInterest] = useState(0);

    // Determine effective sign for TI based on context
    const getEffectiveTI = (ti, calcValues, targetField) => {
        let effectiveTI = ti;
        if (targetField !== 'pv' && targetField !== 'pmt') {
            if (calcValues.pv > 0 && ti > 0) effectiveTI = -ti;
        } else if (calcValues.pmt < 0 && ti > 0) {
            effectiveTI = -ti;
        }
        return effectiveTI;
    };

    // Solve for PV or PMT using TI constraint
    const solveWithTIConstraint = (targetField, calcValues, effectiveTI, effectiveCY) => {
        const rPeriodic = (calcValues.i / 100) / effectiveCY;
        const { termPV, termPMT } = calcTVMFactors(rPeriodic, calcValues.n, mode === 'BEGIN');

        if (targetField === 'pv') {
            if (Math.abs(termPV) > 1e-9) {
                return (effectiveTI - calcValues.pmt * termPMT) / termPV;
            }
            return 0;
        }

        if (targetField === 'pmt') {
            let ti = effectiveTI;
            if (calcValues.pv > 0 && ti > 0) ti = -ti;
            if (Math.abs(termPMT) > 1e-9) {
                return (ti - calcValues.pv * termPV) / termPMT;
            }
            return 0;
        }

        return null;
    };

    const handleCalculate = () => {
        try {
            const effectiveCY = showAdvanced ? compoundingFrequency : frequency;
            let result;
            let calcValues = { ...values };
            const useTIConstraint = totalInterest !== null && totalInterest !== 0 && target !== 'totalInterest';

            if (useTIConstraint) {
                const effectiveTI = getEffectiveTI(totalInterest, calcValues, target);

                if (target === 'pv' || target === 'pmt') {
                    result = solveWithTIConstraint(target, calcValues, effectiveTI, effectiveCY);
                    calcValues[target] = result;
                    calcValues.fv = effectiveTI - calcValues.pv - calcValues.pmt * calcValues.n;
                } else {
                    // Target is I, N, or FV - derive PMT or FV to satisfy TI
                    const adjustedTI = calcValues.pv > 0 && effectiveTI > 0 ? -effectiveTI : effectiveTI;

                    if (Math.abs(calcValues.fv) < 0.01 && calcValues.n !== 0) {
                        calcValues.pmt = (adjustedTI - calcValues.pv - calcValues.fv) / calcValues.n;
                        setValues(prev => ({ ...prev, pmt: parseFloat(calcValues.pmt.toFixed(2)) }));
                    } else {
                        calcValues.fv = adjustedTI - calcValues.pv - calcValues.pmt * calcValues.n;
                        setValues(prev => ({ ...prev, fv: parseFloat(calcValues.fv.toFixed(2)) }));
                    }
                    result = calculateTVM(target, calcValues, mode, frequency, interestType, effectiveCY);
                }
            } else if (target === 'totalInterest') {
                // Calculate PMT first if needed
                if (Math.abs(calcValues.pmt) < 0.01) {
                    calcValues.pmt = calculateTVM('pmt', calcValues, mode, frequency, interestType, effectiveCY);
                    setValues(prev => ({ ...prev, pmt: parseFloat(calcValues.pmt.toFixed(2)) }));
                }
                result = calcValues.pv + calcValues.pmt * calcValues.n + calcValues.fv;
            } else {
                result = calculateTVM(target, calcValues, mode, frequency, interestType, effectiveCY);
            }

            // Update state
            setCalculatedValue(result);

            if (target === 'totalInterest') {
                setTotalInterest(result);
                addToHistory('TVM', { ...calcValues, mode, target: 'TI', frequency, compoundingFrequency: effectiveCY, interestType },
                    { pmt: calcValues.pmt, totalInterest: result });
            } else {
                const finalValues = { ...calcValues, [target]: result };
                const currentInterest = finalValues.pv + finalValues.pmt * finalValues.n + finalValues.fv;
                setTotalInterest(currentInterest);
                setValues(prev => ({ ...prev, [target]: parseFloat(result.toFixed(6)) }));
                addToHistory('TVM', { ...calcValues, mode, target, frequency, compoundingFrequency: effectiveCY, interestType },
                    { [target]: result, totalInterest: currentInterest });
            }
        } catch (error) {
            setCalculatedValue("Error");
        }
    };

    const handleChange = (field, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        let numericVal = parseFloat(cleanVal) || 0;

        if (field === 'n' && nMode === 'YEARS') {
            numericVal *= frequency;
        }

        setValues(prev => ({ ...prev, [field]: numericVal }));
        if (field !== target) setCalculatedValue(null);
    };

    const handleInterestInput = (val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const newInterest = parseFloat(cleanVal);
        setTotalInterest(isNaN(newInterest) ? 0 : newInterest);
        setCalculatedValue(null);
    };

    const handleFrequencyChange = (newFreq) => {
        if (nMode === 'YEARS') {
            const currentYears = values.n / frequency;
            setValues(prev => ({ ...prev, n: currentYears * newFreq }));
        }
        setFrequency(newFreq);
        if (!showAdvanced || !isCompoundingManuallySet) {
            setCompoundingFrequency(newFreq);
        }
    };

    const getDisplayValue = (field) => {
        if (field === 'n' && nMode === 'YEARS') return values.n / frequency;
        if (field === 'totalInterest') return totalInterest;
        if (field === 'totalPMT') return totalPMT;
        return values[field];
    };

    // Calculate Total PMT (PMT × N)
    const totalPMT = values.pmt * values.n;

    // Field definitions
    const fields = [
        { id: 'n', label: nMode === 'YEARS' ? 'Years' : 'N', sub: nMode === 'YEARS' ? 'N / Frequency' : 'Total Periods', hasNToggle: true },
        { id: 'i', label: 'I/Y', sub: 'Annual %' },
        { id: 'pv', label: 'PV', sub: 'Pres Val' },
        { id: 'pmt', label: 'PMT', sub: 'Payment' },
        { id: 'fv', label: 'FV', sub: 'Fut Val' },
        { id: 'totalInterest', label: 'TI', sub: 'Total Interest' },
        { id: 'totalPMT', label: 'ΣPmt', sub: 'Total PMT (PMT × N)', isReadOnly: true },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        TVM Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">Time Value of Money</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title="Show Info"
                        >
                            <Info className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => {
                                setShowAdvanced(!showAdvanced);
                                if (showAdvanced) {
                                    setCompoundingFrequency(frequency);
                                    setIsCompoundingManuallySet(false);
                                }
                            }}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showAdvanced ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title={showAdvanced ? "Simple Mode" : "Advanced Mode"}
                        >
                            <Settings2 className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setInterestType(t => t === 'COMPOUND' ? 'SIMPLE' : 'COMPOUND')}
                            className={`flex items-center gap-1 border rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all ${interestType === 'SIMPLE' ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/20' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
                        >
                            {interestType}
                        </button>
                        <button
                            onClick={() => setMode(m => m === 'END' ? 'BEGIN' : 'END')}
                            className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-primary-500 hover:bg-neutral-700 transition-all"
                        >
                            {mode}
                        </button>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <select
                            value={frequency}
                            onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-neutral-300 focus:outline-none"
                        >
                            {FREQUENCIES.map(f => (
                                <option key={f.value} value={f.value}>
                                    {showAdvanced ? `P/Y: ${f.label.split('(')[0]}` : f.label}
                                </option>
                            ))}
                        </select>
                        {showAdvanced && (
                            <select
                                value={compoundingFrequency}
                                onChange={(e) => { setCompoundingFrequency(Number(e.target.value)); setIsCompoundingManuallySet(true); }}
                                className={`bg-neutral-800 rounded-lg px-2 py-0.5 text-[10px] font-bold focus:outline-none border ${isCompoundingManuallySet ? 'text-primary-400 border-primary-500/50' : 'text-neutral-500 border-neutral-700'}`}
                            >
                                {FREQUENCIES.map(f => (
                                    <option key={f.value} value={f.value}>C/Y: {f.label.split('(')[0]}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Time Value of Money (TVM)</p>
                    <p className="text-[11px] leading-relaxed">
                        Solve for any variable in the TVM equation: N (periods), I/Y (interest rate),
                        PV (present value), PMT (payment), or FV (future value). Supports both
                        compound and simple interest with customizable payment frequencies.
                    </p>
                </div>
            )}

            {/* Target Selector */}
            <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl mb-4 overflow-x-auto scrollbar-hide">
                {fields.filter(f => !f.isReadOnly && f.id !== 'totalInterest').map(field => (
                    <button
                        key={field.id}
                        onClick={() => setTarget(field.id)}
                        className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${target === field.id ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-transparent text-neutral-500 hover:bg-neutral-800'}`}
                    >
                        {field.label}
                    </button>
                ))}
            </div>

            {/* Inputs */}
            <div className="space-y-2 flex-1">
                {fields.map(field => (
                    <div key={field.id} className={`group relative bg-neutral-800/40 rounded-xl p-3 transition-all duration-300 border ${field.isReadOnly ? 'border-neutral-700/50 bg-neutral-900/30' : target === field.id ? 'border-primary-500/50 ring-1 ring-primary-500/10 bg-neutral-800/60' : 'border-transparent hover:border-neutral-700'}`}>
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col items-start text-left">
                                <div className="flex items-center gap-2">
                                    <label className={`text-sm font-bold transition-colors ${field.isReadOnly ? 'text-neutral-500' : target === field.id ? 'text-primary-400' : 'text-neutral-300'}`}>
                                        {field.label}
                                    </label>
                                    {field.hasNToggle && (
                                        <button
                                            onClick={() => setNMode(m => m === 'YEARS' ? 'PERIODS' : 'YEARS')}
                                            className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-0.5 text-[9px] font-bold text-neutral-400 hover:text-white uppercase tracking-wider"
                                        >
                                            {nMode === 'YEARS' ? 'In Years' : 'In Periods'}
                                        </button>
                                    )}
                                </div>
                                <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">{field.sub}</span>
                            </div>
                            <div className="relative flex-1">
                                {field.isReadOnly ? (
                                    <span className="block text-right text-lg font-mono text-neutral-400 w-full">
                                        {getDisplayValue(field.id)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                ) : target === field.id && calculatedValue === null ? (
                                    <span className="text-neutral-600 italic text-xs font-bold px-2">CALC...</span>
                                ) : (
                                    <FormattedNumberInput
                                        value={getDisplayValue(field.id)}
                                        onChange={(e) => field.id === 'totalInterest' ? handleInterestInput(e.target.value) : handleChange(field.id, e.target.value)}
                                        decimals={field.id === 'n' ? 0 : 2}
                                        forceFixedOnFocus={field.id === 'totalInterest'}
                                        className={`bg-transparent text-right text-lg font-mono focus:outline-none w-full placeholder-neutral-700 transition-colors ${target === field.id ? 'text-primary-400 font-black' : 'text-white'}`}
                                        placeholder="0"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => {
                        setValues({ n: 0, i: 0, pv: 0, pmt: 0, fv: 0 });
                        setTotalInterest(0);
                        setCalculatedValue(null);
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

export default TVMCalculator;

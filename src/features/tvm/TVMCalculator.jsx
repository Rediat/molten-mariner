import React, { useState } from 'react';
import { calculateTVM } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Settings2 } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';

const TVMCalculator = () => {
    const { addToHistory } = useHistory();
    const [mode, setMode] = useState('END');
    const [target, setTarget] = useState('fv');
    const [frequency, setFrequency] = useState(12); // P/Y
    const [compoundingFrequency, setCompoundingFrequency] = useState(12); // C/Y
    const [isCompoundingManuallySet, setIsCompoundingManuallySet] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [nMode, setNMode] = useState('YEARS'); // 'YEARS' or 'PERIODS'

    const [values, setValues] = useState({
        n: 360, // Default 30 years monthly
        i: 6,   // 6% Annual
        pv: -100000,
        pmt: 0,
        fv: 0
    });

    const [calculatedValue, setCalculatedValue] = useState(null);
    const [totalInterest, setTotalInterest] = useState(null);
    const [interestType, setInterestType] = useState('COMPOUND');

    const handleCalculate = () => {
        try {
            const effectiveCY = showAdvanced ? compoundingFrequency : frequency;
            let result;
            let currentInterest;

            // Clone values to work with locally
            let calcValues = { ...values };

            // Determine if we need to use the Total Interest constraint
            const useTIConstraint = totalInterest !== null && target !== 'totalInterest';

            if (useTIConstraint) {
                // TI = PV + PMT*N + FV (combined with TVM constraint)
                let effectiveTI = totalInterest;

                // Smart Sign Logic based on target and existing values
                if (target !== 'pv' && target !== 'pmt') {
                    if (calcValues.pv > 0 && totalInterest > 0) effectiveTI = -totalInterest;
                } else {
                    if (calcValues.pmt < 0 && totalInterest > 0) effectiveTI = -totalInterest;
                }

                if (target === 'pv') {
                    // Algebraically solve for PV using TI constraint and TVM equation
                    let r_periodic = (calcValues.i / 100) / effectiveCY;
                    let n = calcValues.n;
                    let type = mode === 'BEGIN' ? 1 : 0;
                    let pow = Math.pow(1 + r_periodic, n);

                    let fv_factor_pv = -pow;
                    let fv_factor_pmt = 0;
                    if (Math.abs(r_periodic) < 1e-9) {
                        fv_factor_pmt = -n;
                    } else {
                        fv_factor_pmt = -((pow - 1) / r_periodic) * (type ? (1 + r_periodic) : 1);
                    }

                    let term_pv = 1 + fv_factor_pv; // = 1 - (1+r)^n
                    let term_pmt = n + fv_factor_pmt;

                    // PV = (TI - PMT * term_pmt) / term_pv
                    if (Math.abs(term_pv) > 1e-9) {
                        result = (effectiveTI - calcValues.pmt * term_pmt) / term_pv;
                    } else {
                        result = 0;
                    }

                    calcValues.pv = result;
                    calcValues.fv = effectiveTI - result - calcValues.pmt * n;
                }
                else if (target === 'pmt') {
                    // Algebraically solve for PMT using TI constraint
                    let r_periodic = (calcValues.i / 100) / effectiveCY;
                    let n = calcValues.n;
                    let type = mode === 'BEGIN' ? 1 : 0;
                    let pow = Math.pow(1 + r_periodic, n);

                    let fv_factor_pv = -pow;
                    let fv_factor_pmt = 0;
                    if (Math.abs(r_periodic) < 1e-9) {
                        fv_factor_pmt = -n;
                    } else {
                        fv_factor_pmt = -((pow - 1) / r_periodic) * (type ? (1 + r_periodic) : 1);
                    }

                    let term_pv = 1 + fv_factor_pv;
                    let term_pmt = n + fv_factor_pmt;

                    if (calcValues.pv > 0 && effectiveTI > 0) effectiveTI = -effectiveTI;

                    if (Math.abs(term_pmt) > 1e-9) {
                        result = (effectiveTI - calcValues.pv * term_pv) / term_pmt;
                    } else {
                        result = 0;
                    }

                    calcValues.pmt = result;
                    calcValues.fv = effectiveTI - calcValues.pv - result * n;
                }
                else {
                    // Target is I, N, or FV - derive variable to satisfy TI then solve
                    if (calcValues.pv > 0 && effectiveTI > 0) effectiveTI = -effectiveTI;

                    if (Math.abs(calcValues.fv) < 0.01 && calcValues.n !== 0) {
                        const impliedPMT = (effectiveTI - calcValues.pv - calcValues.fv) / calcValues.n;
                        calcValues.pmt = impliedPMT;
                        setValues(prev => ({ ...prev, pmt: parseFloat(impliedPMT.toFixed(2)) }));
                    } else {
                        const impliedFV = effectiveTI - calcValues.pv - calcValues.pmt * calcValues.n;
                        calcValues.fv = impliedFV;
                        setValues(prev => ({ ...prev, fv: parseFloat(impliedFV.toFixed(2)) }));
                    }

                    result = calculateTVM(target, calcValues, mode, frequency, interestType, effectiveCY);
                }
            } else {
                if (target !== 'totalInterest') {
                    result = calculateTVM(target, calcValues, mode, frequency, interestType, effectiveCY);
                }
            }

            if (target === 'totalInterest') {
                // If PMT is zero/empty, calculate it first before computing TI
                if (Math.abs(calcValues.pmt) < 0.01) {
                    const calculatedPMT = calculateTVM('pmt', calcValues, mode, frequency, interestType, effectiveCY);
                    calcValues.pmt = calculatedPMT;
                    setValues(prev => ({ ...prev, pmt: parseFloat(calculatedPMT.toFixed(2)) }));
                }

                result = calcValues.pv + calcValues.pmt * calcValues.n + calcValues.fv;
                currentInterest = result;
                setCalculatedValue(result);
                setTotalInterest(result);

                addToHistory('TVM', {
                    ...calcValues,
                    mode,
                    target: 'TI',
                    frequency,
                    compoundingFrequency: effectiveCY,
                    interestType
                }, { pmt: calcValues.pmt, totalInterest: result });

            } else {
                setCalculatedValue(result);

                const finalValues = { ...calcValues, [target]: result };
                currentInterest = finalValues.pv + finalValues.pmt * finalValues.n + finalValues.fv;
                setTotalInterest(currentInterest);


                addToHistory('TVM', {
                    ...calcValues,
                    mode,
                    target,
                    frequency,
                    compoundingFrequency: effectiveCY,
                    interestType
                }, { [target]: result, totalInterest: currentInterest });

                setValues(prev => ({
                    ...prev,
                    [target]: parseFloat(result.toFixed(6))
                }));
            }
        } catch (error) {
            setCalculatedValue("Error");
        }
    };

    const handleChange = (field, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        let numericVal = parseFloat(cleanVal) || 0;

        if (field === 'n' && nMode === 'YEARS') {
            numericVal = numericVal * frequency;
        }

        setValues(prev => ({
            ...prev,
            [field]: numericVal
        }));

        if (field !== target) {
            setCalculatedValue(null);
        }
    };

    const renderNLabel = () => (
        <div className="flex items-center gap-2">
            <span className={`text-sm font-bold transition-colors ${target === 'n' ? 'text-primary-400' : 'text-neutral-300'}`}>
                {nMode === 'YEARS' ? 'Years' : 'N'}
            </span>
            <button
                onClick={() => setNMode(m => m === 'YEARS' ? 'PERIODS' : 'YEARS')}
                className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-0.5 text-[9px] font-bold text-neutral-400 hover:text-white uppercase tracking-wider"
            >
                {nMode === 'YEARS' ? 'In Years' : 'In Periods'}
            </button>
        </div>
    );

    const renderTILabel = () => (
        <div className="flex items-center gap-2">
            <span className={`text-sm font-bold transition-colors ${target === 'totalInterest' ? 'text-primary-400' : 'text-neutral-300'}`}>
                TI
            </span>
            <button
                onClick={() => setIsTIManuallySet(prev => !prev)}
                className={`flex items-center gap-1 border rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-all ${isTIManuallySet
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                title={isTIManuallySet ? "TI is locked as constraint" : "Click to lock TI as constraint"}
            >
                {isTIManuallySet ? (
                    <><Lock className="w-2.5 h-2.5" /> Locked</>
                ) : (
                    <><Unlock className="w-2.5 h-2.5" /> Unlocked</>
                )}
            </button>
        </div>
    );

    const fields = [
        { id: 'n', label: 'N/Years', customLabel: renderNLabel(), sub: nMode === 'YEARS' ? 'N / Frequency' : 'Total Periods' },
        { id: 'i', label: 'I/Y', sub: 'Annual %' },
        { id: 'pv', label: 'PV', sub: 'Pres Val' },
        { id: 'pmt', label: 'PMT', sub: 'Payment' },
        { id: 'fv', label: 'FV', sub: 'Fut Val' },
        { id: 'totalInterest', label: 'TI', sub: 'Total Interest' },
    ];

    const getDisplayValue = (field) => {
        if (field === 'n' && nMode === 'YEARS') {
            return values.n / frequency;
        }
        if (field === 'totalInterest') {
            return totalInterest;
        }
        return values[field];
    };

    const handleInterestInput = (val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const newInterest = parseFloat(cleanVal);

        if (isNaN(newInterest)) {
            setTotalInterest(null);
        } else {
            setTotalInterest(newInterest);
        }

        setCalculatedValue(null);
    };

    const clearTIConstraint = () => {
        setIsTIManuallySet(false);
        setTotalInterest(null);
    };

    const frequencies = [
        { label: 'Annually (1)', value: 1 },
        { label: 'Semi-Annually (2)', value: 2 },
        { label: 'Quarterly (4)', value: 4 },
        { label: 'Monthly (12)', value: 12 },
        { label: 'Semi-Monthly (24)', value: 24 },
        { label: 'Bi-Weekly (26)', value: 26 },
        { label: 'Weekly (52)', value: 52 },
        { label: 'Daily (365)', value: 365 },
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
                            onClick={() => {
                                const newMode = !showAdvanced;
                                setShowAdvanced(newMode);
                                if (!newMode) {
                                    setCompoundingFrequency(frequency);
                                    setIsCompoundingManuallySet(false);
                                }
                            }}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showAdvanced
                                ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                                : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                                }`}
                            title={showAdvanced ? "Simple Mode" : "Advanced Mode"}
                        >
                            <Settings2 className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setInterestType(t => t === 'COMPOUND' ? 'SIMPLE' : 'COMPOUND')}
                            className={`flex items-center gap-1 border rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all ${interestType === 'SIMPLE'
                                ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/20'
                                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
                        >
                            {interestType === 'SIMPLE' ? 'SIMPLE' : 'COMPOUND'}
                        </button>
                        <button
                            onClick={() => setMode(m => m === 'END' ? 'BEGIN' : 'END')}
                            className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-primary-500 hover:bg-neutral-700 transition-all"
                        >
                            {mode}
                        </button>
                    </div>
                    <div className="flex gap-1.5">
                        <select
                            value={frequency}
                            onChange={(e) => {
                                const newFreq = Number(e.target.value);

                                if (nMode === 'YEARS') {
                                    const currentYears = values.n / frequency;
                                    const newN = currentYears * newFreq;

                                    setValues(prev => ({
                                        ...prev,
                                        n: newN
                                    }));
                                }

                                setFrequency(newFreq);
                                if (!showAdvanced || !isCompoundingManuallySet) {
                                    setCompoundingFrequency(newFreq);
                                }
                            }}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-neutral-300 focus:outline-none"
                        >
                            {frequencies.map(f => (
                                <option key={f.value} value={f.value}>{showAdvanced ? `P/Y: ${f.label.split('(')[0]}` : f.label}</option>
                            ))}
                        </select>

                        {showAdvanced && (
                            <select
                                value={compoundingFrequency}
                                onChange={(e) => {
                                    setCompoundingFrequency(Number(e.target.value));
                                    setIsCompoundingManuallySet(true);
                                }}
                                className={`bg-neutral-800 border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold focus:outline-none border ${isCompoundingManuallySet
                                    ? 'text-primary-400 border-primary-500/50'
                                    : 'text-neutral-500'
                                    }`}
                            >
                                {frequencies.map(f => (
                                    <option key={f.value} value={f.value}>C/Y: {f.label.split('(')[0]}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Target Selector */}
            <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl mb-4 overflow-x-auto scrollbar-hide">
                {fields.map(field => (
                    <button
                        key={field.id}
                        onClick={() => setTarget(field.id)}
                        className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${target === field.id
                            ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                            : 'bg-transparent text-neutral-500 hover:bg-neutral-800'
                            }`}
                    >
                        {field.label}
                    </button>
                ))}
            </div>

            {/* Inputs */}
            <div className="space-y-2 flex-1">
                {fields.map(field => (
                    <div key={field.id} className={`group relative bg-neutral-800/40 rounded-xl p-3 transition-all duration-300 border ${target === field.id ? 'border-primary-500/50 ring-1 ring-primary-500/10 bg-neutral-800/60' : 'border-transparent hover:border-neutral-700'
                        }`}>
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col items-start text-left">
                                {field.customLabel ? field.customLabel : (
                                    <label className={`text-sm font-bold transition-colors ${target === field.id ? 'text-primary-400' : 'text-neutral-300'
                                        }`}>
                                        {field.label}
                                    </label>
                                )}
                                <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">{field.sub}</span>
                            </div>

                            <div className="relative flex-1">
                                {target === field.id && calculatedValue === null ? (
                                    <span className="text-neutral-600 italic text-xs font-bold px-2">CALC...</span>
                                ) : (
                                    <FormattedNumberInput
                                        value={getDisplayValue(field.id)}
                                        onChange={(e) => {
                                            if (field.id === 'totalInterest') {
                                                handleInterestInput(e.target.value);
                                            } else {
                                                handleChange(field.id, e.target.value);
                                            }
                                        }}
                                        decimals={field.id === 'n' ? 0 : 2}
                                        forceFixedOnFocus={field.id === 'totalInterest'}
                                        className={`bg-transparent text-right text-lg font-mono focus:outline-none w-full placeholder-neutral-700 transition-colors ${target === field.id ? 'text-primary-400 font-black' : 'text-white'
                                            }`}
                                        placeholder="0"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <div className="mt-4">
                <button
                    onClick={handleCalculate}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>
        </div>
    );
};

// Simple icon for the button
const CalculateIcon = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className={className}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="14" />
        <line x1="8" y1="14" x2="8" y2="14" />
        <line x1="12" y1="14" x2="12" y2="14" />
        <line x1="16" y1="18" x2="16" y2="18" />
        <line x1="8" y1="18" x2="8" y2="18" />
        <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
);

export default TVMCalculator;

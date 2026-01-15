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

            if (target === 'totalInterest') {
                // Just calculate the sum
                result = values.pv + values.pmt * values.n + values.fv;
                currentInterest = result;
                setCalculatedValue(result);
                setTotalInterest(result);

                addToHistory('TVM', {
                    ...values,
                    mode,
                    target: 'TI',
                    frequency,
                    compoundingFrequency: effectiveCY,
                    interestType
                }, { totalInterest: result });

            } else {
                result = calculateTVM(target, values, mode, frequency, interestType, effectiveCY);
                setCalculatedValue(result);

                // Calculate Total Interest using the result
                const finalValues = { ...values, [target]: result };
                currentInterest = finalValues.pv + finalValues.pmt * finalValues.n + finalValues.fv;
                setTotalInterest(currentInterest);

                addToHistory('TVM', {
                    ...values,
                    mode,
                    target,
                    frequency,
                    compoundingFrequency: effectiveCY,
                    interestType
                }, { [target]: result, totalInterest: currentInterest });

                // Update the target value in the inputs
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
            setTotalInterest(null);
            setCalculatedValue(null);
        }
    };

    // Custom label renderer for N field
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
            return totalInterest !== null ? totalInterest : (values.pv + values.pmt * values.n + values.fv);
        }
        return values[field];
    }

    const handleInterestInput = (val) => {
        // Remove commas to ensure clean parsing if val is a string
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const newInterest = parseFloat(cleanVal) || 0;

        setTotalInterest(newInterest);

        if (target === 'totalInterest') return;

        let varToAdjust = target;
        if (target === 'i') varToAdjust = 'pmt';

        let newValues = { ...values };

        if (varToAdjust === 'n') {
            if (Math.abs(values.pmt) > 1e-9) {
                newValues.n = (newInterest - values.pv - values.fv) / values.pmt;
            }
        } else if (varToAdjust === 'pv') {
            newValues.pv = newInterest - values.fv - (values.pmt * values.n);
        } else if (varToAdjust === 'fv') {
            newValues.fv = newInterest - values.pv - (values.pmt * values.n);
        } else {
            varToAdjust = 'pmt';
            if (values.n !== 0) {
                newValues.pmt = (newInterest - values.pv - values.fv) / values.n;
            }
        }

        newValues[varToAdjust] = parseFloat(newValues[varToAdjust].toFixed(6));

        const effectiveCY = showAdvanced ? compoundingFrequency : frequency;
        const newRate = calculateTVM('i', newValues, mode, frequency, interestType, effectiveCY);

        newValues.i = parseFloat(newRate.toFixed(6));

        setValues(newValues);
        setCalculatedValue(null);
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
)

export default TVMCalculator;

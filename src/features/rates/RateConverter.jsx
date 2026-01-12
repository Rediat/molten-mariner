import React, { useState } from 'react';
import { calculateEAR } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';

const RateConverter = () => {
    const { addToHistory } = useHistory();
    const [nominal, setNominal] = useState(5);
    const [compounding, setCompounding] = useState(12); // Monthly default
    const [result, setResult] = useState(null);
    const [doublingTime, setDoublingTime] = useState(null);

    const handleCalculate = () => {
        const res = calculateEAR(nominal, compounding);
        setResult(res);

        // Rule of 72 (precise calculation): t = ln(2) / (n * ln(1 + r/n))
        const r = nominal / 100;
        const n = compounding;
        let t = 0;

        if (r > 0) {
            t = Math.log(2) / (n * Math.log(1 + r / n));
        }

        // Convert years to Y M D
        const years = Math.floor(t);
        const remainderMonths = (t - years) * 12;
        const months = Math.floor(remainderMonths);
        const days = Math.round((remainderMonths - months) * 30.44);

        setDoublingTime({ years, months, days });
        addToHistory('RATES', { nominal, compounding, doublingTime: { years, months, days } }, res);
    };

    const frequencies = [
        { n: 1, label: 'Annually' },
        { n: 2, label: 'Semiannually' },
        { n: 4, label: 'Quarterly' },
        { n: 12, label: 'Monthly' },
        { n: 365, label: 'Daily' },
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden max-w-lg mx-auto w-full">
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-3 shrink-0 text-center">
                Interest Rates
            </h1>

            <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-y-auto custom-scrollbar pb-2">
                {/* Inputs Section */}
                <div className="bg-neutral-800/50 rounded-xl p-3 shrink-0">
                    <div className="flex items-center gap-4 mb-3">
                        <label className="text-xs font-bold text-neutral-400 shrink-0">Nominal (%)</label>
                        <FormattedNumberInput
                            value={nominal}
                            onChange={(e) => setNominal(parseFloat(e.target.value) || 0)}
                            className="flex-1 w-full bg-transparent text-xl font-mono text-white focus:outline-none border-b border-neutral-700 focus:border-primary-500 transition-colors pb-1 text-right"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Compounding</label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {frequencies.map(freq => (
                                <button
                                    key={freq.n}
                                    onClick={() => setCompounding(freq.n)}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${compounding === freq.n
                                        ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                                        : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'
                                        }`}
                                >
                                    {freq.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="flex-1 flex flex-col bg-neutral-800/20 rounded-xl overflow-hidden border border-neutral-800/50 min-h-0">
                    {result !== null ? (
                        <>
                            <div className="bg-neutral-800/80 p-3 text-center shrink-0 border-b border-neutral-800">
                                <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Effective Annual Rate</span>
                                <div className="text-2xl font-bold text-white mt-0.5 font-mono">
                                    {result.toFixed(4)}%
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                                <h3 className="text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-wide border-b border-neutral-800/50 pb-1">Period Rates Breakdown</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {[
                                        { n: 1, label: 'Annually' },
                                        { n: 2, label: 'Semiannually' },
                                        { n: 4, label: 'Quarterly' },
                                        { n: 12, label: 'Monthly' },
                                        { n: 52, label: 'Weekly' },
                                        { n: 365, label: 'Daily' },
                                    ].map((freq) => (
                                        <div key={freq.n} className="flex justify-between items-center py-1 border-b border-neutral-800/50 last:border-0 text-xs">
                                            <span className="text-neutral-500 truncate mr-2">{freq.label}</span>
                                            <span className="font-mono text-primary-400">
                                                {(nominal / freq.n).toFixed(4)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-600 p-4">
                            <Info className="w-6 h-6 mb-2 opacity-50" />
                            <p className="text-[10px] text-center uppercase tracking-wider">Results will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Time to Double Display */}
            {doublingTime && (
                <div className="mt-2 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 rounded-xl p-3 shrink-0 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <label className="text-[10px] font-bold text-primary-400/80 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        Time to Double Investment
                    </label>
                    <div className="flex items-baseline gap-3">
                        {doublingTime.years > 0 && (
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-mono font-bold text-white">{doublingTime.years}</span>
                                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Yrs</span>
                            </div>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-mono font-bold text-white">{doublingTime.months}</span>
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Mos</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-mono font-bold text-white">{doublingTime.days}</span>
                            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Days</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Calculate Button */}
            <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest shrink-0 mt-3"
            >
                <CalculateIcon className="w-5 h-5" />
                Calculate
            </button>
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

export default RateConverter;

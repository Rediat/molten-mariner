import React, { useState } from 'react';
import { calculateEAR } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info } from 'lucide-react';

const RateConverter = () => {
    const { addToHistory } = useHistory();
    const [nominal, setNominal] = useState(5);
    const [compounding, setCompounding] = useState(12); // Monthly default
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        const res = calculateEAR(nominal, compounding);
        setResult(res);
        addToHistory('RATES', { nominal, compounding }, res);
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
                        <input
                            type="number"
                            value={nominal}
                            onChange={(e) => setNominal(parseFloat(e.target.value) || 0)}
                            className="flex-1 bg-transparent text-xl font-mono text-white focus:outline-none border-b border-neutral-700 focus:border-primary-500 transition-colors pb-1 text-right"
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

            {/* Calculate Button */}
            <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-bold text-sm py-3 rounded-xl shadow-lg shrink-0 mt-3"
            >
                CALCULATE
            </button>
        </div>
    );
};

export default RateConverter;

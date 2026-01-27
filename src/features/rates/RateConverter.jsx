import React, { useState } from 'react';
import { calculateEAR } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info, HelpCircle, Trash2, Settings } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';

const FREQUENCIES = [
    { n: 1, label: 'Annually' },
    { n: 2, label: 'Semi-Annually' },
    { n: 4, label: 'Quarterly' },
    { n: 12, label: 'Monthly' },
    { n: 24, label: 'Semi-Monthly' },
    { n: 26, label: 'Bi-Weekly' },
    { n: 52, label: 'Weekly' },
    { n: 365, label: 'Daily' },
];

const RateConverter = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [nominal, setNominal] = useState(5);
    const [compounding, setCompounding] = useState(12);
    const [result, setResult] = useState(null);
    const [doublingTime, setDoublingTime] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleCalculate = () => {
        const res = calculateEAR(nominal, compounding);
        setResult(res);

        const r = nominal / 100;
        let t = r > 0 ? Math.log(2) / (compounding * Math.log(1 + r / compounding)) : 0;

        const years = Math.floor(t);
        const remainderMonths = (t - years) * 12;
        const months = Math.floor(remainderMonths);
        const days = Math.round((remainderMonths - months) * 30.44);

        setDoublingTime({ years, months, days });
        addToHistory('RATES', { nominal, compounding, doublingTime: { years, months, days } }, res);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden max-w-lg mx-auto w-full">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Interest Rates</h1>
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                    title="Show Info"
                >
                    <Info className="w-3 h-3" />
                </button>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Interest Rate Converter</p>
                    <p className="text-[11px] leading-relaxed">
                        Convert between Nominal (APR) and Effective Annual Rates (EAR). See periodic rate
                        breakdowns and calculate how long it takes to double your investment at any rate.
                    </p>
                </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 space-y-2 overflow-y-auto custom-scrollbar pb-1">
                <div className="bg-neutral-800/50 rounded-xl p-2 shrink-0">
                    <div className="flex items-center gap-4 mb-3">
                        <label className="text-xs font-bold text-neutral-400 shrink-0">Nominal (%)</label>
                        <FormattedNumberInput value={nominal} onChange={(e) => setNominal(parseFloat(e.target.value) || 0)} className="flex-1 w-full bg-transparent text-xl font-mono text-white focus:outline-none border-b border-neutral-700 focus:border-primary-500 transition-colors pb-1 text-right" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Compounding</label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {FREQUENCIES.map(freq => (
                                <button key={freq.n} onClick={() => setCompounding(freq.n)}
                                    className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all ${compounding === freq.n ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'}`}>
                                    {freq.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-neutral-800/20 rounded-xl overflow-hidden border border-neutral-800/50 min-h-0">
                    {result !== null ? (
                        <>
                            <div className="bg-neutral-800/80 p-2 text-center shrink-0 border-b border-neutral-800">
                                <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Effective Annual Rate</span>
                                <div className="text-2xl font-bold text-white mt-0.5 font-mono">{result.toFixed(4)}%</div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                                <h3 className="text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-wide border-b border-neutral-800/50 pb-1">Period Rates Breakdown</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {FREQUENCIES.map(freq => (
                                        <div key={freq.n} className="flex justify-between items-center py-1 border-b border-neutral-800/50 last:border-0 text-xs">
                                            <span className="text-neutral-500 truncate mr-2">{freq.label}</span>
                                            <span className="font-mono text-primary-400">{(nominal / freq.n).toFixed(4)}%</span>
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

            {doublingTime && (
                <div className="mt-2 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 rounded-xl p-3 shrink-0 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CalculateIcon className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-2 block">Investment Doubling Time</span>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-neutral-900/50 rounded-lg p-1.5 border border-white/5">
                                <div className="text-[9px] text-neutral-500 uppercase font-bold">Years</div>
                                <div className="text-sm font-bold text-white font-mono">{doublingTime.years}</div>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-1.5 border border-white/5">
                                <div className="text-[9px] text-neutral-500 uppercase font-bold">Months</div>
                                <div className="text-sm font-bold text-white font-mono">{doublingTime.months}</div>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-1.5 border border-white/5">
                                <div className="text-[9px] text-neutral-500 uppercase font-bold">Days</div>
                                <div className="text-sm font-bold text-white font-mono">{doublingTime.days}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 shrink-0 mt-3">
                <button
                    onClick={() => {
                        setNominal(5);
                        setCompounding(12);
                        setResult(null);
                        setDoublingTime(null);
                    }}
                    className="w-1/4 bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1.5 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-4 h-4" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-4 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-4 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
                <button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest">
                    <CalculateIcon className="w-5 h-5" /> Calculate
                </button>
            </div>
        </div>
    );
};

export default RateConverter;

import React, { useState } from 'react';
import { calculateNPV, calculateIRR, calculateMIRR, calculatePaybackPeriod, calculateDiscountedPaybackPeriod, calculateProfitabilityIndex } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Plus, Trash2, Info, HelpCircle, Settings } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';

const CashFlowCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [rate, setRate] = useState(10);
    const [reinvestRate, setReinvestRate] = useState(10);
    const [flows, setFlows] = useState([-10000, 2000, 3000, 4000, 5000]);
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleCalculate = () => {
        const res = {
            npv: calculateNPV(rate, flows),
            irr: calculateIRR(flows),
            mirr: calculateMIRR(flows, rate, reinvestRate),
            payback: calculatePaybackPeriod(flows),
            discountedPayback: calculateDiscountedPaybackPeriod(flows, rate),
            pi: calculateProfitabilityIndex(flows, rate)
        };
        setResult(res);
        addToHistory('FLOW', { rate, reinvestRate, flows: flows.join(', ') }, res);
    };

    const updateFlow = (index, val) => {
        const newFlows = [...flows];
        newFlows[index] = parseFloat(val) || 0;
        setFlows(newFlows);
    };

    const formatYear = (val) => val === null ? 'Never' : `${val.toFixed(2)} Years`;

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Cash Flow</h1>
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
                    <p className="font-bold text-primary-400 mb-1">Cash Flow Analyzer (NPV & IRR)</p>
                    <p className="text-[11px] leading-relaxed">
                        Evaluate investments with uneven cash flows. Calculate NPV (Net Present Value),
                        IRR (Internal Rate of Return), MIRR, Payback Period, Discounted Payback,
                        and Profitability Index.
                    </p>
                </div>
            )}

            <div className="bg-neutral-800/50 p-4 rounded-xl mb-4 grid grid-cols-2 gap-4">
                {[{ label: 'Finance Rate (%)', value: rate, setter: setRate, color: 'primary' },
                { label: 'Reinvest Rate (%)', value: reinvestRate, setter: setReinvestRate, color: 'secondary' }].map(item => (
                    <div key={item.label} className="flex flex-col gap-1 items-start text-left">
                        <label className="font-bold text-neutral-300 text-xs uppercase tracking-wide">{item.label}</label>
                        <FormattedNumberInput
                            value={item.value}
                            onChange={(e) => item.setter(parseFloat(e.target.value) || 0)}
                            className={`bg-transparent text-left text-lg font-mono text-${item.color}-400 focus:outline-none w-full border-b border-${item.color}-500/50`}
                            placeholder="0.00"
                        />
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4 scrollbar-hide">
                {flows.map((flow, i) => (
                    <div key={i} className="flex items-center gap-3 bg-neutral-800/30 p-3 rounded-lg border border-transparent focus-within:border-neutral-700">
                        <span className="text-xs font-bold text-neutral-500 w-8">CF {i}</span>
                        <FormattedNumberInput value={flow} onChange={(e) => updateFlow(i, e.target.value)} className="flex-1 bg-transparent text-right font-mono text-white focus:outline-none" />
                        {i > 0 && <button onClick={() => setFlows(flows.filter((_, idx) => idx !== i))} className="text-neutral-600 hover:text-red-400"><Trash2 size={16} /></button>}
                    </div>
                ))}
                <button onClick={() => setFlows([...flows, 0])} className="w-full py-3 border border-dashed border-neutral-700 rounded-lg text-neutral-500 hover:text-primary-500 hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Cash Flow
                </button>
            </div>

            {result && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 col-span-2 grid grid-cols-3 gap-3">
                        {[{ label: 'NPV', value: result.npv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), color: 'white' },
                        { label: 'IRR', value: `${result.irr.toFixed(2)}%`, color: 'primary-500' },
                        { label: 'MIRR', value: `${result.mirr.toFixed(2)}%`, color: 'secondary-400' }].map(item => (
                            <div key={item.label}>
                                <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">{item.label}</div>
                                <div className={`text-sm font-bold text-${item.color} font-mono break-all`}>{item.value}</div>
                            </div>
                        ))}
                        <div className="col-span-3 border-t border-neutral-800 pt-2 mt-1 flex justify-between items-center px-1">
                            <div className="text-neutral-500 text-[10px] uppercase font-bold">Profitability Index</div>
                            <div className="text-sm font-bold text-white font-mono">{result.pi.toFixed(2)}</div>
                        </div>
                    </div>
                    {[{ label: 'Payback', value: formatYear(result.payback) }, { label: 'Discounted Payback', value: formatYear(result.discountedPayback) }].map(item => (
                        <div key={item.label} className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                            <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">{item.label}</div>
                            <div className="text-sm font-bold text-white font-mono">{item.value}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => {
                        setRate(0);
                        setReinvestRate(0);
                        setFlows([0]);
                        setResult(null);
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

export default CashFlowCalculator;

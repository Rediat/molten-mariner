import React, { useState } from 'react';
import { calculateNPV, calculateIRR, calculateMIRR, calculatePaybackPeriod, calculateDiscountedPaybackPeriod } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Plus, Trash2, Info } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';

const CashFlowCalculator = () => {
    const { addToHistory } = useHistory();
    const [rate, setRate] = useState(10); // Finance Rate
    const [reinvestRate, setReinvestRate] = useState(10); // Reinvestment Rate
    const [flows, setFlows] = useState([-10000, 2000, 3000, 4000, 5000]); // CF0, CF1, etc.
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        const npv = calculateNPV(rate, flows);
        const irr = calculateIRR(flows); // Initial guess 0.1
        const mirr = calculateMIRR(flows, rate, reinvestRate);
        const payback = calculatePaybackPeriod(flows);
        const discountedPayback = calculateDiscountedPaybackPeriod(flows, rate);

        const res = { npv, irr, mirr, payback, discountedPayback };
        setResult(res);
        addToHistory('FLOW', { rate, reinvestRate, flows: flows.join(', ') }, res);
    };

    const updateFlow = (index, val) => {
        const newFlows = [...flows];
        newFlows[index] = parseFloat(val) || 0;
        setFlows(newFlows);
    };

    const addFlow = () => setFlows([...flows, 0]);
    const removeFlow = (index) => setFlows(flows.filter((_, i) => i !== index));

    const formatYear = (val) => {
        if (val === null) return 'Never';
        return `${val.toFixed(2)} Years`;
    };

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-6 shrink-0 text-left">
                Cash Flow
            </h1>

            <div className="bg-neutral-800/50 p-4 rounded-xl mb-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 items-start text-left">
                    <label className="font-bold text-neutral-300 text-xs uppercase tracking-wide text-left">Finance Rate (%)</label>
                    <FormattedNumberInput
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                        className="bg-transparent text-left text-lg font-mono text-primary-400 focus:outline-none w-full border-b border-primary-500/50"
                        placeholder="0.00"
                    />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                    <label className="font-bold text-neutral-300 text-xs uppercase tracking-wide text-left">Reinvest Rate (%)</label>
                    <FormattedNumberInput
                        value={reinvestRate}
                        onChange={(e) => setReinvestRate(parseFloat(e.target.value) || 0)}
                        className="bg-transparent text-left text-lg font-mono text-secondary-400 focus:outline-none w-full border-b border-secondary-500/50"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4 scrollbar-hide">
                {flows.map((flow, i) => (
                    <div key={i} className="flex items-center gap-3 bg-neutral-800/30 p-3 rounded-lg border border-transparent focus-within:border-neutral-700">
                        <span className="text-xs font-bold text-neutral-500 w-8">CF {i}</span>
                        <FormattedNumberInput
                            value={flow}
                            onChange={(e) => updateFlow(i, e.target.value)}
                            className="flex-1 bg-transparent text-right font-mono text-white focus:outline-none"
                        />
                        {i > 0 && (
                            <button onClick={() => removeFlow(i)} className="text-neutral-600 hover:text-red-400">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    onClick={addFlow}
                    className="w-full py-3 border border-dashed border-neutral-700 rounded-lg text-neutral-500 hover:text-primary-500 hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Cash Flow
                </button>
            </div>

            {result && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 col-span-2 grid grid-cols-3 gap-3">
                        <div>
                            <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">NPV</div>
                            <div className="text-sm font-bold text-white font-mono break-all">
                                {result.npv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                            </div>
                        </div>
                        <div>
                            <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">IRR</div>
                            <div className="text-sm font-bold text-primary-500 font-mono">
                                {result.irr.toFixed(2)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">MIRR</div>
                            <div className="text-sm font-bold text-secondary-400 font-mono">
                                {result.mirr.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                        <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">Payback</div>
                        <div className="text-sm font-bold text-white font-mono">
                            {formatYear(result.payback)}
                        </div>
                    </div>
                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                        <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">Discounted Payback</div>
                        <div className="text-sm font-bold text-white font-mono">
                            {formatYear(result.discountedPayback)}
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
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

export default CashFlowCalculator;

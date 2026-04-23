import React, { useState, useRef } from 'react';
import { calculateNPV, calculateIRR, calculateMIRR, calculatePaybackPeriod, calculateDiscountedPaybackPeriod, calculateProfitabilityIndex } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Plus, Trash2, Info, HelpCircle, Settings, History, Activity } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const CashFlowCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [rate, setRate] = useState(10);
    const [reinvestRate, setReinvestRate] = useState(10);
    const [flows, setFlows] = useState([-10000, 2000, 3000, 4000, 5000]);
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for input focus
    const rateRef = useRef(null);
    const reinvestRateRef = useRef(null);
    const flowRefs = useRef([]);

    const clearRate = (setter, ref) => {
        setter(null);
        setResult(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const clearFlow = (index) => {
        const newFlows = [...flows];
        newFlows[index] = null;
        setFlows(newFlows);
        setResult(null);
        setTimeout(() => flowRefs.current[index]?.focus(), 0);
    };

    const handleCalculate = () => {
        const r = rate || 0;
        const rr = reinvestRate || 0;
        const cleanFlows = flows.map(f => f || 0);

        const res = {
            npv: calculateNPV(r, cleanFlows),
            irr: calculateIRR(cleanFlows),
            mirr: calculateMIRR(cleanFlows, r, rr),
            payback: calculatePaybackPeriod(cleanFlows),
            discountedPayback: calculateDiscountedPaybackPeriod(cleanFlows, r),
            pi: calculateProfitabilityIndex(cleanFlows, r)
        };
        setResult(res);
        addToHistory('FLOW', { rate: r, reinvestRate: rr, flows: cleanFlows.join(', ') }, res);
    };

    const updateFlow = (index, val) => {
        const newFlows = [...flows];
        newFlows[index] = val === '' ? null : (parseFloat(val.replace(/,/g, '')) || 0);
        setFlows(newFlows);
        setResult(null);
    };

    const formatYear = (val) => val === null ? 'Never' : `${val.toFixed(2)} Years`;

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 min-w-0">
                    <Activity className="w-5 h-5 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">Cash Flow</h1>
                    </div>
                </div>
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
                <div className="flex flex-col gap-1 items-start text-left">
                    <label 
                        onClick={() => clearRate(setRate, rateRef)}
                        className="font-bold text-neutral-300 text-[10px] uppercase tracking-wide cursor-pointer hover:text-primary-400 transition-colors"
                        title="Click to Clear"
                    >
                        Finance Rate (%)
                    </label>
                    <FormattedNumberInput
                        ref={rateRef}
                        value={rate}
                        onChange={(e) => {
                            const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                            setRate(val);
                            setResult(null);
                        }}
                        className="bg-transparent text-left text-lg font-mono text-primary-400 focus:outline-none w-full border-b border-primary-500/50"
                        placeholder="0.00"
                    />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                    <label 
                        onClick={() => clearRate(setReinvestRate, reinvestRateRef)}
                        className="font-bold text-neutral-300 text-[10px] uppercase tracking-wide cursor-pointer hover:text-secondary-400 transition-colors"
                        title="Click to Clear"
                    >
                        Reinvest Rate (%)
                    </label>
                    <FormattedNumberInput
                        ref={reinvestRateRef}
                        value={reinvestRate}
                        onChange={(e) => {
                            const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                            setReinvestRate(val);
                            setResult(null);
                        }}
                        className="bg-transparent text-left text-lg font-mono text-secondary-400 focus:outline-none w-full border-b border-secondary-500/50"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4 scrollbar-hide">
                {flows.map((flow, i) => (
                    <div key={i} className="flex items-center gap-3 bg-neutral-800/30 p-3 rounded-lg border border-transparent focus-within:border-neutral-700">
                        <span 
                            onClick={() => clearFlow(i)}
                            className="text-[10px] font-bold text-neutral-500 w-8 cursor-pointer hover:text-primary-400 transition-colors"
                            title="Click to Clear"
                        >
                            CF {i}
                        </span>
                        <FormattedNumberInput 
                            ref={el => flowRefs.current[i] = el}
                            value={flow} 
                            onChange={(e) => updateFlow(i, e.target.value)} 
                            className="flex-1 bg-transparent text-right font-mono text-white focus:outline-none" 
                        />
                        {i > 0 && <button onClick={() => setFlows(flows.filter((_, idx) => idx !== i))} className="text-neutral-600 hover:text-red-400"><Trash2 size={16} /></button>}
                    </div>
                ))}
                <button onClick={() => setFlows([...flows, 0])} className="w-full py-3 border border-dashed border-neutral-700 rounded-lg text-neutral-500 hover:text-primary-500 hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Cash Flow
                </button>
            </div>

            {result && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="col-span-2 flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                        <button
                            onClick={() => setShowHistory(true)}
                            className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                        >
                            <History size={12} /> View History
                        </button>
                    </div>
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

            <div className="flex gap-1.5">
                <button
                    onClick={() => {
                        setRate(0);
                        setReinvestRate(0);
                        setFlows([0]);
                        setResult(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-2.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
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
                <button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-2.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest">
                    <CalculateIcon className="w-5 h-5" /> Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="FLOW"
                title="Cash Flow"
            />
        </div>
    );
};

export default CashFlowCalculator;

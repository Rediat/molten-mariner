import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useInputFocus } from '../../hooks/useInputFocus';
import { calculateNPV, calculateIRR, calculateMIRR, calculatePaybackPeriod, calculateDiscountedPaybackPeriod, calculateProfitabilityIndex } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { 
    Plus, 
    Trash2, 
    Info, 
    HelpCircle, 
    Settings, 
    History, 
    Activity, 
    ChevronUp, 
    ChevronDown, 
    GripVertical, 
    ArrowUpDown, 
    TrendingUp, 
    TrendingDown 
} from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import AwaitingCalculation from '../../components/AwaitingCalculation';

const CashFlowCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [rate, setRate] = useState(10);
    const [reinvestRate, setReinvestRate] = useState(10);
    const [flows, setFlows] = useState([-10000, 2000, 3000, 4000, 5000]);
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showOrderMenu, setShowOrderMenu] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Refs for input focus and order menu
    const rateRef = useRef(null);
    const reinvestRateRef = useRef(null);
    const flowRefs = useRef([]);
    const orderMenuRef = useRef(null);

    const clearResults = useCallback(() => {
        setResult(null);
    }, []);

    const focusRate = useInputFocus(setRate, rateRef, clearResults);
    const focusReinvestRate = useInputFocus(setReinvestRate, reinvestRateRef, clearResults);

    // Close order menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (orderMenuRef.current && !orderMenuRef.current.contains(event.target)) {
                setShowOrderMenu(false);
            }
        };
        if (showOrderMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOrderMenu]);
    
    // For dynamic flows, we need a way to pass the index
    const focusFlow = (index) => {
        const setter = (val) => {
            const newFlows = [...flows];
            newFlows[index] = val;
            setFlows(newFlows);
        };
        setter(null);
        clearResults();
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

    const removeFlow = (index) => {
        if (flows.length <= 1) return;
        setFlows(flows.filter((_, idx) => idx !== index));
        setResult(null);
    };

    // Reordering operations
    const moveFlow = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= flows.length) return;
        const newFlows = [...flows];
        const temp = newFlows[index];
        newFlows[index] = newFlows[targetIndex];
        newFlows[targetIndex] = temp;
        setFlows(newFlows);
        setResult(null);
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }
        const newFlows = [...flows];
        const [movedItem] = newFlows.splice(draggedIndex, 1);
        newFlows.splice(targetIndex, 0, movedItem);
        setFlows(newFlows);
        setResult(null);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Bulk order actions
    const reverseAllFlows = () => {
        setFlows([...flows].reverse());
        setResult(null);
        setShowOrderMenu(false);
    };

    const reverseInflows = () => {
        if (flows.length <= 2) return;
        const [cf0, ...rest] = flows;
        setFlows([cf0, ...rest.reverse()]);
        setResult(null);
        setShowOrderMenu(false);
    };

    const sortInflowsAscending = () => {
        if (flows.length <= 2) return;
        const [cf0, ...rest] = flows;
        const sorted = [...rest].sort((a, b) => (a || 0) - (b || 0));
        setFlows([cf0, ...sorted]);
        setResult(null);
        setShowOrderMenu(false);
    };

    const sortInflowsDescending = () => {
        if (flows.length <= 2) return;
        const [cf0, ...rest] = flows;
        const sorted = [...rest].sort((a, b) => (b || 0) - (a || 0));
        setFlows([cf0, ...sorted]);
        setResult(null);
        setShowOrderMenu(false);
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
                        and Profitability Index. Use the order controls or drag rows to easily adjust flow timing.
                    </p>
                </div>
            )}

            <div className="bg-neutral-800/50 p-4 rounded-xl mb-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 items-start text-left">
                    <label 
                        onClick={focusRate}
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
                        onClick={focusReinvestRate}
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

            {/* Cash Flows Header with Order Menu */}
            <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Periods / Cash Flows</span>
                    <span className="bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded-full text-[9px] font-mono border border-neutral-700/50">
                        {flows.length}
                    </span>
                </span>

                <div className="relative" ref={orderMenuRef}>
                    <button
                        type="button"
                        onClick={() => setShowOrderMenu(!showOrderMenu)}
                        className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-lg border transition-all ${
                            showOrderMenu 
                                ? 'bg-primary-600/20 text-primary-400 border-primary-500/50' 
                                : 'text-neutral-400 hover:text-primary-400 bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700/60 hover:border-primary-500/40'
                        }`}
                        title="Change order of cash flows"
                    >
                        <ArrowUpDown size={12} className="text-primary-400" />
                        <span>Order</span>
                        <ChevronDown size={11} className={`transition-transform duration-200 ${showOrderMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showOrderMenu && (
                        <div className="absolute right-0 top-full mt-1.5 z-20 w-52 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1.5 flex flex-col gap-0.5 backdrop-blur-md">
                            <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-800 mb-1">
                                Order Options
                            </div>
                            <button
                                type="button"
                                onClick={reverseAllFlows}
                                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-left"
                            >
                                <ArrowUpDown size={13} className="text-primary-400 shrink-0" />
                                <span>Reverse All Flows</span>
                            </button>
                            {flows.length > 2 && (
                                <button
                                    type="button"
                                    onClick={reverseInflows}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-left"
                                    title="Keep CF 0, reverse subsequent periods"
                                >
                                    <ArrowUpDown size={13} className="text-secondary-400 shrink-0" />
                                    <span>Reverse Inflows (CF 1..N)</span>
                                </button>
                            )}
                            {flows.length > 2 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={sortInflowsAscending}
                                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-left"
                                    >
                                        <TrendingUp size={13} className="text-emerald-400 shrink-0" />
                                        <span>Sort Inflows (Low → High)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={sortInflowsDescending}
                                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-left"
                                    >
                                        <TrendingDown size={13} className="text-amber-400 shrink-0" />
                                        <span>Sort Inflows (High → Low)</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4 scrollbar-hide">
                {flows.map((flow, i) => (
                    <div 
                        key={i} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, i)}
                        className={`group flex items-center gap-2 bg-neutral-800/30 p-2.5 rounded-lg border transition-all ${
                            dragOverIndex === i 
                                ? 'border-primary-500 bg-primary-500/10' 
                                : draggedIndex === i 
                                ? 'opacity-40 border-dashed border-neutral-600' 
                                : 'border-transparent focus-within:border-neutral-700 hover:border-neutral-700/60'
                        }`}
                    >
                        {/* Drag Handle */}
                        <div 
                            className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 p-0.5 rounded touch-none"
                            title="Drag to reorder"
                        >
                            <GripVertical size={14} />
                        </div>

                        {/* CF Label */}
                        <span 
                            onClick={() => focusFlow(i)}
                            className="text-[10px] font-bold text-neutral-500 w-9 cursor-pointer hover:text-primary-400 transition-colors shrink-0"
                            title="Click to Clear"
                        >
                            CF {i}
                        </span>

                        {/* Flow Value Input */}
                        <FormattedNumberInput 
                            ref={el => flowRefs.current[i] = el}
                            value={flow} 
                            onChange={(e) => updateFlow(i, e.target.value)} 
                            className="flex-1 min-w-0 bg-transparent text-right font-mono text-white focus:outline-none" 
                        />

                        {/* Up / Down Move Buttons */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                                type="button"
                                onClick={() => moveFlow(i, -1)}
                                disabled={i === 0}
                                className="p-0.5 text-neutral-500 hover:text-primary-400 disabled:opacity-20 disabled:hover:text-neutral-500 transition-colors"
                                title={`Move CF ${i} Up`}
                            >
                                <ChevronUp size={13} />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveFlow(i, 1)}
                                disabled={i === flows.length - 1}
                                className="p-0.5 text-neutral-500 hover:text-primary-400 disabled:opacity-20 disabled:hover:text-neutral-500 transition-colors"
                                title={`Move CF ${i} Down`}
                            >
                                <ChevronDown size={13} />
                            </button>
                        </div>

                        {/* Delete button */}
                        {flows.length > 1 && (
                            <button 
                                type="button"
                                onClick={() => removeFlow(i)} 
                                className="text-neutral-600 hover:text-red-400 p-1 rounded transition-colors shrink-0"
                                title={`Remove CF ${i}`}
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => setFlows([...flows, 0])} className="w-full py-3 border border-dashed border-neutral-700 rounded-lg text-neutral-500 hover:text-primary-500 hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Cash Flow
                </button>
            </div>

            {result ? (
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
            ) : (
                <div className="mt-2.5 h-[140px] shrink-0">
                    <AwaitingCalculation Icon={Activity} />
                </div>
            )}

            <div className="flex gap-1.5">
                <button
                    onClick={() => {
                        setFlows([0]);
                        setResult(null);
                    }}
                    className="w-[12%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-2.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
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

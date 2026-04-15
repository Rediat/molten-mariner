import React, { useState, useRef } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Receipt, Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import tbillData from './data.json';
import { predictNextYield } from './predictionEngine';

const TENURES = [
    { days: 28, label: '28 Days', sub: '1 Month' },
    { days: 91, label: '91 Days', sub: '3 Months' },
    { days: 182, label: '182 Days', sub: '6 Months' },
    { days: 364, label: '364 Days', sub: '1 Year' },
];

const TBillCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    const [faceValue, setFaceValue] = useState(500000);
    const [totalBudget, setTotalBudget] = useState(490000);
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [tenure, setTenure] = useState(28);
    const [discountRate, setDiscountRate] = useState(12);
    const [brokerageRate, setBrokerageRate] = useState(0.1);

    const tenureKey = `${tenure}_days`;
    const predictionCache = useRef({});
    
    if (!predictionCache.current[tenureKey]) {
        const pred = predictNextYield(tbillData, tenureKey);
        predictionCache.current[tenureKey] = pred ? parseFloat(pred.yield.toFixed(3)) : null;
    }
    const currentPrediction = predictionCache.current[tenureKey];

    const [mode, setMode] = useState('forward');
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for input focus
    const faceValueRef = useRef(null);
    const totalBudgetRef = useRef(null);
    const discountRateRef = useRef(null);
    const brokerageRateRef = useRef(null);

    const clearField = (setter, ref) => {
        setter(null);
        setResult(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const calculateMaturityDate = (issueStr, tenureDays) => {
        const issue = new Date(issueStr);
        issue.setDate(issue.getDate() + tenureDays);
        return issue.toISOString().split('T')[0];
    };

    const handleCalculate = () => {
        const maturityDate = calculateMaturityDate(issueDate, tenure);
        const fv = faceValue || 0;
        const budget = totalBudget || 0;
        const disc = discountRate || 0;
        const brok = brokerageRate || 0;

        // Base unit calculations: 5,000 ETB per T-Bill
        const UNIT_FV = 5000;
        const unitPrice = UNIT_FV / (1 + (disc / 100) * (tenure / 365));

        if (mode === 'forward') {
            // Forward: Face Value → Total Consideration
            const quantity = fv > 0 ? Math.floor(fv / UNIT_FV) : 0;
            const actualFaceValue = quantity * UNIT_FV;

            const purchasePrice = quantity * unitPrice;
            const brokerage = purchasePrice * (brok / 100);
            const totalConsideration = purchasePrice + brokerage;
            
            const discountAmount = actualFaceValue - purchasePrice;
            const netReturn = actualFaceValue - totalConsideration;
            const effectiveYield = totalConsideration > 0 ? (netReturn / totalConsideration) * (365 / tenure) * 100 : 0;

            const res = {
                mode: 'forward',
                maturityDate,
                faceValue: actualFaceValue,
                purchasePrice,
                brokerage,
                totalConsideration,
                discountAmount,
                effectiveYield,
                netReturn,
                quantity
            };

            setResult(res);
            addToHistory('T-BILL', { faceValue: actualFaceValue, issueDate, tenure, discountRate: disc, brokerageRate: brok, mode: 'forward' }, res);
        } else {
            // Reverse: Total Consideration → Face Value
            // Quantity = Investment amount ÷ (price + brokerage) (rounded down)
            const unitPriceInclBrok = unitPrice * (1 + (brok / 100));
            const quantity = budget > 0 ? Math.floor(budget / unitPriceInclBrok) : 0;
            
            const purchasePrice = quantity * unitPrice;
            const brokerage = purchasePrice * (brok / 100);
            const totalConsideration = purchasePrice + brokerage;
            
            const computedFaceValue = quantity * UNIT_FV;
            const discountAmount = computedFaceValue - purchasePrice;
            const netReturn = computedFaceValue - totalConsideration;
            const effectiveYield = totalConsideration > 0 ? (netReturn / totalConsideration) * (365 / tenure) * 100 : 0;

            const res = {
                mode: 'reverse',
                maturityDate,
                faceValue: computedFaceValue,
                purchasePrice,
                brokerage,
                totalConsideration,
                discountAmount,
                effectiveYield,
                netReturn,
                quantity
            };

            setResult(res);
            addToHistory('T-BILL', { totalBudget: budget, issueDate, tenure, discountRate: disc, brokerageRate: brok, mode: 'reverse' }, res);
        }
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header + Mode Toggle */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <Receipt className="w-5 h-5 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">
                            T-Bill Calculator
                        </h1>
                        <p className="text-neutral-500 text-[9px] font-medium uppercase tracking-wider">
                            Treasury Bill Bidding
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex bg-neutral-900/70 rounded-md p-0.5 ring-1 ring-neutral-800">
                        <button
                            onClick={() => { if (mode !== 'forward') { setMode('forward'); setResult(null); } }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'forward' ? 'bg-primary-600/25 text-primary-400 ring-1 ring-primary-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Face→Cost
                        </button>
                        <button
                            onClick={() => { if (mode !== 'reverse') { setMode('reverse'); setResult(null); } }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'reverse' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Budget→Face
                        </button>
                    </div>
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2 mb-2 text-xs text-neutral-300 text-left scale-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="font-bold text-primary-400 mb-1 flex items-center gap-1.5">
                        <Info className="w-3 h-3" />
                        Treasury Bill Unit-Based Bidding
                    </p>
                    <p className="text-[11px] leading-relaxed">
                        {mode === 'forward'
                            ? 'Face→Cost: Enter your target face value. The calculator floors this to the nearest 5,000 ETB unit and calculates your purchase price and brokerage.'
                            : 'Budget→Face: Enter your investment budget. The calculator determines the maximum number of 5,000 ETB units you can afford.'}
                    </p>
                    <p className="text-[11px] leading-relaxed mt-1 text-neutral-400">
                        <span className="font-bold text-primary-400">Unit Logic:</span> T-Bills are sold in denominations of <span className="text-white">5,000 ETB</span>.
                    </p>
                    <p className="text-[11px] leading-relaxed mt-1 text-neutral-500 italic">
                        Yield = (Net Return / Total Cost) × (365 / Days) × 100
                    </p>
                </div>
            )}

            {/* Input Fields */}
            <div className="space-y-1 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {/* Primary Input — swaps based on mode */}
                {mode === 'forward' ? (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-primary-500/50 ring-1 ring-primary-500/10">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label 
                                    onClick={() => clearField(setFaceValue, faceValueRef)}
                                    className="text-sm font-bold text-primary-400 block leading-tight text-left cursor-pointer hover:text-white transition-colors"
                                    title="Click to Clear"
                                >
                                    Face Value
                                </label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Amount at Maturity</span>
                            </div>
                            <FormattedNumberInput
                                ref={faceValueRef}
                                value={faceValue}
                                onChange={(e) => setFaceValue(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-primary-400 font-black min-w-0 flex-1"
                                placeholder="500,000"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-emerald-500/50 ring-1 ring-emerald-500/10">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label 
                                    onClick={() => clearField(setTotalBudget, totalBudgetRef)}
                                    className="text-sm font-bold text-emerald-400 block leading-tight text-left cursor-pointer hover:text-white transition-colors"
                                    title="Click to Clear"
                                >
                                    Budget
                                </label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Total Consideration</span>
                            </div>
                            <FormattedNumberInput
                                ref={totalBudgetRef}
                                value={totalBudget}
                                onChange={(e) => setTotalBudget(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-emerald-400 font-black min-w-0 flex-1"
                                placeholder="490,000"
                            />
                        </div>
                    </div>
                )}

                {/* Tenure Selector */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Tenure (Days)</label>
                    <div className="grid grid-cols-4 gap-1">
                        {TENURES.map(t => (
                            <button
                                key={t.days}
                                onClick={() => setTenure(t.days)}
                                className={`py-1.5 px-1 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${tenure === t.days
                                    ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                                    : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'
                                    }`}
                            >
                                <span className="text-sm font-black leading-none">{t.days}</span>
                                <span className={`text-[8px] font-bold uppercase tracking-tight ${tenure === t.days ? 'text-primary-400/80' : 'text-neutral-500'}`}>
                                    {t.sub}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Discount Rate & Brokerage Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700">
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-1">
                                <label 
                                    onClick={() => clearField(setDiscountRate, discountRateRef)}
                                    className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold text-left cursor-pointer hover:text-white transition-colors"
                                    title="Click to Clear"
                                >
                                    Discount %
                                </label>
                                {currentPrediction && (
                                    <button
                                        onClick={() => setDiscountRate(currentPrediction)}
                                        title="Apply AI Prediction"
                                        className="text-[8px] bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ring-1 ring-indigo-500/50 transition-all active:scale-95 whitespace-nowrap"
                                    >
                                        AI: {currentPrediction}%
                                    </button>
                                )}
                            </div>
                            <FormattedNumberInput
                                ref={discountRateRef}
                                value={discountRate}
                                onChange={(e) => setDiscountRate(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none w-full text-white"
                                placeholder="12"
                            />
                        </div>
                    </div>
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700">
                        <div className="flex flex-col">
                            <label 
                                onClick={() => clearField(setBrokerageRate, brokerageRateRef)}
                                className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 text-left cursor-pointer hover:text-white transition-colors"
                                title="Click to Clear"
                            >
                                Brokerage %
                            </label>
                            <FormattedNumberInput
                                ref={brokerageRateRef}
                                value={brokerageRate}
                                onChange={(e) => setBrokerageRate(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none w-full text-white"
                                placeholder="0.1"
                            />
                        </div>
                    </div>
                </div>

                {/* Issue Date */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700 text-left">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Issue Date</label>
                    <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="bg-transparent text-white text-sm font-mono focus:outline-none w-full"
                    />
                </div>
            </div>

            {/* Results */}
            {result && (() => {
                const isReverse = result.mode === 'reverse';
                return (
                    <div className={`mt-1.5 bg-gradient-to-br ${isReverse ? 'from-emerald-900/30' : 'from-primary-900/30'} to-neutral-800/50 border ${isReverse ? 'border-emerald-500/30' : 'border-primary-500/30'} rounded-xl p-2.5 space-y-2`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                            >
                                <History size={12} /> View History
                            </button>
                        </div>

                        <div className="flex justify-between items-center bg-neutral-900/50 rounded-lg p-2 mb-1 border border-neutral-700/50">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Quantity</span>
                            <span className="text-sm font-black text-primary-400">{result.quantity} UNITS</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                    Purchase Price
                                </p>
                                <p className="text-lg font-black text-primary-400">
                                    {formatCurrency(result.purchasePrice)}
                                </p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Brokerage ({brokerageRate}%)</p>
                                <p className="text-lg font-black text-amber-400">
                                    {formatCurrency(result.brokerage)}
                                </p>
                            </div>
                        </div>

                        <div className={`bg-neutral-900/80 rounded-lg p-2 border ${isReverse ? 'border-emerald-500/30' : 'border-primary-500/30'}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                        {isReverse ? 'Face Value You Get' : 'Total Consideration'}
                                    </p>
                                    <p className={`text-xl font-black ${isReverse ? 'text-emerald-400' : 'text-white'}`}>
                                        {formatCurrency(isReverse ? result.faceValue : result.totalConsideration)}
                                    </p>
                                </div>
                                {isReverse ? (
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Actual Cost</p>
                                        <p className="text-sm font-black text-white">{formatCurrency(result.totalConsideration)}</p>
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Actual Face Value</p>
                                        <p className="text-sm font-black text-white">{formatCurrency(result.faceValue)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-700 mt-1">
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Maturity</p>
                                <p className="text-xs font-bold text-white">{result.maturityDate}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Discount</p>
                                <p className="text-xs font-bold text-emerald-400">{formatCurrency(result.discountAmount)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Net Return</p>
                                <p className="text-xs font-bold text-emerald-400">{formatCurrency(result.netReturn)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Eff. Yield</p>
                                <p className="text-xs font-bold text-emerald-400">{result.effectiveYield.toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Action Buttons */}
            <div className="mt-1.5 flex gap-1.5">
                <button
                    onClick={() => {
                        setFaceValue(500000);
                        setTotalBudget(490000);
                        setTenure(28);
                        setDiscountRate(12);
                        setBrokerageRate(0.1);
                        setIssueDate(new Date().toISOString().split('T')[0]);
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
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-2.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="T-Bill"
                title="T-Bill"
            />
        </div>
    );
};

export default TBillCalculator;

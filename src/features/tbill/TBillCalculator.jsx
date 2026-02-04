import React, { useState } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Receipt, Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const TENURES = [
    { days: 28, label: '28 Days' },
    { days: 91, label: '91 Days' },
    { days: 182, label: '182 Days' },
    { days: 364, label: '364 Days' },
];

const TBillCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    const [faceValue, setFaceValue] = useState(500000);
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [tenure, setTenure] = useState(28);
    const [discountRate, setDiscountRate] = useState(12);
    const [brokerageRate, setBrokerageRate] = useState(0.1);

    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const calculateMaturityDate = (issueStr, tenureDays) => {
        const issue = new Date(issueStr);
        issue.setDate(issue.getDate() + tenureDays);
        return issue.toISOString().split('T')[0];
    };

    const handleCalculate = () => {
        // T-Bill pricing: Purchase Price = Face Value / (1 + (Discount Rate × Days / 365))
        // This matches the Excel formula
        const purchasePrice = faceValue / (1 + (discountRate / 100) * (tenure / 365));
        const brokerage = purchasePrice * (brokerageRate / 100);
        const totalConsideration = purchasePrice + brokerage;
        const maturityDate = calculateMaturityDate(issueDate, tenure);

        // Calculate effective yield
        const discountAmount = faceValue - purchasePrice;
        const effectiveYield = (discountAmount / purchasePrice) * (365 / tenure) * 100;

        const res = {
            maturityDate,
            purchasePrice,
            brokerage,
            totalConsideration,
            discountAmount,
            effectiveYield,
            netReturn: faceValue - totalConsideration
        };

        setResult(res);
        addToHistory('T-BILL', { faceValue, issueDate, tenure, discountRate, brokerageRate }, res);
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-primary-500" />
                        T-Bill Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        Treasury Bill Bidding
                    </p>
                </div>
                <div className="flex gap-1.5">
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
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Treasury Bill Calculator</p>
                    <p className="text-[11px] leading-relaxed">
                        Calculate T-Bill purchase price using discount pricing. Enter face value, tenure,
                        and discount rate to determine your total investment including brokerage fees.
                    </p>
                </div>
            )}

            {/* Input Fields */}
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {/* Face Value */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-primary-500/50 ring-1 ring-primary-500/10">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label className="text-sm font-bold text-primary-400 block leading-tight text-left">Face Value</label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Amount at Maturity</span>
                        </div>
                        <FormattedNumberInput
                            value={faceValue}
                            onChange={(e) => setFaceValue(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-primary-400 font-black min-w-0 flex-1"
                            placeholder="500,000"
                        />
                    </div>
                </div>

                {/* Tenure Selector */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Tenure (Days)</label>
                    <div className="grid grid-cols-4 gap-1">
                        {TENURES.map(t => (
                            <button
                                key={t.days}
                                onClick={() => setTenure(t.days)}
                                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${tenure === t.days
                                    ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                                    : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'
                                    }`}
                            >
                                {t.days}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Discount Rate & Brokerage Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                        <div className="flex flex-col">
                            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 text-left">Discount Rate %</label>
                            <FormattedNumberInput
                                value={discountRate}
                                onChange={(e) => setDiscountRate(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none w-full text-white"
                                placeholder="12"
                            />
                        </div>
                    </div>
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                        <div className="flex flex-col">
                            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 text-left">Brokerage %</label>
                            <FormattedNumberInput
                                value={brokerageRate}
                                onChange={(e) => setBrokerageRate(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none w-full text-white"
                                placeholder="0.1"
                            />
                        </div>
                    </div>
                </div>

                {/* Issue Date */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700 text-left">
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
            {result && (
                <div className="mt-2 bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                        <button
                            onClick={() => setShowHistory(true)}
                            className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                        >
                            <History size={12} /> View History
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-neutral-900/50 rounded-lg p-2.5">
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Purchase Price</p>
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

                    <div className="bg-neutral-900/80 rounded-lg p-2 border border-primary-500/30">
                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Total Consideration</p>
                        <p className="text-xl font-black text-white">
                            {formatCurrency(result.totalConsideration)}
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-700">
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
            )}

            {/* Action Buttons */}
            <div className="mt-2 flex gap-1.5">
                <button
                    onClick={() => {
                        setFaceValue(500000);
                        setTenure(28);
                        setDiscountRate(12);
                        setBrokerageRate(0.1);
                        setIssueDate(new Date().toISOString().split('T')[0]);
                        setResult(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
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
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
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

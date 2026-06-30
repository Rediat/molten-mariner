import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInputFocus } from '../../hooks/useInputFocus';
import { useHistory } from '../../context/HistoryContext';
import { Receipt, Info, HelpCircle, Settings, History, Trash2, Copy, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateTBillApplicationPDF } from './tbill-pdf-utils';
import { amountToWords } from '../../utils/text-utils';
import { copyToClipboard } from '../../utils/clipboard';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import AwaitingCalculation from '../../components/AwaitingCalculation';
import tbillData from './data.json';
import { predictNextYield } from './predictionEngine';

const TENURES = [
    { days: 28, label: '28 Days', sub: '1 Month' },
    { days: 91, label: '91 Days', sub: '3 Months' },
    { days: 182, label: '182 Days', sub: '6 Months' },
    { days: 364, label: '364 Days', sub: '1 Year' },
];

const TBillCalculator = ({
    toggleHelp,
    toggleSettings,
    brokerageRate: propBrokerageRate,
    setBrokerageRate: propSetBrokerageRate
}) => {
    const { addToHistory } = useHistory();

    const [faceValue, setFaceValue] = useState(1000000);
    const [totalBudget, setTotalBudget] = useState(1000000);

    const formatToLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [auctionDate, setAuctionDate] = useState(() => {
        const lastAuction = tbillData[tbillData.length - 1];
        const lastDate = new Date(lastAuction.date);
        const today = new Date();
        let current = new Date(lastDate);
        while (current <= today) {
            current.setDate(current.getDate() + 14);
        }
        return formatToLocalDate(current);
    });
    const [tenure, setTenure] = useState(182);
    const [discountRate, setDiscountRate] = useState(14);
    
    const [localBrokerageRate, setLocalBrokerageRate] = useState(0.105);
    const brokerageRate = propBrokerageRate !== undefined ? propBrokerageRate : localBrokerageRate;
    const setBrokerageRate = propSetBrokerageRate !== undefined ? propSetBrokerageRate : setLocalBrokerageRate;

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
    const [bankSource, setBankSource] = useState('WEGAGEN'); // 'WEGAGEN' | 'GADAA' | 'CBE' | 'AWASH' | 'ETHIO_FIDELITY'

    // Refs for input focus
    const faceValueRef = useRef(null);
    const totalBudgetRef = useRef(null);
    const discountRateRef = useRef(null);
    const brokerageRateRef = useRef(null);
    const auctionsRef = useRef(null);
    const [showAuctions, setShowAuctions] = useState(false);
    const bankSelectorRef = useRef(null);
    const [showBankSelector, setShowBankSelector] = useState(false);

    // Handle click outside to close auctions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (auctionsRef.current && !auctionsRef.current.contains(event.target)) {
                setShowAuctions(false);
            }
            if (bankSelectorRef.current && !bankSelectorRef.current.contains(event.target)) {
                setShowBankSelector(false);
            }
        };
        if (showAuctions || showBankSelector) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAuctions, showBankSelector]);

    // Calculate upcoming auctions
    const nextAuctions = React.useMemo(() => {
        const lastAuction = tbillData[tbillData.length - 1];
        const lastDate = new Date(lastAuction.date);
        const today = new Date();
        let current = new Date(lastDate);
        while (current <= today) {
            current.setDate(current.getDate() + 14);
        }
        const list = [];
        for (let i = 0; i < 10; i++) {
            list.push(new Date(current));
            current.setDate(current.getDate() + 14);
        }
        return list;
    }, []);

    const handlePrevAuction = () => {
        const current = new Date(auctionDate);
        current.setDate(current.getDate() - 14);
        setAuctionDate(formatToLocalDate(current));
        setResult(null);
    };

    const handleNextAuction = () => {
        const current = new Date(auctionDate);
        current.setDate(current.getDate() + 14);
        setAuctionDate(formatToLocalDate(current));
        setResult(null);
    };

    const clearResults = useCallback(() => {

        setResult(null);
    }, []);

    const focusFaceValue = useInputFocus(setFaceValue, faceValueRef, clearResults);
    const focusTotalBudget = useInputFocus(setTotalBudget, totalBudgetRef, clearResults);
    const focusDiscountRate = useInputFocus(setDiscountRate, discountRateRef, clearResults);
    const focusBrokerageRate = useInputFocus(setBrokerageRate, brokerageRateRef, clearResults);

    const handleClear = () => {
        setResult(null);
    };

    const calculateMaturityDate = (issueStr, tenureDays) => {
        const issue = new Date(issueStr);
        // Maturity is calculated from the settlement date (Auction Date + 1)
        issue.setDate(issue.getDate() + tenureDays + 1);
        return issue.toISOString().split('T')[0];
    };

    const handleCalculate = () => {
        const maturityDate = calculateMaturityDate(auctionDate, tenure);
        const fv = faceValue || 0;
        const budget = totalBudget || 0;
        const disc = discountRate || 0;
        const brok = brokerageRate || 0;

        // Base unit calculations: 5,000 ETB per T-Bill
        const UNIT_FV = 5000;
        const unitPrice = UNIT_FV / (1 + (disc / 100) * (tenure / 365));

        if (mode === 'forward') {
            const quantity = fv > 0 ? Math.floor(fv / UNIT_FV) : 0;
            const actualFaceValue = quantity * UNIT_FV;
            const purchasePrice = quantity * unitPrice;
            const brokerage = purchasePrice * (brok / 100);
            const totalConsideration = purchasePrice + brokerage;
            const discountAmount = actualFaceValue - purchasePrice;
            const netReturn = actualFaceValue - totalConsideration;
            const effectiveYield = totalConsideration > 0 ? (netReturn / totalConsideration) * (365 / tenure) * 100 : 0;

            const bidPrice = 100 / (1 + (disc / 100) * (tenure / 365));

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
                quantity,
                bidPrice,
                leftover: fv - actualFaceValue
            };
            setResult(res);
            addToHistory('T-BILL', { faceValue: actualFaceValue, auctionDate, tenure, discountRate: disc, brokerageRate: brok, mode: 'forward' }, res);
        } else {
            const unitPriceInclBrok = unitPrice * (1 + (brok / 100));
            const quantity = budget > 0 ? Math.floor((budget + 5) / unitPriceInclBrok) : 0;
            const purchasePrice = quantity * unitPrice;
            const brokerage = purchasePrice * (brok / 100);
            const totalConsideration = purchasePrice + brokerage;
            const computedFaceValue = quantity * UNIT_FV;
            const discountAmount = computedFaceValue - purchasePrice;
            const netReturn = computedFaceValue - totalConsideration;
            const effectiveYield = totalConsideration > 0 ? (netReturn / totalConsideration) * (365 / tenure) * 100 : 0;

            const bidPrice = 100 / (1 + (disc / 100) * (tenure / 365));

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
                quantity,
                budget,
                bidPrice,
                leftover: budget - totalConsideration
            };
            setResult(res);
            addToHistory('T-BILL', { totalBudget: budget, auctionDate, tenure, discountRate: disc, brokerageRate: brok, mode: 'reverse' }, res);
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
                            ? 'Face→Cost: Enter your target face value. The calculator floors this to the nearest 5,000 ETB unit and calculates your purchase price and commissions.'
                            : 'Budget→Face: Enter your investment budget. The calculator determines the maximum number of 5,000 ETB units you can afford.'}
                    </p>
                    <p className="text-[11px] leading-relaxed mt-1 text-neutral-400">
                        <span className="font-bold text-primary-400">Unit Logic:</span> T-Bills are sold in denominations of <span className="text-white">5,000 ETB</span>.
                    </p>
                    <p className="text-[11px] leading-relaxed mt-1 text-indigo-300">
                        <span className="font-bold text-indigo-400">AI Yield:</span> Predicts the cut-off yield using historical NBE patterns based on your tenure.
                    </p>
                </div>
            )}

            {/* Input Fields */}
            <div className="space-y-1 flex-1 overflow-y-auto pr-1 scrollbar-hide mt-1.5">
                {mode === 'forward' ? (
                    <div className="bg-neutral-800/40 rounded-2xl px-4 py-2 border border-emerald-500/30 ring-1 ring-emerald-500/5 transition-all">
                        <div className="flex justify-between items-center gap-4">
                            <div className="text-left shrink-0">
                                <label onClick={focusFaceValue} className="text-sm font-bold text-neutral-300 cursor-pointer hover:text-emerald-400 transition-colors block leading-none mb-1 whitespace-nowrap">Face Value</label>
                                <span className="text-[8px] font-medium text-neutral-500 uppercase tracking-[0.15em] block whitespace-nowrap">Amount at Maturity</span>
                            </div>
                            <FormattedNumberInput
                                ref={faceValueRef}
                                value={faceValue}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setFaceValue(val);
                                    setResult(null);
                                }}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-white font-bold flex-1 min-w-0"
                                placeholder="1,000,000.00"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-800/40 rounded-2xl px-4 py-2 border border-emerald-500/30 ring-1 ring-emerald-500/5 transition-all">
                        <div className="flex justify-between items-center gap-4">
                            <div className="text-left shrink-0">
                                <label onClick={focusTotalBudget} className="text-sm font-bold text-neutral-300 cursor-pointer hover:text-emerald-400 transition-colors block leading-none mb-1 whitespace-nowrap">Budget</label>
                                <span className="text-[8px] font-medium text-neutral-500 uppercase tracking-[0.15em] block whitespace-nowrap">Total Investment</span>
                            </div>
                            <FormattedNumberInput
                                ref={totalBudgetRef}
                                value={totalBudget}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setTotalBudget(val);
                                    setResult(null);
                                }}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-white font-bold flex-1 min-w-0"
                                placeholder="1,000,000.00"
                            />
                        </div>
                    </div>
                )}

                <div className="bg-neutral-800/40 rounded-xl px-3 py-1 border border-transparent hover:border-neutral-700 transition-all flex justify-between items-center">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold text-left">Tenure</label>
                    <div className="flex bg-neutral-900/50 rounded-lg p-0.5 ring-1 ring-neutral-800">
                        {TENURES.map(t => (
                            <button
                                key={t.days}
                                onClick={() => setTenure(t.days)}
                                className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${tenure === t.days ? 'bg-primary-600 text-neutral-900 shadow-lg shadow-primary-900/20' : 'text-neutral-500 hover:text-neutral-300'}`}
                            >
                                {t.days}D
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-neutral-800/40 rounded-xl px-3 py-1.5 border border-transparent hover:border-neutral-700 transition-all">
                        <label onClick={focusDiscountRate} className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1 cursor-pointer hover:text-indigo-400 transition-colors text-left">Discount Rate %</label>
                        <div className="flex items-center justify-between gap-2">
                            {currentPrediction && (
                                <button 
                                    onClick={() => { setDiscountRate(currentPrediction); setResult(null); }} 
                                    className="text-[9px] bg-indigo-600/25 text-indigo-400 font-bold px-2 py-1 rounded-md border border-indigo-500/30 whitespace-nowrap hover:bg-indigo-600/40 transition-all shadow-sm"
                                >
                                    AI: {currentPrediction}%
                                </button>
                            )}
                            <FormattedNumberInput 
                                ref={discountRateRef} 
                                value={discountRate} 
                                onChange={(e) => { setDiscountRate(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0)); setResult(null); }} 
                                decimals={2} 
                                className="bg-transparent text-right text-sm font-mono focus:outline-none w-full text-white font-bold" 
                            />
                        </div>
                    </div>
                    <div className="bg-neutral-800/40 rounded-xl px-3 py-1.5 border border-transparent hover:border-neutral-700 transition-all">
                        <label onClick={focusBrokerageRate} className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1 cursor-pointer hover:text-emerald-400 transition-colors text-left">Commissions %</label>
                        <div className="flex items-center justify-end">
                            <FormattedNumberInput 
                                ref={brokerageRateRef} 
                                value={brokerageRate} 
                                onChange={(e) => { setBrokerageRate(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0)); setResult(null); }} 
                                decimals={2} 
                                className="bg-transparent text-right text-sm font-mono focus:outline-none w-full text-white font-bold" 
                            />
                        </div>
                    </div>
                </div>

                <div ref={auctionsRef} className="relative bg-neutral-800/40 rounded-xl px-3 py-1 border border-transparent hover:border-neutral-700 transition-all flex justify-between items-center">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold text-left">Auction Date</label>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { setShowAuctions(!showAuctions); setResult(null); }} className={`text-[10px] font-bold px-2 py-1 rounded transition-all uppercase tracking-wider ${showAuctions ? 'bg-primary-500 text-neutral-900 shadow-lg shadow-primary-900/40' : 'bg-neutral-800 text-neutral-500 hover:text-white'}`}>{showAuctions ? 'Close' : 'Upcoming'}</button>
                        <div className="flex items-center bg-neutral-900/50 rounded-lg p-0.5 ring-1 ring-neutral-800">
                            <button 
                                onClick={handlePrevAuction}
                                className="p-1 hover:text-primary-400 text-neutral-500 transition-colors"
                                title="Previous Auction"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <input 
                                type="date" 
                                value={auctionDate} 
                                onChange={(e) => { setAuctionDate(e.target.value); setResult(null); }} 
                                className="bg-transparent text-white text-[11px] font-mono focus:outline-none w-[105px] text-center font-bold" 
                            />
                            <button 
                                onClick={handleNextAuction}
                                className="p-1 hover:text-primary-400 text-neutral-500 transition-colors"
                                title="Next Auction"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                    {showAuctions && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-[50] bg-neutral-900 border border-neutral-700 rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/10">
                            <div className="flex justify-between items-center mb-2 border-b border-neutral-800 pb-1">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Next 10 Auctions</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                {nextAuctions.map((date, idx) => (
                                    <button key={idx} onClick={() => { setAuctionDate(formatToLocalDate(date)); setShowAuctions(false); }} className="flex justify-between items-center py-1 px-1.5 rounded hover:bg-primary-600/20 transition-all group">
                                        <span className="text-[10px] font-mono text-neutral-400 group-hover:text-primary-400">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="text-[7px] text-neutral-600 font-bold uppercase group-hover:text-primary-500/50">Wed</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div 
                    ref={bankSelectorRef} 
                    onClick={() => setShowBankSelector(!showBankSelector)}
                    className="relative bg-neutral-800/40 rounded-xl px-3 py-1 border border-transparent hover:border-neutral-700 transition-all duration-300 cursor-pointer group"
                >
                    <div className="flex justify-between items-center">
                        <div className="text-left">
                            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-0.5 group-hover:text-neutral-400 transition-colors text-left">CSD Custodian (Bank)</label>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${bankSource === 'WEGAGEN' ? 'bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]' : bankSource === 'GADAA' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : bankSource === 'AWASH' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : bankSource === 'ETHIO_FIDELITY' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]'}`} />
                                <span className={`text-[11px] font-semibold uppercase tracking-wider ${bankSource === 'WEGAGEN' ? 'text-primary-400' : bankSource === 'GADAA' ? 'text-emerald-400' : bankSource === 'AWASH' ? 'text-amber-400' : bankSource === 'ETHIO_FIDELITY' ? 'text-rose-400' : 'text-violet-400'}`}>
                                    {bankSource === 'WEGAGEN' ? 'Wegagen Capital Investment Bank (WCIB)' : bankSource === 'GADAA' ? 'Gadaa Securities Dealer S.C' : bankSource === 'AWASH' ? 'Awash Capital Investment Bank' : bankSource === 'ETHIO_FIDELITY' ? 'Ethio Fidelity Securities S.C' : 'CBE Capital Investment Bank'}
                                </span>
                            </div>
                        </div>
                        <ChevronDown 
                            size={12} 
                            className={`transition-all duration-300 ${showBankSelector ? 'rotate-180 text-primary-400' : 'text-neutral-600 group-hover:text-neutral-400'}`} 
                        />
                    </div>

                    {showBankSelector && (
                        <div className="absolute left-0 right-0 bottom-full mb-1 z-[50] bg-neutral-900 border border-neutral-700 rounded-xl p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-1 duration-200 ring-1 ring-white/10 max-h-[155px] overflow-y-auto scrollbar-hide">
                            <div className="grid grid-cols-1 gap-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setBankSource('WEGAGEN'); setShowBankSelector(false); }}
                                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${bankSource === 'WEGAGEN' ? 'bg-primary-600/20 border border-primary-500/50' : 'hover:bg-neutral-800 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${bankSource === 'WEGAGEN' ? 'bg-primary-500' : 'bg-neutral-700'}`} />
                                        <div className="text-left">
                                            <p className={`text-[11px] font-bold uppercase tracking-wider ${bankSource === 'WEGAGEN' ? 'text-primary-400' : 'text-neutral-400'}`}>Wegagen Capital Investment Bank (WCIB)</p>
                                            <p className="text-[8px] font-bold text-neutral-500 tracking-tighter">ET81WEGC00141021</p>
                                        </div>
                                    </div>
                                    {bankSource === 'WEGAGEN' && <div className="w-1 h-4 bg-primary-500 rounded-full" />}
                                </button>
                                <button
                                    onClick={() => { setBankSource('GADAA'); setShowBankSelector(false); }}
                                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${bankSource === 'GADAA' ? 'bg-emerald-600/20 border border-emerald-500/50' : 'hover:bg-neutral-800 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${bankSource === 'GADAA' ? 'bg-emerald-500' : 'bg-neutral-700'}`} />
                                        <div className="text-left">
                                            <p className={`text-[11px] font-bold uppercase tracking-wider ${bankSource === 'GADAA' ? 'text-emerald-400' : 'text-neutral-400'}`}>Gadaa Securities Dealer S.C</p>
                                            <p className="text-[8px] font-bold text-neutral-500 tracking-tighter">ET57GADS00110312</p>
                                        </div>
                                    </div>
                                    {bankSource === 'GADAA' && <div className="w-1 h-4 bg-emerald-500 rounded-full" />}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setBankSource('CBE'); setShowBankSelector(false); }}
                                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${bankSource === 'CBE' ? 'bg-violet-600/20 border border-violet-500/50' : 'hover:bg-neutral-800 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${bankSource === 'CBE' ? 'bg-violet-500' : 'bg-neutral-700'}`} />
                                        <div className="text-left">
                                            <p className={`text-[11px] font-bold uppercase tracking-wider ${bankSource === 'CBE' ? 'text-violet-400' : 'text-neutral-400'}`}>CBE Capital Investment Bank</p>
                                            <p className="text-[8px] font-bold text-neutral-500 tracking-tighter">ET49CBEC00140965</p>
                                        </div>
                                    </div>
                                    {bankSource === 'CBE' && <div className="w-1 h-4 bg-violet-500 rounded-full" />}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setBankSource('AWASH'); setShowBankSelector(false); }}
                                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${bankSource === 'AWASH' ? 'bg-amber-600/20 border border-amber-500/50' : 'hover:bg-neutral-800 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${bankSource === 'AWASH' ? 'bg-amber-500' : 'bg-neutral-700'}`} />
                                        <div className="text-left">
                                            <p className={`text-[11px] font-bold uppercase tracking-wider ${bankSource === 'AWASH' ? 'text-amber-400' : 'text-neutral-400'}`}>Awash Capital Investment Bank</p>
                                            <p className="text-[8px] font-bold text-neutral-500 tracking-tighter">ET21AWCA00113140</p>
                                        </div>
                                    </div>
                                    {bankSource === 'AWASH' && <div className="w-1 h-4 bg-amber-500 rounded-full" />}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setBankSource('ETHIO_FIDELITY'); setShowBankSelector(false); }}
                                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${bankSource === 'ETHIO_FIDELITY' ? 'bg-rose-600/20 border border-rose-500/50' : 'hover:bg-neutral-800 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${bankSource === 'ETHIO_FIDELITY' ? 'bg-rose-500' : 'bg-neutral-700'}`} />
                                        <div className="text-left">
                                            <p className={`text-[11px] font-bold uppercase tracking-wider ${bankSource === 'ETHIO_FIDELITY' ? 'text-rose-400' : 'text-neutral-400'}`}>Ethio Fidelity Securities S.C</p>
                                            <p className="text-[8px] font-bold text-neutral-500 tracking-tighter">ET75ETHF00131050</p>
                                        </div>
                                    </div>
                                    {bankSource === 'ETHIO_FIDELITY' && <div className="w-1 h-4 bg-rose-500 rounded-full" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {result ? (() => {
                const isReverse = result.mode === 'reverse';
                return (
                    <div className="mt-1.5 mb-1.5 bg-gradient-to-br from-emerald-900/30 to-neutral-800/50 border border-emerald-500/30 rounded-xl p-2.5 space-y-2">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                                <div className={`flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-tight ${bankSource === 'WEGAGEN' ? 'text-primary-400' : bankSource === 'GADAA' ? 'text-emerald-400' : bankSource === 'AWASH' ? 'text-amber-400' : bankSource === 'ETHIO_FIDELITY' ? 'text-rose-400' : 'text-violet-400'}`}>
                                    <div className={`w-1 h-1 rounded-full ${bankSource === 'WEGAGEN' ? 'bg-primary-500' : bankSource === 'GADAA' ? 'bg-emerald-500' : bankSource === 'AWASH' ? 'bg-amber-500' : bankSource === 'ETHIO_FIDELITY' ? 'bg-rose-500' : 'bg-violet-500'}`} />
                                    {bankSource === 'CBE' ? 'CBE Capital' : bankSource === 'AWASH' ? 'Awash Capital' : bankSource === 'ETHIO_FIDELITY' ? 'Ethio Fidelity' : bankSource} Account
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => { const bankInfo = { WEGAGEN: { name: 'Wegagen Capital Investment Bank (WCIB)', account: 'ET81WEGC00141021' }, GADAA: { name: 'Gadaa Securities Dealer S.C', account: 'ET57GADS00110312' }, CBE: { name: 'CBE Capital Investment Bank', account: 'ET49CBEC00140965' }, AWASH: { name: 'Awash Capital Investment Bank', account: 'ET21AWCA00113140' }, ETHIO_FIDELITY: { name: 'Ethio Fidelity Securities S.C', account: 'ET75ETHF00131050' } }[bankSource]; generateTBillApplicationPDF({ faceValue: result.faceValue, tenure: tenure, issueDate: auctionDate, yieldRate: discountRate, maturityDate: result.maturityDate }, { accountNo: bankInfo.account, bankName: '' }); }} className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${bankSource === 'WEGAGEN' ? 'text-primary-400 hover:text-primary-300' : bankSource === 'GADAA' ? 'text-emerald-400 hover:text-emerald-300' : bankSource === 'AWASH' ? 'text-amber-400 hover:text-amber-300' : bankSource === 'ETHIO_FIDELITY' ? 'text-rose-400 hover:text-rose-300' : 'text-violet-400 hover:text-violet-300'}`} title="Download Application Form"><Download size={11} /> Application</button>
                                <button onClick={() => setShowHistory(true)} className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"><History size={11} /> View History</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-1">
                            {/* Column 1: Identifiers */}
                            <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-700/50 relative group">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1 text-left">Security IDs</p>
                                {result.maturityDate && (() => {
                                    const [y, m, d] = result.maturityDate.split('-');
                                    const datePart = `${y.slice(2)}${m}${d}`;
                                    const symbol = `TBL${tenure}D${datePart}`;
                                    
                                    // Calculate ISIN with Luhn Algorithm (ISO 6166)
                                    const base = `ETTBL${datePart}`;
                                    const charToDigits = (c) => {
                                        const code = c.charCodeAt(0);
                                        return (code >= 48 && code <= 57) ? c : (code - 55).toString();
                                    };
                                    const digitsStr = base.split('').map(charToDigits).join('');
                                    let sum = 0;
                                    for (let i = 0; i < digitsStr.length; i++) {
                                        let v = parseInt(digitsStr[digitsStr.length - 1 - i]);
                                        if (i % 2 === 0) {
                                            v *= 2;
                                            if (v > 9) v = Math.floor(v / 10) + (v % 10);
                                        }
                                        sum += v;
                                    }
                                    const checkDigit = (10 - (sum % 10)) % 10;
                                    const isin = base + checkDigit;

                                    return (
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-tight">SYM:</span>
                                                <span className="text-[9px] font-mono font-bold text-primary-500/80 tracking-wider">{symbol}</span>
                                                <button onClick={(e) => copyToClipboard(symbol, e.currentTarget)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70" title="Copy Symbol"><Copy size={8} /></button>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-tight">ISIN:</span>
                                                <span className="text-[9px] font-mono font-bold text-emerald-500/80 tracking-tight">{isin}</span>
                                                <button onClick={(e) => copyToClipboard(isin, e.currentTarget)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-emerald-500/10 rounded text-emerald-500/70" title="Copy ISIN"><Copy size={8} /></button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            
                            {/* Column 2: Quantity */}
                            <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-700/50 relative group flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Quantity</p>
                                    <button onClick={(e) => { const words = amountToWords(result.quantity).replace('Only', 'Units Only'); copyToClipboard(words, e.currentTarget); }} className="opacity-40 hover:opacity-100 transition-opacity p-1 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400" title="Copy in Words"><Copy size={10} /></button>
                                </div>
                                <p className="text-lg font-bold text-primary-400 leading-none mb-0.5">
                                    {result.quantity.toLocaleString()}
                                    <span className="text-[10px] text-primary-500/60 ml-1 font-bold">UNITS</span>
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-neutral-900/50 rounded-lg p-2 relative group">
                                <div className="flex justify-between items-start">
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Purchase Price</p>
                                    <button onClick={(e) => { const words = amountToWords(result.purchasePrice); copyToClipboard(words, e.currentTarget); }} className="opacity-40 hover:opacity-100 transition-opacity p-1 hover:bg-primary-500/10 rounded-md text-primary-500/70 hover:text-primary-400" title="Copy in Words"><Copy size={10} /></button>
                                </div>
                                <p className="text-lg font-bold text-primary-400">{formatCurrency(result.purchasePrice)}</p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2 relative group">
                                <div className="flex justify-between items-start">
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Commissions ({brokerageRate}%)</p>
                                    <button onClick={(e) => { const words = amountToWords(result.brokerage); copyToClipboard(words, e.currentTarget); }} className="opacity-40 hover:opacity-100 transition-opacity p-1 hover:bg-amber-500/10 rounded-md text-amber-500/70 hover:text-amber-400" title="Copy in Words"><Copy size={10} /></button>
                                </div>
                                <p className="text-lg font-bold text-amber-400">{formatCurrency(result.brokerage)}</p>
                            </div>
                        </div>
                        <div className="bg-neutral-900/80 rounded-lg p-2 border border-emerald-500/30 relative group">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">{isReverse ? 'Face Value You Get' : 'Total Consideration'}</p>
                                        <button onClick={(e) => { const val = isReverse ? result.faceValue : result.totalConsideration; const words = amountToWords(val); copyToClipboard(words, e.currentTarget); }} className="opacity-40 hover:opacity-100 transition-opacity p-0.5 hover:bg-white/10 rounded text-neutral-500 hover:text-white" title="Copy in Words"><Copy size={9} /></button>
                                    </div>
                                    <p className={`text-xl font-bold ${isReverse ? 'text-emerald-400' : 'text-white'}`}>{formatCurrency(isReverse ? result.faceValue : result.totalConsideration)}</p>
                                </div>
                                {isReverse ? (
                                    <div className="text-right space-y-1">
                                        <div>
                                            <div className="flex items-center justify-end gap-1.5">
                                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Actual Cost</p>
                                                <button onClick={(e) => { const words = amountToWords(result.totalConsideration); copyToClipboard(words, e.currentTarget); }} className="opacity-40 hover:opacity-100 transition-opacity p-0.5 hover:bg-white/10 rounded text-neutral-500 hover:text-white" title="Copy in Words"><Copy size={8} /></button>
                                            </div>
                                            <p className="text-sm font-bold text-white">{formatCurrency(result.totalConsideration)}</p>
                                        </div>
                                        <div className="flex items-center justify-end gap-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Bid Price</p>
                                                <p className="text-[10px] font-bold text-indigo-400">{result.bidPrice.toFixed(4)}</p>
                                            </div>
                                            {result.leftover !== 0 && (
                                                <div>
                                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Leftover</p>
                                                    <p className={`text-[10px] font-bold ${result.leftover > 0 ? 'text-emerald-400' : 'text-amber-500'}`}>{formatCurrency(result.leftover)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-right space-y-1">
                                        <div>
                                            <div className="flex items-center justify-end gap-1.5">
                                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Actual Face Value</p>
                                                <button onClick={(e) => { const words = amountToWords(result.faceValue); copyToClipboard(words, e.currentTarget); }} className="opacity-40 hover:opacity-100 transition-opacity p-0.5 hover:bg-white/10 rounded text-neutral-500 hover:text-white" title="Copy in Words"><Copy size={8} /></button>
                                            </div>
                                            <p className="text-sm font-bold text-white">{formatCurrency(result.faceValue)}</p>
                                        </div>
                                        <div className="flex items-center justify-end gap-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Bid Price</p>
                                                <p className="text-[10px] font-bold text-indigo-400">{result.bidPrice.toFixed(4)}</p>
                                            </div>
                                            {result.leftover !== 0 && (
                                                <div>
                                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Leftover (FV)</p>
                                                    <p className="text-[10px] font-bold text-amber-500">{formatCurrency(result.leftover)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-700 mt-1">
                            <div><p className="text-[9px] font-bold text-neutral-500 uppercase">Maturity</p><p className="text-xs font-bold text-white">{result.maturityDate}</p></div>
                            <div><p className="text-[9px] font-bold text-neutral-500 uppercase">Discount</p><p className="text-xs font-bold text-emerald-400">{formatCurrency(result.discountAmount)}</p></div>
                            <div><p className="text-[9px] font-bold text-neutral-500 uppercase">Net Return</p><p className="text-xs font-bold text-emerald-400">{formatCurrency(result.netReturn)}</p></div>
                            <div><p className="text-[9px] font-bold text-neutral-500 uppercase">Eff. Yield</p><p className="text-xs font-bold text-emerald-400">{result.effectiveYield.toFixed(2)}%</p></div>
                        </div>
                    </div>
                );
            })() : (
                <div className="mt-2.5 h-[160px] shrink-0">
                    <AwaitingCalculation Icon={Receipt} />
                </div>
            )}

            <div className="mt-1.5 flex gap-1.5">
                <button onClick={handleClear} className="w-[12%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-2.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider" title="Clear all values"><Trash2 className="w-3.5 h-3.5" /></button>
                <button onClick={toggleHelp} className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center" title="Help Guide"><HelpCircle className="w-4 h-4" /></button>
                <button onClick={toggleSettings} className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center" title="Settings"><Settings className="w-4 h-4" /></button>
                <button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-2.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"><CalculateIcon className="w-5 h-5" /> Calculate</button>
            </div>

            <HistoryOverlay isOpen={showHistory} onClose={() => setShowHistory(false)} module="T-Bill" title="T-Bill" />
        </div>
    );
};

export default TBillCalculator;

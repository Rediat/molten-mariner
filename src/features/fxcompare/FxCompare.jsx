import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowRightLeft, Info, HelpCircle, Settings, ChevronDown, ChevronUp, Trash2, X, TrendingUp, TrendingDown, Search, Calendar } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import tbillData from '../tbill/data.json';
import fxData from './fxData.json';
import { compareReturns, compareRollingReturns, TENURES, getMonthKey, getFxRateWithFallback } from './compareLogic';

const TENURE_OPTIONS = [
    { days: 28, label: '28 Days', sub: '1 Month' },
    { days: 91, label: '91 Days', sub: '3 Months' },
    { days: 182, label: '182 Days', sub: '6 Months' },
    { days: 364, label: '364 Days', sub: '1 Year' },
];

const FxCompare = ({ toggleHelp, toggleSettings }) => {
    // Extract available currencies from the first month of fxData
    const currencies = useMemo(() => {
        if (!fxData || !fxData.monthlyPrices || fxData.monthlyPrices.length === 0) return [];
        return Object.keys(fxData.monthlyPrices[0].value);
    }, []);

    // Filter T-Bill auctions that have overlapping fx data for start and end
    const validAuctions = useMemo(() => {
        if (!fxData || !fxData.monthlyPrices) return [];
        
        // simple helper to check if month exists
        const fxMonths = new Set(fxData.monthlyPrices.map(m => m.month));
        
        return tbillData.filter(auction => {
            const dateStr = new Date(auction.timestamp).toISOString().split('T')[0];
            const startMonth = dateStr.substring(0, 7); // YYYY-MM
            return fxMonths.has(startMonth);
        }).sort((a, b) => b.timestamp - a.timestamp); // newest first
    }, []);

    const [budget, setBudget] = useState(500000);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [selectedAuctionIdx, setSelectedAuctionIdx] = useState(0);

    // Set default auction to ~6 months ago on initial load
    useEffect(() => {
        if (validAuctions.length > 0) {
            const latestMonth = fxData.monthlyPrices[fxData.monthlyPrices.length - 1].month;
            const [y, m] = latestMonth.split('-').map(Number);
            const targetDate = new Date(y, m - 1 - 6, 1);
            
            let bestIdx = 0;
            let minDiff = Infinity;
            validAuctions.forEach((auc, idx) => {
                const diff = Math.abs(auc.timestamp - targetDate.getTime());
                if (diff < minDiff) {
                    minDiff = diff;
                    bestIdx = idx;
                }
            });
            setSelectedAuctionIdx(bestIdx);
        }
    }, [validAuctions]);

    const [resultData, setResultData] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [mode, setMode] = useState('rolling'); // 'rolling' or 'single'
    const [selectedTenure, setSelectedTenure] = useState(28);
    const [rollingResult, setRollingResult] = useState(null);
    const [expandedRounds, setExpandedRounds] = useState(false);
    const [auctionSearch, setAuctionSearch] = useState('');
    const [currencySearch, setCurrencySearch] = useState('');
    const [showAllModal, setShowAllModal] = useState(false);
    
    // Refs for input focus
    const budgetRef = useRef(null);

    const clearField = (setter, ref) => {
        setter(null);
        setResultData(null);
        setRollingResult(null);
        setTimeout(() => {
            if (ref.current) {
                ref.current.focus();
                if (ref.current.select) ref.current.select();
            }
        }, 0);
    };

    const handleClear = () => {
        setResultData(null);
        setRollingResult(null);
    };

    const handleCalculate = () => {
        if (!validAuctions[selectedAuctionIdx]) return;
        if (mode === 'single') {
            setRollingResult(null);
            const res = compareReturns(
                budget || 0,
                validAuctions[selectedAuctionIdx],
                fxData,
                selectedCurrency,
                0.1
            );
            setResultData(res);
        } else {
            setResultData(null);
            setExpandedRounds(false);
            const res = compareRollingReturns(
                budget || 0,
                validAuctions[selectedAuctionIdx],
                tbillData,
                fxData,
                selectedCurrency,
                0.1,
                selectedTenure
            );
            setRollingResult(res);
        }
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const month = d.toLocaleString('en-US', { month: 'short' });
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <ArrowRightLeft className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">
                            FX vs T-Bill Compare
                        </h1>
                        <p className="text-neutral-500 text-[9px] font-medium uppercase tracking-wider text-left">
                            Return Analysis
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex bg-neutral-900/70 rounded-md p-0.5 ring-1 ring-neutral-800">
                        <button
                            onClick={() => { setMode('rolling'); setResultData(null); setRollingResult(null); }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'rolling' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Rolling
                        </button>
                        <button
                            onClick={() => { setMode('single'); setResultData(null); setRollingResult(null); }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'single' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Single
                        </button>
                    </div>
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-emerald-500/30 rounded-xl p-2 mb-2 text-xs text-neutral-300 text-left scale-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                        <Info className="w-3 h-3" />
                        Comparison Methodology
                    </p>
                    <p className="text-[11px] leading-relaxed">
                        Compare investing your budget into Treasury Bills vs. buying foreign currency on the parallel market.
                    </p>
                    <div className="mt-2 space-y-2">
                        <div>
                            <p className="text-[10px] font-bold text-white mb-0.5 uppercase tracking-tight">Single Mode</p>
                            <p className="text-[10px] text-neutral-400">A one-time participation. Buy T-Bills at the start and compare returns at that single maturity date against holding FX for the same period.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white mb-0.5 uppercase tracking-tight">Rolling Mode</p>
                            <p className="text-[10px] text-neutral-400">Continuous reinvestment. Automatically enters subsequent auctions upon maturity until the current date. Compares total compounded returns against long-term FX holding.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Fixed Inputs Area */}
            <div className="space-y-2 shrink-0 mb-2">
                {/* Budget */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-neutral-700 hover:border-neutral-600">
                    <div className="flex justify-between items-center gap-2">
                        <div className="shrink-0 text-left">
                            <label 
                                onClick={() => clearField(setBudget, budgetRef)}
                                className="text-sm font-bold text-white block leading-tight cursor-pointer hover:text-emerald-400 transition-colors select-none"
                            >
                                Investment Budget
                            </label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">ETB</span>
                        </div>
                        <FormattedNumberInput
                            ref={budgetRef}
                            value={budget}
                            onChange={(e) => setBudget(parseFloat(e.target.value.replace(/,/g, '')))}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white font-black min-w-0 flex-1"
                            placeholder="500,000"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {/* Auction Selection */}
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-neutral-700 text-left flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">{mode === 'rolling' ? 'Start Auction' : 'Auction Date'}</label>
                            <input 
                                type="text"
                                placeholder="Search..."
                                value={auctionSearch}
                                onChange={(e) => setAuctionSearch(e.target.value)}
                                className="bg-neutral-900/50 border border-neutral-700 rounded px-1.5 py-0.5 text-[9px] text-white focus:outline-none focus:border-emerald-500 w-16"
                            />
                        </div>
                        
                        {/* Quick Selection Pills for the latest 4 auctions */}
                        {!auctionSearch && validAuctions.length > 0 && (
                            <div className="flex gap-1 mb-1.5 overflow-x-auto no-scrollbar pb-0.5">
                                {validAuctions.slice(0, 3).map((auc, idx) => (
                                    <button
                                        key={auc.timestamp}
                                        onClick={() => setSelectedAuctionIdx(idx)}
                                        className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${selectedAuctionIdx === idx ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-neutral-900 text-neutral-500 hover:text-white'}`}
                                    >
                                        {auc.date.split(',')[0]}
                                    </button>
                                ))}
                            </div>
                        )}

                        <select
                            value={selectedAuctionIdx}
                            onChange={(e) => setSelectedAuctionIdx(parseInt(e.target.value))}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-md text-white text-xs p-1.5 focus:outline-none focus:border-emerald-500"
                        >
                            {validAuctions.length === 0 && <option value="">No overlapping dates</option>}
                            {(() => {
                                const filtered = validAuctions
                                    .map((auc, idx) => ({ ...auc, originalIdx: idx }))
                                    .filter(auc => 
                                        auctionSearch === '' || 
                                        auc.date.toLowerCase().includes(auctionSearch.toLowerCase()) || 
                                        auc.auctionNo.toLowerCase().includes(auctionSearch.toLowerCase())
                                    );

                                if (auctionSearch) {
                                    return filtered.map(auc => (
                                        <option key={auc.timestamp} value={auc.originalIdx}>
                                            {auc.date} ({auc.auctionNo})
                                        </option>
                                    ));
                                }

                                // Group by Month Year
                                const groups = {};
                                filtered.forEach(auc => {
                                    const d = new Date(auc.timestamp);
                                    const key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
                                    if (!groups[key]) groups[key] = [];
                                    groups[key].push(auc);
                                });

                                return Object.entries(groups).map(([groupName, auctions]) => (
                                    <optgroup key={groupName} label={groupName} className="bg-neutral-800 text-emerald-400 font-bold not-italic">
                                        {auctions.map(auc => (
                                            <option key={auc.timestamp} value={auc.originalIdx} className="bg-neutral-900 text-white font-normal">
                                                {auc.date} ({auc.auctionNo})
                                            </option>
                                        ))}
                                    </optgroup>
                                ));
                            })()}
                        </select>
                    </div>

                    {/* Currency Selection */}
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-neutral-700 text-left">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Foreign Currency</label>
                            <input 
                                type="text"
                                placeholder="Search..."
                                value={currencySearch}
                                onChange={(e) => setCurrencySearch(e.target.value)}
                                className="bg-neutral-900/50 border border-neutral-700 rounded px-1.5 py-0.5 text-[9px] text-white focus:outline-none focus:border-emerald-500 w-16"
                            />
                        </div>
                        
                        {/* Quick Selection Pills for common currencies */}
                        {!currencySearch && (
                            <div className="flex gap-1 mb-1.5 overflow-x-auto no-scrollbar pb-0.5">
                                {['USD', 'GOLD', 'BITCOIN'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCurrency(c)}
                                        className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${selectedCurrency === c ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-neutral-900 text-neutral-500 hover:text-white'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowAllModal(true)}
                                    className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black transition-all bg-emerald-600/20 text-emerald-500 ring-1 ring-emerald-600/40 hover:bg-emerald-600/30 hover:text-emerald-400`}
                                >
                                    ALL
                                </button>
                            </div>
                        )}

                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-md text-white text-xs p-1.5 focus:outline-none focus:border-emerald-500"
                        >
                            {currencies
                                .filter(c => currencySearch === '' || c.toLowerCase().includes(currencySearch.toLowerCase()))
                                .map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                        </select>
                    </div>
                </div>

                {/* Tenure Selector - Rolling mode only */}
                {mode === 'rolling' && (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700 text-left">
                        <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Tenure Strategy</label>
                        <div className="grid grid-cols-4 gap-1">
                            {TENURE_OPTIONS.map(t => (
                                <button
                                    key={t.days}
                                    onClick={() => setSelectedTenure(t.days)}
                                    className={`py-1.5 px-1 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${selectedTenure === t.days
                                        ? 'bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/50'
                                        : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'
                                        }`}
                                >
                                    <span className="text-sm font-black leading-none">{t.days}</span>
                                    <span className={`text-[8px] font-bold uppercase tracking-tight ${selectedTenure === t.days ? 'text-emerald-400/80' : 'text-neutral-500'}`}>
                                        {t.sub}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Scrollable Results Section */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {/* Single mode results (unchanged) */}
                {mode === 'single' && resultData && (
                    <div className="mt-2 space-y-3 pb-4">
                        {resultData.error ? (
                            <div className="bg-neutral-800/50 border border-red-500/30 rounded-xl p-3 text-center">
                                <p className="text-xs font-bold text-red-400">Calculation Error</p>
                                <p className="text-[10px] text-neutral-500">{resultData.error}</p>
                            </div>
                        ) : (
                            TENURES.map(tenure => {
                                const res = resultData.results[tenure];
                                if (!res) return null;
                                if (res.error) {
                                    return (
                                        <div key={tenure} className="bg-neutral-800/50 border border-red-500/30 rounded-xl p-3 text-center">
                                            <p className="text-xs font-bold text-red-400">{tenure} Days</p>
                                            <p className="text-[10px] text-neutral-500">{res.error}</p>
                                        </div>
                                    );
                                }
                            const tbillWins = res.winner === 'T-BILL';
                            const fxWins = res.winner === 'FX';
                            return (
                                <div key={tenure} className="bg-neutral-900/60 border border-neutral-700 rounded-xl p-3 relative overflow-hidden">
                                    <div className="flex justify-between items-stretch mb-3">
                                        <div className="text-left">
                                            <h3 className="text-sm font-bold text-white leading-none">{tenure} Days</h3>
                                            <p className="text-[9px] text-neutral-500 uppercase mt-1">Matures: {formatDate(res.maturityDate)}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center text-right ${tbillWins ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            Winner: {res.winner} (+{formatCurrency(res.diffAmount)} ETB | +{res.diffROI.toFixed(2)}% ROI)
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className={`rounded-lg p-2 border ${tbillWins ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">T-Bill Strategy</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Invested</span><span className="text-[10px] text-white font-mono">{formatCurrency(res.tbillInvestment)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">End Value</span><span className={`text-[11px] font-black font-mono ${tbillWins ? 'text-emerald-400' : 'text-neutral-400'}`}>{formatCurrency(res.tbillEndValue)}</span></div>
                                                <div className="flex flex-col gap-1 pt-1 border-t border-neutral-700/50 mt-1">
                                                    <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Yield (Avg)</span><span className="text-[10px] text-emerald-400 font-bold font-mono">{res.tbillYield.toFixed(3)}%</span></div>
                                                    <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Yield (Cut)</span><span className="text-[10px] text-emerald-400/80 font-mono">{res.tbillCutOffYield ? res.tbillCutOffYield.toFixed(3) + '%' : 'N/A'}</span></div>
                                                    <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Eff. Yield</span><span className="text-[10px] text-emerald-400 font-black font-mono">{res.tbillEffectiveYield.toFixed(3)}%</span></div>
                                                </div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Profit</span><span className={`text-[10px] font-bold font-mono ${res.tbillProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{res.tbillProfit >= 0 ? '+' : ''}{formatCurrency(res.tbillProfit)}</span></div>
                                                <div className="flex justify-between items-center"><span className="text-[9px] text-neutral-500 uppercase">ROI</span><span className={`text-[10px] font-bold font-mono ${res.tbillROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>{res.tbillROI.toFixed(2)}%</span></div>
                                            </div>
                                        </div>
                                        <div className={`rounded-lg p-2 border ${fxWins ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">Hold {selectedCurrency}</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Invested</span><span className="text-[10px] text-white font-mono">{formatCurrency(res.fxUnitsBought)} {selectedCurrency}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">End Value</span><span className={`text-[11px] font-black font-mono ${fxWins ? 'text-emerald-400' : 'text-neutral-400'}`}>{formatCurrency(res.fxEndValue)}</span></div>
                                                <div className="flex flex-col gap-1 pt-1 border-t border-neutral-700/50 mt-1">
                                                    <div className="flex flex-col">
                                                        <div className="flex justify-between">
                                                            <span className="text-[9px] text-neutral-500 uppercase">Rate (Start)</span>
                                                            <span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(res.fxStartRate)}</span>
                                                        </div>
                                                        {res.startIsFallback && (
                                                            <span className="text-[7px] text-amber-500 text-right italic font-medium leading-none -mt-0.5">Using {res.startMonthUsed} data</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex justify-between">
                                                            <span className="text-[9px] text-neutral-500 uppercase">Rate (End)</span>
                                                            <span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(res.fxEndRate)}</span>
                                                        </div>
                                                        {res.endIsFallback && (
                                                            <span className="text-[7px] text-amber-500 text-right italic font-medium leading-none -mt-0.5">Using {res.endMonthUsed} data</span>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Multiplier</span><span className="text-[10px] text-emerald-500/80 font-bold font-mono">{(res.fxEndRate / res.fxStartRate).toFixed(4)}x</span></div>
                                                </div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Profit</span><span className={`text-[10px] font-bold font-mono ${res.fxProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{res.fxProfit >= 0 ? '+' : ''}{formatCurrency(res.fxProfit)}</span></div>
                                                <div className="flex justify-between items-center"><span className="text-[9px] text-neutral-500 uppercase">ROI</span><span className={`text-[10px] font-bold font-mono ${res.fxROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>{res.fxROI.toFixed(2)}%</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) )}
                    </div>
                )}

                {/* Rolling mode results */}
                {mode === 'rolling' && rollingResult && (
                    <div className="mt-2 space-y-3 pb-4">
                        {rollingResult.error ? (
                            <div className="bg-neutral-800/50 border border-red-500/30 rounded-xl p-3 text-center">
                                <p className="text-xs font-bold text-red-400">{selectedTenure} Days</p>
                                <p className="text-[10px] text-neutral-500">{rollingResult.error}</p>
                            </div>
                        ) : (
                            <>
                                {/* Summary Header */}
                                <div className="bg-neutral-900/60 border border-neutral-700 rounded-xl p-3">
                                    <div className="flex justify-between items-stretch mb-2">
                                        <div className="text-left">
                                            <h3 className="text-sm font-bold text-white leading-none">{selectedTenure} Days Rolling × {rollingResult.totalRounds}</h3>
                                            <p className="text-[9px] text-neutral-500 uppercase mt-1">{rollingResult.issueDate} → {rollingResult.finalMaturityDate} ({rollingResult.totalDays} days)</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center text-right ${rollingResult.winner === 'T-BILL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {rollingResult.winner} wins (+{formatCurrency(rollingResult.diffAmount)} ETB)
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* T-Bill Rolling Summary */}
                                        <div className={`rounded-lg p-2 border ${rollingResult.winner === 'T-BILL' ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">Rolling T-Bill</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Budget</span><span className="text-[10px] text-white font-mono">{formatCurrency(rollingResult.tbillFinalValue - rollingResult.tbillTotalProfit)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Final Value</span><span className={`text-[11px] font-black font-mono ${rollingResult.winner === 'T-BILL' ? 'text-emerald-400' : 'text-neutral-400'}`}>{formatCurrency(rollingResult.tbillFinalValue)}</span></div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Total Profit</span><span className={`text-[10px] font-bold font-mono ${rollingResult.tbillTotalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{rollingResult.tbillTotalProfit >= 0 ? '+' : ''}{formatCurrency(rollingResult.tbillTotalProfit)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Total ROI</span><span className={`text-[10px] font-bold font-mono ${rollingResult.tbillTotalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>{rollingResult.tbillTotalROI.toFixed(2)}%</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Ann. ROI</span><span className="text-[10px] text-emerald-400 font-black font-mono">{rollingResult.tbillAnnualizedROI.toFixed(2)}%</span></div>
                                            </div>
                                        </div>
                                        {/* FX Hold Summary */}
                                        <div className={`rounded-lg p-2 border ${rollingResult.winner === 'FX' ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">Hold {selectedCurrency}</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Bought</span><span className="text-[10px] text-white font-mono">{formatCurrency(rollingResult.fxUnitsBought)} {selectedCurrency}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">End Value</span><span className={`text-[11px] font-black font-mono ${rollingResult.winner === 'FX' ? 'text-emerald-400' : 'text-neutral-400'}`}>{formatCurrency(rollingResult.fxEndValue)}</span></div>
                                                <div className="flex flex-col gap-1 pt-1 border-t border-neutral-700/50 mt-1">
                                                    <div className="flex flex-col">
                                                        <div className="flex justify-between">
                                                            <span className="text-[9px] text-neutral-500 uppercase">Rate (Start)</span>
                                                            <span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(rollingResult.fxStartRate)}</span>
                                                        </div>
                                                        {rollingResult.startIsFallback && (
                                                            <span className="text-[7px] text-amber-500 text-right italic font-medium leading-none -mt-0.5">Using {rollingResult.startMonthUsed} data</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex justify-between">
                                                            <span className="text-[9px] text-neutral-500 uppercase">Rate (End)</span>
                                                            <span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(rollingResult.fxEndRate)}</span>
                                                        </div>
                                                        {rollingResult.endIsFallback && (
                                                            <span className="text-[7px] text-amber-500 text-right italic font-medium leading-none -mt-0.5">Using {rollingResult.endMonthUsed} data</span>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Multiplier</span><span className="text-[10px] text-emerald-500/80 font-bold font-mono">{(rollingResult.fxEndRate / rollingResult.fxStartRate).toFixed(4)}x</span></div>
                                                </div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Profit</span><span className={`text-[10px] font-bold font-mono ${rollingResult.fxProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{rollingResult.fxProfit >= 0 ? '+' : ''}{formatCurrency(rollingResult.fxProfit)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Total ROI</span><span className={`text-[10px] font-bold font-mono ${rollingResult.fxROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>{rollingResult.fxROI.toFixed(2)}%</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Round-by-round breakdown */}
                                <div className="bg-neutral-900/60 border border-neutral-700 rounded-xl overflow-hidden">
                                    <button onClick={() => setExpandedRounds(!expandedRounds)} className="w-full flex justify-between items-center p-3 hover:bg-neutral-800/30 transition-colors">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Round-by-Round ({rollingResult.totalRounds} rounds)</span>
                                        {expandedRounds ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />}
                                    </button>
                                    {expandedRounds && (
                                        <div className="border-t border-neutral-700/50 divide-y divide-neutral-800/50">
                                            {rollingResult.rounds.map((r, i) => (
                                                <div key={i} className="p-2 px-3 text-left">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-white">Round {i + 1} — {r.auctionNo}</span>
                                                        <span className="text-[9px] text-neutral-500">
                                                            {r.auctionDate} → {formatDate(r.maturityDate)}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[9px]">
                                                        <div className="flex justify-between"><span className="text-neutral-500">Yield</span><span className="text-emerald-400 font-mono font-bold">{r.yield.toFixed(3)}%</span></div>
                                                        <div className="flex justify-between"><span className="text-neutral-500">Qty</span><span className="text-white font-mono">{r.quantity}</span></div>
                                                        <div className="flex justify-between"><span className="text-neutral-500">Invested</span><span className="text-white font-mono">{formatCurrency(r.invested)}</span></div>
                                                        <div className="flex justify-between"><span className="text-neutral-500">End Val</span><span className="text-white font-mono">{formatCurrency(r.endValue)}</span></div>
                                                        <div className="flex justify-between"><span className="text-neutral-500">Profit</span><span className={`font-mono font-bold ${r.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{r.profit >= 0 ? '+' : ''}{formatCurrency(r.profit)}</span></div>
                                                        <div className="flex justify-between"><span className="text-neutral-500">Leftover</span><span className="text-amber-400/80 font-mono">{formatCurrency(r.leftover)}</span></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) }
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-2 flex gap-1.5 shrink-0 pt-1">
                <button
                    onClick={handleClear}
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
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-2.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* All Currencies Comparison Modal */}
            {showAllModal && (
                <AllCurrenciesModal 
                    onClose={() => setShowAllModal(false)}
                    startAuction={validAuctions[selectedAuctionIdx]}
                    fxData={fxData}
                    budget={budget || 0}
                    onSelectCurrency={(c) => { setSelectedCurrency(c); setShowAllModal(false); }}
                    onStartMonthChange={(month) => {
                        const matchingIndices = validAuctions
                            .map((auc, idx) => ({ month: new Date(auc.timestamp).toISOString().substring(0, 7), idx }))
                            .filter(item => item.month === month);
                        
                        if (matchingIndices.length > 0) {
                            // Find the earliest auction in that month (largest index since sorted newest-to-oldest)
                            const earliestIdx = Math.max(...matchingIndices.map(m => m.idx));
                            setSelectedAuctionIdx(earliestIdx);
                        }
                    }}
                />
            )}
        </div>
    );
};

const AllCurrenciesModal = ({ onClose, startAuction, fxData, budget, onSelectCurrency, onStartMonthChange }) => {
    const [search, setSearch] = useState('');
    const [expandedCurrency, setExpandedCurrency] = useState(null);
    
    const latestMonthEntry = fxData.monthlyPrices[fxData.monthlyPrices.length - 1];
    const latestDataMonth = latestMonthEntry.month;
    
    const [modalStartMonth, setModalStartMonthRaw] = useState(() => {
        if (startAuction) {
            const dateStr = new Date(startAuction.timestamp).toISOString().split('T')[0];
            return dateStr.substring(0, 7);
        }
        const [y, m] = latestDataMonth.split('-').map(Number);
        const d = new Date(y, m - 1 - 6, 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    });
    const [modalEndMonth, setModalEndMonthRaw] = useState(latestDataMonth);

    // Ensure end >= start when either changes
    const setModalStartMonth = (val) => {
        setModalStartMonthRaw(val);
        if (onStartMonthChange) onStartMonthChange(val);
        if (val > modalEndMonth) setModalEndMonthRaw(val);
    };
    const setModalEndMonth = (val) => {
        setModalEndMonthRaw(val);
        if (val < modalStartMonth) setModalStartMonthRaw(val);
    };

    // Available years from fxData
    const availableYears = useMemo(() => {
        const years = new Set();
        fxData.monthlyPrices.forEach(m => {
            years.add(m.month.split('-')[0]);
        });
        return Array.from(years).sort();
    }, []);

    const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Available months for a given year (from fxData)
    const getMonthsForYear = (year) => {
        const months = [];
        fxData.monthlyPrices.forEach(m => {
            if (m.month.startsWith(year)) {
                const mo = parseInt(m.month.split('-')[1]);
                months.push(mo);
            }
        });
        return months.sort((a, b) => a - b);
    };

    // Year/month picker open state
    const [startPickerOpen, setStartPickerOpen] = useState(false);
    const [endPickerOpen, setEndPickerOpen] = useState(false);
    const [startPickerYear, setStartPickerYear] = useState(() => modalStartMonth.split('-')[0]);
    const [endPickerYear, setEndPickerYear] = useState(() => modalEndMonth.split('-')[0]);

    const periodBarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (periodBarRef.current && !periodBarRef.current.contains(event.target)) {
                setStartPickerOpen(false);
                setEndPickerOpen(false);
            }
        };
        if (startPickerOpen || endPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [startPickerOpen, endPickerOpen]);

    const results = useMemo(() => {
        if (!fxData || !fxData.monthlyPrices) return [];
        
        const currencies = Object.keys(fxData.monthlyPrices[0].value);
        
        return currencies.map(c => {
            const startInfo = getFxRateWithFallback(fxData, c, modalStartMonth);
            const endInfo = getFxRateWithFallback(fxData, c, modalEndMonth);
            
            if (!startInfo || !endInfo) return null;
            
            const roi = ((endInfo.rate / startInfo.rate) - 1) * 100;
            const unitsBought = budget / startInfo.rate;
            const endValue = unitsBought * endInfo.rate;
            const profit = endValue - budget;
            
            return {
                currency: c,
                displayCode: c === 'GOLD' ? 'XAU' : c === 'BITCOIN' ? 'BTC' : c,
                startRate: startInfo.rate,
                endRate: endInfo.rate,
                roi,
                profit,
                endValue,
                unitsBought,
                startMonth: startInfo.monthUsed,
                endMonth: endInfo.monthUsed,
                multiplier: endInfo.rate / startInfo.rate,
                startIsFallback: startInfo.isFallback,
                endIsFallback: endInfo.isFallback
            };
        }).filter(Boolean).sort((a, b) => b.roi - a.roi);
    }, [fxData, budget, modalStartMonth, modalEndMonth]);

    const filteredResults = results.filter(r => 
        r.currency.toLowerCase().includes(search.toLowerCase()) ||
        r.displayCode.toLowerCase().includes(search.toLowerCase())
    );

    const formatMonth = (m) => {
        const [year, month] = m.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    };

    const periods = results.length > 0 ? {
        start: formatMonth(results[0].startMonth),
        end: formatMonth(results[0].endMonth)
    } : null;

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Inline Year+Month Picker component
    const YearMonthPicker = ({ label, value, onChange, isOpen, setIsOpen, pickerYear, setPickerYear, accentColor = 'emerald' }) => {
        const selectedYear = value.split('-')[0];
        const selectedMo = parseInt(value.split('-')[1]);
        const months = getMonthsForYear(pickerYear);
        const colorMap = {
            emerald: {
                activeBg: 'bg-emerald-600/20', activeText: 'text-emerald-500', activeRing: 'ring-emerald-600/40',
                selectedBg: 'bg-emerald-600', selectedText: 'text-white',
                hoverBg: 'hover:bg-emerald-600/10', hoverText: 'hover:text-emerald-400',
                borderFocus: 'border-emerald-600/50', iconColor: 'text-emerald-500',
            }
        };
        const c = colorMap[accentColor] || colorMap.emerald;

        return (
            <div className="flex-1 relative">
                <button
                    onClick={() => { setIsOpen(!isOpen); if (!isOpen) setPickerYear(selectedYear); }}
                    className={`w-full flex items-center justify-between gap-1 bg-neutral-900 border rounded-lg px-2 py-1.5 transition-all cursor-pointer ${isOpen ? `${c.borderFocus} ring-1 ${c.activeRing}` : 'border-neutral-700 hover:border-neutral-600'}`}
                >
                    <div className="flex items-center gap-1.5">
                        <Calendar className={`w-3.5 h-3.5 ${c.iconColor}`} />
                        <span className="text-[10px] text-neutral-500 font-bold uppercase">{label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-mono font-bold text-white">{MONTH_LABELS[selectedMo - 1]} {selectedYear}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>
                {isOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in slide-in-from-top-1 fade-in duration-150">
                        {/* Year Pills */}
                        <div className="flex items-center gap-1 p-2 border-b border-neutral-800 bg-neutral-900/80">
                            {availableYears.map(y => (
                                <button
                                    key={y}
                                    onClick={() => setPickerYear(y)}
                                    className={`flex-1 py-1.5 rounded-md text-xs font-black transition-all ${pickerYear === y ? `${c.activeBg} ${c.activeText} ring-1 ${c.activeRing}` : 'text-neutral-500 hover:text-white hover:bg-neutral-800'}`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                        {/* Month Grid */}
                        <div className="grid grid-cols-4 gap-1 p-2">
                            {MONTH_LABELS.map((ml, idx) => {
                                const mo = idx + 1;
                                const moKey = `${pickerYear}-${String(mo).padStart(2, '0')}`;
                                const isAvailable = months.includes(mo);
                                const isSelected = value === moKey;
                                return (
                                    <button
                                        key={mo}
                                        disabled={!isAvailable}
                                        onClick={() => {
                                            if (isAvailable) {
                                                onChange(moKey);
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                                            isSelected
                                                ? `${c.selectedBg} ${c.selectedText} shadow-md`
                                                : isAvailable
                                                    ? `bg-neutral-800/60 text-neutral-300 ${c.hoverBg} ${c.hoverText}`
                                                    : 'bg-neutral-900/30 text-neutral-700 cursor-not-allowed'
                                        }`}
                                    >
                                        {ml}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 border border-neutral-800 w-full h-full flex flex-col scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md shrink-0 relative z-20">
                    <div className="flex justify-between items-start mb-3">
                        <div className="text-left">
                            <h2 className="text-lg font-black text-white leading-tight flex items-center gap-2">
                                <span className="p-1.5 bg-emerald-600/20 text-emerald-500 rounded-xl">
                                    <TrendingUp className="w-4 h-4" />
                                </span>
                                All Currency ROI
                            </h2>
                            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mt-0.5">
                                Market Performance Analysis
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Year+Month Period Picker */}
                    <div ref={periodBarRef} className="bg-neutral-800/60 rounded-xl p-2 mb-3 border border-neutral-700/50">
                        <div className="flex items-center gap-2">
                            <YearMonthPicker
                                label="From"
                                value={modalStartMonth}
                                onChange={setModalStartMonth}
                                isOpen={startPickerOpen}
                                setIsOpen={(v) => { setStartPickerOpen(v); if (v) setEndPickerOpen(false); }}
                                pickerYear={startPickerYear}
                                setPickerYear={setStartPickerYear}
                            />
                            <span className="text-[9px] text-neutral-600 font-black shrink-0">→</span>
                            <YearMonthPicker
                                label="To"
                                value={modalEndMonth}
                                onChange={setModalEndMonth}
                                isOpen={endPickerOpen}
                                setIsOpen={(v) => { setEndPickerOpen(v); if (v) setStartPickerOpen(false); }}
                                pickerYear={endPickerYear}
                                setPickerYear={setEndPickerYear}
                            />
                        </div>
                        {/* Quick Presets */}
                        <div className="flex items-center gap-1 mt-1.5 justify-center">
                            {[
                                { label: 'YTD', start: `${new Date().getFullYear()}-01`, end: latestDataMonth },
                                { label: '1Y', start: (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })(), end: latestDataMonth },
                                { label: '2Y', start: (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 2); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })(), end: latestDataMonth },
                                { label: 'All', start: fxData.monthlyPrices[0].month, end: latestDataMonth },
                            ].map(preset => {
                                const isActive = modalStartMonth === preset.start && modalEndMonth === preset.end;
                                return (
                                    <button
                                        key={preset.label}
                                        onClick={() => { setModalStartMonth(preset.start); setModalEndMonth(preset.end); }}
                                        className={`px-3 py-1 rounded text-[10px] font-black transition-all ${isActive ? 'bg-emerald-600/20 text-emerald-500 ring-1 ring-emerald-600/40' : 'text-neutral-500 hover:text-white hover:bg-neutral-800'}`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                        <input 
                            type="text"
                            placeholder="Search currencies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-600/50 transition-colors"
                        />
                    </div>
                </div>


                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar relative z-10">
                    <div className="grid grid-cols-1 gap-2">
                        {filteredResults.map((res, idx) => {
                            const isExpanded = expandedCurrency === res.currency;
                            const isTop = idx === 0;
                            const isTop3 = idx < 3;
                            const maxRoi = filteredResults.length > 0 ? Math.max(filteredResults[0].roi, 1) : 1;
                            const roiPercent = Math.max(0, Math.min(100, (res.roi / maxRoi) * 100));

                            return (
                                <div
                                    key={res.currency}
                                    onClick={() => setExpandedCurrency(isExpanded ? null : res.currency)}
                                    className={`group rounded-2xl border transition-all overflow-hidden cursor-pointer ${isTop ? 'bg-gradient-to-r from-emerald-600/10 to-teal-900/5 border-emerald-600/30 shadow-lg shadow-emerald-600/5' : isTop3 ? 'bg-neutral-800/30 border-neutral-700/40' : 'bg-neutral-800/20 border-neutral-800/50 hover:border-neutral-700/50'}`}
                                >
                                    <div className="p-2.5 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            {/* Rank + Badge */}
                                            <div className="relative shrink-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${isTop ? 'bg-gradient-to-br from-emerald-700 to-emerald-600 text-white shadow-lg shadow-emerald-700/30' : isTop3 ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-800 text-neutral-400'}`}>
                                                    {res.displayCode}
                                                </div>
                                                <span className={`absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black ${isTop ? 'bg-emerald-700 text-white' : isTop3 ? 'bg-neutral-600 text-neutral-200' : 'bg-neutral-700 text-neutral-400'}`}>
                                                    {idx + 1}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className={`font-bold truncate transition-colors text-sm text-left ${isTop ? 'text-emerald-500' : 'text-white group-hover:text-emerald-600'}`}>{res.currency}</h4>
                                                {/* Mini ROI bar */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all ${res.roi >= 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-red-500'}`}
                                                            style={{ width: `${Math.max(2, roiPercent)}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-[9px] font-mono font-bold shrink-0 ${res.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {res.roi >= 0 ? '+' : ''}{res.roi.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <div className="text-right">
                                                <div className={`font-mono font-black tabular-nums ${isTop ? 'text-sm text-emerald-300' : isTop3 ? 'text-xs text-emerald-400' : 'text-[11px] text-emerald-400/80'} ${res.roi < 0 ? '!text-red-400' : ''}`}>
                                                    {res.profit >= 0 ? '+' : ''}{res.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                                </div>
                                                <span className="text-[7px] text-neutral-500 font-bold uppercase">ETB</span>
                                            </div>
                                            <div 
                                                className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-500 group-hover:text-white'}`}
                                            >
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div 
                                            onClick={(e) => e.stopPropagation()}
                                            className="mx-3 mb-3 rounded-xl border border-emerald-600/10 bg-gradient-to-b from-emerald-900/10 to-black/30 overflow-hidden animate-in slide-in-from-top-2 duration-200"
                                        >
                                            <div className="px-3 py-2 bg-emerald-600/5 border-b border-emerald-600/10">
                                                <h5 className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] text-left">Hold {res.currency}</h5>
                                            </div>
                                            <div className="p-3 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Bought</span>
                                                    <span className="text-xs font-mono font-bold text-white">{formatCurrency(res.unitsBought)} <span className="text-neutral-500">{res.displayCode}</span></span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">End Value</span>
                                                    <span className="text-sm font-mono font-black text-emerald-400">{formatCurrency(res.endValue)}</span>
                                                </div>
                                                
                                                <div className="h-px bg-neutral-800/80" />
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Rate (Start)</span>
                                                    <div className="text-right">
                                                        <span className="text-[11px] font-mono text-neutral-300">{formatCurrency(res.startRate)}</span>
                                                        {res.startIsFallback && <div className="text-[7px] text-amber-500 italic leading-none">Using {res.startMonth} data</div>}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Rate (End)</span>
                                                    <div className="text-right">
                                                        <span className="text-[11px] font-mono text-neutral-300">{formatCurrency(res.endRate)}</span>
                                                        {res.endIsFallback && <div className="text-[7px] text-amber-500 italic leading-none">Using {res.endMonth} data</div>}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Multiplier</span>
                                                    <span className="text-[11px] font-mono font-bold text-emerald-400/80">{res.multiplier.toFixed(4)}x</span>
                                                </div>
                                                
                                                <div className="h-px bg-neutral-800/80" />
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Profit</span>
                                                    <span className={`text-sm font-mono font-black ${res.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{res.profit >= 0 ? '+' : ''}{formatCurrency(res.profit)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Total ROI</span>
                                                    <span className={`text-sm font-mono font-black ${res.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{res.roi.toFixed(2)}%</span>
                                                </div>
                                            </div>

                                            <div className="px-3 pb-3">
                                                <button
                                                    onClick={() => onSelectCurrency(res.currency)}
                                                    className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                                                >
                                                    Select {res.displayCode} & Compare
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="px-4 py-2.5 bg-neutral-900 border-t border-neutral-800 shrink-0">
                    <p className="text-[9px] text-neutral-500 text-center">
                        Budget: <span className="text-neutral-300 font-mono font-bold">{budget.toLocaleString()} ETB</span> · {filteredResults.length} currencies
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FxCompare;

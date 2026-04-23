import React, { useState, useMemo, useRef } from 'react';
import { ArrowRightLeft, Info, HelpCircle, Settings, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import tbillData from '../tbill/data.json';
import fxData from './fxData.json';
import { compareReturns, compareRollingReturns, TENURES } from './compareLogic';

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
    const [resultData, setResultData] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [mode, setMode] = useState('rolling'); // 'rolling' or 'single'
    const [selectedTenure, setSelectedTenure] = useState(28);
    const [rollingResult, setRollingResult] = useState(null);
    const [expandedRounds, setExpandedRounds] = useState(false);
    const [auctionSearch, setAuctionSearch] = useState('');
    const [currencySearch, setCurrencySearch] = useState('');
    
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
                                {['USD', 'EUR', 'GBP', 'GOLD'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCurrency(c)}
                                        className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${selectedCurrency === c ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-neutral-900 text-neutral-500 hover:text-white'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
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
                                            <p className="text-[9px] text-neutral-500 uppercase mt-1">Matures: {res.maturityDate}</p>
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
                                                        <span className="text-[9px] text-neutral-500">{r.auctionDate} → {r.maturityDate}</span>
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
        </div>
    );
};

export default FxCompare;

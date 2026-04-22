import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Info, HelpCircle, Settings } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import tbillData from '../tbill/data.json';
import fxData from './fxData.json';
import { compareReturns, TENURES } from './compareLogic';

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

    const handleCalculate = () => {
        if (!validAuctions[selectedAuctionIdx]) return;
        const res = compareReturns(
            budget || 0,
            validAuctions[selectedAuctionIdx],
            fxData,
            selectedCurrency,
            0.1 // 0.1% default brokerage for T-Bills
        );
        setResultData(res);
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <ArrowRightLeft className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">
                            FX vs T-Bill Compare
                        </h1>
                        <p className="text-neutral-500 text-[9px] font-medium uppercase tracking-wider">
                            Return Analysis
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-indigo-500/30 rounded-xl p-2 mb-2 text-xs text-neutral-300 text-left scale-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                        <Info className="w-3 h-3" />
                        Comparison Methodology
                    </p>
                    <p className="text-[11px] leading-relaxed">
                        This tool compares investing your budget into Treasury Bills vs. buying foreign currency on the black market and holding it.
                    </p>
                    <ul className="text-[10px] mt-1 space-y-0.5 list-disc pl-4 text-neutral-400">
                        <li><span className="text-primary-400 font-bold">T-Bill Strategy:</span> Buy max units with budget, hold to maturity, get face value.</li>
                        <li><span className="text-emerald-400 font-bold">FX Strategy:</span> Buy currency at starting month's rate, hold until T-Bill maturity, sell at ending month's rate.</li>
                    </ul>
                </div>
            )}

            {/* Fixed Inputs Area */}
            <div className="space-y-2 shrink-0 mb-2">
                {/* Budget */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-neutral-700 hover:border-neutral-600">
                    <div className="flex justify-between items-center gap-2">
                        <div className="shrink-0">
                            <label className="text-sm font-bold text-white block leading-tight text-left">
                                Investment Budget
                            </label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">ETB</span>
                        </div>
                        <FormattedNumberInput
                            value={budget}
                            onChange={(e) => setBudget(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white font-black min-w-0 flex-1"
                            placeholder="500,000"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {/* Auction Selection */}
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-neutral-700 text-left">
                        <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">T-Bill Auction Date</label>
                        <select
                            value={selectedAuctionIdx}
                            onChange={(e) => setSelectedAuctionIdx(parseInt(e.target.value))}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-md text-white text-xs p-1.5 focus:outline-none focus:border-indigo-500"
                        >
                            {validAuctions.length === 0 && <option value="">No overlapping dates</option>}
                            {validAuctions.map((auc, idx) => (
                                <option key={auc.timestamp} value={idx}>
                                    {auc.date} ({auc.auctionNo})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Currency Selection */}
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-neutral-700 text-left">
                        <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Foreign Currency</label>
                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-md text-white text-xs p-1.5 focus:outline-none focus:border-indigo-500"
                        >
                            {currencies.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Scrollable Results Section */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {resultData && (
                    <div className="mt-2 space-y-3 pb-4">
                        {TENURES.map(tenure => {
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
                                        <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center text-right ${tbillWins ? 'bg-primary-500/20 text-primary-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            Winner: {res.winner} (+{formatCurrency(res.diffAmount)} ETB | +{res.diffROI.toFixed(2)}% ROI)
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* T-Bill Column */}
                                        <div className={`rounded-lg p-2 border ${tbillWins ? 'border-primary-500/40 bg-primary-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-primary-400 uppercase text-center mb-2 tracking-wider">T-Bill Strategy</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Invested</span>
                                                    <span className="text-[10px] text-white font-mono">{formatCurrency(res.tbillInvestment)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">End Value</span>
                                                    <span className={`text-[11px] font-black font-mono ${tbillWins ? 'text-primary-400' : 'text-neutral-400'}`}>{formatCurrency(res.tbillEndValue)}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 pt-1 border-t border-neutral-700/50 mt-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-[9px] text-neutral-500 uppercase">Yield (Avg)</span>
                                                        <span className="text-[10px] text-primary-400 font-bold font-mono">{res.tbillYield.toFixed(3)}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[9px] text-neutral-500 uppercase">Yield (Cut)</span>
                                                        <span className="text-[10px] text-primary-400/80 font-mono">{res.tbillCutOffYield ? res.tbillCutOffYield.toFixed(3) + '%' : 'N/A'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[9px] text-neutral-500 uppercase">Eff. Yield</span>
                                                        <span className="text-[10px] text-primary-400 font-black font-mono">{res.tbillEffectiveYield.toFixed(3)}%</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Profit</span>
                                                    <span className={`text-[10px] font-bold font-mono ${res.tbillProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {res.tbillProfit >= 0 ? '+' : ''}{formatCurrency(res.tbillProfit)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] text-neutral-500 uppercase">ROI</span>
                                                    <span className={`text-[10px] font-bold font-mono ${res.tbillROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {res.tbillROI.toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FX Column */}
                                        <div className={`rounded-lg p-2 border ${fxWins ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">Hold {selectedCurrency}</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Invested</span>
                                                    <span className="text-[10px] text-white font-mono">{formatCurrency(res.fxUnitsBought)} {selectedCurrency}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">End Value</span>
                                                    <span className={`text-[11px] font-black font-mono ${fxWins ? 'text-emerald-400' : 'text-neutral-400'}`}>{formatCurrency(res.fxEndValue)}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 pt-1 border-t border-neutral-700/50 mt-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-[9px] text-neutral-500 uppercase">Rate (Start)</span>
                                                        <span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(res.fxStartRate)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[9px] text-neutral-500 uppercase">Rate (End)</span>
                                                        <span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(res.fxEndRate)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[9px] text-neutral-500 uppercase">Multiplier</span>
                                                        <span className="text-[10px] text-emerald-500/80 font-bold font-mono">{(res.fxEndRate / res.fxStartRate).toFixed(4)}x</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Profit</span>
                                                    <span className={`text-[10px] font-bold font-mono ${res.fxProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {res.fxProfit >= 0 ? '+' : ''}{formatCurrency(res.fxProfit)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] text-neutral-500 uppercase">ROI</span>
                                                    <span className={`text-[10px] font-bold font-mono ${res.fxROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {res.fxROI.toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-2 flex gap-1.5 shrink-0 pt-1">
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
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>
        </div>
    );
};

export default FxCompare;

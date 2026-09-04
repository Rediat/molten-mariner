import React, { useState, useRef, useCallback } from 'react';
import { useInputFocus } from '../../hooks/useInputFocus';
import { calculateEAR } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info, HelpCircle, Trash2, Settings, History, Percent } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const FREQUENCIES = [
    { n: 1, label: 'Annually' },
    { n: 2, label: 'Semi-Annually' },
    { n: 4, label: 'Quarterly' },
    { n: 12, label: 'Monthly' },
    { n: 24, label: 'Semi-Monthly' },
    { n: 26, label: 'Bi-Weekly' },
    { n: 52, label: 'Weekly' },
    { n: 365, label: 'Daily' },
];

const RateConverter = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [nominal, setNominal] = useState(5);
    const [deduction, setDeduction] = useState(10);
    const [compounding, setCompounding] = useState(12);
    const [result, setResult] = useState(null);
    const [netResult, setNetResult] = useState(null);
    const [doublingTime, setDoublingTime] = useState(null);
    const [netDoublingTime, setNetDoublingTime] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Mode toggle: 'toPeriodc' = APR → Periodic, 'toAPR' = Periodic → APR
    const [breakdownMode, setBreakdownMode] = useState('toPeriodic');
    const [periodicRate, setPeriodicRate] = useState(2);
    const [selectedFrequency, setSelectedFrequency] = useState(365); // Default to Daily

    // APR to Periodic settings: Amount and View Type ('rate' vs 'amount')
    const [amount, setAmount] = useState(100000);
    const [periodicViewType, setPeriodicViewType] = useState('rate');

    // Refs for input focus
    const nominalRef = useRef(null);
    const deductionRef = useRef(null);
    const periodicRateRef = useRef(null);
    const amountRef = useRef(null);

    const clearResults = useCallback(() => {
        setResult(null);
        setNetResult(null);
        setDoublingTime(null);
        setNetDoublingTime(null);
    }, []);

    const focusNominal = useInputFocus(setNominal, nominalRef, clearResults);
    const focusDeduction = useInputFocus(setDeduction, deductionRef, clearResults);
    const focusPeriodicRate = useInputFocus(setPeriodicRate, periodicRateRef, clearResults);
    const focusAmount = useInputFocus(setAmount, amountRef);

    const calculateDoubling = (rate, comp) => {
        const r = (rate || 0) / 100;
        if (r <= 0 || !comp) return null;
        const t = Math.log(2) / (comp * Math.log(1 + r / comp));
        const years = Math.floor(t);
        const remainderMonths = (t - years) * 12;
        const months = Math.floor(remainderMonths);
        const days = Math.round((remainderMonths - months) * 30.44);
        return { years, months, days };
    };

    const formatDoublingText = (dt) => {
        if (!dt) return '';
        const parts = [];
        if (dt.years) parts.push(`${dt.years} ${dt.years === 1 ? 'Year' : 'Years'}`);
        if (dt.months) parts.push(`${dt.months} ${dt.months === 1 ? 'Month' : 'Months'}`);
        
        const dayStr = dt.days ? `${dt.days} ${dt.days === 1 ? 'Day' : 'Days'}` : '';
        
        if (parts.length > 0 && dayStr) {
            return `${parts.join(' ')} and ${dayStr}`;
        } else if (parts.length > 0) {
            return parts.join(' and ');
        } else if (dayStr) {
            return dayStr;
        }
        return '0 Days';
    };

    const handleCalculate = () => {
        const nom = nominal || 0;
        const ded = deduction || 0;
        const res = calculateEAR(nom, compounding);
        setResult(res);

        const netNom = nom * (1 - ded / 100);
        const netRes = calculateEAR(netNom, compounding);
        setNetResult(netRes);

        const dTime = calculateDoubling(nom, compounding);
        setDoublingTime(dTime);

        const netDTime = ded > 0 ? calculateDoubling(netNom, compounding) : null;
        setNetDoublingTime(netDTime);

        addToHistory('RATES', { 
            nominal: nom, 
            deduction: ded,
            netNominal: netNom,
            amount: amount || 0,
            compounding, 
            doublingTime: dTime,
            ...(netDTime ? { netDoublingTime: netDTime } : {}),
            ...(ded > 0 ? { netEAR: netRes } : {})
        }, res);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden max-w-lg mx-auto w-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 min-w-0">
                    <Percent className="w-5 h-5 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">Interest Rates</h1>
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
                    <p className="font-bold text-primary-400 mb-1">Interest Rate Converter</p>
                    <p className="text-[11px] leading-relaxed">
                        Convert between Nominal (APR) and Effective Annual Rates (EAR) with deduction/tax adjustments. See periodic rate
                        breakdowns and calculate how long it takes to double your investment at Gross and Net rates.
                    </p>
                </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 space-y-2 overflow-y-auto custom-scrollbar pb-1">
                <div className="bg-neutral-800/50 rounded-xl p-2.5 shrink-0 space-y-2">
                    <div className="flex gap-2 w-full">
                        <div className="group relative bg-neutral-800/40 rounded-xl p-2.5 transition-all duration-300 border border-neutral-700/50 hover:border-neutral-600 flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex flex-col items-start text-left min-w-0">
                                    <label 
                                        onClick={focusNominal}
                                        className="text-xs font-bold text-neutral-300 cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                                        title="Click to Clear"
                                    >
                                        Nominal (%)
                                    </label>
                                    <span className="uppercase tracking-tighter text-neutral-500 font-bold truncate w-full text-[8px]">
                                        Annual Rate (APR)
                                    </span>
                                </div>
                                <div className="relative flex-1 flex items-center justify-end min-w-0">
                                    <FormattedNumberInput 
                                        ref={nominalRef}
                                        value={nominal} 
                                        onChange={(e) => {
                                            const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                            setNominal(val);
                                            clearResults();
                                        }} 
                                        className="w-full bg-transparent text-right font-mono text-white focus:outline-none text-base font-bold placeholder-neutral-600" 
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="group relative bg-neutral-800/40 rounded-xl p-2.5 transition-all duration-300 border border-neutral-700/50 hover:border-neutral-600 flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex flex-col items-start text-left min-w-0">
                                    <label 
                                        onClick={focusDeduction}
                                        className="text-xs font-bold text-neutral-300 cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                                        title="Click to Clear"
                                    >
                                        Deduction %
                                    </label>
                                    <span className="uppercase tracking-tighter text-neutral-500 font-bold truncate w-full text-[8px]">
                                        Deduction / Tax Rate
                                    </span>
                                </div>
                                <div className="relative flex-1 flex items-center justify-end min-w-0">
                                    <FormattedNumberInput 
                                        ref={deductionRef}
                                        value={deduction} 
                                        onChange={(e) => {
                                            const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                            setDeduction(val);
                                            clearResults();
                                        }} 
                                        className="w-full bg-transparent text-right font-mono text-white focus:outline-none text-base font-bold placeholder-neutral-600" 
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 pt-0.5">
                        <div className="flex justify-between items-center">
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-left">Compounding</label>
                            {compounding && (
                                <span className="text-[9px] font-mono font-bold text-primary-400 uppercase">
                                    {FREQUENCIES.find(f => f.n === compounding)?.label || ''} ({compounding}/yr)
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {FREQUENCIES.map(freq => (
                                <button key={freq.n} onClick={() => { setCompounding(freq.n); clearResults(); }}
                                    className={`py-1 px-1 rounded text-[9px] font-bold transition-all ${compounding === freq.n ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'}`}>
                                    {freq.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-neutral-800/20 rounded-xl overflow-hidden border border-neutral-800/50 min-h-0">
                    {result !== null ? (
                        <>
                            <div className="bg-neutral-800/80 p-2.5 border-b border-neutral-800">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Effective Annual Rate</span>
                                    <button
                                        onClick={() => setShowHistory(true)}
                                        className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                                    >
                                        <History size={12} /> History
                                    </button>
                                </div>
                                {deduction > 0 ? (
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <div className="bg-neutral-900/60 rounded-lg p-2 border border-neutral-700/50 text-left">
                                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Gross EAR</span>
                                            <div className="text-xl font-bold text-white font-mono">{result.toFixed(4)}%</div>
                                            <div className="text-[9px] text-neutral-500 font-mono mt-0.5">APR: {(nominal || 0).toFixed(2)}%</div>
                                        </div>
                                        <div className="bg-neutral-900/60 rounded-lg p-2 border border-emerald-500/30 text-right">
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Net EAR ({100 - deduction}%)</span>
                                            <div className="text-xl font-bold text-emerald-400 font-mono">{netResult !== null ? netResult.toFixed(4) : '0.0000'}%</div>
                                            <div className="text-[9px] text-emerald-500/80 font-mono mt-0.5">Net APR: {((nominal || 0) * (1 - deduction / 100)).toFixed(2)}%</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-2xl font-bold text-white font-mono text-center">{result.toFixed(4)}%</div>
                                )}

                                {/* Investment Doubling Time as text information below Effective Interest Rate */}
                                {doublingTime && (
                                    <div className="mt-2 pt-2 border-t border-neutral-700/50 text-left">
                                        <div className="text-[9px] font-bold text-primary-400 uppercase tracking-wider mb-1">
                                            Investment Doubling Time
                                        </div>
                                        {deduction > 0 ? (
                                            <div className="space-y-1 font-mono text-xs">
                                                <div className="flex justify-between items-center gap-2">
                                                    <span className="text-[10px] text-neutral-400 font-sans font-bold uppercase tracking-tight">Gross:</span>
                                                    <span className="text-xs text-white font-medium">{formatDoublingText(doublingTime)}</span>
                                                </div>
                                                {netDoublingTime && (
                                                    <div className="flex justify-between items-center gap-2">
                                                        <span className="text-[10px] text-emerald-400 font-sans font-bold uppercase tracking-tight">Net:</span>
                                                        <span className="text-xs text-emerald-400 font-medium">{formatDoublingText(netDoublingTime)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-xs font-mono text-white font-medium">
                                                {formatDoublingText(doublingTime)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                                {/* Mode Toggle */}
                                <div className="flex mb-2 bg-neutral-900/50 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setBreakdownMode('toPeriodic')}
                                        className={`flex-1 py-1 px-2 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${breakdownMode === 'toPeriodic' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        APR → Periodic
                                    </button>
                                    <button
                                        onClick={() => setBreakdownMode('toAPR')}
                                        className={`flex-1 py-1 px-2 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${breakdownMode === 'toAPR' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        Periodic → APR
                                    </button>
                                </div>

                                {breakdownMode === 'toPeriodic' ? (
                                    /* APR → Periodic Mode */
                                    <div className="space-y-2">
                                        {/* Amount Input & View Toggle Bar */}
                                        <div className="bg-neutral-900/50 rounded-xl p-2 border border-neutral-700/50 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="flex flex-col items-start text-left shrink-0">
                                                    <label 
                                                        onClick={focusAmount}
                                                        className="text-[10px] font-bold text-neutral-300 cursor-pointer hover:text-primary-400 transition-colors whitespace-nowrap"
                                                        title="Click to Clear"
                                                    >
                                                        Amount
                                                    </label>
                                                    <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-tighter">Principal</span>
                                                </div>
                                                <div className="relative flex-1 min-w-0">
                                                    <FormattedNumberInput
                                                        ref={amountRef}
                                                        value={amount}
                                                        onChange={(e) => {
                                                            const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                                            setAmount(val);
                                                        }}
                                                        className="w-full bg-transparent text-right font-mono text-white focus:outline-none text-sm font-bold placeholder-neutral-600 border-b border-neutral-700/50 focus:border-primary-500 transition-colors pb-0.5"
                                                        placeholder="100,000"
                                                    />
                                                </div>
                                            </div>

                                            {/* View Selector: Rate (%) vs Interest Amount ($) */}
                                            <div className="flex bg-neutral-950/70 rounded-lg p-0.5 shrink-0 border border-neutral-800">
                                                <button
                                                    onClick={() => setPeriodicViewType('rate')}
                                                    className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${periodicViewType === 'rate' ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                                                    title="Display interest rate percentages"
                                                >
                                                    Rate %
                                                </button>
                                                <button
                                                    onClick={() => setPeriodicViewType('amount')}
                                                    className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${periodicViewType === 'amount' ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                                                    title="Display interest amounts based on principal"
                                                >
                                                    Interest
                                                </button>
                                            </div>
                                        </div>

                                        {/* Table Header */}
                                        {deduction > 0 && (
                                            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-neutral-500 px-1 pt-0.5 border-b border-neutral-800">
                                                <span>Frequency</span>
                                                <div className="flex gap-4 font-mono">
                                                    <span className="w-24 text-right">Gross {periodicViewType === 'rate' ? '(%)' : ''}</span>
                                                    <span className="w-24 text-right text-emerald-400">Net {periodicViewType === 'rate' ? '(%)' : ''}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Breakdown List */}
                                        <div className="space-y-1">
                                            {FREQUENCIES.map(freq => {
                                                const nom = nominal || 0;
                                                const ded = deduction || 0;
                                                const amt = amount || 0;

                                                const grossRate = nom / freq.n;
                                                const netRate = (nom * (1 - ded / 100)) / freq.n;

                                                const grossAmt = amt * (grossRate / 100);
                                                const netAmt = amt * (netRate / 100);

                                                return (
                                                    <div key={freq.n} className="flex justify-between items-center py-1.5 px-1 border-b border-neutral-800/50 last:border-0 text-xs">
                                                        <span className="text-neutral-400 truncate mr-2">{freq.label}</span>
                                                        {deduction > 0 ? (
                                                            <div className="flex gap-4 font-mono text-xs">
                                                                <span className="w-24 text-right text-neutral-400">
                                                                    {periodicViewType === 'rate'
                                                                        ? `${grossRate.toFixed(4)}%`
                                                                        : grossAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </span>
                                                                <span className="w-24 text-right text-emerald-400 font-bold">
                                                                    {periodicViewType === 'rate'
                                                                        ? `${netRate.toFixed(4)}%`
                                                                        : netAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-mono text-primary-400 font-bold">
                                                                {periodicViewType === 'rate'
                                                                    ? `${grossRate.toFixed(4)}%`
                                                                    : grossAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    /* Periodic → APR Mode */
                                    <div className="space-y-3">
                                        {/* Periodic Rate Input */}
                                        <div className="flex items-center gap-2">
                                            <label 
                                                onClick={focusPeriodicRate}
                                                className="text-[10px] font-bold text-neutral-500 shrink-0 cursor-pointer hover:text-primary-400 transition-colors"
                                                title="Click to Clear"
                                            >
                                                Rate (%)
                                            </label>
                                            <FormattedNumberInput
                                                ref={periodicRateRef}
                                                value={periodicRate}
                                                onChange={(e) => {
                                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                                    setPeriodicRate(val);
                                                }}
                                                className="flex-1 bg-transparent text-sm font-mono text-white focus:outline-none border-b border-neutral-700 focus:border-primary-500 transition-colors pb-0.5 text-right"
                                            />
                                        </div>

                                        {/* Frequency Selector */}
                                        <div className="grid grid-cols-4 gap-1">
                                            {FREQUENCIES.map(freq => (
                                                <button
                                                    key={freq.n}
                                                    onClick={() => setSelectedFrequency(freq.n)}
                                                    className={`py-1 px-1 rounded text-[9px] font-bold transition-all ${selectedFrequency === freq.n ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-800'}`}
                                                >
                                                    {freq.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Results */}
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="bg-neutral-900/50 rounded-lg p-2 border border-white/5 text-left">
                                                <div className="text-[8px] text-neutral-500 uppercase font-bold mb-0.5">Simple APR</div>
                                                <div className="text-sm font-bold text-white font-mono">
                                                    {((periodicRate || 0) * selectedFrequency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                                </div>
                                                {deduction > 0 && (
                                                    <div className="text-[10px] font-bold text-emerald-400 font-mono mt-0.5">
                                                        Net: {((periodicRate || 0) * (1 - deduction / 100) * selectedFrequency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-neutral-900/50 rounded-lg p-2 border border-white/5 text-left">
                                                <div className="text-[8px] text-neutral-500 uppercase font-bold mb-0.5">Compound APY</div>
                                                <div className="text-sm font-bold text-primary-400 font-mono">
                                                    {((Math.pow(1 + (periodicRate || 0) / 100, selectedFrequency) - 1) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                                </div>
                                                {deduction > 0 && (
                                                    <div className="text-[10px] font-bold text-emerald-400 font-mono mt-0.5">
                                                        Net: {((Math.pow(1 + ((periodicRate || 0) * (1 - deduction / 100)) / 100, selectedFrequency) - 1) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-600 p-4">
                            <Info className="w-6 h-6 mb-2 opacity-50" />
                            <p className="text-[10px] text-center uppercase tracking-wider">Results will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-2 flex gap-1.5 shrink-0">
                <button
                    onClick={() => {
                        setResult(null);
                        setNetResult(null);
                        setDoublingTime(null);
                        setNetDoublingTime(null);
                        setDeduction(0);
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
                module="RATES"
                title="Rate Converter"
            />
        </div>
    );
};

export default RateConverter;

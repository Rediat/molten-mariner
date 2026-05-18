import React, { useState, useRef, useCallback } from 'react';
import { useInputFocus } from '../../hooks/useInputFocus';
import { useHistory } from '../../context/HistoryContext';
import { Info, HelpCircle, Trash2, Settings, History, Landmark } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const calculateEmploymentTax = (salary) => {
    if (salary <= 2000) return 0;
    if (salary <= 4000) return salary * 0.15 - 300;
    if (salary <= 7000) return salary * 0.20 - 500;
    if (salary <= 10000) return salary * 0.25 - 850;
    if (salary <= 14000) return salary * 0.30 - 1350;
    return salary * 0.35 - 2050;
};

const calculateRentalTaxAnnual = (annualRent) => {
    if (annualRent <= 24000) return 0;
    if (annualRent <= 48000) return annualRent * 0.15 - 3600;
    if (annualRent <= 84000) return annualRent * 0.20 - 6000;
    if (annualRent <= 120000) return annualRent * 0.25 - 10200;
    if (annualRent <= 168000) return annualRent * 0.30 - 16200;
    return annualRent * 0.35 - 24600;
};

const DEFAULTS = {
    salary: { amount: 174830.40, taxableAllowance: 20000, purchasePrice: 0 },
    rent: { amount: 25000, taxableAllowance: 0, purchasePrice: 0 },
    chance: { amount: 500000, taxableAllowance: 0, purchasePrice: 0 },
    capital: { amount: 3000, taxableAllowance: 0, purchasePrice: 1000 }
};

const TaxCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [mode, setMode] = useState('salary'); // 'salary', 'rent', 'chance', 'capital'
    const [values, setValues] = useState({
        amount: 174830.40,
        taxableAllowance: 20000,
        purchasePrice: 0
    });
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for input focus
    const inputRefs = {
        amount: useRef(null),
        taxableAllowance: useRef(null),
        purchasePrice: useRef(null)
    };

    const clearResults = useCallback(() => {
        setResult(null);
    }, []);

    const focusAmount = useInputFocus((val) => setValues(prev => ({ ...prev, amount: val })), inputRefs.amount, clearResults);
    const focusTaxableAllowance = useInputFocus((val) => setValues(prev => ({ ...prev, taxableAllowance: val })), inputRefs.taxableAllowance, clearResults);
    const focusPurchasePrice = useInputFocus((val) => setValues(prev => ({ ...prev, purchasePrice: val })), inputRefs.purchasePrice, clearResults);

    const handleCalculate = () => {
        const amt = values.amount || 0;
        const allowance = mode === 'salary' ? (values.taxableAllowance || 0) : 0;
        
        let tax = 0;
        let pension = 0;
        let netIncome = 0;
        let gross = amt + allowance;
        let taxableGain = 0;
        let taxableAmount = 0;
        let quarterlyPayment = 0;

        if (mode === 'salary') {
            tax = calculateEmploymentTax(gross);
            pension = amt * 0.07; // 7% employee pension contribution on base salary
            netIncome = gross - tax - pension;
        } else if (mode === 'rent') {
            gross = amt * 12;
            taxableAmount = gross * 0.50;
            tax = calculateRentalTaxAnnual(taxableAmount);
            netIncome = gross - tax;
            quarterlyPayment = tax / 4;
        } else if (mode === 'chance') {
            tax = amt * 0.20; // 20% flat tax
            netIncome = amt - tax;
        } else if (mode === 'capital') {
            const C = amt;
            const A = values.purchasePrice || 0;
            const B = A * 0.30;
            taxableGain = C - (A + B);
            if (taxableGain < 0) taxableGain = 0;
            tax = taxableGain * 0.15; // 15% flat tax
            netIncome = C - tax;
            gross = C;
        }

        const res = { tax, pension, netIncome, gross, taxableGain, taxableAmount, quarterlyPayment };
        setResult(res);
        addToHistory('TAX', { mode: mode.toUpperCase(), amount: amt, ...(mode === 'salary' && allowance ? { allowance } : {}), ...(mode === 'capital' ? { purchasePrice: values.purchasePrice } : {}) }, res);
    };

    const handleChange = (field, val) => {
        const numericVal = val === '' ? null : (parseFloat(val.toString().replace(/,/g, '')) || 0);
        setValues(prev => ({ ...prev, [field]: numericVal }));
        setResult(null);
    };

    const getModeConfig = () => {
        switch (mode) {
            case 'salary': return { label: 'Monthly Salary', sub: 'ETB Gross' };
            case 'rent': return { label: 'Monthly Rent', sub: 'ETB Gross' };
            case 'chance': return { label: 'Winning Amount', sub: 'ETB Gross' };
            case 'capital': return { label: 'Selling Price', sub: 'Consideration (C)' };
            default: return { label: 'Amount', sub: 'ETB' };
        }
    };

    const config = getModeConfig();

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <Landmark className="w-5 h-5 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">Tax Calculator</h1>
                        <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">Proclamation No.1395/2025</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
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
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2 mb-2 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Ethiopian Tax Calculator</p>
                    <p className="text-[11px] leading-relaxed">
                        Calculates taxes based on Proclamation No.1395/2025. 
                        Includes Employment Tax, Rental Income Tax, Games of Chance (20%), and Capital Gains (15%).
                    </p>
                </div>
            )}

            <div className="bg-neutral-800 p-1 rounded-xl flex mb-3 overflow-x-auto scrollbar-hide">
                {[
                    { val: 'salary', label: 'SALARY' },
                    { val: 'rent', label: 'RENT' },
                    { val: 'chance', label: 'CHANCE' },
                    { val: 'capital', label: 'CAPITAL' }
                ].map(opt => (
                    <button key={opt.val} 
                        onClick={() => { 
                            setMode(opt.val); 
                            setResult(null); 
                            setValues(DEFAULTS[opt.val]);
                        }}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap flex-1 ${mode === opt.val ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'}`}>
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="space-y-0.5 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                <div className="bg-neutral-800/40 rounded-lg p-1.5 flex justify-between items-center gap-4 border border-transparent hover:border-neutral-700 transition-all">
                    <div className="flex flex-col shrink-0 items-start text-left">
                        <label 
                            onClick={focusAmount}
                            className="text-sm font-bold text-neutral-300 cursor-pointer hover:text-primary-400 transition-colors"
                            title="Click to Clear"
                        >
                            {config.label}
                        </label>
                        <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">{config.sub}</span>
                    </div>
                    <FormattedNumberInput 
                        ref={inputRefs.amount}
                        value={values.amount} 
                        onChange={(e) => handleChange('amount', e.target.value)} 
                        decimals={2} 
                        className="bg-transparent text-right text-lg font-mono text-white focus:outline-none w-full flex-1" 
                    />
                </div>

                {mode === 'salary' && (
                    <div className="bg-neutral-800/40 rounded-lg p-1.5 flex justify-between items-center gap-4 border border-transparent hover:border-neutral-700 transition-all mt-0.5">
                        <div className="flex flex-col shrink-0 items-start text-left">
                            <label 
                                onClick={focusTaxableAllowance}
                                className="text-sm font-bold text-neutral-300 cursor-pointer hover:text-primary-400 transition-colors"
                                title="Click to Clear"
                            >
                                Taxable Allowance
                            </label>
                            <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">Non-Pensionable</span>
                        </div>
                        <FormattedNumberInput 
                            ref={inputRefs.taxableAllowance}
                            value={values.taxableAllowance} 
                            onChange={(e) => handleChange('taxableAllowance', e.target.value)} 
                            decimals={2} 
                            className="bg-transparent text-right text-lg font-mono text-white focus:outline-none w-full flex-1" 
                        />
                    </div>
                )}

                {mode === 'capital' && (
                    <div className="bg-neutral-800/40 rounded-lg p-1.5 flex justify-between items-center gap-4 border border-transparent hover:border-neutral-700 transition-all mt-0.5">
                        <div className="flex flex-col shrink-0 items-start text-left">
                            <label 
                                onClick={focusPurchasePrice}
                                className="text-sm font-bold text-neutral-300 cursor-pointer hover:text-primary-400 transition-colors"
                                title="Click to Clear"
                            >
                                Original Cost
                            </label>
                            <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">Purchase Price (A)</span>
                        </div>
                        <FormattedNumberInput 
                            ref={inputRefs.purchasePrice}
                            value={values.purchasePrice} 
                            onChange={(e) => handleChange('purchasePrice', e.target.value)} 
                            decimals={2} 
                            className="bg-transparent text-right text-lg font-mono text-white focus:outline-none w-full flex-1" 
                        />
                    </div>
                )}

                {result !== null && (
                    <div className="space-y-2 mb-2 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                            >
                                <History size={12} /> View History
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                                <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1 text-left">{mode === 'rent' ? 'Annual Gross' : mode === 'capital' ? 'Selling Price' : 'Gross Amount'}</div>
                                <span className="text-sm font-bold text-white font-mono self-end">
                                    {result.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            
                            {mode === 'salary' && (
                                <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                                    <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1 text-left">Pension (7%)</div>
                                    <span className="text-sm font-bold text-white font-mono self-end">
                                        {result.pension.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}

                            {mode === 'rent' && (
                                <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                                    <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1 text-left">Taxable Rent (50%)</div>
                                    <span className="text-sm font-bold text-white font-mono self-end">
                                        {result.taxableAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}

                            {mode === 'capital' && (
                                <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                                    <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1 text-left">Taxable Gain</div>
                                    <span className="text-sm font-bold text-white font-mono self-end">
                                        {result.taxableGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}

                            <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                                <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1 text-left">
                                    {mode === 'rent' 
                                        ? 'Annual Tax' 
                                        : mode === 'chance' 
                                            ? 'Tax Amount (20%)' 
                                            : mode === 'capital' 
                                                ? 'Tax Amount (15%)' 
                                                : mode === 'salary'
                                                    ? `Tax Amount (${result.gross > 0 ? ((result.tax / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                    : 'Tax Amount'}
                                </div>
                                <span className="text-lg font-bold text-red-400 font-mono self-end">
                                    {result.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>

                            {mode === 'rent' && (
                                <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                                    <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1 text-left">Quarterly Payment</div>
                                    <span className="text-lg font-bold text-red-400 font-mono self-end">
                                        {result.quarterlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                            
                            <div className={`bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between ${mode === 'chance' || mode === 'rent' ? 'col-span-2' : ''}`}>
                                <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1 text-left">{mode === 'rent' ? 'Annual Net' : mode === 'capital' ? 'Net Proceeds' : 'Net Income'}</div>
                                <span className="text-lg font-bold text-primary-500 font-mono self-end">
                                    {result.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-1.5 mt-1 pt-2">
                <button
                    onClick={() => {
                        setResult(null);
                        setValues({ amount: 0, taxableAllowance: 0, purchasePrice: 0 });
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
                module="TAX"
                title="Tax History"
            />
        </div>
    );
};

export default TaxCalculator;

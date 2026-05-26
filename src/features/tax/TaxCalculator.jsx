import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useInputFocus } from '../../hooks/useInputFocus';
import { useHistory } from '../../context/HistoryContext';
import { Info, HelpCircle, Trash2, Settings, History, Landmark, Copy } from 'lucide-react';
import { amountToWords } from '../../utils/text-utils';
import { copyToClipboard } from '../../utils/clipboard';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import AwaitingCalculation from '../../components/AwaitingCalculation';

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

const calculateBusinessTaxAnnual = (annualIncome) => {
    if (annualIncome <= 24000) return 0;
    if (annualIncome <= 48000) return annualIncome * 0.15 - 3600;
    if (annualIncome <= 84000) return annualIncome * 0.20 - 6000;
    if (annualIncome <= 120000) return annualIncome * 0.25 - 10200;
    if (annualIncome <= 168000) return annualIncome * 0.30 - 16200;
    return annualIncome * 0.35 - 24600;
};

const calculateSalesTax = (grossSales) => {
    if (grossSales <= 100000) return grossSales * 0.02;
    if (grossSales <= 500000) return grossSales * 0.03;
    if (grossSales <= 1000000) return grossSales * 0.05;
    if (grossSales <= 1500000) return grossSales * 0.07;
    return grossSales * 0.09;
};

const getSalesTaxRate = (grossSales) => {
    if (grossSales <= 100000) return 2;
    if (grossSales <= 500000) return 3;
    if (grossSales <= 1000000) return 5;
    if (grossSales <= 1500000) return 7;
    return 9;
};

const DEFAULTS = {
    salary: { amount: 174830.40, taxableAllowance: 20000, purchasePrice: 0 },
    rent: { amount: 25000, taxableAllowance: 0, purchasePrice: 0 },
    chance: { amount: 500000, taxableAllowance: 0, purchasePrice: 0 },
    capital: { amount: 3000, taxableAllowance: 0, purchasePrice: 1000 },
    interest: { amount: 10000, taxableAllowance: 0, purchasePrice: 0 },
    dividend: { amount: 15000, taxableAllowance: 0, purchasePrice: 0 },
    business: { amount: 150000, taxableAllowance: 0, purchasePrice: 0 },
    sales: { amount: 120000, taxableAllowance: 0, purchasePrice: 0 },
    cbeCapital: { amount: 100000, taxableAllowance: 0, purchasePrice: 0 }
};

const TaxCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [mode, setMode] = useState('salary'); // 'salary', 'rent', 'chance', 'capital', 'cbeCapital'
    const [securityType, setSecurityType] = useState('tbill'); // default to 'tbill'
    const transactionType = 'buy';
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

    const handleCalculate = (logHistory = true) => {
        const amt = values.amount || 0;
        const allowance = mode === 'salary' ? (values.taxableAllowance || 0) : 0;

        let tax = 0;
        let pension = 0;
        let netIncome = 0;
        let gross = amt + allowance;
        let taxableGain = 0;
        let taxableAmount = 0;
        let quarterlyPayment = 0;

        // CBE Capital brokerage fees & regulatory charges
        let commission = 0;
        let vat = 0;
        let esx = 0;
        let ecma = 0;
        let totalFees = 0;
        let netProceeds = 0;

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
        } else if (mode === 'interest') {
            tax = amt * 0.10; // 10% flat tax under Proclamation No.1395/2025
            netIncome = amt - tax;
            gross = amt;
        } else if (mode === 'dividend') {
            tax = amt * 0.15; // 15% flat tax under Proclamation No.1395/2025
            netIncome = amt - tax;
            gross = amt;
        } else if (mode === 'business') {
            tax = calculateBusinessTaxAnnual(amt);
            netIncome = amt - tax;
            gross = amt;
        } else if (mode === 'sales') {
            tax = calculateSalesTax(amt);
            netIncome = amt - tax;
            gross = amt;
        } else if (mode === 'cbeCapital') {
            let rate = 0.016;
            let esxRate = 0.0036; // 0.36% exchange fee
            let ecmaRate = 0.0015; // 0.15% regulatory fee

            if (securityType === 'equity_main') {
                rate = 0.016;
                esxRate = 0.0036;
                ecmaRate = 0.0015;
            } else if (securityType === 'equity_otc') {
                rate = 0.02;
                esxRate = 0.005; // 0.5% exchange fee for OTC
                ecmaRate = 0.0015;
            } else if (securityType === 'funds_etf') {
                rate = 0.02;
                esxRate = 0.0036;
                ecmaRate = 0.0015;
            } else if (securityType === 'fixed_income') {
                rate = 0.001; // 0.1%
                esxRate = 0.00021; // 0.021%
                ecmaRate = 0.00005; // 0.005%
            } else if (securityType === 'tbill') {
                rate = 0.001; // 0.1%
                esxRate = 0.0; // 0.0% (no ESX fee for primary T-Bill)
                ecmaRate = 0.00005; // 0.005%
            }

            commission = amt * rate;
            vat = commission * 0.15; // 15% VAT on CBE commission
            esx = amt * esxRate;
            ecma = amt * ecmaRate;
            totalFees = commission + vat + esx + ecma;
            netProceeds = transactionType === 'buy' ? amt + totalFees : amt - totalFees;
            gross = amt;
        }

        const res = {
            tax,
            pension,
            netIncome,
            gross,
            taxableGain,
            taxableAmount,
            quarterlyPayment,
            totalDeduction: tax + pension,
            commission,
            vat,
            esx,
            ecma,
            totalFees,
            netProceeds,
            securityType,
            transactionType
        };
        setResult(res);

        const historyInputs = {
            mode: mode.toUpperCase(),
            amount: amt,
            ...(mode === 'salary' && allowance ? { allowance } : {}),
            ...(mode === 'capital' ? { purchasePrice: values.purchasePrice } : {}),
            ...(mode === 'cbeCapital' ? { securityType, transactionType } : {})
        };

        const historyResult = mode === 'cbeCapital' ? {
            gross: amt,
            commission,
            vat,
            esx,
            ecma,
            totalFees,
            netProceeds
        } : res;

        if (logHistory === true || (logHistory && typeof logHistory === 'object')) {
            addToHistory('TAX', historyInputs, historyResult);
        }
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
            case 'interest': return { label: 'Interest Income', sub: 'ETB Gross' };
            case 'dividend': return { label: 'Dividend Income', sub: 'ETB Gross' };
            case 'business': return { label: 'Taxable Business Income', sub: 'ETB per Year' };
            case 'sales': return { label: 'Annual Gross Sales', sub: 'Category B Receipts' };
            case 'cbeCapital': return { label: 'Transaction Value', sub: 'ETB Gross' };
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
                        Includes Employment Tax, Rental Income, Games of Chance (20%), Capital Gains (15%), Interest Income (10%), Dividend Income (15%), Business Income Tax (up to 35%), and Category B Sales Tax (2% - 9%).
                    </p>
                </div>
            )}

            <div className="space-y-1 mb-1.5 mt-1 shrink-0">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-left">Tax Category</label>
                <div className="grid grid-cols-3 gap-1">
                    {[
                        { val: 'salary', label: 'Salary' },
                        { val: 'rent', label: 'Rent' },
                        { val: 'business', label: 'Business' },
                        { val: 'sales', label: 'Sales' },
                        { val: 'chance', label: 'Chance' },
                        { val: 'interest', label: 'Interest' },
                        { val: 'capital', label: 'Capital' },
                        { val: 'dividend', label: 'Dividend' },
                        { val: 'cbeCapital', label: 'Brokerage' }
                    ].map(opt => (
                        <button key={opt.val}
                            onClick={() => {
                                setMode(opt.val);
                                setResult(null);
                                setValues(DEFAULTS[opt.val]);
                                if (opt.val === 'cbeCapital') {
                                    setSecurityType('tbill');
                                }
                            }}
                            className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${mode === opt.val ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'}`}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {mode !== 'cbeCapital' ? (
                /* Standard modes: Single Scrollable Container */
                <div className="space-y-0.5 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                    {/* Amount Input */}
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

                    {/* Salary Allowance Input */}
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

                    {/* Capital Cost Input */}
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

                    {/* Standard Results */}
                    {result === null && (
                        <div className="mt-2.5 h-[140px] shrink-0">
                            <AwaitingCalculation Icon={Landmark} />
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
                                <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between group relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-[10px] uppercase font-bold text-neutral-500 text-left">
                                            {mode === 'rent'
                                                ? 'Annual Gross'
                                                : mode === 'capital'
                                                    ? 'Selling Price'
                                                    : mode === 'interest'
                                                        ? 'Gross Interest'
                                                        : mode === 'dividend'
                                                            ? 'Gross Dividend'
                                                            : mode === 'business'
                                                                ? 'Taxable Profit'
                                                                : mode === 'sales'
                                                                    ? 'Gross Sales'
                                                                    : 'Gross Amount'}
                                        </div>
                                        {['salary', 'rent'].includes(mode) && (
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.gross);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <span className="text-sm font-bold text-white font-mono">
                                                {result.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            {mode === 'salary' && (
                                                <span className="select-none text-[8px] font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase tracking-widest leading-none">
                                                    mo
                                                </span>
                                            )}
                                        </div>
                                        {mode === 'salary' && (
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <span className="text-[11px] font-medium text-neutral-400 font-mono">
                                                    {(result.gross * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="select-none text-[7px] font-bold px-1 py-0.25 rounded bg-neutral-900 text-neutral-500 uppercase tracking-widest leading-none">
                                                    yr
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {mode === 'salary' && (
                                    <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between group relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-bold text-neutral-500 text-left">Pension (7%)</div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.pension);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9} />
                                            </button>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <span className="text-sm font-bold text-white font-mono">
                                                    {result.pension.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="select-none text-[8px] font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase tracking-widest leading-none">
                                                    mo
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <span className="text-[11px] font-medium text-neutral-400 font-mono">
                                                    {(result.pension * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="select-none text-[7px] font-bold px-1 py-0.25 rounded bg-neutral-900 text-neutral-500 uppercase tracking-widest leading-none">
                                                    yr
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === 'rent' && (
                                    <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between group relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-bold text-neutral-500 text-left">Taxable Rent (50%)</div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.taxableAmount);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold text-white font-mono self-end">
                                            {result.taxableAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}

                                {mode === 'capital' && (
                                    <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                                        <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1 text-left">
                                            Taxable Gain ({result.gross > 0 ? ((result.taxableGain / result.gross) * 100).toFixed(2) : '0.00'}%)
                                        </div>
                                        <span className="text-sm font-bold text-white font-mono self-end">
                                            {result.taxableGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}

                                <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between group relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-[10px] uppercase font-bold text-neutral-500 text-left">
                                            {mode === 'rent'
                                                ? `Annual Tax (${result.gross > 0 ? ((result.tax / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                : mode === 'chance'
                                                    ? 'Tax Amount (20%)'
                                                    : mode === 'capital'
                                                        ? 'Tax Amount (15%)'
                                                        : mode === 'interest'
                                                            ? 'Tax Amount (10%)'
                                                            : mode === 'dividend'
                                                                ? 'Tax Amount (15%)'
                                                                : mode === 'business'
                                                                    ? `Annual Tax (${result.gross > 0 ? ((result.tax / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                                    : mode === 'sales'
                                                                        ? `Annual Tax (${result.gross > 0 ? getSalesTaxRate(result.gross) : '0'}%)`
                                                                        : mode === 'salary'
                                                                            ? `Tax Amount (${result.gross > 0 ? ((result.tax / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                                            : 'Tax Amount'}
                                        </div>
                                        {['salary', 'rent'].includes(mode) && (
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.tax);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-500/10 rounded text-red-400/70 hover:text-red-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <span className="text-lg font-bold text-red-400 font-mono">
                                                {result.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            {mode === 'salary' && (
                                                <span className="select-none text-[8px] font-black px-1.5 py-0.5 rounded bg-red-950/40 text-red-400/80 uppercase tracking-widest leading-none">
                                                    mo
                                                </span>
                                            )}
                                        </div>
                                        {mode === 'salary' && (
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <span className="text-xs font-bold text-red-400/80 font-mono">
                                                    {(result.tax * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="select-none text-[7px] font-bold px-1 py-0.25 rounded bg-red-950/20 text-red-500/50 uppercase tracking-widest leading-none">
                                                    yr
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {mode === 'salary' && (
                                    <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between group relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-bold text-neutral-500 text-left">
                                                Total Deduction ({result.gross > 0 ? (((result.tax + result.pension) / result.gross) * 100).toFixed(2) : '0.00'}%)
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.totalDeduction);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-500/10 rounded text-red-400/70 hover:text-red-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9} />
                                            </button>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <span className="text-lg font-bold text-red-400 font-mono">
                                                    {result.totalDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="select-none text-[8px] font-black px-1.5 py-0.5 rounded bg-red-950/40 text-red-400/80 uppercase tracking-widest leading-none">
                                                    mo
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <span className="text-xs font-bold text-red-400/80 font-mono">
                                                    {(result.totalDeduction * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="select-none text-[7px] font-bold px-1 py-0.25 rounded bg-red-950/20 text-red-500/50 uppercase tracking-widest leading-none">
                                                    yr
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === 'rent' && (
                                    <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between group relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-bold text-neutral-500 text-left">Quarterly Payment</div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.quarterlyPayment);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-500/10 rounded text-red-400/70 hover:text-red-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9} />
                                            </button>
                                        </div>
                                        <span className="text-lg font-bold text-red-400 font-mono self-end">
                                            {result.quarterlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}

                                <div className={`bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between group relative ${['chance', 'rent', 'interest', 'dividend', 'business', 'sales', 'salary'].includes(mode) ? 'col-span-2' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-[10px] uppercase font-bold text-neutral-500 text-left">
                                            {mode === 'rent'
                                                ? `Annual Net (${result.gross > 0 ? ((result.netIncome / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                : mode === 'capital'
                                                    ? `Net Proceeds (${result.gross > 0 ? ((result.netIncome / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                    : mode === 'interest'
                                                        ? `Net Interest (${result.gross > 0 ? ((result.netIncome / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                        : mode === 'dividend'
                                                            ? `Net Dividend (${result.gross > 0 ? ((result.netIncome / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                            : mode === 'business'
                                                                ? `Net Business Profit (${result.gross > 0 ? ((result.netIncome / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                                : mode === 'sales'
                                                                    ? `Net Sales Proceeds (${result.gross > 0 ? ((result.netIncome / result.gross) * 100).toFixed(2) : '0.00'}%)`
                                                                    : `Net Income (${result.gross > 0 ? ((result.netIncome / result.gross) * 100).toFixed(2) : '0.00'}%)`}
                                        </div>
                                        {['salary', 'rent'].includes(mode) && (
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.netIncome);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className="text-lg font-bold text-primary-500 font-mono">
                                            {result.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        {mode === 'salary' && (
                                            <span className="select-none text-[8px] font-black px-1.5 py-0.5 rounded bg-primary-950/40 text-primary-400/80 uppercase tracking-widest leading-none">
                                                mo
                                            </span>
                                        )}
                                    </div>
                                    {mode === 'salary' && (
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <span className="text-xs font-bold text-primary-400/80 font-mono">
                                                {(result.netIncome * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <span className="select-none text-[7px] font-bold px-1 py-0.25 rounded bg-primary-950/20 text-primary-500/50 uppercase tracking-widest leading-none">
                                                yr
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Brokerage Mode Only */
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Fixed Brokerage Inputs */}
                    <div className="space-y-1 shrink-0 mb-1">
                        {/* Transaction Value Input */}
                        <div className="bg-neutral-800/40 rounded-lg py-1 px-1.5 flex justify-between items-center gap-4 border border-transparent hover:border-neutral-700 transition-all">
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

                        {/* Security Type Selector */}
                        <div className="bg-neutral-800/40 rounded-lg py-1.5 px-2 border border-transparent hover:border-neutral-700 transition-all">
                            <label className="block text-[9.5px] font-bold text-neutral-500 uppercase tracking-wider text-left mb-1">Security Type</label>

                            <div className="grid grid-cols-2 gap-1">
                                {[
                                    { val: 'equity_main', label: 'Equity (Main)', rate: '1.6%' },
                                    { val: 'equity_otc', label: 'Equity (OTC)', rate: '2.0%' },
                                    { val: 'funds_etf', label: 'Funds & ETFs', rate: '2.0%' },
                                    { val: 'fixed_income', label: 'Fixed Income', rate: '0.1%' }
                                ].map(sec => (
                                    <button
                                        key={sec.val}
                                        onClick={() => {
                                            setSecurityType(sec.val);
                                            setResult(null);
                                        }}
                                        className={`py-1 px-1.5 rounded-md text-[11px] font-semibold transition-all text-left flex justify-between items-center ${securityType === sec.val ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'}`}
                                    >
                                        <span className="truncate">{sec.label}</span>
                                        <span className={`px-1 py-0.25 rounded text-[8.5px] leading-none shrink-0 ${securityType === sec.val ? 'bg-primary-500/20 text-primary-400' : 'bg-neutral-800 text-neutral-600'}`}>{sec.rate}</span>
                                    </button>
                                ))}
                                {/* T-Bill spans 2 columns */}
                                {[
                                    { val: 'tbill', label: 'Treasury Bill', rate: '0.1%' }
                                ].map(sec => (
                                    <button
                                        key={sec.val}
                                        onClick={() => {
                                            setSecurityType(sec.val);
                                            setResult(null);
                                        }}
                                        className={`col-span-2 py-1 px-1.5 rounded-md text-[11px] font-semibold transition-all text-left flex justify-between items-center ${securityType === sec.val ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'}`}
                                    >
                                        <span>{sec.label}</span>
                                        <span className={`px-1 py-0.25 rounded text-[8.5px] leading-none shrink-0 ${securityType === sec.val ? 'bg-primary-500/20 text-primary-400' : 'bg-neutral-800 text-neutral-600'}`}>{sec.rate}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Relaxed Height Results Box with Placeholder strictly for Brokerage Mode */}
                    <div className="flex-grow flex-1 overflow-y-auto pr-1 scrollbar-hide min-h-0">
                        {result === null && (
                            <AwaitingCalculation Icon={Landmark} />
                        )}

                        {result !== null && (
                            <div className="space-y-1.5 mb-1.5 pt-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Charges breakdown</span>
                                    <button
                                        onClick={() => setShowHistory(true)}
                                        className="text-[10px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                                    >
                                        <History size={12} /> View History
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {/* Gross Transaction Value */}
                                    <div className="bg-neutral-900/50 rounded-xl p-2 border border-neutral-800 flex flex-col justify-between group relative hover:border-neutral-700 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-extrabold text-neutral-500 text-left tracking-wider">Gross Value</div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.gross);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9.5} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold text-white font-mono self-end">
                                            {result.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* Brokerage Commission */}
                                    <div className="bg-neutral-900/50 rounded-xl p-2 border border-neutral-800 flex flex-col justify-between group relative hover:border-neutral-700 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-extrabold text-neutral-500 text-left tracking-wider">
                                                Commission ({securityType === 'equity_main' ? '1.6%' : securityType === 'equity_otc' || securityType === 'funds_etf' ? '2.0%' : '0.1%'})
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.commission);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9.5} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold text-white font-mono self-end">
                                            {result.commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* VAT on Commission */}
                                    <div className="bg-neutral-900/50 rounded-xl p-2 border border-neutral-800 flex flex-col justify-between group relative hover:border-neutral-700 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-extrabold text-neutral-500 text-left tracking-wider">VAT on Fee (15%)</div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.vat);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9.5} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold text-red-400 font-mono self-end">
                                            {result.vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* ESX Fee */}
                                    <div className="bg-neutral-900/50 rounded-xl p-2 border border-neutral-800 flex flex-col justify-between group relative hover:border-neutral-700 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-extrabold text-neutral-500 text-left tracking-wider font-semibold">
                                                ESX Fee ({securityType === 'fixed_income' ? '0.021%' : securityType === 'equity_otc' ? '0.5%' : securityType === 'tbill' ? '0%' : '0.36%'})
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.esx);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9.5} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold text-amber-500 font-mono self-end">
                                            {result.esx.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* ECMA Fee */}
                                    <div className="bg-neutral-900/50 rounded-xl p-2 border border-neutral-800 flex flex-col justify-between group relative hover:border-neutral-700 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-extrabold text-neutral-500 text-left tracking-wider">
                                                ECMA Fee ({['fixed_income', 'tbill'].includes(securityType) ? '0.005%' : '0.15%'})
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.ecma);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9.5} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold text-indigo-400 font-mono self-end">
                                            {result.ecma.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* Total Charges */}
                                    <div className="bg-neutral-900/50 rounded-xl p-2 border border-neutral-800 flex flex-col justify-between group relative hover:border-neutral-700 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="text-[10px] uppercase font-extrabold text-neutral-500 text-left tracking-wider">Total Charges</div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.totalFees);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9.5} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold text-red-400 font-mono self-end">
                                            {result.totalFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    {/* Net Proceeds / Total Settlement (Spans full width) */}
                                    <div className="bg-neutral-900/50 rounded-xl py-1.5 px-2 border border-neutral-800 flex flex-col justify-between group relative col-span-2 hover:border-neutral-700 transition-all">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <div className="text-[10px] uppercase font-black text-neutral-500 text-left font-black tracking-widest">
                                                {transactionType === 'buy' ? 'Total Cost (Settlement)' : 'Net Proceeds (To Receive)'}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    const words = amountToWords(result.netProceeds);
                                                    copyToClipboard(words, e.currentTarget);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary-500/10 rounded text-primary-500/70 hover:text-primary-400"
                                                title="Copy in Words"
                                            >
                                                <Copy size={9.5} />
                                            </button>
                                        </div>
                                        <span className="text-lg font-black font-mono self-end text-primary-500">
                                            {result.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex gap-1.5 mt-1 pt-1">
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

import React, { useState, useMemo, useRef, useEffect, useCallback, useId } from 'react';
import { useInputFocus } from '../../hooks/useInputFocus';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createStandardPDF, addStandardFooter, STANDARD_TABLE_STYLES } from '../../utils/pdf-utils';
import * as XLSX from 'xlsx';
import { ArrowRightLeft, Info, HelpCircle, Settings, ChevronDown, ChevronUp, Trash2, X, TrendingUp, TrendingDown, Search, Calendar, FileSpreadsheet, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import AwaitingCalculation from '../../components/AwaitingCalculation';
import tbillData from '../tbill/data.json';
import fxData from './fxData.json';
import bankFxData from './bankFxData.json';
import { compareReturns, compareRollingReturns, compareLeverageReturns, compareDepositReturns, TENURES, getMonthKey, getFxRateWithFallback } from './compareLogic';

const CURRENCY_NAMES = {
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'CHF': 'Swiss Franc',
    'CAD': 'Canadian Dollar',
    'AUD': 'Australian Dollar',
    'CNY': 'Chinese Yuan',
    'GBP': 'British Pound',
    'SEK': 'Swedish Krona',
    'KWD': 'Kuwaiti Dinar',
    'AED': 'UAE Dirham',
    'SAR': 'Saudi Riyal',
    'QAR': 'Qatari Riyal',
    'OMR': 'Omani Rial',
    'JOD': 'Jordanian Dinar',
    'BHD': 'Bahraini Dinar',
    'TRY': 'Turkish Lira',
    'EGP': 'Egyptian Pound',
    'YER': 'Yemeni Rial',
    'ILS': 'New Israel Shekel',
    'INR': 'Indian Rupee',
    'PKR': 'Pakistani Rupee',
    'XAU': 'Gold',
    'XAG': 'Silver',
    'XPT': 'Platinum',
    'XCU': 'Copper',
    'XSN': 'Tin',
    'ZNC': 'Zinc',
    'XPB': 'Lead',
    'XNI': 'Nickel',
    'BTC': 'Bitcoin'
};

const TENURE_OPTIONS = [
    { days: 28, label: '28 Days', sub: '1 Month' },
    { days: 91, label: '91 Days', sub: '3 Months' },
    { days: 182, label: '182 Days', sub: '6 Months' },
    { days: 364, label: '364 Days', sub: '1 Year' },
];

const FxCompare = ({ toggleHelp, toggleSettings, tbillBrokerageRate }) => {
    const brokerageRate = tbillBrokerageRate !== undefined ? tbillBrokerageRate : 0.105;

    const [rateSource, setRateSource] = useState('bank'); // 'black' or 'bank'
    const activeFxData = useMemo(() => {
        return rateSource === 'bank' ? bankFxData : fxData;
    }, [rateSource]);

    // Extract available currencies from the first month of activeFxData
    const currencies = useMemo(() => {
        if (!activeFxData || !activeFxData.monthlyPrices || activeFxData.monthlyPrices.length === 0) return [];
        return Object.keys(activeFxData.monthlyPrices[0].value).sort();
    }, [activeFxData]);

    // Filter T-Bill auctions that have overlapping fx data for start and end
    const validAuctions = useMemo(() => {
        if (!activeFxData || !activeFxData.monthlyPrices) return [];
        
        // simple helper to check if month exists
        const fxMonths = new Set(activeFxData.monthlyPrices.map(m => m.month));
        
        return tbillData.filter(auction => {
            const startMonth = getMonthKey(auction.timestamp);
            return fxMonths.has(startMonth);
        }).sort((a, b) => b.timestamp - a.timestamp); // newest first
    }, [activeFxData]);

    const [budget, setBudget] = useState(1000000);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [selectedAuctionIdx, setSelectedAuctionIdx] = useState(0);

    // Auto-adjust selected currency if it is not supported in the active source
    useEffect(() => {
        if (currencies.length > 0 && !currencies.includes(selectedCurrency)) {
            setSelectedCurrency(currencies[0]);
        }
    }, [currencies, selectedCurrency]);

    // Set default auction to ~6 months ago on initial load
    useEffect(() => {
        if (validAuctions.length > 0) {
            const latestMonth = activeFxData.monthlyPrices[activeFxData.monthlyPrices.length - 1].month;
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
    }, [validAuctions, activeFxData]);

    const [resultData, setResultData] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [mode, setMode] = useState('leverage'); // 'leverage' or 'rolling' or 'single' or 'deposit'
    const [selectedTenure, setSelectedTenure] = useState(365);
    const [rollingResult, setRollingResult] = useState(null);
    const [leverageResult, setLeverageResult] = useState(null);
    const [depositCompareResult, setDepositCompareResult] = useState(null);
    const [foreignApr, setForeignApr] = useState(14.0);
    const [localApr, setLocalApr] = useState(25.0);
    const [foreignCompounding, setForeignCompounding] = useState(12); // monthly
    const [localCompounding, setLocalCompounding] = useState(365); // daily
    const [foreignTaxRate, setForeignTaxRate] = useState(10.0);
    const [localTaxRate, setLocalTaxRate] = useState(10.0);
    const [foreignReinvestRate, setForeignReinvestRate] = useState(100);
    const [localReinvestRate, setLocalReinvestRate] = useState(100);
    
    const latestMonthEntry = activeFxData.monthlyPrices[activeFxData.monthlyPrices.length - 1];
    const latestDataMonth = latestMonthEntry.month;
    
    const [depositStartMonth, setDepositStartMonthRaw] = useState(() => {
        const [y, m] = latestDataMonth.split('-').map(Number);
        const d = new Date(y, m - 1 - 6, 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    });
    const [depositEndMonth, setDepositEndMonthRaw] = useState(latestDataMonth);
    const [depositStartPickerOpen, setDepositStartPickerOpen] = useState(false);
    const [depositEndPickerOpen, setDepositEndPickerOpen] = useState(false);
    const [depositStartPickerYear, setDepositStartPickerYear] = useState(() => depositStartMonth.split('-')[0]);
    const [depositEndPickerYear, setDepositEndPickerYear] = useState(() => depositEndMonth.split('-')[0]);
    
    const depositPeriodBarRef = useRef(null);

    const setDepositStartMonth = (val) => {
        setDepositStartMonthRaw(val);
        if (val > depositEndMonth) setDepositEndMonthRaw(val);
        handleClear();
    };
    const setDepositEndMonth = (val) => {
        setDepositEndMonthRaw(val);
        if (val < depositStartMonth) setDepositStartMonthRaw(val);
        handleClear();
    };

    const [loanRate, setLoanRate] = useState(12.5);
    const [loanYears, setLoanYears] = useState(7);
    const [loanFrequency, setLoanFrequency] = useState(12);
    const [customTbillRate, setCustomTbillRate] = useState(25);
    const [expandedRounds, setExpandedRounds] = useState(false);
    const [auctionSearch, setAuctionSearch] = useState('');
    const [currencySearch, setCurrencySearch] = useState('');
    const [compareAllResult, setCompareAllResult] = useState(null);
    const [compareSearch, setCompareSearch] = useState('');
    const [expandedCurrency, setExpandedCurrency] = useState(null);
    const [reinvestmentPercentage, setReinvestmentPercentage] = useState(100);
    const [leverageAsset, setLeverageAsset] = useState('deposit'); // Default to deposit
    const [depositInterestType, setDepositInterestType] = useState('compounding'); // 'compounding' or 'simple'
    const [depositCompoundingFreq, setDepositCompoundingFreq] = useState(0); // 0 = At Maturity
    const [depositTaxRate, setDepositTaxRate] = useState(10);
    
    // Refs for input focus
    const budgetRef = useRef(null);
    const tbillRateRef = useRef(null);
    const loanRateRef = useRef(null);
    const loanYearsRef = useRef(null);
    const depositTaxRef = useRef(null);
    const foreignAprRef = useRef(null);
    const localAprRef = useRef(null);
    const foreignTaxRef = useRef(null);
    const localTaxRef = useRef(null);

    const handleClear = useCallback(() => {
        setResultData(null);
        setRollingResult(null);
        setLeverageResult(null);
        setDepositCompareResult(null);
        setCompareAllResult(null);
    }, []);

    const focusBudget = useInputFocus(setBudget, budgetRef, handleClear);
    const focusTbillRate = useInputFocus(setCustomTbillRate, tbillRateRef, handleClear);
    const focusLoanRate = useInputFocus(setLoanRate, loanRateRef, handleClear);
    const focusLoanYears = useInputFocus(setLoanYears, loanYearsRef, handleClear);
    const focusDepositTax = useInputFocus(setDepositTaxRate, depositTaxRef, handleClear);
    const focusForeignApr = useInputFocus(setForeignApr, foreignAprRef, handleClear);
    const focusLocalApr = useInputFocus(setLocalApr, localAprRef, handleClear);
    const focusForeignTax = useInputFocus(setForeignTaxRate, foreignTaxRef, handleClear);
    const focusLocalTax = useInputFocus(setLocalTaxRate, localTaxRef, handleClear);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (depositPeriodBarRef.current && !depositPeriodBarRef.current.contains(event.target)) {
                setDepositStartPickerOpen(false);
                setDepositEndPickerOpen(false);
            }
        };
        if (depositStartPickerOpen || depositEndPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [depositStartPickerOpen, depositEndPickerOpen]);

    const handleCalculate = () => {
        if (mode !== 'deposit' && mode !== 'compareAll' && !validAuctions[selectedAuctionIdx]) return;
        setResultData(null);
        setRollingResult(null);
        setLeverageResult(null);
        setDepositCompareResult(null);
        setExpandedRounds(false);

        if (mode === 'single') {
            const res = compareReturns(
                budget || 0,
                validAuctions[selectedAuctionIdx],
                activeFxData,
                selectedCurrency,
                brokerageRate
            );
            setResultData(res);
        } else if (mode === 'rolling') {
            const res = compareRollingReturns(
                budget || 0,
                validAuctions[selectedAuctionIdx],
                tbillData,
                activeFxData,
                selectedCurrency,
                brokerageRate,
                selectedTenure
            );
            setRollingResult(res);
        } else if (mode === 'leverage') {
            const res = compareLeverageReturns(
                budget || 0,
                loanRate || 0,
                loanYears || 0,
                loanFrequency || 12,
                customTbillRate || 0,
                brokerageRate,
                selectedTenure,
                leverageAsset,
                reinvestmentPercentage,
                depositInterestType,
                depositCompoundingFreq,
                depositTaxRate
            );
            setLeverageResult(res);
        } else if (mode === 'deposit') {
            const res = compareDepositReturns(
                budget || 0,
                depositStartMonth,
                depositEndMonth,
                activeFxData,
                selectedCurrency,
                foreignApr || 0,
                foreignCompounding,
                foreignTaxRate || 0,
                foreignReinvestRate || 0,
                localApr || 0,
                localCompounding,
                localTaxRate || 0,
                localReinvestRate || 0
            );
            setDepositCompareResult(res);
        } else if (mode === 'compareAll') {
            const currenciesList = Object.keys(activeFxData.monthlyPrices[0].value);
            const res = currenciesList.map(c => {
                const startInfo = getFxRateWithFallback(activeFxData, c, depositStartMonth);
                const endInfo = getFxRateWithFallback(activeFxData, c, depositEndMonth);
                
                if (!startInfo || !endInfo) return null;
                
                const roi = ((endInfo.rate / startInfo.rate) - 1) * 100;
                const unitsBought = (budget || 0) / startInfo.rate;
                const endValue = unitsBought * endInfo.rate;
                const profit = endValue - (budget || 0);
                
                return {
                    currency: c,
                    displayCode: c,
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
                    endIsFallback: endInfo.isFallback,
                    history: activeFxData.monthlyPrices
                        .filter(m => m.month >= depositStartMonth && m.month <= depositEndMonth)
                        .map(m => m.value[c])
                        .filter(v => v !== undefined && v !== null)
                };
            }).filter(Boolean).sort((a, b) => b.roi - a.roi);
            setCompareAllResult(res);
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

    const isWindowsDesktop = () => {
        return navigator.userAgent.includes('Windows NT') && !navigator.userAgent.includes('Mobile');
    };

    const downloadLeverageCSV = () => {
        if (!leverageResult || !leverageResult.rounds) return;
        const rows = [
            [`${leverageAsset === 'tbill' ? 'T-Bill' : 'Time Deposit'} Leverage Parameters`],
            ['Budget', formatCurrency(budget)],
            [leverageAsset === 'tbill' ? 'T-Bill Rate' : 'Deposit', `${customTbillRate}%`],
            ['Loan Rate', `${loanRate}%`],
            ['Term (Years)', loanYears],
            ['Frequency', loanFrequency],
            ['Reinvestment Rate', `${reinvestmentPercentage}%`],
        ];

        if (leverageAsset === 'deposit') {
            rows.push(
                ['Interest Type', depositInterestType],
                ['Compounding Frequency', depositCompoundingFreq === 0 ? 'At Maturity' : `${depositCompoundingFreq}x/year`],
                ['Tax / Deduction Rate', `${depositTaxRate}%`],
                ['Total Tax Paid', formatCurrency(leverageResult.accumulatedTaxPaid || 0)]
            );
        }

        rows.push(
            [],
            ['Results Summary'],
            ['Total Final Value', formatCurrency(leverageResult.tbillFinalValue)],
            ['Total Profit', formatCurrency(leverageResult.tbillTotalProfit)],
            ['Total ROI', `${leverageResult.tbillTotalROI.toFixed(2)}%`],
            [],
            leverageAsset === 'tbill'
                ? ['Round', 'Auction Date', 'Maturity', 'Quantity', 'Invested', 'End Value', 'Profit', 'Reinvested', 'Pocketed', 'Leftover']
                : ['Round', 'Deposit Date', 'Maturity', 'Invested', 'End Value', 'Gross Interest', 'Tax Paid', 'Net Interest', 'Reinvested', 'Pocketed']
        );
        
        leverageResult.rounds.forEach((r, i) => {
            if (leverageAsset === 'tbill') {
                rows.push([
                    i + 1,
                    r.auctionDate,
                    r.maturityDate,
                    r.quantity,
                    r.invested.toFixed(2),
                    r.endValue.toFixed(2),
                    r.profit.toFixed(2),
                    r.reinvested.toFixed(2),
                    r.withdrawn.toFixed(2),
                    r.leftover.toFixed(2)
                ]);
            } else {
                rows.push([
                    i + 1,
                    r.auctionDate,
                    r.maturityDate,
                    r.invested.toFixed(2),
                    r.endValue.toFixed(2),
                    (r.grossInterest || r.profit).toFixed(2),
                    (r.taxPaid || 0).toFixed(2),
                    r.profit.toFixed(2),
                    r.reinvested.toFixed(2),
                    r.withdrawn.toFixed(2)
                ]);
            }
        });

        const csvContent = rows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').slice(0, 15);
        const fileName = `leverage_rounds_${timestamp}.csv`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        setTimeout(() => {
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 100);
    };

    const downloadLeveragePDF = async () => {
        if (!leverageResult || !leverageResult.rounds) return;
        
        const getPeriodLabel = (days) => {
            if (days === 91) return "3 Months";
            if (days === 182) return "6 Months";
            if (days === 364 || days === 365) return "1 Year";
            return `${days} Days`;
        };
        const termText = leverageAsset === 'tbill' ? `Tenure: ${selectedTenure}d` : `Tenure: ${getPeriodLabel(selectedTenure)}`;
        
        const profitLabel = leverageAsset === 'tbill' ? 'Total Profit' : 'Net Interest';
        const summaryLines = [
            `Loan: ${formatCurrency(budget)} | Rate: ${loanRate.toFixed(2)}% | Term: ${loanYears}y | Freq: ${loanFrequency} | Total Interest: ${formatCurrency(leverageResult.loanResult.totalInterest)}`,
            `${leverageAsset === 'tbill' ? 'T-Bill' : 'Deposit'}: ${customTbillRate.toFixed(2)}% | Reinvestment: ${reinvestmentPercentage}% | ${termText} | ROI: ${leverageResult.tbillTotalROI.toFixed(2)}% | Final: ${formatCurrency(leverageResult.tbillFinalValue)} | ${profitLabel}: ${formatCurrency(leverageResult.tbillTotalProfit)} | Net Profit: ${formatCurrency(leverageResult.netProfit)}`
        ];

        if (leverageAsset === 'deposit') {
            summaryLines.push(
                `Type: ${depositInterestType.toUpperCase()} | Compounding: ${depositCompoundingFreq === 0 ? 'At Maturity' : `${depositCompoundingFreq}x/year`} | Tax Rate: ${depositTaxRate}% (Total Paid: ${formatCurrency(leverageResult.accumulatedTaxPaid || 0)})`
            );
        }

        const doc = createStandardPDF(`${leverageAsset === 'tbill' ? 'T-Bill' : 'Time Deposit'} Leverage Analysis`, summaryLines, { orientation: 'landscape' });

        const head = leverageAsset === 'tbill'
            ? [["Round", "Auction Date", "Maturity", "Quantity", "Invested", "End Value", "Profit", "Reinvested", "Pocketed", "Leftover"]]
            : [["Round", "Deposit Date", "Maturity", "Invested", "End Value", "Gross Interest", "Tax Paid", "Net Interest", "Reinvested", "Pocketed"]];

        const body = leverageResult.rounds.map((r, i) => {
            if (leverageAsset === 'tbill') {
                return [
                    i + 1,
                    r.auctionDate,
                    r.maturityDate,
                    r.quantity,
                    `${formatCurrency(r.invested)}`,
                    `${formatCurrency(r.endValue)}`,
                    `${r.profit >= 0 ? '+' : ''}${formatCurrency(r.profit)}`,
                    `${formatCurrency(r.reinvested)}`,
                    `${formatCurrency(r.withdrawn)}`,
                    `${formatCurrency(r.leftover)}`
                ];
            } else {
                return [
                    i + 1,
                    r.auctionDate,
                    r.maturityDate,
                    `${formatCurrency(r.invested)}`,
                    `${formatCurrency(r.endValue)}`,
                    `${formatCurrency(r.grossInterest || r.profit)}`,
                    `${formatCurrency(r.taxPaid || 0)}`,
                    `${r.profit >= 0 ? '+' : ''}${formatCurrency(r.profit)}`,
                    `${formatCurrency(r.reinvested)}`,
                    `${formatCurrency(r.withdrawn)}`
                ];
            }
        });

        autoTable(doc, {
            ...STANDARD_TABLE_STYLES,
            startY: leverageAsset === 'deposit' ? 49 : 44,
            head,
            body,
            columnStyles: {
                0: { halign: 'right' },
                1: { halign: 'right' },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' },
                7: { halign: 'right' },
                8: { halign: 'right' },
                9: { halign: 'right' },
            },
        });
        
        addStandardFooter(doc);

        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').slice(0, 15);
        const fileName = `leverage_rounds_${timestamp}.pdf`;
        doc.save(fileName);
    };

    const downloadLeverageExcel = () => {
        if (!leverageResult || !leverageResult.rounds) return;
        
        // Prepare data for XLSX
        const data = [
            [`${leverageAsset === 'tbill' ? 'T-Bill' : 'Time Deposit'} Leverage Parameters`],
            ["Budget", budget],
            [leverageAsset === 'tbill' ? "T-Bill Rate" : "Deposit", `${customTbillRate}%`],
            ["Loan Rate", `${loanRate}%`],
            ["Term (Years)", loanYears],
            ["Frequency", loanFrequency],
            ["Reinvestment Rate", `${reinvestmentPercentage}%`],
        ];

        if (leverageAsset === 'deposit') {
            data.push(
                ["Interest Type", depositInterestType],
                ["Compounding Frequency", depositCompoundingFreq === 0 ? "At Maturity" : `${depositCompoundingFreq}x/year`],
                ["Tax / Deduction Rate", `${depositTaxRate}%`],
                ["Total Tax Paid", leverageResult.accumulatedTaxPaid || 0]
            );
        }

        data.push(
            [],
            ["Results Summary"],
            ["Total Final Value", leverageResult.tbillFinalValue],
            ["Total Profit", leverageResult.tbillTotalProfit],
            ["Total ROI", `${leverageResult.tbillTotalROI.toFixed(2)}%`],
            [],
            leverageAsset === 'tbill'
                ? ["Round", "Auction Date", "Maturity", "Quantity", "Invested", "End Value", "Profit", "Reinvested", "Pocketed", "Leftover"]
                : ["Round", "Deposit Date", "Maturity", "Invested", "End Value", "Gross Interest", "Tax Paid", "Net Interest", "Reinvested", "Pocketed"]
        );
        
        leverageResult.rounds.forEach((r, i) => {
            if (leverageAsset === 'tbill') {
                data.push([
                    i + 1,
                    r.auctionDate,
                    r.maturityDate,
                    r.quantity,
                    r.invested,
                    r.endValue,
                    r.profit,
                    r.reinvested,
                    r.withdrawn,
                    r.leftover
                ]);
            } else {
                data.push([
                    i + 1,
                    r.auctionDate,
                    r.maturityDate,
                    r.invested,
                    r.endValue,
                    r.grossInterest || r.profit,
                    r.taxPaid || 0,
                    r.profit,
                    r.reinvested,
                    r.withdrawn
                ]);
            }
        });

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leverage Rounds");

        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').slice(0, 15);
        const fileName = `leverage_rounds_${timestamp}.xlsx`;
        
        XLSX.writeFile(workbook, fileName);
    };


    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <ArrowRightLeft className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight text-left">
                            Arbitrage
                        </h1>
                        <p className="text-neutral-500 text-[9px] font-medium uppercase tracking-wider text-left">
                            Leverage & ROI Simulator
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Mode Selector */}
            <div className="flex justify-center mb-2.5">
                <div className="flex w-full bg-neutral-900/70 rounded-md p-0.5 ring-1 ring-neutral-800">
                    <button
                        onClick={() => {
                            setMode('leverage');
                            if (leverageAsset === 'deposit') {
                                setSelectedTenure(365);
                            } else {
                                setSelectedTenure(364);
                            }
                            handleClear();
                        }}
                        className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'leverage' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Leverage
                    </button>
                    <button
                        onClick={() => {
                            setMode('rolling');
                            if (selectedTenure === 365) {
                                setSelectedTenure(364);
                            }
                            handleClear();
                        }}
                        className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'rolling' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Rolling
                    </button>
                    <button
                        onClick={() => {
                            setMode('single');
                            if (selectedTenure === 365) {
                                setSelectedTenure(364);
                            }
                            handleClear();
                        }}
                        className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'single' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Single
                    </button>
                    <button
                        onClick={() => {
                            setMode('deposit');
                            handleClear();
                        }}
                        className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'deposit' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => {
                            setMode('compareAll');
                            handleClear();
                        }}
                        className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'compareAll' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30'}`}
                    >
                        Compare All
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
                        <div>
                            <p className="text-[10px] font-bold text-white mb-0.5 uppercase tracking-tight">Leverage Mode</p>
                            <p className="text-[10px] text-neutral-400">Borrow money to invest in T-Bills. Calculates the compound interest on your loan and compares it to the rolling future returns of T-Bills over the loan term.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Fixed Inputs Area */}
            <div className="space-y-2 shrink-0 mb-1.5">
                {/* Budget */}
                <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-neutral-700 hover:border-neutral-600">
                    <div className="flex justify-between items-center gap-2">
                        <div className="shrink-0 text-left">
                            <label 
                                onClick={focusBudget}
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

                {/* Rate Source Toggle (Only for Compare All mode) */}
                {mode === 'compareAll' && (
                    <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-neutral-700 hover:border-neutral-600 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-xs font-bold text-white leading-tight select-none">
                                Rate Source
                            </span>
                            <div className="flex bg-neutral-900 rounded p-0.5 ring-1 ring-neutral-800">
                                <button
                                    onClick={() => { setRateSource('black'); handleClear(); }}
                                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${rateSource === 'black' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                                >
                                    Black Market
                                </button>
                                <button
                                    onClick={() => { setRateSource('bank'); handleClear(); }}
                                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${rateSource === 'bank' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                                >
                                    Bank Rate
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Deposit Mode Period Picker (Full Width) */}
                {(mode === 'deposit' || mode === 'compareAll') && (
                    <div ref={depositPeriodBarRef} className="bg-neutral-800/60 rounded-xl p-2 border border-neutral-700/50 text-left flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                            <YearMonthPicker
                                label="From"
                                value={depositStartMonth}
                                onChange={setDepositStartMonth}
                                isOpen={depositStartPickerOpen}
                                setIsOpen={(v) => { setDepositStartPickerOpen(v); if (v) setDepositEndPickerOpen(false); }}
                                pickerYear={depositStartPickerYear}
                                setPickerYear={setDepositStartPickerYear}
                                fxData={activeFxData}
                            />
                            <span className="text-[9px] text-neutral-600 font-black shrink-0">→</span>
                            <YearMonthPicker
                                label="To"
                                value={depositEndMonth}
                                onChange={setDepositEndMonth}
                                isOpen={depositEndPickerOpen}
                                setIsOpen={(v) => { setDepositEndPickerOpen(v); if (v) setDepositStartPickerOpen(false); }}
                                pickerYear={depositEndPickerYear}
                                setPickerYear={setDepositEndPickerYear}
                                fxData={activeFxData}
                            />
                        </div>
                        {/* Quick Presets */}
                        <div className="flex items-center gap-1 mt-1.5 justify-center">
                            {[
                                { label: 'YTD', start: `${new Date().getFullYear()}-01`, end: latestDataMonth },
                                { label: '1Y', start: (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })(), end: latestDataMonth },
                                { label: '2Y', start: (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 2); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })(), end: latestDataMonth },
                                { label: 'All', start: activeFxData.monthlyPrices[0].month, end: latestDataMonth },
                            ].map(preset => {
                                const isActive = depositStartMonth === preset.start && depositEndMonth === preset.end;
                                return (
                                    <button
                                        key={preset.label}
                                        onClick={() => { setDepositStartMonth(preset.start); setDepositEndMonth(preset.end); }}
                                        className={`px-3 py-1 rounded text-[10px] font-black transition-all ${isActive ? 'bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-white hover:bg-neutral-800/40'}`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Rolling and Single Mode Selector (Side-by-side) */}
                {mode !== 'leverage' && mode !== 'deposit' && mode !== 'compareAll' && (
                <div className="grid grid-cols-2 gap-2">
                    {/* Auction/Date Selection */}
                    <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-neutral-700 text-left flex flex-col">
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
                    <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-neutral-700 text-left">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Foreign Currency</label>
                            <input 
                                type="text"
                                placeholder="Search..."
                                value={currencySearch}
                                onChange={(e) => {
                                    const search = e.target.value;
                                    setCurrencySearch(search);
                                    if (search) {
                                        const s = search.toLowerCase();
                                        const filtered = currencies.filter(c => {
                                            const fullName = CURRENCY_NAMES[c] || c;
                                            return c.toLowerCase().includes(s) || fullName.toLowerCase().includes(s);
                                        });
                                        if (filtered.length > 0 && !filtered.includes(selectedCurrency)) {
                                            setSelectedCurrency(filtered[0]);
                                            handleClear();
                                        }
                                    }
                                }}
                                className="bg-neutral-900/50 border border-neutral-700 rounded px-1.5 py-0.5 text-[9px] text-white focus:outline-none focus:border-emerald-500 w-16"
                            />
                        </div>
                        
                        {/* Quick Selection Pills for common currencies */}
                        {!currencySearch && (
                            <div className="flex gap-1 mb-1.5 overflow-x-auto no-scrollbar pb-0.5">
                                {['USD', 'XAU', 'BTC'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCurrency(c)}
                                        className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${selectedCurrency === c ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-neutral-900 text-neutral-500 hover:text-white'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        setMode('compareAll');
                                        handleClear();
                                    }}
                                    className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black transition-all bg-emerald-600/20 text-emerald-500 ring-1 ring-emerald-600/40 hover:bg-emerald-600/30 hover:text-emerald-400`}
                                >
                                    ALL
                                </button>
                            </div>
                        )}

                        <select
                            value={selectedCurrency}
                            onChange={(e) => { setSelectedCurrency(e.target.value); setCurrencySearch(''); handleClear(); }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-md text-white text-xs p-1.5 focus:outline-none focus:border-emerald-500"
                        >
                            {currencies
                                .filter(c => {
                                    if (c === selectedCurrency) return true;
                                    const fullName = CURRENCY_NAMES[c] || c;
                                    const s = currencySearch.toLowerCase();
                                    return c.toLowerCase().includes(s) || fullName.toLowerCase().includes(s);
                                })
                                .map(c => {
                                    return (
                                        <option key={c} value={c}>
                                            {c}{CURRENCY_NAMES[c] ? ` - ${CURRENCY_NAMES[c]}` : ''}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                </div>
                )}
                    
                {/* Leverage Mode Inputs */}
                {mode === 'leverage' && (
                    <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-neutral-700 text-left flex flex-col gap-2">
                        <div className="grid grid-cols-4 gap-2">
                            <div className="flex flex-col">
                                <label 
                                    onClick={focusTbillRate}
                                    className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 cursor-pointer hover:text-emerald-400 transition-colors select-none"
                                >
                                    {leverageAsset === 'tbill' ? 'T-Bill (%)' : 'Deposit (%)'}
                                </label>
                                <FormattedNumberInput
                                    ref={tbillRateRef}
                                    value={customTbillRate}
                                    onChange={(e) => setCustomTbillRate(parseFloat(e.target.value.replace(/,/g, '')))}
                                    decimals={2}
                                    className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label 
                                    onClick={focusLoanRate}
                                    className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 cursor-pointer hover:text-emerald-400 transition-colors select-none"
                                >
                                    Loan (%)
                                </label>
                                <FormattedNumberInput
                                    ref={loanRateRef}
                                    value={loanRate}
                                    onChange={(e) => setLoanRate(parseFloat(e.target.value.replace(/,/g, '')))}
                                    decimals={2}
                                    className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label 
                                    onClick={focusLoanYears}
                                    className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 cursor-pointer hover:text-emerald-400 transition-colors select-none"
                                >
                                    Term (YR)
                                </label>
                                <FormattedNumberInput
                                    ref={loanYearsRef}
                                    value={loanYears}
                                    onChange={(e) => setLoanYears(parseFloat(e.target.value.replace(/,/g, '')))}
                                    decimals={0}
                                    className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Frequency</label>
                                <select
                                    value={loanFrequency}
                                    onChange={(e) => setLoanFrequency(parseInt(e.target.value))}
                                    className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[10px] p-1.5 focus:outline-none focus:border-emerald-500 w-full"
                                >
                                    <option value={1}>Annually</option>
                                    <option value={2}>Semi-Annually</option>
                                    <option value={4}>Quarterly</option>
                                    <option value={12}>Monthly</option>
                                </select>
                            </div>
                        </div>
                        {/* Reinvestment Rate Row */}
                        <div className="border-t border-neutral-700/50 pt-1.5 flex flex-col gap-1">
                            <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block select-none">
                                Reinvestment Rate ({reinvestmentPercentage}%)
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReinvestmentPercentage(prev => {
                                            const newVal = Math.max(0, prev - 5);
                                            return newVal;
                                        });
                                        handleClear();
                                    }}
                                    className="h-6 p-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors flex items-center justify-center"
                                    title="Decrease by 5%"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={reinvestmentPercentage}
                                    onChange={(e) => {
                                        setReinvestmentPercentage(parseFloat(e.target.value));
                                        handleClear();
                                    }}
                                    className="flex-1 accent-emerald-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReinvestmentPercentage(prev => {
                                            const newVal = Math.min(100, prev + 5);
                                            return newVal;
                                        });
                                        handleClear();
                                    }}
                                    className="h-6 p-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors flex items-center justify-center"
                                    title="Increase by 5%"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                                <FormattedNumberInput
                                    value={reinvestmentPercentage}
                                    onChange={(e) => {
                                        let val = parseFloat(e.target.value.replace(/,/g, ''));
                                        if (isNaN(val)) val = 0;
                                        if (val < 0) val = 0;
                                        if (val > 100) val = 100;
                                        setReinvestmentPercentage(val);
                                        handleClear();
                                    }}
                                    decimals={0}
                                    className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] h-6 focus:outline-none focus:border-emerald-500 w-16 shrink-0 font-mono text-center"
                                />
                            </div>
                        </div>
                        {leverageAsset === 'deposit' && (
                            <div className="grid grid-cols-3 gap-2 border-t border-neutral-700/50 pt-2">
                                <div className="flex flex-col">
                                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Interest Type</label>
                                    <select
                                        value={depositInterestType}
                                        onChange={(e) => {
                                            setDepositInterestType(e.target.value);
                                            handleClear();
                                        }}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[10px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-bold"
                                    >
                                        <option value="compounding">Compound</option>
                                        <option value="simple">Simple</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Compounds</label>
                                    <select
                                        value={depositCompoundingFreq}
                                        onChange={(e) => {
                                            setDepositCompoundingFreq(parseInt(e.target.value));
                                            handleClear();
                                        }}
                                        disabled={depositInterestType === 'simple'}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[10px] p-1.5 focus:outline-none focus:border-emerald-500 w-full disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        <option value={0}>At Maturity</option>
                                        <option value={12}>Monthly</option>
                                        <option value={4}>Quarterly</option>
                                        <option value={2}>Semi-Annually</option>
                                        <option value={1}>Annually</option>
                                        <option value={24}>Semi-Monthly</option>
                                        <option value={26}>Bi-Weekly</option>
                                        <option value={52}>Weekly</option>
                                        <option value={365}>Daily</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label
                                        onClick={focusDepositTax}
                                        className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 cursor-pointer hover:text-emerald-400 transition-colors select-none"
                                    >
                                        Deduction (%)
                                    </label>
                                    <FormattedNumberInput
                                        ref={depositTaxRef}
                                        value={depositTaxRate}
                                        onChange={(e) => setDepositTaxRate(parseFloat(e.target.value.replace(/,/g, '')))}
                                        decimals={2}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tenure Selector */}
                {(mode === 'rolling' || mode === 'leverage') && (
                    <div className="bg-neutral-800/40 rounded-xl px-3 py-1 border border-transparent hover:border-neutral-700 transition-all flex justify-between items-center gap-2 h-[42px]">
                        <div className="flex items-center gap-1.5">
                             {mode === 'leverage' && (
                                <div className="flex bg-neutral-900/70 rounded-md p-0.5 ring-1 ring-neutral-800 shrink-0">
                                     <button
                                        onClick={() => {
                                            if (leverageAsset !== 'deposit') {
                                                setLeverageAsset('deposit');
                                                setCustomTbillRate(25);
                                                if (selectedTenure === 28) {
                                                    setSelectedTenure(182); // Default to 6M
                                                } else if (selectedTenure === 364) {
                                                    setSelectedTenure(365);
                                                }
                                                handleClear();
                                            }
                                        }}
                                        className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${leverageAsset === 'deposit' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        Deposits
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (leverageAsset !== 'tbill') {
                                                setLeverageAsset('tbill');
                                                setCustomTbillRate(14.0);
                                                if (selectedTenure === 365) {
                                                    setSelectedTenure(364);
                                                }
                                                handleClear();
                                            }
                                        }}
                                        className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${leverageAsset === 'tbill' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        T-Bill
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex bg-neutral-900/50 rounded-lg p-0.5 ring-1 ring-neutral-800">
                            {leverageAsset === 'deposit' && mode === 'leverage' ? (
                                [
                                    { days: 91, label: '3M' },
                                    { days: 182, label: '6M' },
                                    { days: 365, label: '1Y' }
                                ].map(t => (
                                    <button
                                        key={t.days}
                                        onClick={() => setSelectedTenure(t.days)}
                                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${selectedTenure === t.days ? 'bg-emerald-600 text-neutral-900 shadow-lg shadow-emerald-900/20' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        {t.label}
                                    </button>
                                ))
                            ) : (
                                TENURE_OPTIONS.map(t => (
                                    <button
                                        key={t.days}
                                        onClick={() => setSelectedTenure(t.days)}
                                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${selectedTenure === t.days ? 'bg-emerald-600 text-neutral-900 shadow-lg shadow-emerald-900/20' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        {t.days}D
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Scrollable Results Section */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {/* Deposit Mode Inputs */}
                {mode === 'deposit' && (
                    <div className="mb-2 bg-neutral-800/40 rounded-xl p-2.5 border border-neutral-700 text-left flex flex-col gap-3">
                        {/* Foreign / USD Deposit Details */}
                        <div className="border-b border-neutral-700/50 pb-2">
                            <div className="flex items-center justify-between gap-1.5 mb-2 select-none">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Account Settings</span>
                                    <input 
                                        type="text"
                                        placeholder="Search..."
                                        value={currencySearch}
                                        onChange={(e) => {
                                            const search = e.target.value;
                                            setCurrencySearch(search);
                                            if (search) {
                                                const s = search.toLowerCase();
                                                const filtered = currencies.filter(c => {
                                                    const fullName = CURRENCY_NAMES[c] || c;
                                                    return c.toLowerCase().includes(s) || fullName.toLowerCase().includes(s);
                                                });
                                                if (filtered.length > 0 && !filtered.includes(selectedCurrency)) {
                                                    setSelectedCurrency(filtered[0]);
                                                    handleClear();
                                                }
                                            }
                                        }}
                                        className="bg-neutral-900/50 border border-neutral-700 rounded px-1.5 py-0.5 text-[9px] text-white focus:outline-none focus:border-emerald-500 w-16"
                                    />
                                    <select
                                        value={selectedCurrency}
                                        onChange={(e) => { setSelectedCurrency(e.target.value); setCurrencySearch(''); handleClear(); }}
                                        className="bg-neutral-950 border border-neutral-700 rounded px-1.5 py-0.5 text-[10px] font-black text-emerald-400 uppercase focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[120px] truncate"
                                    >
                                        {currencies
                                            .filter(c => {
                                                if (c === selectedCurrency) return true;
                                                const fullName = CURRENCY_NAMES[c] || c;
                                                const s = currencySearch.toLowerCase();
                                                return c.toLowerCase().includes(s) || fullName.toLowerCase().includes(s);
                                            })
                                            .map(c => (
                                                <option key={c} value={c} className="text-white bg-neutral-950 font-normal">
                                                    {c}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="flex bg-neutral-900 rounded p-0.5 ring-1 ring-neutral-800 shrink-0">
                                    <button
                                        onClick={() => { setRateSource('black'); handleClear(); }}
                                        className={`px-1.5 py-0.5 text-[8px] font-bold uppercase rounded transition-all ${rateSource === 'black' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        Black
                                    </button>
                                    <button
                                        onClick={() => { setRateSource('bank'); handleClear(); }}
                                        className={`px-1.5 py-0.5 text-[8px] font-bold uppercase rounded transition-all ${rateSource === 'bank' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        Bank
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="flex flex-col">
                                    <label onClick={focusForeignApr} className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1 cursor-pointer hover:text-emerald-400 transition-colors select-none">
                                        APR (%)
                                    </label>
                                    <FormattedNumberInput
                                        ref={foreignAprRef}
                                        value={foreignApr}
                                        onChange={(e) => setForeignApr(parseFloat(e.target.value.replace(/,/g, '')))}
                                        decimals={2}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
                                        Compounding
                                    </label>
                                    <select
                                        value={foreignCompounding}
                                        onChange={(e) => { setForeignCompounding(parseInt(e.target.value)); handleClear(); }}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[10px] p-1.5 focus:outline-none focus:border-emerald-500 w-full"
                                    >
                                        <option value={0}>At Maturity</option>
                                        <option value={12}>Monthly</option>
                                        <option value={4}>Quarterly</option>
                                        <option value={2}>Semi-Annually</option>
                                        <option value={1}>Annually</option>
                                        <option value={52}>Weekly</option>
                                        <option value={365}>Daily</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label onClick={focusForeignTax} className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1 cursor-pointer hover:text-emerald-400 transition-colors select-none">
                                        Deduction (%)
                                    </label>
                                    <FormattedNumberInput
                                        ref={foreignTaxRef}
                                        value={foreignTaxRate}
                                        onChange={(e) => setForeignTaxRate(parseFloat(e.target.value.replace(/,/g, '')))}
                                        decimals={2}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1 select-none">
                                        Reinvest (%)
                                    </label>
                                    <FormattedNumberInput
                                        value={foreignReinvestRate}
                                        onChange={(e) => {
                                            let val = parseFloat(e.target.value.replace(/,/g, ''));
                                            if (isNaN(val)) val = 0;
                                            if (val < 0) val = 0;
                                            if (val > 100) val = 100;
                                            setForeignReinvestRate(val);
                                            handleClear();
                                        }}
                                        decimals={0}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Local / ETB Deposit Details */}
                        <div>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2 tracking-wider">ETB Account Settings</p>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="flex flex-col">
                                    <label onClick={focusLocalApr} className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1 cursor-pointer hover:text-emerald-400 transition-colors select-none">
                                        APR (%)
                                    </label>
                                    <FormattedNumberInput
                                        ref={localAprRef}
                                        value={localApr}
                                        onChange={(e) => setLocalApr(parseFloat(e.target.value.replace(/,/g, '')))}
                                        decimals={2}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
                                        Compounding
                                    </label>
                                    <select
                                        value={localCompounding}
                                        onChange={(e) => { setLocalCompounding(parseInt(e.target.value)); handleClear(); }}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[10px] p-1.5 focus:outline-none focus:border-emerald-500 w-full"
                                    >
                                        <option value={0}>At Maturity</option>
                                        <option value={12}>Monthly</option>
                                        <option value={4}>Quarterly</option>
                                        <option value={2}>Semi-Annually</option>
                                        <option value={1}>Annually</option>
                                        <option value={52}>Weekly</option>
                                        <option value={365}>Daily</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label onClick={focusLocalTax} className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1 cursor-pointer hover:text-emerald-400 transition-colors select-none">
                                        Deduction (%)
                                    </label>
                                    <FormattedNumberInput
                                        ref={localTaxRef}
                                        value={localTaxRate}
                                        onChange={(e) => setLocalTaxRate(parseFloat(e.target.value.replace(/,/g, '')))}
                                        decimals={2}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1 select-none">
                                        Reinvest (%)
                                    </label>
                                    <FormattedNumberInput
                                        value={localReinvestRate}
                                        onChange={(e) => {
                                            let val = parseFloat(e.target.value.replace(/,/g, ''));
                                            if (isNaN(val)) val = 0;
                                            if (val < 0) val = 0;
                                            if (val > 100) val = 100;
                                            setLocalReinvestRate(val);
                                            handleClear();
                                        }}
                                        decimals={0}
                                        className="bg-neutral-900 border border-neutral-700 rounded-md text-white text-[11px] p-1.5 focus:outline-none focus:border-emerald-500 w-full font-mono text-right"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Awaiting Calculation Placeholder */}
                {((mode === 'single' && !resultData) || (mode === 'rolling' && !rollingResult) || (mode === 'leverage' && !leverageResult) || (mode === 'deposit' && !depositCompareResult) || (mode === 'compareAll' && !compareAllResult)) && (
                    <div className="mt-2.5 h-[140px] shrink-0">
                        <AwaitingCalculation Icon={ArrowRightLeft} />
                    </div>
                )}

                {/* Single mode results (unchanged) */}
                {mode === 'single' && resultData && (
                        <div className="mt-1 space-y-2.5 pb-2">
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
                                        <div className={`rounded-lg p-2.5 border ${tbillWins ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">T-Bill Strategy</p>
                                            <div className="space-y-1.5">
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
                                        <div className={`rounded-lg p-2.5 border ${fxWins ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">Hold {selectedCurrency}</p>
                                            <div className="space-y-1.5">
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
                    <div className="mt-1 space-y-2.5 pb-2">
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
                                            {rollingResult.winner === 'T-BILL' ? 'T-Bill Wins' : `${selectedCurrency} Wins`}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* T-Bill Rolling Summary */}
                                        <div className={`rounded-lg p-2.5 border ${rollingResult.winner === 'T-BILL' ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">Rolling T-Bill</p>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Budget</span><span className="text-[10px] text-white font-mono">{formatCurrency(rollingResult.tbillFinalValue - rollingResult.tbillTotalProfit)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Final Value</span><span className={`text-[11px] font-black font-mono ${rollingResult.winner === 'T-BILL' ? 'text-emerald-400' : 'text-neutral-400'}`}>{formatCurrency(rollingResult.tbillFinalValue)}</span></div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Total Profit</span><span className={`text-[10px] font-bold font-mono ${rollingResult.tbillTotalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{rollingResult.tbillTotalProfit >= 0 ? '+' : ''}{formatCurrency(rollingResult.tbillTotalProfit)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Total ROI</span><span className={`text-[10px] font-bold font-mono ${rollingResult.tbillTotalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>{rollingResult.tbillTotalROI.toFixed(2)}%</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Ann. ROI</span><span className="text-[10px] text-emerald-400 font-black font-mono">{rollingResult.tbillAnnualizedROI.toFixed(2)}%</span></div>
                                            </div>
                                        </div>
                                        {/* FX Hold Summary */}
                                        <div className={`rounded-lg p-2.5 border ${rollingResult.winner === 'FX' ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">Hold {selectedCurrency}</p>
                                            <div className="space-y-1.5">
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
                                        {/* Net Advantage */}
                                        <div className="col-span-2 rounded-lg p-2.5 border border-emerald-500/40 bg-emerald-900/20">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                                    {rollingResult.winner === 'T-BILL' ? 'T-Bill Advantage' : `${selectedCurrency} Advantage`}
                                                </span>
                                                <span className="text-sm font-black font-mono text-emerald-400">
                                                    +{formatCurrency(rollingResult.diffAmount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1.5">
                                                <span className="text-[9px] text-neutral-500 uppercase">ROI Edge</span>
                                                <span className="text-[10px] font-bold font-mono text-emerald-400">
                                                    {rollingResult.diffROI.toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-neutral-700/30">
                                                <span className="text-[9px] text-neutral-500 uppercase">Break-even {selectedCurrency} Rate</span>
                                                <span className="text-[10px] font-bold font-mono text-amber-400">
                                                    {formatCurrency(rollingResult.tbillFinalValue / rollingResult.fxUnitsBought)}
                                                </span>
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

                {/* Leverage mode results */}
                {mode === 'leverage' && leverageResult && (
                    <div className="mt-0.5 space-y-1.5 pb-2">
                        {leverageResult.error ? (
                            <div className="bg-neutral-800/50 border border-red-500/30 rounded-xl p-3 text-center">
                                <p className="text-xs font-bold text-red-400">Leverage Calculation Error</p>
                                <p className="text-[10px] text-neutral-500">{leverageResult.error}</p>
                            </div>
                        ) : (
                            <>
                                {/* Summary Header */}
                                <div className="bg-neutral-900/60 border border-neutral-700 rounded-xl p-3">
                                    <div className="flex justify-between items-stretch mb-2.5">
                                        <div className="text-left">
                                            <h3 className="text-sm font-bold text-white leading-none">
                                                {loanYears} Year ({leverageAsset === 'tbill' ? `Rolling ${selectedTenure} Days` : `Rolling ${selectedTenure === 91 ? '3 Months' : selectedTenure === 182 ? '6 Months' : selectedTenure === 364 ? '1 Year' : `${selectedTenure} Days`}`})
                                            </h3>
                                            <p className="text-[9px] text-neutral-500 uppercase mt-1">Total {leverageResult.totalRounds} {leverageAsset === 'tbill' ? 'T-Bill' : 'Deposit'} Rounds</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center text-right ${leverageResult.isProfitable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {leverageResult.isProfitable ? 'Profitable' : 'Not Profitable'}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Loan Summary */}
                                        <div className="rounded-lg p-2.5 border border-neutral-800 bg-neutral-800/30">
                                            <p className="text-[10px] font-bold text-red-400 uppercase text-center mb-2 tracking-wider">Loan Cost</p>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Borrowed</span><span className="text-[10px] text-white font-mono">{formatCurrency(budget)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Rate</span><span className="text-[10px] text-white font-mono">{loanRate}%</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Per Period</span><span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(leverageResult.loanResult.monthlyPayment)}</span></div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Total Interest</span><span className="text-[10px] font-bold font-mono text-red-400">-{formatCurrency(leverageResult.loanResult.totalInterest)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Total Repayment</span><span className="text-[10px] text-red-400 font-black font-mono">{formatCurrency(leverageResult.loanResult.totalPayment)}</span></div>
                                            </div>
                                        </div>
                                        {/* Asset Summary */}
                                        <div className="rounded-lg p-2.5 border border-emerald-500/40 bg-emerald-900/10">
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">{leverageAsset === 'tbill' ? 'T-Bill' : 'Deposit'} Returns</p>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Invested</span><span className="text-[10px] text-white font-mono">{formatCurrency(budget)}</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Rate</span><span className="text-[10px] text-white font-mono">{leverageResult.rounds[0].yield.toFixed(3)}%</span></div>
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Rounds</span><span className="text-[10px] text-neutral-400 font-mono">{leverageResult.totalRounds}</span></div>
                                                <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Total Profit</span><span className="text-[10px] font-bold font-mono text-green-400">+{formatCurrency(leverageResult.tbillTotalProfit)}</span></div>
                                                {leverageAsset === 'deposit' && depositTaxRate > 0 && (
                                                    <div className="flex justify-between"><span className="text-[9px] text-red-400/90 font-bold uppercase">Total Tax Paid</span><span className="text-[10px] text-red-400 font-mono font-bold">-{formatCurrency(leverageResult.accumulatedTaxPaid)}</span></div>
                                                )}
                                                {reinvestmentPercentage < 100 && (
                                                    <div className="flex justify-between"><span className="text-[9px] text-amber-500/90 font-bold uppercase">Total Pocketed</span><span className="text-[10px] text-amber-400 font-mono font-bold">+{formatCurrency(leverageResult.totalWithdrawn)}</span></div>
                                                )}
                                                <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Final Value</span><span className="text-[10px] text-emerald-400 font-black font-mono">{formatCurrency(leverageResult.tbillFinalValue)}</span></div>
                                            </div>
                                        </div>
                                        {/* Net Result */}
                                        <div className={`col-span-2 rounded-lg p-2.5 border ${leverageResult.isProfitable ? 'border-emerald-500/40 bg-emerald-900/20' : 'border-red-500/40 bg-red-900/20'}`}>
                                             <div className="flex justify-between items-center">
                                                 <span className="text-[10px] font-bold text-white uppercase tracking-wider">Net Arbitrage Profit</span>
                                                 <span className={`text-sm font-black font-mono ${leverageResult.isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                                                     {leverageResult.isProfitable ? '+' : ''}{formatCurrency(leverageResult.netProfit)}
                                                 </span>
                                             </div>
                                             <div className="flex justify-between items-center mt-1.5">
                                                 <span className="text-[9px] text-neutral-500 uppercase">Net ROI</span>
                                                 <span className={`text-[10px] font-bold font-mono ${leverageResult.isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                                                     {((leverageResult.netProfit / budget) * 100).toFixed(2)}%
                                                 </span>
                                             </div>
                                             <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-neutral-700/30">
                                                 <span className="text-[9px] text-neutral-500 uppercase">Break-even {leverageAsset === 'tbill' ? 'T-Bill' : 'Deposit'} Rate</span>
                                                 <span className="text-[10px] font-bold font-mono text-amber-400">
                                                     {leverageResult.breakEvenTbillRate.toFixed(3)}%
                                                 </span>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                                {/* Round-by-round breakdown */}
                                <div className="bg-neutral-900/60 border border-neutral-700 rounded-xl overflow-hidden">
                                    <div className="w-full flex justify-between items-center p-2 pr-3 bg-neutral-900/40">
                                        <button onClick={() => setExpandedRounds(!expandedRounds)} className="flex-1 flex items-center gap-2 hover:opacity-80 transition-opacity">
                                            {expandedRounds ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />}
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{leverageAsset === 'tbill' ? 'T-Bill Reinvestment' : 'Deposit Rollover'} ({leverageResult.totalRounds} rounds)</span>
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <button onClick={downloadLeverageCSV} className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-cyan-500" title="Export CSV"><Download size={14} /></button>
                                            <button onClick={downloadLeverageExcel} className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-green-500" title="Export Excel"><FileSpreadsheet size={14} /></button>
                                            <button onClick={downloadLeveragePDF} className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-red-500" title="Export PDF"><FileText size={14} /></button>
                                        </div>
                                    </div>
                                    {expandedRounds && (
                                        <div className="border-t border-neutral-700/50 divide-y divide-neutral-800/50">
                                            {leverageResult.rounds.map((r, i) => (
                                                <div key={i} className="p-2 px-3 text-left">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-white">Round {i + 1}</span>
                                                        <span className="text-[9px] text-neutral-500 font-medium">
                                                            {formatDate(r.auctionDate)} → {formatDate(r.maturityDate)}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[9px]">
                                                        {leverageAsset === 'tbill' && (
                                                            <div className="flex justify-between"><span className="text-neutral-500">Qty</span><span className="text-white font-mono">{r.quantity}</span></div>
                                                        )}
                                                        <div className="flex justify-between"><span className="text-neutral-500">Invested</span><span className="text-white font-mono">{formatCurrency(r.invested)}</span></div>
                                                        <div className="flex justify-between"><span className="text-neutral-500">End Val</span><span className="text-white font-mono">{formatCurrency(r.endValue)}</span></div>
                                                        <div className="flex justify-between"><span className="text-neutral-500">{leverageAsset === 'tbill' ? 'Profit' : 'Net Interest'}</span><span className={`font-mono font-bold ${r.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{r.profit >= 0 ? '+' : ''}{formatCurrency(r.profit)}</span></div>
                                                        {leverageAsset === 'deposit' && depositTaxRate > 0 && (
                                                            <>
                                                                <div className="flex justify-between"><span className="text-neutral-500">Gross Int</span><span className="text-neutral-400 font-mono">{formatCurrency(r.grossInterest)}</span></div>
                                                                <div className="flex justify-between"><span className="text-neutral-500">Tax Paid</span><span className="text-red-400 font-mono">-{formatCurrency(r.taxPaid)}</span></div>
                                                            </>
                                                        )}
                                                        {reinvestmentPercentage < 100 && (
                                                            <>
                                                                <div className="flex justify-between"><span className="text-neutral-500">Reinvested</span><span className="text-emerald-400 font-mono font-bold">+{formatCurrency(r.reinvested)}</span></div>
                                                                <div className="flex justify-between"><span className="text-neutral-500">Pocketed</span><span className="text-amber-400 font-mono font-bold">+{formatCurrency(r.withdrawn)}</span></div>
                                                            </>
                                                        )}
                                                        {leverageAsset === 'tbill' && (
                                                            <div className="flex justify-between"><span className="text-neutral-500">Leftover</span><span className="text-amber-400/80 font-mono">{formatCurrency(r.leftover)}</span></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Deposit mode results */}
                {mode === 'deposit' && depositCompareResult && (
                    <div className="mt-1 space-y-2.5 pb-2">
                        {depositCompareResult.error ? (
                            <div className="bg-neutral-800/50 border border-red-500/30 rounded-xl p-3 text-center">
                                <p className="text-xs font-bold text-red-400">Deposit Calculation Error</p>
                                <p className="text-[10px] text-neutral-500">{depositCompareResult.error}</p>
                            </div>
                        ) : (
                            <div className="bg-neutral-900/60 border border-neutral-700 rounded-xl p-3 relative overflow-hidden">
                                <div className="flex justify-between items-stretch mb-3">
                                    <div className="text-left">
                                        <h3 className="text-sm font-bold text-white leading-none">Deposit Strategy</h3>
                                        <p className="text-[9px] text-neutral-500 uppercase mt-1">
                                            {formatMonth(depositStartMonth)} → {formatMonth(depositEndMonth)} ({depositCompareResult.totalDays} Days)
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Foreign currency strategy card */}
                                    <div className={`rounded-lg p-2.5 border ${depositCompareResult.winner === depositCompareResult.currency ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                        <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">{depositCompareResult.currency} Deposit ({foreignApr}% APR)</p>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Initial {depositCompareResult.currency}</span><span className="text-[10px] text-white font-mono">{formatCurrency(depositCompareResult.fxUnitsBought)} {depositCompareResult.currency}</span></div>
                                            <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Final Balance</span><span className="text-[10px] text-white font-mono">{formatCurrency(depositCompareResult.foreignResult.finalBalance)} {depositCompareResult.currency}</span></div>
                                            {foreignReinvestRate < 100 && (
                                                <div className="flex justify-between"><span className="text-[9px] text-amber-500/90 font-bold uppercase">Pocketed</span><span className="text-[10px] text-amber-400 font-mono font-bold">+{formatCurrency(depositCompareResult.foreignResult.pocketedValue)} {depositCompareResult.currency}</span></div>
                                            )}
                                            {foreignTaxRate > 0 && (
                                                <div className="flex justify-between"><span className="text-[9px] text-red-400/90 font-bold uppercase">Tax Paid</span><span className="text-[10px] text-red-400 font-mono font-bold">-{formatCurrency(depositCompareResult.foreignResult.totalTaxPaid)} {depositCompareResult.currency}</span></div>
                                            )}
                                            <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase font-semibold">Total Value</span><span className="text-[10px] text-white font-mono font-bold">{formatCurrency(depositCompareResult.usdEndValueInUsd)} {depositCompareResult.currency}</span></div>
                                            <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase font-semibold">Total (ETB)</span><span className={`text-[11px] font-black font-mono ${depositCompareResult.winner !== 'ETB' ? 'text-emerald-400' : 'text-neutral-400'}`}>{formatCurrency(depositCompareResult.usdEndValueInEtb)} ETB</span></div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-[9px] text-emerald-400/90 font-bold uppercase text-left">Interest Gained</span>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-emerald-400 font-mono font-bold">+{formatCurrency(depositCompareResult.usdEndValueInUsd - depositCompareResult.fxUnitsBought)} {depositCompareResult.currency}</span>
                                                    <div className="text-[8px] text-neutral-500 font-mono">≈ {formatCurrency((depositCompareResult.usdEndValueInUsd - depositCompareResult.fxUnitsBought) * depositCompareResult.fxEndRate)} ETB</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-1 pt-1 border-t border-neutral-700/50 mt-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Rate (Start)</span>
                                                    <span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(depositCompareResult.fxStartRate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Rate (End)</span>
                                                    <span className="text-[10px] text-neutral-400 font-mono">{formatCurrency(depositCompareResult.fxEndRate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Compounding</span>
                                                    <span className="text-[10px] text-neutral-400">
                                                        {foreignCompounding === 0 ? 'Maturity' : foreignCompounding === 12 ? 'Monthly' : foreignCompounding === 4 ? 'Quarterly' : foreignCompounding === 2 ? 'Semi-Annually' : foreignCompounding === 1 ? 'Annually' : foreignCompounding === 52 ? 'Weekly' : 'Daily'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Profit</span><span className={`text-[10px] font-bold font-mono ${depositCompareResult.usdProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{depositCompareResult.usdProfit >= 0 ? '+' : ''}{formatCurrency(depositCompareResult.usdProfit)} ETB</span></div>
                                            <div className="flex justify-between items-center"><span className="text-[9px] text-neutral-500 uppercase">ROI</span><span className={`text-[10px] font-bold font-mono ${depositCompareResult.usdROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>{depositCompareResult.usdROI.toFixed(2)}%</span></div>
                                        </div>
                                    </div>

                                    {/* ETB/Local currency strategy card */}
                                    <div className={`rounded-lg p-2.5 border ${depositCompareResult.winner === 'ETB' ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-neutral-800 bg-neutral-800/30'}`}>
                                        <p className="text-[10px] font-bold text-emerald-400 uppercase text-center mb-2 tracking-wider">ETB Deposit ({localApr}% APR)</p>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Initial ETB</span><span className="text-[10px] text-white font-mono">{formatCurrency(budget)} ETB</span></div>
                                            <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase">Final Balance</span><span className="text-[10px] text-white font-mono">{formatCurrency(depositCompareResult.localResult.finalBalance)} ETB</span></div>
                                            {localReinvestRate < 100 && (
                                                <div className="flex justify-between"><span className="text-[9px] text-amber-500/90 font-bold uppercase">Pocketed</span><span className="text-[10px] text-amber-400 font-mono font-bold">+{formatCurrency(depositCompareResult.localResult.pocketedValue)} ETB</span></div>
                                            )}
                                            {localTaxRate > 0 && (
                                                <div className="flex justify-between"><span className="text-[9px] text-red-400/90 font-bold uppercase">Tax Paid</span><span className="text-[10px] text-red-400 font-mono font-bold">-{formatCurrency(depositCompareResult.localResult.totalTaxPaid)} ETB</span></div>
                                            )}
                                            <div className="flex justify-between"><span className="text-[9px] text-neutral-500 uppercase font-semibold">Total Value</span><span className={`text-[11px] font-black font-mono ${depositCompareResult.winner === 'ETB' ? 'text-emerald-400' : 'text-neutral-400'}`}>{formatCurrency(depositCompareResult.etbEndValue)} ETB</span></div>
                                            <div className="flex justify-between items-start"><span className="text-[9px] text-green-400/90 font-bold uppercase text-left">Interest Gained</span><span className="text-[10px] text-green-400 font-mono font-bold text-right">+{formatCurrency(depositCompareResult.etbProfit)} ETB</span></div>
                                            
                                            <div className="flex flex-col gap-1 pt-1 border-t border-neutral-700/50 mt-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Compounding</span>
                                                    <span className="text-[10px] text-neutral-400">
                                                        {localCompounding === 0 ? 'Maturity' : localCompounding === 12 ? 'Monthly' : localCompounding === 4 ? 'Quarterly' : localCompounding === 2 ? 'Semi-Annually' : localCompounding === 1 ? 'Annually' : localCompounding === 52 ? 'Weekly' : 'Daily'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">ETB Growth</span>
                                                    <span className="text-[10px] text-emerald-400 font-bold font-mono">{(depositCompareResult.etbEndValue / budget).toFixed(4)}x</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[9px] text-neutral-500 uppercase">Duration</span>
                                                    <span className="text-[10px] text-neutral-400 font-mono">{(depositCompareResult.totalDays / 365).toFixed(2)} Years</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between pt-1 border-t border-neutral-700/50"><span className="text-[9px] text-neutral-500 uppercase">Profit</span><span className={`text-[10px] font-bold font-mono ${depositCompareResult.etbProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{depositCompareResult.etbProfit >= 0 ? '+' : ''}{formatCurrency(depositCompareResult.etbProfit)} ETB</span></div>
                                            <div className="flex justify-between items-center"><span className="text-[9px] text-neutral-500 uppercase">ROI</span><span className={`text-[10px] font-bold font-mono ${depositCompareResult.etbROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>{depositCompareResult.etbROI.toFixed(2)}%</span></div>
                                        </div>
                                    </div>

                                    {/* Summary Card */}
                                    <div className="col-span-2 rounded-lg p-2.5 border border-emerald-500/40 bg-emerald-900/20">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                                {depositCompareResult.winner} Advantage
                                            </span>
                                            <span className="text-sm font-black font-mono text-emerald-400">
                                                +{formatCurrency(depositCompareResult.diffAmount)} ETB
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-neutral-700/30">
                                            <span className="text-[9px] text-neutral-500 uppercase">ROI Edge</span>
                                            <span className="text-[10px] font-bold font-mono text-emerald-400">
                                                {depositCompareResult.diffROI.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Compare All mode results */}
                {mode === 'compareAll' && compareAllResult && (
                    <div className="mt-1 space-y-2.5 pb-2 text-left animate-in fade-in duration-200">
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                            <input 
                                type="text"
                                placeholder="Search currencies..."
                                value={compareSearch}
                                onChange={(e) => setCompareSearch(e.target.value)}
                                className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-600/50 transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {compareAllResult
                                .filter(r => {
                                    const fullName = CURRENCY_NAMES[r.currency] || r.currency;
                                    const s = compareSearch.toLowerCase();
                                    return r.currency.toLowerCase().includes(s) ||
                                           fullName.toLowerCase().includes(s);
                                })
                                .map((res, idx) => {
                                    const isExpanded = expandedCurrency === res.currency;
                                    const isTop = idx === 0;
                                    const isTop3 = idx < 3;
                                    const maxRoi = compareAllResult.length > 0 ? Math.max(compareAllResult[0].roi, 1) : 1;
                                    const roiPercent = Math.max(0, Math.min(100, (res.roi / maxRoi) * 100));

                                    return (
                                        <div
                                            key={res.currency}
                                            onClick={() => setExpandedCurrency(isExpanded ? null : res.currency)}
                                            className={`group rounded-2xl border transition-all overflow-hidden cursor-pointer ${isTop ? 'bg-gradient-to-r from-emerald-600/10 to-teal-900/5 border-emerald-600/30 shadow-lg shadow-emerald-600/5' : isTop3 ? 'bg-neutral-800/30 border-neutral-700/40' : 'bg-neutral-800/20 border-neutral-800/50 hover:border-neutral-700/50'}`}
                                        >
                                            <div className="p-2.5 flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                    <div className="relative shrink-0">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${isTop ? 'bg-gradient-to-br from-emerald-700 to-emerald-600 text-white shadow-lg shadow-emerald-700/30' : isTop3 ? 'bg-neutral-700 text-neutral-200' : 'bg-neutral-800 text-neutral-400'}`}>
                                                            {res.displayCode}
                                                        </div>
                                                        <span className={`absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black ${isTop ? 'bg-emerald-700 text-white' : isTop3 ? 'bg-neutral-600 text-neutral-200' : 'bg-neutral-700 text-neutral-400'}`}>
                                                            {idx + 1}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className={`font-bold truncate transition-colors text-sm text-left ${isTop ? 'text-emerald-500' : 'text-white group-hover:text-emerald-600'}`}>{CURRENCY_NAMES[res.currency] || res.currency}</h4>
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

                                                        <div className="flex justify-between items-center py-1">
                                                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Pricing Unit</span>
                                                            <span className="text-[10px] text-emerald-500/70 font-bold">
                                                                {['XAU', 'XAG', 'XPT'].includes(res.currency) 
                                                                    ? 'Troy Ounce (31.1034768g)' 
                                                                    : ['XCU', 'XSN', 'ZNC', 'XPB', 'XNI'].includes(res.currency)
                                                                        ? 'Metric Ton'
                                                                        : `1 ${res.currency}`}
                                                            </span>
                                                        </div>

                                                        <div className="py-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Performance Trend</span>
                                                                <span className={`text-[8px] font-bold ${res.roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                                    {res.history.length} Months
                                                                </span>
                                                            </div>
                                                            <div className="bg-neutral-900/50 rounded-lg py-3 px-1 border border-neutral-800/50">
                                                                <MiniTrendChart data={res.history} />
                                                            </div>
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
                                                            onClick={() => {
                                                                setSelectedCurrency(res.currency);
                                                                setMode('single');
                                                                handleClear();
                                                            }}
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

const MiniTrendChart = ({ data, color = '#10b981' }) => {
    const id = useId();
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 200; // Increased horizontal resolution
    const height = 40; // Increased height
    const padding = 2;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 2 * padding) - padding;
        return `${x},${y}`;
    }).join(' ');

    const lastVal = data[data.length - 1];
    const firstVal = data[0];
    const isUp = lastVal >= firstVal;
    const strokeColor = isUp ? '#10b981' : '#ef4444';
    const gradientId = `gradient-${id.replace(/:/g, '')}`;

    return (
        <div className="w-full h-12 relative group/chart">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d={`M 0 ${height} L ${points} L ${width} ${height} Z`}
                    fill={`url(#${gradientId})`}
                    className="transition-all duration-500"
                />
                <polyline
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className="transition-all duration-500"
                />
                {/* Last point indicator */}
                <circle
                    cx={width}
                    cy={height - ((lastVal - min) / range) * (height - 2 * padding) - padding}
                    r="1.5"
                    fill={strokeColor}
                    className="animate-pulse"
                />
            </svg>
        </div>
    );
};

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const getAvailableYears = (fxDataObj) => {
    const years = new Set();
    fxDataObj.monthlyPrices.forEach(m => {
        years.add(m.month.split('-')[0]);
    });
    return Array.from(years).sort();
};

const getMonthsForYear = (fxDataObj, year) => {
    const months = [];
    fxDataObj.monthlyPrices.forEach(m => {
        if (m.month.startsWith(year)) {
            const mo = parseInt(m.month.split('-')[1]);
            months.push(mo);
        }
    });
    return months.sort((a, b) => a - b);
};

const formatMonth = (m) => {
    const [year, month] = m.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

const YearMonthPicker = ({ label, value, onChange, isOpen, setIsOpen, pickerYear, setPickerYear, fxData, accentColor = 'emerald' }) => {
    const selectedYear = value.split('-')[0];
    const selectedMo = parseInt(value.split('-')[1]);
    const months = getMonthsForYear(fxData, pickerYear);
    const availableYears = getAvailableYears(fxData);
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

export default FxCompare;

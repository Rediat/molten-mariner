import React, { useState } from 'react';
import { calculateLoan, getAmortizationSchedule } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { List, X, FileText, FileSpreadsheet } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FREQUENCIES = [
    { value: 1, label: 'Annually (1)' },
    { value: 2, label: 'Semi-Annually (2)' },
    { value: 4, label: 'Quarterly (4)' },
    { value: 12, label: 'Monthly (12)' },
    { value: 24, label: 'Semi-Monthly (24)' },
    { value: 26, label: 'Bi-Weekly (26)' },
    { value: 52, label: 'Weekly (52)' },
    { value: 365, label: 'Daily (365)' },
];

const INPUT_FIELDS = [
    { id: 'amount', label: 'Loan Amount', sub: 'Principal', decimals: 2 },
    { id: 'rate', label: 'Interest Rate', sub: '% per year', decimals: 2 },
    { id: 'years', label: 'Loan Term', sub: 'Years', decimals: 0 },
];

const LoanCalculator = () => {
    const { addToHistory } = useHistory();
    const [useDates, setUseDates] = useState(true);
    const [values, setValues] = useState({
        amount: 374136.48,
        rate: 9.5,
        years: 15,
        frequency: 12,
        paymentsMade: 0,
        startDate: '2018-08-01',
        futureDate: new Date().toISOString().split('T')[0]
    });
    const [result, setResult] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);

    const calculatePeriodsBetween = (d1, d2, freq) => {
        const start = new Date(d1), end = new Date(d2);
        if (isNaN(start) || isNaN(end)) return 0;

        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

        const periodMap = {
            365: diffDays, 52: Math.floor(diffDays / 7), 26: Math.floor(diffDays / 14),
            12: months, 24: Math.floor(months * 2 + (end.getDate() - start.getDate()) / 15),
            4: Math.floor(months / 3), 2: Math.floor(months / 6), 1: Math.floor(months / 12)
        };
        return periodMap[freq] ?? months;
    };

    const handleCalculate = () => {
        const termPeriods = values.years * values.frequency;
        let pmtMade = useDates
            ? Math.max(0, Math.min(calculatePeriodsBetween(values.startDate, values.futureDate, values.frequency), termPeriods))
            : values.paymentsMade;

        const res = calculateLoan(values.amount, values.rate, values.years, pmtMade, values.frequency);
        setResult({ ...res, calculatedPayments: pmtMade });
        addToHistory('LOAN', { ...values, useDates, calculatedPayments: pmtMade }, res);
    };

    const handleChange = (field, val) => {
        setValues(prev => ({ ...prev, [field]: field.includes('Date') ? val : (parseFloat(val) || 0) }));
    };

    const schedule = result ? getAmortizationSchedule(values.amount, values.rate, values.years, values.frequency, values.startDate) : [];
    const usedPayments = result?.calculatedPayments ?? values.paymentsMade;

    const downloadCSV = () => {
        if (!schedule.length) return;
        const headers = ['Date', 'Period', 'Interest', 'Principal', 'Balance'];
        const rows = schedule.map(r => [r.date || '', r.month, r.interest.toFixed(2), r.principal.toFixed(2), r.balance.toFixed(2)]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'amortization_schedule.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        if (!schedule.length) return;
        const doc = new jsPDF();
        doc.setTextColor(40);
        doc.setFontSize(18);
        doc.text("Amortization Schedule", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Loan Amount: $${values.amount.toLocaleString()} | Rate: ${values.rate}% | Term: ${values.years} Years`, 14, 30);

        autoTable(doc, {
            head: [["Date", "Period", "Interest", "Principal", "Balance"]],
            body: schedule.map(r => [r.date || '-', r.month,
            `$${r.interest.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            `$${r.principal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            `$${r.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]),
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });
        doc.save("amortization_schedule.pdf");
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Loan Calculator</h1>
                <div className="flex flex-col items-end gap-2">
                    <button onClick={() => setUseDates(!useDates)} className="text-[10px] font-bold uppercase tracking-tighter bg-neutral-800 border border-neutral-700 rounded-full px-3 py-1 text-primary-500 hover:bg-neutral-700 transition-all">
                        {useDates ? 'Use Manual Count' : 'Use Dates'}
                    </button>
                    <select value={values.frequency} onChange={(e) => handleChange('frequency', e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-neutral-300 focus:outline-none">
                        {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                </div>
            </div>

            <div className="relative flex-1 min-h-0">
                {!showSchedule ? (
                    <div className="flex flex-col h-full">
                        <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                            {INPUT_FIELDS.map(field => (
                                <div key={field.id} className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex flex-col shrink-0 items-start text-left">
                                            <label className="text-base font-bold text-neutral-300">{field.label}</label>
                                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{field.sub}</span>
                                        </div>
                                        <FormattedNumberInput value={values[field.id]} onChange={(e) => handleChange(field.id, e.target.value)} decimals={field.decimals} className="bg-transparent text-right text-xl font-mono text-white focus:outline-none w-full flex-1" />
                                    </div>
                                </div>
                            ))}

                            {useDates ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {[{ id: 'startDate', label: 'Start Date' }, { id: 'futureDate', label: 'Future Date' }].map(d => (
                                        <div key={d.id} className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all text-left">
                                            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-2">{d.label}</label>
                                            <input type="date" value={values[d.id]} onChange={(e) => handleChange(d.id, e.target.value)} className="bg-transparent text-white text-sm font-mono focus:outline-none w-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex flex-col shrink-0 items-start text-left">
                                            <label className="text-base font-bold text-neutral-300">Payments Made</label>
                                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Count</span>
                                        </div>
                                        <FormattedNumberInput value={values.paymentsMade} onChange={(e) => handleChange('paymentsMade', e.target.value)} decimals={0} className="bg-transparent text-right text-xl font-mono text-white focus:outline-none w-full flex-1" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {result && (
                            <div className="bg-neutral-900/50 rounded-2xl p-4 border border-primary-900/30 mb-2 mt-4">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-neutral-400">Periodic Payment</span>
                                        <button onClick={() => setShowSchedule(true)} className="text-[10px] text-primary-500 font-bold uppercase tracking-tighter flex items-center gap-1 mt-1 hover:text-primary-400">
                                            <List size={12} /> View Schedule
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-3xl font-bold text-primary-500">{formatCurrency(result.monthlyPayment)}</span>
                                        {useDates && <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Based on {result.calculatedPayments} periods</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex flex-col gap-1"><span className="text-neutral-500">Total Interest</span><span className="text-white font-mono">{formatCurrency(result.totalInterest)}</span></div>
                                    <div className="flex flex-col gap-1 text-right"><span className="text-neutral-500">Total Cost</span><span className="text-white font-mono">{formatCurrency(result.totalPayment)}</span></div>
                                    {result.outstandingBalance > 0 && (
                                        <div className="col-span-2 pt-2 border-t border-neutral-800 flex justify-between items-center mt-1">
                                            <span className="text-neutral-400">Outstanding Balance</span>
                                            <span className="text-white font-mono font-bold text-base">{formatCurrency(result.outstandingBalance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button onClick={handleCalculate} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest">
                            <CalculateIcon className="w-5 h-5" /> Calculate
                        </button>
                    </div>
                ) : (
                    <div className="absolute inset-y-0 -left-2 -right-2 bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50 shadow-2xl flex flex-col">
                        <div className="p-2 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                            <h3 className="font-bold text-xs text-white uppercase tracking-wider">Amortization</h3>
                            <div className="flex items-center gap-1">
                                <button onClick={downloadCSV} className="p-1 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-green-500" title="Export CSV"><FileSpreadsheet size={16} /></button>
                                <button onClick={downloadPDF} className="p-1 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-red-500" title="Export PDF"><FileText size={16} /></button>
                                <div className="w-px h-4 bg-neutral-700 mx-1" />
                                <button onClick={() => setShowSchedule(false)} className="p-1 hover:bg-neutral-700 rounded-full transition-colors"><X size={16} className="text-neutral-500" /></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto scrollbar-hide">
                            <table className="w-full text-left text-xs">
                                <thead className="sticky top-0 bg-[#1a1a1a] text-neutral-500 font-bold uppercase tracking-wider z-10">
                                    <tr>
                                        <th className="px-1 py-2">Date (Period)</th>
                                        <th className="px-1 py-2 text-right">Interest</th>
                                        <th className="px-1 py-2 text-right">Principal</th>
                                        <th className="px-1 py-2 text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
                                    {schedule.map((row) => (
                                        <tr key={row.month} className={`hover:bg-neutral-800/30 transition-colors ${row.month <= usedPayments ? 'opacity-50' : ''}`}>
                                            <td className="px-1 py-2 font-mono text-neutral-400 whitespace-nowrap">
                                                {row.date && <span className="text-white font-bold mr-1">{row.date}</span>}
                                                <span className="text-neutral-600">({row.month})</span>
                                            </td>
                                            <td className="px-1 py-2 font-mono text-right text-neutral-400">{row.interest.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-1 py-2 font-mono text-right text-neutral-400">{row.principal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-1 py-2 font-mono text-emerald-500 font-bold text-right">{row.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanCalculator;

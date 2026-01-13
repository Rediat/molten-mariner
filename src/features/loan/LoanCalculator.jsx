import React, { useState } from 'react';
import { calculateLoan, getAmortizationSchedule } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info, List, X } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';

const LoanCalculator = () => {
    const { addToHistory } = useHistory();
    const [useDates, setUseDates] = useState(false);
    const [values, setValues] = useState({
        amount: 250000,
        rate: 5.5,
        years: 30,
        frequency: 12,
        paymentsMade: 0,
        startDate: new Date().toISOString().split('T')[0],
        futureDate: new Date().toISOString().split('T')[0]
    });
    const [result, setResult] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);

    const calculatePeriodsBetween = (d1, d2, freq) => {
        const start = new Date(d1);
        const end = new Date(d2);
        if (isNaN(start) || isNaN(end)) return 0;

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (freq === 365) return diffDays;
        if (freq === 52) return Math.floor(diffDays / 7);
        if (freq === 26) return Math.floor(diffDays / 14);

        // Approximate for months/years
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (freq === 12) return months;
        if (freq === 4) return Math.floor(months / 3);
        if (freq === 2) return Math.floor(months / 6);
        if (freq === 1) return Math.floor(months / 12);

        return months; // Fallback
    };

    const handleCalculate = () => {
        const termPeriods = values.years * values.frequency;
        let pmtMade = values.paymentsMade;

        if (useDates) {
            pmtMade = calculatePeriodsBetween(values.startDate, values.futureDate, values.frequency);
            // Clamp between 0 and term
            pmtMade = Math.max(0, Math.min(pmtMade, termPeriods));
        }

        const res = calculateLoan(values.amount, values.rate, values.years, pmtMade, values.frequency);
        setResult({ ...res, calculatedPayments: pmtMade });
        addToHistory('LOAN', { ...values, useDates, calculatedPayments: pmtMade }, res);
    };

    const handleChange = (field, val) => {
        setValues(prev => ({
            ...prev,
            [field]: (field.includes('Date')) ? val : (parseFloat(val) || 0)
        }));
    };

    const schedule = result ? getAmortizationSchedule(values.amount, values.rate, values.years, values.frequency) : [];
    const usedPayments = result ? result.calculatedPayments ?? values.paymentsMade : values.paymentsMade;

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    Loan Calculator
                </h1>
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={() => setUseDates(!useDates)}
                        className="text-[10px] font-bold uppercase tracking-tighter bg-neutral-800 border border-neutral-700 rounded-full px-3 py-1 text-primary-500 hover:bg-neutral-700 transition-all"
                    >
                        {useDates ? 'Use Manual Count' : 'Use Dates'}
                    </button>
                    <select
                        value={values.frequency}
                        onChange={(e) => handleChange('frequency', e.target.value)}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-neutral-300 focus:outline-none text-left appearance-none cursor-pointer hover:bg-neutral-700"
                    >
                        <option value={1}>Annual (1)</option>
                        <option value={2}>Semi-Annual (2)</option>
                        <option value={4}>Quarterly (4)</option>
                        <option value={12}>Monthly (12)</option>
                        <option value={26}>Bi-weekly (26)</option>
                        <option value={52}>Weekly (52)</option>
                        <option value={365}>Daily (365)</option>
                    </select>
                </div>
            </div>

            {!showSchedule ? (
                <>
                    <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                        {[
                            { id: 'amount', label: 'Loan Amount', sub: 'Principal' },
                            { id: 'rate', label: 'Interest Rate', sub: '% per year' },
                            { id: 'years', label: 'Loan Term', sub: 'Years' },
                        ].map(field => (
                            <div key={field.id} className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex flex-col shrink-0 items-start text-left">
                                        <label className="text-base font-bold text-neutral-300">{field.label}</label>
                                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{field.sub}</span>
                                    </div>
                                    <FormattedNumberInput
                                        value={values[field.id]}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        decimals={field.id === 'years' ? 0 : 2}
                                        className="bg-transparent text-right text-xl font-mono text-white focus:outline-none w-full flex-1 placeholder-neutral-600"
                                    />
                                </div>
                            </div>
                        ))}

                        {useDates ? (
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all">
                                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={values.startDate}
                                        onChange={(e) => handleChange('startDate', e.target.value)}
                                        className="bg-transparent text-white text-sm font-mono focus:outline-none w-full"
                                    />
                                </div>
                                <div className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all">
                                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-2">Future Date</label>
                                    <input
                                        type="date"
                                        value={values.futureDate}
                                        onChange={(e) => handleChange('futureDate', e.target.value)}
                                        className="bg-transparent text-white text-sm font-mono focus:outline-none w-full"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex flex-col shrink-0 items-start text-left">
                                        <label className="text-base font-bold text-neutral-300">Payments Made</label>
                                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Count</span>
                                    </div>
                                    <FormattedNumberInput
                                        value={values.paymentsMade}
                                        onChange={(e) => handleChange('paymentsMade', e.target.value)}
                                        decimals={0}
                                        className="bg-transparent text-right text-xl font-mono text-white focus:outline-none w-full flex-1 placeholder-neutral-600"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className="bg-neutral-900/50 rounded-2xl p-4 border border-primary-900/30 mb-2 mt-4">
                            <div className="flex justify-between items-end mb-3">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-neutral-400">Periodic Payment</span>
                                    <button
                                        onClick={() => setShowSchedule(true)}
                                        className="text-[10px] text-primary-500 font-bold uppercase tracking-tighter flex items-center gap-1 mt-1 hover:text-primary-400 outline-none"
                                    >
                                        <List size={12} /> View Schedule
                                    </button>
                                </div>
                                <div className="text-right">
                                    <span className="block text-3xl font-bold text-primary-500">
                                        {result.monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </span>
                                    {useDates && (
                                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                                            Based on {result.calculatedPayments} periods
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex flex-col gap-1">
                                    <span className="text-neutral-500">Total Interest</span>
                                    <span className="text-white font-mono">
                                        {result.totalInterest.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-neutral-500">Total Cost</span>
                                    <span className="text-white font-mono">
                                        {result.totalPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </span>
                                </div>
                                {result.outstandingBalance > 0 && (
                                    <div className="col-span-2 pt-2 border-t border-neutral-800 flex justify-between items-center mt-1">
                                        <span className="text-neutral-400">Outstanding Balance</span>
                                        <span className="text-white font-mono font-bold text-base">
                                            {result.outstandingBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleCalculate}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                        <CalculateIcon className="w-5 h-5" />
                        Calculate
                    </button>
                </>
            ) : (
                <div className="flex-1 flex flex-col min-h-0 bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                        <h3 className="font-bold text-sm text-white">Amortization Schedule</h3>
                        <button
                            onClick={() => setShowSchedule(false)}
                            className="p-1 hover:bg-neutral-700 rounded-full transition-colors"
                        >
                            <X size={20} className="text-neutral-500" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto scrollbar-hide">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-[#1a1a1a] text-neutral-500 font-bold uppercase tracking-wider z-10">
                                <tr>
                                    <th className="p-4">Period</th>
                                    <th className="p-4">Interest</th>
                                    <th className="p-4">Principal</th>
                                    <th className="p-4 text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
                                {schedule.map((row) => (
                                    <tr key={row.month} className={`hover:bg-neutral-800/30 transition-colors ${row.month <= usedPayments ? 'opacity-50' : ''}`}>
                                        <td className="p-4 font-mono text-neutral-400">{row.month}</td>
                                        <td className="p-4 font-mono text-white">${row.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-4 font-mono text-white">${row.principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-4 font-mono text-emerald-500 font-bold text-right">${row.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple icon for the button
const CalculateIcon = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className={className}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="14" />
        <line x1="8" y1="14" x2="8" y2="14" />
        <line x1="12" y1="14" x2="12" y2="14" />
        <line x1="16" y1="18" x2="16" y2="18" />
        <line x1="8" y1="18" x2="8" y2="18" />
        <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
);

export default LoanCalculator;

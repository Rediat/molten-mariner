import React, { useState } from 'react';
import { calculateLoan } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';

const LoanCalculator = () => {
    const { addToHistory } = useHistory();
    const [values, setValues] = useState({
        amount: 250000,
        rate: 5.5,
        years: 30,
        paymentsMade: 0
    });
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        const termMonths = values.years * 12;
        const res = calculateLoan(values.amount, values.rate, termMonths, values.paymentsMade);
        setResult(res);
        addToHistory('LOAN', values, res);
    };

    const handleChange = (field, val) => {
        setValues(prev => ({
            ...prev,
            [field]: parseFloat(val) || 0
        }));
    };

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent mb-6">
                Loan Calculator
            </h1>

            <div className="space-y-4 flex-1">
                {[
                    { id: 'amount', label: 'Loan Amount', sub: 'Principal' },
                    { id: 'rate', label: 'Interest Rate', sub: '% per year' },
                    { id: 'years', label: 'Loan Term', sub: 'Years' },
                    { id: 'paymentsMade', label: 'Payments Made', sub: 'Count' }
                ].map(field => (
                    <div key={field.id} className="bg-neutral-800/50 rounded-xl p-4 border border-transparent hover:border-neutral-700 transition-all">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <label className="text-base font-bold text-neutral-300">{field.label}</label>
                                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{field.sub}</span>
                            </div>
                            <input
                                type="number"
                                value={values[field.id]}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="bg-transparent text-right text-xl font-mono text-white focus:outline-none w-32 placeholder-neutral-600"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {result && (
                <div className="bg-neutral-900/50 rounded-2xl p-6 border border-primary-900/30 mb-6">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-sm font-medium text-neutral-400">Monthly Payment</span>
                        <span className="text-3xl font-bold text-primary-500">
                            {result.monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
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
                            <div className="col-span-2 pt-2 border-t border-neutral-800 flex justify-between items-center mt-2">
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
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110"
            >
                CALCULATE
            </button>
        </div>
    );
};

export default LoanCalculator;

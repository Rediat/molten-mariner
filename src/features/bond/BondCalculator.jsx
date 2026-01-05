import React, { useState } from 'react';
import { calculateBond, calculateBondYTM } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info } from 'lucide-react';

const BondCalculator = () => {
    const { addToHistory } = useHistory();
    const [target, setTarget] = useState('price'); // 'price' or 'ytm'
    const [values, setValues] = useState({
        faceValue: 1000,
        couponRate: 5,
        ytm: 4,
        price: 1050,
        years: 10,
        frequency: 2 // 1=Annual, 2=Semi
    });
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        let res;
        if (target === 'price') {
            res = calculateBond(
                values.faceValue,
                values.couponRate,
                values.ytm,
                values.years,
                values.frequency
            );
            setResult(res);
            addToHistory('BOND', { ...values, target: 'PRICE' }, res);
        } else {
            res = calculateBondYTM(
                values.faceValue,
                values.couponRate,
                values.price,
                values.years,
                values.frequency
            );
            setResult(res);
            addToHistory('BOND', { ...values, target: 'YTM' }, res);
        }
    };

    const handleChange = (field, val) => {
        setValues(prev => ({
            ...prev,
            [field]: parseFloat(val) || 0
        }));
    };

    const inputFields = [
        { id: 'faceValue', label: 'Face Value', sub: 'Par' },
        { id: 'couponRate', label: 'Coupon Rate', sub: '%' },
        ...(target === 'price'
            ? [{ id: 'ytm', label: 'Yield to Maturity', sub: '%' }]
            : [{ id: 'price', label: 'Bond Price', sub: '$' }]
        ),
        { id: 'years', label: 'Years to Maturity', sub: 'Years' }
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        Bond Pricing
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium">Valuation & Yield</p>
                </div>
                <div className="bg-neutral-800 p-1 rounded-xl flex">
                    <button
                        onClick={() => { setTarget('price'); setResult(null); }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${target === 'price' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500'}`}
                    >
                        PRICE
                    </button>
                    <button
                        onClick={() => { setTarget('ytm'); setResult(null); }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${target === 'ytm' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500'}`}
                    >
                        YTM
                    </button>
                </div>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {inputFields.map(field => (
                    <div key={field.id} className="bg-neutral-800/50 rounded-xl p-3 flex justify-between items-center border border-transparent hover:border-neutral-700 transition-all">
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
                ))}

                <div className="bg-neutral-800/50 rounded-xl p-3 flex justify-between items-center">
                    <label className="text-base font-bold text-neutral-300">Frequency</label>
                    <div className="flex bg-neutral-900 rounded-lg p-1">
                        {[
                            { val: 1, label: 'Annual' },
                            { val: 2, label: 'Semi' }
                        ].map(opt => (
                            <button
                                key={opt.val}
                                onClick={() => handleChange('frequency', opt.val)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${values.frequency === opt.val
                                    ? 'bg-neutral-700 text-white shadow'
                                    : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {result !== null && (
                <div className="bg-neutral-900/50 rounded-2xl p-4 border border-primary-900/30 mb-3 flex justify-between items-end mt-2">
                    <span className="text-sm font-medium text-neutral-400">
                        {target === 'price' ? 'Bond Price' : 'Yield (YTM)'}
                    </span>
                    <span className="text-3xl font-bold text-primary-500 font-mono">
                        {target === 'price'
                            ? result.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                            : `${result.toFixed(3)}%`
                        }
                    </span>
                </div>
            )}

            <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest mt-3"
            >
                <CalculateIcon className="w-5 h-5" />
                Calculate
            </button>
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

export default BondCalculator;

import React, { useState } from 'react';
import { calculateBond, calculateBondYTM, calculateBondYTC, calculateBondDuration, calculateBondConvexity } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';

const BondCalculator = () => {
    const { addToHistory } = useHistory();
    const [target, setTarget] = useState('price'); // 'price' or 'ytm'
    const [values, setValues] = useState({
        faceValue: 1000,
        couponRate: 5,
        ytm: 4,
        price: 1050,
        years: 10,
        frequency: 2, // 1=Annual, 2=Semi
        callPrice: 1000,
        yearsToCall: 5
    });
    const [result, setResult] = useState(null);
    const [metrics, setMetrics] = useState(null);

    const handleCalculate = () => {
        let res;
        let ytmUsed = values.ytm;

        if (target === 'price') {
            res = calculateBond(
                values.faceValue,
                values.couponRate,
                values.ytm,
                values.years,
                values.frequency
            );
        } else {
            res = calculateBondYTM(
                values.faceValue,
                values.couponRate,
                values.price,
                values.years,
                values.frequency
            );
            ytmUsed = res;
        }

        const duration = calculateBondDuration(
            values.faceValue,
            values.couponRate,
            ytmUsed,
            values.years,
            values.frequency
        );

        const convexity = calculateBondConvexity(
            values.faceValue,
            values.couponRate,
            ytmUsed,
            values.years,
            values.frequency
        );

        let ytc = null;
        if (values.yearsToCall > 0) {
            ytc = calculateBondYTC(
                values.faceValue,
                values.couponRate,
                target === 'price' ? res : values.price,
                values.yearsToCall,
                values.callPrice,
                values.frequency
            );
        }

        setResult(res);
        setMetrics({ duration, convexity, ytc });
        addToHistory('BOND', { ...values, target: target.toUpperCase() }, { result: res, ...duration, convexity, ytc });
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
        { id: 'years', label: 'Years to Maturity', sub: 'Years' },
        { id: 'callPrice', label: 'Call Price', sub: '$' },
        { id: 'yearsToCall', label: 'Years to Call', sub: 'Years' }
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
                <div className="flex flex-col items-end gap-2">
                    <div className="bg-neutral-800 p-1 rounded-xl flex">
                        <button
                            onClick={() => { setTarget('price'); setResult(null); setMetrics(null); }}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${target === 'price' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500'}`}
                        >
                            PRICE
                        </button>
                        <button
                            onClick={() => { setTarget('ytm'); setResult(null); setMetrics(null); }}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${target === 'ytm' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500'}`}
                        >
                            YTM
                        </button>
                    </div>
                    <div className="bg-neutral-800 p-1 rounded-xl flex">
                        {[
                            { val: 1, label: 'ANNUAL' },
                            { val: 2, label: 'SEMI' }
                        ].map(opt => (
                            <button
                                key={opt.val}
                                onClick={() => handleChange('frequency', opt.val)}
                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${values.frequency === opt.val
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

            <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {inputFields.map(field => (
                    <div key={field.id} className="bg-neutral-800/40 rounded-xl p-3 flex justify-between items-center gap-4 border border-transparent hover:border-neutral-700 transition-all">
                        <div className="flex flex-col shrink-0 items-start text-left">
                            <label className="text-sm font-bold text-neutral-300">{field.label}</label>
                            <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">{field.sub}</span>
                        </div>
                        <FormattedNumberInput
                            value={values[field.id]}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            decimals={field.id.includes('years') ? 0 : 2}
                            className="bg-transparent text-right text-lg font-mono text-white focus:outline-none w-full flex-1 placeholder-neutral-600"
                        />
                    </div>
                ))}
            </div>

            {result !== null && metrics && (
                <div className="space-y-3 mb-3 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Duration</div>
                            <div className="flex justify-between items-end">
                                <span className="text-xs text-neutral-400">Mac</span>
                                <span className="text-sm font-bold text-white font-mono">{metrics.duration.macaulay.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xs text-neutral-400">Mod</span>
                                <span className="text-sm font-bold text-white font-mono">{metrics.duration.modified.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Convexity</div>
                            <span className="text-sm font-bold text-white font-mono self-end">{metrics.convexity.toFixed(2)}</span>
                        </div>

                        <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">
                                {target === 'price' ? 'Bond Price' : 'Yield (YTM)'}
                            </div>
                            <span className="text-lg font-bold text-primary-500 font-mono self-end">
                                {target === 'price'
                                    ? result.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                    : `${result.toFixed(3)}%`
                                }
                            </span>
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Yield to Call</div>
                            <span className="text-lg font-bold text-secondary-400 font-mono self-end">
                                {metrics.ytc ? `${metrics.ytc.toFixed(3)}%` : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest mt-1"
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

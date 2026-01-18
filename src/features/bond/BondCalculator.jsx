import React, { useState } from 'react';
import { calculateBond, calculateBondYTM, calculateBondYTC, calculateBondDuration, calculateBondConvexity } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';

const BondCalculator = () => {
    const { addToHistory } = useHistory();
    const [target, setTarget] = useState('price');
    const [values, setValues] = useState({
        faceValue: 1000, couponRate: 5, ytm: 4, price: 1050, years: 10, frequency: 2, callPrice: 1000, yearsToCall: 5
    });
    const [result, setResult] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleCalculate = () => {
        const { faceValue, couponRate, ytm, price, years, frequency, callPrice, yearsToCall } = values;
        let res, ytmUsed = ytm;

        if (target === 'price') {
            res = calculateBond(faceValue, couponRate, ytm, years, frequency);
        } else {
            res = calculateBondYTM(faceValue, couponRate, price, years, frequency);
            ytmUsed = res;
        }

        const duration = calculateBondDuration(faceValue, couponRate, ytmUsed, years, frequency);
        const convexity = calculateBondConvexity(faceValue, couponRate, ytmUsed, years, frequency);
        const ytc = yearsToCall > 0 ? calculateBondYTC(faceValue, couponRate, target === 'price' ? res : price, yearsToCall, callPrice, frequency) : null;

        setResult(res);
        setMetrics({ duration, convexity, ytc });
        addToHistory('BOND', { ...values, target: target.toUpperCase() }, { result: res, ...duration, convexity, ytc });
    };

    const handleChange = (field, val) => setValues(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));

    const inputFields = [
        { id: 'faceValue', label: 'Face Value', sub: 'Par' },
        { id: 'couponRate', label: 'Coupon Rate', sub: '%' },
        ...(target === 'price' ? [{ id: 'ytm', label: 'Yield to Maturity', sub: '%' }] : [{ id: 'price', label: 'Bond Price', sub: '$' }]),
        { id: 'years', label: 'Years to Maturity', sub: 'Years' },
        { id: 'callPrice', label: 'Call Price', sub: '$' },
        { id: 'yearsToCall', label: 'Years to Call', sub: 'Years' }
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Bond Pricing</h1>
                    <p className="text-neutral-500 text-sm font-medium">Valuation & Yield</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title="Show Info"
                        >
                            <Info className="w-3 h-3" />
                        </button>
                        <div className="bg-neutral-800 p-1 rounded-xl flex">
                            {['price', 'ytm'].map(t => (
                                <button key={t} onClick={() => { setTarget(t); setResult(null); setMetrics(null); }}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${target === t ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500'}`}>
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-neutral-800 p-1 rounded-xl flex">
                        {[{ val: 1, label: 'ANNUAL' }, { val: 2, label: 'SEMI' }].map(opt => (
                            <button key={opt.val} onClick={() => handleChange('frequency', opt.val)}
                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${values.frequency === opt.val ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'}`}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Bond Valuation</p>
                    <p className="text-[11px] leading-relaxed">
                        Calculate bond prices or Yield to Maturity (YTM). Includes Duration (Macaulay & Modified),
                        Convexity, and Yield to Call (YTC) for callable bonds.
                    </p>
                </div>
            )}

            <div className="space-y-1 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {inputFields.map(field => (
                    <div key={field.id} className="bg-neutral-800/40 rounded-xl p-2 flex justify-between items-center gap-4 border border-transparent hover:border-neutral-700 transition-all">
                        <div className="flex flex-col shrink-0 items-start text-left">
                            <label className="text-sm font-bold text-neutral-300">{field.label}</label>
                            <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">{field.sub}</span>
                        </div>
                        <FormattedNumberInput value={values[field.id]} onChange={(e) => handleChange(field.id, e.target.value)} decimals={field.id.includes('years') ? 0 : 2} className="bg-transparent text-right text-lg font-mono text-white focus:outline-none w-full flex-1" />
                    </div>
                ))}
            </div>

            {result !== null && metrics && (
                <div className="space-y-3 mb-3 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Duration</div>
                            {[{ label: 'Mac', val: metrics.duration.macaulay }, { label: 'Mod', val: metrics.duration.modified }].map(d => (
                                <div key={d.label} className="flex justify-between items-end">
                                    <span className="text-xs text-neutral-400">{d.label}</span>
                                    <span className="text-sm font-bold text-white font-mono">{d.val.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Convexity</div>
                            <span className="text-sm font-bold text-white font-mono self-end">{metrics.convexity.toFixed(2)}</span>
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">{target === 'price' ? 'Bond Price' : 'Yield (YTM)'}</div>
                            <span className="text-lg font-bold text-primary-500 font-mono self-end">
                                {target === 'price' ? result.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : `${result.toFixed(3)}%`}
                            </span>
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Yield to Call</div>
                            <span className="text-lg font-bold text-secondary-400 font-mono self-end">{metrics.ytc ? `${metrics.ytc.toFixed(3)}%` : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-2 mt-1">
                <button
                    onClick={() => {
                        setValues({
                            faceValue: 0, couponRate: 0, ytm: 0, price: 0, years: 0, frequency: 2, callPrice: 0, yearsToCall: 0
                        });
                        setResult(null);
                        setMetrics(null);
                    }}
                    className="w-1/4 bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1.5 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    CLR
                </button>
                <button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest">
                    <CalculateIcon className="w-5 h-5" /> Calculate
                </button>
            </div>
        </div>
    );
};

export default BondCalculator;

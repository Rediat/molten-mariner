import React, { useState } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Wallet, Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const PENSION_TYPES = [
    { id: 'civil', label: 'Civil Servant' },
    { id: 'military', label: 'Military/Police' },
];

const PensionCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    const [pensionType, setPensionType] = useState('civil');
    const [averageSalary, setAverageSalary] = useState(106361.16);
    const [yearsOfService, setYearsOfService] = useState(25);
    const [retirementAge, setRetirementAge] = useState(60);

    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleCalculate = () => {
        // Ethiopian Defined Benefit Pension Formula:
        // Civil Servant: Replacement Rate = 30% + (1.25% × years beyond 10)
        // Military/Police: Replacement Rate = 30% + (1.65% × years beyond 10)
        // Minimum service: 10 years
        // Maximum replacement rate: 70%

        let replacementRate = 0;
        let monthlyPension = 0;
        let annualPension = 0;
        let isEligible = yearsOfService >= 10;

        if (isEligible) {
            // Base 30% for first 10 years, then accrual rate per additional year
            const additionalYears = Math.max(0, yearsOfService - 10);
            const accrualRate = pensionType === 'military' ? 1.65 : 1.25;
            replacementRate = 30 + (accrualRate * additionalYears);

            // Cap at 70%
            replacementRate = Math.min(replacementRate, 70);

            monthlyPension = averageSalary * (replacementRate / 100);
            annualPension = monthlyPension * 12;
        }

        const res = {
            isEligible,
            replacementRate,
            monthlyPension,
            annualPension,
            yearsOfService,
            retirementAge,
            averageSalary,
            pensionType: pensionType === 'civil' ? 'Civil Servant' : 'Military/Police',
        };

        setResult(res);
        addToHistory('PENSION', { averageSalary, yearsOfService, retirementAge, pensionType }, res);
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary-500" />
                        Pension Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        Ethiopian Defined Benefit Plan
                    </p>
                </div>
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

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Ethiopian Pension Scheme</p>
                    <p className="text-[11px] leading-relaxed mb-2">
                        Based on the Defined Benefit plan. Pension is calculated as:
                    </p>
                    <ul className="text-[11px] leading-relaxed list-disc list-inside space-y-1">
                        <li>Base rate: 30% for first 10 years of service</li>
                        <li>Civil Servant: +1.25% for each year beyond 10</li>
                        <li>Military/Police: +1.65% for each year beyond 10</li>
                        <li>Maximum replacement rate: 70%</li>
                        <li>Minimum service required: 10 years</li>
                    </ul>
                </div>
            )}

            {/* Input Fields */}
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {/* Pension Type Selector */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1 text-center">Pension Type</label>
                    <div className="grid grid-cols-2 gap-1">
                        {PENSION_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setPensionType(type.id)}
                                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${pensionType === type.id
                                    ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                                    : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Average Salary */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-primary-500/50 ring-1 ring-primary-500/10">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label className="text-sm font-bold text-primary-400 block leading-tight text-left">Average Salary</label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Last 3 Years</span>
                        </div>
                        <FormattedNumberInput
                            value={averageSalary}
                            onChange={(e) => setAverageSalary(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-primary-400 font-black min-w-0 flex-1"
                            placeholder="25,000"
                        />
                    </div>
                </div>

                {/* Years of Service */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label className="text-sm font-bold text-white block leading-tight text-left">Years of Service</label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Total Working Years</span>
                        </div>
                        <FormattedNumberInput
                            value={yearsOfService}
                            onChange={(e) => setYearsOfService(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                            decimals={0}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                            placeholder="30"
                        />
                    </div>
                </div>

                {/* Retirement Age */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label className="text-sm font-bold text-white block leading-tight text-left">Retirement Age</label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Expected Age</span>
                        </div>
                        <FormattedNumberInput
                            value={retirementAge}
                            onChange={(e) => setRetirementAge(parseFloat(e.target.value.replace(/,/g, '')) || 0)}
                            decimals={0}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                            placeholder="60"
                        />
                    </div>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="mt-2 bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                        <button
                            onClick={() => setShowHistory(true)}
                            className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                        >
                            <History size={12} /> View History
                        </button>
                    </div>

                    {!result.isEligible ? (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-center">
                            <p className="text-red-400 font-bold text-sm">Not Eligible</p>
                            <p className="text-[11px] text-red-300 mt-1">Minimum 10 years of service required</p>
                        </div>
                    ) : (
                        <>
                            {/* Monthly Pension - Main Result */}
                            <div className="bg-neutral-900/80 rounded-lg p-3 border border-primary-500/30">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Monthly Pension</p>
                                <p className="text-2xl font-black text-primary-400">
                                    {formatCurrency(result.monthlyPension)}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-neutral-900/50 rounded-lg p-2.5">
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Annual Pension</p>
                                    <p className="text-lg font-black text-emerald-400">
                                        {formatCurrency(result.annualPension)}
                                    </p>
                                </div>
                                <div className="bg-neutral-900/50 rounded-lg p-2.5">
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Replacement Rate</p>
                                    <p className="text-lg font-black text-amber-400">
                                        {result.replacementRate.toFixed(2)}%
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-700">
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">Type</p>
                                    <p className="text-[10px] font-bold text-white">{result.pensionType}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">Avg Salary</p>
                                    <p className="text-[10px] font-bold text-white">{formatCurrency(result.averageSalary)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">Years</p>
                                    <p className="text-xs font-bold text-white">{result.yearsOfService}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">Retire</p>
                                    <p className="text-xs font-bold text-white">{result.retirementAge}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-2 flex gap-1.5">
                <button
                    onClick={() => {
                        setPensionType('civil');
                        setAverageSalary(106361.16);
                        setYearsOfService(25);
                        setRetirementAge(60);
                        setResult(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
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
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="Pension"
                title="Pension"
            />
        </div>
    );
};

export default PensionCalculator;

import React, { useState } from 'react';
import { Car, Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import { useHistory } from '../../context/HistoryContext';
import HistoryOverlay from '../../components/HistoryOverlay';

const DEFAULT_VALUES = {
    distance: 15,
    mileage: 0.1,
    costPerLiter: 130,
    serviceFactor: 3
};

const RideFareCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [values, setValues] = useState(DEFAULT_VALUES);
    const [results, setResults] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Mode: 'forward' = Inputs → Price, 'reverse' = Price → Breakdown
    const [mode, setMode] = useState('forward');
    const [priceToCharge, setPriceToCharge] = useState(585);

    const handleCalculate = () => {
        if (mode === 'forward') {
            const totalFuelCost = values.distance * values.mileage * values.costPerLiter;
            const reasonablePrice = totalFuelCost * values.serviceFactor;
            const revenuePerKm = values.distance > 0 ? reasonablePrice / values.distance : 0;
            const netGain = reasonablePrice - totalFuelCost;
            const netGainPerKm = values.distance > 0 ? netGain / values.distance : 0;
            const fuelPerKm = values.distance > 0 ? totalFuelCost / values.distance : 0;
            const perHead = reasonablePrice / 4;

            const newResults = { totalFuelCost, reasonablePrice, revenuePerKm, netGain, netGainPerKm, fuelPerKm, perHead };
            setResults(newResults);
            addToHistory('Ride', { ...values, mode: 'forward' }, newResults);
        } else {
            // Reverse: given Price to Charge, derive everything
            const totalFuelCost = values.distance * values.mileage * values.costPerLiter;
            const netGain = priceToCharge - totalFuelCost;
            const perHead = priceToCharge / 4;
            const revenuePerKm = values.distance > 0 ? priceToCharge / values.distance : 0;
            const fuelPerKm = values.distance > 0 ? totalFuelCost / values.distance : 0;
            const netGainPerKm = values.distance > 0 ? netGain / values.distance : 0;
            const serviceFactor = totalFuelCost > 0 ? priceToCharge / totalFuelCost : 0;

            const newResults = { totalFuelCost, reasonablePrice: priceToCharge, revenuePerKm, netGain, netGainPerKm, fuelPerKm, perHead, serviceFactor };
            setResults(newResults);
            addToHistory('Ride', { ...values, priceToCharge, mode: 'reverse' }, newResults);
        }
    };

    const handleChange = (field, val) => {
        const numericVal = parseFloat(val) || 0;
        setValues(prev => ({ ...prev, [field]: numericVal }));
        setResults(null);
    };

    const handleClear = () => {
        setValues(DEFAULT_VALUES);
        setPriceToCharge(585);
        setResults(null);
    };

    const formatNum = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Car className="w-5 h-5 text-primary-500" />
                        Ride Fare Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        Transport & Fuel Cost
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
                    <p className="font-bold text-primary-400 mb-1">Ride Fare Logic</p>
                    <p className="text-[11px] leading-relaxed">
                        {mode === 'forward'
                            ? 'Calculate the price to charge from distance, fuel efficiency, fuel price, and service factor.'
                            : 'Enter a known price to charge and get the full cost breakdown (fuel, gain, per-km rates, per-head split).'}
                    </p>
                </div>
            )}

            {/* Mode Toggle */}
            <div className="flex mb-2 bg-neutral-900/50 rounded-lg p-0.5">
                <button
                    onClick={() => { setMode('forward'); setResults(null); }}
                    className={`flex-1 py-1.5 px-2 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'forward' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                    Inputs → Price
                </button>
                <button
                    onClick={() => { setMode('reverse'); setResults(null); }}
                    className={`flex-1 py-1.5 px-2 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'reverse' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                    Price → Breakdown
                </button>
            </div>

            {/* Input Fields */}
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {/* Distance - shared in both modes */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-primary-500/50 ring-1 ring-primary-500/10">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label className="text-sm font-bold text-primary-400 block leading-tight text-left">Distance (Km)</label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Trip Length</span>
                        </div>
                        <FormattedNumberInput
                            value={values.distance}
                            onChange={(e) => handleChange('distance', e.target.value)}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-primary-400 font-black min-w-0 flex-1"
                        />
                    </div>
                </div>

                {/* Fuel Mileage (Read-Only) - shared */}
                <div className="bg-neutral-900/30 rounded-xl p-2.5 border border-neutral-700/50 opacity-80">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label className="text-sm font-bold text-neutral-500 block leading-tight text-left">Fuel Mileage (L/Km)</label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-600 font-bold text-left block">Efficiency</span>
                        </div>
                        <span className="text-right text-lg font-mono text-neutral-400 min-w-0 flex-1">
                            {values.mileage.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Fuel Cost - shared */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label className="text-sm font-bold text-white block leading-tight text-left">Fuel Cost (Per Liter)</label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Current Price</span>
                        </div>
                        <FormattedNumberInput
                            value={values.costPerLiter}
                            onChange={(e) => handleChange('costPerLiter', e.target.value)}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                            placeholder="130.00"
                        />
                    </div>
                </div>

                {mode === 'forward' ? (
                    /* Service Factor - forward mode only */
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label className="text-sm font-bold text-white block leading-tight text-left">Service Factor</label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Multiplier (Min 2.55, Med 3, Max 4.5)</span>
                            </div>
                            <FormattedNumberInput
                                value={values.serviceFactor}
                                onChange={(e) => handleChange('serviceFactor', e.target.value)}
                                decimals={1}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                            />
                        </div>
                    </div>
                ) : (
                    /* Price to Charge - reverse mode only */
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-emerald-500/50 ring-1 ring-emerald-500/10">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label className="text-sm font-bold text-emerald-400 block leading-tight text-left">Price to Charge</label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Known Fare Amount</span>
                            </div>
                            <FormattedNumberInput
                                value={priceToCharge}
                                onChange={(e) => { setPriceToCharge(parseFloat(e.target.value.replace(/,/g, '')) || 0); setResults(null); }}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-emerald-400 font-black min-w-0 flex-1"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            {results && (
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

                    {/* Price to Charge - Main Result */}
                    <div className="bg-neutral-900/80 rounded-lg p-3 border border-primary-500/30">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Price to Charge</p>
                                <p className="text-2xl font-black text-primary-400">
                                    {formatNum(results.reasonablePrice)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Per Head</p>
                                <p className="text-lg font-black text-primary-300">
                                    {formatNum(results.perHead)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-neutral-900/50 rounded-lg p-2.5">
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Total Fuel Cost</p>
                            <p className="text-lg font-black text-amber-400">
                                {formatNum(results.totalFuelCost)}
                            </p>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-2.5">
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Net Gain</p>
                            <p className="text-lg font-black text-emerald-400">
                                {formatNum(results.netGain)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-700">
                        <div>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase">Fuel / Km</p>
                            <p className="text-[10px] font-bold text-white">{formatNum(results.fuelPerKm)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase">Revenue / Km</p>
                            <p className="text-[10px] font-bold text-white">{formatNum(results.revenuePerKm)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase">Gain / Km</p>
                            <p className="text-[10px] font-bold text-white">{formatNum(results.netGainPerKm)}</p>
                        </div>
                    </div>

                    {/* Show derived service factor in reverse mode */}
                    {mode === 'reverse' && results.serviceFactor !== undefined && (
                        <div className="pt-2 border-t border-neutral-700">
                            <div className="flex justify-between items-center">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Implied Service Factor</p>
                                <p className="text-xs font-bold text-white">{results.serviceFactor.toFixed(2)}x</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-2 flex gap-1.5">
                <button
                    onClick={handleClear}
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
                module="Ride"
                title="Ride Fare"
            />
        </div>
    );
};

export default RideFareCalculator;

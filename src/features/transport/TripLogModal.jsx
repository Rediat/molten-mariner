import React, { useState, useMemo } from 'react';
import { X, ClipboardList, Gauge, Clock, Fuel, DollarSign, TrendingUp, Calculator, ArrowLeft } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';

const TripLogModal = ({ isOpen, onClose, defaultMileage = 0.1, defaultCostPerLiter = 170 }) => {
    const [startOdo, setStartOdo] = useState(null);
    const [endOdo, setEndOdo] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [fareReceived, setFareReceived] = useState(null);

    const results = useMemo(() => {
        if (startOdo === null || endOdo === null || endOdo < startOdo) return null;

        const distance = endOdo - startOdo;
        const oneWayFuelCost = distance * defaultMileage * defaultCostPerLiter;
        const roundTripFuelCost = oneWayFuelCost * 2;
        
        const netGainSingle = fareReceived !== null ? fareReceived - oneWayFuelCost : 0;
        const netGainRound = fareReceived !== null ? fareReceived - roundTripFuelCost : 0;
        
        const efficiency = distance > 0 && fareReceived !== null ? fareReceived / distance : 0;
        const gainPerKm = distance > 0 ? netGainSingle / distance : 0;

        let workHours = 0;
        if (startTime && endTime) {
            const [sH, sM] = startTime.split(':').map(Number);
            const [eH, eM] = endTime.split(':').map(Number);
            const startTotal = sH * 60 + sM;
            const endTotal = eH * 60 + eM;
            if (endTotal >= startTotal) {
                workHours = (endTotal - startTotal) / 60;
            } else {
                workHours = (endTotal + 1440 - startTotal) / 60; // Overnight
            }
        }

        return {
            distance,
            oneWayFuelCost,
            roundTripFuelCost,
            netGainSingle,
            netGainRound,
            efficiency,
            gainPerKm,
            workHours
        };
    }, [startOdo, endOdo, fareReceived, startTime, endTime, defaultMileage, defaultCostPerLiter]);

    if (!isOpen) return null;

    const formatNum = (val) => (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="absolute inset-0 bg-neutral-900 z-[70] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="bg-neutral-900 border-b border-neutral-800 flex items-center gap-3 p-3">
                <button
                    onClick={onClose}
                    className="h-11 w-11 flex items-center justify-center bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-neutral-400 hover:text-white transition-all active:scale-95 shrink-0"
                    title="Back"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-primary-400" />
                        <h3 className="font-black text-white text-xs uppercase tracking-wider leading-none">Trip Log</h3>
                    </div>
                    <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Manual Entry & Analysis</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-3 gap-4 overflow-y-auto scrollbar-hide">
                {/* Odometer Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Gauge size={12} className="text-primary-400" /> Start Odo (Km)
                        </label>
                        <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-3 py-2.5">
                            <FormattedNumberInput
                                value={startOdo}
                                onChange={(e) => setStartOdo(parseFloat(e.target.value.replace(/,/g, '')) || null)}
                                decimals={1}
                                className="bg-transparent text-white font-mono font-bold w-full focus:outline-none text-lg"
                                placeholder="0.0"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Gauge size={12} className="text-emerald-400" /> End Odo (Km)
                        </label>
                        <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-3 py-2.5">
                            <FormattedNumberInput
                                value={endOdo}
                                onChange={(e) => setEndOdo(parseFloat(e.target.value.replace(/,/g, '')) || null)}
                                decimals={1}
                                className="bg-transparent text-white font-mono font-bold w-full focus:outline-none text-lg"
                                placeholder="0.0"
                            />
                        </div>
                    </div>
                </div>

                {/* Time Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock size={12} className="text-primary-400" /> Start Time
                        </label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-3 py-2.5 text-white font-mono font-bold w-full focus:outline-none focus:border-primary-500/50 transition-colors text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock size={12} className="text-emerald-400" /> End Time
                        </label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-3 py-2.5 text-white font-mono font-bold w-full focus:outline-none focus:border-emerald-500/50 transition-colors text-lg"
                        />
                    </div>
                </div>

                {/* Fare Section */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign size={12} className="text-amber-400" /> Total Amount Received
                    </label>
                    <div className="bg-neutral-800/40 border border-amber-500/20 rounded-xl px-4 py-4">
                        <FormattedNumberInput
                            value={fareReceived}
                            onChange={(e) => setFareReceived(parseFloat(e.target.value.replace(/,/g, '')) || null)}
                            decimals={2}
                            className="bg-transparent text-amber-400 text-4xl font-black w-full focus:outline-none"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                    {/* Results Section */}
                    {results && (
                        <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="h-px bg-neutral-800 w-full" />
                            
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-neutral-800/50 rounded-xl p-2 border border-neutral-700/50">
                                    <p className="text-[7px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Dist (Km)</p>
                                    <p className="text-xs font-black text-white">{results.distance.toFixed(1)}</p>
                                </div>
                                <div className="bg-neutral-800/50 rounded-xl p-2 border border-neutral-700/50">
                                    <p className="text-[7px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Work Hours</p>
                                    <p className="text-xs font-black text-emerald-400">{results.workHours.toFixed(1)}</p>
                                </div>
                                <div className="bg-neutral-800/50 rounded-xl p-2 border border-neutral-700/50">
                                    <p className="text-[7px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Fuel (1x)</p>
                                    <p className="text-xs font-black text-rose-400">{formatNum(results.oneWayFuelCost)}</p>
                                </div>
                            </div>

                            {/* Net Gain Cards */}
                            <div className="space-y-2">
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Net Gain (One-Way)</p>
                                        <TrendingUp size={14} className="text-emerald-500" />
                                    </div>
                                    <p className="text-3xl font-black text-emerald-400">{formatNum(results.netGainSingle)}</p>
                                    <p className="text-[9px] text-emerald-500/70 font-bold mt-1 uppercase tracking-widest">EFFICIENCY: {formatNum(results.gainPerKm)} ETB/KM</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-3">
                                        <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Net Gain (RT)</p>
                                        <p className={`text-base font-black ${results.netGainRound >= 0 ? 'text-white' : 'text-rose-400'}`}>
                                            {formatNum(results.netGainRound)}
                                        </p>
                                        <p className="text-[7px] text-neutral-600 font-bold uppercase mt-1 tracking-tight">Return inc.</p>
                                    </div>

                                    <div className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-bold text-primary-400 uppercase tracking-widest mb-1">Gross Yield</p>
                                            <p className="text-base font-black text-white">{formatNum(results.efficiency)}</p>
                                            <p className="text-[7px] text-neutral-500 font-bold uppercase mt-1 tracking-tight">ETB/KM</p>
                                        </div>
                                        <Calculator size={14} className="text-primary-400/50 shrink-0" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
    );
};

export default TripLogModal;

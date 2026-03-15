import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Play, Square, RotateCcw, Navigation, Clock, Gauge, MapPin, TrendingUp, Fuel, DollarSign, Timer, Zap } from 'lucide-react';

// Haversine formula – returns distance in kilometers
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const WAIT_SPEED_THRESHOLD = 5; // km/h — below this is "waiting"
const MIN_ACCURACY = 50; // meters — ignore inaccurate fixes
const MIN_DISTANCE = 0.005; // km (5m) — noise filter

const LiveFareTracker = ({ isVisible, onClose, fareData }) => {
    // ---- Tracking state (persists across show/hide) ----
    const [trackingState, setTrackingState] = useState('idle'); // 'idle' | 'tracking' | 'stopped'
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalWaitTime, setTotalWaitTime] = useState(0); // seconds
    const [elapsedTime, setElapsedTime] = useState(0); // seconds
    const [currentSpeed, setCurrentSpeed] = useState(0); // km/h
    const [currentFare, setCurrentFare] = useState(0);
    const [positionCount, setPositionCount] = useState(0);
    const [gpsAccuracy, setGpsAccuracy] = useState(null);
    const [lastLocationName, setLastLocationName] = useState(null);

    // Refs for values that need to survive across watchPosition callbacks
    const lastPositionRef = useRef(null);
    const lastTimestampRef = useRef(null);
    const watchIdRef = useRef(null);
    const timerIdRef = useRef(null);
    const waitAccumulatorRef = useRef(0);
    const distanceAccumulatorRef = useRef(0);
    const startTimeRef = useRef(null);
    const elapsedAtPauseRef = useRef(0);
    const isWaitingRef = useRef(true); // start as waiting until first GPS movement detected

    // Fare parameters from parent (with defaults)
    const mileage = fareData?.mileage ?? 0.10; // L/km
    const costPerLiter = fareData?.costPerLiter ?? 135;
    const serviceMultiplier = fareData?.serviceMultiplier ?? 3;
    const waitMultiplier = fareData?.waitMultiplier ?? 2.5;

    // ---- Fare calculation ----
    const computeFare = useCallback((dist, waitSecs) => {
        const fuelCost = dist * mileage * costPerLiter;
        const baseFare = fuelCost * serviceMultiplier * 2; // round-trip fuel estimate
        const waitCharge = (waitSecs / 60) * waitMultiplier * 2;
        return baseFare + waitCharge;
    }, [mileage, costPerLiter, serviceMultiplier, waitMultiplier]);

    // ---- Update fare whenever distance or wait changes ----
    useEffect(() => {
        setCurrentFare(computeFare(totalDistance, totalWaitTime));
    }, [totalDistance, totalWaitTime, computeFare]);

    // ---- Elapsed time ticker (also accumulates wait time continuously) ----
    useEffect(() => {
        if (trackingState === 'tracking') {
            timerIdRef.current = setInterval(() => {
                const now = Date.now();
                const elapsed = elapsedAtPauseRef.current + Math.floor((now - startTimeRef.current) / 1000);
                setElapsedTime(elapsed);

                // Accumulate wait time every second when speed is below threshold
                if (isWaitingRef.current) {
                    waitAccumulatorRef.current += 1;
                    setTotalWaitTime(waitAccumulatorRef.current);
                    // Recalculate fare so the UI stays live
                    setCurrentFare(computeFare(distanceAccumulatorRef.current, waitAccumulatorRef.current));
                }
            }, 1000);
        }
        return () => {
            if (timerIdRef.current) clearInterval(timerIdRef.current);
        };
    }, [trackingState, computeFare]);

    // ---- GPS watchPosition handler ----
    const handlePosition = useCallback((position) => {
        const { latitude, longitude, accuracy, speed: gpsSpeed } = position.coords;
        const timestamp = position.timestamp;

        setGpsAccuracy(Math.round(accuracy));
        setPositionCount(c => c + 1);

        // Ignore low-accuracy fixes
        if (accuracy > MIN_ACCURACY) return;

        const lastPos = lastPositionRef.current;
        const lastTime = lastTimestampRef.current;

        if (lastPos && lastTime) {
            const dist = haversineDistance(lastPos.lat, lastPos.lng, latitude, longitude);
            const timeDelta = (timestamp - lastTime) / 1000; // seconds

            // Compute speed from GPS or from position delta
            let speedKmh = 0;
            if (gpsSpeed != null && gpsSpeed >= 0) {
                speedKmh = gpsSpeed * 3.6; // m/s → km/h
            } else if (timeDelta > 0) {
                speedKmh = (dist / timeDelta) * 3600; // km/s → km/h
            }
            setCurrentSpeed(Math.round(speedKmh));

            // Update waiting flag so the timer interval can accumulate wait time
            isWaitingRef.current = speedKmh < WAIT_SPEED_THRESHOLD;

            // Only accumulate distance if it exceeds noise threshold
            if (dist >= MIN_DISTANCE) {
                distanceAccumulatorRef.current += dist;
                setTotalDistance(distanceAccumulatorRef.current);
            }
        } else {
            // First fix — compute speed from GPS if available
            if (gpsSpeed != null && gpsSpeed >= 0) {
                setCurrentSpeed(Math.round(gpsSpeed * 3.6));
            }
        }

        lastPositionRef.current = { lat: latitude, lng: longitude };
        lastTimestampRef.current = timestamp;
    }, []);

    // ---- Start tracking ----
    const startTracking = useCallback(() => {
        if (!navigator.geolocation) return;

        setTrackingState('tracking');
        startTimeRef.current = Date.now();
        elapsedAtPauseRef.current = 0;
        isWaitingRef.current = true;

        // Reset accumulators
        lastPositionRef.current = null;
        lastTimestampRef.current = null;
        distanceAccumulatorRef.current = 0;
        waitAccumulatorRef.current = 0;
        setTotalDistance(0);
        setTotalWaitTime(0);
        setElapsedTime(0);
        setCurrentSpeed(0);
        setPositionCount(0);
        setGpsAccuracy(null);
        setCurrentFare(0);

        watchIdRef.current = navigator.geolocation.watchPosition(
            handlePosition,
            (error) => console.warn('GPS error:', error.message),
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        );
    }, [handlePosition]);

    // ---- Stop tracking ----
    const stopTracking = useCallback(() => {
        if (watchIdRef.current != null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
        }
        setTrackingState('stopped');
    }, []);

    // ---- Reset (back to idle) ----
    const resetTracking = useCallback(() => {
        stopTracking();
        setTrackingState('idle');
        setTotalDistance(0);
        setTotalWaitTime(0);
        setElapsedTime(0);
        setCurrentSpeed(0);
        setCurrentFare(0);
        setPositionCount(0);
        setGpsAccuracy(null);
        lastPositionRef.current = null;
        lastTimestampRef.current = null;
        distanceAccumulatorRef.current = 0;
        waitAccumulatorRef.current = 0;
        elapsedAtPauseRef.current = 0;
        isWaitingRef.current = true;
    }, [stopTracking]);

    // ---- Cleanup on unmount ----
    useEffect(() => {
        return () => {
            if (watchIdRef.current != null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (timerIdRef.current) clearInterval(timerIdRef.current);
        };
    }, []);

    // ---- Helpers ----
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const formatNum = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const fuelCost = totalDistance * mileage * costPerLiter * 2;
    const waitCharge = (totalWaitTime / 60) * waitMultiplier * 2;
    const netGain = currentFare - fuelCost;

    return (
        <div className={`absolute inset-0 bg-neutral-900 flex flex-col z-[60] transition-all duration-300 ease-in-out ${isVisible
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none translate-y-4'
            }`}>

            {/* Header */}
            <div className="flex items-center gap-3 p-3 border-b border-neutral-800">
                <button
                    onClick={onClose}
                    className="p-2.5 bg-neutral-800/80 border border-neutral-700/50 rounded-xl text-neutral-400 hover:text-white transition-all hover:bg-neutral-700 active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Live Fare Tracker
                    </h2>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5 text-left">
                        Real-time GPS Tracking
                    </p>
                </div>
                {trackingState === 'tracking' && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                    </div>
                )}
                {gpsAccuracy != null && trackingState === 'tracking' && (
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${gpsAccuracy <= 15 ? 'bg-emerald-500/20 text-emerald-400' : gpsAccuracy <= 30 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        ±{gpsAccuracy}m
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto scrollbar-hide">

                {/* Elapsed Timer — Big Display */}
                <div className="text-center py-2">
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-1">Elapsed Time</p>
                    <p className={`text-5xl font-black font-mono tracking-wider ${trackingState === 'tracking' ? 'text-white' : trackingState === 'stopped' ? 'text-amber-400' : 'text-neutral-600'
                        }`}>
                        {formatTime(elapsedTime)}
                    </p>
                </div>

                {/* Live Fare — Hero Card */}
                <div className={`rounded-2xl p-3 border transition-all duration-500 ${trackingState === 'tracking'
                    ? 'bg-gradient-to-br from-primary-900/40 to-primary-800/20 border-primary-500/50 shadow-[0_0_30px_rgba(14,165,233,0.15)]'
                    : trackingState === 'stopped'
                        ? 'bg-gradient-to-br from-amber-900/30 to-neutral-800/50 border-amber-500/40'
                        : 'bg-neutral-800/40 border-neutral-700/40'
                    }`}>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-[0.15em]">
                                {trackingState === 'stopped' ? 'Final Fare' : 'Running Fare'}
                            </p>
                            <p className={`text-4xl font-black mt-0.5 ${trackingState === 'tracking' ? 'text-primary-400' : trackingState === 'stopped' ? 'text-amber-400' : 'text-neutral-600'
                                }`}>
                                {formatNum(currentFare)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Per Head</p>
                            <p className={`text-xl font-black ${trackingState !== 'idle' ? 'text-primary-300' : 'text-neutral-600'}`}>
                                {formatNum(currentFare / 4)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Speed + Distance Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-2.5 border transition-colors ${currentSpeed > 0 && trackingState === 'tracking'
                        ? 'bg-emerald-900/20 border-emerald-500/40'
                        : 'bg-neutral-800/40 border-neutral-700/40'
                        }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Gauge className={`w-3 h-3 ${currentSpeed > 0 ? 'text-emerald-400' : 'text-neutral-500'}`} />
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Speed</span>
                        </div>
                        <p className={`text-2xl font-black font-mono ${currentSpeed > 0 ? 'text-emerald-400' : 'text-neutral-600'}`}>
                            {currentSpeed}
                        </p>
                        <p className="text-[8px] text-neutral-600 font-bold">KM/H</p>
                    </div>

                    <div className={`rounded-xl p-2.5 border transition-colors ${totalDistance > 0
                        ? 'bg-primary-900/20 border-primary-500/40'
                        : 'bg-neutral-800/40 border-neutral-700/40'
                        }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Navigation className={`w-3 h-3 ${totalDistance > 0 ? 'text-primary-400' : 'text-neutral-500'}`} />
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Distance</span>
                        </div>
                        <p className={`text-2xl font-black font-mono ${totalDistance > 0 ? 'text-primary-400' : 'text-neutral-600'}`}>
                            {totalDistance.toFixed(2)}
                        </p>
                        <p className="text-[8px] text-neutral-600 font-bold">KM</p>
                    </div>
                </div>

                {/* Wait Time + Fuel Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-2.5 border transition-colors ${totalWaitTime > 0
                        ? 'bg-amber-900/20 border-amber-500/40'
                        : 'bg-neutral-800/40 border-neutral-700/40'
                        }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Timer className={`w-3 h-3 ${totalWaitTime > 0 ? 'text-amber-400' : 'text-neutral-500'}`} />
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Wait Time</span>
                        </div>
                        <p className={`text-lg font-black font-mono ${totalWaitTime > 0 ? 'text-amber-400' : 'text-neutral-600'}`}>
                            {formatTime(Math.round(totalWaitTime))}
                        </p>
                        <p className="text-[8px] text-neutral-600 font-bold">
                            Charge: {formatNum(waitCharge)}
                        </p>
                    </div>

                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-neutral-700/40">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Fuel className="w-3 h-3 text-neutral-500" />
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Fuel Cost</span>
                        </div>
                        <p className={`text-lg font-black font-mono ${fuelCost > 0 ? 'text-rose-400' : 'text-neutral-600'}`}>
                            {formatNum(fuelCost)}
                        </p>
                        <p className={`text-[8px] font-bold ${netGain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            Net: {netGain >= 0 ? '+' : ''}{formatNum(netGain)}
                        </p>
                    </div>
                </div>

                {/* Trip Summary (shown when stopped) */}
                {trackingState === 'stopped' && (
                    <div className="bg-gradient-to-br from-amber-900/20 to-neutral-800/40 rounded-xl p-2.5 border border-amber-500/30 space-y-1.5">
                        <p className="text-[9px] font-bold text-amber-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3" /> Trip Summary
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Distance</p>
                                <p className="text-sm font-black text-white">{totalDistance.toFixed(2)} km</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Duration</p>
                                <p className="text-sm font-black text-white">{formatTime(elapsedTime)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Avg Speed</p>
                                <p className="text-sm font-black text-white">
                                    {elapsedTime > 0 ? Math.round((totalDistance / elapsedTime) * 3600) : 0} km/h
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-neutral-700/50">
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Total Fare</p>
                                <p className="text-sm font-black text-amber-400">{formatNum(currentFare)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Fuel</p>
                                <p className="text-sm font-black text-rose-400">{formatNum(fuelCost)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Net Gain</p>
                                <p className={`text-sm font-black ${netGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {formatNum(netGain)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fare Parameters Info */}
                {trackingState === 'idle' && (
                    <div className="bg-neutral-800/30 rounded-xl p-3 border border-neutral-700/30 space-y-1.5">
                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Fare Parameters</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Mileage</span>
                                <span className="text-white font-bold">{mileage} L/km</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Fuel Cost</span>
                                <span className="text-white font-bold">{costPerLiter}/L</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Service ×</span>
                                <span className="text-white font-bold">{serviceMultiplier}×</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Wait ×</span>
                                <span className="text-white font-bold">{waitMultiplier}×</span>
                            </div>
                        </div>
                        <p className="text-[8px] text-neutral-600 pt-1 border-t border-neutral-700/30">
                            These values come from your Ride Fare calculator. Change them there to adjust live tracking rates.
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="p-3 border-t border-neutral-800 space-y-2">
                {trackingState === 'idle' && (
                    <button
                        onClick={startTracking}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-base py-3 rounded-xl shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        <Play className="w-5 h-5" fill="currentColor" />
                        Start Tracking
                    </button>
                )}

                {trackingState === 'tracking' && (
                    <button
                        onClick={stopTracking}
                        className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black text-base py-3 rounded-xl shadow-lg shadow-rose-900/30 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-3 uppercase tracking-widest animate-pulse"
                    >
                        <Square className="w-5 h-5" fill="currentColor" />
                        Stop Tracking
                    </button>
                )}

                {trackingState === 'stopped' && (
                    <div className="flex gap-2">
                        <button
                            onClick={resetTracking}
                            className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold text-sm py-3 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                            <RotateCcw className="w-4 h-4" />
                            New Trip
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-sm py-3 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                            <DollarSign className="w-4 h-4" />
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveFareTracker;

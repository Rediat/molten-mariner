import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Play, Square, RotateCcw, Navigation, Clock, Gauge, MapPin, TrendingUp, Fuel, DollarSign, Timer, Zap, Car, ChevronDown, ChevronUp, Layers } from 'lucide-react';

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
const MIN_ACCURACY = 100; // meters — relaxed to capture more points in urban areas
const MIN_DISTANCE = 0.002; // km (2m) — capture even slow movement
const MAX_STOPS = 5;

const LiveFareTracker = ({ isVisible, onClose, fareData }) => {
    // ---- Multi-Stop State ----
    const [stops, setStops] = useState([
        { id: 1, distance: 0, waitTime: 0, elapsedTime: 0, fare: 0, status: 'idle' }
    ]);
    const [activeStopIndex, setActiveStopIndex] = useState(0); // Which stop is being viewed
    const [trackingStopIndex, setTrackingStopIndex] = useState(null); // Which stop is currently tracking (null if none)
    const [viewMode, setViewMode] = useState('individual'); // 'individual' | 'total'

    const [currentSpeed, setCurrentSpeed] = useState(0); // km/h
    const [positionCount, setPositionCount] = useState(0);
    const [gpsAccuracy, setGpsAccuracy] = useState(null);
    const [showMarketComparison, setShowMarketComparison] = useState(false);

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
    const trackingStopIndexRef = useRef(null);

    const STORAGE_KEY = 'molten_mariner_fare_tracker_state';

    // ---- Persistence: Hydrate state on mount ----
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                setStops(parsed.stops);
                
                // If we were tracking when it closed, we need to recover
                if (parsed.trackingStopIndex !== null) {
                    const index = parsed.trackingStopIndex;
                    setActiveStopIndex(index);
                    
                    // Note: We don't automatically startTracking here to avoid 
                    // accidental GPS activation, but we could if the user wants 
                    // "seamless" recovery.
                }
            } catch (e) {
                console.error("Failed to restore fare state", e);
            }
        }
    }, []);

    // ---- Persistence: Save state on changes ----
    useEffect(() => {
        const stateToSave = {
            stops,
            trackingStopIndex,
            lastUpdated: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [stops, trackingStopIndex]);

    // ---- Native Bridge: Interface for Android Foreground Service ----
    // This allows the Android app to call window.updateFareFromNative(dist, wait) 
    // to push background updates into the React state.
    useEffect(() => {
        window.updateFareFromNative = (addedDistance, addedWaitSeconds) => {
            if (trackingStopIndexRef.current === null) return;
            
            setStops(prev => {
                const next = [...prev];
                const idx = trackingStopIndexRef.current;
                const stop = next[idx];
                
                const newDist = stop.distance + addedDistance;
                const newWait = stop.waitTime + addedWaitSeconds;
                
                next[idx] = {
                    ...stop,
                    distance: newDist,
                    waitTime: newWait,
                    elapsedTime: stop.elapsedTime + addedWaitSeconds, // assuming background time is active
                    fare: computeFare(newDist, newWait)
                };
                return next;
            });
        };

        return () => { delete window.updateFareFromNative; };
    }, [computeFare]);

    // Refs for fare parameters to avoid stale closures in callbacks
    const mileageRef = useRef(fareData?.mileage ?? 0.10);
    const costPerLiterRef = useRef(fareData?.costPerLiter ?? 145);
    const serviceMultiplierRef = useRef(fareData?.serviceMultiplier ?? 3);
    const waitMultiplierRef = useRef(fareData?.waitMultiplier ?? 2.5);

    // Update Refs when props change
    useEffect(() => {
        mileageRef.current = fareData?.mileage ?? 0.10;
        costPerLiterRef.current = fareData?.costPerLiter ?? 145;
        serviceMultiplierRef.current = fareData?.serviceMultiplier ?? 3;
        waitMultiplierRef.current = fareData?.waitMultiplier ?? 2.5;
    }, [fareData]);

    // Fare parameters from parent (with defaults) for rendering
    const mileage = fareData?.mileage ?? 0.10; // L/km
    const costPerLiter = fareData?.costPerLiter ?? 145;
    const serviceMultiplier = fareData?.serviceMultiplier ?? 3;
    const waitMultiplier = fareData?.waitMultiplier ?? 2.5;

    // ---- Fare calculation ----
    const computeFare = useCallback((dist, waitSecs) => {
        const fuelCost = dist * mileageRef.current * costPerLiterRef.current;
        const baseFare = fuelCost * serviceMultiplierRef.current * 2; // round-trip fuel estimate
        const waitCharge = (waitSecs / 60) * waitMultiplierRef.current * 2;
        return baseFare + waitCharge;
    }, []);

    // ---- Update active stop in state ----
    const updateActiveStop = useCallback((data) => {
        const index = trackingStopIndexRef.current;
        if (index === null) return;
        
        setStops(prev => {
            const newStops = [...prev];
            newStops[index] = { ...newStops[index], ...data };
            return newStops;
        });
    }, []);

    // ---- Elapsed time ticker ----
    useEffect(() => {
        if (trackingStopIndex !== null) {
            timerIdRef.current = setInterval(() => {
                const now = Date.now();
                const elapsed = elapsedAtPauseRef.current + Math.floor((now - startTimeRef.current) / 1000);
                
                const updates = { elapsedTime: elapsed };

                // Accumulate wait time every second when speed is below threshold
                if (isWaitingRef.current) {
                    waitAccumulatorRef.current += 1;
                    updates.waitTime = waitAccumulatorRef.current;
                    updates.fare = computeFare(distanceAccumulatorRef.current, waitAccumulatorRef.current);
                }

                updateActiveStop(updates);
            }, 1000);
        }
        return () => {
            if (timerIdRef.current) clearInterval(timerIdRef.current);
        };
    }, [trackingStopIndex, computeFare, updateActiveStop]);

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

            let speedKmh = 0;
            if (gpsSpeed != null && gpsSpeed >= 0) {
                speedKmh = gpsSpeed * 3.6;
            } else if (timeDelta > 0) {
                speedKmh = (dist / timeDelta) * 3600;
            }
            setCurrentSpeed(Math.round(speedKmh));

            isWaitingRef.current = speedKmh < WAIT_SPEED_THRESHOLD;

            if (dist >= MIN_DISTANCE) {
                distanceAccumulatorRef.current += dist;
                updateActiveStop({ 
                    distance: distanceAccumulatorRef.current,
                    fare: computeFare(distanceAccumulatorRef.current, waitAccumulatorRef.current)
                });
                
                // ONLY update reference position when we actually count the distance
                lastPositionRef.current = { lat: latitude, lng: longitude };
            }
        } else {
            // First valid point ever recorded
            lastPositionRef.current = { lat: latitude, lng: longitude };
            if (gpsSpeed != null && gpsSpeed >= 0) {
                setCurrentSpeed(Math.round(gpsSpeed * 3.6));
            }
        }

        // Always update timestamp to keep speed calculations fresh
        lastTimestampRef.current = timestamp;
    }, [computeFare, updateActiveStop]);

    // ---- Start tracking ----
    const startTracking = useCallback(() => {
        if (!navigator.geolocation) return;

        const index = activeStopIndex;
        setTrackingStopIndex(index);
        trackingStopIndexRef.current = index;
        setStops(prev => {
            const next = [...prev];
            next[index].status = 'tracking';
            return next;
        });

        startTimeRef.current = Date.now();
        elapsedAtPauseRef.current = stops[index].elapsedTime;
        isWaitingRef.current = true;

        lastPositionRef.current = null;
        lastTimestampRef.current = null;
        distanceAccumulatorRef.current = stops[index].distance;
        waitAccumulatorRef.current = stops[index].waitTime;

        watchIdRef.current = navigator.geolocation.watchPosition(
            handlePosition,
            (error) => console.warn('GPS error:', error.message),
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        );
    }, [activeStopIndex, handlePosition, stops]);

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
        
        setStops(prev => {
            const next = [...prev];
            next[trackingStopIndex].status = 'stopped';
            return next;
        });
        setTrackingStopIndex(null);
        trackingStopIndexRef.current = null;
    }, [trackingStopIndex]);

    // ---- Add Next Stop ----
    const addNextStop = useCallback(() => {
        if (stops.length >= MAX_STOPS) return;
        const newStop = { 
            id: stops.length + 1, 
            distance: 0, 
            waitTime: 0, 
            elapsedTime: 0, 
            fare: 0, 
            status: 'idle' 
        };
        setStops(prev => [...prev, newStop]);
        setActiveStopIndex(stops.length);
        setViewMode('individual');
    }, [stops.length]);

    // ---- Reset All ----
    const resetAll = useCallback(() => {
        if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
        if (timerIdRef.current) clearInterval(timerIdRef.current);
        
        setStops([{ id: 1, distance: 0, waitTime: 0, elapsedTime: 0, fare: 0, status: 'idle' }]);
        setActiveStopIndex(0);
        setTrackingStopIndex(null);
        trackingStopIndexRef.current = null;
        setViewMode('individual');
        setCurrentSpeed(0);
        setGpsAccuracy(null);
        lastPositionRef.current = null;
        lastTimestampRef.current = null;
        distanceAccumulatorRef.current = 0;
        waitAccumulatorRef.current = 0;
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // ---- Helpers ----
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const formatNum = (val) => (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // ---- Grand Total Calculations ----
    const totals = useMemo(() => {
        return stops.reduce((acc, stop) => ({
            distance: acc.distance + stop.distance,
            waitTime: acc.waitTime + stop.waitTime,
            elapsedTime: acc.elapsedTime + stop.elapsedTime,
            fare: acc.fare + stop.fare
        }), { distance: 0, waitTime: 0, elapsedTime: 0, fare: 0 });
    }, [stops]);

    const activeStop = stops[activeStopIndex];
    const displayData = viewMode === 'total' ? totals : activeStop;

    const currentFuelCost = displayData.distance * mileage * costPerLiter * 2;
    const currentWaitCharge = (displayData.waitTime / 60) * waitMultiplier * 2;
    const currentNetGain = displayData.fare - currentFuelCost;

    const rideFlagDown = 260;
    const rideDistRate = 24;
    const rideWaitRate = 5;
    const rideFare = (viewMode === 'total' ? rideFlagDown : rideFlagDown) + (displayData.distance * rideDistRate) + ((displayData.waitTime / 60) * rideWaitRate);

    const feresFlagDown = 110;
    const feresDistRate = 16;
    const feresWaitRate = 1;
    const feresBookingFeeRate = 0.07;
    const feresSubtotal = feresFlagDown + (displayData.distance * feresDistRate) + ((displayData.waitTime / 60) * feresWaitRate);
    const feresFare = feresSubtotal * (1 + feresBookingFeeRate);

    const isTrackingAny = trackingStopIndex !== null;

    return (
        <div className={`absolute inset-0 bg-neutral-900 flex flex-col z-[60] transition-all duration-300 ease-in-out ${isVisible
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none translate-y-4'
            }`}>

            {/* Header */}
            <div className="flex flex-col border-b border-neutral-800">
                <div className="flex items-center gap-2.5 p-2.5">
                    <button
                        onClick={onClose}
                        className="h-12 w-12 flex items-center justify-center bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-xl shadow-lg text-neutral-400 hover:text-white transition-all hover:bg-neutral-800 active:scale-95 shrink-0"
                        title="Back to Calculator"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xs font-black text-white tracking-wide flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            Live Fare Tracker
                        </h2>
                        <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5 text-left">
                            {viewMode === 'total' ? 'Full Session Summary' : `Stop ${activeStop.id} Tracking`}
                        </p>
                    </div>
                    {isTrackingAny && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                        </div>
                    )}
                    {gpsAccuracy != null && isTrackingAny && (
                        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${gpsAccuracy <= 15 ? 'bg-emerald-500/20 text-emerald-400' : gpsAccuracy <= 30 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            ±{gpsAccuracy}m
                        </div>
                    )}
                </div>

                {/* Stop Selector Tabs */}
                <div className="flex px-2 pb-1.5 gap-1 overflow-x-auto scrollbar-hide">
                    {stops.map((stop, idx) => (
                        <button
                            key={stop.id}
                            onClick={() => { setViewMode('individual'); setActiveStopIndex(idx); }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[9px] font-bold transition-all shrink-0 ${
                                viewMode === 'individual' && activeStopIndex === idx
                                    ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                                    : 'bg-neutral-800/40 border-neutral-700/50 text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                            <div className={`w-1 h-1 rounded-full ${
                                stop.status === 'tracking' ? 'bg-emerald-500 animate-pulse' : 
                                stop.status === 'stopped' ? 'bg-amber-500' : 'bg-neutral-600'
                            }`} />
                            Stop {stop.id}
                        </button>
                    ))}
                    {stops.length < MAX_STOPS && !isTrackingAny && (
                        <button
                            onClick={addNextStop}
                            className="flex items-center gap-1 px-2 py-1 rounded-md border border-neutral-700/50 bg-neutral-800/20 text-neutral-500 hover:text-primary-400 hover:border-primary-500/50 transition-all shrink-0"
                        >
                            <Layers className="w-2.5 h-2.5" />
                            + Stop
                        </button>
                    )}
                    <button
                        onClick={() => setViewMode('total')}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[9px] font-bold transition-all shrink-0 ml-auto ${
                            viewMode === 'total'
                                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                                : 'bg-neutral-800/40 border-neutral-700/50 text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        <TrendingUp className="w-2.5 h-2.5" />
                        Total
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto scrollbar-hide">

                {/* Elapsed Timer — Tray Display */}
                <div className={`rounded-xl p-2 border transition-all duration-500 text-center ${
                    isTrackingAny && viewMode === 'individual' && activeStopIndex === trackingStopIndex
                        ? 'bg-neutral-800/40 border-neutral-700/50 shadow-inner'
                        : 'bg-neutral-800/20 border-neutral-700/30'
                }`}>
                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-0.5">
                        {viewMode === 'total' ? 'Total Travel Time' : 'Stop Duration'}
                    </p>
                    <p className={`text-5xl font-black font-mono tracking-wider leading-tight ${
                        isTrackingAny && viewMode === 'individual' && activeStopIndex === trackingStopIndex ? 'text-white' : 
                        displayData.status === 'stopped' || viewMode === 'total' ? 'text-amber-400' : 'text-neutral-600'
                    }`}>
                        {formatTime(displayData.elapsedTime)}
                    </p>
                </div>

                {/* Live Fare — Hero Card */}
                <div className={`rounded-xl p-2.5 border transition-all duration-500 ${
                    isTrackingAny && viewMode === 'individual' && activeStopIndex === trackingStopIndex
                        ? 'bg-gradient-to-br from-primary-900/40 to-primary-800/20 border-primary-500/50 shadow-[0_0_25px_rgba(14,165,233,0.15)]'
                        : displayData.status === 'stopped' || viewMode === 'total'
                            ? 'bg-gradient-to-br from-amber-900/30 to-neutral-800/50 border-amber-500/40'
                            : 'bg-neutral-800/40 border-neutral-700/40'
                    }`}>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-[0.15em]">
                                {viewMode === 'total' ? 'Combined Total Fare' : displayData.status === 'stopped' ? 'Stop Final Fare' : 'Running Fare'}
                            </p>
                            <p className={`text-5xl font-black mt-0.5 leading-none ${
                                isTrackingAny && viewMode === 'individual' && activeStopIndex === trackingStopIndex ? 'text-primary-400' : 
                                displayData.status === 'stopped' || viewMode === 'total' ? 'text-amber-400' : 'text-neutral-600'
                            }`}>
                                {formatNum(displayData.fare)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Per Head</p>
                            <p className={`text-2xl font-black ${displayData.fare > 0 ? 'text-primary-300' : 'text-neutral-600'}`}>
                                {formatNum(displayData.fare / 4)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Speed + Distance Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-2 border transition-colors ${
                        currentSpeed > 0 && isTrackingAny ? 'bg-emerald-900/10 border-emerald-500/40' : 'bg-neutral-800/40 border-neutral-700/40'
                    }`}>
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center gap-1">
                                <Gauge className={`w-3 h-3 ${currentSpeed > 0 && isTrackingAny ? 'text-emerald-400' : 'text-neutral-500'}`} />
                                <label className={`text-[9px] uppercase tracking-wider font-bold ${currentSpeed > 0 && isTrackingAny ? 'text-emerald-400' : 'text-neutral-500'}`}>Live Speed</label>
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-1">
                            <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold shrink-0 mb-1">Current KM/H</span>
                            <p className={`text-base font-black font-mono leading-none ${currentSpeed > 0 && isTrackingAny ? 'text-emerald-400' : 'text-neutral-600'}`}>
                                {isTrackingAny ? currentSpeed : 0}
                            </p>
                        </div>
                    </div>

                    <div className={`rounded-xl p-2 border transition-colors ${displayData.distance > 0 ? 'bg-primary-900/10 border-primary-500/40' : 'bg-neutral-800/40 border-neutral-700/40'}`}>
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center gap-1">
                                <Navigation className={`w-3 h-3 ${displayData.distance > 0 ? 'text-primary-400' : 'text-neutral-500'}`} />
                                <label className={`text-[9px] uppercase tracking-wider font-bold ${displayData.distance > 0 ? 'text-primary-400' : 'text-neutral-500'}`}>
                                    {viewMode === 'total' ? 'Total Dist' : 'Stop Dist'}
                                </label>
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-1">
                            <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold shrink-0 mb-1">Kilometers</span>
                            <p className={`text-base font-black font-mono leading-none ${displayData.distance > 0 ? 'text-primary-400' : 'text-neutral-600'}`}>
                                {displayData.distance.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wait Time + Fuel Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-2 border transition-colors ${displayData.waitTime > 0 ? 'bg-amber-900/10 border-amber-500/40' : 'bg-neutral-800/40 border-neutral-700/40'}`}>
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center gap-1">
                                <Timer className={`w-3 h-3 ${displayData.waitTime > 0 ? 'text-amber-400' : 'text-neutral-500'}`} />
                                <label className={`text-[9px] uppercase tracking-wider font-bold ${displayData.waitTime > 0 ? 'text-amber-400' : 'text-neutral-500'}`}>
                                    {viewMode === 'total' ? 'Total Wait' : 'Stop Wait'}
                                </label>
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-1">
                            <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold shrink-0 mb-1">Charge: {formatNum(currentWaitCharge)}</span>
                            <p className={`text-base font-black font-mono leading-none ${displayData.waitTime > 0 ? 'text-amber-400' : 'text-neutral-600'}`}>
                                {formatTime(Math.round(displayData.waitTime))}
                            </p>
                        </div>
                    </div>

                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-neutral-700/40">
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center gap-1">
                                <Fuel className="w-3 h-3 text-neutral-500" />
                                <label className="text-[9px] uppercase tracking-wider font-bold text-neutral-500">Fuel Cost</label>
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-1">
                            <span className={`text-[8px] font-bold shrink-0 mb-1 ${currentNetGain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                Net: {currentNetGain >= 0 ? '+' : ''}{formatNum(currentNetGain)}
                            </span>
                            <p className={`text-base font-black font-mono leading-none ${currentFuelCost > 0 ? 'text-rose-400' : 'text-neutral-600'}`}>
                                {formatNum(currentFuelCost)}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Trip Summary (shown when stopped or in Grand Total) */}
                {(displayData.status === 'stopped' || viewMode === 'total') && (
                    <div className="bg-gradient-to-br from-amber-900/20 to-neutral-800/40 rounded-xl p-2.5 border border-amber-500/30 space-y-1.5">
                        <p className="text-[9px] font-bold text-amber-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3" /> {viewMode === 'total' ? 'Session Summary' : `Stop ${displayData.id} Summary`}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Distance</p>
                                <p className="text-sm font-black text-white">{displayData.distance.toFixed(2)} km</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Duration</p>
                                <p className="text-sm font-black text-white">{formatTime(displayData.elapsedTime)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Avg Speed</p>
                                <p className="text-sm font-black text-white">
                                    {displayData.elapsedTime > 0 ? Math.round((displayData.distance / displayData.elapsedTime) * 3600) : 0}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-neutral-700/50">
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Total Fare</p>
                                <p className="text-sm font-black text-amber-400">{formatNum(displayData.fare)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Fuel</p>
                                <p className="text-sm font-black text-rose-400">{formatNum(currentFuelCost)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Net Gain</p>
                                <p className={`text-sm font-black ${currentNetGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {formatNum(currentNetGain)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ride App Comparison (Expandable) */}
                {displayData.fare > 0 && (
                    <div className="mt-0.5">
                        <button
                            onClick={() => setShowMarketComparison(!showMarketComparison)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                                showMarketComparison 
                                ? 'bg-neutral-800/60 border-neutral-700/50 rounded-b-none' 
                                : 'bg-neutral-800/30 border-neutral-700/30 hover:bg-neutral-800/50'
                            }`}
                        >
                            <div className="flex items-center gap-1.5">
                                <Car className={`w-3.5 h-3.5 ${showMarketComparison ? 'text-primary-400' : 'text-neutral-500'}`} />
                                <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Market Comparison</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {!showMarketComparison && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[6px] text-neutral-500 font-bold uppercase leading-none">Ride</span>
                                            <span className="text-[8px] font-black text-primary-400">{formatNum(rideFare)}</span>
                                        </div>
                                        <div className="w-px h-3 bg-neutral-700 mx-0.5"></div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[6px] text-neutral-500 font-bold uppercase leading-none">Feres</span>
                                            <span className="text-[8px] font-black text-emerald-400">{formatNum(feresFare)}</span>
                                        </div>
                                    </div>
                                )}
                                {showMarketComparison ? <ChevronUp className="w-3 h-3 text-neutral-500" /> : <ChevronDown className="w-3 h-3 text-neutral-500" />}
                            </div>
                        </button>

                        {showMarketComparison && (
                            <div className="bg-neutral-800/40 rounded-b-xl border-x border-b border-neutral-700/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Ride Provider */}
                                <div className="p-3 space-y-2.5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[9px] font-bold text-primary-400 uppercase tracking-widest flex items-center gap-1.5">
                                                Ride App Estimate
                                            </p>
                                            <p className="text-[7px] text-neutral-500 font-bold uppercase tracking-tight">Market Leader</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-white tracking-tight">
                                                {formatNum(rideFare)}
                                            </p>
                                            <p className="text-[7px] text-neutral-500 font-bold uppercase">ETB Total</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2 py-1.5 border-t border-neutral-700/30">
                                        <div>
                                            <p className="text-[7px] font-bold text-neutral-500 uppercase">Flag Down</p>
                                            <p className="text-[9px] font-black text-neutral-300">{rideFlagDown}</p>
                                        </div>
                                        <div>
                                            <p className="text-[7px] font-bold text-neutral-500 uppercase">Distance</p>
                                            <p className="text-[9px] font-black text-neutral-300">{formatNum(displayData.distance * rideDistRate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[7px] font-bold text-neutral-500 uppercase">Waiting</p>
                                            <p className="text-[9px] font-black text-neutral-300">{formatNum((displayData.waitTime / 60) * rideWaitRate)}</p>
                                        </div>
                                    </div>

                                    {rideFare > 0 && displayData.fare > 0 && (
                                        <div className="pt-1.5 border-t border-neutral-700/30 flex items-center justify-between">
                                            <span className="text-[7px] font-bold text-neutral-500 uppercase">Savings vs Ride</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black ${rideFare - displayData.fare > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {rideFare - displayData.fare > 0 ? '+' : ''}{formatNum(rideFare - displayData.fare)} ETB
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Feres Provider */}
                                <div className="p-3 bg-neutral-900/30 border-t border-neutral-700/50 space-y-2.5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                                Feres Estimate
                                            </p>
                                            <p className="text-[7px] text-neutral-500 font-bold uppercase tracking-tight">Value Option</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-white tracking-tight">
                                                {formatNum(feresFare)}
                                            </p>
                                            <p className="text-[7px] text-neutral-500 font-bold uppercase">ETB Total</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-4 gap-1 py-1.5 border-t border-neutral-700/30">
                                        <div>
                                            <p className="text-[7px] font-bold text-neutral-500 uppercase">Flag</p>
                                            <p className="text-[9px] font-black text-neutral-300">{feresFlagDown}</p>
                                        </div>
                                        <div>
                                            <p className="text-[7px] font-bold text-neutral-500 uppercase">Dist</p>
                                            <p className="text-[9px] font-black text-neutral-300">{formatNum(displayData.distance * feresDistRate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[7px] font-bold text-neutral-500 uppercase">Wait</p>
                                            <p className="text-[9px] font-black text-neutral-300">{formatNum((displayData.waitTime / 60) * feresWaitRate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[7px] font-bold text-neutral-500 uppercase">Book(7%)</p>
                                            <p className="text-[9px] font-black text-neutral-300">{formatNum(feresSubtotal * feresBookingFeeRate)}</p>
                                        </div>
                                    </div>

                                    {feresFare > 0 && displayData.fare > 0 && (
                                        <div className="pt-1.5 border-t border-neutral-700/30 flex items-center justify-between">
                                            <span className="text-[7px] font-bold text-neutral-500 uppercase">Savings vs Feres</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black ${feresFare - displayData.fare > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {feresFare - displayData.fare > 0 ? '+' : ''}{formatNum(feresFare - displayData.fare)} ETB
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Fare Parameters Info */}
                {viewMode === 'individual' && activeStop.status === 'idle' && (
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
                {viewMode === 'individual' && activeStop.status === 'idle' && !isTrackingAny && (
                    <button
                        onClick={startTracking}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-base py-3 rounded-xl shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        <Play className="w-5 h-5" fill="currentColor" />
                        Start Stop {activeStop.id}
                    </button>
                )}

                {isTrackingAny && activeStopIndex === trackingStopIndex && (
                    <button
                        onClick={stopTracking}
                        className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black text-base py-3 rounded-xl shadow-lg shadow-rose-900/30 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-3 uppercase tracking-widest animate-pulse"
                    >
                        <Square className="w-5 h-5" fill="currentColor" />
                        Stop Tracking
                    </button>
                )}

                {(activeStop.status === 'stopped' || viewMode === 'total') && !isTrackingAny && (
                        <div className="flex gap-2">
                            {stops.length < MAX_STOPS && activeStop.status === 'stopped' && (
                                <button
                                    onClick={addNextStop}
                                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-sm py-3 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-wider"
                                >
                                    <Layers className="w-4 h-4" />
                                    Next Stop
                                </button>
                            )}
                            <button
                                onClick={resetAll}
                                className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold text-sm py-3 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                                <RotateCcw className="w-4 h-4" />
                                New Session
                            </button>
                        </div>
                )}
            </div>
        </div>
    );
};

export default LiveFareTracker;

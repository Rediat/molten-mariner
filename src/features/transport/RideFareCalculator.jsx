import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Car, Info, HelpCircle, Trash2, Settings, History, Loader2, ArrowUpDown, Clock, Map as MapIcon } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';
import { CalculateIcon } from '../../components/Icons';
import { useHistory } from '../../context/HistoryContext';
import { useTransport } from '../../context/TransportContext';
import HistoryOverlay from '../../components/HistoryOverlay';
import DrivingView from '../driving/DrivingView';

const DEFAULT_VALUES = {
    distance: 15,
    mileage: 0.1,
    costPerLiter: 130,
    serviceMultiplier: 3
};

const hasMapsApi = () => !!window.google?.maps?.DistanceMatrixService;

const RideFareCalculator = ({ toggleHelp, toggleSettings, mapsReady, isActive }) => {
    const { addToHistory } = useHistory();
    const {
        origin, setOrigin,
        destination, setDestination,
        distanceKm, setDistanceKm,
        durationText, setDurationText,
        durationValue, setDurationValue,
        routeVersion,
        clearTransportState
    } = useTransport();

    const [values, setValues] = useState(DEFAULT_VALUES);
    const [locationError, setLocationError] = useState(null);
    const [results, setResults] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const [mode, setMode] = useState('forward');
    const [priceToCharge, setPriceToCharge] = useState(585);
    const [roundTrip, setRoundTrip] = useState(false);

    const [fetchingDistance, setFetchingDistance] = useState(false);
    const [distanceSource, setDistanceSource] = useState('manual');
    const [locationLoading, setLocationLoading] = useState(false);
    const [waitMultiplier, setWaitMultiplier] = useState(2.5);

    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);

    const handleSwapLocations = useCallback(() => {
        const prevOrigin = origin;
        const prevDest = destination;
        const fromVal = fromInputRef.current?.value || '';
        const toVal = toInputRef.current?.value || '';

        setOrigin(prevDest);
        setDestination(prevOrigin);

        if (fromInputRef.current) fromInputRef.current.value = toVal;
        if (toInputRef.current) toInputRef.current.value = fromVal;
    }, [origin, destination, setOrigin, setDestination]);


    const fetchDistance = useCallback((from, to) => {
        if (!from || !to || !hasMapsApi()) return;
        setFetchingDistance(true);
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [new window.google.maps.LatLng(from.lat, from.lng)],
                destinations: [new window.google.maps.LatLng(to.lat, to.lng)],
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.METRIC,
                drivingOptions: {
                    departureTime: new Date(),
                },
            },
            (response, status) => {
                setFetchingDistance(false);
                if (status === 'OK' && response.rows[0]?.elements[0]?.status === 'OK') {
                    const element = response.rows[0].elements[0];
                    const distanceVal = parseFloat((element.distance.value / 1000).toFixed(2));
                    setValues(prev => ({ ...prev, distance: distanceVal }));
                    setDistanceKm(distanceVal);
                    setDistanceSource('maps');

                    const text = (element.duration_in_traffic?.text || element.duration?.text) || null;
                    setDurationText(text);

                    const durationSec = element.duration_in_traffic?.value || element.duration?.value || 0;
                    setDurationValue(durationSec > 0 ? durationSec / 60 : null);

                    setResults(null);
                }
            }
        );
    }, [setDistanceKm, setDurationText, setDurationValue]);

    // Sync distance when route is selected/changed on the Driving tab
    useEffect(() => {
        if (routeVersion > 0 && distanceKm !== null) {
            setValues(prev => ({ ...prev, distance: distanceKm }));
            setDistanceSource('maps');
            setResults(null); // Clear previous calculation to prompt recalculation with new duration
        }
    }, [routeVersion]);

    // Trigger fetchDistance when both origin and destination become available
    // This covers the race condition where useCurrentLocation and destination selection
    // happen asynchronously and neither handler sees the other value in time.
    const hasFetchedRef = useRef(false);
    useEffect(() => {
        if (origin && destination && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchDistance(origin, destination);
        }
        if (!origin || !destination) {
            hasFetchedRef.current = false;
        }
    }, [origin, destination, fetchDistance]);

    const handleOriginSelected = useCallback((place) => {
        setOrigin(place);
        if (destination) fetchDistance(place, destination);
    }, [destination, fetchDistance, setOrigin]);

    const handleDestinationSelected = useCallback((place) => {
        setDestination(place);
        if (origin) fetchDistance(origin, place);
    }, [origin, fetchDistance, setDestination]);

    const useCurrentLocation = useCallback((setInputValue, isAutoTrigger = false) => {
        if (!navigator.geolocation) return;
        setLocationLoading(true);
        setLocationError(null);

        let watchId;
        let bestPosition = null;
        const TARGET_ACCURACY = 40; // meters
        const TIMEOUT_MS = 10000;   // 10 seconds

        const shouldAbort = () => isAutoTrigger && fromInputRef.current && fromInputRef.current.value !== '';

        const processLocation = (position) => {
            if (shouldAbort()) {
                setLocationLoading(false);
                return;
            }

            const { latitude: lat, longitude: lng } = position.coords;
            const coordsLabel = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            const place = { lat, lng, name: coordsLabel, address: '' };

            const finalize = (name) => {
                setLocationLoading(false);
                if (shouldAbort()) return;

                place.name = name;
                place.address = name;
                setInputValue('📍 ' + name);
                setOrigin(place);
                if (destination) fetchDistance(place, destination);
            };

            const fallbackToCoords = () => {
                finalize(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            };

            // Primary: Use Places API nearbySearch to find actual building/POI names
            if (window.google?.maps?.places) {
                const dummyEl = document.createElement('div');
                dummyEl.style.display = 'none';
                document.body.appendChild(dummyEl);
                const svc = new window.google.maps.places.PlacesService(dummyEl);
                const cleanUp = () => { try { document.body.removeChild(dummyEl); } catch (ex) { } };

                const request = {
                    location: new window.google.maps.LatLng(lat, lng),
                    rankBy: window.google.maps.places.RankBy.DISTANCE,
                    type: 'establishment'
                };

                // Timeout safety net
                let resolved = false;
                const timer = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        cleanUp();
                        console.warn('nearbySearch timed out, falling back to Geocoder');
                        geocoderFallback();
                    }
                }, 4000);

                svc.nearbySearch(request, (places, nearbyStatus) => {
                    if (resolved) return;
                    resolved = true;
                    clearTimeout(timer);
                    cleanUp();

                    console.log('nearbySearch status:', nearbyStatus, 'results:', places);

                    if (nearbyStatus === window.google.maps.places.PlacesServiceStatus.OK && places?.length > 0) {
                        const bestPlace = places[0];
                        const label = bestPlace.name + (bestPlace.vicinity ? `, ${bestPlace.vicinity}` : '');
                        finalize(label);
                    } else {
                        geocoderFallback();
                    }
                });
            } else {
                geocoderFallback();
            }

            // Fallback: Use Geocoder to get neighborhood/sublocality
            function geocoderFallback() {
                if (window.google?.maps?.Geocoder) {
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === 'OK' && results?.length) {
                            const cleanResults = results.filter(r =>
                                !r.types.includes('plus_code') && !r.formatted_address.includes('+')
                            );

                            // Prefer neighborhood or sublocality over unnamed roads
                            const neighborhood = cleanResults.find(r =>
                                r.types.includes('neighborhood') ||
                                r.types.includes('sublocality') ||
                                r.types.includes('administrative_area_level_4') ||
                                r.types.includes('administrative_area_level_3')
                            );

                            // Skip unnamed roads
                            const nonRoute = cleanResults.find(r => !r.types.includes('route'));

                            const fallback = neighborhood || nonRoute || cleanResults[0] || results[0];
                            finalize(fallback.formatted_address);
                        } else {
                            fallbackToCoords();
                        }
                    });
                } else {
                    fallbackToCoords();
                }
            }
        };

        const timeoutId = setTimeout(() => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
            if (bestPosition) {
                processLocation(bestPosition);
            } else {
                setLocationLoading(false);
                if (!shouldAbort()) setLocationError('Location timeout');
            }
        }, TIMEOUT_MS);

        watchId = navigator.geolocation.watchPosition(
            (position) => {
                if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
                    bestPosition = position;
                }

                // If we get a highly accurate fix quickly, stop watching and use it
                if (bestPosition.coords.accuracy <= TARGET_ACCURACY) {
                    navigator.geolocation.clearWatch(watchId);
                    clearTimeout(timeoutId);
                    processLocation(bestPosition);
                }
            },
            (error) => {
                // If we already have *some* position, don't fail completely on a subsequent error
                if (!bestPosition) {
                    setLocationLoading(false);
                    clearTimeout(timeoutId);
                    if (watchId) navigator.geolocation.clearWatch(watchId);

                    if (!shouldAbort()) {
                        if (error.code === 1) setLocationError('Location access denied');
                        else if (error.code === 2 || error.code === 3) setLocationError('Location unavailable');
                    }
                }
            },
            { enableHighAccuracy: true, timeout: TIMEOUT_MS, maximumAge: 0 }
        );

    }, [destination, fetchDistance, setOrigin]);

    // Auto-trigger current location on mount (only when active)
    const locationTriggered = useRef(false);
    useEffect(() => {
        if (!isActive || locationTriggered.current || !hasMapsApi() || !navigator.geolocation) return;
        locationTriggered.current = true;
        const setFromValue = (val) => {
            if (fromInputRef.current) fromInputRef.current.value = val;
        };
        useCurrentLocation(setFromValue, true);
    }, [useCurrentLocation, mapsReady, isActive]);

    const handleCalculate = () => {
        const chargeMultiplier = roundTrip ? 2 : 1;
        const actualFuelMultiplier = 2; // Always estimate fuel for round-trip for true cost out of pocket

        const oneWayFuelCost = values.distance * values.mileage * values.costPerLiter;
        const chargingFuelCost = oneWayFuelCost * chargeMultiplier;
        const totalFuelCost = oneWayFuelCost * actualFuelMultiplier;

        const waitTimeBase = durationValue != null ? durationValue * 1.1 * waitMultiplier : 0;
        const waitTime = waitTimeBase * 2; // Always double to represent true round-trip even in one-way mode

        if (mode === 'forward') {
            const basePrice = chargingFuelCost * values.serviceMultiplier;
            const totalToCharge = basePrice + waitTime;
            const revenuePerKm = values.distance > 0 ? totalToCharge / values.distance : 0;
            const netGain = totalToCharge - totalFuelCost;
            const netGainPerKm = values.distance > 0 ? netGain / values.distance : 0;
            const fuelPerKm = values.distance > 0 ? (totalFuelCost / values.distance) / actualFuelMultiplier : 0;
            const perHead = totalToCharge / 4;
            const newResults = { totalFuelCost, reasonablePrice: basePrice, totalToCharge, waitTime, revenuePerKm, netGain, netGainPerKm, fuelPerKm, perHead };
            setResults(newResults);
            addToHistory('Ride', { ...values, mode: 'forward', roundTrip }, newResults);
        } else {
            const totalToCharge = priceToCharge;
            const basePrice = Math.max(0, totalToCharge - waitTime);
            const netGain = totalToCharge - totalFuelCost;
            const perHead = totalToCharge / 4;
            const revenuePerKm = values.distance > 0 ? totalToCharge / values.distance : 0;
            const fuelPerKm = values.distance > 0 ? (totalFuelCost / values.distance) / actualFuelMultiplier : 0;
            const netGainPerKm = values.distance > 0 ? netGain / values.distance : 0;
            const serviceMultiplier = chargingFuelCost > 0 ? basePrice / chargingFuelCost : 0;
            const newResults = { totalFuelCost, reasonablePrice: basePrice, totalToCharge, waitTime, revenuePerKm, netGain, netGainPerKm, fuelPerKm, perHead, serviceMultiplier };
            setResults(newResults);
            addToHistory('Ride', { ...values, priceToCharge, mode: 'reverse', roundTrip }, newResults);
        }
    };

    const handleChange = (field, val) => {
        const numericVal = parseFloat(val) || 0;
        setValues(prev => ({ ...prev, [field]: numericVal }));
        if (field === 'distance') setDistanceSource('manual');
        setResults(null);
    };

    const handleClear = () => {
        setValues(DEFAULT_VALUES);
        setPriceToCharge(585);
        setResults(null);
        clearTransportState();
        setDistanceSource('manual');
        setWaitMultiplier(2.5);

        if (fromInputRef.current) fromInputRef.current.value = '';
        if (toInputRef.current) toInputRef.current.value = '';
    };

    const formatNum = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const mapsAvailable = hasMapsApi();

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Car className="w-5 h-5 text-primary-500" />
                        Ride Fare Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        Transport & Fuel Cost
                    </p>
                </div>
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                    title="Show Info"
                >
                    <Info className="w-3 h-3" />
                </button>
            </div>

            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2.5 mb-2 text-[11px] text-neutral-300 text-left leading-relaxed space-y-1.5">
                    <p className="font-bold text-primary-400 text-xs">How It Works</p>
                    {mapsAvailable && (
                        <p>📍 <strong className="text-white">Google Maps:</strong> Select From/To locations to auto-fetch driving distance. Your current location is auto-detected on launch using GPS + Places API.</p>
                    )}
                    <p>
                        {mode === 'forward'
                            ? `📐 Enter distance, fuel price, and service multiplier to calculate the recommended fare. Formula: Price = (Distance × Mileage × Fuel Cost × ${roundTrip ? '2' : '1'}) × Service Multiplier + Wait Time Charge.`
                            : `🔄 Enter a known fare to reverse-calculate fuel cost breakdown, net gain, and the implied service multiplier.`}
                    </p>
                    <p>⛽ <strong className="text-white">Mileage:</strong> Fixed at 0.10 L/Km — the baseline fuel consumption rate used in all calculations.</p>
                    <p>🔄 <strong className="text-white">Round Trip (1× / 2×):</strong> {roundTrip ? 'Enabled (2x fuel cost)' : 'Disabled (1x fuel cost)'} – applies a 2x factor to fuel costs when calculating total fare.</p>
                    <p>⏱️ <strong className="text-white">Wait Time:</strong> Estimated travel time + 10% buffer, multiplied by a configurable factor (default 2.5) to estimate total charge for wait time.</p>
                    <p>👥 <strong className="text-white">Per Head:</strong> Total fare split by 4 passengers for cost-sharing.</p>
                    {mapsAvailable && (
                        <>
                            <p className="font-bold text-primary-400 text-xs pt-1">Map & Routes</p>
                            <p>🗺️ <strong className="text-white">View Map:</strong> When both From and To are set, tap "View Map & Alternate Routes" for a full-screen interactive map with traffic-colored polylines (blue = normal, yellow = slow, red = jam).</p>
                            <p>🔀 <strong className="text-white">Alternate Routes:</strong> Grey lines on the map show alternative routes — tap one to switch. The selected route's distance and time sync back to the calculator automatically.</p>
                            <p>🧭 <strong className="text-white">Turn-by-Turn:</strong> Expand the bottom sheet on the map view for step-by-step navigation directions.</p>
                            <p>⇅ <strong className="text-white">Swap:</strong> Use the swap button between From/To to instantly reverse your route.</p>
                        </>
                    )}
                </div>
            )}

            {/* Mode Toggle */}
            <div className="flex mb-2 bg-neutral-900/50 rounded-lg p-0.5 w-full relative z-10">
                <button
                    onClick={() => { if (mode !== 'forward') { setMode('forward'); setResults(null); } }}
                    className={`flex-1 flex items-center justify-center py-2 px-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'forward' ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/30' : 'text-neutral-500 hover:bg-neutral-800/40 hover:text-neutral-300'}`}
                >
                    Inputs → Price
                </button>
                <button
                    onClick={() => { if (mode !== 'reverse') { setMode('reverse'); setResults(null); } }}
                    className={`flex-1 flex items-center justify-center py-2 px-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'reverse' ? 'bg-emerald-600/20 text-white ring-1 ring-emerald-500/30' : 'text-neutral-500 hover:bg-neutral-800/40 hover:text-neutral-300'}`}
                >
                    Price → Breakdown
                </button>
            </div>

            {/* Route Card - From/To combined into one compact card */}
            {mapsAvailable && (
                <div className="bg-neutral-800/30 rounded-xl p-2 mb-1.5 border border-neutral-700/40">
                    <div className="space-y-0">
                        <PlacesAutocomplete
                            label="From"
                            placeholder="e.g. Bole Airport"
                            onPlaceSelected={handleOriginSelected}
                            accentColor="primary"
                            compact
                            onUseCurrentLocation={useCurrentLocation}
                            locationLoading={locationLoading}
                            externalInputRef={fromInputRef}
                            mapsReady={mapsReady}
                            locationError={locationError}
                        />
                        <div className="flex items-center gap-2 py-0.5 px-4">
                            <div className="flex-1 border-t border-dashed border-neutral-700/60"></div>
                            <button
                                onClick={handleSwapLocations}
                                className="p-0.5 rounded-full hover:bg-neutral-700/50 transition-all active:scale-90 group"
                                title="Swap From and To"
                            >
                                <ArrowUpDown className="w-3 h-3 text-neutral-600 group-hover:text-primary-400 transition-colors" />
                            </button>
                            <div className="flex-1 border-t border-dashed border-neutral-700/60"></div>
                        </div>
                        <PlacesAutocomplete
                            label="To"
                            placeholder="e.g. Megenagna"
                            onPlaceSelected={handleDestinationSelected}
                            accentColor="primary"
                            compact
                            externalInputRef={toInputRef}
                            mapsReady={mapsReady}
                        />
                        {origin && destination && (
                            <button
                                onClick={() => setShowMap(true)}
                                className="w-full mt-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-primary-500/30 active:scale-[0.98]"
                            >
                                <MapIcon className="w-4 h-4 text-primary-400" />
                                View Map & Alternate Routes
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Inputs - 2 column grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                {/* Distance */}
                <div className={`rounded-xl p-2 border ${distanceSource === 'maps' ? 'bg-emerald-900/10 border-emerald-500/40' : 'bg-neutral-800/40 border-primary-500/40'}`}>
                    <div className="flex justify-between items-center mb-0.5">
                        <label className={`text-[10px] uppercase tracking-wider font-bold block ${distanceSource === 'maps' ? 'text-emerald-400' : 'text-primary-400'}`}>
                            Distance (Km)
                        </label>
                        <div className="flex bg-neutral-900/60 rounded-md p-0.5 ring-1 ring-neutral-700/50">
                            <button
                                onClick={(e) => { e.stopPropagation(); setRoundTrip(false); setResults(null); }}
                                className={`px-1.5 py-0.5 text-[8px] font-bold rounded-sm transition-all ${!roundTrip ? 'bg-amber-500 text-neutral-900' : 'text-neutral-500'}`}
                            >
                                1×
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setRoundTrip(true); setResults(null); }}
                                className={`px-1.5 py-0.5 text-[8px] font-bold rounded-sm transition-all ${roundTrip ? 'bg-amber-500 text-neutral-900' : 'text-neutral-500'}`}
                            >
                                2×
                            </button>
                        </div>
                    </div>
                    {fetchingDistance ? (
                        <div className="flex items-center gap-1 text-primary-400 text-xs py-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                        </div>
                    ) : (
                        <FormattedNumberInput
                            value={values.distance}
                            onChange={(e) => handleChange('distance', e.target.value)}
                            decimals={2}
                            className={`bg-transparent text-right text-lg font-mono focus:outline-none font-black w-full ${distanceSource === 'maps' ? 'text-emerald-400' : 'text-primary-400'}`}
                        />
                    )}
                    <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">
                        {distanceSource === 'maps' ? '✓ Google Maps' : 'Trip Length'}
                    </span>
                </div>

                {/* Fuel Cost */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-white block mb-0.5">
                        Fuel Cost / Liter
                    </label>
                    <FormattedNumberInput
                        value={values.costPerLiter}
                        onChange={(e) => handleChange('costPerLiter', e.target.value)}
                        decimals={2}
                        className="bg-transparent text-right text-lg font-mono focus:outline-none text-white w-full"
                        placeholder="130.00"
                    />
                    <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">Current Price</span>
                </div>

                {/* Wait Multiplier */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-amber-500/30">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block mb-0.5">
                        Wait Multiplier
                    </label>
                    <FormattedNumberInput
                        value={waitMultiplier}
                        onChange={(e) => { setWaitMultiplier(parseFloat(e.target.value.replace(/,/g, '')) || 0); setResults(null); }}
                        decimals={1}
                        className="bg-transparent text-right text-lg font-mono focus:outline-none text-amber-400 font-black w-full"
                    />
                    <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">Time Factor</span>
                </div>

                {/* Service Factor or Price to Charge */}
                {mode === 'forward' ? (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-white block mb-0.5">
                            Service Multiplier
                        </label>
                        <FormattedNumberInput
                            value={values.serviceMultiplier}
                            onChange={(e) => handleChange('serviceMultiplier', e.target.value)}
                            decimals={1}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white w-full"
                        />
                        <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">2.55 – 4.5×</span>
                    </div>
                ) : (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-emerald-500/40">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block mb-0.5">
                            Price to Charge
                        </label>
                        <FormattedNumberInput
                            value={priceToCharge}
                            onChange={(e) => { setPriceToCharge(parseFloat(e.target.value.replace(/,/g, '')) || 0); setResults(null); }}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-emerald-400 font-black w-full"
                        />
                        <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">Known Fare</span>
                    </div>
                )}
            </div>


            {/* Results */}
            {
                results && (
                    <div className="bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2.5 space-y-1.5 mb-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                            >
                                <History size={10} /> History
                            </button>
                        </div>

                        {/* Route & drive time */}
                        {durationText && origin && destination && (
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-900/40 rounded-md px-2 py-1">
                                <Clock className="w-3 h-3 text-primary-400 shrink-0" />
                                <span className="truncate">
                                    {origin.name?.replace('📍 ', '')} → {destination.name?.replace('📍 ', '')}
                                </span>
                                <span className="text-primary-400 font-bold whitespace-nowrap ml-auto">~{durationText}</span>
                            </div>
                        )}


                        {/* Main result row */}
                        <div className="bg-neutral-900/80 rounded-lg p-2.5 border border-primary-500/30">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Total to Charge</p>
                                    <p className="text-2xl font-black text-primary-400">{formatNum(results.totalToCharge)}</p>
                                    {results.waitTime > 0 && (
                                        <p className="text-[8px] text-neutral-600">{formatNum(results.reasonablePrice)} + {formatNum(results.waitTime)}</p>
                                    )}
                                </div>
                                {results.waitTime > 0 && (
                                    <div className="text-center">
                                        <p className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">Wait Time Charge</p>
                                        <p className="text-base font-black text-amber-400">{formatNum(results.waitTime)}</p>
                                    </div>
                                )}
                                <div className="text-right">
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Per Head</p>
                                    <p className="text-lg font-black text-primary-300">{formatNum(results.perHead)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary metrics */}
                        <div className={`grid ${mode === 'reverse' && results.serviceMultiplier !== undefined ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5`}>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Total Fuel Cost</p>
                                <p className="text-base font-black text-amber-400">{formatNum(results.totalFuelCost)}</p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Net Gain</p>
                                <p className="text-base font-black text-emerald-400">{formatNum(results.netGain)}</p>
                            </div>
                            {mode === 'reverse' && results.serviceMultiplier !== undefined && (
                                <div className="bg-neutral-900/50 rounded-lg p-2">
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Implied Mult</p>
                                    <p className="text-base font-black text-white">{results.serviceMultiplier.toFixed(2)}x</p>
                                </div>
                            )}
                        </div>

                        {/* Per-km breakdown */}
                        <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-neutral-700/50">
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Fuel / Km</p>
                                <p className="text-[10px] font-bold text-white">{formatNum(results.fuelPerKm)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Rev / Km</p>
                                <p className="text-[10px] font-bold text-white">{formatNum(results.revenuePerKm)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Gain / Km</p>
                                <p className="text-[10px] font-bold text-white">{formatNum(results.netGainPerKm)}</p>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Action Buttons */}
            <div className="mt-auto flex gap-1.5 pt-1">
                <button
                    onClick={handleClear}
                    className="flex-[0.25] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-4 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-4 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
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

            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="Ride"
                title="Ride Fare"
            />

            <div
                className={`absolute inset-0 bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${showMap
                    ? 'opacity-100 pointer-events-auto scale-100 z-50'
                    : 'opacity-0 pointer-events-none scale-95 -z-10'
                    }`}
            >
                <DrivingView onClose={() => setShowMap(false)} />
            </div>
        </div >
    );
};

export default RideFareCalculator;

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useInputFocus } from '../../hooks/useInputFocus';
import { Car, Info, HelpCircle, Trash2, Settings, History, Loader2, ArrowUpDown, Clock, Map as MapIcon, Navigation, Zap, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';
import { CalculateIcon } from '../../components/Icons';
import { useHistory } from '../../context/HistoryContext';
import { useTransport } from '../../context/TransportContext';
import HistoryOverlay from '../../components/HistoryOverlay';
import DrivingView from '../driving/DrivingView';
import LiveFareTracker from '../driving/LiveFareTracker';
import TripLogModal from './TripLogModal';

const DEFAULT_VALUES = {
    distance: 15,
    mileage: 0.1,
    costPerLiter: 170,
    serviceMultiplier: 3
};

const hasMapsApi = () => !!window.google?.maps?.DistanceMatrixService;

const formatDuration = (mins) => {
    if (!mins) return '0 mins';
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h > 0) {
        return `${h} hr ${m} min${m !== 1 ? 's' : ''}`;
    }
    return `${m} min${m !== 1 ? 's' : ''}`;
};

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
    const [showLiveTracker, setShowLiveTracker] = useState(false);
    const [showTripLog, setShowTripLog] = useState(false);

    const [mode, setMode] = useState('forward');
    const [priceToCharge, setPriceToCharge] = useState(585);
    const [roundTrip, setRoundTrip] = useState(false);

    const [tripType, setTripType] = useState('single'); // 'single' or 'multi'
    const [stops, setStops] = useState([]); // [{ id, place }]
    const [legsData, setLegsData] = useState([]); // [{ distance, durationValue, durationText, loading }]

    const addStop = useCallback(() => {
        if (stops.length >= 5) return;
        setStops(prev => [...prev, { id: Date.now() + Math.random(), place: null }]);
        setResults(null);
    }, [stops.length]);

    const removeStop = useCallback((index) => {
        setStops(prev => prev.filter((_, i) => i !== index));
        setResults(null);
    }, []);

    const handleStopSelected = useCallback((index, place) => {
        setStops(prev => {
            const next = [...prev];
            next[index] = { ...next[index], place };
            return next;
        });
        setResults(null);
    }, []);

    const [fetchingDistance, setFetchingDistance] = useState(false);
    const [distanceSource, setDistanceSource] = useState('manual');
    const [locationLoading, setLocationLoading] = useState(false);
    const [waitMultiplier, setWaitMultiplier] = useState(2.5);
    const [showMarketComparison, setShowMarketComparison] = useState(false);

    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);

    // Refs for numeric input focus
    const distanceRef = useRef(null);
    const costPerLiterRef = useRef(null);
    const waitMultiplierRef = useRef(null);
    const serviceMultiplierRef = useRef(null);
    const priceToChargeRef = useRef(null);

    const clearResults = useCallback(() => {
        setResults(null);
    }, []);

    const focusDistance = useInputFocus((val) => setValues(prev => ({ ...prev, distance: val })), distanceRef, clearResults);
    const focusCostPerLiter = useInputFocus((val) => setValues(prev => ({ ...prev, costPerLiter: val })), costPerLiterRef, clearResults);
    const focusWaitMultiplier = useInputFocus(setWaitMultiplier, waitMultiplierRef, clearResults);
    const focusServiceMultiplier = useInputFocus((val) => setValues(prev => ({ ...prev, serviceMultiplier: val })), serviceMultiplierRef, clearResults);
    const focusPriceToCharge = useInputFocus(setPriceToCharge, priceToChargeRef, clearResults);

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

    const fetchLegDistance = useCallback((fromPoint, toPoint, index) => {
        if (!fromPoint || !toPoint || !hasMapsApi()) return;

        setLegsData(prev => {
            const next = [...prev];
            next[index] = { ...next[index], loading: true };
            return next;
        });

        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [new window.google.maps.LatLng(fromPoint.lat, fromPoint.lng)],
                destinations: [new window.google.maps.LatLng(toPoint.lat, toPoint.lng)],
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.METRIC,
            },
            (response, status) => {
                if (status === 'OK' && response.rows[0]?.elements[0]?.status === 'OK') {
                    const element = response.rows[0].elements[0];
                    const distVal = parseFloat((element.distance.value / 1000).toFixed(2));
                    const durationSec = element.duration_in_traffic?.value || element.duration?.value || 0;
                    const durationMin = durationSec > 0 ? durationSec / 60 : 0;
                    const durationText = element.duration_in_traffic?.text || element.duration?.text || '';

                    setLegsData(prev => {
                        const next = [...prev];
                        next[index] = {
                            from: { lat: fromPoint.lat, lng: fromPoint.lng },
                            to: { lat: toPoint.lat, lng: toPoint.lng },
                            distance: distVal,
                            durationValue: durationMin,
                            durationText: durationText,
                            loading: false,
                            error: null
                        };
                        return next;
                    });
                    setResults(null);
                } else {
                    setLegsData(prev => {
                        const next = [...prev];
                        next[index] = {
                            ...next[index],
                            loading: false,
                            error: 'Failed'
                        };
                        return next;
                    });
                }
            }
        );
    }, []);

    const waypointList = [origin, ...stops.map(s => s.place), destination];
    const waypointCoordsSerialized = JSON.stringify(
        waypointList.map(w => w ? { lat: w.lat, lng: w.lng } : null)
    );

    useEffect(() => {
        if (tripType !== 'multi') return;

        const expectedLegCount = Math.max(0, waypointList.length - 1);
        
        setLegsData(prev => {
            let next = [...prev];
            if (next.length !== expectedLegCount) {
                next = next.slice(0, expectedLegCount);
                while (next.length < expectedLegCount) {
                    next.push(null);
                }
            }

            for (let i = 0; i < expectedLegCount; i++) {
                const fromPoint = waypointList[i];
                const toPoint = waypointList[i + 1];

                if (!fromPoint || !toPoint) {
                    next[i] = null;
                } else {
                    const currentLeg = next[i];
                    const isSameFrom = currentLeg?.from?.lat === fromPoint.lat && currentLeg?.from?.lng === fromPoint.lng;
                    const isSameTo = currentLeg?.to?.lat === toPoint.lat && currentLeg?.to?.lng === toPoint.lng;

                    if (!currentLeg || !isSameFrom || !isSameTo) {
                        next[i] = {
                            from: { lat: fromPoint.lat, lng: fromPoint.lng },
                            to: { lat: toPoint.lat, lng: toPoint.lng },
                            loading: true,
                            distance: 0,
                            durationValue: 0,
                            durationText: ''
                        };
                        fetchLegDistance(fromPoint, toPoint, i);
                    }
                }
            }
            return next;
        });
    }, [waypointCoordsSerialized, tripType, fetchLegDistance]);

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

                const finalLabel = '📍 ' + name;
                place.name = name;
                place.address = name;
                place.description = finalLabel;
                setInputValue(finalLabel);
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

    const calculateResults = useCallback(() => {
        const chargeMultiplier = roundTrip ? 2 : 1;
        const actualFuelMultiplier = 2; // Always estimate fuel for round-trip for true cost out of pocket

        const isMulti = tripType === 'multi';
        const totalDistanceMulti = isMulti
            ? legsData.reduce((sum, leg) => sum + (leg?.distance || 0), 0)
            : 0;
        const totalDurationMulti = isMulti
            ? legsData.reduce((sum, leg) => sum + (leg?.durationValue || 0), 0)
            : 0;

        const dist = isMulti ? totalDistanceMulti : (values.distance || 0);
        const durVal = isMulti ? totalDurationMulti : (durationValue || 0);

        const mileage = values.mileage || 0;
        const cost = values.costPerLiter || 0;
        const waitMult = waitMultiplier || 0;
        const serviceMult = values.serviceMultiplier || 0;
        const chargingPrice = priceToCharge || 0;

        const oneWayFuelCost = dist * mileage * cost;
        const chargingFuelCost = oneWayFuelCost * chargeMultiplier;
        const totalFuelCost = oneWayFuelCost * actualFuelMultiplier;

        const waitTimeBase = durVal != null ? durVal * 1.1 * waitMult : 0;
        const waitTime = waitTimeBase * 2; // Always double to represent true round-trip even in one-way mode

        if (mode === 'forward') {
            const basePrice = chargingFuelCost * serviceMult;
            const totalToCharge = basePrice + waitTime;
            const revenuePerKm = dist > 0 ? totalToCharge / dist : 0;
            const netGain = totalToCharge - totalFuelCost;
            const netGainPerKm = dist > 0 ? netGain / dist : 0;
            const fuelPerKm = dist > 0 ? (totalFuelCost / dist) / 2 : 0;
            const perHead = totalToCharge / 4;
            const netGainSingle = totalToCharge - oneWayFuelCost;
            const netGainRound = totalToCharge - totalFuelCost;
            return { totalFuelCost, reasonablePrice: basePrice, totalToCharge, waitTime, revenuePerKm, netGain, netGainPerKm, fuelPerKm, perHead, netGainSingle, netGainRound };
        } else {
            const totalToCharge = chargingPrice;
            const basePrice = Math.max(0, totalToCharge - waitTime);
            const netGain = totalToCharge - totalFuelCost;
            const perHead = totalToCharge / 4;
            const revenuePerKm = dist > 0 ? totalToCharge / dist : 0;
            const fuelPerKm = dist > 0 ? (totalFuelCost / dist) / 2 : 0;
            const netGainPerKm = dist > 0 ? netGain / dist : 0;
            const serviceMultiplierValue = chargingFuelCost > 0 ? (totalToCharge - waitTime) / chargingFuelCost : 0;
            const netGainSingle = totalToCharge - oneWayFuelCost;
            const netGainRound = totalToCharge - totalFuelCost;
            return { totalFuelCost, reasonablePrice: basePrice, totalToCharge, waitTime, revenuePerKm, netGain, netGainPerKm, fuelPerKm, perHead, serviceMultiplier: serviceMultiplierValue, netGainSingle, netGainRound };
        }
    }, [values, waitMultiplier, priceToCharge, durationValue, roundTrip, mode, tripType, legsData]);

    const handleCalculate = () => {
        const newResults = calculateResults();
        setResults(newResults);
        if (mode === 'forward') {
            addToHistory('Ride', { ...values, mode: 'forward', roundTrip }, newResults);
        } else {
            addToHistory('Ride', { ...values, priceToCharge: priceToCharge, mode: 'reverse', roundTrip }, newResults);
        }
    };

    const handleChange = (field, val) => {
        const numericVal = val === '' ? null : (parseFloat(val) || 0);
        setValues(prev => ({ ...prev, [field]: numericVal }));
        if (field === 'distance') setDistanceSource('manual');
        setResults(null);
    };

    const handleClear = () => {
        setResults(null);
    };

    const openInGoogleMaps = () => {
        if (!origin || !destination) return;

        let params = `origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`;
        const isMulti = tripType === 'multi';
        const validStops = isMulti ? stops.filter(s => s?.place).map(s => s.place) : [];
        if (isMulti && validStops.length > 0) {
            const waypointsParam = validStops.map(s => `${s.lat},${s.lng}`).join('|');
            params += `&waypoints=${encodeURIComponent(waypointsParam)}`;
        }
        params += `&travelmode=driving&dir_action=navigate`;

        const webUrl = `https://www.google.com/maps/dir/?api=1&${params}`;

        // Android WebView: use intent:// to force opening the external Google Maps app
        const isAndroid = /android/i.test(navigator.userAgent);
        if (isAndroid) {
            const intentUrl = `intent://maps.google.com/maps/dir/?api=1&${params}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
            window.location.href = intentUrl;
        } else {
            window.open(webUrl, '_blank');
        }
    };

    const formatNum = (val) => (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const mapsAvailable = mapsReady && hasMapsApi();
    const activeResults = results || calculateResults();

    // ---- Market Comparison Calculations ----
    const isMulti = tripType === 'multi';
    const totalDistanceMulti = isMulti
        ? legsData.reduce((sum, leg) => sum + (leg?.distance || 0), 0)
        : 0;
    const totalDurationMulti = isMulti
        ? legsData.reduce((sum, leg) => sum + (leg?.durationValue || 0), 0)
        : 0;

    const dist = isMulti ? totalDistanceMulti : (values.distance || 0);
    const waitMin = isMulti ? totalDurationMulti : (durationValue || 0);
    
    const rideFlagDown = 260;
    const rideDistRate = 24;
    const rideWaitRate = 5;
    const rideFare = rideFlagDown + (dist * rideDistRate) + (waitMin * rideWaitRate);

    const feresFlagDown = 110;
    const feresDistRate = 16;
    const feresWaitRate = 1;
    const feresBookingFeeRate = 0.07;
    const feresSubtotal = feresFlagDown + (dist * feresDistRate) + (waitMin * feresWaitRate);
    const feresFare = feresSubtotal * (1 + feresBookingFeeRate);

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                    <Car className="w-5 h-5 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">
                            Ride Fare
                        </h1>
                        <p className="text-neutral-500 text-[9px] font-medium uppercase tracking-wider">
                            Transport & Fuel
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex bg-neutral-900/70 rounded-md p-0.5 ring-1 ring-neutral-800">
                        <button
                            onClick={() => { if (tripType !== 'single') { setTripType('single'); setResults(null); } }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${tripType === 'single' ? 'bg-primary-600/25 text-primary-400 ring-1 ring-primary-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Single
                        </button>
                        <button
                            onClick={() => { if (tripType !== 'multi') { setTripType('multi'); setResults(null); } }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${tripType === 'multi' ? 'bg-primary-600/25 text-primary-400 ring-1 ring-primary-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Multi
                        </button>
                    </div>
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>


            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2.5 mb-1.5 text-[11px] text-neutral-300 text-left leading-relaxed space-y-1.5">
                    <p className="font-bold text-primary-400 text-xs">How It Works</p>
                    {mapsAvailable && (
                        <p>📍 <strong className="text-white">Google Maps:</strong> Select From/To locations to auto-fetch driving distance. Your current location is auto-detected on launch using GPS + Places API.</p>
                    )}
                    <p>
                        {mode === 'forward'
                            ? `📍 Enter distance, fuel price, and service multiplier to calculate the recommended fare. Formula: Price = (Distance × Mileage × Fuel Cost × ${roundTrip ? '2' : '1'}) × Service Multiplier + Wait Time Charge.`
                            : `🔄 Enter a known fare to reverse-calculate fuel cost breakdown, net gain, and the implied service multiplier.`}
                    </p>
                    <p>⛽ <strong className="text-white">Mileage:</strong> Fixed at 0.10 L/Km — the baseline fuel consumption rate used in all calculations.</p>
                    <p>🔄 <strong className="text-white">Round Trip (1× / 2×):</strong> {roundTrip ? 'Enabled (2x fuel cost)' : 'Disabled (1x fuel cost)'} — applies a 2x factor to fuel costs when calculating total fare.</p>
                    <p>⏱️ <strong className="text-white">Wait Time:</strong> Estimated travel time + 10% buffer, multiplied by a configurable factor (default 2.5) to estimate total charge for wait time.</p>
                    <p>👥 <strong className="text-white">Per Head:</strong> Total fare split by 4 passengers for cost-sharing.</p>
                    {mapsAvailable && (
                        <>
                            <p className="font-bold text-primary-400 text-xs pt-1">Map</p>
                            <p>🗺️ <strong className="text-white">View Map:</strong> When both From and To are set, tap "Map" for a full-screen interactive map with traffic-colored polylines (blue = normal, yellow = slow, red = jam).</p>
                            <p>🔀 <strong className="text-white">Alternate Routes:</strong> Grey lines on the map show alternative Routes — tap one to switch. The selected route's distance and time sync back to the calculator automatically.</p>
                            <p>🧭 <strong className="text-white">Turn-by-Turn:</strong> Expand the bottom sheet on the map view for step-by-step navigation directions.</p>
                            <p>⇅ <strong className="text-white">Swap:</strong> Use the swap button between From/To to instantly reverse your route.</p>
                        </>
                    )}
                </div>
            )}

            {/* Mode Selectors */}
            <div className="flex bg-neutral-900/70 rounded-lg p-0.5 ring-1 ring-neutral-800 mb-1.5 gap-1">
                <button
                    onClick={() => { if (mode !== 'forward') { setMode('forward'); setResults(null); } }}
                    className={`flex-1 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'forward' ? 'bg-primary-600/25 text-primary-400 ring-1 ring-primary-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                    Input→Price
                </button>
                <button
                    onClick={() => { if (mode !== 'reverse') { setMode('reverse'); setResults(null); } }}
                    className={`flex-1 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'reverse' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                    Price→Split
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
                            defaultValue={origin ? origin.description || origin.address || origin.name : ''}
                        />
                        {tripType === 'single' ? (
                            <>
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
                                    defaultValue={destination ? destination.description || destination.address || destination.name : ''}
                                />
                            </>
                        ) : (
                            <>
                                {/* Stopovers with interspersed leg badges */}
                                {stops.map((stop, index) => {
                                    const leg = legsData[index];
                                    return (
                                        <React.Fragment key={stop.id}>
                                            {/* Leg Spacer Connector Row (between previous point and this stopover) */}
                                            <div className="relative pl-6 py-3">
                                                <div className="absolute left-[13px] top-[-10px] bottom-[-10px] border-l border-dashed border-neutral-700/60 z-0"></div>
                                                {leg && (
                                                    <div className="absolute left-[20px] top-[50%] translate-y-[-50%] bg-neutral-900 ring-1 ring-neutral-800 text-[10px] font-mono font-bold text-primary-400 px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                                                        {leg.loading ? (
                                                            <span className="flex items-center gap-1">
                                                                <Loader2 className="w-2.5 h-2.5 animate-spin" /> Loading
                                                            </span>
                                                        ) : (
                                                            `🚗 ${leg.distance.toFixed(1)} km • ${leg.durationText || '0 min'}`
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stopover input box itself */}
                                            <div className="relative pl-6">
                                                <div className="absolute left-[13px] top-[-10px] bottom-[-10px] border-l border-dashed border-neutral-700/60 z-0"></div>
                                                <div className="flex items-center gap-1.5 bg-neutral-900/40 rounded-lg p-1 border border-neutral-800 relative z-1">
                                                    <div className="flex-1 min-w-0">
                                                        <PlacesAutocomplete
                                                            label={`Stop ${index + 1}`}
                                                            placeholder="Search stopover..."
                                                            onPlaceSelected={(place) => handleStopSelected(index, place)}
                                                            accentColor="primary"
                                                            compact
                                                            mapsReady={mapsReady}
                                                            defaultValue={stop.place ? stop.place.description || stop.place.address || stop.place.name : ''}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeStop(index)}
                                                        className="p-1 rounded-md text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all active:scale-90 shrink-0"
                                                        title="Remove Stopover"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}

                                {/* Add Stopover button row */}
                                {stops.length < 5 && (
                                    <div className="relative pl-6 py-2">
                                        <div className="absolute left-[13px] top-[-10px] bottom-[-10px] border-l border-dashed border-neutral-700/60 z-0"></div>
                                        <button
                                            onClick={addStop}
                                            className="relative z-1 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 text-primary-400 font-bold text-[9px] uppercase tracking-wider transition-all active:scale-[0.97]"
                                        >
                                            <span>+</span> Add Stopover ({stops.length}/5)
                                        </button>
                                    </div>
                                )}

                                {/* Final leg spacer connector row */}
                                <div className="relative pl-6 py-3">
                                    <div className="absolute left-[13px] top-[-10px] bottom-[-10px] border-l border-dashed border-neutral-700/60 z-0"></div>
                                    {legsData[stops.length] && (
                                        <div className="absolute left-[20px] top-[50%] translate-y-[-50%] bg-neutral-900 ring-1 ring-neutral-800 text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                                            {legsData[stops.length].loading ? (
                                                <span className="flex items-center gap-1">
                                                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> Loading
                                                </span>
                                            ) : (
                                                `🚗 ${legsData[stops.length].distance.toFixed(1)} km • ${legsData[stops.length].durationText || '0 min'}`
                                            )}
                                        </div>
                                    )}
                                </div>

                                <PlacesAutocomplete
                                    label="To"
                                    placeholder="e.g. Megenagna"
                                    onPlaceSelected={handleDestinationSelected}
                                    accentColor="primary"
                                    compact
                                    externalInputRef={toInputRef}
                                    mapsReady={mapsReady}
                                    defaultValue={destination ? destination.description || destination.address || destination.name : ''}
                                />
                            </>
                        )}
                        <div className="flex gap-1.5 mt-2 pt-2 border-t border-neutral-700/40">
                            {origin && destination && (
                                <>
                                    <button
                                        onClick={() => setShowMap(true)}
                                        className="flex-1 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-primary-500/30 active:scale-[0.98]"
                                    >
                                        <MapIcon className="w-4 h-4 text-primary-400" />
                                        Map
                                    </button>
                                    <button
                                        onClick={openInGoogleMaps}
                                        className="bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 border border-neutral-700/50 active:scale-[0.98] shrink-0"
                                        title="Open in Google Maps app"
                                    >
                                        <Navigation className="w-3.5 h-3.5 text-primary-400" />
                                        Navigate
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setShowLiveTracker(true)}
                                className={`flex items-center gap-1.5 bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/50 hover:to-amber-500/35 text-amber-400 font-bold text-xs py-2 px-3 rounded-lg transition-all border border-amber-500/40 active:scale-[0.97] shrink-0 ${!origin || !destination ? 'flex-1' : ''}`}
                                title="Live fare tracking"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Live</span>
                            </button>
                            <button
                                onClick={() => setShowTripLog(true)}
                                className={`flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-primary-400 font-bold text-xs py-2 px-3 rounded-lg transition-all border border-neutral-700/50 active:scale-[0.97] shrink-0 ${!origin || !destination ? 'flex-1' : ''}`}
                                title="Manual trip logging"
                            >
                                <ClipboardList className="w-3.5 h-3.5" />
                                <span>Log</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inputs - 2 column grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                {/* Distance */}
                <div className={`rounded-xl p-1.5 border ${distanceSource === 'maps' ? 'bg-emerald-900/10 border-emerald-500/40' : 'bg-neutral-800/40 border-primary-500/40'}`}>
                    <div className="flex justify-between items-center mb-0.5">
                        <label 
                            onClick={focusDistance}
                            className={`text-[10px] uppercase tracking-wider font-bold block cursor-pointer hover:text-white transition-colors ${distanceSource === 'maps' ? 'text-emerald-400' : 'text-primary-400'}`}
                            title="Click to Clear"
                        >
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
                    <div className="flex items-end justify-between gap-1">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold shrink-0 mb-1">
                            {distanceSource === 'maps' ? '✓ Google Maps' : 'Trip Length'}
                        </span>
                        {fetchingDistance ? (
                            <div className="flex items-center gap-1 text-primary-400 text-xs py-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                            </div>
                        ) : (
                            <FormattedNumberInput
                                ref={distanceRef}
                                value={values.distance}
                                onChange={(e) => handleChange('distance', e.target.value)}
                                decimals={2}
                                className={`bg-transparent text-right text-base font-mono focus:outline-none font-black w-full ${distanceSource === 'maps' ? 'text-emerald-400' : 'text-primary-400'}`}
                            />
                        )}
                    </div>
                </div>

                {/* Fuel Cost */}
                <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-neutral-700/50">
                    <div className="flex justify-between items-center mb-0.5 h-[18px]">
                        <label 
                            onClick={focusCostPerLiter}
                            className="text-[10px] uppercase tracking-wider font-bold text-white block cursor-pointer hover:text-primary-400 transition-colors"
                            title="Click to Clear"
                        >
                            Fuel Cost / Liter
                        </label>
                    </div>
                    <div className="flex items-end justify-between gap-1">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold shrink-0 mb-1">Current Price</span>
                        <FormattedNumberInput
                            ref={costPerLiterRef}
                            value={values.costPerLiter}
                            onChange={(e) => handleChange('costPerLiter', e.target.value)}
                            decimals={2}
                            className="bg-transparent text-right text-base font-mono focus:outline-none text-white w-full"
                            placeholder="170.00"
                        />
                    </div>
                </div>

                {/* Wait Multiplier */}
                <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-neutral-700/50">
                    <div className="flex justify-between items-center mb-0.5 h-[18px]">
                        <label 
                            onClick={focusWaitMultiplier}
                            className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block cursor-pointer hover:text-white transition-colors"
                            title="Click to Clear"
                        >
                            Wait Multiplier
                        </label>
                    </div>
                    <div className="flex items-end justify-between gap-1">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold shrink-0 mb-1">Time Factor</span>
                        <FormattedNumberInput
                            ref={waitMultiplierRef}
                            value={waitMultiplier}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setWaitMultiplier(val);
                                setResults(null);
                            }}
                            decimals={1}
                            className="bg-transparent text-right text-base font-mono focus:outline-none text-amber-400 font-black w-full"
                        />
                    </div>
                </div>

                {/* Service Factor or Price to Charge */}
                {mode === 'forward' ? (
                    <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-neutral-700/50">
                        <div className="flex justify-between items-center mb-0.5 h-[18px]">
                            <label 
                                onClick={focusServiceMultiplier}
                                className="text-[10px] uppercase tracking-wider font-bold text-white block cursor-pointer hover:text-primary-400 transition-colors"
                                title="Click to Clear"
                            >
                                Service Multiplier
                            </label>
                        </div>
                        <div className="flex items-end justify-between gap-1">
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold shrink-0 mb-1">Multiplier Range</span>
                            <FormattedNumberInput
                                ref={serviceMultiplierRef}
                                value={values.serviceMultiplier}
                                onChange={(e) => handleChange('serviceMultiplier', e.target.value)}
                                decimals={1}
                                className="bg-transparent text-right text-base font-mono focus:outline-none text-white w-full"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-800/40 rounded-xl p-1.5 border border-emerald-500/40">
                        <div className="flex justify-between items-center mb-0.5 h-[18px]">
                            <label 
                                onClick={focusPriceToCharge}
                                className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block cursor-pointer hover:text-white transition-colors"
                                title="Click to Clear"
                            >
                                Price to Charge
                            </label>
                        </div>
                        <div className="flex items-end justify-between gap-1">
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold shrink-0 mb-1">Known Fare</span>
                            <FormattedNumberInput
                                ref={priceToChargeRef}
                                value={priceToCharge}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setPriceToCharge(val);
                                    setResults(null);
                                }}
                                decimals={2}
                                className="bg-transparent text-right text-base font-mono focus:outline-none text-emerald-400 font-black w-full"
                            />
                        </div>
                    </div>
                )}
            </div>


            {/* Results */}
            {
                results && (
                    <div className="bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2 space-y-1 mb-1.5">
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
                        {tripType === 'single' ? (
                            durationText && origin && destination && (
                                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-900/40 rounded-md px-2 py-1">
                                    <Clock className="w-3 h-3 text-primary-400 shrink-0" />
                                    <span className="truncate">
                                        {origin.name?.replace('📍 ', '')} → {destination.name?.replace('📍 ', '')}
                                    </span>
                                    <span className="text-primary-400 font-bold whitespace-nowrap ml-auto">~{durationText}</span>
                                </div>
                            )
                        ) : (
                            origin && destination && (
                                <div className="text-[10px] text-neutral-400 bg-neutral-900/40 rounded-lg p-2 space-y-1.5 text-left leading-relaxed">
                                    <div className="flex items-center gap-1.5 border-b border-neutral-800/80 pb-1.5">
                                        <Clock className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                                        <span className="font-bold text-neutral-300">Multi-Stop Summary</span>
                                        <span className="text-primary-400 font-black whitespace-nowrap ml-auto">
                                            {formatDuration(totalDurationMulti)} ({totalDistanceMulti.toFixed(2)} km)
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0"></span>
                                            <span className="truncate font-semibold text-neutral-200">Origin: {origin.name?.replace('📍 ', '')}</span>
                                        </div>
                                        {stops.map((stop, i) => {
                                            const leg = legsData[i];
                                            return (
                                                <div key={stop.id} className="flex items-center gap-1.5 pl-3 border-l border-neutral-800">
                                                    <span className="text-neutral-500 font-bold text-[8px]">{i + 1}.</span>
                                                    <span className="truncate text-neutral-300 font-medium">{stop.place?.name || `Stopover ${i + 1}`}</span>
                                                    {leg && !leg.loading && (
                                                        <span className="text-[8px] text-neutral-500 font-mono ml-auto">
                                                            +{leg.distance.toFixed(1)} km (~{leg.durationText || '0 min'})
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                            <span className="truncate font-semibold text-neutral-200">Destination: {destination.name?.replace('📍 ', '')}</span>
                                            {legsData[stops.length] && !legsData[stops.length].loading && (
                                                <span className="text-[8px] text-neutral-500 font-mono ml-auto">
                                                    +{legsData[stops.length].distance.toFixed(1)} km (~{legsData[stops.length].durationText || '0 min'})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}


                        {/* Main result row */}
                        <div className="bg-neutral-900/80 rounded-lg p-2 border border-primary-500/30">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Total to Charge</p>
                                    <p className="text-xl font-black text-primary-400">{formatNum(results.totalToCharge)}</p>
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
                                    <p className="text-base font-black text-primary-300">{formatNum(results.perHead)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary metrics */}
                        <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-neutral-900/50 rounded-lg p-1.5">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Total Fuel Cost</p>
                                <p className="text-base font-black text-amber-400">{formatNum(results.totalFuelCost)}</p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-1.5">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Net Gain</p>
                                <p className="text-base font-black text-emerald-400">
                                    {!roundTrip ? (
                                        <>{formatNum(results.netGainSingle)} <span className="text-neutral-500 font-medium">/</span> {formatNum(results.netGainRound)}</>
                                    ) : (
                                        formatNum(results.netGain)
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Per-km breakdown */}
                        <div className={`grid ${mode === 'reverse' && results.serviceMultiplier !== undefined ? 'grid-cols-4' : 'grid-cols-3'} gap-1.5 pt-1.5 border-t border-neutral-700/50`}>
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
                            {mode === 'reverse' && results.serviceMultiplier !== undefined && (
                                <div>
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase">Implied Mult</p>
                                    <p className="text-[10px] font-bold text-white">{results.serviceMultiplier.toFixed(2)}x</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Market Comparison (Expandable) */}
            {dist > 0 && (
                <div className="mb-1.5">
                    <button
                        onClick={() => setShowMarketComparison(!showMarketComparison)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                            showMarketComparison 
                            ? 'bg-neutral-800/60 border-neutral-700/50 rounded-b-none' 
                            : 'bg-neutral-800/30 border-neutral-700/30 hover:bg-neutral-800/50'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Car className={`w-3.5 h-3.5 ${showMarketComparison ? 'text-primary-400' : 'text-neutral-500'}`} />
                            <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Market Comparison</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {!showMarketComparison && (
                                <div className="flex items-center gap-2">
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
                            {showMarketComparison ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />}
                        </div>
                    </button>

                    {showMarketComparison && (
                        <div className="bg-neutral-800/40 rounded-b-xl border-x border-b border-neutral-700/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                            {/* Ride Card */}
                            <div className="p-2.5 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[8px] font-bold text-primary-400 uppercase tracking-widest">Ride App</p>
                                        <p className="text-[6px] text-neutral-500 font-bold uppercase tracking-tight">Market Standard</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black text-white">{formatNum(rideFare)}</p>
                                        <p className="text-[6px] text-neutral-500 font-bold uppercase">ETB</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-1 py-1 border-t border-neutral-700/30">
                                    <div>
                                        <p className="text-[6px] font-bold text-neutral-500 uppercase">Flag</p>
                                        <p className="text-[8px] font-black text-neutral-400">260</p>
                                    </div>
                                    <div>
                                        <p className="text-[6px] font-bold text-neutral-500 uppercase">Dist</p>
                                        <p className="text-[8px] font-black text-neutral-400">{formatNum(dist * 24)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[6px] font-bold text-neutral-500 uppercase">Wait</p>
                                        <p className="text-[8px] font-black text-neutral-400">{formatNum(waitMin * 5)}</p>
                                    </div>
                                </div>
                                {results && (
                                    <div className="pt-1.5 border-t border-neutral-700/30 flex items-center justify-between">
                                        <span className="text-[7px] font-bold text-neutral-500 uppercase">Savings vs Ride</span>
                                        <span className={`text-[8px] font-black ${rideFare - results.totalToCharge > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {rideFare - results.totalToCharge > 0 ? '+' : ''}{formatNum(rideFare - results.totalToCharge)} ETB
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Feres Card */}
                            <div className="p-2.5 bg-neutral-900/30 border-t border-neutral-700/50 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Feres</p>
                                        <p className="text-[6px] text-neutral-500 font-bold uppercase tracking-tight">Value Option</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black text-white">{formatNum(feresFare)}</p>
                                        <p className="text-[6px] text-neutral-500 font-bold uppercase">ETB</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-1 py-1 border-t border-neutral-700/30">
                                    <div>
                                        <p className="text-[6px] font-bold text-neutral-500 uppercase">Flag</p>
                                        <p className="text-[8px] font-black text-neutral-400">110</p>
                                    </div>
                                    <div>
                                        <p className="text-[6px] font-bold text-neutral-500 uppercase">Dist</p>
                                        <p className="text-[8px] font-black text-neutral-400">{formatNum(dist * 16)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[6px] font-bold text-neutral-500 uppercase">Wait</p>
                                        <p className="text-[8px] font-black text-neutral-400">{formatNum(waitMin * 1)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[6px] font-bold text-neutral-500 uppercase">Fee(7%)</p>
                                        <p className="text-[8px] font-black text-neutral-400">{formatNum(feresSubtotal * 0.07)}</p>
                                    </div>
                                </div>
                                {results && (
                                    <div className="pt-1.5 border-t border-neutral-700/30 flex items-center justify-between">
                                        <span className="text-[7px] font-bold text-neutral-500 uppercase">Savings vs Feres</span>
                                        <span className={`text-[8px] font-black ${feresFare - results.totalToCharge > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {feresFare - results.totalToCharge > 0 ? '+' : ''}{formatNum(feresFare - results.totalToCharge)} ETB
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-auto flex gap-1.5 pt-1">
                <button
                    onClick={handleClear}
                    className="w-[12%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-2.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
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
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-2.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
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
                <DrivingView 
                    onClose={() => setShowMap(false)} 
                    fareData={{ ...activeResults, ...values, waitMultiplier }} 
                    onOpenLiveTracker={() => setShowLiveTracker(true)} 
                    tripType={tripType}
                    stops={stops}
                />
            </div>

            <LiveFareTracker
                isVisible={showLiveTracker}
                onClose={() => setShowLiveTracker(false)}
                fareData={{ ...activeResults, ...values, waitMultiplier }}
                initialMapState={showMap}
                mapsReady={mapsReady}
            />
            {/* Trip Log Modal */}
            <TripLogModal
                isOpen={showTripLog}
                onClose={() => setShowTripLog(false)}
                defaultMileage={values.mileage}
                defaultCostPerLiter={values.costPerLiter}
            />
        </div >
    );
};

export default RideFareCalculator;

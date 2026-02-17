import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Car, Info, HelpCircle, Trash2, Settings, History, Loader2, ArrowUpDown } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';
import { CalculateIcon } from '../../components/Icons';
import { useHistory } from '../../context/HistoryContext';
import HistoryOverlay from '../../components/HistoryOverlay';

const DEFAULT_VALUES = {
    distance: 15,
    mileage: 0.1,
    costPerLiter: 130,
    serviceFactor: 3
};

const hasMapsApi = () => !!window.google?.maps?.DistanceMatrixService;

const RideFareCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [values, setValues] = useState(DEFAULT_VALUES);
    const [results, setResults] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const [mode, setMode] = useState('forward');
    const [priceToCharge, setPriceToCharge] = useState(585);

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [fetchingDistance, setFetchingDistance] = useState(false);
    const [distanceSource, setDistanceSource] = useState('manual');
    const [locationLoading, setLocationLoading] = useState(false);

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
    }, [origin, destination]);


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
            },
            (response, status) => {
                setFetchingDistance(false);
                if (status === 'OK' && response.rows[0]?.elements[0]?.status === 'OK') {
                    const distanceMeters = response.rows[0].elements[0].distance.value;
                    const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));
                    setValues(prev => ({ ...prev, distance: distanceKm }));
                    setDistanceSource('maps');
                    setResults(null);
                }
            }
        );
    }, []);

    const handleOriginSelected = useCallback((place) => {
        setOrigin(place);
        if (destination) fetchDistance(place, destination);
    }, [destination, fetchDistance]);

    const handleDestinationSelected = useCallback((place) => {
        setDestination(place);
        if (origin) fetchDistance(origin, place);
    }, [origin, fetchDistance]);

    const useCurrentLocation = useCallback((setInputValue) => {
        if (!navigator.geolocation) return;
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                const place = { lat, lng, name: 'My Location', address: '' };

                // Use Places nearbySearch to find the closest named place
                if (window.google?.maps?.places?.PlacesService) {
                    const tempDiv = document.createElement('div');
                    const service = new window.google.maps.places.PlacesService(tempDiv);
                    service.nearbySearch(
                        { location: { lat, lng }, rankBy: window.google.maps.places.RankBy.DISTANCE, type: 'point_of_interest' },
                        (results, status) => {
                            setLocationLoading(false);
                            if (status === 'OK' && results?.length > 0) {
                                const nearest = results[0];
                                place.name = nearest.name;
                                place.address = nearest.vicinity || nearest.name;
                            }
                            setInputValue('📍 ' + place.name);
                            setOrigin(place);
                            if (destination) fetchDistance(place, destination);
                        }
                    );
                } else {
                    setLocationLoading(false);
                    setInputValue(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                    setOrigin(place);
                    if (destination) fetchDistance(place, destination);
                }
            },
            () => setLocationLoading(false),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [destination, fetchDistance]);

    // Auto-trigger current location on mount
    const locationTriggered = useRef(false);
    useEffect(() => {
        if (locationTriggered.current || !hasMapsApi() || !navigator.geolocation) return;
        locationTriggered.current = true;
        const setFromValue = (val) => {
            if (fromInputRef.current) fromInputRef.current.value = val;
        };
        useCurrentLocation(setFromValue);
    }, [useCurrentLocation]);

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
        if (field === 'distance') setDistanceSource('manual');
        setResults(null);
    };

    const handleClear = () => {
        setValues(DEFAULT_VALUES);
        setPriceToCharge(585);
        setResults(null);
        setOrigin(null);
        setDestination(null);
        setDistanceSource('manual');
    };

    const formatNum = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const mapsAvailable = hasMapsApi();

    return (
        <div className="flex flex-col h-full">
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
                        <p>📍 <strong className="text-white">Google Maps:</strong> Select From/To locations to auto-fetch the driving distance.</p>
                    )}
                    <p>
                        {mode === 'forward'
                            ? '📐 Enter distance, fuel price, and service factor to calculate the recommended fare. Formula: Price = Distance × Mileage × Fuel Cost × Service Factor.'
                            : '🔄 Enter a known fare to reverse-calculate fuel cost breakdown, net gain, and the implied service factor.'}
                    </p>
                    <p>👥 <strong className="text-white">Per Head:</strong> Total fare split by 4 passengers for cost-sharing.</p>
                </div>
            )}

            {/* Mode Toggle */}
            <div className="flex mb-2 bg-neutral-900/50 rounded-lg p-0.5">
                <button
                    onClick={() => { setMode('forward'); setResults(null); }}
                    className={`flex-1 py-1 px-2 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'forward' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                    Inputs → Price
                </button>
                <button
                    onClick={() => { setMode('reverse'); setResults(null); }}
                    className={`flex-1 py-1 px-2 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'reverse' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
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
                            accentColor="white"
                            compact
                            externalInputRef={toInputRef}
                        />
                    </div>
                </div>
            )}

            {/* Inputs - 2 column grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                {/* Distance */}
                <div className={`rounded-xl p-2 border ${distanceSource === 'maps' ? 'bg-emerald-900/10 border-emerald-500/40' : 'bg-neutral-800/40 border-primary-500/40'}`}>
                    <label className={`text-[10px] uppercase tracking-wider font-bold block mb-0.5 ${distanceSource === 'maps' ? 'text-emerald-400' : 'text-primary-400'}`}>
                        Distance (Km)
                    </label>
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
                        Fuel Cost / L
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

                {/* Fuel Mileage (Read-Only) */}
                <div className="bg-neutral-900/30 rounded-xl p-2 border border-neutral-700/30 opacity-80">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 block mb-0.5">
                        Mileage (L/Km)
                    </label>
                    <p className="text-right text-lg font-mono text-neutral-400">{values.mileage.toFixed(2)}</p>
                    <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">Efficiency</span>
                </div>

                {/* Service Factor or Price to Charge */}
                {mode === 'forward' ? (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-white block mb-0.5">
                            Service Factor
                        </label>
                        <FormattedNumberInput
                            value={values.serviceFactor}
                            onChange={(e) => handleChange('serviceFactor', e.target.value)}
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
            {results && (
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

                    {/* Main result row */}
                    <div className="bg-neutral-900/80 rounded-lg p-2.5 border border-primary-500/30">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Price to Charge</p>
                                <p className="text-2xl font-black text-primary-400">{formatNum(results.reasonablePrice)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Per Head</p>
                                <p className="text-lg font-black text-primary-300">{formatNum(results.perHead)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary metrics */}
                    <div className="grid grid-cols-2 gap-1.5">
                        <div className="bg-neutral-900/50 rounded-lg p-2">
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Total Fuel Cost</p>
                            <p className="text-base font-black text-amber-400">{formatNum(results.totalFuelCost)}</p>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-2">
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Net Gain</p>
                            <p className="text-base font-black text-emerald-400">{formatNum(results.netGain)}</p>
                        </div>
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

                    {mode === 'reverse' && results.serviceFactor !== undefined && (
                        <div className="pt-1.5 border-t border-neutral-700/50">
                            <div className="flex justify-between items-center">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Implied Service Factor</p>
                                <p className="text-xs font-bold text-white">{results.serviceFactor.toFixed(2)}x</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-auto flex gap-1.5 pt-1">
                <button
                    onClick={handleClear}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
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
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
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
        </div>
    );
};

export default RideFareCalculator;

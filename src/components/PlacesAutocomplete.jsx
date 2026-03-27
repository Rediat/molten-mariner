import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapPin, Crosshair, Search, Loader2 } from 'lucide-react';

const PlacesAutocomplete = ({ placeholder, onPlaceSelected, label, accentColor = 'white', compact = false, onUseCurrentLocation, locationLoading, externalInputRef, mapsReady }) => {
    const internalRef = useRef(null);
    const inputRef = externalInputRef || internalRef;
    const [predictions, setPredictions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState(null);
    
    // Services refs
    const autocompleteService = useRef(null);
    const placesService = useRef(null);
    const dropdownRef = useRef(null);

    // Initialize Services
    useEffect(() => {
        if (!window.google?.maps?.places || !mapsReady) return;
        
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        // PlacesService requires an HTML element, even if we just use it for getDetails
        const dummyDiv = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
    }, [mapsReady]);

    // Handle clicks outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current?.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [inputRef]);

    const fetchPredictions = useCallback((input) => {
        if (!input || input.length < 2 || !autocompleteService.current) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        // Addis Ababa center for biasing
        const addisAbaba = new window.google.maps.LatLng(9.0333, 38.7500);
        
        autocompleteService.current.getPlacePredictions({
            input,
            sessionToken,
            componentRestrictions: { country: 'et' },
            locationBias: { radius: 10000, center: addisAbaba }, // 10km radius from city center
        }, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                setLoading(false);
                setPredictions(results);
                setShowDropdown(true);
            } else if (placesService.current) {
                // Fallback to textSearch for unordered or complex queries if Autocomplete fails
                placesService.current.textSearch({
                    query: input + ' Addis Ababa Ethiopia',
                    location: addisAbaba,
                    radius: 20000,
                }, (textResults, textStatus) => {
                    setLoading(false);
                    if (textStatus === window.google.maps.places.PlacesServiceStatus.OK && textResults) {
                        // Map textSearch results to match the prediction object format
                        const mappedResults = textResults.slice(0, 5).map(res => ({
                            place_id: res.place_id,
                            description: res.name + ', ' + (res.formatted_address || ''),
                            structured_formatting: {
                                main_text: res.name,
                                secondary_text: res.formatted_address || 'Addis Ababa',
                            },
                        }));
                        setPredictions(mappedResults);
                        setShowDropdown(mappedResults.length > 0);
                    } else {
                        setPredictions([]);
                        setShowDropdown(false);
                    }
                });
            } else {
                setLoading(false);
                setPredictions([]);
                setShowDropdown(false);
            }
        });
    }, [sessionToken]);

    const debounceTimerRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        if (!value) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchPredictions(value);
        }, 300);
    };

    const handleSelectPrediction = (prediction) => {
        if (!placesService.current || !prediction.place_id) return;

        setLoading(true);
        setShowDropdown(false);
        if (inputRef.current) inputRef.current.value = prediction.description;

        placesService.current.getDetails({
            placeId: prediction.place_id,
            fields: ['geometry', 'formatted_address', 'name'],
            sessionToken
        }, (place, status) => {
            setLoading(false);
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                onPlaceSelected({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    name: place.name,
                    address: place.formatted_address,
                });
                // Refresh session token for the next trip
                setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
            }
        });
    };

    const setInputValue = useCallback((val) => {
        if (inputRef.current) inputRef.current.value = val;
    }, [inputRef]);

    useEffect(() => {
        if (onPlaceSelected && inputRef.current) {
            inputRef.current._setInputValue = setInputValue;
        }
    }, [onPlaceSelected, setInputValue, inputRef]);

    const colorMap = {
        primary: 'text-primary-400',
        emerald: 'text-emerald-400',
        white: 'text-white',
    };

    const renderInput = () => (
        <div className="flex-1 min-w-0 flex items-center gap-2 cursor-text" onClick={() => inputRef.current?.focus()}>
            <label className={`uppercase tracking-wider font-bold shrink-0 text-left ${compact ? 'text-[8px] w-8' : 'text-[10px] w-10'} ${accentColor === 'primary' ? 'text-primary-400' : 'text-neutral-500'}`}>
                {label}
            </label>
            <div className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    className={`w-full bg-transparent font-medium focus:outline-none text-white placeholder-neutral-600 min-w-0 py-1 ${compact ? 'text-xs' : 'text-sm'}`}
                    autoComplete="off"
                    onChange={handleInputChange}
                    onFocus={() => predictions.length > 0 && setShowDropdown(true)}
                />
            </div>
            {loading && <Loader2 className="w-3 h-3 text-primary-500 animate-spin shrink-0" />}
        </div>
    );

    return (
        <div className="relative">
            <div className={`${compact ? 'flex items-center gap-2 min-w-0 py-1' : 'bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700 flex items-center gap-2 min-w-0'}`}>
                <button
                    onClick={() => {
                        if (inputRef.current) {
                            inputRef.current.value = '';
                            inputRef.current.focus();
                        }
                        onPlaceSelected(null);
                        setPredictions([]);
                        setShowDropdown(false);
                    }}
                    className={`shrink-0 rounded-full hover:bg-neutral-700/50 transition-colors focus:outline-none focus:ring-1 focus:ring-primary-500/50 ${compact ? 'p-1 -m-1' : 'p-1.5 -m-1.5'}`}
                >
                    <MapPin className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${colorMap[accentColor] || 'text-white'}`} />
                </button>
                
                {renderInput()}

                {onUseCurrentLocation && (
                    <button
                        onClick={() => onUseCurrentLocation(setInputValue)}
                        disabled={locationLoading}
                        className={`shrink-0 p-1 rounded-md transition-colors group ${locationLoading ? 'animate-pulse' : 'hover:bg-neutral-700/50'}`}
                        title="Use current location"
                    >
                        <Crosshair className={`w-3.5 h-3.5 transition-colors ${locationLoading ? 'text-primary-400' : 'text-neutral-500 group-hover:text-primary-400'}`} />
                    </button>
                )}
            </div>

            {/* Dropdown Suggestions */}
            {showDropdown && (
                <div 
                    ref={dropdownRef}
                    className="absolute left-0 right-0 top-full mt-2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-[100] overflow-hidden max-h-[250px] overflow-y-auto backdrop-blur-xl bg-neutral-900/95"
                >
                    {predictions.map((p) => (
                        <button
                            key={p.place_id}
                            onClick={() => handleSelectPrediction(p)}
                            className="w-full text-left p-3 hover:bg-neutral-800 flex items-start gap-3 transition-colors border-b border-neutral-800 last:border-0 group"
                        >
                            <MapPin className="w-4 h-4 text-neutral-500 group-hover:text-primary-400 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white truncate group-hover:text-primary-400 transition-colors">
                                    {p.structured_formatting.main_text}
                                </div>
                                <div className="text-[10px] text-neutral-500 truncate font-medium">
                                    {p.structured_formatting.secondary_text}
                                </div>
                            </div>
                        </button>
                    ))}
                    <div className="p-2 bg-neutral-950/50 flex justify-end">
                        <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3_hdpi.png" alt="Google" className="h-2 opacity-50" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacesAutocomplete;

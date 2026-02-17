import React, { useRef, useEffect, useCallback } from 'react';
import { MapPin } from 'lucide-react';

const PlacesAutocomplete = ({ placeholder, onPlaceSelected, label, accentColor = 'white', compact = false }) => {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const onPlaceSelectedRef = useRef(onPlaceSelected);

    useEffect(() => {
        onPlaceSelectedRef.current = onPlaceSelected;
    }, [onPlaceSelected]);

    useEffect(() => {
        if (!window.google?.maps?.places || !inputRef.current || autocompleteRef.current) return;

        const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'et' },
            fields: ['geometry', 'formatted_address', 'name'],
        });

        ac.addListener('place_changed', () => {
            const place = ac.getPlace();
            if (place?.geometry?.location) {
                onPlaceSelectedRef.current({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    name: place.name,
                    address: place.formatted_address,
                });
            }
        });

        autocompleteRef.current = ac;

        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                autocompleteRef.current = null;
            }
        };
    }, []);

    const colorMap = {
        primary: 'text-primary-400',
        emerald: 'text-emerald-400',
        white: 'text-white',
    };

    if (compact) {
        return (
            <div className="flex items-center gap-2 min-w-0 py-1">
                <MapPin className={`w-3.5 h-3.5 shrink-0 ${colorMap[accentColor] || 'text-white'}`} />
                <div className="flex-1 min-w-0">
                    <label className={`text-[8px] uppercase tracking-wider font-bold block ${accentColor === 'primary' ? 'text-primary-400' : 'text-neutral-500'}`}>
                        {label}
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        className="w-full bg-transparent text-xs font-medium focus:outline-none text-white placeholder-neutral-600 min-w-0"
                        autoComplete="off"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
            <div className="flex items-center gap-2 min-w-0">
                <MapPin className={`w-4 h-4 shrink-0 ${colorMap[accentColor] || 'text-white'}`} />
                <div className="flex-1 min-w-0">
                    <label className={`text-[10px] uppercase tracking-wider font-bold block ${accentColor === 'primary' ? 'text-primary-400' : 'text-neutral-500'}`}>
                        {label}
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        className="w-full bg-transparent text-sm font-medium focus:outline-none text-white placeholder-neutral-600 min-w-0"
                        autoComplete="off"
                    />
                </div>
            </div>
        </div>
    );
};

export default PlacesAutocomplete;

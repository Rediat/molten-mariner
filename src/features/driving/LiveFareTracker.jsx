import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Play, Square, RotateCcw, Navigation, Clock, Gauge, MapPin, TrendingUp, Fuel, DollarSign, Timer, Zap, Car, ChevronDown, ChevronUp, Layers, Map, Sun, Moon } from 'lucide-react';

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

// Calculate heading between two points
const calculateHeading = (lat1, lon1, lat2, lon2) => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
    const x =
        Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
        Math.sin((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.cos(dLon);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
};

const WAIT_SPEED_THRESHOLD = 4; // km/h — below this is "waiting"
const MIN_ACCURACY = 40; // meters — tightened to reduce jitter
const MIN_DISTANCE = 0.002; // km (2m) — capture distance increments
const MIN_DISTANCE_PATH = 0.008; // km (8m) — reduced zigzag by plotting fewer points
const HEADING_SMOOTHING = 0.3; // smoothing factor for rotation
const MAX_STOPS = 5;

const nightStyles = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
];

const dayStyles = [
    { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
    { featureType: 'administrative.land_parcel', elementType: 'geometry.stroke', stylers: [{ color: '#dcd2be' }] },
    { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#ae9e90' }] },
    { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#93817a' }] },
    { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#447530' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
    { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#e98d58' }] },
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{ color: '#db8555' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#806b63' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'transit.line', elementType: 'labels.text.fill', stylers: [{ color: '#8f7d77' }] },
    { featureType: 'transit.line', elementType: 'labels.text.stroke', stylers: [{ color: '#ebe3cd' }] },
    { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#92998d' }] }
];

const LiveFareTracker = ({ isVisible, onClose, fareData, initialMapState, mapsReady }) => {
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
    const [showMap, setShowMap] = useState(initialMapState || false);
    const [isAutoCenter, setIsAutoCenter] = useState(true);
    const [isRotationEnabled, setIsRotationEnabled] = useState(true);
    
    // Day/Night Mode Logic
    const isNightTime = () => {
        const hour = new Date().getHours();
        return hour >= 18 || hour < 6;
    };
    const [mapTheme, setMapTheme] = useState(isNightTime() ? 'night' : 'day');

    // Refs for values that need to survive across watchPosition callbacks
    const lastPositionRef = useRef(null);
    const lastTimestampRef = useRef(null);
    const lastHeadingRef = useRef(0);
    const watchIdRef = useRef(null);
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const polylineRef = useRef(null);
    const markerRef = useRef(null);
    const pulseRef = useRef(null);
    const pathRef = useRef([]);
    const timerIdRef = useRef(null);
    const waitAccumulatorRef = useRef(0);
    const distanceAccumulatorRef = useRef(0);
    const startTimeRef = useRef(null);
    const elapsedAtPauseRef = useRef(0);
    const isWaitingRef = useRef(true); // start as waiting until first GPS movement detected
    const trackingStopIndexRef = useRef(null);
    const isAutoCenterRef = useRef(isAutoCenter);
    const isRotationEnabledRef = useRef(isRotationEnabled);
    const smoothedPositionRef = useRef(null);
    const lastPathPointRef = useRef(null);

    const STORAGE_KEY = 'molten_mariner_fare_tracker_state';

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

    // ---- Persistence: Hydrate state on mount ----
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.stops) setStops(parsed.stops);
                
                if (parsed.trackingStopIndex !== null && parsed.trackingStopIndex !== undefined) {
                    const index = parsed.trackingStopIndex;
                    setActiveStopIndex(index);
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

    // ---- Map Management ----
    useEffect(() => {
        if (showMap && mapsReady && mapContainerRef.current && !mapInstanceRef.current) {
            const mapOptions = {
                center: lastPositionRef.current ? 
                    { lat: lastPositionRef.current.lat, lng: lastPositionRef.current.lng } : 
                    { lat: 9.0333, lng: 38.7500 }, // Addis Ababa default
                zoom: 18,
                tilt: 45,
                heading: 0,
                mapId: undefined,
                mapTypeId: 'roadmap',
                disableDefaultUI: true,
                clickableIcons: false,
            };

            const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
            mapInstanceRef.current = map;

            // Register custom styled map types for day/night toggling
            const nightStyledMap = new window.google.maps.StyledMapType(nightStyles, { name: 'Night' });
            const dayStyledMap = new window.google.maps.StyledMapType(dayStyles, { name: 'Day' });
            map.mapTypes.set('night_mode', nightStyledMap);
            map.mapTypes.set('day_mode', dayStyledMap);
            map.setMapTypeId(mapTheme === 'night' ? 'night_mode' : 'day_mode');

            // Add Traffic Layer
            const trafficLayer = new window.google.maps.TrafficLayer();
            trafficLayer.setMap(map);

            // Create Polyline
            polylineRef.current = new window.google.maps.Polyline({
                path: pathRef.current,
                geodesic: true,
                strokeColor: '#0ea5e9',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                map: map
            });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current = null;
                polylineRef.current = null;
            }
        };
    }, [showMap, mapsReady]);

    const updateMap = useCallback((lat, lng, heading = null) => {
        const newPos = { lat, lng };
        
        if (mapInstanceRef.current && window.google) {
            // Update or Create Main Position Marker
            if (!markerRef.current && window.google) {
                const svgIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="#10b981" stroke="white" stroke-width="2" />
                    </svg>
                `)}`;

                const auraIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#10b981" opacity="0.2" stroke="#10b981" stroke-width="1" opacity="0.5" />
                    </svg>
                `)}`;

                markerRef.current = new window.google.maps.Marker({
                    position: newPos,
                    map: mapInstanceRef.current,
                    optimized: false,
                    zIndex: 1000,
                    icon: {
                        url: svgIcon,
                        scaledSize: new window.google.maps.Size(20, 20),
                        anchor: new window.google.maps.Point(10, 10)
                    }
                });

                pulseRef.current = new window.google.maps.Marker({
                    position: newPos,
                    map: mapInstanceRef.current,
                    optimized: false,
                    zIndex: 999,
                    icon: {
                        url: auraIcon,
                        scaledSize: new window.google.maps.Size(40, 40),
                        anchor: new window.google.maps.Point(20, 20)
                    }
                });
            } else if (markerRef.current) {
                markerRef.current.setPosition(newPos);
                if (pulseRef.current) pulseRef.current.setPosition(newPos);
            }

            // Sync Marker Visibility: Hide map markers if we are using the central CSS ball
            if (markerRef.current) markerRef.current.setVisible(!isAutoCenterRef.current);
            if (pulseRef.current) pulseRef.current.setVisible(!isAutoCenterRef.current);

            if (isAutoCenterRef.current) {
                mapInstanceRef.current.panTo(newPos);
            }
            
            // Handle Rotation/Tilt
            if (isRotationEnabledRef.current && heading !== null) {
                if (typeof mapInstanceRef.current.setHeading === 'function') {
                    mapInstanceRef.current.setHeading(heading);
                }
                if (typeof mapInstanceRef.current.setTilt === 'function') {
                    mapInstanceRef.current.setTilt(45);
                }
            } else if (!isRotationEnabledRef.current) {
                if (typeof mapInstanceRef.current.setHeading === 'function' && mapInstanceRef.current.getHeading() !== 0) {
                    mapInstanceRef.current.setHeading(0);
                }
                if (typeof mapInstanceRef.current.setTilt === 'function' && mapInstanceRef.current.getTilt() !== 0) {
                    mapInstanceRef.current.setTilt(0);
                }
            }
            
            if (polylineRef.current) {
                polylineRef.current.setPath(pathRef.current);
            }
        }
    }, []);

    // ---- Native Bridge: Interface for Android Foreground Service ----
    useEffect(() => {
        window.updateFareFromNative = (addedDistance, addedWaitSeconds, lat, lng) => {
            const idx = trackingStopIndexRef.current;
            if (idx === null || idx === undefined) return;
            
            setStops(prev => {
                const next = [...prev];
                const stop = next[idx];
                if (!stop) return prev;
                
                const newDist = stop.distance + addedDistance;
                const newWait = stop.waitTime + addedWaitSeconds;
                
                next[idx] = {
                    ...stop,
                    distance: newDist,
                    waitTime: newWait,
                    elapsedTime: (stop.elapsedTime || 0) + addedWaitSeconds,
                    fare: computeFare(newDist, newWait)
                };
                return next;
            });

            if (lat && lng) {
                const lastSmoothed = smoothedPositionRef.current;
                
                // 1. Smooth the Position
                let smoothedLat = lat;
                let smoothedLng = lng;
                if (lastSmoothed) {
                    const factor = 0.4; // native points are usually pre-filtered but we add extra layer
                    smoothedLat = lastSmoothed.lat + factor * (lat - lastSmoothed.lat);
                    smoothedLng = lastSmoothed.lng + factor * (lng - lastSmoothed.lng);
                }
                const smoothedPos = { lat: smoothedLat, lng: smoothedLng };
                smoothedPositionRef.current = smoothedPos;

                // 2. Smooth the Heading
                let heading = lastHeadingRef.current;
                if (lastPositionRef.current) {
                    const h = calculateHeading(lastPositionRef.current.lat, lastPositionRef.current.lng, lat, lng);
                    const diff = ((h - lastHeadingRef.current + 540) % 360) - 180;
                    heading = (lastHeadingRef.current + diff * HEADING_SMOOTHING + 360) % 360;
                    lastHeadingRef.current = heading;
                }
                
                lastPositionRef.current = { lat, lng };

                // 3. Path Decimation
                const distFromLastPath = lastPathPointRef.current ? 
                    haversineDistance(lastPathPointRef.current.lat, lastPathPointRef.current.lng, smoothedLat, smoothedLng) : 
                    Infinity;

                if (distFromLastPath >= MIN_DISTANCE_PATH || !lastPathPointRef.current) {
                    pathRef.current = [...pathRef.current, smoothedPos].slice(-500);
                    lastPathPointRef.current = smoothedPos;
                }

                updateMap(smoothedLat, smoothedLng, heading);
            }
        };

        return () => { delete window.updateFareFromNative; };
    }, [computeFare, updateMap]);

    // ---- Sync Settings to Refs and Trigger Map Updates ----
    useEffect(() => {
        isAutoCenterRef.current = isAutoCenter;
    }, [isAutoCenter]);

    useEffect(() => {
        isRotationEnabledRef.current = isRotationEnabled;
    }, [isRotationEnabled]);

    useEffect(() => {
        if (mapInstanceRef.current && lastPositionRef.current) {
            updateMap(
                lastPositionRef.current.lat, 
                lastPositionRef.current.lng, 
                lastHeadingRef.current
            );
        }
    }, [isAutoCenter, isRotationEnabled, updateMap]);

    // ---- Toggle Map Theme ----
    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setMapTypeId(mapTheme === 'night' ? 'night_mode' : 'day_mode');
        }
    }, [mapTheme]);


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
        const { latitude, longitude, accuracy, speed: gpsSpeed, heading: gpsHeading } = position.coords;
        const timestamp = position.timestamp;

        setGpsAccuracy(Math.round(accuracy));
        setPositionCount(c => c + 1);

        // Ignore low-accuracy fixes
        if (accuracy > MIN_ACCURACY) return;

        const lastPos = lastPositionRef.current;
        const lastSmoothed = smoothedPositionRef.current;
        const lastTime = lastTimestampRef.current;

        // 1. Smooth the Position (Low-Pass Filter)
        let smoothedLat = latitude;
        let smoothedLng = longitude;
        
        if (lastSmoothed) {
            // Stronger smoothing when stationary or low accuracy
            const factor = accuracy > 20 ? 0.2 : 0.4;
            smoothedLat = lastSmoothed.lat + factor * (latitude - lastSmoothed.lat);
            smoothedLng = lastSmoothed.lng + factor * (longitude - lastSmoothed.lng);
        }
        const smoothedPos = { lat: smoothedLat, lng: smoothedLng };
        smoothedPositionRef.current = smoothedPos;

        if (lastPos && lastTime) {
            const dist = haversineDistance(lastPos.lat, lastPos.lng, latitude, longitude);
            const timeDelta = (timestamp - lastTime) / 1000; // seconds

            let speedKmh = 0;
            if (gpsSpeed != null && gpsSpeed >= 0) {
                speedKmh = gpsSpeed * 3.6;
            } else if (timeDelta > 0) {
                speedKmh = (dist / timeDelta) * 3600;
            }
            
            // Apply simple speed smoothing to avoid sudden jumps
            setCurrentSpeed(prev => Math.round(prev * 0.7 + speedKmh * 0.3));

            isWaitingRef.current = speedKmh < WAIT_SPEED_THRESHOLD;

            // Update distance accumulation based on raw points for accuracy
            if (dist >= MIN_DISTANCE) {
                distanceAccumulatorRef.current += dist;
                updateActiveStop({ 
                    distance: distanceAccumulatorRef.current,
                    fare: computeFare(distanceAccumulatorRef.current, waitAccumulatorRef.current)
                });
                lastPositionRef.current = { lat: latitude, lng: longitude };
            }

            // 2. Smooth the Heading
            let heading = gpsHeading;
            if (heading === null || heading === undefined || isNaN(heading)) {
                if (dist > 0.003) { // Only calculate heading if moved at least 3m
                    heading = calculateHeading(lastSmoothed.lat, lastSmoothed.lng, smoothedLat, smoothedLng);
                } else {
                    heading = lastHeadingRef.current;
                }
            }

            // Only update rotation if moving significantly to avoid "wobble"
            if (speedKmh > 5) {
                const diff = ((heading - lastHeadingRef.current + 540) % 360) - 180;
                heading = (lastHeadingRef.current + diff * HEADING_SMOOTHING + 360) % 360;
                lastHeadingRef.current = heading;
            } else {
                heading = lastHeadingRef.current;
            }

            // 3. Path Decimation (Reduces ZigZag)
            const distFromLastPath = lastPathPointRef.current ? 
                haversineDistance(lastPathPointRef.current.lat, lastPathPointRef.current.lng, smoothedLat, smoothedLng) : 
                Infinity;

            if (distFromLastPath >= MIN_DISTANCE_PATH || !lastPathPointRef.current) {
                pathRef.current = [...pathRef.current, smoothedPos].slice(-500);
                lastPathPointRef.current = smoothedPos;
            }

            updateMap(smoothedLat, smoothedLng, heading);
        } else {
            // First valid point ever recorded
            const initialPos = { lat: latitude, lng: longitude };
            lastPositionRef.current = initialPos;
            smoothedPositionRef.current = initialPos;
            lastPathPointRef.current = initialPos;
            pathRef.current = [initialPos];
            
            const heading = gpsHeading || 0;
            lastHeadingRef.current = heading;
            updateMap(latitude, longitude, heading);
            
            if (gpsSpeed != null && gpsSpeed >= 0) {
                setCurrentSpeed(Math.round(gpsSpeed * 3.6));
            }
        }

        lastTimestampRef.current = timestamp;
    }, [computeFare, updateActiveStop, updateMap]);

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
        smoothedPositionRef.current = null;
        lastPathPointRef.current = null;
        pathRef.current = [];
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
            <div className="flex flex-col border-b border-neutral-800 shrink-0 min-h-[92px]">
                <div className="flex items-center gap-2 p-2">
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-xl shadow-lg text-neutral-400 hover:text-white transition-all hover:bg-neutral-800 active:scale-95 shrink-0"
                        title="Back to Calculator"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-0 text-left">
                        <h2 className="text-xs font-black text-white uppercase tracking-wider">Live Fare Tracker</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isTrackingAny ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'}`} />
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isTrackingAny ? 'text-emerald-400' : 'text-neutral-500'}`}>
                                {isTrackingAny ? 'Active' : 'Paused'} • {viewMode === 'total' ? 'Full Session' : `Stop ${activeStop.id}`}
                            </span>
                            {gpsAccuracy != null && isTrackingAny && (
                                <span className={`text-[7px] font-bold px-1 rounded-sm bg-neutral-800/60 border border-neutral-700/50 ${gpsAccuracy <= 15 ? 'text-emerald-400' : gpsAccuracy <= 30 ? 'text-amber-400' : 'text-rose-400'}`}>
                                    ±{gpsAccuracy}m
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => mapsReady && setShowMap(!showMap)}
                            className={`h-10 w-10 flex items-center justify-center border rounded-xl transition-all active:scale-95 ${
                                !mapsReady ? 'bg-neutral-800/20 border-neutral-800 text-neutral-600 blur-[0.5px] cursor-not-allowed opacity-50' :
                                showMap ? 'bg-primary-600 border-primary-500 text-white' : 'bg-neutral-800/40 border-neutral-700/50 text-neutral-400 hover:text-primary-400'
                            }`}
                            title={mapsReady ? "View Map Overlay" : "Map service unavailable"}
                            disabled={!mapsReady}
                        >
                            <Map className="w-4 h-4" />
                        </button>
                        <button
                            onClick={resetAll}
                            className="h-10 px-3 flex items-center justify-center gap-2 bg-neutral-800/40 border border-neutral-700/50 rounded-xl text-[9px] font-bold text-neutral-400 hover:text-rose-400 transition-all active:scale-95 uppercase tracking-wider"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2.5 pb-2">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 mr-2">
                    {stops.map((stop, idx) => (
                        <button
                            key={stop.id}
                            onClick={() => { setViewMode('individual'); setActiveStopIndex(idx); }}
                            className={`flex items-center gap-1 px-2 h-[24px] min-w-[55px] justify-center rounded-md border text-[9px] font-bold transition-all shrink-0 ${
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
                    {stops.length < MAX_STOPS && (
                        <button
                            onClick={addNextStop}
                            className={`flex items-center gap-1 px-2 h-[24px] min-w-[55px] justify-center rounded-md border border-neutral-700/50 bg-neutral-800/20 text-neutral-500 hover:text-primary-400 hover:border-primary-500/50 transition-all shrink-0 ${
                                isTrackingAny ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                        >
                            <Layers className="w-2.5 h-2.5" />
                            +
                        </button>
                    )}
                    </div>
                    <button
                        onClick={() => setViewMode('total')}
                        className={`flex items-center gap-1 px-2 h-[24px] min-w-[55px] justify-center rounded-md border text-[9px] font-bold transition-all shrink-0 ${
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
                <div className={`rounded-xl p-2 border transition-all duration-500 text-center shrink-0 ${
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
                <div className={`rounded-xl p-2.5 border transition-all duration-500 shrink-0 ${
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
                <div className="grid grid-cols-2 gap-2 shrink-0">
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
                <div className="grid grid-cols-2 gap-2 shrink-0">
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
                        <div className="bg-neutral-800/20 rounded-xl border border-neutral-700/30 overflow-hidden">
                            <button
                                onClick={() => setShowMarketComparison(!showMarketComparison)}
                                className={`w-full flex items-center justify-between p-2.5 hover:bg-neutral-800/40 transition-colors ${
                                    showMarketComparison ? 'bg-neutral-800/60 border-b border-neutral-700/50' : ''
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-3.5 h-3.5 text-neutral-500" />
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
                                    <div className="p-3 border-t border-neutral-700/50 space-y-2.5 bg-emerald-900/5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    Feres Estimate
                                                </p>
                                                <p className="text-[7px] text-neutral-500 font-bold uppercase tracking-tight">Value Choice</p>
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
            <div className="p-3 border-t border-neutral-800 space-y-2 shrink-0">
                {/* Unified Start Button */}
                {((viewMode === 'individual' && activeStop.status === 'idle') || (viewMode === 'total' && !isTrackingAny && stops.some(s => s.status === 'idle'))) && !isTrackingAny && (
                    <button
                        onClick={startTracking}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-base py-3 rounded-xl shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        <Play className="w-5 h-5" fill="currentColor" />
                        {viewMode === 'total' ? 'START TRACKING' : `Start Stop ${activeStop.id}`}
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
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-sm py-3 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                                <Layers className="w-4 h-4" />
                                Next
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Map Overlay View */}
            {showMap && (
                <div className="absolute inset-0 bg-neutral-950 z-[70] flex flex-col animate-in fade-in duration-300">
                    {/* Minimal Header */}
                    <div className="flex items-center justify-between p-4 bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 relative z-20">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setShowMap(false)}
                                className="h-10 w-10 flex items-center justify-center bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-400 hover:text-white transition-all active:scale-95"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex flex-col items-start text-left">
                                <h3 className="text-xs font-black text-white uppercase tracking-wider">Navigation Mode</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isTrackingAny ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isTrackingAny ? 'text-emerald-400' : 'text-neutral-500'}`}>
                                            {isTrackingAny ? 'Active Tracking' : 'Tracking Paused'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-70">
                            {/* Auto Center Toggle */}
                            <button 
                                onClick={() => setIsAutoCenter(prev => !prev)}
                                className={`w-8 h-8 flex items-center justify-center transition-all active:scale-90 ${
                                    isAutoCenter 
                                    ? 'text-primary-400/90 drop-shadow-[0_0_3px_rgba(14,165,233,0.4)]' 
                                    : 'text-neutral-500/60 hover:text-neutral-400'
                                }`}
                                title="Auto-Center Map"
                            >
                                <Zap className={`w-4 h-4 ${isAutoCenter ? 'fill-current' : ''}`} />
                            </button>

                            {/* Rotation Toggle */}
                            <button 
                                onClick={() => setIsRotationEnabled(prev => !prev)}
                                className={`w-8 h-8 flex items-center justify-center transition-all active:scale-90 ${
                                    isRotationEnabled 
                                    ? 'text-primary-400/90 drop-shadow-[0_0_3px_rgba(14,165,233,0.4)]' 
                                    : 'text-neutral-500/60 hover:text-neutral-400'
                                }`}
                                title="Map Rotation"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>

                            {/* Day/Night Toggle */}
                            <button 
                                onClick={() => setMapTheme(prev => prev === 'night' ? 'day' : 'night')}
                                className={`w-8 h-8 flex items-center justify-center transition-all active:scale-90 ${
                                    mapTheme === 'day'
                                    ? 'text-amber-400/90 drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]'
                                    : 'text-indigo-400/90 drop-shadow-[0_0_3px_rgba(129,140,248,0.4)]'
                                }`}
                                title={`Switch to ${mapTheme === 'night' ? 'Day' : 'Night'} Mode`}
                            >
                                {mapTheme === 'night' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                {/* Navigation View Area */}
                    <div className="flex-1 relative overflow-hidden bg-neutral-900 flex items-center justify-center">
                        {/* Real Google Map Container (Base Layer) */}
                        <div 
                            ref={mapContainerRef} 
                            className={`absolute inset-0 transition-opacity duration-700 ${mapsReady ? 'opacity-100' : 'opacity-50'} bg-neutral-900 [&_.gm-style-cc]:!hidden [&_button[title^="Keyboard"]]:!hidden [&_a]:!hidden`} 
                        />

                        {/* Blueprint Grid Overlay (Premium Design Layer) */}
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none z-[5]" />
                        
                        {/* Radar Pulse Effects */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="w-[400px] h-[400px] border border-primary-500/10 rounded-full animate-ping opacity-20" />
                            <div className="w-[200px] h-[200px] border border-primary-500/20 rounded-full animate-pulse opacity-40" />
                            <div className="w-[2px] h-full bg-primary-500/5 absolute" />
                            <div className="w-full h-[2px] bg-primary-500/5 absolute" />
                        </div>

                        {/* Initialising Overlay */}
                        {!mapsReady && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/40 backdrop-blur-[2px] z-10">
                                <div className="w-10 h-10 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-3" />
                                <p className="text-[8px] font-black text-primary-400 uppercase tracking-[0.3em] animate-pulse">Syncing GPS...</p>
                            </div>
                        )}

                        {/* Recenter Button (Appears when Free-Look is active) */}
                        {!isAutoCenter && (
                            <button 
                                onClick={() => {
                                    setIsAutoCenter(true);
                                    isAutoCenterRef.current = true;
                                    if (mapInstanceRef.current && lastPositionRef.current) {
                                        mapInstanceRef.current.panTo(lastPositionRef.current);
                                    }
                                }}
                                className="absolute top-4 right-4 z-40 bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.3)] animate-in slide-in-from-right-4"
                            >
                                Recenter Map
                            </button>
                        )}

                        {/* Center Focus Visual (Pulsing Green Ball - Only when Auto-Center is active) */}
                        {isAutoCenter && mapsReady && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                <div className="relative">
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.9)] border-2 border-white ring-4 ring-emerald-500/20" />
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40" />
                                </div>
                            </div>
                        )}

                        {/* Top Left Stats Overlay */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-30">
                            <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-w-[100px]">
                                <p className="text-[7px] font-black text-primary-500 uppercase tracking-widest mb-0.5">Live Speed</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-white font-mono">{currentSpeed}</span>
                                    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">km/h</span>
                                </div>
                            </div>
                            <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-w-[100px]">
                                <p className="text-[7px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Trip Distance</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white font-mono">{displayData.distance.toFixed(2)}</span>
                                    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">km</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Floating Stats */}
                        <div className="absolute bottom-2 left-3 right-3 flex flex-col gap-1.5 z-30">
                            <div className="bg-neutral-900/95 backdrop-blur-2xl border border-neutral-700/50 rounded-xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-between overflow-hidden relative">
                                <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${isTrackingAny ? 'bg-emerald-500' : 'bg-neutral-700'}`} />
                                
                                <div className="flex items-center gap-3">
                                    {/* Integrated Tracking Button */}
                                    <button 
                                        onClick={isTrackingAny ? stopTracking : startTracking}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-90 shadow-lg ${
                                            isTrackingAny 
                                            ? 'bg-rose-600/20 text-rose-500 shadow-rose-900/20' 
                                            : 'bg-emerald-600/20 text-emerald-500 shadow-emerald-900/20'
                                        }`}
                                    >
                                        {isTrackingAny ? <Square className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
                                    </button>

                                    <div className="flex flex-col">
                                        <p className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-0.5">Running Fare</p>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-2xl font-black text-white leading-none tracking-tight">{formatNum(displayData.fare)}</span>
                                            <span className="text-[10px] font-bold text-neutral-500 uppercase">ETB</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Wait Time</p>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                        <Timer className="w-3 h-3 text-amber-400" />
                                        <span className="text-sm font-black text-amber-400 font-mono leading-none">{formatTime(Math.round(displayData.waitTime))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveFareTracker;

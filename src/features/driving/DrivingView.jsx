import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Info, Loader2, ArrowLeft, ExternalLink, MessageSquare } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

const DrivingView = ({ onClose, fareData }) => {
    const {
        origin, destination,
        setDistanceKm, setDurationValue, setDurationText, setRouteVersion,
        cachedRoutesData, setCachedRoutesData,
        cachedActiveRouteIndex, setCachedActiveRouteIndex,
        cachedCoordsKey, setCachedCoordsKey
    } = useTransport();
    const mapRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const polylinesRef = useRef([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSteps, setShowSteps] = useState(false);

    // Initialize Map and DirectionsRenderer
    useEffect(() => {
        if (!window.google?.maps || !mapRef.current || mapInstance) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 9.03, lng: 38.74 }, // Addis Ababa default
            zoom: 12,
            disableDefaultUI: true, // cleaner interface
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            styles: [
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "all",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#000000" }, { lightness: 13 }]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#000000" }]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }]
                },
                {
                    featureType: "landscape",
                    elementType: "all",
                    stylers: [{ color: "#08304b" }]
                },
                {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [{ color: "#0c4152" }, { lightness: 5 }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#000000" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#0b434f" }, { lightness: 25 }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#000000" }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#0b3d51" }, { lightness: 16 }]
                },
                {
                    featureType: "road.local",
                    elementType: "geometry",
                    stylers: [{ color: "#000000" }]
                },
                {
                    featureType: "transit",
                    elementType: "all",
                    stylers: [{ color: "#146474" }]
                },
                {
                    featureType: "water",
                    elementType: "all",
                    stylers: [{ color: "#021019" }]
                }
            ]
        });
        setMapInstance(map);
    }, [mapInstance, origin, destination]);

    // Fetch Directions when Origin or Destination changes
    useEffect(() => {
        if (!mapInstance || !window.google?.maps) return;

        if (!origin || !destination) {
            polylinesRef.current.forEach(p => p.setMap(null));
            polylinesRef.current = [];
            setCachedRoutesData([]);
            setCachedActiveRouteIndex(0);
            setRouteInfo(null);
            setError(null);
            return;
        }

        // Check if we already have cached routes for these exact coordinates
        const coordsKey = `${origin.lat},${origin.lng}-${destination.lat},${destination.lng}`;
        if (cachedRoutesData.length > 0 && cachedCoordsKey === coordsKey) {
            return;
        }

        // New route requested — clear stale data
        setRouteInfo(null);
        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];

        const fetchRoute = async () => {
            setLoading(true);
            setError(null);

            try {
                // Determine if we use local proxy or direct API based on environment
                const devKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                const endpoint = (devKey && devKey !== 'YOUR_API_KEY_HERE')
                    ? 'https://routes.googleapis.com/directions/v2:computeRoutes'
                    : '/api/routes';

                const headers = {
                    'Content-Type': 'application/json',
                    'x-goog-fieldmask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs,routes.travelAdvisory,routes.routeLabels'
                };

                if (endpoint.startsWith('https://')) {
                    headers['X-Goog-Api-Key'] = devKey;
                }

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
                        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
                        travelMode: 'DRIVE',
                        routingPreference: 'TRAFFIC_AWARE',
                        computeAlternativeRoutes: true,
                        extraComputations: ['TRAFFIC_ON_POLYLINE'],
                        languageCode: 'en-US',
                        units: 'METRIC',
                    })
                });

                if (!response.ok) {
                    let errMsg = response.statusText;
                    try {
                        const errData = await response.json();
                        if (errData.error?.message) errMsg = errData.error.message;
                        else if (typeof errData.error === 'string') errMsg = errData.error;
                    } catch (e) {
                        // Not JSON
                    }
                    throw new Error(errMsg ? `Failed: ${errMsg}` : 'Route request failed');
                }

                const data = await response.json();

                if (!data.routes || data.routes.length === 0) {
                    throw new Error('No route found');
                }

                setCachedRoutesData(data.routes);
                setCachedActiveRouteIndex(0);
                setCachedCoordsKey(coordsKey);

            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to calculate route');
                polylinesRef.current.forEach(p => p.setMap(null));
                polylinesRef.current = [];
                setCachedRoutesData([]);
                setCachedActiveRouteIndex(0);
                setRouteInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [origin, destination, mapInstance]);

    // Draw polylines and update route info when cachedRoutesData or cachedActiveRouteIndex changes
    useEffect(() => {
        if (!mapInstance || !window.google?.maps || cachedRoutesData.length === 0 || !origin || !destination) return;

        // Clear existing polylines
        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();

        // Helper to get traffic color
        const getTrafficColor = (speed) => {
            if (speed === 'NORMAL') return '#0ea5e9'; // Blue primary-500
            if (speed === 'SLOW') return '#eab308'; // Yellow
            if (speed === 'TRAFFIC_JAM') return '#ef4444'; // Red
            return '#0ea5e9'; // Default blue
        };

        // Draw alternative routes first (so they are underneath)
        cachedRoutesData.forEach((route, index) => {
            if (index === cachedActiveRouteIndex) return; // Draw active route last

            if (route.polyline?.encodedPolyline) {
                const path = window.google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);

                const poly = new window.google.maps.Polyline({
                    path,
                    strokeColor: '#737373', // neutral-500
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                    map: mapInstance,
                    zIndex: 1,
                    clickable: true
                });

                // Listen for clicks on alternative routes
                poly.addListener('click', () => {
                    setCachedActiveRouteIndex(index);
                });

                polylinesRef.current.push(poly);

                if (index === 0) { // Keep bounds around the primary route
                    path.forEach(p => bounds.extend(p));
                }
            }
        });

        // Draw active route
        const activeRoute = cachedRoutesData[cachedActiveRouteIndex];
        if (activeRoute?.polyline?.encodedPolyline) {
            const path = window.google.maps.geometry.encoding.decodePath(activeRoute.polyline.encodedPolyline);
            const intervals = activeRoute.travelAdvisory?.speedReadingIntervals || [];

            if (intervals.length > 0) {
                // Draw multicolored polyline segments based on traffic
                intervals.forEach((interval) => {
                    const startIdx = interval.startPolylinePointIndex || 0;
                    const endIdx = interval.endPolylinePointIndex || path.length - 1;
                    const segmentPath = path.slice(startIdx, endIdx + 1);

                    const poly = new window.google.maps.Polyline({
                        path: segmentPath,
                        strokeColor: getTrafficColor(interval.speed),
                        strokeOpacity: 1.0,
                        strokeWeight: 6,
                        map: mapInstance,
                        zIndex: 10
                    });
                    polylinesRef.current.push(poly);
                });
            } else {
                // Fallback to solid line if no traffic info
                const poly = new window.google.maps.Polyline({
                    path,
                    strokeColor: '#0ea5e9',
                    strokeOpacity: 1.0,
                    strokeWeight: 6,
                    map: mapInstance,
                    zIndex: 10
                });
                polylinesRef.current.push(poly);
            }

            // Fit bounds to the active route
            const activeBounds = new window.google.maps.LatLngBounds();
            path.forEach(p => activeBounds.extend(p));
            mapInstance.fitBounds(activeBounds);
        }

        // Update Route Info for the active route
        if (activeRoute && activeRoute.legs && activeRoute.legs.length > 0) {
            const leg = activeRoute.legs[0];
            const formattedSteps = leg.steps ? leg.steps.map(step => ({
                instructions: step.navigationInstruction?.instructions || 'Continue',
                distance: { text: `${(step.distanceMeters || 0) < 1000 ? step.distanceMeters + ' m' : (step.distanceMeters / 1000).toFixed(1) + ' km'}` },
                duration: { text: step.staticDuration ? `${Math.ceil(parseInt(step.staticDuration) / 60)} min` : '' }
            })) : [];

            const durationSecs = activeRoute.duration ? parseInt(activeRoute.duration) : 0;
            const distanceKms = parseFloat((activeRoute.distanceMeters / 1000).toFixed(2));
            const durationMins = Math.ceil(durationSecs / 60);

            setRouteInfo({
                distance: `${distanceKms} km`,
                duration: `${durationMins} mins`,
                startAddress: origin.name,
                endAddress: destination.name,
                steps: formattedSteps,
            });

            setDistanceKm(distanceKms);
            setDurationValue(durationSecs / 60);
            setDurationText(`${durationMins} mins`);
            setRouteVersion(v => v + 1);
        }

    }, [cachedRoutesData, cachedActiveRouteIndex, mapInstance, origin, destination, setDistanceKm, setDurationValue, setDurationText, setRouteVersion]);

    const hasRoute = origin && destination;

    return (
        <div className="flex flex-col h-full bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden relative shadow-xl">
            {/* No Route Selected overlay */}
            {!hasRoute && (
                <div className="absolute inset-0 z-40 bg-neutral-900 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                    <Navigation className="w-16 h-16 text-neutral-700 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Route Selected</h2>
                    <p className="text-sm text-neutral-400">
                        Select an Origin and Destination to view the driving route here.
                    </p>
                </div>
            )}

            {/* Top Bar overlay */}
            {hasRoute && (
                <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-neutral-900/90 to-transparent pointer-events-none">
                    <div className="flex gap-2 items-start pointer-events-auto max-w-[95%]">
                        <button
                            onClick={onClose}
                            className="p-3.5 bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-xl shadow-lg text-neutral-400 hover:text-white transition-all hover:bg-neutral-800 shrink-0"
                            title="Back to Calculator"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 p-2.5 rounded-xl shadow-lg flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                                <span className="text-xs font-bold text-white truncate">{origin?.name || 'Origin'}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-1 border-l-2 border-dashed border-neutral-700 pl-3 py-1 my-0.5">
                                <span className="text-[10px] text-neutral-400 font-medium tracking-wider flex flex-col">
                                    <span>{error ? 'Route Unavailable' : (routeInfo ? `${routeInfo.distance} • ${routeInfo.duration}` : 'Calculating...')}</span>
                                    {routeInfo && cachedRoutesData.length > 1 && (
                                        <span className="text-[9px] text-neutral-500 mt-0.5 italic">Tap grey lines for alternative routes</span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                                <span className="text-xs font-bold text-white truncate">{destination?.name || 'Destination'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Container - always rendered so mapRef stays in the DOM */}
            <div className="flex-1 relative">
                <div ref={mapRef} className="absolute inset-0 w-full h-full" />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm z-20">
                        <div className="bg-neutral-800 p-4 rounded-xl flex items-center gap-3 border border-neutral-700 shadow-xl">
                            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                            <span className="text-sm font-bold text-white tracking-wide">Loading Route...</span>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-900/90 text-rose-200 px-4 py-3 rounded-xl text-xs font-bold z-20 shadow-xl border border-rose-500/50 flex flex-col items-center max-w-[80%] text-center gap-2">
                        <Info className="w-5 h-5" />
                        {error}
                    </div>
                )}
            </div>

            {/* Bottom Sheet – Navigate + Turn-by-turn */}
            {routeInfo && (
                <div className={`absolute bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 transition-all duration-300 ease-in-out z-30 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${showSteps ? 'h-[45%]' : 'h-14'}`}>
                    <div className="flex items-center gap-2 p-2.5 shrink-0">
                        {/* Google Maps Navigate button */}
                        <button
                            onClick={() => {
                                if (!origin || !destination) return;
                                const params = `origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving&dir_action=navigate`;
                                const webUrl = `https://www.google.com/maps/dir/?api=1&${params}`;
                                const isAndroid = /android/i.test(navigator.userAgent);
                                if (isAndroid) {
                                    const intentUrl = `intent://maps.google.com/maps/dir/?api=1&${params}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
                                    window.location.href = intentUrl;
                                } else {
                                    window.open(webUrl, '_blank');
                                }
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-primary-600/30 to-primary-500/20 hover:from-primary-600/50 hover:to-primary-500/35 text-primary-400 font-bold text-xs py-2 px-3 rounded-lg transition-all border border-primary-500/40 active:scale-[0.97] shrink-0"
                            title="Open in Google Maps app"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Navigate</span>
                        </button>

                        {/* Divider */}
                        <div className="w-px h-7 bg-neutral-700/60 shrink-0" />

                        {/* SMS Trip Details button */}
                        <button
                            onClick={() => {
                                const fare = fareData?.totalToCharge != null
                                    ? fareData.totalToCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    : 'N/A';
                                const distance = routeInfo?.distance || 'N/A';
                                const duration = routeInfo?.duration || 'N/A';
                                const body = `Hello Our Service User, your trip details are as follows:\nFare: ${fare}\nDistance: ${distance}\nEstimated Time: ${duration}\nYou can pay via TeleBirr, CBE, or Cash.\nThank you for riding with us and have a safe trip! 🚗`;

                                // Detect restricted environments that block sms: URI scheme
                                const isTelegram = !!window.Telegram?.WebApp;
                                const ua = navigator.userAgent || '';
                                const isWebView = /wv|; wv\)|WebView/i.test(ua) || (ua.includes('Android') && !ua.includes('Chrome/'));

                                if (isTelegram || isWebView) {
                                    // Clipboard fallback — use execCommand for WebView compatibility
                                    const textArea = document.createElement('textarea');
                                    textArea.value = body;
                                    textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();
                                    let copied = false;
                                    try { copied = document.execCommand('copy'); } catch (e) { /* ignore */ }
                                    document.body.removeChild(textArea);
                                    if (!copied && navigator.clipboard) {
                                        navigator.clipboard.writeText(body).catch(() => { });
                                    }
                                    alert('📋 Message copied to clipboard!\nOpen your SMS app and paste it to send.');
                                } else {
                                    // Standard browser — use sms: URI directly
                                    window.location.href = `sms:?body=${encodeURIComponent(body)}`;
                                }
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 hover:from-emerald-600/50 hover:to-emerald-500/35 text-emerald-400 font-bold text-xs py-2 px-3 rounded-lg transition-all border border-emerald-500/40 active:scale-[0.97] shrink-0"
                            title="Send trip details via SMS"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>SMS</span>
                        </button>

                        {/* Divider */}
                        <div className="w-px h-7 bg-neutral-700/60 shrink-0" />

                        {/* Turn-by-turn toggle */}
                        <div
                            className="flex-1 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 rounded-lg px-2 py-1.5 transition-colors"
                            onClick={() => setShowSteps(!showSteps)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-primary-500/20 p-1 rounded-md border border-primary-500/30">
                                    <Navigation className="w-3 h-3 text-primary-400" />
                                </div>
                                <span className="text-xs font-bold text-white">Steps</span>
                            </div>
                            <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-800 px-1.5 py-0.5 rounded">
                                {showSteps ? 'Hide' : 'Show'}
                            </div>
                        </div>
                    </div>

                    {showSteps && (
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {routeInfo.steps.map((step, index) => (
                                <div key={index} className="flex gap-3 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-[10px] font-bold text-neutral-400 group-hover:bg-primary-500/20 group-hover:text-primary-400 group-hover:border-primary-500/50 transition-colors shrink-0">
                                            {index + 1}
                                        </div>
                                        {index < routeInfo.steps.length - 1 && (
                                            <div className="w-0.5 h-full bg-neutral-800 my-1 group-hover:bg-neutral-700 transition-colors" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div
                                            className="text-xs text-neutral-300 leading-relaxed font-medium [&>b]:text-white [&>b]:font-black"
                                            dangerouslySetInnerHTML={{ __html: step.instructions }}
                                        />
                                        <div className="text-[10px] font-bold text-neutral-500 tracking-wider mt-1.5 bg-neutral-800/50 inline-block px-1.5 py-0.5 rounded">
                                            {step.distance.text} • {step.duration.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-3">
                                <MapPin className="w-6 h-6 p-1 text-rose-500 shrink-0" />
                                <div className="text-xs font-bold text-white pt-1">
                                    Arrive at {destination?.name || 'Destination'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DrivingView;

import React, { createContext, useContext, useState } from 'react';

const TransportContext = createContext();

export const TransportProvider = ({ children }) => {
    // Shared state for the transportation workflow (Ride -> Driving)
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [distanceKm, setDistanceKm] = useState(null);
    const [durationText, setDurationText] = useState(null);
    const [durationValue, setDurationValue] = useState(null);

    // Helpers to clear or bulk-update context easily
    const clearTransportState = () => {
        setOrigin(null);
        setDestination(null);
        setDistanceKm(null);
        setDurationText(null);
        setDurationValue(null);
    };

    return (
        <TransportContext.Provider value={{
            origin, setOrigin,
            destination, setDestination,
            distanceKm, setDistanceKm,
            durationText, setDurationText,
            durationValue, setDurationValue,
            clearTransportState
        }}>
            {children}
        </TransportContext.Provider>
    );
};

export const useTransport = () => {
    const context = useContext(TransportContext);
    if (!context) {
        throw new Error('useTransport must be used within a TransportProvider');
    }
    return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

// Increment this version when deploying updates that require clearing localStorage
const APP_VERSION = '1.0.0';
const VERSION_KEY = 'molten-mariner-version';
const STORAGE_KEY = 'molten-mariner-settings';

// Check and clear localStorage if version changed
const storedVersion = localStorage.getItem(VERSION_KEY);
if (storedVersion !== APP_VERSION) {
    localStorage.clear();
    localStorage.setItem(VERSION_KEY, APP_VERSION);
}

const DEFAULT_SETTINGS = {
    showTVM: true,
    showLoan: true,
    showFlow: false,
    showBond: false,
    showRates: true,
    showTBill: true,
    showPension: true,
    showGoal: true,
    showHistory: false,
    tabOrder: ['tvm', 'goal', 'loan', 'pension', 'tbill', 'rates', 'history', 'flow', 'bond'],
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

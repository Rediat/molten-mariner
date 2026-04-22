import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

// Build timestamp is automatically injected by Vite at build time
// This ensures localStorage is cleared with every new deployment
/* global __BUILD_TIMESTAMP__ */
const APP_VERSION = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : 'dev';
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
    showInflation: false,
    showGoal: true,
    showTransport: false,
    showHistory: false,
    showFxCompare: true,
    tabOrder: ['tvm', 'goal', 'loan', 'pension', 'inflation', 'tbill', 'fxcompare', 'transport', 'flow', 'bond', 'rates', 'history'],
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return DEFAULT_SETTINGS;
            
            const parsed = JSON.parse(stored);
            const merged = { ...DEFAULT_SETTINGS, ...parsed };
            
            // Ensure fxcompare is in tabOrder if it's missing (migration)
            if (merged.tabOrder && !merged.tabOrder.includes('fxcompare')) {
                const tbillIndex = merged.tabOrder.indexOf('tbill');
                if (tbillIndex !== -1) {
                    merged.tabOrder.splice(tbillIndex + 1, 0, 'fxcompare');
                } else {
                    merged.tabOrder.push('fxcompare');
                }
            }
            
            return merged;
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

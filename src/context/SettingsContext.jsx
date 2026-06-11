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
    showTBill: false,
    showPension: false,
    showTax: true,
    showInflation: false,
    showGoal: false,
    showTransport: false,
    showHistory: false,
    showFxCompare: true,
    showTimeZone: true,
    tabOrder: ['tvm', 'goal', 'loan', 'tax', 'pension', 'tbill', 'fxcompare', 'inflation', 'transport', 'flow', 'bond', 'timezone', 'rates', 'history'],
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return DEFAULT_SETTINGS;
            
            const parsed = JSON.parse(stored);
            const merged = { ...DEFAULT_SETTINGS, ...parsed };
            
            // Ensure tbill is in tabOrder if it's missing (migration)
            if (merged.tabOrder && !merged.tabOrder.includes('tbill')) {
                const fxIndex = merged.tabOrder.indexOf('fxcompare');
                if (fxIndex !== -1) {
                    merged.tabOrder.splice(fxIndex, 0, 'tbill');
                } else {
                    const historyIndex = merged.tabOrder.indexOf('history');
                    if (historyIndex !== -1) {
                        merged.tabOrder.splice(historyIndex, 0, 'tbill');
                    } else {
                        merged.tabOrder.push('tbill');
                    }
                }
            }

            // Ensure fxcompare is in tabOrder if it's missing (migration)
            if (merged.tabOrder && !merged.tabOrder.includes('fxcompare')) {
                const tbillIndex = merged.tabOrder.indexOf('tbill');
                if (tbillIndex !== -1) {
                    merged.tabOrder.splice(tbillIndex + 1, 0, 'fxcompare');
                } else {
                    merged.tabOrder.push('fxcompare');
                }
            }

            // Ensure goal is in tabOrder if it's missing (migration)
            if (merged.tabOrder && !merged.tabOrder.includes('goal')) {
                const tvmIndex = merged.tabOrder.indexOf('tvm');
                if (tvmIndex !== -1) {
                    merged.tabOrder.splice(tvmIndex + 1, 0, 'goal');
                } else {
                    const historyIndex = merged.tabOrder.indexOf('history');
                    if (historyIndex !== -1) {
                        merged.tabOrder.splice(historyIndex, 0, 'goal');
                    } else {
                        merged.tabOrder.push('goal');
                    }
                }
            }

            // Ensure timezone is in tabOrder if it's missing (migration)
            if (merged.tabOrder && !merged.tabOrder.includes('timezone')) {
                const ratesIndex = merged.tabOrder.indexOf('rates');
                if (ratesIndex !== -1) {
                    merged.tabOrder.splice(ratesIndex, 0, 'timezone');
                } else {
                    merged.tabOrder.push('timezone');
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

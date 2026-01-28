import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('fincalc_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('fincalc_history', JSON.stringify(history));
    }, [history]);

    const addToHistory = (module, inputs, result) => {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            module,
            inputs,
            result
        };
        setHistory(prev => [entry, ...prev]);
    };

    const clearHistory = () => setHistory([]);

    const clearModuleHistory = (module) => {
        setHistory(prev => prev.filter(item =>
            item.module.toUpperCase() !== module.toUpperCase()
        ));
    };

    return (
        <HistoryContext.Provider value={{ history, addToHistory, clearHistory, clearModuleHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};

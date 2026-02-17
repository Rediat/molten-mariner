import React, { useState } from 'react';
import { Calculator, DollarSign, Activity, FileText, History, Percent, Target, HelpCircle, X, Receipt, Wallet, TrendingUp, Car } from 'lucide-react';
import HelpGuide from '../features/help/HelpGuide';
import { useSettings } from '../context/SettingsContext';

const Layout = ({ children, activeTab, onTabChange, showHelp, onCloseHelp }) => {
    const { settings } = useSettings();

    const allNavItems = [
        { id: 'tvm', label: 'TVM', icon: Calculator, settingKey: 'showTVM' },
        { id: 'goal', label: 'GOAL', icon: Target, settingKey: 'showGoal' },
        { id: 'loan', label: 'LOAN', icon: DollarSign, settingKey: 'showLoan' },
        { id: 'pension', label: 'PENSION', icon: Wallet, settingKey: 'showPension' },
        { id: 'transport', label: 'RIDE', icon: Car, settingKey: 'showTransport' },
        { id: 'flow', label: 'FLOW', icon: Activity, settingKey: 'showFlow' },
        { id: 'bond', label: 'BOND', icon: FileText, settingKey: 'showBond' },
        { id: 'rates', label: 'RATES', icon: Percent, settingKey: 'showRates' },
        { id: 'tbill', label: 'T-BILL', icon: Receipt, settingKey: 'showTBill' },
        { id: 'inflation', label: 'INFL', icon: TrendingUp, settingKey: 'showInflation' },
        { id: 'history', label: 'HISTORY', icon: History, settingKey: 'showHistory' },
    ];

    // Get tab order from settings
    const tabOrder = settings.tabOrder || ['tvm', 'goal', 'loan', 'flow', 'bond', 'rates', 'tbill', 'history'];

    // Filter nav items based on settings and sort by tabOrder
    // History tab is always placed at the far right (last position)
    const navItems = allNavItems
        .filter(item => settings[item.settingKey])
        .filter(item => item.id !== 'history') // Exclude history from normal sorting
        .sort((a, b) => tabOrder.indexOf(a.id) - tabOrder.indexOf(b.id));

    // Always append History at the end if it's visible
    const historyItem = allNavItems.find(item => item.id === 'history');
    if (historyItem && settings[historyItem.settingKey]) {
        navItems.push(historyItem);
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden border border-neutral-700 flex flex-col h-[800px] relative">

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {children}
                </div>

                {/* Bottom Navigation */}
                <div className="bg-neutral-900 border-t border-neutral-700 p-2">
                    <div className="flex justify-between items-center px-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${activeTab === item.id
                                    ? 'text-primary-500'
                                    : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                            >
                                <item.icon size={20} strokeWidth={2.5} />
                                <span className="text-[10px] font-bold mt-1 tracking-wider">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Help Overlay */}
                {showHelp && (
                    <div className="absolute inset-0 bg-[#1a1a1a] z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-neutral-700 flex justify-between items-center bg-neutral-900">
                            <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <HelpCircle size={18} className="text-primary-500" />
                                Help Guide
                            </h3>
                            <button
                                onClick={onCloseHelp}
                                className="p-1.5 hover:bg-neutral-700 rounded-full transition-colors"
                            >
                                <X size={18} className="text-neutral-400 hover:text-white" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                            <HelpGuide activeTab={activeTab} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;

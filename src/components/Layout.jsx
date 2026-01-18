import React, { useState } from 'react';
import { Calculator, DollarSign, Activity, FileText, History, Percent, Target, HelpCircle, X } from 'lucide-react';
import HelpGuide from '../features/help/HelpGuide';

const Layout = ({ children, activeTab, onTabChange }) => {
    const [showHelp, setShowHelp] = useState(false);

    const navItems = [
        { id: 'tvm', label: 'TVM', icon: Calculator },
        { id: 'goal', label: 'GOAL', icon: Target },
        { id: 'loan', label: 'LOAN', icon: DollarSign },
        { id: 'flow', label: 'FLOW', icon: Activity },
        { id: 'bond', label: 'BOND', icon: FileText },
        { id: 'rates', label: 'RATES', icon: Percent },
        { id: 'history', label: 'HISTORY', icon: History },
    ];

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden border border-neutral-700 flex flex-col h-[800px] relative">
                {/* Help Icon - Fixed Position */}
                <button
                    onClick={() => setShowHelp(true)}
                    className="absolute top-4 right-4 z-40 p-2 bg-neutral-700/80 hover:bg-neutral-600 rounded-full transition-all text-neutral-400 hover:text-white"
                    title="Help Guide"
                >
                    <HelpCircle size={18} />
                </button>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6 pr-16 scrollbar-hide">
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
                                onClick={() => setShowHelp(false)}
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

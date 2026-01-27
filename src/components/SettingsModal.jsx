import React from 'react';
import { X, Activity, FileText, Percent, History, Receipt } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SettingsModal = ({ isOpen, onClose }) => {
    const { settings, updateSetting } = useSettings();

    if (!isOpen) return null;

    const toggleItems = [
        { key: 'showFlow', label: 'Cash Flow', icon: Activity },
        { key: 'showBond', label: 'Bond', icon: FileText },
        { key: 'showRates', label: 'Rate Converter', icon: Percent },
        { key: 'showTBill', label: 'T-Bill', icon: Receipt },
        { key: 'showHistory', label: 'History', icon: History },
    ];

    return (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-neutral-800 rounded-2xl border border-neutral-700 w-[90%] max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">Settings</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-neutral-700 rounded-full transition-colors"
                    >
                        <X size={18} className="text-neutral-400 hover:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">
                        Visible Tabs
                    </p>
                    {toggleItems.map(item => (
                        <div
                            key={item.key}
                            className="flex items-center justify-between bg-neutral-900/50 rounded-xl p-3 border border-neutral-700/50"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className="text-neutral-400" />
                                <span className="text-sm font-medium text-white">{item.label}</span>
                            </div>
                            <button
                                onClick={() => updateSetting(item.key, !settings[item.key])}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${settings[item.key]
                                    ? 'bg-primary-600'
                                    : 'bg-neutral-700'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-700">
                    <p className="text-[10px] text-neutral-500 text-center">
                        Toggle tabs on/off to customize your navigation
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

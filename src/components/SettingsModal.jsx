import React from 'react';
import { X, Activity, FileText, Percent, History, Receipt, Calculator, CreditCard, Target, ChevronUp, ChevronDown, Wallet } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const MIN_TABS = 5;
const MAX_TABS = 7;

const TAB_CONFIG = {
    tvm: { key: 'showTVM', label: 'TVM', icon: Calculator },
    loan: { key: 'showLoan', label: 'Loan', icon: CreditCard },
    pension: { key: 'showPension', label: 'Pension', icon: Wallet },
    flow: { key: 'showFlow', label: 'Cash Flow', icon: Activity },
    bond: { key: 'showBond', label: 'Bond', icon: FileText },
    rates: { key: 'showRates', label: 'Rate Converter', icon: Percent },
    tbill: { key: 'showTBill', label: 'T-Bill', icon: Receipt },
    goal: { key: 'showGoal', label: 'Goal Planner', icon: Target },
    history: { key: 'showHistory', label: 'History', icon: History },
};

const SettingsModal = ({ isOpen, onClose }) => {
    const { settings, updateSetting } = useSettings();

    if (!isOpen) return null;

    // Get ordered items based on tabOrder, with history always at the bottom
    const tabOrder = settings.tabOrder || ['tvm', 'goal', 'loan', 'pension', 'flow', 'bond', 'rates', 'tbill', 'history'];
    const orderedItems = tabOrder
        .filter(id => id !== 'history') // Exclude history from normal order
        .map(id => ({ id, ...TAB_CONFIG[id] }));
    // Always append history at the end
    orderedItems.push({ id: 'history', ...TAB_CONFIG['history'] });

    const enabledCount = orderedItems.filter(item => settings[item.key]).length;

    const handleToggle = (key, currentValue) => {
        if (currentValue) {
            // Turning off - check if we're at minimum
            if (enabledCount <= MIN_TABS) {
                // Can't turn off, already at minimum
                return;
            }
            updateSetting(key, false);
        } else {
            // Turning on - check if we're at max
            if (enabledCount >= MAX_TABS) {
                // Find first enabled tab to turn off (excluding the one being turned on)
                const firstEnabled = orderedItems.find(item => settings[item.key] && item.key !== key);
                if (firstEnabled) {
                    updateSetting(firstEnabled.key, false);
                }
            }
            updateSetting(key, true);
        }
    };

    const moveTab = (index, direction) => {
        const newOrder = [...tabOrder];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        if (swapIndex < 0 || swapIndex >= newOrder.length) return;

        // Prevent moving history tab or swapping with it
        if (newOrder[index] === 'history' || newOrder[swapIndex] === 'history') return;

        [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
        updateSetting('tabOrder', newOrder);
    };

    // Check if an item is the history tab (locked position)
    const isHistoryTab = (id) => id === 'history';

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
                <div className="p-4 space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">
                        Visible Tabs ({enabledCount}/{MAX_TABS})
                    </p>
                    {orderedItems.map((item, index) => (
                        <div
                            key={item.key}
                            className="flex items-center justify-between bg-neutral-900/50 rounded-xl p-3 border border-neutral-700/50"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className="text-neutral-400" />
                                <span className="text-sm font-medium text-white">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Reorder buttons - disabled for History tab */}
                                <div className="flex flex-col">
                                    <button
                                        onClick={() => moveTab(index, 'up')}
                                        disabled={index === 0 || isHistoryTab(item.id)}
                                        className={`p-0.5 rounded transition-colors ${index === 0 || isHistoryTab(item.id)
                                            ? 'text-neutral-600 cursor-not-allowed'
                                            : 'text-neutral-400 hover:text-white hover:bg-neutral-700'}`}
                                        title={isHistoryTab(item.id) ? 'History is always last' : undefined}
                                    >
                                        <ChevronUp size={14} />
                                    </button>
                                    <button
                                        onClick={() => moveTab(index, 'down')}
                                        disabled={index === orderedItems.length - 1 || isHistoryTab(item.id)}
                                        className={`p-0.5 rounded transition-colors ${index === orderedItems.length - 1 || isHistoryTab(item.id)
                                            ? 'text-neutral-600 cursor-not-allowed'
                                            : 'text-neutral-400 hover:text-white hover:bg-neutral-700'}`}
                                        title={isHistoryTab(item.id) ? 'History is always last' : undefined}
                                    >
                                        <ChevronDown size={14} />
                                    </button>
                                </div>
                                {/* Toggle button */}
                                <button
                                    onClick={() => handleToggle(item.key, settings[item.key])}
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
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-700">
                    <p className="text-[10px] text-neutral-500 text-center">
                        Drag arrows to reorder · Min {MIN_TABS}, Max {MAX_TABS} tabs
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

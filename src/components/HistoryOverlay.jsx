import React from 'react';
import { useHistory } from '../context/HistoryContext';
import { X, Clock, History, Trash2 } from 'lucide-react';

const HistoryOverlay = ({ isOpen, onClose, module, title }) => {
    const { history, clearModuleHistory } = useHistory();

    if (!isOpen) return null;

    // Filter history by module
    const filteredHistory = history.filter(item =>
        item.module.toUpperCase() === module.toUpperCase()
    );

    const formatNum = (num, decimals = 2) => new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);

    const formatResult = (result) => {
        if (typeof result === 'object' && result !== null) {
            return Object.entries(result)
                .map(([k, v]) => {
                    let label = k;
                    if (['npv', 'irr', 'mirr', 'pi', 'fv', 'pv', 'pmt'].includes(k)) label = k.toUpperCase();
                    if (k === 'totalInterest') label = 'Interest';
                    return `${label}: ${typeof v === 'number' ? formatNum(v) : v}`;
                })
                .join(', ');
        }
        return formatNum(Number(result));
    };

    const getDecimalsForField = (key) => {
        const zeroDecimalFields = ['n', 'years', 'paymentsMade', 'frequency', 'compounding'];
        return zeroDecimalFields.includes(key) ? 0 : 2;
    };

    return (
        <div className="absolute inset-0 bg-[#1a1a1a] z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-neutral-700 flex justify-between items-center bg-neutral-900">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                    <History size={18} className="text-primary-500" />
                    {title || module} History
                </h3>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-neutral-700 rounded-full transition-colors"
                >
                    <X size={18} className="text-neutral-400 hover:text-white" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-3">
                {filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-neutral-600">
                        <Clock size={40} className="mb-3 opacity-50" />
                        <p className="text-sm">No {module} calculations yet.</p>
                    </div>
                ) : (
                    filteredHistory.map((item) => (
                        <div key={item.id} className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-primary-500 font-bold text-[10px] uppercase tracking-wider">{item.module}</span>
                                <span className="text-neutral-500 text-[10px]">
                                    {new Date(item.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <div className="mb-2">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-neutral-400">
                                    {Object.entries(item.inputs).map(([k, v]) => (
                                        <div key={k} className="flex justify-between gap-2">
                                            <span className="shrink-0">{k}:</span>
                                            <span className="text-neutral-300 text-right truncate">
                                                {typeof v === 'object' && v !== null
                                                    ? Object.entries(v).map(([subK, subV]) => `${subV}${subK[0]}`).join(' ')
                                                    : (typeof v === 'number' ? formatNum(v, getDecimalsForField(k)) : v)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-neutral-700 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-neutral-300">Result</span>
                                <span className="text-[11px] font-bold text-white">{formatResult(item.result)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-neutral-700 bg-neutral-900 flex justify-between items-center">
                <p className="text-[10px] text-neutral-500">
                    Showing {filteredHistory.length} calculation{filteredHistory.length !== 1 ? 's' : ''}
                </p>
                {filteredHistory.length > 0 && (
                    <button
                        onClick={() => clearModuleHistory(module)}
                        className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-red-300 transition-colors"
                    >
                        <Trash2 size={12} /> Clear History
                    </button>
                )}
            </div>
        </div>
    );
};

export default HistoryOverlay;

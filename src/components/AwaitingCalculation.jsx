import React from 'react';

const AwaitingCalculation = ({ Icon, message = "Enter values above and click Calculate to view the breakdown" }) => {
    return (
        <div className="h-full border border-dashed border-neutral-800/80 rounded-xl flex flex-col items-center justify-center text-neutral-500 gap-1.5 p-4 bg-neutral-900/10 hover:border-neutral-700/50 transition-all select-none animate-in fade-in duration-300">
            {Icon && <Icon className="w-5 h-5 text-neutral-600 animate-pulse" />}
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Awaiting Calculation</span>
            <span className="text-[9px] text-neutral-600 text-center max-w-[200px]">{message}</span>
        </div>
    );
};

export default AwaitingCalculation;

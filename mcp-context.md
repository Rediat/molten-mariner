# FinCalc Rebuild Project Context Dump

This file contains the complete source code and structural context for the FinCalc Rebuild application, which can be provided to an LLM or an AI Agent in another project.

## app_description.md

```markdown
# FinCalc Rebuild: The Professional Financial Calculator

**Power and Precision for Every Financial Decision.**

FinCalc Rebuild is a modern, high-performance financial calculator designed for professionals, students, and investors. Built with the latest web technologies, it replicates the functionality of top-tier financial calculators with a sleek, user-friendly interface.

## 🚀 Key Features

### 1. 📈 Comprehensive TVM Solver
Master the Time Value of Money with our robust calculator.
*   **Solve for Any Variable:** Calculate Present Value (PV), Future Value (FV), Payment (PMT), Interest Rate (I/Y), or Number of Periods (N).
*   **Advanced Options:** Support for Begin/End mode and customizable compounding frequencies (Annual, Semi-annual, Monthly, etc.).

### 2. 🏠 Advanced Loan Calculator
Plan your loans and mortgages with precision.
*   **Amortization Schedules:** View detailed breakdowns of principal and interest for each payment.
*   **Payoff Analysis:** Calculate outstanding balances and see how extra payments affect your loan term.

### 3. 💰 Cash Flow Analyzer (NPV & IRR)
Evaluate investment opportunities like a pro.
*   **NPV & IRR:** Instantly calculate Net Present Value and Internal Rate of Return.
*   **Flexible Inputs:** Easily handle uneven cash flows for complex investment scenarios.

### 4. 📜 Bond Valuation
Fixed-income analysis made simple.
*   **Yield to Maturity (YTM):** Calculate the true yield of your bond investments.
*   **Clean & Dirty Price:** Accurate pricing including accrued interest.

### 5. 🔄 Interest Rate Converter
Never be confused by interest rates again.
*   **Nominal <-> Effective:** Convert between Nominal rates (APR) and Effective Annual Rates (EAR) with a single click.

### 6. 🎟️ Treasury Bill Calculator
Professional bidding tools for T-Bill investors.
*   **Unit-Based Logic:** Calculated based on standard 5,000 ETB units used in Ethiopian auctions.
*   **Forward & Reverse Modes:** Solve for total cost from face value, or find the maximum face value possible within a set budget.
*   **Effective Yield:** Accurately determine annualized returns accounting for brokerage fees.

### 7. 🕒 Intelligent History
*   **Auto-Save:** Your calculations are automatically saved so you never lose your work.
*   **Recall:** One-tap recall to bring past calculations back to the active screen.

## ✨ Technical Highlights
*   **Modern Tech Stack:** Built with **React 18** and **Tailwind CSS** for blazing fast performance.
*   **Responsive Design:** Flawless experience on desktop, tablet, and mobile.
*   **Dark Mode UI:** A stunning, eye-strain-free interface with glassmorphism accents.
*   **Private & Secure:** All calculations happen locally on your device in real-time.

---
*FinCalc Rebuild is the smart choice for accurate, reliable, and accessible financial calculations.*

```

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FinCalc Android Pro</title>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5N8JXJCQ');</script>
    <!-- End Google Tag Manager -->
  </head>
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5N8JXJCQ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

## package.json

```json
{
  "name": "fincalc-rebuild",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "chmod +x node_modules/.bin/vite && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.27.1",
    "@react-google-maps/api": "^2.20.8",
    "clsx": "^2.1.1",
    "jspdf": "^4.0.0",
    "jspdf-autotable": "^5.0.7",
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  }
}

```

## README.md

```markdown
# FinCalc Rebuild

This is a React + Tailwind CSS rebuild of the FinCalc Android Pro TVM Calculator.

## Prerequisites

- Node.js (v18 or higher)
- npm

## Setup & Run

1.  Open a terminal in this directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the application in your browser (usually http://localhost:5173).

## Features implemented

- **TVM Calculator**: Full Time Value of Money calculator (PV, FV, PMT, N, I/Y).
- **T-Bill Bidding**: Unit-based (5,000 ETB) Treasury Bill calculator with forward/reverse modes and effective yield.
- **Advanced Tools**: Loan amortization, Bond valuation, Cash Flow (NPV/IRR), and Pension modeling.
- **Drive & Ride**: Traffic-aware fare calculator with route comparison and GPS live tracking.
- **Dark Mode**: Sleek dark interface with glassmorphism and premium aesthetics.

## Troubleshooting

### 'vite' is not recognized
If you see this error, it means dependencies are not installed or Node.js is missing.
1.  **Install Node.js**: Download from [nodejs.org](https://nodejs.org/).
2.  **Install dependencies**: Run `npm install` in this directory.
3.  **Run with npm**: Use `npm run dev` instead of running `vite` directly.

```

## src/.gitignore

```
# Environment variables
.env
.env.local
.env.*.local
```

## src/App.jsx

```javascript
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { HistoryProvider } from './context/HistoryContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { TransportProvider } from './context/TransportContext';
import SettingsModal from './components/SettingsModal';

// Features
import TVMCalculator from './features/tvm/TVMCalculator';
import LoanCalculator from './features/loan/LoanCalculator';
import CashFlowCalculator from './features/flow/CashFlowCalculator';
import BondCalculator from './features/bond/BondCalculator';
import RateConverter from './features/rates/RateConverter';
import GoalPlanner from './features/goal/GoalPlanner';
import HistoryView from './features/history/HistoryView';
import TBillCalculator from './features/tbill/TBillCalculator';
import PensionCalculator from './features/pension/PensionCalculator';
import InflationCalculator from './features/inflation/InflationCalculator';
import RideFareCalculator from './features/transport/RideFareCalculator';

const TAB_TO_SETTING = {
    tvm: 'showTVM',
    goal: 'showGoal',
    loan: 'showLoan',
    pension: 'showPension',
    transport: 'showTransport',
    flow: 'showFlow',
    bond: 'showBond',
    rates: 'showRates',
    tbill: 'showTBill',
    inflation: 'showInflation',
    history: 'showHistory'
};

function AppContent() {
    const { settings } = useSettings();
    const [activeTab, setActiveTab] = useState(() => {
        // Initialize to first enabled tab
        const tabOrder = settings.tabOrder || ['tvm', 'goal', 'loan', 'pension', 'inflation', 'tbill', 'transport', 'flow', 'bond', 'rates', 'history'];
        const firstEnabled = tabOrder.find(id => settings[TAB_TO_SETTING[id]]);
        return firstEnabled || 'tvm';
    });
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [mapsReady, setMapsReady] = useState(false);

    const toggleHelp = () => setShowHelp(true);
    const closeHelp = () => setShowHelp(false);
    const toggleSettings = () => setShowSettings(true);
    const closeSettings = () => setShowSettings(false);

    // Auto-switch away from disabled tab
    useEffect(() => {
        const settingKey = TAB_TO_SETTING[activeTab];
        if (settingKey && !settings[settingKey]) {
            const tabOrder = settings.tabOrder || ['tvm', 'goal', 'loan', 'pension', 'inflation', 'tbill', 'transport', 'flow', 'bond', 'rates', 'history'];
            const firstEnabled = tabOrder.find(id => settings[TAB_TO_SETTING[id]]);
            if (firstEnabled) {
                setActiveTab(firstEnabled);
            }
        }
    }, [settings, activeTab]);

    // Load Google Maps: try the serverless proxy first (production),
    // fall back to VITE_GOOGLE_MAPS_API_KEY from .env (local dev)
    useEffect(() => {
        if (window.google?.maps?.DistanceMatrixService) {
            setMapsReady(true);
            return;
        }

        const loadScript = (url) => {
            // Check if this specific script is already in the document (avoids StrictMode duplicates)
            if (document.querySelector(`script[src="${url}"]`)) {
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = () => {
                // With loading=async, sub-modules (DistanceMatrixService, Places, etc.)
                // may not be available immediately when the script element fires onload.
                // Poll until the full API is ready.
                let attempts = 0;
                const poll = setInterval(() => {
                    attempts++;
                    if (window.google?.maps?.DistanceMatrixService) {
                        clearInterval(poll);
                        setMapsReady(true);
                    } else if (attempts > 30) {
                        clearInterval(poll);
                        console.error('Google Maps sub-modules did not initialize in time');
                    }
                }, 100);
            };
            script.onerror = () => console.error('Failed to load Google Maps script');
            document.head.appendChild(script);
        };

        fetch('/api/maps')
            .then(res => res.json())
            .then(data => {
                if (data.scriptUrl) {
                    loadScript(data.scriptUrl);
                }
            })
            .catch(() => {
                // Fallback for local dev (npm run dev) where /api/maps doesn't exist
                const devKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                if (devKey && devKey !== 'YOUR_API_KEY_HERE') {
                    loadScript(`https://maps.googleapis.com/maps/api/js?key=${devKey}&libraries=places,geometry,marker&v=weekly&loading=async`);
                }
            });
    }, []);

    return (
        <Layout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showHelp={showHelp}
            onCloseHelp={closeHelp}
        >
            <div className={activeTab === 'tvm' ? 'block h-full' : 'hidden'}>
                <TVMCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'loan' ? 'block h-full' : 'hidden'}>
                <LoanCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'flow' ? 'block h-full' : 'hidden'}>
                <CashFlowCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'bond' ? 'block h-full' : 'hidden'}>
                <BondCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'rates' ? 'block h-full' : 'hidden'}>
                <RateConverter toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'goal' ? 'block h-full' : 'hidden'}>
                <GoalPlanner toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'history' ? 'block h-full' : 'hidden'}>
                <HistoryView toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'tbill' ? 'block h-full' : 'hidden'}>
                <TBillCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'pension' ? 'block h-full' : 'hidden'}>
                <PensionCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'inflation' ? 'block h-full' : 'hidden'}>
                <InflationCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
            </div>
            <div className={activeTab === 'transport' ? 'block h-full' : 'hidden'}>
                <RideFareCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} mapsReady={mapsReady} isActive={activeTab === 'transport'} />
            </div>
            <SettingsModal isOpen={showSettings} onClose={closeSettings} />
        </Layout>
    );
}

function App() {
    return (
        <SettingsProvider>
            <HistoryProvider>
                <TransportProvider>
                    <AppContent />
                </TransportProvider>
            </HistoryProvider>
        </SettingsProvider>
    );
}

export default App;




```

## src/components/FormattedNumberInput.jsx

```javascript
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const FormattedNumberInput = forwardRef(({
    value,
    onChange,
    className,
    placeholder,
    decimals = 2,
    useGrouping = true,
    forceFixedOnFocus = false,
    ...props
}, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Expose the input element through the ref
    useImperativeHandle(ref, () => inputRef.current);

    const formatNumber = (num) => {
        // If the number is null/empty, we format it as 0 for display when blurred
        const effectiveNum = (num === null || num === undefined || num === '' || isNaN(num)) ? 0 : num;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping
        }).format(effectiveNum);
    };

    useEffect(() => {
        if (!isFocused) setDisplayValue(formatNumber(value));
    }, [value, isFocused, decimals]);

    const handleFocus = (e) => {
        setIsFocused(true);
        if (value !== null && value !== undefined && !isNaN(value) && value !== '') {
            setDisplayValue(forceFixedOnFocus ? parseFloat(value).toFixed(decimals) : value.toString());
        } else {
            // Show empty string when focused if value is null
            setDisplayValue('');
        }
        props.onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        // On blur, if the value is null/empty, notify parent to set it to 0
        if (value === null || value === undefined || value === '' || isNaN(value)) {
            onChange({ target: { value: '0' } });
        }
        setDisplayValue(formatNumber(value));
        props.onBlur?.(e);
    };

    return (
        <input
            {...props}
            ref={inputRef}
            type={isFocused ? "number" : "text"}
            value={displayValue}
            onChange={(e) => { setDisplayValue(e.target.value); onChange(e); }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={className}
            placeholder={placeholder}
        />
    );
});

FormattedNumberInput.displayName = 'FormattedNumberInput';

export default FormattedNumberInput;

```

## src/components/HistoryOverlay.jsx

```javascript
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

```

## src/components/Icons.jsx

```javascript
import React from 'react';

export const CalculateIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="14" />
        <line x1="8" y1="14" x2="8" y2="14" />
        <line x1="12" y1="14" x2="12" y2="14" />
        <line x1="16" y1="18" x2="16" y2="18" />
        <line x1="8" y1="18" x2="8" y2="18" />
        <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
);

```

## src/components/Layout.jsx

```javascript
import React, { useState } from 'react';
import { Calculator, DollarSign, Activity, FileText, History, Percent, Target, HelpCircle, X, Receipt, Wallet, TrendingUp, Car, Map as MapIcon } from 'lucide-react';
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
    const tabOrder = settings.tabOrder || ['tvm', 'goal', 'loan', 'pension', 'inflation', 'tbill', 'transport', 'flow', 'bond', 'rates', 'history'];

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

```

## src/components/PlacesAutocomplete.jsx

```javascript
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapPin, Crosshair, Search, Loader2 } from 'lucide-react';

const PlacesAutocomplete = ({ placeholder, onPlaceSelected, label, accentColor = 'white', compact = false, onUseCurrentLocation, locationLoading, externalInputRef, mapsReady }) => {
    const internalRef = useRef(null);
    const inputRef = externalInputRef || internalRef;
    const [predictions, setPredictions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState(null);
    
    // Services refs
    const autocompleteService = useRef(null);
    const placesService = useRef(null);
    const dropdownRef = useRef(null);

    // Initialize Services
    useEffect(() => {
        if (!window.google?.maps?.places || !mapsReady) return;
        
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        // PlacesService requires an HTML element, even if we just use it for getDetails
        const dummyDiv = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
    }, [mapsReady]);

    // Handle clicks outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current?.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [inputRef]);

    const fetchPredictions = useCallback((input) => {
        if (!input || input.length < 2 || !autocompleteService.current) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        // Addis Ababa center for biasing
        const addisAbaba = new window.google.maps.LatLng(9.0333, 38.7500);
        
        autocompleteService.current.getPlacePredictions({
            input,
            sessionToken,
            componentRestrictions: { country: 'et' },
            locationBias: { radius: 10000, center: addisAbaba }, // 10km radius from city center
        }, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                setLoading(false);
                setPredictions(results);
                setShowDropdown(true);
            } else if (placesService.current) {
                // Fallback to textSearch for unordered or complex queries if Autocomplete fails
                placesService.current.textSearch({
                    query: input + ' Addis Ababa Ethiopia',
                    location: addisAbaba,
                    radius: 20000,
                }, (textResults, textStatus) => {
                    setLoading(false);
                    if (textStatus === window.google.maps.places.PlacesServiceStatus.OK && textResults) {
                        // Map textSearch results to match the prediction object format
                        const mappedResults = textResults.slice(0, 5).map(res => ({
                            place_id: res.place_id,
                            description: res.name + ', ' + (res.formatted_address || ''),
                            structured_formatting: {
                                main_text: res.name,
                                secondary_text: res.formatted_address || 'Addis Ababa',
                            },
                        }));
                        setPredictions(mappedResults);
                        setShowDropdown(mappedResults.length > 0);
                    } else {
                        setPredictions([]);
                        setShowDropdown(false);
                    }
                });
            } else {
                setLoading(false);
                setPredictions([]);
                setShowDropdown(false);
            }
        });
    }, [sessionToken]);

    const debounceTimerRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        if (!value) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchPredictions(value);
        }, 300);
    };

    const handleSelectPrediction = (prediction) => {
        if (!placesService.current || !prediction.place_id) return;

        setLoading(true);
        setShowDropdown(false);
        if (inputRef.current) inputRef.current.value = prediction.description;

        placesService.current.getDetails({
            placeId: prediction.place_id,
            fields: ['geometry', 'formatted_address', 'name'],
            sessionToken
        }, (place, status) => {
            setLoading(false);
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                onPlaceSelected({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    name: place.name,
                    address: place.formatted_address,
                });
                // Refresh session token for the next trip
                setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
            }
        });
    };

    const setInputValue = useCallback((val) => {
        if (inputRef.current) inputRef.current.value = val;
    }, [inputRef]);

    useEffect(() => {
        if (onPlaceSelected && inputRef.current) {
            inputRef.current._setInputValue = setInputValue;
        }
    }, [onPlaceSelected, setInputValue, inputRef]);

    const colorMap = {
        primary: 'text-primary-400',
        emerald: 'text-emerald-400',
        white: 'text-white',
    };

    const renderInput = () => (
        <div className="flex-1 min-w-0 flex items-center gap-2 cursor-text" onClick={() => inputRef.current?.focus()}>
            <label className={`uppercase tracking-wider font-bold shrink-0 text-left ${compact ? 'text-[8px] w-8' : 'text-[10px] w-10'} ${accentColor === 'primary' ? 'text-primary-400' : 'text-neutral-500'}`}>
                {label}
            </label>
            <div className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    className={`w-full bg-transparent font-medium focus:outline-none text-white placeholder-neutral-600 min-w-0 py-1 ${compact ? 'text-xs' : 'text-sm'}`}
                    autoComplete="off"
                    onChange={handleInputChange}
                    onFocus={() => predictions.length > 0 && setShowDropdown(true)}
                />
            </div>
            {loading && <Loader2 className="w-3 h-3 text-primary-500 animate-spin shrink-0" />}
        </div>
    );

    return (
        <div className="relative">
            <div className={`${compact ? 'flex items-center gap-2 min-w-0 py-1' : 'bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700 flex items-center gap-2 min-w-0'}`}>
                <button
                    onClick={() => {
                        if (inputRef.current) {
                            inputRef.current.value = '';
                            inputRef.current.focus();
                        }
                        onPlaceSelected(null);
                        setPredictions([]);
                        setShowDropdown(false);
                    }}
                    className={`shrink-0 rounded-full hover:bg-neutral-700/50 transition-colors focus:outline-none focus:ring-1 focus:ring-primary-500/50 ${compact ? 'p-1 -m-1' : 'p-1.5 -m-1.5'}`}
                >
                    <MapPin className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${colorMap[accentColor] || 'text-white'}`} />
                </button>
                
                {renderInput()}

                {onUseCurrentLocation && (
                    <button
                        onClick={() => onUseCurrentLocation(setInputValue)}
                        disabled={locationLoading}
                        className={`shrink-0 p-1 rounded-md transition-colors group ${locationLoading ? 'animate-pulse' : 'hover:bg-neutral-700/50'}`}
                        title="Use current location"
                    >
                        <Crosshair className={`w-3.5 h-3.5 transition-colors ${locationLoading ? 'text-primary-400' : 'text-neutral-500 group-hover:text-primary-400'}`} />
                    </button>
                )}
            </div>

            {/* Dropdown Suggestions */}
            {showDropdown && (
                <div 
                    ref={dropdownRef}
                    className="absolute left-0 right-0 top-full mt-2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-[100] overflow-hidden max-h-[250px] overflow-y-auto backdrop-blur-xl bg-neutral-900/95"
                >
                    {predictions.map((p) => (
                        <button
                            key={p.place_id}
                            onClick={() => handleSelectPrediction(p)}
                            className="w-full text-left p-3 hover:bg-neutral-800 flex items-start gap-3 transition-colors border-b border-neutral-800 last:border-0 group"
                        >
                            <MapPin className="w-4 h-4 text-neutral-500 group-hover:text-primary-400 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white truncate group-hover:text-primary-400 transition-colors">
                                    {p.structured_formatting.main_text}
                                </div>
                                <div className="text-[10px] text-neutral-500 truncate font-medium">
                                    {p.structured_formatting.secondary_text}
                                </div>
                            </div>
                        </button>
                    ))}
                    <div className="p-2 bg-neutral-950/50 flex justify-end">
                        <img src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3_hdpi.png" alt="Google" className="h-2 opacity-50" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacesAutocomplete;

```

## src/components/SettingsModal.jsx

```javascript
import React from 'react';
import { X, Activity, FileText, Percent, History, Receipt, Calculator, CreditCard, Target, ChevronUp, ChevronDown, Wallet, TrendingUp, Car } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const MIN_TABS = 1;
const MAX_TABS = 7;

const TAB_CONFIG = {
    tvm: { key: 'showTVM', label: 'TVM', icon: Calculator },
    loan: { key: 'showLoan', label: 'Loan', icon: CreditCard },
    pension: { key: 'showPension', label: 'Pension', icon: Wallet },
    transport: { key: 'showTransport', label: 'Ride', icon: Car },
    flow: { key: 'showFlow', label: 'Cash Flow', icon: Activity },
    bond: { key: 'showBond', label: 'Bond', icon: FileText },
    rates: { key: 'showRates', label: 'Rate Converter', icon: Percent },
    tbill: { key: 'showTBill', label: 'T-Bill', icon: Receipt },
    goal: { key: 'showGoal', label: 'Goal Planner', icon: Target },
    inflation: { key: 'showInflation', label: 'Inflation', icon: TrendingUp },
    history: { key: 'showHistory', label: 'History', icon: History },
};

const SettingsModal = ({ isOpen, onClose }) => {
    const { settings, updateSetting } = useSettings();

    if (!isOpen) return null;

    // Get ordered items based on tabOrder, with history always at the bottom
    const tabOrder = settings.tabOrder || ['tvm', 'goal', 'loan', 'pension', 'inflation', 'tbill', 'transport', 'flow', 'bond', 'rates', 'history'];
    const orderedItems = tabOrder
        .filter(id => id !== 'history' && TAB_CONFIG[id]) // Exclude history and unknown tabs from normal order
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

```

## src/context/HistoryContext.jsx

```javascript
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

```

## src/context/SettingsContext.jsx

```javascript
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
    tabOrder: ['tvm', 'goal', 'loan', 'pension', 'inflation', 'tbill', 'transport', 'rates', 'history', 'flow', 'bond'],
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

```

## src/context/TransportContext.jsx

```javascript
import React, { createContext, useContext, useState } from 'react';

const TransportContext = createContext();

export const TransportProvider = ({ children }) => {
    // Shared state for the transportation workflow (Ride -> Driving)
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [distanceKm, setDistanceKm] = useState(null);
    const [durationText, setDurationText] = useState(null);
    const [durationValue, setDurationValue] = useState(null);
    const [routeVersion, setRouteVersion] = useState(0);

    // Drive tab specific caching
    const [cachedRoutesData, setCachedRoutesData] = useState([]);
    const [cachedActiveRouteIndex, setCachedActiveRouteIndex] = useState(0);
    const [cachedCoordsKey, setCachedCoordsKey] = useState(null);

    // Helpers to clear or bulk-update context easily
    const clearTransportState = () => {
        setOrigin(null);
        setDestination(null);
        setDistanceKm(null);
        setDurationText(null);
        setDurationValue(null);
        setRouteVersion(0);
        setCachedRoutesData([]);
        setCachedActiveRouteIndex(0);
        setCachedCoordsKey(null);
    };

    return (
        <TransportContext.Provider value={{
            origin, setOrigin,
            destination, setDestination,
            distanceKm, setDistanceKm,
            durationText, setDurationText,
            durationValue, setDurationValue,
            routeVersion, setRouteVersion,
            cachedRoutesData, setCachedRoutesData,
            cachedActiveRouteIndex, setCachedActiveRouteIndex,
            cachedCoordsKey, setCachedCoordsKey,
            clearTransportState
        }}>
            {children}
        </TransportContext.Provider>
    );
};

export const useTransport = () => {
    const context = useContext(TransportContext);
    if (!context) {
        throw new Error('useTransport must be used within a TransportProvider');
    }
    return context;
};

```

## src/features/bond/BondCalculator.jsx

```javascript
import React, { useState, useRef } from 'react';
import { calculateBond, calculateBondYTM, calculateBondYTC, calculateBondDuration, calculateBondConvexity } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const BondCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [target, setTarget] = useState('price');
    const [values, setValues] = useState({
        faceValue: 1000, couponRate: 5, ytm: 4, price: 1050, years: 10, frequency: 2, callPrice: 1000, yearsToCall: 5
    });
    const [result, setResult] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for input focus
    const inputRefs = {
        faceValue: useRef(null),
        couponRate: useRef(null),
        ytm: useRef(null),
        price: useRef(null),
        years: useRef(null),
        callPrice: useRef(null),
        yearsToCall: useRef(null)
    };

    const clearField = (field, ref) => {
        setValues(prev => ({ ...prev, [field]: null }));
        setResult(null);
        setMetrics(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const handleCalculate = () => {
        const fv = values.faceValue || 0;
        const cr = values.couponRate || 0;
        const ytmVal = values.ytm || 0;
        const prc = values.price || 0;
        const yrs = values.years || 0;
        const freq = values.frequency || 1;
        const cp = values.callPrice || 0;
        const ytcVal = values.yearsToCall || 0;

        let res, ytmUsed = ytmVal;

        if (target === 'price') {
            res = calculateBond(fv, cr, ytmVal, yrs, freq);
        } else {
            res = calculateBondYTM(fv, cr, prc, yrs, freq);
            ytmUsed = res;
        }

        const duration = calculateBondDuration(fv, cr, ytmUsed, yrs, freq);
        const convexity = calculateBondConvexity(fv, cr, ytmUsed, yrs, freq);
        const ytc = ytcVal > 0 ? calculateBondYTC(fv, cr, target === 'price' ? res : prc, ytcVal, cp, freq) : null;

        setResult(res);
        setMetrics({ duration, convexity, ytc });
        addToHistory('BOND', { ...values, target: target.toUpperCase() }, { result: res, ...duration, convexity, ytc });
    };

    const handleChange = (field, val) => {
        const numericVal = val === '' ? null : (parseFloat(val.toString().replace(/,/g, '')) || 0);
        setValues(prev => ({ ...prev, [field]: numericVal }));
        setResult(null);
        setMetrics(null);
    };

    const inputFields = [
        { id: 'faceValue', label: 'Face Value', sub: 'Par' },
        { id: 'couponRate', label: 'Coupon Rate', sub: '%' },
        ...(target === 'price' ? [{ id: 'ytm', label: 'Yield to Maturity', sub: '%' }] : [{ id: 'price', label: 'Bond Price', sub: '$' }]),
        { id: 'years', label: 'Years to Maturity', sub: 'Years' },
        { id: 'callPrice', label: 'Call Price', sub: '$' },
        { id: 'yearsToCall', label: 'Years to Call', sub: 'Years' }
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Bond Pricing</h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">Valuation & Yield</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title="Show Info"
                        >
                            <Info className="w-3 h-3" />
                        </button>
                        <div className="bg-neutral-800 p-1 rounded-xl flex">
                            {['price', 'ytm'].map(t => (
                                <button key={t} onClick={() => { setTarget(t); setResult(null); setMetrics(null); }}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${target === t ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500'}`}>
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-neutral-800 p-1 rounded-xl flex">
                        {[{ val: 1, label: 'ANNUAL' }, { val: 2, label: 'SEMI' }].map(opt => (
                            <button key={opt.val} onClick={() => handleChange('frequency', opt.val)}
                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${values.frequency === opt.val ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'}`}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2 mb-2 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Bond Valuation</p>
                    <p className="text-[11px] leading-relaxed">
                        Calculate bond prices or Yield to Maturity (YTM). Includes Duration (Macaulay & Modified),
                        Convexity, and Yield to Call (YTC) for callable bonds.
                    </p>
                </div>
            )}

            <div className="space-y-0.5 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {inputFields.map(field => (
                    <div key={field.id} className="bg-neutral-800/40 rounded-lg p-1.5 flex justify-between items-center gap-4 border border-transparent hover:border-neutral-700 transition-all">
                        <div className="flex flex-col shrink-0 items-start text-left">
                            <label 
                                onClick={() => clearField(field.id, inputRefs[field.id])}
                                className="text-sm font-bold text-neutral-300 cursor-pointer hover:text-primary-400 transition-colors"
                                title="Click to Clear"
                            >
                                {field.label}
                            </label>
                            <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">{field.sub}</span>
                        </div>
                        <FormattedNumberInput 
                            ref={inputRefs[field.id]}
                            value={values[field.id]} 
                            onChange={(e) => handleChange(field.id, e.target.value)} 
                            decimals={field.id.includes('years') ? 0 : 2} 
                            className="bg-transparent text-right text-lg font-mono text-white focus:outline-none w-full flex-1" 
                        />
                    </div>
                ))}
            </div>

            {result !== null && metrics && (
                <div className="space-y-2 mb-2 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                        <button
                            onClick={() => setShowHistory(true)}
                            className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                        >
                            <History size={12} /> View History
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Duration</div>
                            {[{ label: 'Mac', val: metrics.duration.macaulay }, { label: 'Mod', val: metrics.duration.modified }].map(d => (
                                <div key={d.label} className="flex justify-between items-end">
                                    <span className="text-xs text-neutral-400">{d.label}</span>
                                    <span className="text-sm font-bold text-white font-mono">{d.val.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Convexity</div>
                            <span className="text-sm font-bold text-white font-mono self-end">{metrics.convexity.toFixed(2)}</span>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">{target === 'price' ? 'Bond Price' : 'Yield (YTM)'}</div>
                            <span className="text-lg font-bold text-primary-500 font-mono self-end">
                                {target === 'price' ? result.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : `${result.toFixed(3)}%`}
                            </span>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-2 border border-neutral-800 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Yield to Call</div>
                            <span className="text-lg font-bold text-secondary-400 font-mono self-end">{metrics.ytc ? `${metrics.ytc.toFixed(3)}%` : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-1.5 mt-1">
                <button
                    onClick={() => {
                        setValues({
                            faceValue: 0, couponRate: 0, ytm: 0, price: 0, years: 0, frequency: 2, callPrice: 0, yearsToCall: 0
                        });
                        setResult(null);
                        setMetrics(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest">
                    <CalculateIcon className="w-5 h-5" /> Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="Bond"
                title="Bond"
            />
        </div>
    );
};

export default BondCalculator;

```

## src/features/driving/DrivingView.jsx

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Info, Loader2, ArrowLeft, ExternalLink, MessageSquare, Zap } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

const DrivingView = ({ onClose, fareData, onOpenLiveTracker }) => {
    const {
        origin, destination,
        setDistanceKm, setDurationValue, setDurationText, setRouteVersion,
        cachedRoutesData, setCachedRoutesData,
        cachedActiveRouteIndex, setCachedActiveRouteIndex,
        cachedCoordsKey, setCachedCoordsKey
    } = useTransport();
    const mapRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const polylinesRef = useRef([]);
    const markersRef = useRef([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSteps, setShowSteps] = useState(false);

    // Initialize Map and DirectionsRenderer
    useEffect(() => {
        if (!window.google?.maps || !mapRef.current || mapInstance) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 9.03, lng: 38.74 }, // Addis Ababa default
            zoom: 12,
            mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
            disableDefaultUI: true, // cleaner interface
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false, // User can enable tilt/rotation via Cloud Console on their MapId if desired
            fullscreenControl: false,
            clickableIcons: false, // Disables the default InfoWindow popups on Points of Interest (POIs)
            styles: [
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "all",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#000000" }, { lightness: 13 }]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#000000" }]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }]
                },
                {
                    featureType: "landscape",
                    elementType: "all",
                    stylers: [{ color: "#08304b" }]
                },
                {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [{ color: "#0c4152" }, { lightness: 5 }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#000000" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#0b434f" }, { lightness: 25 }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#000000" }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#0b3d51" }, { lightness: 16 }]
                },
                {
                    featureType: "road.local",
                    elementType: "geometry",
                    stylers: [{ color: "#000000" }]
                },
                {
                    featureType: "transit",
                    elementType: "all",
                    stylers: [{ color: "#146474" }]
                },
                {
                    featureType: "water",
                    elementType: "all",
                    stylers: [{ color: "#021019" }]
                }
            ]
        });
        setMapInstance(map);
    }, [mapInstance, origin, destination]);

    // Fetch Directions when Origin or Destination changes
    useEffect(() => {
        if (!mapInstance || !window.google?.maps) return;

        if (!origin || !destination) {
            polylinesRef.current.forEach(p => p.setMap(null));
            polylinesRef.current = [];
            markersRef.current.forEach(m => m.setMap(null));
            markersRef.current = [];
            setCachedRoutesData([]);
            setCachedActiveRouteIndex(0);
            setRouteInfo(null);
            setError(null);
            return;
        }

        // Check if we already have cached routes for these exact coordinates
        const coordsKey = `${origin.lat},${origin.lng}-${destination.lat},${destination.lng}`;
        if (cachedRoutesData.length > 0 && cachedCoordsKey === coordsKey) {
            return;
        }

        // New route requested — clear stale data
        setRouteInfo(null);
        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];

        const fetchRoute = async () => {
            setLoading(true);
            setError(null);

            try {
                // Determine if we use local proxy or direct API based on environment
                const devKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                const endpoint = (devKey && devKey !== 'YOUR_API_KEY_HERE')
                    ? 'https://routes.googleapis.com/directions/v2:computeRoutes'
                    : '/api/routes';

                const headers = {
                    'Content-Type': 'application/json',
                    'x-goog-fieldmask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs,routes.travelAdvisory,routes.routeLabels'
                };

                if (endpoint.startsWith('https://')) {
                    headers['X-Goog-Api-Key'] = devKey;
                }

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
                        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
                        travelMode: 'DRIVE',
                        routingPreference: 'TRAFFIC_AWARE',
                        computeAlternativeRoutes: true,
                        extraComputations: ['TRAFFIC_ON_POLYLINE'],
                        languageCode: 'en-US',
                        units: 'METRIC',
                    })
                });

                if (!response.ok) {
                    let errMsg = response.statusText;
                    try {
                        const errData = await response.json();
                        if (errData.error?.message) errMsg = errData.error.message;
                        else if (typeof errData.error === 'string') errMsg = errData.error;
                    } catch (e) {
                        // Not JSON
                    }
                    throw new Error(errMsg ? `Failed: ${errMsg}` : 'Route request failed');
                }

                const data = await response.json();

                if (!data.routes || data.routes.length === 0) {
                    throw new Error('No route found');
                }

                setCachedRoutesData(data.routes);
                setCachedActiveRouteIndex(0);
                setCachedCoordsKey(coordsKey);

            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to calculate route');
                polylinesRef.current.forEach(p => p.setMap(null));
                polylinesRef.current = [];
                markersRef.current.forEach(m => m.setMap(null));
                markersRef.current = [];
                setCachedRoutesData([]);
                setCachedActiveRouteIndex(0);
                setRouteInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [origin, destination, mapInstance]);

    // Draw polylines and update route info when cachedRoutesData or cachedActiveRouteIndex changes
    useEffect(() => {
        if (!mapInstance || !window.google?.maps || cachedRoutesData.length === 0 || !origin || !destination) return;

        // Clear existing polylines and markers
        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();

        // --- Add Origin Marker (Custom DOM Element: Green Circle) ---
        const originPin = document.createElement('div');
        originPin.innerHTML = `
            <div style="width: 14px; height: 14px; background-color: #10b981; border-radius: 50%; border: 2px solid #047857; box-shadow: 0 0 10px rgba(16,185,129,0.5);"></div>
        `;
        const originMarker = new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: origin.lat, lng: origin.lng },
            map: mapInstance,
            content: originPin,
            title: origin.name || 'Origin',
            zIndex: 20
        });
        markersRef.current.push(originMarker);

        // --- Add Destination Marker (Default Google Red Pin via AdvancedMarkerElement) ---
        const destMarker = new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: destination.lat, lng: destination.lng },
            map: mapInstance,
            title: destination.name || 'Destination',
            zIndex: 20
        });
        markersRef.current.push(destMarker);

        // Helper to get traffic color
        const getTrafficColor = (speed) => {
            if (speed === 'NORMAL') return '#0ea5e9'; // Blue primary-500
            if (speed === 'SLOW') return '#eab308'; // Yellow
            if (speed === 'TRAFFIC_JAM') return '#ef4444'; // Red
            return '#0ea5e9'; // Default blue
        };

        // Draw alternative routes first (so they are underneath)
        cachedRoutesData.forEach((route, index) => {
            if (index === cachedActiveRouteIndex) return; // Draw active route last

            if (route.polyline?.encodedPolyline) {
                const path = window.google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);

                const poly = new window.google.maps.Polyline({
                    path,
                    strokeColor: '#737373', // neutral-500
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                    map: mapInstance,
                    zIndex: 1,
                    clickable: true
                });

                // Listen for clicks on alternative routes
                poly.addListener('click', () => {
                    setCachedActiveRouteIndex(index);
                });

                polylinesRef.current.push(poly);

                if (index === 0) { // Keep bounds around the primary route
                    path.forEach(p => bounds.extend(p));
                }
            }
        });

        // Draw active route
        const activeRoute = cachedRoutesData[cachedActiveRouteIndex];
        if (activeRoute?.polyline?.encodedPolyline) {
            const path = window.google.maps.geometry.encoding.decodePath(activeRoute.polyline.encodedPolyline);
            const intervals = activeRoute.travelAdvisory?.speedReadingIntervals || [];

            if (intervals.length > 0) {
                // Draw multicolored polyline segments based on traffic
                intervals.forEach((interval) => {
                    const startIdx = interval.startPolylinePointIndex || 0;
                    const endIdx = interval.endPolylinePointIndex || path.length - 1;
                    const segmentPath = path.slice(startIdx, endIdx + 1);

                    const poly = new window.google.maps.Polyline({
                        path: segmentPath,
                        strokeColor: getTrafficColor(interval.speed),
                        strokeOpacity: 1.0,
                        strokeWeight: 6,
                        map: mapInstance,
                        zIndex: 10
                    });
                    polylinesRef.current.push(poly);
                });
            } else {
                // Fallback to solid line if no traffic info
                const poly = new window.google.maps.Polyline({
                    path,
                    strokeColor: '#0ea5e9',
                    strokeOpacity: 1.0,
                    strokeWeight: 6,
                    map: mapInstance,
                    zIndex: 10
                });
                polylinesRef.current.push(poly);
            }

            // Fit bounds to the active route
            const activeBounds = new window.google.maps.LatLngBounds();
            path.forEach(p => activeBounds.extend(p));
            mapInstance.fitBounds(activeBounds);
        }

        // Update Route Info for the active route
        if (activeRoute && activeRoute.legs && activeRoute.legs.length > 0) {
            const leg = activeRoute.legs[0];
            const formattedSteps = leg.steps ? leg.steps.map(step => ({
                instructions: step.navigationInstruction?.instructions || 'Continue',
                distance: { text: `${(step.distanceMeters || 0) < 1000 ? step.distanceMeters + ' m' : (step.distanceMeters / 1000).toFixed(1) + ' km'}` },
                duration: { text: step.staticDuration ? `${Math.ceil(parseInt(step.staticDuration) / 60)} min` : '' }
            })) : [];

            const durationSecs = activeRoute.duration ? parseInt(activeRoute.duration) : 0;
            const distanceKms = parseFloat((activeRoute.distanceMeters / 1000).toFixed(2));
            const durationMins = Math.ceil(durationSecs / 60);

            setRouteInfo({
                distance: `${distanceKms} km`,
                duration: `${durationMins} mins`,
                startAddress: origin.name,
                endAddress: destination.name,
                steps: formattedSteps,
            });

            setDistanceKm(distanceKms);
            setDurationValue(durationSecs / 60);
            setDurationText(`${durationMins} mins`);
            setRouteVersion(v => v + 1);
        }

    }, [cachedRoutesData, cachedActiveRouteIndex, mapInstance, origin, destination, setDistanceKm, setDurationValue, setDurationText, setRouteVersion]);

    const hasRoute = origin && destination;

    return (
        <div className="flex flex-col h-full bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden relative shadow-xl">
            {/* No Route Selected overlay */}
            {!hasRoute && (
                <div className="absolute inset-0 z-40 bg-neutral-900 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                    <Navigation className="w-16 h-16 text-neutral-700 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Route Selected</h2>
                    <p className="text-sm text-neutral-400">
                        Select an Origin and Destination to view the driving route here.
                    </p>
                </div>
            )}

            {/* Top Bar overlay */}
            {hasRoute && (
                <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-neutral-900/90 to-transparent pointer-events-none">
                    <div className="flex gap-2 items-center pointer-events-auto max-w-[95%]">
                        <button
                            onClick={onClose}
                            className="h-12 w-12 flex items-center justify-center bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-xl shadow-lg text-neutral-400 hover:text-white transition-all hover:bg-neutral-800 shrink-0"
                            title="Back to Calculator"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 px-3 rounded-xl shadow-lg flex-1 overflow-hidden flex flex-col justify-center h-12 gap-0">
                             <div className="flex items-center gap-2 group">
                                 <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                                 <span className="text-[10px] font-bold text-white truncate">{origin?.name || 'Origin'}</span>
                             </div>
                             <div className="flex items-center gap-2 group">
                                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                 <span className="text-[10px] font-bold text-neutral-400 truncate group-hover:text-white transition-colors">{destination?.name || 'Destination'}</span>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Container - always rendered so mapRef stays in the DOM */}
            <div className="flex-1 relative">
                <div ref={mapRef} className="absolute inset-0 w-full h-full" />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm z-20">
                        <div className="bg-neutral-800 p-4 rounded-xl flex items-center gap-3 border border-neutral-700 shadow-xl">
                            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
                            <span className="text-sm font-bold text-white tracking-wide">Loading Route...</span>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-900/90 text-rose-200 px-4 py-3 rounded-xl text-xs font-bold z-20 shadow-xl border border-rose-500/50 flex flex-col items-center max-w-[80%] text-center gap-2">
                        <Info className="w-5 h-5" />
                        {error}
                    </div>
                )}
            </div>

            {/* Bottom Sheet – Navigate + Turn-by-turn */}
            {routeInfo && (
                <div className={`absolute bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 transition-all duration-300 ease-in-out z-30 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${showSteps ? 'h-[45%]' : 'pb-4'}`}>
                    
                    {/* Route Cards */}
                    {!showSteps && cachedRoutesData.length > 0 && (
                        <div className="flex gap-2 pt-4 px-3 pb-2">
                            {cachedRoutesData.map((route, index) => {
                                const isActive = index === cachedActiveRouteIndex;
                                const durationSecs = parseInt(route.duration) || 0;
                                const durationMins = Math.ceil(durationSecs / 60);
                                const distanceMeters = route.distanceMeters || 0;
                                const distanceKms = parseFloat((distanceMeters / 1000).toFixed(1));
                                const labels = route.routeLabels || [];
                                
                                // Determine label based on route properties
                                let labelText = 'Alternative';
                                
                                // Identify shortest/longest distance
                                const allDistances = cachedRoutesData.map(r => r.distanceMeters || 0);
                                const minDistance = Math.min(...allDistances);
                                const maxDistance = Math.max(...allDistances);
                                
                                // Identify fastest/slowest duration
                                const allDurations = cachedRoutesData.map(r => parseInt(r.duration) || 0);
                                const minDuration = Math.min(...allDurations);
                                const maxDuration = Math.max(...allDurations);

                                if (labels.includes('DEFAULT_ROUTE')) labelText = 'Suggested';
                                else if (distanceMeters === minDistance) labelText = 'Shortest';
                                else if (durationSecs === minDuration) labelText = 'Fastest';
                                else if (labels.includes('FUEL_EFFICIENT')) labelText = 'Economical';
                                else if (distanceMeters === maxDistance) labelText = 'Longest';
                                else if (durationSecs === maxDuration) labelText = 'Avoid Traffic';
                                else if (labels.includes('SHORTER_DISTANCE')) labelText = 'Shortest';
                                else labelText = 'Alternative';

                                return (
                                    <div 
                                        key={index}
                                        onClick={() => setCachedActiveRouteIndex(index)}
                                        className={`flex-1 min-w-0 p-2 rounded-xl flex flex-col items-center justify-center border-2 cursor-pointer transition-all ${
                                            isActive 
                                            ? 'border-primary-500 bg-primary-500/10 scale-100 shadow-[0_0_15px_rgba(14,165,233,0.15)] z-10' 
                                            : 'border-transparent bg-neutral-800/80 hover:bg-neutral-800 scale-95 opacity-80'
                                        }`}
                                    >
                                        <div className={`text-lg font-black flex items-end tracking-tight ${isActive ? 'text-primary-500' : 'text-white'}`}>
                                            {durationMins}<span className="text-[10px] font-bold ml-0.5 mb-1">min</span>
                                        </div>
                                        <div className="text-[10px] text-neutral-400 font-bold mt-0.5">
                                            {distanceKms} km
                                        </div>
                                        <div className="text-[9px] font-bold text-neutral-500 mt-1 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                                            {labelText}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className={`flex items-center gap-2 p-2.5 shrink-0 ${!showSteps ? 'border-t border-neutral-800/50' : ''}`}>
                        {/* Google Maps Navigate button */}
                        <button
                            onClick={() => {
                                if (!origin || !destination) return;
                                const activeRoute = cachedRoutesData[cachedActiveRouteIndex];
                                // Use basic origin/destination, let Google handle traffic-aware active route
                                const params = `origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving&dir_action=navigate`;
                                const webUrl = `https://www.google.com/maps/dir/?api=1&${params}`;
                                const isAndroid = /android/i.test(navigator.userAgent);
                                if (isAndroid) {
                                    const intentUrl = `intent://maps.google.com/maps/dir/?api=1&${params}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
                                    window.location.href = intentUrl;
                                } else {
                                    window.open(webUrl, '_blank');
                                }
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-primary-600/30 to-primary-500/20 hover:from-primary-600/50 hover:to-primary-500/35 text-primary-400 font-bold text-xs py-2 px-3 rounded-lg transition-all border border-primary-500/40 active:scale-[0.97] shrink-0"
                            title="Open in Google Maps app"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Navigate</span>
                        </button>

                        {/* Divider */}
                        <div className="w-px h-7 bg-neutral-700/60 shrink-0" />

                        {/* SMS Trip Details button */}
                        <button
                            onClick={() => {
                                const fare = fareData?.totalToCharge != null
                                    ? fareData.totalToCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    : 'N/A';
                                const distance = routeInfo?.distance || 'N/A';
                                const duration = routeInfo?.duration || 'N/A';
                                const body = `Hello Our Service User, your trip details are as follows:\nFare: ${fare}\nDistance: ${distance}\nEstimated Time: ${duration}\nYou can pay via TeleBirr, CBE, or Cash.\nThank you for riding with us and have a safe trip! 🚗`;

                                // Detect restricted environments that block sms: URI scheme
                                const isTelegram = !!window.Telegram?.WebApp;
                                const ua = navigator.userAgent || '';
                                const isWebView = /wv|; wv\)|WebView/i.test(ua) || (ua.includes('Android') && !ua.includes('Chrome/'));

                                if (isTelegram || isWebView) {
                                    // Clipboard fallback — use execCommand for WebView compatibility
                                    const textArea = document.createElement('textarea');
                                    textArea.value = body;
                                    textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();
                                    let copied = false;
                                    try { copied = document.execCommand('copy'); } catch (e) { /* ignore */ }
                                    document.body.removeChild(textArea);
                                    if (!copied && navigator.clipboard) {
                                        navigator.clipboard.writeText(body).catch(() => { });
                                    }
                                    alert('📋 Message copied to clipboard!\nOpen your SMS app and paste it to send.');
                                } else {
                                    // Standard browser — use sms: URI directly
                                    window.location.href = `sms:?body=${encodeURIComponent(body)}`;
                                }
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 hover:from-emerald-600/50 hover:to-emerald-500/35 text-emerald-400 font-bold text-xs py-2 px-3 rounded-lg transition-all border border-emerald-500/40 active:scale-[0.97] shrink-0"
                            title="Send trip details via SMS"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>SMS</span>
                        </button>

                        {/* Divider */}
                        <div className="w-px h-7 bg-neutral-700/60 shrink-0" />

                        {/* Live Track button */}
                        <button
                            onClick={onOpenLiveTracker}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/50 hover:to-amber-500/35 text-amber-400 font-bold text-xs py-2 px-3 rounded-lg transition-all border border-amber-500/40 active:scale-[0.97] shrink-0"
                            title="Live fare tracking with GPS"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Live</span>
                        </button>

                        {/* Divider */}
                        <div className="w-px h-7 bg-neutral-700/60 shrink-0" />

                        {/* Turn-by-turn toggle */}
                        <div
                            className="flex-1 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 rounded-lg px-2 py-1.5 transition-colors"
                            onClick={() => setShowSteps(!showSteps)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-primary-500/20 p-1 rounded-md border border-primary-500/30">
                                    <Navigation className="w-3 h-3 text-primary-400" />
                                </div>
                                <span className="text-xs font-bold text-white">Steps</span>
                            </div>
                        </div>
                    </div>

                    {showSteps && (
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {routeInfo.steps.map((step, index) => (
                                <div key={index} className="flex gap-3 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center text-[10px] font-bold text-neutral-400 group-hover:bg-primary-500/20 group-hover:text-primary-400 group-hover:border-primary-500/50 transition-colors shrink-0">
                                            {index + 1}
                                        </div>
                                        {index < routeInfo.steps.length - 1 && (
                                            <div className="w-0.5 h-full bg-neutral-800 my-1 group-hover:bg-neutral-700 transition-colors" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div
                                            className="text-xs text-neutral-300 leading-relaxed font-medium [&>b]:text-white [&>b]:font-black"
                                            dangerouslySetInnerHTML={{ __html: step.instructions }}
                                        />
                                        <div className="text-[10px] font-bold text-neutral-500 tracking-wider mt-1.5 bg-neutral-800/50 inline-block px-1.5 py-0.5 rounded">
                                            {step.distance.text} • {step.duration.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-3">
                                <MapPin className="w-6 h-6 p-1 text-rose-500 shrink-0" />
                                <div className="text-xs font-bold text-white pt-1">
                                    Arrive at {destination?.name || 'Destination'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default DrivingView;

```

## src/features/driving/LiveFareTracker.jsx

```javascript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Play, Square, RotateCcw, Navigation, Clock, Gauge, MapPin, TrendingUp, Fuel, DollarSign, Timer, Zap } from 'lucide-react';

// Haversine formula – returns distance in kilometers
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const WAIT_SPEED_THRESHOLD = 5; // km/h — below this is "waiting"
const MIN_ACCURACY = 50; // meters — ignore inaccurate fixes
const MIN_DISTANCE = 0.005; // km (5m) — noise filter

const LiveFareTracker = ({ isVisible, onClose, fareData }) => {
    // ---- Tracking state (persists across show/hide) ----
    const [trackingState, setTrackingState] = useState('idle'); // 'idle' | 'tracking' | 'stopped'
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalWaitTime, setTotalWaitTime] = useState(0); // seconds
    const [elapsedTime, setElapsedTime] = useState(0); // seconds
    const [currentSpeed, setCurrentSpeed] = useState(0); // km/h
    const [currentFare, setCurrentFare] = useState(0);
    const [positionCount, setPositionCount] = useState(0);
    const [gpsAccuracy, setGpsAccuracy] = useState(null);
    const [lastLocationName, setLastLocationName] = useState(null);

    // Refs for values that need to survive across watchPosition callbacks
    const lastPositionRef = useRef(null);
    const lastTimestampRef = useRef(null);
    const watchIdRef = useRef(null);
    const timerIdRef = useRef(null);
    const waitAccumulatorRef = useRef(0);
    const distanceAccumulatorRef = useRef(0);
    const startTimeRef = useRef(null);
    const elapsedAtPauseRef = useRef(0);
    const isWaitingRef = useRef(true); // start as waiting until first GPS movement detected

    // Fare parameters from parent (with defaults)
    const mileage = fareData?.mileage ?? 0.10; // L/km
    const costPerLiter = fareData?.costPerLiter ?? 145;
    const serviceMultiplier = fareData?.serviceMultiplier ?? 3;
    const waitMultiplier = fareData?.waitMultiplier ?? 2.5;

    // ---- Fare calculation ----
    const computeFare = useCallback((dist, waitSecs) => {
        const fuelCost = dist * mileage * costPerLiter;
        const baseFare = fuelCost * serviceMultiplier * 2; // round-trip fuel estimate
        const waitCharge = (waitSecs / 60) * waitMultiplier * 2;
        return baseFare + waitCharge;
    }, [mileage, costPerLiter, serviceMultiplier, waitMultiplier]);

    // ---- Update fare whenever distance or wait changes ----
    useEffect(() => {
        setCurrentFare(computeFare(totalDistance, totalWaitTime));
    }, [totalDistance, totalWaitTime, computeFare]);

    // ---- Elapsed time ticker (also accumulates wait time continuously) ----
    useEffect(() => {
        if (trackingState === 'tracking') {
            timerIdRef.current = setInterval(() => {
                const now = Date.now();
                const elapsed = elapsedAtPauseRef.current + Math.floor((now - startTimeRef.current) / 1000);
                setElapsedTime(elapsed);

                // Accumulate wait time every second when speed is below threshold
                if (isWaitingRef.current) {
                    waitAccumulatorRef.current += 1;
                    setTotalWaitTime(waitAccumulatorRef.current);
                    // Recalculate fare so the UI stays live
                    setCurrentFare(computeFare(distanceAccumulatorRef.current, waitAccumulatorRef.current));
                }
            }, 1000);
        }
        return () => {
            if (timerIdRef.current) clearInterval(timerIdRef.current);
        };
    }, [trackingState, computeFare]);

    // ---- GPS watchPosition handler ----
    const handlePosition = useCallback((position) => {
        const { latitude, longitude, accuracy, speed: gpsSpeed } = position.coords;
        const timestamp = position.timestamp;

        setGpsAccuracy(Math.round(accuracy));
        setPositionCount(c => c + 1);

        // Ignore low-accuracy fixes
        if (accuracy > MIN_ACCURACY) return;

        const lastPos = lastPositionRef.current;
        const lastTime = lastTimestampRef.current;

        if (lastPos && lastTime) {
            const dist = haversineDistance(lastPos.lat, lastPos.lng, latitude, longitude);
            const timeDelta = (timestamp - lastTime) / 1000; // seconds

            // Compute speed from GPS or from position delta
            let speedKmh = 0;
            if (gpsSpeed != null && gpsSpeed >= 0) {
                speedKmh = gpsSpeed * 3.6; // m/s → km/h
            } else if (timeDelta > 0) {
                speedKmh = (dist / timeDelta) * 3600; // km/s → km/h
            }
            setCurrentSpeed(Math.round(speedKmh));

            // Update waiting flag so the timer interval can accumulate wait time
            isWaitingRef.current = speedKmh < WAIT_SPEED_THRESHOLD;

            // Only accumulate distance if it exceeds noise threshold
            if (dist >= MIN_DISTANCE) {
                distanceAccumulatorRef.current += dist;
                setTotalDistance(distanceAccumulatorRef.current);
            }
        } else {
            // First fix — compute speed from GPS if available
            if (gpsSpeed != null && gpsSpeed >= 0) {
                setCurrentSpeed(Math.round(gpsSpeed * 3.6));
            }
        }

        lastPositionRef.current = { lat: latitude, lng: longitude };
        lastTimestampRef.current = timestamp;
    }, []);

    // ---- Start tracking ----
    const startTracking = useCallback(() => {
        if (!navigator.geolocation) return;

        setTrackingState('tracking');
        startTimeRef.current = Date.now();
        elapsedAtPauseRef.current = 0;
        isWaitingRef.current = true;

        // Reset accumulators
        lastPositionRef.current = null;
        lastTimestampRef.current = null;
        distanceAccumulatorRef.current = 0;
        waitAccumulatorRef.current = 0;
        setTotalDistance(0);
        setTotalWaitTime(0);
        setElapsedTime(0);
        setCurrentSpeed(0);
        setPositionCount(0);
        setGpsAccuracy(null);
        setCurrentFare(0);

        watchIdRef.current = navigator.geolocation.watchPosition(
            handlePosition,
            (error) => console.warn('GPS error:', error.message),
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        );
    }, [handlePosition]);

    // ---- Stop tracking ----
    const stopTracking = useCallback(() => {
        if (watchIdRef.current != null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
        }
        setTrackingState('stopped');
    }, []);

    // ---- Reset (back to idle) ----
    const resetTracking = useCallback(() => {
        stopTracking();
        setTrackingState('idle');
        setTotalDistance(0);
        setTotalWaitTime(0);
        setElapsedTime(0);
        setCurrentSpeed(0);
        setCurrentFare(0);
        setPositionCount(0);
        setGpsAccuracy(null);
        lastPositionRef.current = null;
        lastTimestampRef.current = null;
        distanceAccumulatorRef.current = 0;
        waitAccumulatorRef.current = 0;
        elapsedAtPauseRef.current = 0;
        isWaitingRef.current = true;
    }, [stopTracking]);

    // ---- Cleanup on unmount ----
    useEffect(() => {
        return () => {
            if (watchIdRef.current != null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (timerIdRef.current) clearInterval(timerIdRef.current);
        };
    }, []);

    // ---- Helpers ----
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const formatNum = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const fuelCost = totalDistance * mileage * costPerLiter * 2;
    const waitCharge = (totalWaitTime / 60) * waitMultiplier * 2;
    const netGain = currentFare - fuelCost;

    return (
        <div className={`absolute inset-0 bg-neutral-900 flex flex-col z-[60] transition-all duration-300 ease-in-out ${isVisible
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none translate-y-4'
            }`}>

            {/* Header */}
            <div className="flex items-center gap-3 p-3 border-b border-neutral-800">
                <button
                    onClick={onClose}
                    className="p-2.5 bg-neutral-800/80 border border-neutral-700/50 rounded-xl text-neutral-400 hover:text-white transition-all hover:bg-neutral-700 active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Live Fare Tracker
                    </h2>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5 text-left">
                        Real-time GPS Tracking
                    </p>
                </div>
                {trackingState === 'tracking' && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                    </div>
                )}
                {gpsAccuracy != null && trackingState === 'tracking' && (
                    <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${gpsAccuracy <= 15 ? 'bg-emerald-500/20 text-emerald-400' : gpsAccuracy <= 30 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        ±{gpsAccuracy}m
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto scrollbar-hide">

                {/* Elapsed Timer — Big Display */}
                <div className="text-center py-2">
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-1">Elapsed Time</p>
                    <p className={`text-5xl font-black font-mono tracking-wider ${trackingState === 'tracking' ? 'text-white' : trackingState === 'stopped' ? 'text-amber-400' : 'text-neutral-600'
                        }`}>
                        {formatTime(elapsedTime)}
                    </p>
                </div>

                {/* Live Fare — Hero Card */}
                <div className={`rounded-2xl p-3 border transition-all duration-500 ${trackingState === 'tracking'
                    ? 'bg-gradient-to-br from-primary-900/40 to-primary-800/20 border-primary-500/50 shadow-[0_0_30px_rgba(14,165,233,0.15)]'
                    : trackingState === 'stopped'
                        ? 'bg-gradient-to-br from-amber-900/30 to-neutral-800/50 border-amber-500/40'
                        : 'bg-neutral-800/40 border-neutral-700/40'
                    }`}>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-[0.15em]">
                                {trackingState === 'stopped' ? 'Final Fare' : 'Running Fare'}
                            </p>
                            <p className={`text-4xl font-black mt-0.5 ${trackingState === 'tracking' ? 'text-primary-400' : trackingState === 'stopped' ? 'text-amber-400' : 'text-neutral-600'
                                }`}>
                                {formatNum(currentFare)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Per Head</p>
                            <p className={`text-xl font-black ${trackingState !== 'idle' ? 'text-primary-300' : 'text-neutral-600'}`}>
                                {formatNum(currentFare / 4)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Speed + Distance Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-2.5 border transition-colors ${currentSpeed > 0 && trackingState === 'tracking'
                        ? 'bg-emerald-900/20 border-emerald-500/40'
                        : 'bg-neutral-800/40 border-neutral-700/40'
                        }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Gauge className={`w-3 h-3 ${currentSpeed > 0 ? 'text-emerald-400' : 'text-neutral-500'}`} />
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Speed</span>
                        </div>
                        <p className={`text-2xl font-black font-mono ${currentSpeed > 0 ? 'text-emerald-400' : 'text-neutral-600'}`}>
                            {currentSpeed}
                        </p>
                        <p className="text-[8px] text-neutral-600 font-bold">KM/H</p>
                    </div>

                    <div className={`rounded-xl p-2.5 border transition-colors ${totalDistance > 0
                        ? 'bg-primary-900/20 border-primary-500/40'
                        : 'bg-neutral-800/40 border-neutral-700/40'
                        }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Navigation className={`w-3 h-3 ${totalDistance > 0 ? 'text-primary-400' : 'text-neutral-500'}`} />
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Distance</span>
                        </div>
                        <p className={`text-2xl font-black font-mono ${totalDistance > 0 ? 'text-primary-400' : 'text-neutral-600'}`}>
                            {totalDistance.toFixed(2)}
                        </p>
                        <p className="text-[8px] text-neutral-600 font-bold">KM</p>
                    </div>
                </div>

                {/* Wait Time + Fuel Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-2.5 border transition-colors ${totalWaitTime > 0
                        ? 'bg-amber-900/20 border-amber-500/40'
                        : 'bg-neutral-800/40 border-neutral-700/40'
                        }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Timer className={`w-3 h-3 ${totalWaitTime > 0 ? 'text-amber-400' : 'text-neutral-500'}`} />
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Wait Time</span>
                        </div>
                        <p className={`text-lg font-black font-mono ${totalWaitTime > 0 ? 'text-amber-400' : 'text-neutral-600'}`}>
                            {formatTime(Math.round(totalWaitTime))}
                        </p>
                        <p className="text-[8px] text-neutral-600 font-bold">
                            Charge: {formatNum(waitCharge)}
                        </p>
                    </div>

                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-neutral-700/40">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Fuel className="w-3 h-3 text-neutral-500" />
                            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Fuel Cost</span>
                        </div>
                        <p className={`text-lg font-black font-mono ${fuelCost > 0 ? 'text-rose-400' : 'text-neutral-600'}`}>
                            {formatNum(fuelCost)}
                        </p>
                        <p className={`text-[8px] font-bold ${netGain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            Net: {netGain >= 0 ? '+' : ''}{formatNum(netGain)}
                        </p>
                    </div>
                </div>

                {/* Trip Summary (shown when stopped) */}
                {trackingState === 'stopped' && (
                    <div className="bg-gradient-to-br from-amber-900/20 to-neutral-800/40 rounded-xl p-2.5 border border-amber-500/30 space-y-1.5">
                        <p className="text-[9px] font-bold text-amber-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3" /> Trip Summary
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Distance</p>
                                <p className="text-sm font-black text-white">{totalDistance.toFixed(2)} km</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Duration</p>
                                <p className="text-sm font-black text-white">{formatTime(elapsedTime)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Avg Speed</p>
                                <p className="text-sm font-black text-white">
                                    {elapsedTime > 0 ? Math.round((totalDistance / elapsedTime) * 3600) : 0} km/h
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-neutral-700/50">
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Total Fare</p>
                                <p className="text-sm font-black text-amber-400">{formatNum(currentFare)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Fuel</p>
                                <p className="text-sm font-black text-rose-400">{formatNum(fuelCost)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Net Gain</p>
                                <p className={`text-sm font-black ${netGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {formatNum(netGain)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fare Parameters Info */}
                {trackingState === 'idle' && (
                    <div className="bg-neutral-800/30 rounded-xl p-3 border border-neutral-700/30 space-y-1.5">
                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Fare Parameters</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Mileage</span>
                                <span className="text-white font-bold">{mileage} L/km</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Fuel Cost</span>
                                <span className="text-white font-bold">{costPerLiter}/L</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Service ×</span>
                                <span className="text-white font-bold">{serviceMultiplier}×</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Wait ×</span>
                                <span className="text-white font-bold">{waitMultiplier}×</span>
                            </div>
                        </div>
                        <p className="text-[8px] text-neutral-600 pt-1 border-t border-neutral-700/30">
                            These values come from your Ride Fare calculator. Change them there to adjust live tracking rates.
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="p-3 border-t border-neutral-800 space-y-2">
                {trackingState === 'idle' && (
                    <button
                        onClick={startTracking}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-base py-3 rounded-xl shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        <Play className="w-5 h-5" fill="currentColor" />
                        Start Tracking
                    </button>
                )}

                {trackingState === 'tracking' && (
                    <button
                        onClick={stopTracking}
                        className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black text-base py-3 rounded-xl shadow-lg shadow-rose-900/30 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-3 uppercase tracking-widest animate-pulse"
                    >
                        <Square className="w-5 h-5" fill="currentColor" />
                        Stop Tracking
                    </button>
                )}

                {trackingState === 'stopped' && (
                    <div className="flex gap-2">
                        <button
                            onClick={resetTracking}
                            className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold text-sm py-3 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                            <RotateCcw className="w-4 h-4" />
                            New Trip
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-sm py-3 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                            <DollarSign className="w-4 h-4" />
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveFareTracker;

```

## src/features/flow/CashFlowCalculator.jsx

```javascript
import React, { useState, useRef } from 'react';
import { calculateNPV, calculateIRR, calculateMIRR, calculatePaybackPeriod, calculateDiscountedPaybackPeriod, calculateProfitabilityIndex } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Plus, Trash2, Info, HelpCircle, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const CashFlowCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [rate, setRate] = useState(10);
    const [reinvestRate, setReinvestRate] = useState(10);
    const [flows, setFlows] = useState([-10000, 2000, 3000, 4000, 5000]);
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for input focus
    const rateRef = useRef(null);
    const reinvestRateRef = useRef(null);
    const flowRefs = useRef([]);

    const clearRate = (setter, ref) => {
        setter(null);
        setResult(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const clearFlow = (index) => {
        const newFlows = [...flows];
        newFlows[index] = null;
        setFlows(newFlows);
        setResult(null);
        setTimeout(() => flowRefs.current[index]?.focus(), 0);
    };

    const handleCalculate = () => {
        const r = rate || 0;
        const rr = reinvestRate || 0;
        const cleanFlows = flows.map(f => f || 0);

        const res = {
            npv: calculateNPV(r, cleanFlows),
            irr: calculateIRR(cleanFlows),
            mirr: calculateMIRR(cleanFlows, r, rr),
            payback: calculatePaybackPeriod(cleanFlows),
            discountedPayback: calculateDiscountedPaybackPeriod(cleanFlows, r),
            pi: calculateProfitabilityIndex(cleanFlows, r)
        };
        setResult(res);
        addToHistory('FLOW', { rate: r, reinvestRate: rr, flows: cleanFlows.join(', ') }, res);
    };

    const updateFlow = (index, val) => {
        const newFlows = [...flows];
        newFlows[index] = val === '' ? null : (parseFloat(val.replace(/,/g, '')) || 0);
        setFlows(newFlows);
        setResult(null);
    };

    const formatYear = (val) => val === null ? 'Never' : `${val.toFixed(2)} Years`;

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Cash Flow</h1>
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                    title="Show Info"
                >
                    <Info className="w-3 h-3" />
                </button>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Cash Flow Analyzer (NPV & IRR)</p>
                    <p className="text-[11px] leading-relaxed">
                        Evaluate investments with uneven cash flows. Calculate NPV (Net Present Value),
                        IRR (Internal Rate of Return), MIRR, Payback Period, Discounted Payback,
                        and Profitability Index.
                    </p>
                </div>
            )}

            <div className="bg-neutral-800/50 p-4 rounded-xl mb-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 items-start text-left">
                    <label 
                        onClick={() => clearRate(setRate, rateRef)}
                        className="font-bold text-neutral-300 text-[10px] uppercase tracking-wide cursor-pointer hover:text-primary-400 transition-colors"
                        title="Click to Clear"
                    >
                        Finance Rate (%)
                    </label>
                    <FormattedNumberInput
                        ref={rateRef}
                        value={rate}
                        onChange={(e) => {
                            const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                            setRate(val);
                            setResult(null);
                        }}
                        className="bg-transparent text-left text-lg font-mono text-primary-400 focus:outline-none w-full border-b border-primary-500/50"
                        placeholder="0.00"
                    />
                </div>
                <div className="flex flex-col gap-1 items-start text-left">
                    <label 
                        onClick={() => clearRate(setReinvestRate, reinvestRateRef)}
                        className="font-bold text-neutral-300 text-[10px] uppercase tracking-wide cursor-pointer hover:text-secondary-400 transition-colors"
                        title="Click to Clear"
                    >
                        Reinvest Rate (%)
                    </label>
                    <FormattedNumberInput
                        ref={reinvestRateRef}
                        value={reinvestRate}
                        onChange={(e) => {
                            const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                            setReinvestRate(val);
                            setResult(null);
                        }}
                        className="bg-transparent text-left text-lg font-mono text-secondary-400 focus:outline-none w-full border-b border-secondary-500/50"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4 scrollbar-hide">
                {flows.map((flow, i) => (
                    <div key={i} className="flex items-center gap-3 bg-neutral-800/30 p-3 rounded-lg border border-transparent focus-within:border-neutral-700">
                        <span 
                            onClick={() => clearFlow(i)}
                            className="text-[10px] font-bold text-neutral-500 w-8 cursor-pointer hover:text-primary-400 transition-colors"
                            title="Click to Clear"
                        >
                            CF {i}
                        </span>
                        <FormattedNumberInput 
                            ref={el => flowRefs.current[i] = el}
                            value={flow} 
                            onChange={(e) => updateFlow(i, e.target.value)} 
                            className="flex-1 bg-transparent text-right font-mono text-white focus:outline-none" 
                        />
                        {i > 0 && <button onClick={() => setFlows(flows.filter((_, idx) => idx !== i))} className="text-neutral-600 hover:text-red-400"><Trash2 size={16} /></button>}
                    </div>
                ))}
                <button onClick={() => setFlows([...flows, 0])} className="w-full py-3 border border-dashed border-neutral-700 rounded-lg text-neutral-500 hover:text-primary-500 hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Cash Flow
                </button>
            </div>

            {result && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="col-span-2 flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                        <button
                            onClick={() => setShowHistory(true)}
                            className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                        >
                            <History size={12} /> View History
                        </button>
                    </div>
                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 col-span-2 grid grid-cols-3 gap-3">
                        {[{ label: 'NPV', value: result.npv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), color: 'white' },
                        { label: 'IRR', value: `${result.irr.toFixed(2)}%`, color: 'primary-500' },
                        { label: 'MIRR', value: `${result.mirr.toFixed(2)}%`, color: 'secondary-400' }].map(item => (
                            <div key={item.label}>
                                <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">{item.label}</div>
                                <div className={`text-sm font-bold text-${item.color} font-mono break-all`}>{item.value}</div>
                            </div>
                        ))}
                        <div className="col-span-3 border-t border-neutral-800 pt-2 mt-1 flex justify-between items-center px-1">
                            <div className="text-neutral-500 text-[10px] uppercase font-bold">Profitability Index</div>
                            <div className="text-sm font-bold text-white font-mono">{result.pi.toFixed(2)}</div>
                        </div>
                    </div>
                    {[{ label: 'Payback', value: formatYear(result.payback) }, { label: 'Discounted Payback', value: formatYear(result.discountedPayback) }].map(item => (
                        <div key={item.label} className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                            <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">{item.label}</div>
                            <div className="text-sm font-bold text-white font-mono">{item.value}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-1.5">
                <button
                    onClick={() => {
                        setRate(0);
                        setReinvestRate(0);
                        setFlows([0]);
                        setResult(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest">
                    <CalculateIcon className="w-5 h-5" /> Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="FLOW"
                title="Cash Flow"
            />
        </div>
    );
};

export default CashFlowCalculator;

```

## src/features/goal/GoalPlanner.jsx

```javascript
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Target, TrendingUp, Wallet, PiggyBank, Calculator, Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

// Constants
const FREQUENCIES = [
    { label: 'Annually (1)', value: 1 },
    { label: 'Semi-Annually (2)', value: 2 },
    { label: 'Quarterly (4)', value: 4 },
    { label: 'Monthly (12)', value: 12 },
    { label: 'Semi-Monthly (24)', value: 24 },
    { label: 'Bi-Weekly (26)', value: 26 },
    { label: 'Weekly (52)', value: 52 },
];

const SOLVE_MODES = [
    { id: 'pmt', label: 'Annuity Only', desc: 'No initial deposit, regular payments only', icon: TrendingUp },
    { id: 'pv', label: 'Lump Sum Only', desc: 'Single deposit, no regular payments', icon: Wallet },
    { id: 'combo', label: 'PV + Annuity', desc: 'Combine initial deposit with payments', icon: PiggyBank },
];

const GoalPlanner = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    // Core state
    const [mode, setMode] = useState('END');
    const [frequency, setFrequency] = useState(12);
    const [solveMode, setSolveMode] = useState('pmt'); // 'pmt', 'pv', or 'combo'

    // Input values
    const [targetFV, setTargetFV] = useState(1000000); // Target Future Value
    const [years, setYears] = useState(30); // Years to goal
    const [rate, setRate] = useState(10); // Annual interest rate
    const [pvRatio, setPvRatio] = useState(0); // For combo mode: % of total contributions from PV (0-100)
    const [knownPV, setKnownPV] = useState(0); // For combo mode: known PV amount
    const [knownPMT, setKnownPMT] = useState(0); // For combo mode: known PMT amount

    // Results
    const [results, setResults] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showPvRatioHelp, setShowPvRatioHelp] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const bottomRef = useRef(null);

    // Refs for input focus
    const targetFVRef = useRef(null);
    const yearsRef = useRef(null);
    const rateRef = useRef(null);
    const knownPVRef = useRef(null);
    const knownPMTRef = useRef(null);
    const pvRatioRef = useRef(null);

    const clearField = (setter, ref) => {
        setter(null);
        setResults(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    // Auto-scroll to bottom when results are calculated
    useEffect(() => {
        if (results && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [results]);

    // Calculate effective rate per period (matches TVM calculator logic)
    // I/Y is treated as nominal annual rate (APR), same as standard financial calculators
    const getPeriodicRate = () => {
        // Standard approach: nominal rate / periods per year
        // When compounding frequency = payment frequency, this gives the correct periodic rate
        const nominalRate = rate / 100;
        return nominalRate / frequency;
    };

    // Calculate FV factor for PV
    const getFVFactorPV = (r, n) => {
        return Math.pow(1 + r, n);
    };

    // Calculate FV factor for PMT (annuity)
    const getFVFactorPMT = (r, n, isBegin) => {
        if (Math.abs(r) < 1e-9) return n;
        const factor = (Math.pow(1 + r, n) - 1) / r;
        return isBegin ? factor * (1 + r) : factor;
    };

    const handleCalculate = () => {
        try {
            const r = getPeriodicRate();
            const yrs = years || 0;
            const n = yrs * frequency;
            const isBegin = mode === 'BEGIN';
            const fv = targetFV || 0;

            const fvFactorPV = getFVFactorPV(r, n);
            const fvFactorPMT = getFVFactorPMT(r, n, isBegin);

            let calculatedPV = 0;
            let calculatedPMT = 0;
            let totalContributions = 0;
            let totalInterestEarned = 0;
            let exceedsSuggestion = null;

            if (solveMode === 'pmt') {
                // Solve for PMT only (PV = 0)
                calculatedPV = 0;
                calculatedPMT = (targetFV || 0) / fvFactorPMT;
                totalContributions = calculatedPMT * n;
            } else if (solveMode === 'pv') {
                // Solve for PV only (PMT = 0)
                calculatedPMT = 0;
                calculatedPV = (targetFV || 0) / fvFactorPV;
                totalContributions = calculatedPV;
            } else if (solveMode === 'combo') {
                const fv = targetFV || 0;
                const kpv = knownPV || 0;
                const kpmt = knownPMT || 0;
                const ratio = pvRatio || 0;

                // Combo mode: Calculate based on ratio or known values
                if (kpv > 0 && kpmt === 0) {
                    // User specified PV, solve for PMT
                    calculatedPV = kpv;
                    const pvContributionToFV = calculatedPV * fvFactorPV;
                    if (pvContributionToFV >= fv) {
                        // PV alone exceeds target - no PMT needed
                        calculatedPMT = 0;
                        totalContributions = calculatedPV;
                    } else {
                        const remainingFV = fv - pvContributionToFV;
                        calculatedPMT = remainingFV / fvFactorPMT;
                        totalContributions = calculatedPV + (calculatedPMT * n);
                    }
                } else if (kpmt > 0 && kpv === 0) {
                    // User specified PMT, solve for PV
                    calculatedPMT = kpmt;
                    const pmtContributionToFV = calculatedPMT * fvFactorPMT;
                    if (pmtContributionToFV >= fv) {
                        // PMT alone exceeds or meets target - no PV needed
                        calculatedPV = 0;
                        totalContributions = calculatedPMT * n;
                        // Calculate what they'll actually get and what PMT they'd need
                        const actualFV = pmtContributionToFV;
                        const optimalPMT = fv / fvFactorPMT;
                        exceedsSuggestion = {
                            type: 'pmt_exceeds',
                            actualFV,
                            optimalPMT,
                            currentPMT: kpmt,
                            actualInterest: actualFV - totalContributions,
                            interestPercent: ((actualFV - totalContributions) / actualFV * 100).toFixed(0)
                        };
                    } else {
                        calculatedPV = (fv - pmtContributionToFV) / fvFactorPV;
                        totalContributions = calculatedPV + (calculatedPMT * n);
                    }
                } else if (ratio >= 0 && ratio <= 100) {
                    // Use ratio: pvRatio% comes from PV, (100-pvRatio)% from PMT contributions
                    const pvPortion = ratio / 100;
                    const pmtPortion = 1 - pvPortion;
                    const combinedFactor = (pvPortion * fvFactorPV) + ((pmtPortion / n) * fvFactorPMT);
                    totalContributions = fv / combinedFactor;
                    calculatedPV = totalContributions * pvPortion;
                    calculatedPMT = (totalContributions * pmtPortion) / n;
                } else {
                    // Default: Equal weight to PV and total PMT contributions
                    const combinedFactor = (n * fvFactorPV) + fvFactorPMT;
                    calculatedPMT = fv / combinedFactor;
                    calculatedPV = calculatedPMT * n;
                    totalContributions = calculatedPV + (calculatedPMT * n);
                }
            }

            totalInterestEarned = (targetFV || 0) - totalContributions;

            // Calculate actionable insights
            const insights = calculateInsights(calculatedPMT, calculatedPV, totalContributions, totalInterestEarned, years, frequency, rate);

            const newResults = {
                pv: Math.abs(calculatedPV),
                pmt: Math.abs(calculatedPMT),
                annualPMT: Math.abs(calculatedPMT) * frequency,
                totalContributions: Math.abs(totalContributions),
                totalInterest: Math.abs(totalInterestEarned),
                targetFV,
                years,
                rate,
                frequency,
                mode,
                solveMode,
                insights,
                exceedsSuggestion
            };

            setResults(newResults);

            // Add to history
            addToHistory('GoalPlanner',
                { targetFV, years, rate, frequency, mode, solveMode, pvRatio, knownPV, knownPMT },
                newResults
            );

        } catch (error) {
            console.error('Calculation error:', error);
            setResults({ error: 'Calculation Error' });
        }
    };

    // Calculate actionable insights
    const calculateInsights = (pmt, pv, totalContrib, totalInterest, yrs, freq, annualRate) => {
        const freqLabels = { 1: 'year', 2: 'six months', 4: 'quarter', 12: 'month', 24: 'half-month', 26: 'two weeks', 52: 'week' };
        const freqLabel = freqLabels[freq] || 'period';

        // Calculate interest as percentage of final value
        const interestPercent = ((totalInterest / (totalContrib + totalInterest)) * 100).toFixed(0);

        // Calculate daily equivalent
        const dailySavings = (pmt * freq) / 365;

        // Calculate what happens if you wait 5 years
        const r = Math.pow(1 + annualRate / 100, 1 / freq) - 1;
        const shorterYears = Math.max(1, yrs - 5);
        const shorterN = shorterYears * freq;
        const isBegin = mode === 'BEGIN';
        const fvFactorShorter = getFVFactorPMT(r, shorterN, isBegin);
        const pmtIfWait5Years = targetFV / fvFactorShorter;
        const increasedPmt = pmtIfWait5Years - pmt;
        const increasePercent = ((increasedPmt / pmt) * 100).toFixed(0);

        return {
            freqLabel,
            interestPercent,
            dailySavings,
            pmtIfWait5Years,
            increasedPmt,
            increasePercent,
            shorterYears
        };
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary-500" />
                        Goal Planner
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        PV + Annuity to Target FV
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title="Show Explanation"
                        >
                            <Info className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setMode(m => m === 'END' ? 'BEGIN' : 'END')}
                            className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-primary-500 hover:bg-neutral-700 transition-all"
                        >
                            {mode}
                        </button>
                    </div>
                    <select
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-neutral-300 focus:outline-none"
                    >
                        {FREQUENCIES.map(f => (
                            <option key={f.value} value={f.value}>
                                {f.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left shrink-0">
                    <p className="font-bold text-primary-400 mb-1">Financial Goal Planner</p>
                    <p className="text-[11px] leading-relaxed">
                        Calculate exactly how much to save to reach your target. Choose between
                        regular payments only, a one-time lump sum, or a combination of both.
                        Get clear action steps based on your timeline and expected returns.
                    </p>
                </div>
            )}

            {/* Solve Mode Selector */}
            <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl mb-4 shrink-0">
                {SOLVE_MODES.map(sm => (
                    <button
                        key={sm.id}
                        onClick={() => setSolveMode(sm.id)}
                        className={`flex-1 py-2 px-1.5 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 ${solveMode === sm.id
                            ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                            : 'bg-transparent text-neutral-500 hover:bg-neutral-800'}`}
                    >
                        <sm.icon className="w-3.5 h-3.5" />
                        <span>{sm.label}</span>
                    </button>
                ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-1.5 flex-1 overflow-y-auto min-h-0 pr-1">
                {/* Target FV */}
                <div className="group relative bg-neutral-800/40 rounded-lg p-2 transition-all duration-300 border border-primary-500/50 ring-1 ring-primary-500/10 bg-neutral-800/60">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col items-start text-left shrink-0">
                            <label 
                                onClick={() => clearField(setTargetFV, targetFVRef)}
                                className="text-xs font-bold text-primary-400 whitespace-nowrap cursor-pointer hover:text-white transition-colors"
                                title="Click to Clear"
                            >
                                Target FV
                            </label>
                            <span className="text-[8px] uppercase tracking-tighter text-neutral-500 font-bold whitespace-nowrap">Goal Amount</span>
                        </div>
                        <FormattedNumberInput
                            ref={targetFVRef}
                            value={targetFV}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setTargetFV(val);
                                setResults(null);
                            }}
                            decimals={0}
                            className="bg-transparent text-right text-base font-mono focus:outline-none w-full placeholder-neutral-700 text-primary-400 font-black"
                            placeholder="1,000,000"
                        />
                    </div>
                </div>

                {/* Years */}
                <div className="group relative bg-neutral-800/40 rounded-lg p-2 transition-all duration-300 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col items-start text-left shrink-0">
                            <label 
                                onClick={() => clearField(setYears, yearsRef)}
                                className="text-xs font-bold text-neutral-300 whitespace-nowrap cursor-pointer hover:text-primary-400 transition-colors"
                                title="Click to Clear"
                            >
                                Years
                            </label>
                            <span className="text-[8px] uppercase tracking-tighter text-neutral-500 font-bold whitespace-nowrap">Time to Goal</span>
                        </div>
                        <FormattedNumberInput
                            ref={yearsRef}
                            value={years}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setYears(val);
                                setResults(null);
                            }}
                            decimals={0}
                            className="bg-transparent text-right text-base font-mono focus:outline-none w-full placeholder-neutral-700 text-white"
                            placeholder="30"
                        />
                    </div>
                </div>

                {/* Interest Rate */}
                <div className="group relative bg-neutral-800/40 rounded-lg p-2 transition-all duration-300 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col items-start text-left shrink-0">
                            <label 
                                onClick={() => clearField(setRate, rateRef)}
                                className="text-xs font-bold text-neutral-300 whitespace-nowrap cursor-pointer hover:text-primary-400 transition-colors"
                                title="Click to Clear"
                            >
                                I/Y %
                            </label>
                            <span className="text-[8px] uppercase tracking-tighter text-neutral-500 font-bold whitespace-nowrap">Annual Rate</span>
                        </div>
                        <FormattedNumberInput
                            ref={rateRef}
                            value={rate}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setRate(val);
                                setResults(null);
                            }}
                            decimals={2}
                            className="bg-transparent text-right text-base font-mono focus:outline-none w-full placeholder-neutral-700 text-white"
                            placeholder="10"
                        />
                    </div>
                </div>

                {/* Combo Mode Options */}
                {solveMode === 'combo' && (
                    <div className="bg-neutral-900/50 rounded-xl p-3 border border-neutral-700 space-y-2">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            Specify one: PV, PMT, or Ratio
                        </p>

                        {/* Known PV */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col items-start text-left">
                                <label 
                                    onClick={() => clearField(setKnownPV, knownPVRef)}
                                    className="text-xs font-bold text-neutral-400 cursor-pointer hover:text-white transition-colors"
                                    title="Click to Clear"
                                >
                                    Initial PV
                                </label>
                                <span className="text-[8px] uppercase tracking-tighter text-neutral-600 font-bold">Lump Sum</span>
                            </div>
                            <FormattedNumberInput
                                ref={knownPVRef}
                                value={knownPV}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setKnownPV(val);
                                    setKnownPMT(0);
                                    setPvRatio(0);
                                    setResults(null);
                                }}
                                decimals={0}
                                className="bg-neutral-800 rounded-lg px-2 py-1 text-right text-sm font-mono focus:outline-none w-24 placeholder-neutral-700 text-white"
                                placeholder="0"
                            />
                        </div>

                        {/* Known PMT */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col items-start text-left">
                                <label 
                                    onClick={() => clearField(setKnownPMT, knownPMTRef)}
                                    className="text-xs font-bold text-neutral-400 cursor-pointer hover:text-white transition-colors"
                                    title="Click to Clear"
                                >
                                    Fixed PMT
                                </label>
                                <span className="text-[8px] uppercase tracking-tighter text-neutral-600 font-bold">Per Period</span>
                            </div>
                            <FormattedNumberInput
                                ref={knownPMTRef}
                                value={knownPMT}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setKnownPMT(val);
                                    setKnownPV(0);
                                    setPvRatio(0);
                                    setResults(null);
                                }}
                                decimals={0}
                                className="bg-neutral-800 rounded-lg px-2 py-1 text-right text-sm font-mono focus:outline-none w-24 placeholder-neutral-700 text-white"
                                placeholder="0"
                            />
                        </div>

                        {/* PV Ratio */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-2 text-left">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <label 
                                                onClick={() => clearField(setPvRatio, pvRatioRef)}
                                                className="text-xs font-bold text-neutral-400 cursor-pointer hover:text-white transition-colors"
                                                title="Click to Clear"
                                            >
                                                PV Ratio %
                                            </label>
                                            <button
                                                onClick={() => setShowPvRatioHelp(!showPvRatioHelp)}
                                                className={`p-0.5 rounded-full transition-all ${showPvRatioHelp ? 'text-primary-400 bg-primary-400/10' : 'text-neutral-600 hover:text-neutral-400'}`}
                                            >
                                                <HelpCircle className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="text-[8px] uppercase tracking-tighter text-neutral-600 font-bold">% from Lump Sum</span>
                                    </div>
                                </div>
                                <FormattedNumberInput
                                    ref={pvRatioRef}
                                    value={pvRatio}
                                    onChange={(e) => {
                                        const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                        setPvRatio(val);
                                        setKnownPV(0);
                                        setKnownPMT(0);
                                        setResults(null);
                                    }}
                                    decimals={0}
                                    className="bg-neutral-800 rounded-lg px-2 py-1 text-right text-sm font-mono focus:outline-none w-24 placeholder-neutral-700 text-white"
                                    placeholder="0"
                                />
                            </div>
                            {showPvRatioHelp && (
                                <div className="bg-neutral-800/50 rounded-lg p-2 text-[10px] text-neutral-400 border border-neutral-700/50 text-left">
                                    <p className="leading-relaxed">
                                        <span className="text-primary-400 font-bold">PV Ratio</span> determines the percentage of your goal funded by your initial lump sum versus regular contributions.
                                    </p>
                                    <p className="mt-1 leading-relaxed opacity-80">
                                        For example, a <span className="text-white">20%</span> PV Ratio means your starting deposit covers 20% of the target, while regular payments cover the remaining 80%.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* Results */}
                {results && !results.error && (
                    <div className="mt-4 bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-4 space-y-3 shrink-0">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                            >
                                <History size={12} /> View History
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {results.pv > 0 && (
                                <div className="bg-neutral-900/50 rounded-lg p-2.5">
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Initial Deposit (PV)</p>
                                    <p className="text-lg font-black text-primary-400">
                                        ${results.pv.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            )}
                            {results.pmt > 0 && (
                                <div className="bg-neutral-900/50 rounded-lg p-2.5">
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Payment (PMT)</p>
                                    <p className="text-lg font-black text-green-400">
                                        ${results.pmt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-[9px] text-neutral-500">
                                        ${results.annualPMT.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-700">
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Total Contributions</p>
                                <p className="text-sm font-bold text-white">
                                    ${results.totalContributions.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Interest Earned</p>
                                <p className="text-sm font-bold text-emerald-400">
                                    ${results.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        </div>

                        {/* Smart Suggestion when PMT exceeds target */}
                        {results.exceedsSuggestion && results.exceedsSuggestion.type === 'pmt_exceeds' && (() => {
                            // Check if user has taken the optimal choice
                            const isOption1Taken = Math.abs(results.targetFV - results.exceedsSuggestion.actualFV) < 1; // Target FV matches actualFV
                            const isOption2Taken = Math.abs(results.exceedsSuggestion.currentPMT - results.exceedsSuggestion.optimalPMT) < 0.01; // PMT matches optimalPMT

                            return (
                                <div className="pt-2 border-t border-neutral-700">
                                    <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                                        🎉 Great News!
                                    </p>
                                    <div className="text-[10px] text-neutral-300 space-y-2">
                                        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-2">
                                            <p className="font-bold text-emerald-400 mb-1">
                                                {isOption1Taken || isOption2Taken
                                                    ? "Your plan is fully optimized!"
                                                    : "Your payment exceeds your goal!"}
                                            </p>
                                            <p>At ${results.exceedsSuggestion.currentPMT.toLocaleString()}/{results.insights?.freqLabel || 'month'}, you'll actually reach <span className="text-white font-bold">${results.exceedsSuggestion.actualFV.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span></p>
                                            <p className="mt-1 text-emerald-400"><span className="font-bold">{results.exceedsSuggestion.interestPercent}%</span> comes from compound interest!</p>
                                        </div>

                                        <p className="font-bold text-white text-[9px] uppercase tracking-wider">Choose an option:</p>

                                        {isOption1Taken ? (
                                            <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-2">
                                                <p className="font-bold text-emerald-400 mb-1">✅ Option 1: Goal Maximized!</p>
                                                <p>Your Target FV of <span className="text-white font-bold">${results.targetFV.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> is perfectly aligned with what your ${results.exceedsSuggestion.currentPMT.toLocaleString()} payment can achieve.</p>
                                            </div>
                                        ) : (
                                            <div className="bg-primary-900/20 border border-primary-500/30 rounded-lg p-2">
                                                <p className="font-bold text-primary-400 mb-1">Option 1: Increase your goal</p>
                                                <p>Set Target FV to <span className="text-white font-bold">${results.exceedsSuggestion.actualFV.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> to maximize what your ${results.exceedsSuggestion.currentPMT.toLocaleString()} payment can achieve.</p>
                                            </div>
                                        )}

                                        {isOption2Taken ? (
                                            <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-2">
                                                <p className="font-bold text-emerald-400 mb-1">✅ Option 2: Payment Optimized!</p>
                                                <p>Your payment of <span className="text-white font-bold">${results.exceedsSuggestion.currentPMT.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>/{results.insights?.freqLabel || 'month'} is exactly what you need to reach your ${results.targetFV.toLocaleString()} goal.</p>
                                            </div>
                                        ) : (
                                            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-2">
                                                <p className="font-bold text-amber-400 mb-1">Option 2: Reduce your payment</p>
                                                <p>Pay only <span className="text-white font-bold">${results.exceedsSuggestion.optimalPMT.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>/{results.insights?.freqLabel || 'month'} to reach your ${results.targetFV.toLocaleString()} goal and save the difference.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Actionable Recommendations - only show if no exceeds suggestion */}
                        {results.insights && results.pmt > 0 && !results.exceedsSuggestion && (
                            <div className="pt-2 border-t border-neutral-700">
                                <p className="text-[9px] font-bold text-primary-400 uppercase tracking-wider mb-2">
                                    📋 Your Action Plan
                                </p>
                                <div className="text-[10px] text-neutral-300 space-y-2">
                                    <div className="bg-neutral-900/50 rounded-lg p-2">
                                        <p className="font-bold text-white mb-1">✅ What to do:</p>
                                        <p>Save <span className="text-green-400 font-bold">${results.pmt.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span> every {results.insights.freqLabel} for {results.years} years.</p>
                                        <p className="text-neutral-500 mt-1">That's just ${results.insights.dailySavings.toFixed(2)}/day</p>
                                    </div>

                                    <div className="bg-neutral-900/50 rounded-lg p-2">
                                        <p className="font-bold text-white mb-1">💰 What you'll get:</p>
                                        <p><span className="text-emerald-400 font-bold">{results.insights.interestPercent}%</span> of your final ${results.targetFV.toLocaleString()} comes from compound interest — money working for you.</p>
                                    </div>

                                    {results.years > 5 && (
                                        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-2">
                                            <p className="font-bold text-amber-400 mb-1">⚠️ Don't delay:</p>
                                            <p>Waiting 5 years means paying <span className="text-amber-400 font-bold">${Math.abs(results.insights.increasedPmt).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> more per {results.insights.freqLabel} ({results.insights.increasePercent}% increase).</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {results.insights && results.pv > 0 && results.pmt === 0 && (
                            <div className="pt-2 border-t border-neutral-700">
                                <p className="text-[9px] font-bold text-primary-400 uppercase tracking-wider mb-2">
                                    📋 Your Action Plan
                                </p>
                                <div className="text-[10px] text-neutral-300 space-y-2">
                                    <div className="bg-neutral-900/50 rounded-lg p-2">
                                        <p className="font-bold text-white mb-1">✅ What to do:</p>
                                        <p>Invest <span className="text-primary-400 font-bold">${results.pv.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> today and let it grow for {results.years} years.</p>
                                    </div>

                                    <div className="bg-neutral-900/50 rounded-lg p-2">
                                        <p className="font-bold text-white mb-1">💰 What you'll get:</p>
                                        <p>Your money will grow <span className="text-emerald-400 font-bold">{(results.targetFV / results.pv).toFixed(1)}x</span> through compound interest alone.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div ref={bottomRef} className="h-1" />
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-1.5 shrink-0">
                <button
                    onClick={() => {
                        setTargetFV(1000000);
                        setYears(30);
                        setRate(10);
                        setPvRatio(0);
                        setKnownPV(0);
                        setKnownPMT(0);
                        setResults(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="GoalPlanner"
                title="Goal Planner"
            />
        </div >
    );
};

export default GoalPlanner;

```

## src/features/help/HelpGuide.jsx

```javascript
import React, { useState, useEffect } from 'react';
import {
    HelpCircle, Calculator, Target, DollarSign, Activity, FileText, Percent,
    ChevronDown, ChevronUp, Book, Lightbulb, Hash, ArrowRight, History, Trash2, Receipt, Settings, Wallet, TrendingUp, Car
} from 'lucide-react';
import { MIN_YEAR, MAX_YEAR, FORECAST_END } from '../inflation/data';

// Map tab IDs to section IDs
const TAB_TO_SECTION = {
    tvm: 'tvm',
    goal: 'goal',
    loan: 'loan',
    pension: 'pension',
    inflation: 'inflation',
    flow: 'flow',
    bond: 'bond',
    rates: 'rates',
    tbill: 'tbill',
    transport: 'transport',
    history: 'history',
    settings: 'settings'
};

const HelpSection = ({ id, title, icon: Icon, children, isOpen, onToggle }) => {
    return (
        <div id={id} className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 overflow-hidden transition-all duration-300">
            <button
                onClick={() => onToggle(id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-700/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                        <Icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <span className="font-bold text-white">{title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-sm text-neutral-300 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

// ... InfoBox and FieldList components remain unchanged ...

const InfoBox = ({ type = 'tip', children }) => {
    const styles = {
        tip: 'bg-green-900/20 border-green-500/30 text-green-400',
        formula: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
        note: 'bg-amber-900/20 border-amber-500/30 text-amber-400'
    };
    const icons = {
        tip: Lightbulb,
        formula: Hash,
        note: Book
    };
    const Icon = icons[type];

    return (
        <div className={`p-3 rounded-lg border ${styles[type]}`}>
            <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-neutral-300 text-xs leading-relaxed">{children}</div>
            </div>
        </div>
    );
};

const FieldList = ({ fields }) => (
    <div className="space-y-2">
        {fields.map((field, i) => (
            <div key={i} className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 mt-1 text-primary-400 shrink-0" />
                <div>
                    <span className="font-bold text-white">{field.name}:</span>{' '}
                    <span className="text-neutral-400">{field.description}</span>
                </div>
            </div>
        ))}
    </div>
);

const HelpGuide = ({ activeTab = 'tvm' }) => {
    // Only one section open at a time
    const [openSection, setOpenSection] = useState(TAB_TO_SECTION[activeTab] || 'getting-started');

    // Update open section when activeTab changes
    useEffect(() => {
        const section = TAB_TO_SECTION[activeTab];
        if (section) {
            setOpenSection(section);
            // Scroll to the section after a brief delay to allow expansion
            setTimeout(() => {
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 350);
        }
    }, [activeTab]);

    // Also scroll on initial mount (component is conditionally rendered when help opens)
    useEffect(() => {
        const section = TAB_TO_SECTION[activeTab];
        if (section) {
            setTimeout(() => {
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 400);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggle = (sectionId) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };

    return (
        <div className="text-left space-y-3">

            {/* Getting Started */}
            <HelpSection
                id="getting-started"
                title="Getting Started"
                icon={Book}
                isOpen={openSection === 'getting-started'}
                onToggle={handleToggle}
            >
                <p>
                    Welcome to the Financial Calculator app! This app provides professional-grade
                    financial calculators for Time Value of Money (TVM), loans, bonds, cash flows,
                    and more.
                </p>
                <InfoBox type="tip">
                    <strong>Navigation:</strong> Use the bottom navigation bar to switch between calculators.
                    Each calculator saves your history automatically.
                </InfoBox>
                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Available Calculators:</p>
                    <ul className="space-y-1 text-xs">
                        <li>• <strong>TVM</strong> - Time Value of Money calculations</li>
                        <li>• <strong>Goal</strong> - Financial goal planning</li>
                        <li>• <strong>Loan</strong> - Loan payments & amortization</li>
                        <li>• <strong>Pension</strong> - Ethiopian pension calculator</li>
                        <li>• <strong>Inflation</strong> - Ethiopian Birr inflation calculator</li>
                        <li>• <strong>Flow</strong> - NPV, IRR & cash flow analysis</li>
                        <li>• <strong>Bond</strong> - Bond pricing & yields</li>
                        <li>• <strong>Rates</strong> - Interest rate conversions</li>
                        <li>• <strong>Ride</strong> - Ride Fare Calculator</li>
                        <li>• <strong>T-Bill</strong> - Treasury Bill bidding calculator</li>
                        <li>• <strong>History</strong> - View past calculations</li>
                    </ul>
                </div>
            </HelpSection>

            {/* TVM Calculator */}
            <HelpSection
                id="tvm"
                title="TVM Calculator"
                icon={Calculator}
                isOpen={openSection === 'tvm'}
                onToggle={handleToggle}
            >
                <p>
                    The Time Value of Money calculator solves for any variable in the TVM equation.
                    Select which variable to solve for using the buttons at the top, then enter
                    the known values and click Calculate.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Variables:</p>
                    <FieldList fields={[
                        { name: 'N', description: 'Total number of periods (or Years if toggle is set)' },
                        { name: 'I/Y', description: 'Annual interest rate (as a percentage)' },
                        { name: 'PV', description: 'Present Value - the current lump sum amount' },
                        { name: 'PMT', description: 'Payment - periodic payment amount' },
                        { name: 'FV', description: 'Future Value - the target amount at the end' },
                        { name: 'TI', description: 'Total Interest - total interest over the period' },
                        { name: 'ΣPmt', description: 'Total Payment - shows PMT × N when PV and PMT have opposite signs, otherwise PV + PMT × N (read only)' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Settings:</p>
                    <FieldList fields={[
                        { name: 'END/BEGIN', description: 'When payments occur - end of period (ordinary annuity) or beginning (annuity due)' },
                        { name: 'COMPOUND/SIMPLE', description: 'Type of interest calculation' },
                        { name: 'Frequency', description: 'Number of payments per year (monthly = 12, weekly = 52, etc.)' }
                    ]} />
                </div>

                <InfoBox type="note">
                    <strong>Cash Flow Sign Convention:</strong> Money going out (payments, investments) is negative.
                    Money coming in (receipts, returns) is positive. Match the signs correctly for accurate results.
                </InfoBox>

                <InfoBox type="formula">
                    <strong>TVM Formula:</strong> PV + PMT × [(1-(1+r)^-n)/r] + FV × (1+r)^-n = 0
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Advanced Mode:</strong> Click the gear icon to set different payment frequency (P/Y)
                    and compounding frequency (C/Y) when they differ.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Quick Clear:</strong> Click on any field's <strong>label</strong> 
                    (e.g., "PV") to instantly clear it and focus the input. 
                    The field remains blank while you are typing and only defaults to 0 
                    when you leave the field (blur) without entering a value.
                </InfoBox>
            </HelpSection>

            {/* Goal Planner */}
            <HelpSection
                id="goal"
                title="Goal Planner"
                icon={Target}
                isOpen={openSection === 'goal'}
                onToggle={handleToggle}
            >
                <p>
                    Plan how to reach a financial goal like retirement savings, education fund, or any
                    target amount. Choose between regular contributions, a lump sum, or a combination of both.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Modes:</p>
                    <FieldList fields={[
                        { name: 'Annuity Only', description: 'Calculate required periodic payments with no initial deposit' },
                        { name: 'Lump Sum Only', description: 'Calculate required one-time deposit with no periodic payments' },
                        { name: 'PV + Annuity', description: 'Combine an initial deposit with periodic payments' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">PV + Annuity Options:</p>
                    <FieldList fields={[
                        { name: 'Initial PV', description: 'Specify your initial lump sum, solve for required payment' },
                        { name: 'Fixed PMT', description: 'Specify your periodic payment, solve for required initial deposit' },
                        { name: 'PV Ratio %', description: 'Specify what percentage of total contributions should be from the initial deposit' }
                    ]} />
                </div>

                <InfoBox type="tip">
                    <strong>Smart Recommendations:</strong> If your specified payment exceeds your goal,
                    the calculator will suggest either increasing your goal or reducing your payment.
                </InfoBox>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results Include:</p>
                    <ul className="space-y-1 text-xs">
                        <li>• Required Initial Deposit (PV)</li>
                        <li>• Required Payment (PMT) per period</li>
                        <li>• Total Contributions</li>
                        <li>• Interest Earned</li>
                        <li>• Action plan with daily savings breakdown</li>
                        <li>• Cost of delaying 5 years</li>
                    </ul>
                </div>
            </HelpSection>

            {/* Loan Calculator */}
            <HelpSection
                id="loan"
                title="Loan Calculator"
                icon={DollarSign}
                isOpen={openSection === 'loan'}
                onToggle={handleToggle}
            >
                <p>
                    Calculate loan payments, total interest, and generate complete amortization schedules.
                    Track your outstanding balance at any point using dates or payment count.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Loan Amount', description: 'The principal amount being borrowed' },
                        { name: 'Interest Rate', description: 'Annual interest rate as a percentage' },
                        { name: 'Loan Term', description: 'Length of the loan in years' },
                        { name: 'Frequency', description: 'Payment frequency (monthly, bi-weekly, etc.)' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Date Mode vs Manual Mode:</p>
                    <FieldList fields={[
                        { name: 'Date Mode', description: 'Enter start date and future date to calculate payments made and outstanding balance' },
                        { name: 'Manual Mode', description: 'Directly enter the number of payments already made' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <ul className="space-y-1 text-xs">
                        <li>• Periodic Payment amount</li>
                        <li>• Total Interest over loan life</li>
                        <li>• Total Cost (principal + interest)</li>
                        <li>• Outstanding Balance at specified date</li>
                    </ul>
                </div>

                <InfoBox type="tip">
                    <strong>Amortization Schedule:</strong> Click "View Schedule" to see a complete breakdown
                    of each payment showing interest, principal, and remaining balance. Export to PDF or CSV!
                </InfoBox>

                <InfoBox type="formula">
                    <strong>Payment Formula:</strong> PMT = PV × [r(1+r)^n] / [(1+r)^n - 1]
                    <br />where r = periodic rate, n = total periods
                </InfoBox>
            </HelpSection>

            {/* Pension Calculator */}
            <HelpSection
                id="pension"
                title="Pension Calculator"
                icon={Wallet}
                isOpen={openSection === 'pension'}
                onToggle={handleToggle}
            >
                <p>
                    Calculate your Ethiopian pension based on the Defined Benefit plan.
                    Supports both Civil Servant and Military/Police pension schemes with
                    their respective accrual rates.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Pension Type', description: 'Civil Servant or Military/Police (different accrual rates)' },
                        { name: 'Average Salary', description: 'Last 3 years average salary before retirement' },
                        { name: 'Years of Service', description: 'Total number of years worked' },
                        { name: 'Retirement Age', description: 'Expected age at retirement (default: 60)' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'Monthly Pension', description: 'Your monthly pension payment amount' },
                        { name: 'Annual Pension', description: 'Total pension received per year' },
                        { name: 'Replacement Rate', description: 'Percentage of salary replaced by pension' }
                    ]} />
                </div>

                <InfoBox type="formula">
                    <strong>Civil Servant Formula:</strong>
                    <br />Replacement Rate = 30% + (1.25% × years beyond 10)
                    <br /><br />
                    <strong>Military/Police Formula:</strong>
                    <br />Replacement Rate = 30% + (1.65% × years beyond 10)
                </InfoBox>

                <InfoBox type="note">
                    <strong>Eligibility:</strong> Minimum 10 years of service required.
                    Maximum replacement rate is capped at 70%.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Example:</strong> A civil servant with 25 years of service gets:
                    30% + (1.25% × 15) = 48.75% replacement rate.
                </InfoBox>
            </HelpSection>

            {/* Inflation Calculator */}
            <HelpSection
                id="inflation"
                title="Inflation Calculator"
                icon={TrendingUp}
                isOpen={openSection === 'inflation'}
                onToggle={handleToggle}
            >
                <p>
                    Calculate the impact of inflation on Ethiopian Birr over time.
                    Uses historical data from {MIN_YEAR}–{MAX_YEAR} and an automatically selected
                    ARIMA model to predict future rates through {FORECAST_END}.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Start Year', description: 'The year you start with (treated as January 1st of this year)' },
                        { name: 'End Year', description: 'The year you stop at (treated as January 1st of this year; growth includes everything up until this day)' },
                        { name: 'Amount (Birr)', description: 'The initial amount of money you are evaluating' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'Adjusted Value', description: 'What the amount would be worth in the end year' },
                        { name: 'Cumulative Rate', description: 'Total percentage change over the period' },
                        { name: 'Avg/Year', description: 'Geometric mean (CAGR) annual inflation rate' },
                        { name: 'Purchasing Power', description: 'How much the end-year Birr is worth in start-year terms' }
                    ]} />
                </div>

                <InfoBox type="note">
                    <strong>Dynamic Statistics:</strong> Calculations reflect real-time geometric
                    compounding. While some sources use arithmetic averages (approx. 10.6%),
                    this tool uses the Compound Annual Growth Rate (CAGR) for precision in financial modeling.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Interpretation:</strong> The "Interpretation" section
                    provides a plain-English explanation of your results. It breaks
                    down how much an amount has depreciated in value and how much
                    prices have increased, providing a clear picture of purchasing
                    power loss over time.
                </InfoBox>

                <InfoBox type="formula">
                    <strong>Model Selection:</strong> The best ARIMA(p,d,q) order is
                    <strong> dynamically calculated</strong> upon loading. The system
                    automatically evaluates 50+ candidate models by grid-searching
                    over p∈{'{0..4}'}, d∈{'{0..2}'}, q∈{'{0..3}'} and selects the optimal order
                    based on the lowest Akaike Information Criterion (AIC) score.
                    This ensures the forecast always uses the most statistically
                    robust model for the current data series.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Forecast:</strong> Click "Forecast" to see ARIMA-predicted
                    inflation rates for 2026–2050. Click the ⓘ info button to view
                    the selected model order, AIC/BIC scores, AR/MA coefficients,
                    and the top 5 competing candidates.
                </InfoBox>

                <InfoBox type="note">
                    <strong>Source:</strong> Historical data from{' '}
                    <a
                        href="https://www.worlddata.info/africa/ethiopia/inflation-rates.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 underline hover:text-primary-300"
                    >
                        WorldData.info
                    </a>.
                    Predictions are statistical estimates, not guarantees.
                    <br /><br />
                    <strong>Methodology Reference:</strong> The use of ARIMA models for
                    forecasting Ethiopian inflation is supported by research published
                    by the National Bank of Ethiopia. See <em>Birritu Magazine No. 136</em>
                    (July 2023) for details.
                    <br />
                    <a
                        href="https://nbe.gov.et/wp-content/uploads/2023/07/Birritu-Magazine-136.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 underline hover:text-primary-300"
                    >
                        View Publication (PDF)
                    </a>
                </InfoBox>
            </HelpSection>

            {/* Cash Flow Calculator */}
            <HelpSection
                id="flow"
                title="Cash Flow Calculator"
                icon={Activity}
                isOpen={openSection === 'flow'}
                onToggle={handleToggle}
            >
                <p>
                    Analyze investments with irregular cash flows. Enter the initial investment as a
                    negative CF0, then add expected returns for each period. Perfect for evaluating
                    projects, real estate, or business investments.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Finance Rate', description: 'The cost of capital or required return rate (for NPV & MIRR)' },
                        { name: 'Reinvest Rate', description: 'Expected rate of return on reinvested cash flows (for MIRR)' },
                        { name: 'CF0, CF1, CF2...', description: 'Cash flows for each period (negative for outflows, positive for inflows)' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'NPV', description: 'Net Present Value - total value in today\'s dollars' },
                        { name: 'IRR', description: 'Internal Rate of Return - the rate that makes NPV = 0' },
                        { name: 'MIRR', description: 'Modified IRR - accounts for reinvestment rate' },
                        { name: 'Payback', description: 'Years until initial investment is recovered' },
                        { name: 'Discounted Payback', description: 'Payback accounting for time value of money' },
                        { name: 'PI', description: 'Profitability Index - ratio of benefits to costs' }
                    ]} />
                </div>

                <InfoBox type="note">
                    <strong>Decision Rules:</strong>
                    <br />• NPV {'>'} 0: Accept the project
                    <br />• IRR {'>'} Required Return: Accept the project
                    <br />• PI {'>'} 1: Accept the project
                </InfoBox>

                <InfoBox type="tip">
                    Click the "+" button to add more cash flow periods. Click the trash icon to remove a period.
                </InfoBox>
            </HelpSection>

            {/* Bond Calculator */}
            <HelpSection
                id="bond"
                title="Bond Calculator"
                icon={FileText}
                isOpen={openSection === 'bond'}
                onToggle={handleToggle}
            >
                <p>
                    Calculate bond prices or yields with support for callable bonds. Includes duration
                    and convexity measures for interest rate risk assessment.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Modes:</p>
                    <FieldList fields={[
                        { name: 'PRICE', description: 'Calculate bond price given YTM and other parameters' },
                        { name: 'YTM', description: 'Calculate Yield to Maturity given bond price' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Face Value', description: 'Par value of the bond (typically $1,000)' },
                        { name: 'Coupon Rate', description: 'Annual coupon rate as a percentage' },
                        { name: 'YTM/Price', description: 'Yield to maturity (for price mode) or current price (for YTM mode)' },
                        { name: 'Years to Maturity', description: 'Time until bond matures' },
                        { name: 'Call Price', description: 'Price at which issuer can call the bond' },
                        { name: 'Years to Call', description: 'Time until first call date' },
                        { name: 'Frequency', description: 'ANNUAL or SEMI-ANNUAL coupon payments' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'Price/YTM', description: 'The calculated bond price or yield' },
                        { name: 'Duration (Mac)', description: 'Macaulay Duration - weighted average time to receive cash flows' },
                        { name: 'Duration (Mod)', description: 'Modified Duration - price sensitivity to yield changes' },
                        { name: 'Convexity', description: 'Second-order measure of interest rate risk' },
                        { name: 'YTC', description: 'Yield to Call - yield if bond is called early' }
                    ]} />
                </div>

                <InfoBox type="formula">
                    <strong>Price Change ≈ -Duration × Δy + ½ × Convexity × (Δy)²</strong>
                    <br />Use duration and convexity to estimate price changes for yield movements.
                </InfoBox>
            </HelpSection>

            {/* Rate Converter */}
            <HelpSection
                id="rates"
                title="Rate Converter"
                icon={Percent}
                isOpen={openSection === 'rates'}
                onToggle={handleToggle}
            >
                <p>
                    Convert between nominal (APR) and effective annual rates. See how different
                    compounding frequencies affect your actual return.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Nominal Rate', description: 'The stated annual rate (APR)' },
                        { name: 'Compounding', description: 'How often interest is compounded per year' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'EAR', description: 'Effective Annual Rate - the actual annual return with compounding' },
                        { name: 'Period Rates', description: 'Breakdown of rates for each compounding frequency' },
                        { name: 'Time to Double', description: 'How long until your investment doubles at this rate' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Period Rates Mode Toggle:</p>
                    <FieldList fields={[
                        { name: 'APR → Periodic', description: 'Breaks down your nominal rate into periodic rates (daily, weekly, monthly, etc.)' },
                        { name: 'Periodic → APR', description: 'Enter a periodic rate (e.g., 2% daily) and see the equivalent Simple APR and Compound APY' }
                    ]} />
                </div>

                <InfoBox type="formula">
                    <strong>EAR = (1 + r/n)^n - 1</strong>
                    <br />where r = nominal rate, n = compounding periods per year
                </InfoBox>

                <InfoBox type="formula">
                    <strong>Periodic → APR Formulas:</strong>
                    <br />• Simple APR = Periodic Rate × Periods per Year
                    <br />• Compound APY = (1 + Periodic Rate)^Periods - 1
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Rule of 72:</strong> A quick estimate for doubling time is 72 ÷ interest rate.
                    For example, at 8%, money doubles in approximately 72 ÷ 8 = 9 years.
                </InfoBox>
            </HelpSection>

            {/* T-Bill Calculator */}
            <HelpSection
                id="tbill"
                title="T-Bill Calculator"
                icon={Receipt}
                isOpen={openSection === 'tbill'}
                onToggle={handleToggle}
            >
                <p>
                    Calculate Treasury Bill purchase prices and returns using discount pricing.
                    T-Bills in Ethiopia are issued in units of <strong>5,000 ETB</strong>; this calculator
                    automatically rounds your input down to the nearest unit to provide realistic bidding results.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Calculation Modes:</p>
                    <FieldList fields={[
                        { name: 'Face→Cost', description: 'Enter the desired face value. The calculator floors this to the nearest 5,000 ETB unit to determine the actual bidding amount' },
                        { name: 'Budget→Face', description: 'Enter your total investment budget. The calculator determines the maximum number of 5,000 ETB units you can afford including brokerage' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Face Value / Budget', description: 'Face value (forward mode) or total budget (reverse mode) — the primary input swaps based on selected mode' },
                        { name: 'Tenure', description: 'T-Bill duration (28, 91, 182, or 364 days), labeled with approximate periods: 1, 3, 6 months and 1 year' },
                        { name: 'Discount Rate', description: 'Annual discount rate used to calculate purchase price' },
                        { name: 'Brokerage %', description: 'Commission percentage charged by your broker' },
                        { name: 'Issue Date', description: 'The date when the T-Bill is issued' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'Quantity', description: 'The number of 5,000 ETB units being purchased' },
                        { name: 'Purchase Price', description: 'The discounted amount to pay for the T-Bill (before brokerage)' },
                        { name: 'Brokerage', description: 'The commission amount based on the purchase price' },
                        { name: 'Total Consideration / Face Value', description: 'The primary result: total out-of-pocket cost (Forward) or the maturity value received (Reverse)' },
                        { name: 'Actual Face Value / Actual Cost', description: 'The secondary result: the exact maturity amount (Forward) or the actual amount spent (Reverse) after rounding to the nearest 5,000 unit' },
                        { name: 'Maturity Date', description: 'The date when the T-Bill matures and you receive the face value' },
                        { name: 'Discount', description: 'The difference between face value and purchase price (gross profit)' },
                        { name: 'Net Return', description: 'Your actual profit after accounting for brokerage (Face Value − Total Consideration)' },
                        { name: 'Effective Yield', description: 'Annualized return based on net profit relative to total consideration' }
                    ]} />
                </div>

                <InfoBox type="formula">
                    <strong>Purchase Price = Face Value / (1 + (Rate × Days / 365))</strong>
                    <br />This is the standard discount pricing formula for T-Bills.
                    <br /><br />
                    <strong>Effective Yield = (Net Return / Total Consideration) × (365 / Days) × 100</strong>
                    <br />Accounts for brokerage fees in the yield calculation.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Mode Toggle:</strong> Use the <strong>Face→Cost</strong> / <strong>Budget→Face</strong> toggle
                    in the header to switch between modes. This is useful when you have a specific budget and want to
                    know the maximum face value T-Bill you can bid on.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Unit Pricing:</strong> All outputs are derived based on a standard unit size of 5,000 ETB per bill.
                    The "Quantity" result shows exactly how many units your budget or face value allows.
                </InfoBox>
                <InfoBox type="tip">
                    <strong>Reverse Mode:</strong> In Budget→Face mode, the calculator calculates the cost of a single unit (Price + Brokerage)
                    and divides your budget by this unit cost to find the maximum possible quantity.
                </InfoBox>
            </HelpSection>

            {/* Ride Fare Calculator */}
            <HelpSection
                id="transport"
                title="Ride Fare Calculator"
                icon={Car}
                isOpen={openSection === 'transport'}
                onToggle={handleToggle}
            >
                <p>
                    Calculate fuel costs and a reasonable fare for transport. Supports Google Maps
                    integration for automatic distance lookup, interactive route maps with live
                    traffic visualization, and alternate route comparison — all in one tab.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Calculation Modes:</p>
                    <FieldList fields={[
                        { name: 'Inputs → Price', description: 'Enter distance, fuel details, and service multiplier and wait time multiplier to calculate the fare' },
                        { name: 'Price → Breakdown', description: 'Enter a known fare to reverse-calculate fuel cost, net gain, and implied service multiplier' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Google Maps Integration:</p>
                    <FieldList fields={[
                        { name: 'From / To', description: 'Type an address and select from autocomplete suggestions. Locations are restricted to Ethiopia.' },
                        { name: 'Quick Clear', description: 'Click the Map Pin icon in the From/To fields to instantly clear the location and focus the input' },
                        { name: 'Auto-Distance', description: 'When both From and To are selected, the driving distance and estimated travel time are fetched automatically via the Distance Matrix API' },
                        { name: '✓ Google Maps', description: 'A green indicator confirms the distance was auto-populated from Google Maps. You can still override it manually.' },
                        { name: '⇅ Swap Button', description: 'Click the swap icon between From and To fields to instantly reverse your origin and destination.' },
                        { name: '📍 Current Location', description: 'Auto-detects your GPS position on launch. Uses the Places API to resolve your coordinates to the nearest building or POI name (e.g., "Marketing Complex") with Geocoder fallback.' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Map & Driving View:</p>
                    <FieldList fields={[
                        { name: 'View Map & Alternate Routes', description: 'Appears when both From and To are populated. Opens a full-screen interactive map overlay directly within the Ride tab.' },
                        { name: 'Traffic-Aware Routing', description: 'Routes are color-coded: blue (normal), yellow (slow), red (traffic jam).' },
                        { name: 'Alternative Routes', description: 'Up to 3 routes are shown with labels like Suggested, Shortest, Fastest, or Economical. Grey lines on the map indicate alternate paths — tap any to switch routes.' },
                        { name: 'Navigate Button', description: 'Opens your selected route directly in the Google Maps app (Android) or browser for turn-by-turn navigation.' },
                        { name: 'SMS Button', description: 'Generates a professional trip summary message (for the passenger) with fare, distance, and payment options (TeleBirr, CBE, or Cash).' },
                        { name: 'Live Button', description: 'Opens the Live Fare Tracker for real-time GPS tracking (see below).' },
                        { name: 'Turn-by-Turn Steps', description: 'An expandable bottom sheet shows step-by-step navigation directions.' },
                        { name: '← Back Button', description: 'Return to the calculator with your selected route data preserved.' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Live Fare Tracker (GPS):</p>
                    <p className="text-xs mb-2">Track your trip in real-time using your device's GPS. Perfect for verifying distances and calculating fares on the go.</p>
                    <FieldList fields={[
                        { name: 'Start Tracking', description: 'Begins recording distance and wait time. Your location must be enabled.' },
                        { name: 'Wait Time Detection', description: 'Automatically detects when the vehicle is moving below 5 km/h to accumulate wait time charges.' },
                        { name: 'Running Fare', description: 'A large, live display of the fare, updated every second based on distance and wait time.' },
                        { name: 'GPS Accuracy', description: 'A real-time indicator (± meters) shows the reliability of your GPS fix.' },
                        { name: 'Trip Summary', description: 'When stopped, view a complete breakdown of distance, duration, avg speed, and net gain.' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Distance (Km)', description: 'Trip distance — auto-filled from Maps or the Driving view, or entered manually' },
                        { name: 'Fuel Cost / L', description: 'Current price of fuel per liter (default 145 ETB)' },
                        { name: '1× / 2× Toggle', description: 'Switch between one-way and round-trip fare calculation. Round-trip doubles the fuel cost component of the fare.' },
                        { name: 'Wait Multiplier', description: 'Factor applied to estimated travel time (+10% buffer) to calculate total charge for wait time (default 2.5)' },
                        { name: 'Service Multiplier', description: 'Multiplier for maintenance, time, and profit (range: 2.55 – 4.5×, default 3×). Only in Inputs → Price mode.' },
                        { name: 'Price to Charge', description: 'The known fare amount. Only in Price → Breakdown mode.' }
                    ]} />
                </div>

                <InfoBox type="note">
                    <strong>Mileage (L/Km):</strong> Fixed at 0.10 L/Km — the baseline fuel consumption rate used in all fare calculations. This value is not editable and represents a standard vehicle efficiency.
                </InfoBox>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'Route & Drive Time', description: 'Shows the origin → destination names with estimated drive time. Appears when a Google Maps route is active.' },
                        { name: 'Wait Time Charge', description: 'Total charge for wait time — estimated travel time + 10% buffer, multiplied by the Wait Multiplier. Added to the fare. Only shown when using Google Maps route.' },
                        { name: 'Total to Charge', description: 'The recommended fare (forward mode) or the entered fare (reverse mode), including wait time charge' },
                        { name: 'Per Head', description: 'Price divided by 4 passengers for cost-sharing' },
                        { name: 'Fuel Cost', description: 'Distance × Mileage × Fuel Cost per Liter (always shown as round-trip for true out-of-pocket cost)' },
                        { name: 'Net Gain', description: 'Total to Charge minus Total Fuel Cost. Displayed as (One-way / Round-trip) for better comparison.' },
                        { name: 'Revenue / Km', description: 'Total to Charge per kilometer' },
                        { name: 'Gain / Km', description: 'Net Gain per kilometer' },
                        { name: 'Service ×', description: 'In reverse mode, shows what service multiplier the entered fare represents.' }
                    ]} />
                </div>

                <InfoBox type="formula">
                    <strong>Price to Charge = (Distance × Mileage × Fuel Cost) × Service Multiplier + Wait Time Charge</strong>
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Map Overlay:</strong> The interactive map is embedded directly within the Ride tab as an overlay — no need to switch tabs. Select a route on the map and it automatically syncs back to your fare calculation.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>No API Key?</strong> The calculator works without Google Maps — just enter the distance manually. The From/To inputs and map features only appear when a valid Google Maps API key is configured.
                </InfoBox>
            </HelpSection>

            {/* History */}
            <HelpSection
                id="history"
                title="History"
                icon={History}
                isOpen={openSection === 'history'}
                onToggle={handleToggle}
            >
                <p>
                    The History feature automatically tracks and stores all your calculations. Access your history
                    from the main History tab or directly from any calculator using the "View History" link.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Features:</p>
                    <FieldList fields={[
                        { name: 'Auto-Save', description: 'Every time you click "Calculate", the result is added to your history' },
                        { name: 'Module Tracking', description: 'Each entry is labeled with the calculator used (TVM, Loan, etc.)' },
                        { name: 'Timestamp', description: 'See exactly when each calculation was performed' },
                        { name: 'Persistence', description: 'Your history is saved locally on your device and remains available even after refreshing' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Accessing History:</p>
                    <ul className="space-y-2 text-xs">
                        <li className="flex gap-2">
                            <History className="w-4 h-4 text-primary-400 shrink-0" />
                            <div>
                                <span className="font-bold text-white">History Tab:</span> View all calculations from every module in one place.
                            </div>
                        </li>
                        <li className="flex gap-2">
                            <History className="w-4 h-4 text-primary-400 shrink-0" />
                            <div>
                                <span className="font-bold text-white">View History Link:</span> Each calculator has a "View History" link that opens a filtered overlay showing only that module's calculations.
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Managing History:</p>
                    <ul className="space-y-2">
                        <li className="flex gap-2">
                            <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
                            <div className="text-xs">
                                <span className="font-bold text-white">Clear All:</span> Use the trash icon in the main History tab to delete all saved calculations.
                            </div>
                        </li>
                        <li className="flex gap-2">
                            <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
                            <div className="text-xs">
                                <span className="font-bold text-white">Clear by Module:</span> In the View History overlay, click "Clear History" to remove only that calculator's entries while preserving others.
                            </div>
                        </li>
                    </ul>
                </div>

                <InfoBox type="tip">
                    <strong>Quick Access:</strong> Look for the "View History" link in each calculator's results section or header area to quickly review past calculations for that specific tool.
                </InfoBox>

                <InfoBox type="note">
                    <strong>History Tab Position:</strong> The History tab is always positioned last in the navigation bar and cannot be reordered.
                </InfoBox>
            </HelpSection>

            {/* Settings */}
            <HelpSection
                id="settings"
                title="Settings"
                icon={Settings}
                isOpen={openSection === 'settings'}
                onToggle={handleToggle}
            >
                <p>
                    Customize your app experience by choosing which calculator tabs are visible and
                    arranging them in your preferred order. Access Settings by clicking the gear icon
                    in the app header.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Tab Visibility:</p>
                    <FieldList fields={[
                        { name: 'Toggle On/Off', description: 'Use the toggle switch next to each tab to show or hide it' },
                        { name: 'Minimum Tabs', description: 'At least 5 tabs must remain visible at all times' },
                        { name: 'Maximum Tabs', description: 'Up to 7 tabs can be displayed simultaneously' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Tab Reordering:</p>
                    <FieldList fields={[
                        { name: 'Up/Down Arrows', description: 'Click the arrows next to each tab to change its position in the navigation bar' },
                        { name: 'History Position', description: 'The History tab is always positioned last and cannot be reordered' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Available Tabs:</p>
                    <ul className="space-y-1 text-xs">
                        <li>• <strong>TVM</strong> - Time Value of Money</li>
                        <li>• <strong>Goal</strong> - Goal Planner</li>
                        <li>• <strong>Loan</strong> - Loan Calculator</li>
                        <li>• <strong>Pension</strong> - Ethiopian Pension Calculator</li>
                        <li>• <strong>Inflation</strong> - Ethiopian Birr Inflation Calculator</li>
                        <li>• <strong>Cash Flow</strong> - NPV, IRR & cash flow analysis</li>
                        <li>• <strong>Bond</strong> - Bond pricing & yields</li>
                        <li>• <strong>Rate Converter</strong> - Interest rate conversions</li>
                        <li>• <strong>Ride</strong> - Ride Fare Calculator</li>
                        <li>• <strong>T-Bill</strong> - Treasury Bill calculator</li>
                        <li>• <strong>History</strong> - View past calculations</li>
                    </ul>
                </div>

                <InfoBox type="tip">
                    <strong>Persistence:</strong> Your settings are saved locally and will persist
                    even after closing the app or refreshing the page.
                </InfoBox>

                <InfoBox type="note">
                    <strong>Auto-Swap:</strong> If you try to enable an 8th tab, the first enabled tab
                    (other than the one being enabled) will automatically be disabled to maintain the maximum of 7.
                </InfoBox>
            </HelpSection>

            {/* Common Concepts */}
            <HelpSection
                id="concepts"
                title="Financial Concepts"
                icon={Lightbulb}
                isOpen={openSection === 'concepts'}
                onToggle={handleToggle}
            >
                <div className="space-y-4">
                    <div>
                        <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Time Value of Money</p>
                        <p className="text-xs text-neutral-400">
                            Money available today is worth more than the same amount in the future because
                            it can be invested to earn returns. This is the foundation of all financial calculations.
                        </p>
                    </div>

                    <div>
                        <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Present Value vs Future Value</p>
                        <p className="text-xs text-neutral-400">
                            PV is what a future sum is worth today. FV is what a current amount will grow to
                            in the future. They are related by the interest rate and time period.
                        </p>
                    </div>

                    <div>
                        <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Ordinary Annuity vs Annuity Due</p>
                        <p className="text-xs text-neutral-400">
                            Ordinary annuity (END): Payments at the end of each period (most loans).
                            Annuity due (BEGIN): Payments at the beginning of each period (rent, leases).
                        </p>
                    </div>

                    <div>
                        <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">APR vs EAR</p>
                        <p className="text-xs text-neutral-400">
                            APR (Annual Percentage Rate) is the stated nominal rate.
                            EAR (Effective Annual Rate) is the actual rate accounting for compounding.
                            EAR is always ≥ APR.
                        </p>
                    </div>

                    <div>
                        <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Compound vs Simple Interest</p>
                        <p className="text-xs text-neutral-400">
                            Simple interest: Interest calculated only on the principal.
                            Compound interest: Interest calculated on principal plus accumulated interest.
                            Compound interest grows faster over time.
                        </p>
                    </div>
                </div>
            </HelpSection>

            {/* Tips & Best Practices */}
            <HelpSection
                id="tips"
                title="Tips & Best Practices"
                icon={Lightbulb}
                isOpen={openSection === 'tips'}
                onToggle={handleToggle}
            >
                <div className="space-y-3">
                    <InfoBox type="tip">
                        <strong>Click Label to Clear:</strong> Standardized interaction across all calculators!
                        Click any input field's <strong>label</strong> to instantly clear it and focus the 
                        input. The field stays blank while focused and only defaults to 0 when you 
                        leave the field (blur) without entering data. (Note: Date and Location fields are excluded).
                    </InfoBox>

                    <InfoBox type="tip">
                        <strong>Clear Button:</strong> Use the CLR button at the bottom to reset <strong>all</strong> fields 
                        to their default values at once.
                    </InfoBox>

                    <InfoBox type="tip">
                        <strong>History:</strong> All calculations are automatically saved. Use "View History" in any calculator
                        to see that module's past calculations, or visit the History tab for all entries. You can clear history per-module or all at once.
                    </InfoBox>

                    <InfoBox type="tip">
                        <strong>Sign Convention:</strong> Be consistent with positive and negative signs. Generally:
                        money you pay = negative, money you receive = positive.
                    </InfoBox>

                    <InfoBox type="tip">
                        <strong>Decimal Precision:</strong> Results are calculated with high precision. For practical use,
                        round to appropriate decimal places (2 for currency, 2-4 for percentages).
                    </InfoBox>

                    <InfoBox type="note">
                        <strong>Verify Results:</strong> For important financial decisions, always verify calculations
                        using multiple methods and consult with financial professionals.
                    </InfoBox>
                </div>
            </HelpSection>

        </div>
    );
};

export default HelpGuide;

```

## src/features/history/HistoryView.jsx

```javascript
import React from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Trash2, Clock, HelpCircle, Settings } from 'lucide-react';

const HistoryView = ({ toggleHelp, toggleSettings }) => {
    const { history, clearHistory } = useHistory();

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
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    History
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleSettings}
                        className="p-2 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
                        title="Settings"
                    >
                        <Settings size={20} />
                    </button>
                    <button
                        onClick={toggleHelp}
                        className="p-2 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
                        title="Help Guide"
                    >
                        <HelpCircle size={20} />
                    </button>
                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-neutral-800 transition-colors"
                            title="Clear History"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-600">
                        <Clock size={48} className="mb-4 opacity-50" />
                        <p>No calculations yet.</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-primary-500 font-bold text-xs uppercase tracking-wider">{item.module}</span>
                                <span className="text-neutral-500 text-xs">
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="mb-2">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-400">
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
                                <span className="text-xs font-bold text-neutral-300">Result</span>
                                <span className="text-xs font-bold text-white">{formatResult(item.result)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryView;

```

## src/features/inflation/data.js

```javascript
// Historical inflation rates for Ethiopia (1966-2025)
// Source: https://www.worlddata.info/africa/ethiopia/inflation-rates.php
export const INFLATION_DATA = [
    { year: 1966, rate: -1.36 },
    { year: 1967, rate: 0.81 },
    { year: 1968, rate: 0.18 },
    { year: 1969, rate: 1.43 },
    { year: 1970, rate: 10.12 },
    { year: 1971, rate: 0.54 },
    { year: 1972, rate: -6.08 },
    { year: 1973, rate: 8.91 },
    { year: 1974, rate: 8.59 },
    { year: 1975, rate: 6.55 },
    { year: 1976, rate: 28.54 },
    { year: 1977, rate: 16.66 },
    { year: 1978, rate: 14.31 },
    { year: 1979, rate: 16.03 },
    { year: 1980, rate: 12.40 },
    { year: 1981, rate: 1.90 },
    { year: 1982, rate: 7.80 },
    { year: 1983, rate: 3.60 },
    { year: 1984, rate: -0.30 },
    { year: 1985, rate: 18.40 },
    { year: 1986, rate: 5.50 },
    { year: 1987, rate: -9.10 },
    { year: 1988, rate: 2.20 },
    { year: 1989, rate: 9.60 },
    { year: 1990, rate: 5.20 },
    { year: 1991, rate: 20.90 },
    { year: 1992, rate: 21.00 },
    { year: 1993, rate: 10.00 },
    { year: 1994, rate: 1.20 },
    { year: 1995, rate: 13.40 },
    { year: 1996, rate: 0.90 },
    { year: 1997, rate: -6.40 },
    { year: 1998, rate: 3.60 },
    { year: 1999, rate: 7.90 },
    { year: 2000, rate: 0.70 },
    { year: 2001, rate: -8.20 },
    { year: 2002, rate: 1.70 },
    { year: 2003, rate: 17.80 },
    { year: 2004, rate: 3.20 },
    { year: 2005, rate: 11.70 },
    { year: 2006, rate: 13.60 },
    { year: 2007, rate: 17.20 },
    { year: 2008, rate: 44.40 },
    { year: 2009, rate: 8.50 },
    { year: 2010, rate: 8.10 },
    { year: 2011, rate: 33.20 },
    { year: 2012, rate: 24.10 },
    { year: 2013, rate: 8.10 },
    { year: 2014, rate: 7.40 },
    { year: 2015, rate: 9.60 },
    { year: 2016, rate: 6.60 },
    { year: 2017, rate: 10.70 },
    { year: 2018, rate: 13.80 },
    { year: 2019, rate: 15.80 },
    { year: 2020, rate: 20.40 },
    { year: 2021, rate: 26.80 },
    { year: 2022, rate: 33.90 },
    { year: 2023, rate: 30.20 },
    { year: 2024, rate: 21.00 },
    { year: 2025, rate: 13.00 },
];

export const MIN_YEAR = INFLATION_DATA[0].year;
export const MAX_YEAR = INFLATION_DATA[INFLATION_DATA.length - 1].year;
export const FORECAST_END = 2050;

```

## src/features/inflation/InflationCalculator.jsx

```javascript
import React, { useState, useMemo, useRef } from 'react';
import { TrendingUp, Info, HelpCircle, Trash2, Settings, History, ChevronDown, ChevronUp } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import { useHistory } from '../../context/HistoryContext';
import { arimaForecast } from '../../utils/arima';

import { INFLATION_DATA, MIN_YEAR, MAX_YEAR, FORECAST_END } from './data';

const FORECAST_STEPS = FORECAST_END - MAX_YEAR;

const InflationCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    const [startYear, setStartYear] = useState(2025);
    const [endYear, setEndYear] = useState(new Date().getFullYear() + 4);
    const [endYearMode, setEndYearMode] = useState('YEAR'); // 'YEAR' or 'DURATION'
    const [amount, setAmount] = useState(1000);
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showPrediction, setShowPrediction] = useState(false);
    const [showInterpretation, setShowInterpretation] = useState(false);

    // Refs for input focus
    const amountRef = useRef(null);

    const clearAmount = () => {
        setAmount(null);
        setResult(null);
        setTimeout(() => amountRef.current?.focus(), 0);
    };

    // Auto ARIMA: selects best (p,d,q) via AIC
    const { predictions, modelInfo } = useMemo(() => {
        const series = INFLATION_DATA.map(d => d.rate);
        // Auto-select best order using AIC criterion
        const { predictions: rawPreds, model } = arimaForecast(series, FORECAST_STEPS, { auto: true, criterion: 'aic' });

        const preds = rawPreds.map((rate, i) => ({
            year: MAX_YEAR + 1 + i,
            rate: parseFloat(rate.toFixed(2)),
        }));

        return {
            predictions: preds,
            modelInfo: {
                order: `(${model.p}, ${model.d}, ${model.q})`,
                p: model.p,
                d: model.d,
                q: model.q,
                rmse: model.rmse.toFixed(2),
                aic: model.aic.toFixed(2),
                bic: model.bic.toFixed(2),
                arCoeffs: model.arCoeffs.map(c => c.toFixed(4)),
                maCoeffs: model.maCoeffs.map(c => c.toFixed(4)),
                topCandidates: model.topCandidates || [],
            },
        };
    }, []);

    // Overall historical statistics
    const { overallIncrease, avgAnnualInflation } = useMemo(() => {
        let multiplier = 1;
        // Scenario C: From beginning of MIN_YEAR to beginning of MAX_YEAR
        // We exclude the very last year's rate because that would represent growth *during* that year.
        for (let i = 0; i < INFLATION_DATA.length - 1; i++) {
            multiplier *= (1 + INFLATION_DATA[i].rate / 100);
        }
        return {
            overallIncrease: (multiplier - 1) * 100,
            avgAnnualInflation: (Math.pow(multiplier, 1 / (INFLATION_DATA.length - 1)) - 1) * 100,
        };
    }, []);

    const handleCalculate = () => {
        const sYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, Math.round(startYear)));
        const eYear = Math.max(MIN_YEAR, Math.min(FORECAST_END, Math.round(endYear)));

        if (sYear >= eYear) {
            setResult({ error: 'End year must be after start year' });
            return;
        }

        // Combine historical + predicted data
        const allData = [...INFLATION_DATA, ...predictions];

        // Calculate cumulative inflation between years
        let cumulativeMultiplier = 1;
        const yearlyBreakdown = [];

        // Stop at eYear - 1 to represent the value AT THE BEGINNING of eYear
        for (let y = sYear; y < eYear; y++) {
            const entry = allData.find(d => d.year === y);
            if (entry) {
                const factor = 1 + entry.rate / 100;
                cumulativeMultiplier *= factor;
                yearlyBreakdown.push({ year: y, rate: entry.rate, cumulative: ((cumulativeMultiplier - 1) * 100), predicted: y > MAX_YEAR });
            }
        }

        const amt = amount || 0;
        const adjustedValue = amt * cumulativeMultiplier;
        const cumulativeRate = (cumulativeMultiplier - 1) * 100;
        const avgAnnualRate = yearlyBreakdown.length > 0
            ? (Math.pow(cumulativeMultiplier, 1 / yearlyBreakdown.length) - 1) * 100
            : 0;

        // Purchasing power: how much would you need today to match the amount from startYear
        const purchasingPower = amt / cumulativeMultiplier;

        const isPredicted = yearlyBreakdown.some(yb => yb.predicted);

        const res = {
            startYear: sYear,
            endYear: eYear,
            amount: amt,
            adjustedValue,
            cumulativeRate,
            avgAnnualRate,
            purchasingPower,
            yearlyBreakdown,
            isPredicted,
        };

        setResult(res);
        addToHistory('INFLATION', { startYear: sYear, endYear: eYear, amount: amt }, res);
    };

    const handleClear = () => {
        setStartYear(2025);
        setEndYear(new Date().getFullYear() + 4);
        setEndYearMode('YEAR');
        setAmount(1000);
        setResult(null);
        setShowPrediction(false);
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-2 shrink-0">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Inflation Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        Ethiopian Birr · 1966–{FORECAST_END}
                    </p>
                </div>
                <div className="flex gap-1.5">
                    <button
                        onClick={() => setShowPrediction(!showPrediction)}
                        className={`flex items-center justify-center px-2 py-1 rounded-full transition-all text-[9px] font-bold uppercase tracking-wider ${showPrediction ? 'bg-amber-600/20 text-amber-400 ring-1 ring-amber-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="ARIMA Forecast"
                    >
                        Forecast
                    </button>
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Ethiopian Birr Inflation</p>
                    <p className="text-[11px] leading-relaxed mb-2">
                        Historical data from 1966–{MAX_YEAR}. Future predictions ({MAX_YEAR + 1}–{FORECAST_END}) use an
                        <strong className="text-amber-400"> ARIMA{modelInfo.order}</strong> model,
                        auto-selected via <strong className="text-cyan-400">AIC</strong> from {modelInfo.topCandidates.length}+ candidates.
                    </p>
                    <ul className="text-[11px] leading-relaxed list-disc list-inside space-y-1">
                        <li>Average annual inflation ({MIN_YEAR}–{MAX_YEAR}): ~{avgAnnualInflation.toFixed(1)}% <span className="text-primary-500/70 ml-1 text-[9px] font-bold uppercase">(CAGR)</span></li>
                        <li>Overall price increase since {MIN_YEAR}: ~{overallIncrease.toLocaleString('en-US', { maximumFractionDigits: 0 })}%</li>
                        <li>Model RMSE: {modelInfo.rmse}%</li>
                    </ul>
                    <p className="text-[9px] text-neutral-500 mt-2 leading-relaxed italic">
                        * Statistics are dynamically calculated using the geometric mean (Compound Annual Growth Rate) for financial accuracy based on verified WorldData records.
                    </p>
                    <div className="mt-2 bg-neutral-900/50 rounded-lg p-2">
                        <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-1">Best Model: ARIMA{modelInfo.order} (via AIC)</p>
                        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-neutral-400">
                            <span>AIC: <span className="text-cyan-400 font-bold">{modelInfo.aic}</span></span>
                            <span>BIC: <span className="text-cyan-400 font-bold">{modelInfo.bic}</span></span>
                            <span>AR({modelInfo.arCoeffs.length}): [{modelInfo.arCoeffs.join(', ')}]</span>
                            <span>MA({modelInfo.maCoeffs.length}): [{modelInfo.maCoeffs.join(', ')}]</span>
                        </div>
                        {modelInfo.topCandidates.length > 1 && (
                            <div className="mt-1.5 pt-1.5 border-t border-neutral-700">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Top 5 Candidates by AIC</p>
                                {modelInfo.topCandidates.slice(0, 5).map((c, i) => (
                                    <div key={i} className={`text-[9px] font-mono flex justify-between ${i === 0 ? 'text-primary-400' : 'text-neutral-500'}`}>
                                        <span>{i === 0 ? '►' : ' '} ({c.p},{c.d},{c.q})</span>
                                        <span>AIC: {c.aic.toFixed(1)}</span>
                                        <span>BIC: {c.bic.toFixed(1)}</span>
                                        <span>RMSE: {c.rmse.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-[9px] text-neutral-500 mt-2">
                        Source: worlddata.info/africa/ethiopia/inflation-rates.php
                    </p>
                </div>
            )}

            {/* ARIMA Prediction Table */}
            {showPrediction && (
                <div className="bg-gradient-to-r from-amber-900/20 to-neutral-800/50 border border-amber-500/30 rounded-xl p-3 mb-4 text-left">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-amber-400 text-[10px] uppercase tracking-wider">
                            ARIMA{modelInfo.order} Forecast
                        </p>
                        <span className="text-[8px] text-neutral-500 font-mono bg-neutral-900/60 px-1.5 py-0.5 rounded">
                            RMSE: {modelInfo.rmse}%
                        </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                        <div className="grid grid-cols-5 gap-1.5">
                            {predictions.map(p => (
                                <div key={p.year} className="bg-neutral-900/60 rounded-lg p-1.5 text-center">
                                    <p className="text-[9px] text-neutral-500 font-bold">{p.year}</p>
                                    <p className={`text-[11px] font-black ${p.rate >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {p.rate.toFixed(1)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-[9px] text-neutral-500 mt-2 italic">
                        ARIMA(p={modelInfo.arCoeffs.length}, d=1, q={modelInfo.maCoeffs.length}) · {FORECAST_STEPS}-year forecast
                    </p>
                </div>
            )}

            {/* Scrollable Content: Inputs + Results */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">

                {/* Input Fields */}
                <div className="space-y-1">
                    {/* Start Year */}
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label className="text-sm font-bold text-white block leading-tight text-left">Start Year</label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">{MIN_YEAR}–{MAX_YEAR}</span>
                            </div>
                            <FormattedNumberInput
                                value={startYear}
                                onChange={(e) => setStartYear(parseFloat(e.target.value.replace(/,/g, '')) || MIN_YEAR)}
                                decimals={0}
                                useGrouping={false}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                                placeholder="2000"
                            />
                        </div>
                    </div>

                    {/* End Year */}
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0 flex flex-col items-start">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-bold text-white block leading-tight text-left">End {endYearMode === 'YEAR' ? 'Year' : 'Duration'}</label>
                                    <button
                                        onClick={() => setEndYearMode(m => m === 'YEAR' ? 'DURATION' : 'YEAR')}
                                        className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-0.5 text-[9px] font-bold text-neutral-400 hover:text-white uppercase tracking-wider"
                                    >
                                        {endYearMode === 'YEAR' ? 'In Years' : 'In Date'}
                                    </button>
                                </div>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">
                                    {endYearMode === 'YEAR'
                                        ? `${MIN_YEAR}–${FORECAST_END} (ARIMA)`
                                        : `Years from ${new Date().getFullYear()}`
                                    }
                                </span>
                            </div>
                            <FormattedNumberInput
                                value={endYearMode === 'YEAR' ? endYear : (endYear - new Date().getFullYear())}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                                    if (endYearMode === 'YEAR') {
                                        setEndYear(val || MAX_YEAR);
                                    } else {
                                        setEndYear(new Date().getFullYear() + val);
                                    }
                                }}
                                decimals={0}
                                useGrouping={false}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                                placeholder={endYearMode === 'YEAR' ? "2024" : "4"}
                            />
                        </div>
                    </div>

                    {/* Amount in Birr */}
                    <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-primary-500/50 ring-1 ring-primary-500/10">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label 
                                    onClick={clearAmount}
                                    className="text-sm font-bold text-primary-400 block leading-tight text-left cursor-pointer hover:text-white transition-colors"
                                    title="Click to Clear"
                                >
                                    Amount (Birr)
                                </label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Value in Start Year</span>
                            </div>
                            <FormattedNumberInput
                                ref={amountRef}
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                    setAmount(val);
                                    setResult(null);
                                }}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-primary-400 font-black min-w-0 flex-1"
                                placeholder="1,000"
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                {result && !result.error && (
                    <div className="mt-1.5 bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2.5 space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                Results {result.isPredicted && <span className="text-amber-400">(ARIMA predicted)</span>}
                            </span>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                            >
                                <History size={12} /> View History
                            </button>
                        </div>

                        {/* Adjusted Value - Compact */}
                        <div className="bg-neutral-900/80 rounded-lg p-2 border border-primary-500/30 text-center">
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                {formatCurrency(result.amount)} Birr on Jan 1, {result.startYear} equals
                            </p>
                            <p className="text-xl font-black text-primary-400 leading-tight">
                                {formatCurrency(result.adjustedValue)}
                            </p>
                            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                Birr on Jan 1, {result.endYear}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Cumulative</p>
                                <p className={`text-sm font-black ${result.cumulativeRate >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {result.cumulativeRate.toFixed(2)}%
                                </p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Avg/Year</p>
                                <p className="text-sm font-black text-amber-400">
                                    {result.avgAnnualRate.toFixed(2)}%
                                </p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Buy Power</p>
                                <p className="text-sm font-black text-emerald-400">
                                    {formatCurrency(result.purchasingPower)}
                                </p>
                            </div>
                        </div>

                        {result.yearlyBreakdown.length > 0 && (
                            <div className="pt-1.5 border-t border-neutral-700">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Year-by-Year</p>
                                <div className="max-h-32 overflow-y-auto scrollbar-hide space-y-0.5">
                                    {result.yearlyBreakdown.map(yb => (
                                        <div key={yb.year} className={`flex justify-between items-center px-2 py-0.5 rounded text-[10px] ${yb.predicted ? 'bg-amber-900/20' : 'bg-neutral-900/30'}`}>
                                            <span className={`font-bold ${yb.predicted ? 'text-amber-400' : 'text-neutral-400'}`}>
                                                {yb.year}{yb.predicted ? '*' : ''}
                                            </span>
                                            <span className={`font-black ${yb.rate >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {yb.rate >= 0 ? '+' : ''}{yb.rate.toFixed(2)}%
                                            </span>
                                            <span className="text-neutral-500 font-mono">
                                                cum: {yb.cumulative.toFixed(1)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {result.isPredicted && (
                                    <p className="text-[8px] text-amber-400/70 mt-1 italic">* ARIMA-predicted values</p>
                                )}
                            </div>
                        )}

                        {/* Plain-English Interpretation */}
                        <div className="pt-1.5 border-t border-neutral-700">
                            <button
                                onClick={() => setShowInterpretation(!showInterpretation)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Interpretation</p>
                                {showInterpretation
                                    ? <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                                    : <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                                }
                            </button>

                            {showInterpretation && (
                                <div className="mt-2 space-y-2 text-left">
                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        Inflation-adjusted purchasing power on <strong className="text-white">Jan 1, {result.endYear}</strong>:{' '}
                                        <strong className="text-primary-400">{formatCurrency(result.purchasingPower)} Birr</strong>.
                                        Rise in prices over {result.endYear - result.startYear} years:{' '}
                                        <strong className="text-red-400">{result.cumulativeRate.toFixed(2)}%</strong>.
                                        Drop in currency value over {result.endYear - result.startYear} years:{' '}
                                        <strong className="text-red-400">{((1 - 1 / (1 + result.cumulativeRate / 100)) * 100).toFixed(2)}%</strong>.
                                    </p>

                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        In other words, if an item cost{' '}
                                        <strong className="text-white">{formatCurrency(result.amount)} Birr</strong> on Jan 1, {result.startYear},
                                        it will cost{' '}
                                        <strong className="text-primary-400">{formatCurrency(result.adjustedValue)} Birr</strong> by
                                        Jan 1, {result.endYear} because of inflation.
                                    </p>

                                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                                        This corresponds to an average price increase of{' '}
                                        <strong className="text-amber-400">
                                            {formatCurrency((result.adjustedValue - result.amount) / (result.endYear - result.startYear))} Birr
                                        </strong>{' '}
                                        per year. The amount of the price increase corresponds to the
                                        overall inflation over this period.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Error */}
                {result && result.error && (
                    <div className="mt-1.5 bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-center">
                        <p className="text-red-400 font-bold text-sm">{result.error}</p>
                    </div>
                )}

            </div> {/* End scrollable content */}

            {/* Action Buttons */}
            <div className="mt-1.5 flex gap-1.5 shrink-0">
                <button
                    onClick={handleClear}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="Inflation"
                title="Inflation"
            />
        </div >
    );
};

export default InflationCalculator;

```

## src/features/loan/LoanCalculator.jsx

```javascript
import React, { useState, useRef } from 'react';
import { calculateLoan, getAmortizationSchedule } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { List, X, FileText, FileSpreadsheet, Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FREQUENCIES = [
    { value: 1, label: 'Annually (1)' },
    { value: 2, label: 'Semi-Annually (2)' },
    { value: 4, label: 'Quarterly (4)' },
    { value: 12, label: 'Monthly (12)' },
    { value: 24, label: 'Semi-Monthly (24)' },
    { value: 26, label: 'Bi-Weekly (26)' },
    { value: 52, label: 'Weekly (52)' },
    { value: 365, label: 'Daily (365)' },
];

const INPUT_FIELDS = [
    { id: 'amount', label: 'Loan Amount', sub: 'Principal', decimals: 2 },
    { id: 'rate', label: 'Interest Rate', sub: '% per year', decimals: 2 },
    { id: 'years', label: 'Loan Term', sub: 'Years', decimals: 0 },
];

const LoanCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [useDates, setUseDates] = useState(true);
    const [values, setValues] = useState({
        amount: 374136.48,
        rate: 9.5,
        years: 15,
        frequency: 12,
        paymentsMade: 0,
        startDate: '2018-07-01',
        futureDate: new Date().toISOString().split('T')[0]
    });
    const [result, setResult] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for input focus
    const amountRef = useRef(null);
    const rateRef = useRef(null);
    const yearsRef = useRef(null);
    const paymentsMadeRef = useRef(null);

    const inputRefs = {
        amount: amountRef,
        rate: rateRef,
        years: yearsRef,
        paymentsMade: paymentsMadeRef
    };

    const clearField = (field, ref) => {
        setValues(prev => ({ ...prev, [field]: null }));
        setResult(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const calculatePeriodsBetween = (d1, d2, freq) => {
        const start = new Date(d1), end = new Date(d2);
        if (isNaN(start) || isNaN(end)) return 0;

        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

        const periodMap = {
            365: diffDays, 52: Math.floor(diffDays / 7), 26: Math.floor(diffDays / 14),
            12: months, 24: Math.floor(months * 2 + (end.getDate() - start.getDate()) / 15),
            4: Math.floor(months / 3), 2: Math.floor(months / 6), 1: Math.floor(months / 12)
        };
        return periodMap[freq] ?? months;
    };

    const handleCalculate = () => {
        const amt = values.amount || 0;
        const rate = values.rate || 0;
        const yrs = values.years || 0;
        const freq = values.frequency || 12;
        const pmtMadeState = values.paymentsMade || 0;

        const termPeriods = yrs * freq;
        let pmtMade = useDates
            ? Math.max(0, Math.min(calculatePeriodsBetween(values.startDate, values.futureDate, freq), termPeriods))
            : pmtMadeState;

        const res = calculateLoan(amt, rate, yrs, pmtMade, freq);
        setResult({ ...res, calculatedPayments: pmtMade });
        addToHistory('LOAN', { ...values, useDates, calculatedPayments: pmtMade }, res);
    };

    const handleChange = (field, val) => {
        const isDate = field.toLowerCase().includes('date');
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const numericVal = cleanVal === '' ? null : (parseFloat(cleanVal) || 0);
        setValues(prev => ({ ...prev, [field]: isDate ? val : numericVal }));
        setResult(null);
    };

    const schedule = result ? getAmortizationSchedule(values.amount, values.rate, values.years, values.frequency, values.startDate) : [];
    const usedPayments = result?.calculatedPayments ?? values.paymentsMade;

    // Detect if running on Windows desktop (to skip Web Share API which freezes in Edge)
    const isWindowsDesktop = () => {
        const ua = navigator.userAgent;
        return ua.includes('Windows') && !ua.includes('Mobile');
    };

    const downloadCSV = async () => {
        if (!schedule.length) return;
        const headers = ['Date', 'Period', 'Interest', 'Principal', 'Balance'];
        const rows = schedule.map(r => [r.date || '', r.month, r.interest.toFixed(2), r.principal.toFixed(2), r.balance.toFixed(2)]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').slice(0, 15);
        const fileName = `amortization_schedule_${timestamp}.csv`;

        // Try Web Share API first (works on Android, but skip on Windows desktop to avoid Edge freeze)
        if (!isWindowsDesktop() && navigator.share && navigator.canShare) {
            const file = new File([blob], fileName, { type: 'text/csv' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Amortization Schedule',
                    });
                    return;
                } catch (err) {
                    if (err.name === 'AbortError') return; // User cancelled
                }
            }
        }

        // Direct download method (works reliably on all desktop browsers including Edge)
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);

        // Use setTimeout to ensure the click registers on mobile
        setTimeout(() => {
            link.click();
            document.body.removeChild(link);
            // Clean up the blob URL after a delay
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 100);
    };

    const downloadPDF = async () => {
        if (!schedule.length) return;
        const doc = new jsPDF();
        doc.setTextColor(40);
        doc.setFontSize(18);
        doc.text("Amortization Schedule", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Loan Amount: $${values.amount.toLocaleString()} | Rate: ${values.rate}% | Term: ${values.years} Years`, 14, 30);

        autoTable(doc, {
            head: [["Date", "Period", "Interest", "Principal", "Balance"]],
            body: schedule.map(r => [r.date || '-', r.month,
            `$${r.interest.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            `$${r.principal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            `$${r.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]),
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').slice(0, 15);
        const fileName = `amortization_schedule_${timestamp}.pdf`;
        const pdfBlob = doc.output('blob');

        // Try Web Share API first (works on Android, but skip on Windows desktop to avoid Edge freeze)
        if (!isWindowsDesktop() && navigator.share && navigator.canShare) {
            const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Amortization Schedule',
                    });
                    return;
                } catch (err) {
                    if (err.name === 'AbortError') return; // User cancelled
                }
            }
        }

        // Fallback: Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);

        // Use setTimeout to ensure the click registers on mobile
        setTimeout(() => {
            link.click();
            document.body.removeChild(link);
            // Clean up the blob URL after a delay
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 100);
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Loan Calculator</h1>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title="Show Info"
                        >
                            <Info className="w-3 h-3" />
                        </button>
                        <button onClick={() => setUseDates(!useDates)} className="text-[10px] font-bold uppercase tracking-tighter bg-neutral-800 border border-neutral-700 rounded-full px-3 py-1 text-primary-500 hover:bg-neutral-700 transition-all">
                            {useDates ? 'Use Manual Count' : 'Use Dates'}
                        </button>
                    </div>
                    <select value={values.frequency} onChange={(e) => handleChange('frequency', e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-neutral-300 focus:outline-none">
                        {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Loan & Amortization Calculator</p>
                    <p className="text-[11px] leading-relaxed">
                        Calculate loan payments, total interest, and view full amortization schedules.
                        Track outstanding balances at any point using dates or payment counts.
                        Export schedules to PDF or CSV.
                    </p>
                </div>
            )}

            <div className="relative flex-1 min-h-0">
                {!showSchedule ? (
                    <div className="flex flex-col h-full">
                        <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                            {INPUT_FIELDS.map(field => (
                                <div key={field.id} className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex flex-col shrink-0 items-start text-left">
                                            <label 
                                                onClick={() => clearField(field.id, inputRefs[field.id])}
                                                className="text-base font-bold text-neutral-300 cursor-pointer hover:text-primary-400 transition-colors"
                                                title="Click to Clear"
                                            >
                                                {field.label}
                                            </label>
                                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{field.sub}</span>
                                        </div>
                                        <FormattedNumberInput 
                                            ref={inputRefs[field.id]}
                                            value={values[field.id]} 
                                            onChange={(e) => handleChange(field.id, e.target.value)} 
                                            decimals={field.decimals} 
                                            className="bg-transparent text-right text-xl font-mono text-white focus:outline-none w-full flex-1" 
                                        />
                                    </div>
                                </div>
                            ))}

                            {useDates ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {[{ id: 'startDate', label: 'Start Date' }, { id: 'futureDate', label: 'Future Date' }].map(d => (
                                        <div key={d.id} className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all text-left">
                                            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-2">{d.label}</label>
                                            <input type="date" value={values[d.id]} onChange={(e) => handleChange(d.id, e.target.value)} className="bg-transparent text-white text-sm font-mono focus:outline-none w-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-neutral-800/50 rounded-xl p-3 border border-transparent hover:border-neutral-700 transition-all">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex flex-col shrink-0 items-start text-left">
                                            <label 
                                                onClick={() => clearField('paymentsMade', paymentsMadeRef)}
                                                className="text-base font-bold text-neutral-300 cursor-pointer hover:text-primary-400 transition-colors"
                                                title="Click to Clear"
                                            >
                                                Payments Made
                                            </label>
                                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Count</span>
                                        </div>
                                        <FormattedNumberInput 
                                            ref={paymentsMadeRef}
                                            value={values.paymentsMade} 
                                            onChange={(e) => handleChange('paymentsMade', e.target.value)} 
                                            decimals={0} 
                                            className="bg-transparent text-right text-xl font-mono text-white focus:outline-none w-full flex-1" 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {result && (
                            <div className="bg-neutral-900/50 rounded-2xl p-4 border border-primary-900/30 mb-2 mt-4">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-neutral-400">Periodic Payment</span>
                                        <button onClick={() => setShowSchedule(true)} className="text-[10px] text-primary-500 font-bold uppercase tracking-tighter flex items-center gap-1 mt-1 hover:text-primary-400">
                                            <List size={12} /> View Schedule
                                        </button>
                                        <button
                                            onClick={() => setShowHistory(true)}
                                            className="text-[10px] text-primary-500 font-bold uppercase tracking-tighter flex items-center gap-1 mt-1 hover:text-primary-400"
                                        >
                                            <History size={12} /> View History
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-3xl font-bold text-primary-500">{formatCurrency(result.monthlyPayment)}</span>
                                        {useDates && <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Based on {result.calculatedPayments} periods</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex flex-col gap-1"><span className="text-neutral-500">Total Interest</span><span className="text-white font-mono">{formatCurrency(result.totalInterest)}</span></div>
                                    <div className="flex flex-col gap-1 text-right"><span className="text-neutral-500">Total Cost</span><span className="text-white font-mono">{formatCurrency(result.totalPayment)}</span></div>
                                    {result.outstandingBalance > 0 && (
                                        <div className="col-span-2 pt-2 border-t border-neutral-800 flex justify-between items-center mt-1">
                                            <span className="text-neutral-400">Outstanding Balance</span>
                                            <span className="text-white font-mono font-bold text-base">{formatCurrency(result.outstandingBalance)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-1.5">
                            <button
                                onClick={() => {
                                    setValues({
                                        amount: 0,
                                        rate: 0,
                                        years: 0,
                                        frequency: 12,
                                        paymentsMade: 0,
                                        startDate: new Date().toISOString().split('T')[0],
                                        futureDate: new Date().toISOString().split('T')[0]
                                    });
                                    setResult(null);
                                }}
                                className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                                title="Clear all values"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                CLR
                            </button>
                            <button
                                onClick={toggleHelp}
                                className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                                title="Help Guide"
                            >
                                <HelpCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={toggleSettings}
                                className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                                title="Settings"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                            <button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest">
                                <CalculateIcon className="w-5 h-5" /> Calculate
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-y-0 -left-2 -right-2 bg-[#1a1a1a] rounded-2xl border border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50 shadow-2xl flex flex-col">
                        <div className="p-2 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                            <h3 className="font-bold text-xs text-white uppercase tracking-wider">Amortization</h3>
                            <div className="flex items-center gap-1">
                                <button onClick={downloadCSV} className="p-1 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-green-500" title="Export CSV"><FileSpreadsheet size={16} /></button>
                                <button onClick={downloadPDF} className="p-1 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-red-500" title="Export PDF"><FileText size={16} /></button>
                                <div className="w-px h-4 bg-neutral-700 mx-1" />
                                <button onClick={() => setShowSchedule(false)} className="p-1 hover:bg-neutral-700 rounded-full transition-colors"><X size={16} className="text-neutral-500" /></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto scrollbar-hide">
                            <table className="w-full text-left text-xs">
                                <thead className="sticky top-0 bg-[#1a1a1a] text-neutral-500 font-bold uppercase tracking-wider z-10">
                                    <tr>
                                        <th className="px-1 py-2">Date (Period)</th>
                                        <th className="px-1 py-2 text-right">Interest</th>
                                        <th className="px-1 py-2 text-right">Principal</th>
                                        <th className="px-1 py-2 text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
                                    {schedule.map((row) => (
                                        <tr key={row.month} className={`hover:bg-neutral-800/30 transition-colors ${row.month <= usedPayments ? 'opacity-50' : ''}`}>
                                            <td className="px-1 py-2 font-mono text-neutral-400 whitespace-nowrap">
                                                {row.date && <span className="text-white font-bold mr-1">{row.date}</span>}
                                                <span className="text-neutral-600">({row.month})</span>
                                            </td>
                                            <td className="px-1 py-2 font-mono text-right text-neutral-400">{row.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-1 py-2 font-mono text-right text-neutral-400">{row.principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-1 py-2 font-mono text-emerald-500 font-bold text-right">{row.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="Loan"
                title="Loan"
            />
        </div>
    );
};

export default LoanCalculator;

```

## src/features/pension/PensionCalculator.jsx

```javascript
import React, { useState, useRef } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Wallet, Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const PENSION_TYPES = [
    { id: 'civil', label: 'Civil Servant' },
    { id: 'military', label: 'Military/Police' },
];

const PensionCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    const [pensionType, setPensionType] = useState('civil');
    const [averageSalary, setAverageSalary] = useState(106361.16);
    const [yearsOfService, setYearsOfService] = useState(25);
    const [retirementAge, setRetirementAge] = useState(60);

    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for input focus
    const salaryRef = useRef(null);
    const serviceRef = useRef(null);
    const ageRef = useRef(null);

    const clearField = (setter, ref) => {
        setter(null);
        setResult(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const handleCalculate = () => {
        // Ethiopian Defined Benefit Pension Formula:
        // Civil Servant: Replacement Rate = 30% + (1.25% × years beyond 10)
        // Military/Police: Replacement Rate = 30% + (1.65% × years beyond 10)
        // Minimum service: 10 years
        // Maximum replacement rate: 70%

        const avgSalary = averageSalary || 0;
        const yrsService = yearsOfService || 0;
        const retAge = retirementAge || 0;

        let replacementRate = 0;
        let monthlyPension = 0;
        let annualPension = 0;
        let isEligible = yrsService >= 10;

        if (isEligible) {
            // Base 30% for first 10 years, then accrual rate per additional year
            const additionalYears = Math.max(0, yrsService - 10);
            const accrualRate = pensionType === 'military' ? 1.65 : 1.25;
            replacementRate = 30 + (accrualRate * additionalYears);

            // Cap at 70%
            replacementRate = Math.min(replacementRate, 70);

            monthlyPension = avgSalary * (replacementRate / 100);
            annualPension = monthlyPension * 12;
        }

        const res = {
            isEligible,
            replacementRate,
            monthlyPension,
            annualPension,
            yearsOfService: yrsService,
            retirementAge: retAge,
            averageSalary: avgSalary,
            pensionType: pensionType === 'civil' ? 'Civil Servant' : 'Military/Police',
        };

        setResult(res);
        addToHistory('PENSION', { averageSalary: avgSalary, yearsOfService: yrsService, retirementAge: retAge, pensionType }, res);
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary-500" />
                        Pension Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
                        Ethiopian Defined Benefit Plan
                    </p>
                </div>
                <div className="flex gap-1.5">
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Ethiopian Pension Scheme</p>
                    <p className="text-[11px] leading-relaxed mb-2">
                        Based on the Defined Benefit plan. Pension is calculated as:
                    </p>
                    <ul className="text-[11px] leading-relaxed list-disc list-inside space-y-1">
                        <li>Base rate: 30% for first 10 years of service</li>
                        <li>Civil Servant: +1.25% for each year beyond 10</li>
                        <li>Military/Police: +1.65% for each year beyond 10</li>
                        <li>Maximum replacement rate: 70%</li>
                        <li>Minimum service required: 10 years</li>
                    </ul>
                </div>
            )}

            {/* Input Fields */}
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {/* Pension Type Selector */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1 text-center">Pension Type</label>
                    <div className="grid grid-cols-2 gap-1">
                        {PENSION_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setPensionType(type.id)}
                                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${pensionType === type.id
                                    ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                                    : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Average Salary */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-primary-500/50 ring-1 ring-primary-500/10">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label 
                                onClick={() => clearField(setAverageSalary, salaryRef)}
                                className="text-sm font-bold text-primary-400 block leading-tight text-left cursor-pointer hover:text-white transition-colors"
                                title="Click to Clear"
                            >
                                Average Salary
                            </label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Last 3 Years (36 Months)</span>
                        </div>
                        <FormattedNumberInput
                            ref={salaryRef}
                            value={averageSalary}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setAverageSalary(val);
                                setResult(null);
                            }}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-primary-400 font-black min-w-0 flex-1"
                            placeholder="25,000"
                        />
                    </div>
                </div>

                {/* Years of Service */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label 
                                onClick={() => clearField(setYearsOfService, serviceRef)}
                                className="text-sm font-bold text-white block leading-tight text-left cursor-pointer hover:text-primary-400 transition-colors"
                                title="Click to Clear"
                            >
                                Years of Service
                            </label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Total Working Years</span>
                        </div>
                        <FormattedNumberInput
                            ref={serviceRef}
                            value={yearsOfService}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setYearsOfService(val);
                                setResult(null);
                            }}
                            decimals={0}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                            placeholder="30"
                        />
                    </div>
                </div>

                {/* Retirement Age */}
                <div className="bg-neutral-800/40 rounded-xl p-2.5 border border-transparent hover:border-neutral-700">
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <div className="shrink-0">
                            <label 
                                onClick={() => clearField(setRetirementAge, ageRef)}
                                className="text-sm font-bold text-white block leading-tight text-left cursor-pointer hover:text-primary-400 transition-colors"
                                title="Click to Clear"
                            >
                                Retirement Age
                            </label>
                            <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold text-left block">Expected Age</span>
                        </div>
                        <FormattedNumberInput
                            ref={ageRef}
                            value={retirementAge}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setRetirementAge(val);
                                setResult(null);
                            }}
                            decimals={0}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white min-w-0 flex-1"
                            placeholder="60"
                        />
                    </div>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="mt-2 bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                        <button
                            onClick={() => setShowHistory(true)}
                            className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                        >
                            <History size={12} /> View History
                        </button>
                    </div>

                    {!result.isEligible ? (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-center">
                            <p className="text-red-400 font-bold text-sm">Not Eligible</p>
                            <p className="text-[11px] text-red-300 mt-1">Minimum 10 years of service required</p>
                        </div>
                    ) : (
                        <>
                            {/* Monthly Pension - Main Result */}
                            <div className="bg-neutral-900/80 rounded-lg p-3 border border-primary-500/30">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Monthly Pension</p>
                                <p className="text-2xl font-black text-primary-400">
                                    {formatCurrency(result.monthlyPension)}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-neutral-900/50 rounded-lg p-2.5">
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Annual Pension</p>
                                    <p className="text-lg font-black text-emerald-400">
                                        {formatCurrency(result.annualPension)}
                                    </p>
                                </div>
                                <div className="bg-neutral-900/50 rounded-lg p-2.5">
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Replacement Rate</p>
                                    <p className="text-lg font-black text-amber-400">
                                        {result.replacementRate.toFixed(2)}%
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-700">
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">Type</p>
                                    <p className="text-[10px] font-bold text-white">{result.pensionType}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">Avg Salary</p>
                                    <p className="text-[10px] font-bold text-white">{formatCurrency(result.averageSalary)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">Years</p>
                                    <p className="text-xs font-bold text-white">{result.yearsOfService}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase">Retire</p>
                                    <p className="text-xs font-bold text-white">{result.retirementAge}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-2 flex gap-1.5">
                <button
                    onClick={() => {
                        setPensionType('civil');
                        setAverageSalary(106361.16);
                        setYearsOfService(25);
                        setRetirementAge(60);
                        setResult(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="Pension"
                title="Pension"
            />
        </div>
    );
};

export default PensionCalculator;

```

## src/features/rates/RateConverter.jsx

```javascript
import React, { useState, useRef } from 'react';
import { calculateEAR } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const FREQUENCIES = [
    { n: 1, label: 'Annually' },
    { n: 2, label: 'Semi-Annually' },
    { n: 4, label: 'Quarterly' },
    { n: 12, label: 'Monthly' },
    { n: 24, label: 'Semi-Monthly' },
    { n: 26, label: 'Bi-Weekly' },
    { n: 52, label: 'Weekly' },
    { n: 365, label: 'Daily' },
];

const RateConverter = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();
    const [nominal, setNominal] = useState(5);
    const [compounding, setCompounding] = useState(12);
    const [result, setResult] = useState(null);
    const [doublingTime, setDoublingTime] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Mode toggle: 'toPeriodc' = APR → Periodic, 'toAPR' = Periodic → APR
    const [breakdownMode, setBreakdownMode] = useState('toPeriodic');
    const [periodicRate, setPeriodicRate] = useState(2);
    const [selectedFrequency, setSelectedFrequency] = useState(365); // Default to Daily

    // Refs for input focus
    const nominalRef = useRef(null);
    const periodicRateRef = useRef(null);

    const clearField = (setter, ref) => {
        setter(null);
        setResult(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const handleCalculate = () => {
        const nom = nominal || 0;
        const res = calculateEAR(nom, compounding);
        setResult(res);

        const r = nom / 100;
        let t = r > 0 ? Math.log(2) / (compounding * Math.log(1 + r / compounding)) : 0;

        const years = Math.floor(t);
        const remainderMonths = (t - years) * 12;
        const months = Math.floor(remainderMonths);
        const days = Math.round((remainderMonths - months) * 30.44);

        setDoublingTime({ years, months, days });
        addToHistory('RATES', { nominal: nom, compounding, doublingTime: { years, months, days } }, res);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden max-w-lg mx-auto w-full">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Interest Rates</h1>
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                    title="Show Info"
                >
                    <Info className="w-3 h-3" />
                </button>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Interest Rate Converter</p>
                    <p className="text-[11px] leading-relaxed">
                        Convert between Nominal (APR) and Effective Annual Rates (EAR). See periodic rate
                        breakdowns and calculate how long it takes to double your investment at any rate.
                    </p>
                </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 space-y-2 overflow-y-auto custom-scrollbar pb-1">
                <div className="bg-neutral-800/50 rounded-xl p-2 shrink-0">
                    <div className="flex items-center gap-4 mb-2">
                        <label 
                            onClick={() => clearField(setNominal, nominalRef)}
                            className="text-xs font-bold text-neutral-400 shrink-0 cursor-pointer hover:text-primary-400 transition-colors"
                            title="Click to Clear"
                        >
                            Nominal (%)
                        </label>
                        <FormattedNumberInput 
                            ref={nominalRef}
                            value={nominal} 
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setNominal(val);
                                setResult(null);
                            }} 
                            className="flex-1 w-full bg-transparent text-xl font-mono text-white focus:outline-none border-b border-neutral-700 focus:border-primary-500 transition-colors pb-1 text-right" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Compounding</label>
                        <div className="grid grid-cols-4 gap-1">
                            {FREQUENCIES.map(freq => (
                                <button key={freq.n} onClick={() => setCompounding(freq.n)}
                                    className={`py-1 px-1 rounded text-[9px] font-bold transition-all ${compounding === freq.n ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'}`}>
                                    {freq.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-neutral-800/20 rounded-xl overflow-hidden border border-neutral-800/50 min-h-0">
                    {result !== null ? (
                        <>
                            <div className="bg-neutral-800/80 p-2 border-b border-neutral-800">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Effective Annual Rate</span>
                                    <button
                                        onClick={() => setShowHistory(true)}
                                        className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                                    >
                                        <History size={12} /> History
                                    </button>
                                </div>
                                <div className="text-2xl font-bold text-white font-mono text-center">{result.toFixed(4)}%</div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                                {/* Mode Toggle */}
                                <div className="flex mb-2 bg-neutral-900/50 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setBreakdownMode('toPeriodic')}
                                        className={`flex-1 py-1 px-2 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${breakdownMode === 'toPeriodic' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        APR → Periodic
                                    </button>
                                    <button
                                        onClick={() => setBreakdownMode('toAPR')}
                                        className={`flex-1 py-1 px-2 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all ${breakdownMode === 'toAPR' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        Periodic → APR
                                    </button>
                                </div>

                                {breakdownMode === 'toPeriodic' ? (
                                    /* APR → Periodic Mode (Original) */
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                        {FREQUENCIES.map(freq => (
                                            <div key={freq.n} className="flex justify-between items-center py-1 border-b border-neutral-800/50 last:border-0 text-xs">
                                                <span className="text-neutral-500 truncate mr-2">{freq.label}</span>
                                                <span className="font-mono text-primary-400">{((nominal || 0) / freq.n).toFixed(4)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Periodic → APR Mode (New) */
                                    <div className="space-y-3">
                                        {/* Periodic Rate Input */}
                                        <div className="flex items-center gap-2">
                                            <label 
                                                onClick={() => clearField(setPeriodicRate, periodicRateRef)}
                                                className="text-[10px] font-bold text-neutral-500 shrink-0 cursor-pointer hover:text-primary-400 transition-colors"
                                                title="Click to Clear"
                                            >
                                                Rate (%)
                                            </label>
                                            <FormattedNumberInput
                                                ref={periodicRateRef}
                                                value={periodicRate}
                                                onChange={(e) => {
                                                    const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                                    setPeriodicRate(val);
                                                }}
                                                className="flex-1 bg-transparent text-sm font-mono text-white focus:outline-none border-b border-neutral-700 focus:border-primary-500 transition-colors pb-0.5 text-right"
                                            />
                                        </div>

                                        {/* Frequency Selector */}
                                        <div className="grid grid-cols-4 gap-1">
                                            {FREQUENCIES.map(freq => (
                                                <button
                                                    key={freq.n}
                                                    onClick={() => setSelectedFrequency(freq.n)}
                                                    className={`py-1 px-1 rounded text-[9px] font-bold transition-all ${selectedFrequency === freq.n ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-800'}`}
                                                >
                                                    {freq.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Results */}
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="bg-neutral-900/50 rounded-lg p-2 border border-white/5">
                                                <div className="text-[8px] text-neutral-500 uppercase font-bold mb-0.5">Simple APR</div>
                                                <div className="text-sm font-bold text-white font-mono">
                                                    {((periodicRate || 0) * selectedFrequency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                                </div>
                                            </div>
                                            <div className="bg-neutral-900/50 rounded-lg p-2 border border-white/5">
                                                <div className="text-[8px] text-neutral-500 uppercase font-bold mb-0.5">Compound APY</div>
                                                <div className="text-sm font-bold text-primary-400 font-mono">
                                                    {((Math.pow(1 + (periodicRate || 0) / 100, selectedFrequency) - 1) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-600 p-4">
                            <Info className="w-6 h-6 mb-2 opacity-50" />
                            <p className="text-[10px] text-center uppercase tracking-wider">Results will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {doublingTime && (
                <div className="mt-2 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 rounded-xl p-3 shrink-0 border border-white/10">
                    <div>
                        <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-2 block">Investment Doubling Time</span>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-neutral-900/50 rounded-lg p-1.5 border border-white/5">
                                <div className="text-[9px] text-neutral-500 uppercase font-bold">Years</div>
                                <div className="text-sm font-bold text-white font-mono">{doublingTime.years}</div>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-1.5 border border-white/5">
                                <div className="text-[9px] text-neutral-500 uppercase font-bold">Months</div>
                                <div className="text-sm font-bold text-white font-mono">{doublingTime.months}</div>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-1.5 border border-white/5">
                                <div className="text-[9px] text-neutral-500 uppercase font-bold">Days</div>
                                <div className="text-sm font-bold text-white font-mono">{doublingTime.days}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-2 flex gap-1.5 shrink-0">
                <button
                    onClick={() => {
                        setNominal(5);
                        setCompounding(12);
                        setResult(null);
                        setDoublingTime(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="RATES"
                title="Rate Converter"
            />
        </div>
    );
};

export default RateConverter;

```

## src/features/tbill/TBillCalculator.jsx

```javascript
import React, { useState, useRef } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Receipt, Info, HelpCircle, Trash2, Settings, History } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';

const TENURES = [
    { days: 28, label: '28 Days', sub: '1 Month' },
    { days: 91, label: '91 Days', sub: '3 Months' },
    { days: 182, label: '182 Days', sub: '6 Months' },
    { days: 364, label: '364 Days', sub: '1 Year' },
];

const TBillCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    const [faceValue, setFaceValue] = useState(500000);
    const [totalBudget, setTotalBudget] = useState(490000);
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [tenure, setTenure] = useState(28);
    const [discountRate, setDiscountRate] = useState(12);
    const [brokerageRate, setBrokerageRate] = useState(0.1);

    const [mode, setMode] = useState('forward');
    const [result, setResult] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for input focus
    const faceValueRef = useRef(null);
    const totalBudgetRef = useRef(null);
    const discountRateRef = useRef(null);
    const brokerageRateRef = useRef(null);

    const clearField = (setter, ref) => {
        setter(null);
        setResult(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const calculateMaturityDate = (issueStr, tenureDays) => {
        const issue = new Date(issueStr);
        issue.setDate(issue.getDate() + tenureDays);
        return issue.toISOString().split('T')[0];
    };

    const handleCalculate = () => {
        const maturityDate = calculateMaturityDate(issueDate, tenure);
        const fv = faceValue || 0;
        const budget = totalBudget || 0;
        const disc = discountRate || 0;
        const brok = brokerageRate || 0;

        // Base unit calculations: 5,000 ETB per T-Bill
        const UNIT_FV = 5000;
        const unitPrice = UNIT_FV / (1 + (disc / 100) * (tenure / 365));

        if (mode === 'forward') {
            // Forward: Face Value → Total Consideration
            const quantity = fv > 0 ? Math.floor(fv / UNIT_FV) : 0;
            const actualFaceValue = quantity * UNIT_FV;

            const purchasePrice = quantity * unitPrice;
            const brokerage = purchasePrice * (brok / 100);
            const totalConsideration = purchasePrice + brokerage;
            
            const discountAmount = actualFaceValue - purchasePrice;
            const netReturn = actualFaceValue - totalConsideration;
            const effectiveYield = totalConsideration > 0 ? (netReturn / totalConsideration) * (365 / tenure) * 100 : 0;

            const res = {
                mode: 'forward',
                maturityDate,
                faceValue: actualFaceValue,
                purchasePrice,
                brokerage,
                totalConsideration,
                discountAmount,
                effectiveYield,
                netReturn,
                quantity
            };

            setResult(res);
            addToHistory('T-BILL', { faceValue: actualFaceValue, issueDate, tenure, discountRate: disc, brokerageRate: brok, mode: 'forward' }, res);
        } else {
            // Reverse: Total Consideration → Face Value
            // Quantity = Investment amount ÷ (price + brokerage) (rounded down)
            const unitPriceInclBrok = unitPrice * (1 + (brok / 100));
            const quantity = budget > 0 ? Math.floor(budget / unitPriceInclBrok) : 0;
            
            const purchasePrice = quantity * unitPrice;
            const brokerage = purchasePrice * (brok / 100);
            const totalConsideration = purchasePrice + brokerage;
            
            const computedFaceValue = quantity * UNIT_FV;
            const discountAmount = computedFaceValue - purchasePrice;
            const netReturn = computedFaceValue - totalConsideration;
            const effectiveYield = totalConsideration > 0 ? (netReturn / totalConsideration) * (365 / tenure) * 100 : 0;

            const res = {
                mode: 'reverse',
                maturityDate,
                faceValue: computedFaceValue,
                purchasePrice,
                brokerage,
                totalConsideration,
                discountAmount,
                effectiveYield,
                netReturn,
                quantity
            };

            setResult(res);
            addToHistory('T-BILL', { totalBudget: budget, issueDate, tenure, discountRate: disc, brokerageRate: brok, mode: 'reverse' }, res);
        }
    };

    const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full">
            {/* Header + Mode Toggle */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <Receipt className="w-5 h-5 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">
                            T-Bill Calculator
                        </h1>
                        <p className="text-neutral-500 text-[9px] font-medium uppercase tracking-wider">
                            Treasury Bill Bidding
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex bg-neutral-900/70 rounded-md p-0.5 ring-1 ring-neutral-800">
                        <button
                            onClick={() => { if (mode !== 'forward') { setMode('forward'); setResult(null); } }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'forward' ? 'bg-primary-600/25 text-primary-400 ring-1 ring-primary-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Face→Cost
                        </button>
                        <button
                            onClick={() => { if (mode !== 'reverse') { setMode('reverse'); setResult(null); } }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'reverse' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Budget→Face
                        </button>
                    </div>
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2 mb-2 text-xs text-neutral-300 text-left scale-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="font-bold text-primary-400 mb-1 flex items-center gap-1.5">
                        <Info className="w-3 h-3" />
                        Treasury Bill Unit-Based Bidding
                    </p>
                    <p className="text-[11px] leading-relaxed">
                        {mode === 'forward'
                            ? 'Face→Cost: Enter your target face value. The calculator floors this to the nearest 5,000 ETB unit and calculates your purchase price and brokerage.'
                            : 'Budget→Face: Enter your investment budget. The calculator determines the maximum number of 5,000 ETB units you can afford.'}
                    </p>
                    <p className="text-[11px] leading-relaxed mt-1 text-neutral-400">
                        <span className="font-bold text-primary-400">Unit Logic:</span> T-Bills are sold in denominations of <span className="text-white">5,000 ETB</span>.
                    </p>
                    <p className="text-[11px] leading-relaxed mt-1 text-neutral-500 italic">
                        Yield = (Net Return / Total Cost) × (365 / Days) × 100
                    </p>
                </div>
            )}

            {/* Input Fields */}
            <div className="space-y-1 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                {/* Primary Input — swaps based on mode */}
                {mode === 'forward' ? (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-primary-500/50 ring-1 ring-primary-500/10">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label 
                                    onClick={() => clearField(setFaceValue, faceValueRef)}
                                    className="text-sm font-bold text-primary-400 block leading-tight text-left cursor-pointer hover:text-white transition-colors"
                                    title="Click to Clear"
                                >
                                    Face Value
                                </label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Amount at Maturity</span>
                            </div>
                            <FormattedNumberInput
                                ref={faceValueRef}
                                value={faceValue}
                                onChange={(e) => setFaceValue(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-primary-400 font-black min-w-0 flex-1"
                                placeholder="500,000"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-emerald-500/50 ring-1 ring-emerald-500/10">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="shrink-0">
                                <label 
                                    onClick={() => clearField(setTotalBudget, totalBudgetRef)}
                                    className="text-sm font-bold text-emerald-400 block leading-tight text-left cursor-pointer hover:text-white transition-colors"
                                    title="Click to Clear"
                                >
                                    Budget
                                </label>
                                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Total Consideration</span>
                            </div>
                            <FormattedNumberInput
                                ref={totalBudgetRef}
                                value={totalBudget}
                                onChange={(e) => setTotalBudget(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none text-emerald-400 font-black min-w-0 flex-1"
                                placeholder="490,000"
                            />
                        </div>
                    </div>
                )}

                {/* Tenure Selector */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Tenure (Days)</label>
                    <div className="grid grid-cols-4 gap-1">
                        {TENURES.map(t => (
                            <button
                                key={t.days}
                                onClick={() => setTenure(t.days)}
                                className={`py-1.5 px-1 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${tenure === t.days
                                    ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50'
                                    : 'bg-neutral-900/50 text-neutral-500 hover:bg-neutral-900'
                                    }`}
                            >
                                <span className="text-sm font-black leading-none">{t.days}</span>
                                <span className={`text-[8px] font-bold uppercase tracking-tight ${tenure === t.days ? 'text-primary-400/80' : 'text-neutral-500'}`}>
                                    {t.sub}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Discount Rate & Brokerage Row */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700">
                        <div className="flex flex-col">
                            <label 
                                onClick={() => clearField(setDiscountRate, discountRateRef)}
                                className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 text-left cursor-pointer hover:text-white transition-colors"
                                title="Click to Clear"
                            >
                                Discount Rate %
                            </label>
                            <FormattedNumberInput
                                ref={discountRateRef}
                                value={discountRate}
                                onChange={(e) => setDiscountRate(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none w-full text-white"
                                placeholder="12"
                            />
                        </div>
                    </div>
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700">
                        <div className="flex flex-col">
                            <label 
                                onClick={() => clearField(setBrokerageRate, brokerageRateRef)}
                                className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1 text-left cursor-pointer hover:text-white transition-colors"
                                title="Click to Clear"
                            >
                                Brokerage %
                            </label>
                            <FormattedNumberInput
                                ref={brokerageRateRef}
                                value={brokerageRate}
                                onChange={(e) => setBrokerageRate(e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0))}
                                decimals={2}
                                className="bg-transparent text-right text-lg font-mono focus:outline-none w-full text-white"
                                placeholder="0.1"
                            />
                        </div>
                    </div>
                </div>

                {/* Issue Date */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent hover:border-neutral-700 text-left">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Issue Date</label>
                    <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="bg-transparent text-white text-sm font-mono focus:outline-none w-full"
                    />
                </div>
            </div>

            {/* Results */}
            {result && (() => {
                const isReverse = result.mode === 'reverse';
                return (
                    <div className={`mt-1.5 bg-gradient-to-br ${isReverse ? 'from-emerald-900/30' : 'from-primary-900/30'} to-neutral-800/50 border ${isReverse ? 'border-emerald-500/30' : 'border-primary-500/30'} rounded-xl p-2.5 space-y-2`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                            >
                                <History size={12} /> View History
                            </button>
                        </div>

                        <div className="flex justify-between items-center bg-neutral-900/50 rounded-lg p-2 mb-1 border border-neutral-700/50">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Quantity</span>
                            <span className="text-sm font-black text-primary-400">{result.quantity} UNITS</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                    Purchase Price
                                </p>
                                <p className="text-lg font-black text-primary-400">
                                    {formatCurrency(result.purchasePrice)}
                                </p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Brokerage ({brokerageRate}%)</p>
                                <p className="text-lg font-black text-amber-400">
                                    {formatCurrency(result.brokerage)}
                                </p>
                            </div>
                        </div>

                        <div className={`bg-neutral-900/80 rounded-lg p-2 border ${isReverse ? 'border-emerald-500/30' : 'border-primary-500/30'}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                                        {isReverse ? 'Face Value You Get' : 'Total Consideration'}
                                    </p>
                                    <p className={`text-xl font-black ${isReverse ? 'text-emerald-400' : 'text-white'}`}>
                                        {formatCurrency(isReverse ? result.faceValue : result.totalConsideration)}
                                    </p>
                                </div>
                                {isReverse ? (
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Actual Cost</p>
                                        <p className="text-sm font-black text-white">{formatCurrency(result.totalConsideration)}</p>
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Actual Face Value</p>
                                        <p className="text-sm font-black text-white">{formatCurrency(result.faceValue)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-700 mt-1">
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Maturity</p>
                                <p className="text-xs font-bold text-white">{result.maturityDate}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Discount</p>
                                <p className="text-xs font-bold text-emerald-400">{formatCurrency(result.discountAmount)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Net Return</p>
                                <p className="text-xs font-bold text-emerald-400">{formatCurrency(result.netReturn)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-500 uppercase">Eff. Yield</p>
                                <p className="text-xs font-bold text-emerald-400">{result.effectiveYield.toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Action Buttons */}
            <div className="mt-1.5 flex gap-1.5">
                <button
                    onClick={() => {
                        setFaceValue(500000);
                        setTotalBudget(490000);
                        setTenure(28);
                        setDiscountRate(12);
                        setBrokerageRate(0.1);
                        setIssueDate(new Date().toISOString().split('T')[0]);
                        setResult(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-2.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-2.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="T-Bill"
                title="T-Bill"
            />
        </div>
    );
};

export default TBillCalculator;

```

## src/features/transport/RideFareCalculator.jsx

```javascript
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Car, Info, HelpCircle, Trash2, Settings, History, Loader2, ArrowUpDown, Clock, Map as MapIcon, Navigation, Zap } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import PlacesAutocomplete from '../../components/PlacesAutocomplete';
import { CalculateIcon } from '../../components/Icons';
import { useHistory } from '../../context/HistoryContext';
import { useTransport } from '../../context/TransportContext';
import HistoryOverlay from '../../components/HistoryOverlay';
import DrivingView from '../driving/DrivingView';
import LiveFareTracker from '../driving/LiveFareTracker';

const DEFAULT_VALUES = {
    distance: 15,
    mileage: 0.1,
    costPerLiter: 145,
    serviceMultiplier: 3
};

const hasMapsApi = () => !!window.google?.maps?.DistanceMatrixService;

const RideFareCalculator = ({ toggleHelp, toggleSettings, mapsReady, isActive }) => {
    const { addToHistory } = useHistory();
    const {
        origin, setOrigin,
        destination, setDestination,
        distanceKm, setDistanceKm,
        durationText, setDurationText,
        durationValue, setDurationValue,
        routeVersion,
        clearTransportState
    } = useTransport();

    const [values, setValues] = useState(DEFAULT_VALUES);
    const [locationError, setLocationError] = useState(null);
    const [results, setResults] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showLiveTracker, setShowLiveTracker] = useState(false);

    const [mode, setMode] = useState('forward');
    const [priceToCharge, setPriceToCharge] = useState(585);
    const [roundTrip, setRoundTrip] = useState(false);

    const [fetchingDistance, setFetchingDistance] = useState(false);
    const [distanceSource, setDistanceSource] = useState('manual');
    const [locationLoading, setLocationLoading] = useState(false);
    const [waitMultiplier, setWaitMultiplier] = useState(2.5);

    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);

    // Refs for numeric input focus
    const distanceRef = useRef(null);
    const costPerLiterRef = useRef(null);
    const waitMultiplierRef = useRef(null);
    const serviceMultiplierRef = useRef(null);
    const priceToChargeRef = useRef(null);

    const clearValuesField = (field, ref) => {
        setValues(prev => ({ ...prev, [field]: null }));
        setResults(null);
        setTimeout(() => ref.current?.focus(), 0);
    };

    const clearWaitMultiplier = () => {
        setWaitMultiplier(null);
        setResults(null);
        setTimeout(() => waitMultiplierRef.current?.focus(), 0);
    };

    const clearPriceToCharge = () => {
        setPriceToCharge(null);
        setResults(null);
        setTimeout(() => priceToChargeRef.current?.focus(), 0);
    };

    const handleSwapLocations = useCallback(() => {
        const prevOrigin = origin;
        const prevDest = destination;
        const fromVal = fromInputRef.current?.value || '';
        const toVal = toInputRef.current?.value || '';

        setOrigin(prevDest);
        setDestination(prevOrigin);

        if (fromInputRef.current) fromInputRef.current.value = toVal;
        if (toInputRef.current) toInputRef.current.value = fromVal;
    }, [origin, destination, setOrigin, setDestination]);


    const fetchDistance = useCallback((from, to) => {
        if (!from || !to || !hasMapsApi()) return;
        setFetchingDistance(true);
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [new window.google.maps.LatLng(from.lat, from.lng)],
                destinations: [new window.google.maps.LatLng(to.lat, to.lng)],
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.METRIC,
                drivingOptions: {
                    departureTime: new Date(),
                },
            },
            (response, status) => {
                setFetchingDistance(false);
                if (status === 'OK' && response.rows[0]?.elements[0]?.status === 'OK') {
                    const element = response.rows[0].elements[0];
                    const distanceVal = parseFloat((element.distance.value / 1000).toFixed(2));
                    setValues(prev => ({ ...prev, distance: distanceVal }));
                    setDistanceKm(distanceVal);
                    setDistanceSource('maps');

                    const text = (element.duration_in_traffic?.text || element.duration?.text) || null;
                    setDurationText(text);

                    const durationSec = element.duration_in_traffic?.value || element.duration?.value || 0;
                    setDurationValue(durationSec > 0 ? durationSec / 60 : null);

                    setResults(null);
                }
            }
        );
    }, [setDistanceKm, setDurationText, setDurationValue]);

    // Sync distance when route is selected/changed on the Driving tab
    useEffect(() => {
        if (routeVersion > 0 && distanceKm !== null) {
            setValues(prev => ({ ...prev, distance: distanceKm }));
            setDistanceSource('maps');
            setResults(null); // Clear previous calculation to prompt recalculation with new duration
        }
    }, [routeVersion]);

    // Trigger fetchDistance when both origin and destination become available
    // This covers the race condition where useCurrentLocation and destination selection
    // happen asynchronously and neither handler sees the other value in time.
    const hasFetchedRef = useRef(false);
    useEffect(() => {
        if (origin && destination && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchDistance(origin, destination);
        }
        if (!origin || !destination) {
            hasFetchedRef.current = false;
        }
    }, [origin, destination, fetchDistance]);

    const handleOriginSelected = useCallback((place) => {
        setOrigin(place);
        if (destination) fetchDistance(place, destination);
    }, [destination, fetchDistance, setOrigin]);

    const handleDestinationSelected = useCallback((place) => {
        setDestination(place);
        if (origin) fetchDistance(origin, place);
    }, [origin, fetchDistance, setDestination]);

    const useCurrentLocation = useCallback((setInputValue, isAutoTrigger = false) => {
        if (!navigator.geolocation) return;
        setLocationLoading(true);
        setLocationError(null);

        let watchId;
        let bestPosition = null;
        const TARGET_ACCURACY = 40; // meters
        const TIMEOUT_MS = 10000;   // 10 seconds

        const shouldAbort = () => isAutoTrigger && fromInputRef.current && fromInputRef.current.value !== '';

        const processLocation = (position) => {
            if (shouldAbort()) {
                setLocationLoading(false);
                return;
            }

            const { latitude: lat, longitude: lng } = position.coords;
            const coordsLabel = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            const place = { lat, lng, name: coordsLabel, address: '' };

            const finalize = (name) => {
                setLocationLoading(false);
                if (shouldAbort()) return;

                place.name = name;
                place.address = name;
                setInputValue('📍 ' + name);
                setOrigin(place);
                if (destination) fetchDistance(place, destination);
            };

            const fallbackToCoords = () => {
                finalize(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            };

            // Primary: Use Places API nearbySearch to find actual building/POI names
            if (window.google?.maps?.places) {
                const dummyEl = document.createElement('div');
                dummyEl.style.display = 'none';
                document.body.appendChild(dummyEl);
                const svc = new window.google.maps.places.PlacesService(dummyEl);
                const cleanUp = () => { try { document.body.removeChild(dummyEl); } catch (ex) { } };

                const request = {
                    location: new window.google.maps.LatLng(lat, lng),
                    rankBy: window.google.maps.places.RankBy.DISTANCE,
                    type: 'establishment'
                };

                // Timeout safety net
                let resolved = false;
                const timer = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        cleanUp();
                        console.warn('nearbySearch timed out, falling back to Geocoder');
                        geocoderFallback();
                    }
                }, 4000);

                svc.nearbySearch(request, (places, nearbyStatus) => {
                    if (resolved) return;
                    resolved = true;
                    clearTimeout(timer);
                    cleanUp();

                    console.log('nearbySearch status:', nearbyStatus, 'results:', places);

                    if (nearbyStatus === window.google.maps.places.PlacesServiceStatus.OK && places?.length > 0) {
                        const bestPlace = places[0];
                        const label = bestPlace.name + (bestPlace.vicinity ? `, ${bestPlace.vicinity}` : '');
                        finalize(label);
                    } else {
                        geocoderFallback();
                    }
                });
            } else {
                geocoderFallback();
            }

            // Fallback: Use Geocoder to get neighborhood/sublocality
            function geocoderFallback() {
                if (window.google?.maps?.Geocoder) {
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === 'OK' && results?.length) {
                            const cleanResults = results.filter(r =>
                                !r.types.includes('plus_code') && !r.formatted_address.includes('+')
                            );

                            // Prefer neighborhood or sublocality over unnamed roads
                            const neighborhood = cleanResults.find(r =>
                                r.types.includes('neighborhood') ||
                                r.types.includes('sublocality') ||
                                r.types.includes('administrative_area_level_4') ||
                                r.types.includes('administrative_area_level_3')
                            );

                            // Skip unnamed roads
                            const nonRoute = cleanResults.find(r => !r.types.includes('route'));

                            const fallback = neighborhood || nonRoute || cleanResults[0] || results[0];
                            finalize(fallback.formatted_address);
                        } else {
                            fallbackToCoords();
                        }
                    });
                } else {
                    fallbackToCoords();
                }
            }
        };

        const timeoutId = setTimeout(() => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
            if (bestPosition) {
                processLocation(bestPosition);
            } else {
                setLocationLoading(false);
                if (!shouldAbort()) setLocationError('Location timeout');
            }
        }, TIMEOUT_MS);

        watchId = navigator.geolocation.watchPosition(
            (position) => {
                if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
                    bestPosition = position;
                }

                // If we get a highly accurate fix quickly, stop watching and use it
                if (bestPosition.coords.accuracy <= TARGET_ACCURACY) {
                    navigator.geolocation.clearWatch(watchId);
                    clearTimeout(timeoutId);
                    processLocation(bestPosition);
                }
            },
            (error) => {
                // If we already have *some* position, don't fail completely on a subsequent error
                if (!bestPosition) {
                    setLocationLoading(false);
                    clearTimeout(timeoutId);
                    if (watchId) navigator.geolocation.clearWatch(watchId);

                    if (!shouldAbort()) {
                        if (error.code === 1) setLocationError('Location access denied');
                        else if (error.code === 2 || error.code === 3) setLocationError('Location unavailable');
                    }
                }
            },
            { enableHighAccuracy: true, timeout: TIMEOUT_MS, maximumAge: 0 }
        );

    }, [destination, fetchDistance, setOrigin]);

    // Auto-trigger current location on mount (only when active)
    const locationTriggered = useRef(false);
    useEffect(() => {
        if (!isActive || locationTriggered.current || !hasMapsApi() || !navigator.geolocation) return;
        locationTriggered.current = true;
        const setFromValue = (val) => {
            if (fromInputRef.current) fromInputRef.current.value = val;
        };
        useCurrentLocation(setFromValue, true);
    }, [useCurrentLocation, mapsReady, isActive]);

    const handleCalculate = () => {
        const chargeMultiplier = roundTrip ? 2 : 1;
        const actualFuelMultiplier = 2; // Always estimate fuel for round-trip for true cost out of pocket

        const dist = values.distance || 0;
        const mileage = values.mileage || 0;
        const cost = values.costPerLiter || 0;
        const waitMult = waitMultiplier || 0;
        const serviceMult = values.serviceMultiplier || 0;
        const chargingPrice = priceToCharge || 0;

        const oneWayFuelCost = dist * mileage * cost;
        const chargingFuelCost = oneWayFuelCost * chargeMultiplier;
        const totalFuelCost = oneWayFuelCost * actualFuelMultiplier;

        const waitTimeBase = durationValue != null ? durationValue * 1.1 * waitMult : 0;
        const waitTime = waitTimeBase * 2; // Always double to represent true round-trip even in one-way mode

        if (mode === 'forward') {
            const basePrice = chargingFuelCost * serviceMult;
            const totalToCharge = basePrice + waitTime;
            const revenuePerKm = dist > 0 ? totalToCharge / dist : 0;
            const netGain = totalToCharge - totalFuelCost;
            const netGainPerKm = dist > 0 ? netGain / dist : 0;
            const fuelPerKm = dist > 0 ? (totalFuelCost / dist) / 2 : 0;
            const perHead = totalToCharge / 4;
            const netGainSingle = totalToCharge - oneWayFuelCost;
            const netGainRound = totalToCharge - totalFuelCost;
            const newResults = { totalFuelCost, reasonablePrice: basePrice, totalToCharge, waitTime, revenuePerKm, netGain, netGainPerKm, fuelPerKm, perHead, netGainSingle, netGainRound };
            setResults(newResults);
            addToHistory('Ride', { ...values, mode: 'forward', roundTrip }, newResults);
        } else {
            const totalToCharge = chargingPrice;
            const basePrice = Math.max(0, totalToCharge - waitTime);
            const netGain = totalToCharge - totalFuelCost;
            const perHead = totalToCharge / 4;
            const revenuePerKm = dist > 0 ? totalToCharge / dist : 0;
            const fuelPerKm = dist > 0 ? (totalFuelCost / dist) / 2 : 0;
            const netGainPerKm = dist > 0 ? netGain / dist : 0;
            const serviceMultiplierValue = chargingFuelCost > 0 ? (totalToCharge - waitTime) / chargingFuelCost : 0;
            const netGainSingle = totalToCharge - oneWayFuelCost;
            const netGainRound = totalToCharge - totalFuelCost;
            const newResults = { totalFuelCost, reasonablePrice: basePrice, totalToCharge, waitTime, revenuePerKm, netGain, netGainPerKm, fuelPerKm, perHead, serviceMultiplier: serviceMultiplierValue, netGainSingle, netGainRound };
            setResults(newResults);
            addToHistory('Ride', { ...values, priceToCharge: chargingPrice, mode: 'reverse', roundTrip }, newResults);
        }
    };

    const handleChange = (field, val) => {
        const numericVal = val === '' ? null : (parseFloat(val) || 0);
        setValues(prev => ({ ...prev, [field]: numericVal }));
        if (field === 'distance') setDistanceSource('manual');
        setResults(null);
    };

    const handleClear = () => {
        setValues(DEFAULT_VALUES);
        setPriceToCharge(585);
        setResults(null);
        clearTransportState();
        setDistanceSource('manual');
        setWaitMultiplier(2.5);

        if (fromInputRef.current) fromInputRef.current.value = '';
        if (toInputRef.current) toInputRef.current.value = '';
    };

    const openInGoogleMaps = () => {
        if (!origin || !destination) return;
        const params = `origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving&dir_action=navigate`;
        const webUrl = `https://www.google.com/maps/dir/?api=1&${params}`;

        // Android WebView: use intent:// to force opening the external Google Maps app
        const isAndroid = /android/i.test(navigator.userAgent);
        if (isAndroid) {
            const intentUrl = `intent://maps.google.com/maps/dir/?api=1&${params}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
            window.location.href = intentUrl;
        } else {
            window.open(webUrl, '_blank');
        }
    };

    const formatNum = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const mapsAvailable = mapsReady && hasMapsApi();

    return (
        <div className="flex flex-col h-full relative">
            {/* Header + Mode Toggle (combined) */}
            <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                    <Car className="w-5 h-5 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">
                            Ride Fare
                        </h1>
                        <p className="text-neutral-500 text-[9px] font-medium uppercase tracking-wider">
                            Transport & Fuel
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex bg-neutral-900/70 rounded-md p-0.5 ring-1 ring-neutral-800">
                        <button
                            onClick={() => { if (mode !== 'forward') { setMode('forward'); setResults(null); } }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'forward' ? 'bg-primary-600/25 text-primary-400 ring-1 ring-primary-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Input→Price
                        </button>
                        <button
                            onClick={() => { if (mode !== 'reverse') { setMode('reverse'); setResults(null); } }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${mode === 'reverse' ? 'bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40' : 'text-neutral-500 hover:text-neutral-300'}`}
                        >
                            Price→Split
                        </button>
                    </div>
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                        title="Show Info"
                    >
                        <Info className="w-3 h-3" />
                    </button>
                </div>
            </div>


            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2.5 mb-1.5 text-[11px] text-neutral-300 text-left leading-relaxed space-y-1.5">
                    <p className="font-bold text-primary-400 text-xs">How It Works</p>
                    {mapsAvailable && (
                        <p>📍 <strong className="text-white">Google Maps:</strong> Select From/To locations to auto-fetch driving distance. Your current location is auto-detected on launch using GPS + Places API.</p>
                    )}
                    <p>
                        {mode === 'forward'
                            ? `📐 Enter distance, fuel price, and service multiplier to calculate the recommended fare. Formula: Price = (Distance × Mileage × Fuel Cost × ${roundTrip ? '2' : '1'}) × Service Multiplier + Wait Time Charge.`
                            : `🔄 Enter a known fare to reverse-calculate fuel cost breakdown, net gain, and the implied service multiplier.`}
                    </p>
                    <p>⛽ <strong className="text-white">Mileage:</strong> Fixed at 0.10 L/Km — the baseline fuel consumption rate used in all calculations.</p>
                    <p>🔄 <strong className="text-white">Round Trip (1× / 2×):</strong> {roundTrip ? 'Enabled (2x fuel cost)' : 'Disabled (1x fuel cost)'} – applies a 2x factor to fuel costs when calculating total fare.</p>
                    <p>⏱️ <strong className="text-white">Wait Time:</strong> Estimated travel time + 10% buffer, multiplied by a configurable factor (default 2.5) to estimate total charge for wait time.</p>
                    <p>👥 <strong className="text-white">Per Head:</strong> Total fare split by 4 passengers for cost-sharing.</p>
                    {mapsAvailable && (
                        <>
                            <p className="font-bold text-primary-400 text-xs pt-1">Map & Routes</p>
                            <p>🗺️ <strong className="text-white">View Map:</strong> When both From and To are set, tap "Map & Routes" for a full-screen interactive map with traffic-colored polylines (blue = normal, yellow = slow, red = jam).</p>
                            <p>🔀 <strong className="text-white">Alternate Routes:</strong> Grey lines on the map show alternative routes — tap one to switch. The selected route's distance and time sync back to the calculator automatically.</p>
                            <p>🧭 <strong className="text-white">Turn-by-Turn:</strong> Expand the bottom sheet on the map view for step-by-step navigation directions.</p>
                            <p>⇅ <strong className="text-white">Swap:</strong> Use the swap button between From/To to instantly reverse your route.</p>
                        </>
                    )}
                </div>
            )}

            {/* Route Card - From/To combined into one compact card */}
            {mapsAvailable && (
                <div className="bg-neutral-800/30 rounded-xl p-2 mb-1.5 border border-neutral-700/40">
                    <div className="space-y-0">
                        <PlacesAutocomplete
                            label="From"
                            placeholder="e.g. Bole Airport"
                            onPlaceSelected={handleOriginSelected}
                            accentColor="primary"
                            compact
                            onUseCurrentLocation={useCurrentLocation}
                            locationLoading={locationLoading}
                            externalInputRef={fromInputRef}
                            mapsReady={mapsReady}
                            locationError={locationError}
                        />
                        <div className="flex items-center gap-2 py-0.5 px-4">
                            <div className="flex-1 border-t border-dashed border-neutral-700/60"></div>
                            <button
                                onClick={handleSwapLocations}
                                className="p-0.5 rounded-full hover:bg-neutral-700/50 transition-all active:scale-90 group"
                                title="Swap From and To"
                            >
                                <ArrowUpDown className="w-3 h-3 text-neutral-600 group-hover:text-primary-400 transition-colors" />
                            </button>
                            <div className="flex-1 border-t border-dashed border-neutral-700/60"></div>
                        </div>
                        <PlacesAutocomplete
                            label="To"
                            placeholder="e.g. Megenagna"
                            onPlaceSelected={handleDestinationSelected}
                            accentColor="primary"
                            compact
                            externalInputRef={toInputRef}
                            mapsReady={mapsReady}
                        />
                        {origin && destination && (
                            <div className="flex gap-1.5 mt-2 pt-2 border-t border-neutral-700/40">
                                <button
                                    onClick={() => setShowMap(true)}
                                    className="flex-1 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-primary-500/30 active:scale-[0.98]"
                                >
                                    <MapIcon className="w-4 h-4 text-primary-400" />
                                    Map & Routes
                                </button>
                                <button
                                    onClick={openInGoogleMaps}
                                    className="bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 border border-neutral-700/50 active:scale-[0.98] shrink-0"
                                    title="Open in Google Maps app to compare ride prices"
                                >
                                    <Navigation className="w-3.5 h-3.5 text-primary-400" />
                                    Navigate
                                </button>
                                <button
                                    onClick={() => setShowLiveTracker(true)}
                                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/50 hover:to-amber-500/35 text-amber-400 font-bold text-xs py-2 px-3 rounded-lg transition-all border border-amber-500/40 active:scale-[0.97] shrink-0"
                                    title="Live fare tracking with GPS"
                                >
                                    <Zap className="w-3.5 h-3.5" />
                                    <span>Live</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Inputs - 2 column grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                {/* Distance */}
                <div className={`rounded-xl p-2 border ${distanceSource === 'maps' ? 'bg-emerald-900/10 border-emerald-500/40' : 'bg-neutral-800/40 border-primary-500/40'}`}>
                    <div className="flex justify-between items-center mb-0.5">
                        <label 
                            onClick={() => clearValuesField('distance', distanceRef)}
                            className={`text-[10px] uppercase tracking-wider font-bold block cursor-pointer hover:text-white transition-colors ${distanceSource === 'maps' ? 'text-emerald-400' : 'text-primary-400'}`}
                            title="Click to Clear"
                        >
                            Distance (Km)
                        </label>
                        <div className="flex bg-neutral-900/60 rounded-md p-0.5 ring-1 ring-neutral-700/50">
                            <button
                                onClick={(e) => { e.stopPropagation(); setRoundTrip(false); setResults(null); }}
                                className={`px-1.5 py-0.5 text-[8px] font-bold rounded-sm transition-all ${!roundTrip ? 'bg-amber-500 text-neutral-900' : 'text-neutral-500'}`}
                            >
                                1×
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setRoundTrip(true); setResults(null); }}
                                className={`px-1.5 py-0.5 text-[8px] font-bold rounded-sm transition-all ${roundTrip ? 'bg-amber-500 text-neutral-900' : 'text-neutral-500'}`}
                            >
                                2×
                            </button>
                        </div>
                    </div>
                    {fetchingDistance ? (
                        <div className="flex items-center gap-1 text-primary-400 text-xs py-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                        </div>
                    ) : (
                        <FormattedNumberInput
                            ref={distanceRef}
                            value={values.distance}
                            onChange={(e) => handleChange('distance', e.target.value)}
                            decimals={2}
                            className={`bg-transparent text-right text-lg font-mono focus:outline-none font-black w-full ${distanceSource === 'maps' ? 'text-emerald-400' : 'text-primary-400'}`}
                        />
                    )}
                    <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">
                        {distanceSource === 'maps' ? '✓ Google Maps' : 'Trip Length'}
                    </span>
                </div>

                {/* Fuel Cost */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent">
                    <label 
                        onClick={() => clearValuesField('costPerLiter', costPerLiterRef)}
                        className="text-[10px] uppercase tracking-wider font-bold text-white block mb-0.5 cursor-pointer hover:text-primary-400 transition-colors"
                        title="Click to Clear"
                    >
                        Fuel Cost / Liter
                    </label>
                    <FormattedNumberInput
                        ref={costPerLiterRef}
                        value={values.costPerLiter}
                        onChange={(e) => handleChange('costPerLiter', e.target.value)}
                        decimals={2}
                        className="bg-transparent text-right text-lg font-mono focus:outline-none text-white w-full"
                        placeholder="145.00"
                    />
                    <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">Current Price</span>
                </div>

                {/* Wait Multiplier */}
                <div className="bg-neutral-800/40 rounded-xl p-2 border border-amber-500/30">
                    <label 
                        onClick={clearWaitMultiplier}
                        className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block mb-0.5 cursor-pointer hover:text-white transition-colors"
                        title="Click to Clear"
                    >
                        Wait Multiplier
                    </label>
                    <FormattedNumberInput
                        ref={waitMultiplierRef}
                        value={waitMultiplier}
                        onChange={(e) => {
                            const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                            setWaitMultiplier(val);
                            setResults(null);
                        }}
                        decimals={1}
                        className="bg-transparent text-right text-lg font-mono focus:outline-none text-amber-400 font-black w-full"
                    />
                    <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">Time Factor</span>
                </div>

                {/* Service Factor or Price to Charge */}
                {mode === 'forward' ? (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-transparent">
                        <label 
                            onClick={() => clearValuesField('serviceMultiplier', serviceMultiplierRef)}
                            className="text-[10px] uppercase tracking-wider font-bold text-white block mb-0.5 cursor-pointer hover:text-primary-400 transition-colors"
                            title="Click to Clear"
                        >
                            Service Multiplier
                        </label>
                        <FormattedNumberInput
                            ref={serviceMultiplierRef}
                            value={values.serviceMultiplier}
                            onChange={(e) => handleChange('serviceMultiplier', e.target.value)}
                            decimals={1}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-white w-full"
                        />
                        <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">2.55 – 4.5×</span>
                    </div>
                ) : (
                    <div className="bg-neutral-800/40 rounded-xl p-2 border border-emerald-500/40">
                        <label 
                            onClick={clearPriceToCharge}
                            className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block mb-0.5 cursor-pointer hover:text-white transition-colors"
                            title="Click to Clear"
                        >
                            Price to Charge
                        </label>
                        <FormattedNumberInput
                            ref={priceToChargeRef}
                            value={priceToCharge}
                            onChange={(e) => {
                                const val = e.target.value === '' ? null : (parseFloat(e.target.value.replace(/,/g, '')) || 0);
                                setPriceToCharge(val);
                                setResults(null);
                            }}
                            decimals={2}
                            className="bg-transparent text-right text-lg font-mono focus:outline-none text-emerald-400 font-black w-full"
                        />
                        <span className="text-[8px] uppercase tracking-wider text-neutral-600 font-bold block">Known Fare</span>
                    </div>
                )}
            </div>


            {/* Results */}
            {
                results && (
                    <div className="bg-gradient-to-br from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-2.5 space-y-1.5 mb-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Results</span>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                            >
                                <History size={10} /> History
                            </button>
                        </div>

                        {/* Route & drive time */}
                        {durationText && origin && destination && (
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-900/40 rounded-md px-2 py-1">
                                <Clock className="w-3 h-3 text-primary-400 shrink-0" />
                                <span className="truncate">
                                    {origin.name?.replace('📍 ', '')} → {destination.name?.replace('📍 ', '')}
                                </span>
                                <span className="text-primary-400 font-bold whitespace-nowrap ml-auto">~{durationText}</span>
                            </div>
                        )}


                        {/* Main result row */}
                        <div className="bg-neutral-900/80 rounded-lg p-2.5 border border-primary-500/30">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Total to Charge</p>
                                    <p className="text-2xl font-black text-primary-400">{formatNum(results.totalToCharge)}</p>
                                    {results.waitTime > 0 && (
                                        <p className="text-[8px] text-neutral-600">{formatNum(results.reasonablePrice)} + {formatNum(results.waitTime)}</p>
                                    )}
                                </div>
                                {results.waitTime > 0 && (
                                    <div className="text-center">
                                        <p className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">Wait Time Charge</p>
                                        <p className="text-base font-black text-amber-400">{formatNum(results.waitTime)}</p>
                                    </div>
                                )}
                                <div className="text-right">
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Per Head</p>
                                    <p className="text-lg font-black text-primary-300">{formatNum(results.perHead)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary metrics */}
                        <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Total Fuel Cost</p>
                                <p className="text-base font-black text-amber-400">{formatNum(results.totalFuelCost)}</p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-2">
                                <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Net Gain</p>
                                <p className="text-base font-black text-emerald-400">
                                    {!roundTrip ? (
                                        <>{formatNum(results.netGainSingle)} <span className="text-neutral-500 font-medium">/</span> {formatNum(results.netGainRound)}</>
                                    ) : (
                                        formatNum(results.netGain)
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Per-km breakdown */}
                        <div className={`grid ${mode === 'reverse' && results.serviceMultiplier !== undefined ? 'grid-cols-4' : 'grid-cols-3'} gap-1.5 pt-1.5 border-t border-neutral-700/50`}>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Fuel / Km</p>
                                <p className="text-[10px] font-bold text-white">{formatNum(results.fuelPerKm)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Rev / Km</p>
                                <p className="text-[10px] font-bold text-white">{formatNum(results.revenuePerKm)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-neutral-500 uppercase">Gain / Km</p>
                                <p className="text-[10px] font-bold text-white">{formatNum(results.netGainPerKm)}</p>
                            </div>
                            {mode === 'reverse' && results.serviceMultiplier !== undefined && (
                                <div>
                                    <p className="text-[8px] font-bold text-neutral-500 uppercase">Implied Mult</p>
                                    <p className="text-[10px] font-bold text-white">{results.serviceMultiplier.toFixed(2)}x</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Action Buttons */}
            <div className="mt-auto flex gap-1.5 pt-1">
                <button
                    onClick={handleClear}
                    className="flex-[0.25] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-4 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-4 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="Ride"
                title="Ride Fare"
            />

            <div
                className={`absolute inset-0 bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${showMap
                    ? 'opacity-100 pointer-events-auto scale-100 z-50'
                    : 'opacity-0 pointer-events-none scale-95 -z-10'
                    }`}
            >
                <DrivingView onClose={() => setShowMap(false)} fareData={{ ...results, ...values, waitMultiplier }} onOpenLiveTracker={() => setShowLiveTracker(true)} />
            </div>

            <LiveFareTracker
                isVisible={showLiveTracker}
                onClose={() => setShowLiveTracker(false)}
                fareData={{ ...results, ...values, waitMultiplier }}
            />
        </div >
    );
};

export default RideFareCalculator;

```

## src/features/tvm/TVMCalculator.jsx

```javascript
import React, { useState } from 'react';
import { calculateTVM } from '../../utils/financial-utils';
import { useHistory } from '../../context/HistoryContext';
import { Settings2, Info, HelpCircle, Trash2, Settings, History, X } from 'lucide-react';
import FormattedNumberInput from '../../components/FormattedNumberInput';
import { CalculateIcon } from '../../components/Icons';
import HistoryOverlay from '../../components/HistoryOverlay';
import { useRef } from 'react';

// Constants
const FREQUENCIES = [
    { label: 'Annually (1)', value: 1 },
    { label: 'Semi-Annually (2)', value: 2 },
    { label: 'Quarterly (4)', value: 4 },
    { label: 'Monthly (12)', value: 12 },
    { label: 'Semi-Monthly (24)', value: 24 },
    { label: 'Bi-Weekly (26)', value: 26 },
    { label: 'Weekly (52)', value: 52 },
    { label: 'Daily (365)', value: 365 },
];

const DEFAULT_VALUES = {
    n: 360,
    i: 6.975,
    pv: -3000000,
    pmt: 0,
    fv: 0
};

// Helper: Calculate TVM factors for algebraic solving
const calcTVMFactors = (rate, n, isBeginMode) => {
    const type = isBeginMode ? 1 : 0;
    const pow = Math.pow(1 + rate, n);

    let fvFactorPmt = 0;
    if (Math.abs(rate) < 1e-9) {
        fvFactorPmt = -n;
    } else {
        fvFactorPmt = -((pow - 1) / rate) * (type ? (1 + rate) : 1);
    }

    return {
        termPV: 1 - pow,
        termPMT: n + fvFactorPmt
    };
};


const TVMCalculator = ({ toggleHelp, toggleSettings }) => {
    const { addToHistory } = useHistory();

    // Core state
    const [mode, setMode] = useState('END');
    const [target, setTarget] = useState('fv');
    const [frequency, setFrequency] = useState(12);
    const [compoundingFrequency, setCompoundingFrequency] = useState(12);
    const [isCompoundingManuallySet, setIsCompoundingManuallySet] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [nMode, setNMode] = useState('YEARS');
    const [interestType, setInterestType] = useState('COMPOUND');
    const [showExplanation, setShowExplanation] = useState(false);

    const [values, setValues] = useState(DEFAULT_VALUES);
    const [calculatedValue, setCalculatedValue] = useState(null);
    const [totalInterest, setTotalInterest] = useState(0);
    const [showHistory, setShowHistory] = useState(false);

    // Refs for each input field to support focusing after "Clear on Label"
    const inputRefs = {
        n: useRef(null),
        i: useRef(null),
        pv: useRef(null),
        pmt: useRef(null),
        fv: useRef(null),
        totalInterest: useRef(null),
    };

    const clearField = (fieldId) => {
        if (fieldId === 'totalInterest') {
            setTotalInterest(null);
        } else if (fieldId === 'totalPMT') {
            return; // Read-only
        } else {
            setValues(prev => ({ ...prev, [fieldId]: null }));
        }
        setCalculatedValue(null);
        
        // Focus the input
        setTimeout(() => {
            inputRefs[fieldId]?.current?.focus();
        }, 0);
    };

    // Determine effective sign for TI based on context
    const getEffectiveTI = (ti, calcValues, targetField) => {
        let effectiveTI = ti || 0;
        const pv = calcValues.pv || 0;
        const pmt = calcValues.pmt || 0;

        if (targetField !== 'pv' && targetField !== 'pmt') {
            if (pv > 0 && effectiveTI > 0) effectiveTI = -effectiveTI;
        } else if (pmt < 0 && effectiveTI > 0) {
            effectiveTI = -effectiveTI;
        }
        return effectiveTI;
    };

    // Solve for PV or PMT using TI constraint
    const solveWithTIConstraint = (targetField, calcValues, effectiveTI, effectiveCY) => {
        const rate = calcValues.i || 0;
        const n = calcValues.n || 0;
        const pmt = calcValues.pmt || 0;
        const pv = calcValues.pv || 0;

        const rPeriodic = (rate / 100) / effectiveCY;
        const { termPV, termPMT } = calcTVMFactors(rPeriodic, n, mode === 'BEGIN');

        if (targetField === 'pv') {
            if (Math.abs(termPV) > 1e-9) {
                return (effectiveTI - pmt * termPMT) / termPV;
            }
            return 0;
        }

        if (targetField === 'pmt') {
            let ti = effectiveTI;
            if (pv > 0 && ti > 0) ti = -ti;
            if (Math.abs(termPMT) > 1e-9) {
                return (ti - pv * termPV) / termPMT;
            }
            return 0;
        }

        return null;
    };

    const handleCalculate = () => {
        try {
            const effectiveCY = showAdvanced ? compoundingFrequency : frequency;
            let result;
            let calcValues = { ...values };
            const useTIConstraint = totalInterest !== null && totalInterest !== 0 && target !== 'totalInterest';

            if (useTIConstraint) {
                const effectiveTI = getEffectiveTI(totalInterest, calcValues, target);

                if (target === 'pv' || target === 'pmt') {
                    result = solveWithTIConstraint(target, calcValues, effectiveTI, effectiveCY);
                    calcValues[target] = result;
                    calcValues.fv = effectiveTI - (calcValues.pv || 0) - (calcValues.pmt || 0) * (calcValues.n || 0);
                } else {
                    // Target is I, N, or FV - derive PMT or FV to satisfy TI
                    const adjustedTI = (calcValues.pv || 0) > 0 && effectiveTI > 0 ? -effectiveTI : effectiveTI;

                    if (Math.abs(calcValues.fv || 0) < 0.01 && (calcValues.n || 0) !== 0) {
                        calcValues.pmt = (adjustedTI - (calcValues.pv || 0) - (calcValues.fv || 0)) / calcValues.n;
                        setValues(prev => ({ ...prev, pmt: parseFloat(calcValues.pmt.toFixed(2)) }));
                    } else {
                        calcValues.fv = adjustedTI - (calcValues.pv || 0) - (calcValues.pmt || 0) * (calcValues.n || 0);
                        setValues(prev => ({ ...prev, fv: parseFloat(calcValues.fv.toFixed(2)) }));
                    }
                    // Sanitize for calculateTVM
                    const sanitized = {
                        n: calcValues.n || 0,
                        i: calcValues.i || 0,
                        pv: calcValues.pv || 0,
                        pmt: calcValues.pmt || 0,
                        fv: calcValues.fv || 0
                    };
                    result = calculateTVM(target, sanitized, mode, frequency, interestType, effectiveCY);
                }
            } else if (target === 'totalInterest') {
                // Calculate PMT first if needed
                if (Math.abs(calcValues.pmt || 0) < 0.01) {
                    const sanitized = {
                        n: calcValues.n || 0,
                        i: calcValues.i || 0,
                        pv: calcValues.pv || 0,
                        pmt: calcValues.pmt || 0,
                        fv: calcValues.fv || 0
                    };
                    calcValues.pmt = calculateTVM('pmt', sanitized, mode, frequency, interestType, effectiveCY);
                    setValues(prev => ({ ...prev, pmt: parseFloat(calcValues.pmt.toFixed(2)) }));
                }
                result = (calcValues.pv || 0) + (calcValues.pmt || 0) * (calcValues.n || 0) + (calcValues.fv || 0);
            } else {
                const sanitized = {
                    n: calcValues.n || 0,
                    i: calcValues.i || 0,
                    pv: calcValues.pv || 0,
                    pmt: calcValues.pmt || 0,
                    fv: calcValues.fv || 0
                };
                result = calculateTVM(target, sanitized, mode, frequency, interestType, effectiveCY);
            }

            // Update state
            if (result === 'INVALID_SIGN' || result === 'Error' || (typeof result === 'number' && isNaN(result))) {
                setCalculatedValue(result);
                return;
            }

            setCalculatedValue(result);

            if (target === 'totalInterest') {
                setTotalInterest(result);
                addToHistory('TVM', { ...calcValues, mode, target: 'TI', frequency, compoundingFrequency: effectiveCY, interestType },
                    { pmt: calcValues.pmt, totalInterest: result });
            } else {
                const finalValues = { ...calcValues, [target]: result };
                const currentInterest = (finalValues.pv || 0) + (finalValues.pmt || 0) * (finalValues.n || 0) + (finalValues.fv || 0);
                setTotalInterest(currentInterest);
                setValues(prev => ({ ...prev, [target]: parseFloat(result.toFixed(6)) }));
                addToHistory('TVM', { ...calcValues, mode, target, frequency, compoundingFrequency: effectiveCY, interestType },
                    { [target]: result, totalInterest: currentInterest });
            }
        } catch (error) {
            setCalculatedValue("Error");
        }
    };

    const handleChange = (field, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        // Allow null for empty strings during editing
        let numericVal = cleanVal === '' ? null : parseFloat(cleanVal);
        if (numericVal !== null && isNaN(numericVal)) numericVal = 0;

        if (numericVal !== null && field === 'n' && nMode === 'YEARS') {
            numericVal *= frequency;
        }

        setValues(prev => ({ ...prev, [field]: numericVal }));
        if (field !== target) setCalculatedValue(null);
    };

    const handleInterestInput = (val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        // Allow null for empty strings during editing
        const newInterest = (cleanVal === '' || cleanVal === '-') ? null : parseFloat(cleanVal);
        setTotalInterest(newInterest);
        setCalculatedValue(null);
    };

    const handleFrequencyChange = (newFreq) => {
        if (nMode === 'YEARS') {
            const currentYears = values.n / frequency;
            setValues(prev => ({ ...prev, n: currentYears * newFreq }));
        }
        setFrequency(newFreq);
        if (!showAdvanced || !isCompoundingManuallySet) {
            setCompoundingFrequency(newFreq);
        }
    };

    const getDisplayValue = (field) => {
        if (field === 'n' && nMode === 'YEARS') {
            return values.n === null ? null : values.n / frequency;
        }
        if (field === 'totalInterest') return totalInterest;
        if (field === 'totalPMT') return totalPMT;
        return values[field];
    };

    // Calculate Total PMT - when PV and PMT have different signs, use only PMT × N
    const pv = values.pv || 0;
    const pmt = values.pmt || 0;
    const n = values.n || 0;
    const pvPmtDifferentSigns = (pv > 0 && pmt < 0) || (pv < 0 && pmt > 0);
    const totalPMT = pvPmtDifferentSigns ? (pmt * n) : (pv + (pmt * n));

    // Field definitions
    const fields = [
        { id: 'n', label: nMode === 'YEARS' ? 'Years' : 'N', sub: nMode === 'YEARS' ? 'N / Frequency' : 'Total Periods', hasNToggle: true },
        { id: 'i', label: 'I/Y', sub: 'Annual %' },
        { id: 'pv', label: 'PV', sub: 'Pres Val' },
        { id: 'pmt', label: 'PMT', sub: 'Payment' },
        { id: 'fv', label: 'FV', sub: 'Fut Val' },
        { id: 'totalInterest', label: 'TI', sub: 'Total Interest' },
        { id: 'totalPMT', label: 'ΣPmt', sub: pvPmtDifferentSigns ? 'Total PMT (PMT × N)' : 'Total PMT (PV + PMT × N)', isReadOnly: true },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        TVM Calculator
                    </h1>
                    <p className="text-neutral-500 text-[10px] font-medium uppercase tracking-wider">Time Value of Money</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title="Show Info"
                        >
                            <Info className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => {
                                setShowAdvanced(!showAdvanced);
                                if (showAdvanced) {
                                    setCompoundingFrequency(frequency);
                                    setIsCompoundingManuallySet(false);
                                }
                            }}
                            className={`flex items-center justify-center p-1 rounded-full transition-all ${showAdvanced ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'}`}
                            title={showAdvanced ? "Simple Mode" : "Advanced Mode"}
                        >
                            <Settings2 className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setInterestType(t => t === 'COMPOUND' ? 'SIMPLE' : 'COMPOUND')}
                            className={`flex items-center gap-1 border rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all ${interestType === 'SIMPLE' ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/20' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
                        >
                            {interestType}
                        </button>
                        <button
                            onClick={() => setMode(m => m === 'END' ? 'BEGIN' : 'END')}
                            className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-primary-500 hover:bg-neutral-700 transition-all"
                        >
                            {mode}
                        </button>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <select
                            value={frequency}
                            onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-0.5 text-[10px] font-bold text-neutral-300 focus:outline-none"
                        >
                            {FREQUENCIES.map(f => (
                                <option key={f.value} value={f.value}>
                                    {showAdvanced ? `P/Y: ${f.label.split('(')[0]}` : f.label}
                                </option>
                            ))}
                        </select>
                        {showAdvanced && (
                            <select
                                value={compoundingFrequency}
                                onChange={(e) => { setCompoundingFrequency(Number(e.target.value)); setIsCompoundingManuallySet(true); }}
                                className={`bg-neutral-800 rounded-lg px-2 py-0.5 text-[10px] font-bold focus:outline-none border ${isCompoundingManuallySet ? 'text-primary-400 border-primary-500/50' : 'text-neutral-500 border-neutral-700'}`}
                            >
                                {FREQUENCIES.map(f => (
                                    <option key={f.value} value={f.value}>C/Y: {f.label.split('(')[0]}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-4 text-xs text-neutral-300 text-left">
                    <p className="font-bold text-primary-400 mb-1">Time Value of Money (TVM)</p>
                    <p className="text-[11px] leading-relaxed">
                        Solve for any variable in the TVM equation: N (periods), I/Y (interest rate),
                        PV (present value), PMT (payment), or FV (future value). Supports both
                        compound and simple interest with customizable payment frequencies.
                    </p>
                </div>
            )}

            {/* Target Selector */}
            <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl mb-4 overflow-x-auto scrollbar-hide">
                {fields.filter(f => !f.isReadOnly && f.id !== 'totalInterest').map(field => (
                    <button
                        key={field.id}
                        onClick={() => setTarget(field.id)}
                        className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${target === field.id ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-transparent text-neutral-500 hover:bg-neutral-800'}`}
                    >
                        {field.label}
                    </button>
                ))}
            </div>

            {/* Inputs */}
            <div className="space-y-2 flex-1">
                {fields.map(field => (
                    <div key={field.id} className={`group relative bg-neutral-800/40 rounded-xl p-3 transition-all duration-300 border ${field.isReadOnly ? 'border-neutral-700/50 bg-neutral-900/30' : target === field.id ? 'border-primary-500/50 ring-1 ring-primary-500/10 bg-neutral-800/60' : 'border-transparent hover:border-neutral-700'}`}>
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col items-start text-left">
                                <div className="flex items-center gap-2">
                                    <label 
                                        onClick={() => !field.isReadOnly && clearField(field.id)}
                                        className={`text-sm font-bold transition-colors ${field.isReadOnly ? 'text-neutral-500' : 'cursor-pointer hover:text-white'} ${!field.isReadOnly && target === field.id ? 'text-primary-400' : 'text-neutral-300'}`}
                                        title={!field.isReadOnly ? "Click to Clear" : ""}
                                    >
                                        {field.label}
                                        {field.id === 'totalInterest' && totalInterest !== 0 && totalInterest !== null && ((values.fv || 0) || (values.pv || 0)) !== 0 && (
                                            <span className="text-[#00ff00] ml-1 text-xs">
                                                ({Math.abs((totalInterest / ((values.fv || 0) || (values.pv || 0))) * 100).toFixed(2)}% of {values.fv ? 'FV' : 'PV'})
                                            </span>
                                        )}
                                    </label>
                                    {field.hasNToggle && (
                                        <button
                                            onClick={() => setNMode(m => m === 'YEARS' ? 'PERIODS' : 'YEARS')}
                                            className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-0.5 text-[9px] font-bold text-neutral-400 hover:text-white uppercase tracking-wider"
                                        >
                                            {nMode === 'YEARS' ? 'In Years' : 'In Periods'}
                                        </button>
                                    )}
                                </div>
                                <span className="text-[9px] uppercase tracking-tighter text-neutral-500 font-bold">{field.sub}</span>
                            </div>
                            <div className="relative flex-1 flex items-center justify-end gap-2">
                                <div className="flex-1">
                                    {field.isReadOnly ? (
                                        <span className="block text-right text-lg font-mono text-neutral-400 w-full">
                                            {getDisplayValue(field.id)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    ) : target === field.id && calculatedValue === null ? (
                                        <span className="text-neutral-600 italic text-xs font-bold px-2">CALC...</span>
                                    ) : target === field.id && calculatedValue === 'INVALID_SIGN' ? (
                                        <span className="text-red-400 text-[10px] leading-tight font-bold text-right w-full block">PV/PMT and FV can't have the same sign.</span>
                                    ) : target === field.id && (calculatedValue === "Error" || (typeof calculatedValue === 'number' && isNaN(calculatedValue))) ? (
                                        <span className="text-red-400 italic text-xs font-bold px-2">Error</span>
                                    ) : (
                                        <FormattedNumberInput
                                            ref={inputRefs[field.id]}
                                            value={getDisplayValue(field.id)}
                                            onChange={(e) => field.id === 'totalInterest' ? handleInterestInput(e.target.value) : handleChange(field.id, e.target.value)}
                                            decimals={field.id === 'n' ? 0 : 2}
                                            forceFixedOnFocus={field.id === 'totalInterest'}
                                            className={`bg-transparent text-right text-lg font-mono focus:outline-none w-full placeholder-neutral-700 transition-colors ${target === field.id ? 'text-primary-400 font-black' : 'text-white'}`}
                                            placeholder="0"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View History Link */}
            <div className="mt-3 flex justify-end">
                <button
                    onClick={() => setShowHistory(true)}
                    className="text-[9px] text-primary-500 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-primary-400 transition-colors"
                >
                    <History size={12} /> View History
                </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-2 flex gap-1.5">
                <button
                    onClick={() => {
                        setValues({ n: 0, i: 0, pv: 0, pmt: 0, fv: 0 });
                        setTotalInterest(0);
                        setCalculatedValue(null);
                    }}
                    className="w-[15%] bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-xs py-3.5 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 uppercase tracking-wider"
                    title="Clear all values"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLR
                </button>
                <button
                    onClick={toggleHelp}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Help Guide"
                >
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleSettings}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 font-bold text-sm px-2 rounded-xl active:scale-[0.98] transition-all hover:bg-neutral-700 hover:text-white hover:border-neutral-600 flex items-center justify-center"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-neutral-900 font-black text-base py-3.5 rounded-xl shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    <CalculateIcon className="w-5 h-5" />
                    Calculate
                </button>
            </div>

            {/* History Overlay */}
            <HistoryOverlay
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                module="TVM"
                title="TVM"
            />
        </div>
    );
};

export default TVMCalculator;

```

## src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #121212;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}

```

## src/main.jsx

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

```

## src/utils/arima.js

```javascript
/**
 * ARIMA(p, d, q) Time-Series Forecasting
 * 
 * Implements Auto-Regressive Integrated Moving Average model
 * for client-side inflation prediction.
 * 
 * - AR(p): Autoregressive component using OLS estimation
 * - I(d):  Differencing to achieve stationarity
 * - MA(q): Moving Average component via iterative residual estimation
 */

/**
 * Apply differencing to make the series stationary.
 * @param {number[]} series - Input time series
 * @param {number} d - Order of differencing
 * @returns {number[]} Differenced series
 */
const difference = (series, d = 1) => {
    let result = [...series];
    for (let i = 0; i < d; i++) {
        const diffed = [];
        for (let j = 1; j < result.length; j++) {
            diffed.push(result[j] - result[j - 1]);
        }
        result = diffed;
    }
    return result;
};

/**
 * Reverse differencing to recover original scale.
 * @param {number[]} diffSeries - Differenced series (forecasts)
 * @param {number[]} originalTail - Last d values from the original series before differencing
 * @param {number} d - Order of differencing
 * @returns {number[]} Un-differenced forecasts
 */
const undifference = (diffForecasts, originalTail, d = 1) => {
    let result = [...diffForecasts];
    for (let i = 0; i < d; i++) {
        const lastOriginal = originalTail[originalTail.length - 1 - i];
        const undiffed = [];
        let prev = lastOriginal;
        for (const val of result) {
            prev = prev + val;
            undiffed.push(prev);
        }
        result = undiffed;
    }
    return result;
};

/**
 * Estimate AR coefficients using OLS (Ordinary Least Squares).
 * Solves the normal equations: (X'X)^-1 X'y
 * @param {number[]} series - Stationary time series
 * @param {number} p - AR order
 * @returns {{ coefficients: number[], intercept: number }}
 */
const estimateAR = (series, p) => {
    if (series.length <= p) {
        return { coefficients: new Array(p).fill(0), intercept: 0 };
    }

    const n = series.length - p;
    // Build design matrix X and target vector y
    const X = [];
    const y = [];

    for (let i = p; i < series.length; i++) {
        const row = [1]; // intercept term
        for (let j = 1; j <= p; j++) {
            row.push(series[i - j]);
        }
        X.push(row);
        y.push(series[i]);
    }

    // Solve normal equations: (X'X) beta = X'y
    const cols = p + 1;
    const XtX = Array.from({ length: cols }, () => new Array(cols).fill(0));
    const Xty = new Array(cols).fill(0);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < cols; k++) {
                XtX[j][k] += X[i][j] * X[i][k];
            }
            Xty[j] += X[i][j] * y[i];
        }
    }

    // Add small ridge regularization for numerical stability
    for (let j = 0; j < cols; j++) {
        XtX[j][j] += 1e-8;
    }

    // Gaussian elimination with partial pivoting
    const beta = solveLinearSystem(XtX, Xty);

    return {
        intercept: beta[0],
        coefficients: beta.slice(1),
    };
};

/**
 * Solve a linear system Ax = b via Gaussian elimination with partial pivoting.
 * @param {number[][]} A - Coefficient matrix (will be modified)
 * @param {number[]} b - RHS vector (will be modified)
 * @returns {number[]} Solution vector
 */
const solveLinearSystem = (A, b) => {
    const n = b.length;
    const augmented = A.map((row, i) => [...row, b[i]]);

    for (let col = 0; col < n; col++) {
        // Partial pivoting
        let maxRow = col;
        let maxVal = Math.abs(augmented[col][col]);
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(augmented[row][col]) > maxVal) {
                maxVal = Math.abs(augmented[row][col]);
                maxRow = row;
            }
        }
        [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];

        if (Math.abs(augmented[col][col]) < 1e-12) continue;

        // Eliminate below
        for (let row = col + 1; row < n; row++) {
            const factor = augmented[row][col] / augmented[col][col];
            for (let j = col; j <= n; j++) {
                augmented[row][j] -= factor * augmented[col][j];
            }
        }
    }

    // Back substitution
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = augmented[i][n];
        for (let j = i + 1; j < n; j++) {
            sum -= augmented[i][j] * x[j];
        }
        x[i] = Math.abs(augmented[i][i]) > 1e-12 ? sum / augmented[i][i] : 0;
    }
    return x;
};

/**
 * Estimate MA coefficients from residuals using iterative OLS.
 * @param {number[]} series - Stationary series
 * @param {number} p - AR order
 * @param {number[]} arCoeffs - AR coefficients
 * @param {number} arIntercept - AR intercept
 * @param {number} q - MA order
 * @returns {{ maCoefficients: number[], residuals: number[] }}
 */
const estimateMA = (series, p, arCoeffs, arIntercept, q) => {
    if (q === 0) {
        // No MA component, just compute residuals
        const residuals = computeResiduals(series, p, arCoeffs, arIntercept, [], 0);
        return { maCoefficients: [], residuals };
    }

    // Iterative estimation: compute residuals, then regress on lagged residuals
    let maCoeffs = new Array(q).fill(0);
    let residuals = computeResiduals(series, p, arCoeffs, arIntercept, maCoeffs, q);

    // 3 iterations of refinement
    for (let iter = 0; iter < 3; iter++) {
        // Build regression of current residuals on lagged residuals
        const n = residuals.length - q;
        if (n <= 0) break;

        const X = [];
        const y = [];
        for (let i = q; i < residuals.length; i++) {
            const row = [];
            for (let j = 1; j <= q; j++) {
                row.push(residuals[i - j]);
            }
            X.push(row);
            // Target: the portion of residual not explained by AR
            y.push(residuals[i]);
        }

        // OLS for MA coefficients
        const XtX = Array.from({ length: q }, () => new Array(q).fill(0));
        const Xty = new Array(q).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < q; j++) {
                for (let k = 0; k < q; k++) {
                    XtX[j][k] += X[i][j] * X[i][k];
                }
                Xty[j] += X[i][j] * y[i];
            }
        }
        for (let j = 0; j < q; j++) XtX[j][j] += 1e-6;

        maCoeffs = solveLinearSystem(XtX, Xty);

        // Clamp MA coefficients for stability (invertibility condition)
        maCoeffs = maCoeffs.map(c => Math.max(-0.95, Math.min(0.95, c)));

        // Recompute residuals with updated MA coefficients
        residuals = computeResiduals(series, p, arCoeffs, arIntercept, maCoeffs, q);
    }

    return { maCoefficients: maCoeffs, residuals };
};

/**
 * Compute residuals given AR and MA parameters.
 */
const computeResiduals = (series, p, arCoeffs, arIntercept, maCoeffs, q) => {
    const residuals = new Array(series.length).fill(0);
    const start = Math.max(p, q);

    for (let i = start; i < series.length; i++) {
        let arPart = arIntercept;
        for (let j = 0; j < p; j++) {
            arPart += arCoeffs[j] * series[i - 1 - j];
        }
        let maPart = 0;
        for (let j = 0; j < q; j++) {
            if (i - 1 - j >= 0) {
                maPart += maCoeffs[j] * residuals[i - 1 - j];
            }
        }
        const predicted = arPart + maPart;
        residuals[i] = series[i] - predicted;
    }

    return residuals;
};

/**
 * Forecast future values using fitted ARIMA model.
 * @param {object} model - Fitted model parameters
 * @param {number[]} originalSeries - Original (undifferenced) series
 * @param {number} steps - Number of future steps to forecast
 * @returns {number[]} Forecasted values in original scale
 */
const forecast = (model, originalSeries, steps) => {
    const { p, d, q, arCoeffs, arIntercept, maCoeffs, residuals, diffSeries } = model;

    // Forecast on the differenced series
    const history = [...diffSeries];
    const resHistory = [...residuals];
    const forecasts = [];

    for (let s = 0; s < steps; s++) {
        let arPart = arIntercept;
        for (let j = 0; j < p; j++) {
            const idx = history.length - 1 - j;
            arPart += arCoeffs[j] * (idx >= 0 ? history[idx] : 0);
        }
        let maPart = 0;
        for (let j = 0; j < q; j++) {
            const idx = resHistory.length - 1 - j;
            maPart += maCoeffs[j] * (idx >= 0 ? resHistory[idx] : 0);
        }
        const nextVal = arPart + maPart;
        forecasts.push(nextVal);
        history.push(nextVal);
        resHistory.push(0); // Future residuals assumed zero
    }

    // Un-difference to get back to original scale
    const tail = originalSeries.slice(-d);
    return undifference(forecasts, tail.length > 0 ? tail : [originalSeries[originalSeries.length - 1]], d);
};

/**
 * Fit an ARIMA(p, d, q) model to a time series.
 * @param {number[]} series - Original time series values
 * @param {number} p - AR order (default: 2)
 * @param {number} d - Differencing order (default: 1)
 * @param {number} q - MA order (default: 1)
 * @returns {object} Fitted model with AIC/BIC diagnostics
 */
export const fitARIMA = (series, p = 2, d = 1, q = 1) => {
    // Step 1: Difference the series
    const diffSeries = difference(series, d);

    // Step 2: Estimate AR parameters
    const { coefficients: arCoeffs, intercept: arIntercept } = estimateAR(diffSeries, p);

    // Step 3: Estimate MA parameters
    const { maCoefficients: maCoeffs, residuals } = estimateMA(
        diffSeries, p, arCoeffs, arIntercept, q
    );

    // Compute model diagnostics
    const start = Math.max(p, q);
    const fittedResiduals = residuals.slice(start);
    const n = fittedResiduals.length;

    if (n === 0) {
        return {
            p, d, q, arCoeffs, arIntercept, maCoeffs, residuals, diffSeries,
            rmse: Infinity, mse: Infinity, aic: Infinity, bic: Infinity,
        };
    }

    const sse = fittedResiduals.reduce((sum, r) => sum + r * r, 0);
    const mse = sse / n;
    const rmse = Math.sqrt(mse);

    // Number of estimated parameters: p AR + q MA + 1 intercept + 1 variance
    const k = p + q + 2;

    // AIC = n * ln(MSE) + 2k
    // BIC = n * ln(MSE) + k * ln(n)
    const logMSE = mse > 0 ? Math.log(mse) : -Infinity;
    const aic = n * logMSE + 2 * k;
    const bic = n * logMSE + k * Math.log(n);

    return {
        p, d, q,
        arCoeffs,
        arIntercept,
        maCoeffs,
        residuals,
        diffSeries,
        rmse,
        mse,
        aic,
        bic,
    };
};

/**
 * Automatic ARIMA model selection using AIC/BIC.
 * Grid searches over candidate (p, d, q) orders and selects the model
 * with the lowest AIC.
 *
 * @param {number[]} series - Historical time series values
 * @param {{ maxP?: number, maxD?: number, maxQ?: number, criterion?: 'aic'|'bic' }} options
 * @returns {object} Best fitted model
 */
export const autoARIMA = (series, {
    maxP = 4,
    maxD = 2,
    maxQ = 3,
    criterion = 'aic',
} = {}) => {
    let bestModel = null;
    let bestScore = Infinity;
    const candidates = [];

    for (let d = 0; d <= maxD; d++) {
        const diffSeries = difference(series, d);
        // Need enough data points after differencing
        if (diffSeries.length < 10) continue;

        for (let p = 0; p <= maxP; p++) {
            for (let q = 0; q <= maxQ; q++) {
                // Skip trivial model (no AR, no MA, no differencing)
                if (p === 0 && q === 0 && d === 0) continue;
                // Need enough observations for the parameters
                if (diffSeries.length <= p + q + 2) continue;

                try {
                    const model = fitARIMA(series, p, d, q);
                    const score = criterion === 'bic' ? model.bic : model.aic;

                    if (isFinite(score)) {
                        candidates.push({
                            p, d, q,
                            aic: model.aic,
                            bic: model.bic,
                            rmse: model.rmse,
                        });

                        if (score < bestScore) {
                            bestScore = score;
                            bestModel = model;
                        }
                    }
                } catch {
                    // Skip models that fail to fit
                    continue;
                }
            }
        }
    }

    // Sort candidates by the chosen criterion for reporting
    candidates.sort((a, b) => (criterion === 'bic' ? a.bic - b.bic : a.aic - b.aic));

    // Fallback to ARIMA(1,1,0) if nothing worked
    if (!bestModel) {
        bestModel = fitARIMA(series, 1, 1, 0);
    }

    bestModel.criterion = criterion;
    bestModel.topCandidates = candidates.slice(0, 5); // Top 5 for display

    return bestModel;
};

/**
 * Run ARIMA forecast with automatic model selection via AIC/BIC.
 * @param {number[]} series - Historical time series values
 * @param {number} steps - Number of future periods to predict
 * @param {{ auto?: boolean, p?: number, d?: number, q?: number, criterion?: 'aic'|'bic' }} options
 * @returns {{ predictions: number[], model: object }}
 */
export const arimaForecast = (series, steps, { auto = true, p = 2, d = 1, q = 1, criterion = 'aic' } = {}) => {
    const model = auto
        ? autoARIMA(series, { criterion })
        : fitARIMA(series, p, d, q);

    const predictions = forecast(model, series, steps);

    // Clamp predictions to reasonable bounds for inflation (-20% to 100%)
    const clamped = predictions.map(v => Math.max(-20, Math.min(100, v)));

    return {
        predictions: clamped,
        model,
    };
};

```

## src/utils/financial-utils.js

```javascript
export const calculateTVM = (target, values, mode = 'END', frequency = 12, interestType = 'COMPOUND', compoundingFrequency = null) => {
    let { n, i, pv, pmt, fv } = values;
    const type = mode === 'BEGIN' ? 1 : 0;

    // If compoundingFrequency is not provided, assume it equals payment frequency (Standard TVM)
    const cy = compoundingFrequency || frequency;
    const py = frequency;

    // Standard Financial Calculator Logic
    // r = Effective Rate per Payment Period
    let r;

    if (interestType === 'SIMPLE') {
        // Simple Interest logic remains based on Payment Frequency
        r = (i / 100) / py;
    } else {
        // Compound Interest
        // When CY != PY, we need to find the effective rate per payment period
        // 
        // Standard approach (used by financial calculators like TI BA II+):
        // 1. Convert nominal annual rate to effective annual rate using CY
        //    EAR = (1 + i/CY)^CY - 1
        // 2. Convert EAR to rate per payment period
        //    r = (1 + EAR)^(1/PY) - 1
        // 
        // Combined formula: r = (1 + i/CY)^(CY/PY) - 1

        const r_periodic = (i / 100) / cy;

        // Convert to Effective Rate per Payment Period
        r = Math.pow(1 + r_periodic, cy / py) - 1;
    }

    if (interestType === 'SIMPLE') {
        const t = n; // Time in periods

        // Factors
        // PV Factor: (1 + r*n)
        const pvFactor = 1 + r * n;

        // Annuity Factor (Sum of simple interest on payments)
        // END: n + r*n*(n-1)/2
        // BEGIN: n + r*n*(n+1)/2
        let pmtFactor = 0;
        if (mode === 'END') {
            pmtFactor = n + r * n * (n - 1) / 2;
        } else {
            pmtFactor = n + r * n * (n + 1) / 2;
        }

        if (target === 'fv') {
            // FV + PV(1+rn) + PMT(Factor) = 0
            return -(pv * pvFactor + pmt * pmtFactor);
        }

        if (target === 'pv') {
            // PV = -(FV + PMT*Factor) / (1+rn)
            if (pvFactor === 0) return 0; // Should not happen for positive rates
            return -(fv + pmt * pmtFactor) / pvFactor;
        }

        if (target === 'pmt') {
            // PMT = -(FV + PV(1+rn)) / Factor
            if (pmtFactor === 0) return 0;
            return -(fv + pv * pvFactor) / pmtFactor;
        }

        if (target === 'i') {
            // Solve for r (Linear)
            // FV + PV(1+rn) + PMT(n + r*k) = 0 where k is the n(n-1)/2 or similar
            // FV + PV + PV*r*n + PMT*n + PMT*r*k = 0
            // r(PV*n + PMT*k) = -(FV + PV + PMT*n)
            // r = -(FV + PV + PMT*n) / (PV*n + PMT*k)

            const k = mode === 'END' ? n * (n - 1) / 2 : n * (n + 1) / 2;
            const numerator = -(fv + pv + pmt * n);
            const denominator = pv * n + pmt * k;

            if (Math.abs(denominator) < 1e-9) return 0;
            const calculatedR = numerator / denominator;
            return calculatedR * py * 100; // Use py for simple interest annualization
        }

        if (target === 'n') {
            // Solve for n (Quadratic for PMT != 0, Linear for PMT == 0)
            // FV + PV(1+rn) + PMT(n + r*n(n-1)/2) = 0    (assuming END)
            // FV + PV + PVrn + PMT*n + PMT*r/2 * (n^2 - n) = 0
            // (PMT*r/2) n^2 + (PV*r + PMT - PMT*r/2) n + (FV + PV) = 0

            // If PMT = 0: FV + PV + PVrn = 0 => PVrn = -(FV+PV) => n = -(FV+PV)/(PV*r)
            if (Math.abs(pmt) < 1e-9) {
                if (Math.abs(pv * r) < 1e-9) return 0;
                return -(fv + pv) / (pv * r);
            }

            // Quadratic Ax^2 + Bx + C = 0
            let A, B, C;
            C = fv + pv;

            if (mode === 'END') {
                // pmtFactor = n + r/2 * (n^2 - n) = (r/2)n^2 + (1 - r/2)n
                A = pmt * r / 2;
                B = pv * r + pmt * (1 - r / 2);
            } else {
                // pmtFactor = n + r/2 * (n^2 + n) = (r/2)n^2 + (1 + r/2)n
                A = pmt * r / 2;
                B = pv * r + pmt * (1 + r / 2);
            }

            if (Math.abs(A) < 1e-9) {
                // Linear
                return -C / B;
            }

            // Quadratic formula (-B +/- sqrt(B^2 - 4AC)) / 2A
            const discriminant = B * B - 4 * A * C;
            if (discriminant < 0) return 0; // No real solution

            const sqrtD = Math.sqrt(discriminant);
            const r1 = (-B + sqrtD) / (2 * A);
            const r2 = (-B - sqrtD) / (2 * A);

            // Return positive reasonable root
            if (r1 > 0) return r1;
            if (r2 > 0) return r2;
            return 0;
        }

        return 0;
    }

    // COMPOUND (General Logic)
    if (target === 'fv') {
        if (r === 0) {
            return -(pv + pmt * n);
        }
        const factor = Math.pow(1 + r, n);
        const fvVal = -(pv * factor + pmt * (1 + r * type) * (factor - 1) / r);
        return fvVal;
    }

    if (target === 'pv') {
        if (r === 0) {
            return -(fv + pmt * n);
        }
        const factor = Math.pow(1 + r, -n);
        const pvVal = -(fv * factor + pmt * (1 + r * type) * (1 - factor) / r);
        return pvVal;
    }

    if (target === 'pmt') {
        if (r === 0) {
            return -(pv + fv) / n;
        }
        const factor = Math.pow(1 + r, n);
        const pmtVal = -(pv * factor + fv) / ((1 + r * type) * (factor - 1) / r);
        return pmtVal;
    }

    if (target === 'n') {
        if (r === 0) {
            return -(pv + fv) / pmt;
        }
        // n = log((PMT*(1+r*type) - FV*r) / (PMT*(1+r*type) + PV*r)) / log(1+r)
        const pmtAdj = pmt * (1 + r * type);
        const num = pmtAdj - fv * r;
        const den = pmtAdj + pv * r;

        // Safety check for log issues
        if (num / den <= 0) return 0;

        const nVal = Math.log(num / den) / Math.log(1 + r);
        return nVal;
    }

    if (target === 'i') {
        // Newton-Raphson approximation for I/Y (Annual Interest Rate)

        // 1. Validate Signs: There must be at least one positive and one negative cash flow
        // unless all are zero.
        // We consider PV, PMT, FV.
        // Note: This assumes standard financing where r > -100%
        const hasPositive = pv > 0 || pmt > 0 || fv > 0;
        const hasNegative = pv < 0 || pmt < 0 || fv < 0;
        const allZero = values.n > 0 && Math.abs(pv) < 1e-9 && Math.abs(pmt) < 1e-9 && Math.abs(fv) < 1e-9;

        if (!allZero && (!hasPositive || !hasNegative)) {
            return 'INVALID_SIGN';
        }

        let iGuess = 5.0; // Initial guess 5% annual

        const calculateF_Deriv = (iVal) => {
            const r_p = (iVal / 100) / cy;
            const r_eff = Math.pow(1 + r_p, cy / py) - 1;

            // If r is effectively 0
            if (Math.abs(r_eff) < 1e-9) {
                const fValue = pv + pmt * n + fv;
                return { fValue, r_eff };
            }

            const factor = Math.pow(1 + r_eff, n);
            const factorInv = 1 / factor;
            const term1 = (1 + r_eff * type);
            const geometricSeries = (1 - factorInv) / r_eff;

            const fValue = pv + pmt * term1 * geometricSeries + fv * factorInv;
            return { fValue, r_eff };
        };

        let iter = 0;
        let x0 = iGuess;

        for (iter = 0; iter < 100; iter++) {
            const y0 = calculateF_Deriv(x0).fValue;
            if (Math.abs(y0) < 1e-6) return x0;

            // Numerical Derivative
            const delta = 1e-4;
            const x1 = x0 + delta;
            const y1 = calculateF_Deriv(x1).fValue;
            const derivative = (y1 - y0) / delta;

            if (Math.abs(derivative) < 1e-9) break; // Flats

            const nextX = x0 - y0 / derivative;

            // Damping or bounds check could go here, but for now just check convergence
            if (Math.abs(nextX - x0) < 1e-7) {
                // Check if it's a root
                if (Math.abs(calculateF_Deriv(nextX).fValue) < 1e-4) return nextX;
                return NaN; // Converged to non-root
            }
            x0 = nextX;
        }

        // Final check
        if (Math.abs(calculateF_Deriv(x0).fValue) < 1e-4) return x0;
        return NaN;
    }

    return 0;
};

export const calculateLoan = (amount, rate, termYears, paymentsMade = 0, frequency = 12) => {
    const r = rate / 100 / frequency;
    const n = termYears * frequency;

    // Periodic Payment Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    let payment = 0;
    if (r === 0) {
        payment = amount / n;
    } else {
        payment = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = payment * n;
    const totalInterest = totalPayment - amount;

    // Calculate Outstanding Balance
    // B = P * ((1+r)^n - (1+r)^p) / ((1+r)^n - 1)
    let balance = 0;
    if (paymentsMade < n) {
        if (r === 0) {
            balance = amount - (payment * paymentsMade);
        } else {
            const factorN = Math.pow(1 + r, n);
            const factorP = Math.pow(1 + r, paymentsMade);
            balance = amount * (factorN - factorP) / (factorN - 1);
        }
    }

    return {
        monthlyPayment: payment, // Kept key name for compatibility, but represents periodic payment
        totalPayment,
        totalInterest,
        outstandingBalance: Math.max(0, balance)
    };
};

export const calculateBond = (faceValue, couponRate, ytm, years, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency; // Coupon payment
    const r = (ytm / 100) / frequency; // Periodic yield
    const n = years * frequency; // Total periods

    // Bond Price = C * (1 - (1+r)^-n)/r + F * (1+r)^-n
    let price = 0;
    if (r === 0) {
        price = c * n + faceValue;
    } else {
        const factor = Math.pow(1 + r, -n);
        price = c * ((1 - factor) / r) + faceValue * factor;
    }
    return price;
};

export const calculateBondYTM = (faceValue, couponRate, price, years, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency;
    const n = years * frequency;

    // Newton-Raphson to find periodic rate r
    // f(r) = c * ((1 - (1+r)^-n) / r) + faceValue * (1+r)^-n - price = 0
    let r = (couponRate / 100) / frequency; // Start guess with coupon rate
    if (r === 0) r = 0.05 / frequency;

    for (let i = 0; i < 100; i++) {
        const factor = Math.pow(1 + r, -n);
        const f = c * ((1 - factor) / r) + faceValue * factor - price;

        // Derivative: f'(r) = c * [ (n*r*(1+r)^-(n+1) - (1-(1+r)^-n)) / r^2 ] - n*faceValue*(1+r)^-(n+1)
        const dF = c * ((n * r * Math.pow(1 + r, -n - 1) - (1 - factor)) / (r * r)) - n * faceValue * Math.pow(1 + r, -n - 1);

        if (Math.abs(dF) < 1e-12) break;

        const nextR = r - f / dF;
        if (Math.abs(nextR - r) < 1e-8) {
            return nextR * frequency * 100;
        }
        r = nextR;
    }
    return r * frequency * 100;
};

export const getAmortizationSchedule = (amount, rate, termYears, frequency = 12, startDate = null) => {
    const r = rate / 100 / frequency;
    const n = termYears * frequency;
    let payment = 0;
    if (r === 0) {
        payment = amount / n;
    } else {
        payment = amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const schedule = [];
    let balance = amount;

    // Parse start date if provided
    let currentDate = startDate ? new Date(startDate) : new Date();

    for (let i = 1; i <= n; i++) {
        const interest = balance * r;
        const principal = payment - interest;
        balance -= principal;

        // Calculate date for this payment
        // Assuming end of period payments, so add 1 period to start date initially?
        // Usually Amortization starts one period AFTER start date.
        // Let's increment date based on frequency.

        let dateStr = '';
        if (startDate) {
            // Format the current date FIRST (so first payment starts on start date)
            dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            // THEN increment date for the next iteration
            // This is a simple approximation. For rigorous financial calc, libraries like date-fns or moment might be better but we stick to vanilla JS.
            if (frequency === 12) {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else if (frequency === 4) {
                currentDate.setMonth(currentDate.getMonth() + 3);
            } else if (frequency === 2) {
                currentDate.setMonth(currentDate.getMonth() + 6);
            } else if (frequency === 1) {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            } else if (frequency === 26) {
                currentDate.setDate(currentDate.getDate() + 14);
            } else if (frequency === 52) {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (frequency === 365) {
                currentDate.setDate(currentDate.getDate() + 1);
            } else if (frequency === 24) {
                // Semi-monthly: 1st and 15th logic or simple 15/16 day split
                const d = currentDate.getDate();
                if (d <= 15) {
                    if (d < 15) currentDate.setDate(15);
                    else {
                        currentDate.setMonth(currentDate.getMonth() + 1);
                        currentDate.setDate(1);
                    }
                } else {
                    currentDate.setDate(currentDate.getDate() + 15);
                }
            }
        }

        schedule.push({
            month: i,
            date: dateStr,
            payment,
            interest,
            principal,
            balance: Math.max(0, balance)
        });
    }

    return schedule;
};

export const calculateNPV = (rate, cashFlows) => {
    const r = rate / 100;
    return cashFlows.reduce((acc, flow, t) => {
        return acc + flow / Math.pow(1 + r, t);
    }, 0);
};

export const calculateIRR = (cashFlows, guess = 0.1) => {
    // Newton-Raphson for IRR
    // 0 = Sum(CFt / (1+r)^t)
    let r = guess;
    for (let i = 0; i < 100; i++) {
        let npv = 0;
        let dNpv = 0;
        for (let t = 0; t < cashFlows.length; t++) {
            const factor = Math.pow(1 + r, t);
            npv += cashFlows[t] / factor;
            dNpv -= t * cashFlows[t] / (Math.pow(1 + r, t + 1)); // Derivate wrt r: -t * CFt * (1+r)^-(t+1)
        }

        if (Math.abs(dNpv) < 1e-9) break;
        const newR = r - npv / dNpv;
        if (Math.abs(newR - r) < 1e-6) return newR * 100;
        r = newR;
    }
    return r * 100;
};


export const calculateEAR = (nominal, n) => {
    // EAR = (1 + r/n)^n - 1
    const r = nominal / 100;
    const val = Math.pow(1 + r / n, n) - 1;
    return val * 100;
};

export const calculateMIRR = (cashFlows, financeRate, reinvestRate) => {
    // MIRR = (FV(positive flows, reinvestRate) / -PV(negative flows, financeRate))^(1/n) - 1
    const n = cashFlows.length - 1; // Number of periods
    const rFinance = financeRate / 100;
    const rReinvest = reinvestRate / 100;

    let pvNeg = 0;
    let fvPos = 0;

    cashFlows.forEach((flow, t) => {
        if (flow < 0) {
            pvNeg += flow / Math.pow(1 + rFinance, t);
        } else {
            fvPos += flow * Math.pow(1 + rReinvest, n - t);
        }
    });

    if (pvNeg === 0 || fvPos === 0) return 0; // Avoid division by zero or log of negative/zero

    // Formula: (FV_pos / -PV_neg)^(1/n) - 1
    const mirr = Math.pow(fvPos / -pvNeg, 1 / n) - 1;
    return mirr * 100;
};

export const calculatePaybackPeriod = (cashFlows) => {
    let cumulativeCashFlow = 0;
    for (let t = 0; t < cashFlows.length; t++) {
        cumulativeCashFlow += cashFlows[t];
        if (cumulativeCashFlow >= 0) {
            // Payback occurred in this period
            if (t === 0) return 0;
            const prevCumulative = cumulativeCashFlow - cashFlows[t];
            // Fraction of period: amount needed / amount received
            // prevCumulative is negative, so -prevCumulative is the amount needed
            return (t - 1) + (-prevCumulative / cashFlows[t]);
        }
    }
    return null; // No payback
};

export const calculateDiscountedPaybackPeriod = (cashFlows, rate) => {
    let cumulativeDCF = 0;
    const r = rate / 100;
    for (let t = 0; t < cashFlows.length; t++) {
        const dcf = cashFlows[t] / Math.pow(1 + r, t);
        cumulativeDCF += dcf;
        if (cumulativeDCF >= 0) {
            if (t === 0) return 0;
            const prevCumulative = cumulativeDCF - dcf;
            return (t - 1) + (-prevCumulative / dcf);
        }
    }
    return null;
};

export const calculateProfitabilityIndex = (cashFlows, rate) => {
    // PI = PV of Future Cash Flows / Initial Investment
    // Assuming CF0 is the initial investment (negative), we take absolute value.
    // If CF0 >= 0, it's conceptually undefined or infinite for standard projects, but we can treat CF0 as 0 investment?
    // Standard text: PI = (NPV + Initial Investment) / Initial Investment = PV_all / Initial_Investment

    const r = rate / 100;
    let initialInvestment = 0;
    let pvFuture = 0;

    // We assume period 0 is initial investment
    if (cashFlows.length > 0) {
        if (cashFlows[0] < 0) {
            initialInvestment = Math.abs(cashFlows[0]);
        } else {
            // If CF0 is positive, it's not an investment. We need to find negative flows? 
            // Simplified: PI usually refers to Time 0 investment.
            // If no initial investment, PI is undefined or not applicable.
            // Let's count CF0 as investment if negative.
            // If CF0 is positive, we treat it as a return.
            // Let's stick to: Sum of PVs of all *positive* flows / Sum of PVs of all *negative* flows (absolute)?
            // Or simpler standard definition: PV of future flows / Initial Outlay.

            // Implementation:
            // 1. PV of all flows from t=1..n
            // 2. Initial Investment = abs(CF0) if CF0 < 0
        }

        // Calculate PV of flows t=1 to n
        for (let t = 1; t < cashFlows.length; t++) {
            pvFuture += cashFlows[t] / Math.pow(1 + r, t);
        }
    }

    if (initialInvestment === 0) return 0; // Avoid division by zero

    return pvFuture / initialInvestment;
};

export const calculateBondYTC = (faceValue, couponRate, price, yearsToCall, callPrice, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency;
    const n = yearsToCall * frequency;

    // Newton-Raphson to find periodic rate r
    let r = (couponRate / 100) / frequency;
    if (r === 0) r = 0.05 / frequency;

    for (let i = 0; i < 100; i++) {
        const factor = Math.pow(1 + r, -n); // (1+r)^-n
        // Price formula using CallPrice instead of FaceValue for redemption
        const f = c * ((1 - factor) / r) + callPrice * factor - price;

        // Derivative
        // Term 1 (Coupons): c * [ (n*r*(1+r)^-(n+1) - (1-(1+r)^-n)) / r^2 ]
        // Term 2 (Redemption): -n * callPrice * (1+r)^-(n+1)
        const term1 = c * ((n * r * Math.pow(1 + r, -n - 1) - (1 - factor)) / (r * r));
        const term2 = -n * callPrice * Math.pow(1 + r, -n - 1);
        const dF = term1 + term2;

        if (Math.abs(dF) < 1e-12) break;

        const nextR = r - f / dF;
        if (Math.abs(nextR - r) < 1e-8) {
            return nextR * frequency * 100;
        }
        r = nextR;
    }
    return r * frequency * 100;
};

export const calculateBondDuration = (faceValue, couponRate, ytm, years, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency;
    const r = (ytm / 100) / frequency;
    const n = years * frequency;
    let price = 0;
    let weightedTime = 0;

    for (let t = 1; t <= n; t++) {
        const cashFlow = (t === n) ? (c + faceValue) : c;
        const pvFactor = Math.pow(1 + r, -t);
        const pv = cashFlow * pvFactor;
        price += pv;
        weightedTime += pv * (t / frequency); // t/frequency is time in years
    }

    if (price === 0) return { macaulay: 0, modified: 0 };

    const macaulay = weightedTime / price;
    const modified = macaulay / (1 + r); // Modified = Mac / (1 + y/k)

    return { macaulay, modified };
};

export const calculateBondConvexity = (faceValue, couponRate, ytm, years, frequency = 1) => {
    const c = (couponRate / 100) * faceValue / frequency;
    const r = (ytm / 100) / frequency;
    const n = years * frequency;
    let price = 0;
    let convexitySum = 0;

    for (let t = 1; t <= n; t++) {
        const cashFlow = (t === n) ? (c + faceValue) : c;
        const pvFactor = Math.pow(1 + r, -t);
        const pv = cashFlow * pvFactor;
        price += pv;

        // Convexity term: CF_t / (1+r)^t * t * (t+1)
        // But standard formula involves terms divided by Price * (1+y)^2
        // Let's sum [ CF_t * (t * (t+1)) / (1+r)^(t+2) ] ?
        // Or simpler: Second derivative / Price
        // dP/dy = -1/(1+y) * Sum( t * PV )
        // d2P/dy2 = 1/(1+y)^2 * Sum( t(t+1) * PV )
        // Convexity = (d2P/dy2) / P

        // Calculating Sum( t * (t+1) * PV )
        convexitySum += pv * t * (t + 1);
    }

    if (price === 0) return 0;

    // Convexity (annualized approx)
    // C = [1 / (P * (1+r)^2)] * Sum( t(t+1) * CF / (1+r)^t ) * (1/freq^2)
    // Wait, if t is periods, we need to adjust for frequency.

    const factor = 1 / (Math.pow(1 + r, 2));
    const rawConvexity = (convexitySum * factor) / price;

    // Adjust for annual
    return rawConvexity / (frequency * frequency);
};

```

## tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#121212',
                    800: '#1e1e1e',
                    700: '#2c2c2c',
                },
                primary: {
                    500: '#4ade80', // Approximate green from screenshot
                    600: '#22c55e',
                }
            },
        },
    },
    plugins: [],
}

```

## vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        // Inject build timestamp at build time for automatic versioning
        __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    },
})

```


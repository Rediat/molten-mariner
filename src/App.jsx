import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { HistoryProvider } from './context/HistoryContext';
import { SettingsProvider } from './context/SettingsContext';
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

function App() {
    const [activeTab, setActiveTab] = useState('tvm');
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [mapsReady, setMapsReady] = useState(false);

    const toggleHelp = () => setShowHelp(true);
    const closeHelp = () => setShowHelp(false);
    const toggleSettings = () => setShowSettings(true);
    const closeSettings = () => setShowSettings(false);

    // Load Google Maps: try the serverless proxy first (production),
    // fall back to VITE_GOOGLE_MAPS_API_KEY from .env (local dev)
    useEffect(() => {
        const loadScript = (url) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = () => setMapsReady(true);
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
                    loadScript(`https://maps.googleapis.com/maps/api/js?key=${devKey}&libraries=places&v=weekly`);
                }
            });
    }, []);

    return (
        <SettingsProvider>
            <HistoryProvider>
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
                        <RideFareCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} mapsReady={mapsReady} />
                    </div>
                    <SettingsModal isOpen={showSettings} onClose={closeSettings} />
                </Layout>
            </HistoryProvider>
        </SettingsProvider>
    );
}

export default App;




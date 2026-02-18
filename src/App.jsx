import React, { useState, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';
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

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const GOOGLE_MAPS_LIBRARIES = ['places'];

function App() {
    const [activeTab, setActiveTab] = useState('tvm');
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const toggleHelp = () => setShowHelp(true);
    const closeHelp = () => setShowHelp(false);
    const toggleSettings = () => setShowSettings(true);
    const closeSettings = () => setShowSettings(false);

    const [mapsConfig, setMapsConfig] = useState({ libraries: [], scriptUrl: '' });

    useEffect(() => {
        fetch('/api/maps')
            .then(res => res.json())
            .then(data => setMapsConfig(data))
            .catch(err => console.error('Maps config error:', err));
    }, []);

    // Use mapsConfig.scriptUrl for <script src={mapsConfig.scriptUrl} />
    // Or mapsConfig.libraries for Google Maps loader
    const GOOGLE_MAPS_LIBRARIES = mapsConfig.libraries; // ['places']

    const appContent = (
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
                        <RideFareCalculator toggleHelp={toggleHelp} toggleSettings={toggleSettings} />
                    </div>
                    <SettingsModal isOpen={showSettings} onClose={closeSettings} />
                </Layout>
            </HistoryProvider>
        </SettingsProvider>
    );

    // Only wrap with LoadScript if API key is available
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE') {
        return (
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}>
                {appContent}
            </LoadScript>
        );
    }

    return appContent;
}

export default App;




import React, { useState } from 'react';
import Layout from './components/Layout';
import { HistoryProvider } from './context/HistoryContext';

// Features
import TVMCalculator from './features/tvm/TVMCalculator';
import LoanCalculator from './features/loan/LoanCalculator';
import CashFlowCalculator from './features/flow/CashFlowCalculator';
import BondCalculator from './features/bond/BondCalculator';
import RateConverter from './features/rates/RateConverter';
import GoalPlanner from './features/goal/GoalPlanner';
import HistoryView from './features/history/HistoryView';

function App() {
    const [activeTab, setActiveTab] = useState('tvm');

    return (
        <HistoryProvider>
            <Layout activeTab={activeTab} onTabChange={setActiveTab}>
                <div className={activeTab === 'tvm' ? 'block h-full' : 'hidden'}>
                    <TVMCalculator />
                </div>
                <div className={activeTab === 'loan' ? 'block h-full' : 'hidden'}>
                    <LoanCalculator />
                </div>
                <div className={activeTab === 'flow' ? 'block h-full' : 'hidden'}>
                    <CashFlowCalculator />
                </div>
                <div className={activeTab === 'bond' ? 'block h-full' : 'hidden'}>
                    <BondCalculator />
                </div>
                <div className={activeTab === 'rates' ? 'block h-full' : 'hidden'}>
                    <RateConverter />
                </div>
                <div className={activeTab === 'goal' ? 'block h-full' : 'hidden'}>
                    <GoalPlanner />
                </div>
                <div className={activeTab === 'history' ? 'block h-full' : 'hidden'}>
                    <HistoryView />
                </div>
            </Layout>
        </HistoryProvider>
    );
}

export default App;


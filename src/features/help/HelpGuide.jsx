import React, { useState, useEffect } from 'react';
import {
    HelpCircle, Calculator, Target, DollarSign, Activity, FileText, Percent,
    ChevronDown, ChevronUp, Book, Lightbulb, Hash, ArrowRight, History, Trash2, Receipt, Settings, Wallet, TrendingUp, Car, ArrowRightLeft
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
    fxcompare: 'fxcompare',
    transport: 'transport',
    history: 'history',
    sync: 'sync',
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
                <InfoBox type="tip">
                    <strong>Smart Data Entry:</strong> Click on any field's <strong>label</strong> 
                    to instantly clear its value and start fresh. If you leave an input field empty, 
                    it automatically resets to zero. This interaction pattern is standardized across all calculators.
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
                        <li>• <strong>FX-VS</strong> - FX vs T-Bill return comparison</li>
                        <li>• <strong>Sync</strong> - Data maintenance & refresh info</li>
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

                <InfoBox type="note">
                    <strong>Data Refresh (Sync):</strong> Developers can execute <code>npm run sync-inflation</code> in the project terminal. This triggers a scraper that extracts the latest inflation rates and incrementally updates the dashboard's local dataset (<code>data.json</code>) starting from <strong>1966</strong>.
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
                        { name: 'Predicted Yield', description: 'Dynamic forecast based on the latest NBE cut-off yields. Click the prediction badge to automatically apply it to the discount rate.' },
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

                <InfoBox type="note">
                    <strong>Data Refresh (Sync):</strong> The calculator uses an offline database of historical Treasury Bill auction results from the National Bank of Ethiopia (NBE) starting from <strong>August 2024</strong>.
                    <br /><br />
                    <strong>How it works:</strong> Developers execute <code>npm run sync-tbill</code> in the project terminal. This command triggers a specialized scraper that accesses the NBE website, extracts raw auction tables, handles structural inconsistencies, and appends new auction records into the dashboard's dataset (<code>data.json</code>), ensuring the predictive model is aware of the current market conditions.
                </InfoBox>

                <InfoBox type="formula">
                    <strong>Prediction Model</strong>
                    <br />Based directly on the <code>predictNextYield()</code> function in <code>index.js</code>:
                    <br /><br />
                    Stage 1 — Holt's Linear Exponential Smoothing — explains the double-smoothing algorithm with the real parameter values (α = 0.7 for yields, α = 0.4 for supply/demand, β = 0.2–0.3) and the 18-record look-back window
                    <br /><br />
                    Stage 2 — Demand-Supply Sensitivity Adjustment — explains the baseline BTC of 1.20×, the −0.45% sensitivity factor, and how high/low demand nudges the yield forecast with a worked numeric example
                    <br /><br />
                    <strong>Prediction outputs — table mapping each output to where it appears in the UI</strong>
                    <table className="w-full mt-1 mb-2 text-[10px] border-collapse border border-blue-500/30">
                        <thead>
                            <tr className="bg-blue-900/20">
                                <th className="border border-blue-500/30 p-1 text-left font-bold text-blue-400">Output</th>
                                <th className="border border-blue-500/30 p-1 text-left font-bold text-blue-400">UI Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-blue-500/30 p-1">Yield</td>
                                <td className="border border-blue-500/30 p-1">Glowing "AI: X.XX%" badge next to Discount Rate</td>
                            </tr>
                            <tr>
                                <td className="border border-blue-500/30 p-1">BTC / Supply / Demand</td>
                                <td className="border border-blue-500/30 p-1">Internal (drives yield calculation)</td>
                            </tr>
                        </tbody>
                    </table>

                    <strong>Limitations</strong>
                    <div className="space-y-3 mt-2">
                        <p><strong>3-record minimum:</strong> The app’s math needs to see at least three past auctions to understand the "rhythm" of the market. If a specific T-Bill (like the 364-day one) hasn't been sold at least three times recently, the app won't make a guess because it doesn't have enough history to be helpful.</p>
                        <p><strong>Can't predict policy shocks:</strong> The app only knows what happened in the past. It has no way of knowing if the National Bank suddenly changes the law, if there is a major political announcement, or a sudden economic crisis. It’s like trying to predict the weather based only on yesterday's temperature—it can't "see" an unannounced storm coming.</p>
                        <p><strong>Shorter maturities more reliable:</strong> It is much easier to guess what will happen 28 days from now than it is to guess what will happen a year (364 days) from now. The shorter-term rates are usually more stable, so the app’s predictions for them are generally "closer to the pin" than for the long-term ones.</p>
                        <p><strong>Recalculated fresh every load:</strong> The app doesn't store "old" predictions. Every single time you open the page or hit refresh, the computer re-runs all its calculations from scratch using the most recent data it just scraped. You are always getting the most current math possible.</p>
                    </div>
                </InfoBox>
            </HelpSection>
            
            {/* FX vs T-Bill Compare */}
            <HelpSection
                id="fxcompare"
                title="FX vs T-Bill Compare"
                icon={ArrowRightLeft}
                isOpen={openSection === 'fxcompare'}
                onToggle={handleToggle}
            >
                <p>
                    Compare the historical returns of investing in Ethiopian Treasury Bills versus holding foreign currencies 
                    (e.g., USD, EUR, GBP) purchased on the parallel market. 
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Investment Modes:</p>
                    <ul className="space-y-3 text-xs">
                        <li className="flex gap-2">
                            <ArrowRight className="w-3 h-3 mt-1 text-emerald-400 shrink-0" />
                            <div>
                                <span className="font-bold text-white uppercase tracking-tight">Single Mode:</span>
                                <p className="text-neutral-400 mt-1">Simulates a one-time T-Bill purchase. The investment is compared against holding foreign currency for exactly the same duration (e.g., 28 days or 364 days).</p>
                            </div>
                        </li>
                        <li className="flex gap-2">
                            <ArrowRight className="w-3 h-3 mt-1 text-emerald-400 shrink-0" />
                            <div>
                                <span className="font-bold text-white uppercase tracking-tight">Rolling Mode:</span>
                                <p className="text-neutral-400 mt-1">Simulates a long-term reinvestment strategy. Upon each T-Bill maturity, the principal and interest are automatically reinvested into the <em>next available auction</em> of the same tenure. This continues until the most recent historical data point, comparing the compounded total against holding FX over the entire multi-round period.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Investment Budget', description: 'The total amount in ETB you are considering for investment' },
                        { name: 'Start Auction', description: 'Select the initial historical auction to begin the simulation' },
                        { name: 'Currency / Commodity', description: 'Choose the currency (USD, EUR, GBP) or Commodity (GOLD) to compare against' },
                        { name: 'Tenure Strategy', description: '(Rolling Mode only) Choose whether to roll 28D, 91D, 182D, or 364D bills' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'Winner Badge', description: 'Identifies which strategy yielded higher profit over the selected horizon' },
                        { name: 'End Value', description: 'The final ETB value received (after one round in Single, or multiple rounds in Rolling)' },
                        { name: 'Round-by-Round', description: '(Rolling Mode only) A collapsible breakdown showing the Yield, Quantity, Profit, and Leftover Cash for every reinvestment round' }
                    ]} />
                </div>

                <InfoBox type="tip">
                    <strong>Efficient Navigation:</strong> As the auction database grows, use the <strong>Search</strong> bar within the Auction Date selector to find specific dates. Use the <strong>Quick-Select chips</strong> for the latest 4 auctions, or browse the <strong>Grouped Dropdown</strong> (organized by Month/Year) for rapid scannability.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Real-Time Data:</strong> FX and Gold rates are available starting from <strong>January 2023</strong>. FX rates are pulled from <code>ethioblackmarket.com</code> monthly history (parallel market averages). Gold prices are sourced from <code>Datahub.io</code> (Monthly CSV) and converted to ETB based on that month's parallel USD rate for direct comparability.
                </InfoBox>

                <InfoBox type="note">
                    <strong>Data Refresh (Sync):</strong> Similar to the T-Bill module, this feature uses a local JSON database (<code>fxData.json</code>) to ensure maximum speed and reliability. 
                    <br /><br />
                    <strong>How it works:</strong> Developers run <code>npm run sync-fx</code> and <code>npm run sync-gold</code> in the terminal to update pricing history. The FX script fetches parallel market data from <code>ethioblackmarket.com</code>, while the Gold script pulls historical commodity prices from <code>Datahub.io</code>. Both are synchronized with the local <code>fxData.json</code> dataset.
                </InfoBox>

                <InfoBox type="note">
                    <strong>Brokerage Fees:</strong> T-Bill calculations assume a standard 0.1% brokerage fee on the purchase price, matching the default setting in the main T-Bill tab.
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
                        <li>• <strong>FX-VS</strong> - FX vs T-Bill comparison</li>
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

            {/* Data Synchronization */}
            <HelpSection
                id="sync"
                title="Data Synchronization (Sync)"
                icon={Activity}
                isOpen={openSection === 'sync'}
                onToggle={handleToggle}
            >
                <p>
                    The app uses local datasets (<code>data.json</code>, <code>fxData.json</code>) to ensure maximum speed, offline capability, and precise financial modeling. These datasets are updated through developer-run synchronization scripts.
                </p>
                
                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Sync Commands:</p>
                    <FieldList fields={[
                        { name: 'npm run sync-tbill', description: 'Scrapes the NBE website for latest Treasury Bill auction results (Starts from Aug 2024). Updates cut-off yields and supply/demand metrics.' },
                        { name: 'npm run sync-fx', description: 'Fetches parallel market exchange rates (Starts from Jan 2023). Updates monthly averages for USD, EUR, GBP, and more.' },
                        { name: 'npm run sync-gold', description: 'Updates historical Gold prices from Datahub.io (Starts from Jan 2023) and converts them to ETB using the latest parallel rates.' },
                        { name: 'npm run sync-inflation', description: 'Updates historical Ethiopian and USA inflation rates (Starts from 1966). Re-calculates CAGR and ARIMA forecast baselines.' },
                        { name: 'npm run sync-all', description: 'Executes all sync scripts in sequence. This is the recommended way to maintain the entire application data stack.' }
                    ]} />
                </div>

                <InfoBox type="note">
                    <strong>Incremental Updates:</strong> All sync scripts are designed to be "non-destructive." They merge new records into the existing local databases without deleting historical data, ensuring your comparisons can always reach back to the beginning of the available records.
                </InfoBox>

                <InfoBox type="formula">
                    <strong>Update Frequency:</strong> T-Bill auctions occur bi-weekly, while FX and Inflation data are typically updated monthly. Run <code>sync-all</code> periodically to ensure the predictive AI models have enough data to maintain accuracy.
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

                    <InfoBox type="note">
                        <strong>Developer Sync:</strong> To update all data sources (T-Bills, FX Rates, Gold, and Inflation) 
                        simultaneously, run <code>npm run sync-all</code> in the terminal. This incrementally 
                        updates the local datasets to ensure forecasts and comparisons reflect the latest market data.
                    </InfoBox>

                    <InfoBox type="tip">
                        <strong>Clear Button:</strong> Use the trash icon button at the bottom to clear results. 
                        In most tabs, this only removes the result box while preserving your inputs. 
                        In <strong>TVM</strong> and <strong>Cash Flow</strong>, it also resets input fields (preserving rates in Cash Flow).
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

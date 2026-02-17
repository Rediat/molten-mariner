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
                    Perfect for bidding on government T-Bills and understanding your actual yield.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Face Value', description: 'The amount you receive at maturity (par value)' },
                        { name: 'Tenure', description: 'Duration of the T-Bill (28, 91, 182, or 364 days)' },
                        { name: 'Discount Rate', description: 'Annual discount rate used to calculate purchase price' },
                        { name: 'Issue Date', description: 'The date when the T-Bill is issued' },
                        { name: 'Brokerage %', description: 'Commission percentage charged by your broker' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'Purchase Price', description: 'Amount to pay for the T-Bill (before brokerage)' },
                        { name: 'Brokerage', description: 'Commission amount based on purchase price' },
                        { name: 'Total Consideration', description: 'Total amount you pay (purchase price + brokerage)' },
                        { name: 'Maturity Date', description: 'Date when the T-Bill matures' },
                        { name: 'Discount', description: 'Difference between face value and purchase price' },
                        { name: 'Net Return', description: 'Your actual profit after brokerage (face value - total consideration)' },
                        { name: 'Effective Yield', description: 'Annualized return on your investment' }
                    ]} />
                </div>

                <InfoBox type="formula">
                    <strong>Purchase Price = Face Value / (1 + (Rate × Days / 365))</strong>
                    <br />This is the standard discount pricing formula for T-Bills.
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Compare Effective Yield:</strong> The effective yield shows your actual annualized return,
                    which is typically higher than the discount rate due to the discount pricing method.
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
                    integration for automatic distance lookup between locations in Ethiopia.
                </p>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Calculation Modes:</p>
                    <FieldList fields={[
                        { name: 'Inputs → Price', description: 'Enter distance, fuel details, and service factor to calculate the fare' },
                        { name: 'Price → Breakdown', description: 'Enter a known fare to reverse-calculate fuel cost, net gain, and implied service factor' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Google Maps Integration:</p>
                    <FieldList fields={[
                        { name: 'From / To', description: 'Type an address and select from suggestions. Locations are restricted to Ethiopia.' },
                        { name: 'Auto-Distance', description: 'When both From and To are selected, the driving distance is fetched automatically via the Distance Matrix API' },
                        { name: '✓ Google Maps', description: 'A green indicator confirms the distance was auto-populated from Google Maps. You can still override it manually.' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Inputs:</p>
                    <FieldList fields={[
                        { name: 'Distance (Km)', description: 'Trip distance — auto-filled from Maps or entered manually' },
                        { name: 'Mileage (L/Km)', description: 'Vehicle fuel efficiency (fixed at 0.1 L/Km baseline)' },
                        { name: 'Fuel Cost / L', description: 'Current price of fuel per liter (default 130 ETB)' },
                        { name: 'Service Factor', description: 'Multiplier for maintenance, time, and profit (range: 2.55 – 4.5×, default 3×). Only in Inputs → Price mode.' },
                        { name: 'Price to Charge', description: 'The known fare amount. Only in Price → Breakdown mode.' }
                    ]} />
                </div>

                <div className="pt-2">
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Results:</p>
                    <FieldList fields={[
                        { name: 'Price to Charge', description: 'The recommended fare (forward mode) or the entered fare (reverse mode)' },
                        { name: 'Per Head', description: 'Price divided by 4 passengers for cost-sharing' },
                        { name: 'Total Fuel Cost', description: 'Distance × Mileage × Fuel Cost per Liter' },
                        { name: 'Net Gain', description: 'Price to Charge minus Total Fuel Cost' },
                        { name: 'Fuel / Km', description: 'Fuel cost per kilometer' },
                        { name: 'Revenue / Km', description: 'Price to Charge per kilometer' },
                        { name: 'Gain / Km', description: 'Net Gain per kilometer' },
                        { name: 'Implied Service Factor', description: 'In reverse mode, shows what multiplier the entered fare represents' }
                    ]} />
                </div>

                <InfoBox type="formula">
                    <strong>Price to Charge = (Distance × Mileage × Fuel Cost) × Service Factor</strong>
                </InfoBox>

                <InfoBox type="tip">
                    <strong>No API Key?</strong> The calculator works without Google Maps — just enter the distance manually. The From/To inputs only appear when a valid Google Maps API key is configured.
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
                        <strong>Clear Button:</strong> Use the CLR button to reset all fields to zero before starting a new calculation.
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

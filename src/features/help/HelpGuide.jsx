import React, { useState, useEffect } from 'react';
import {
    HelpCircle, Calculator, Target, DollarSign, Activity, FileText, Percent,
    ChevronDown, ChevronUp, Book, Lightbulb, Hash, ArrowRight, History, Trash2
} from 'lucide-react';

// Map tab IDs to section IDs
const TAB_TO_SECTION = {
    tvm: 'tvm',
    goal: 'goal',
    loan: 'loan',
    flow: 'flow',
    bond: 'bond',
    rates: 'rates',
    history: 'history'
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
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    }, [activeTab]);

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
                        <li>• <strong>Flow</strong> - NPV, IRR & cash flow analysis</li>
                        <li>• <strong>Bond</strong> - Bond pricing & yields</li>
                        <li>• <strong>Rates</strong> - Interest rate conversions</li>
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
                        { name: 'ΣPmt', description: 'Sum of all payments (PMT × N) - read only' }
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

                <InfoBox type="formula">
                    <strong>EAR = (1 + r/n)^n - 1</strong>
                    <br />where r = nominal rate, n = compounding periods per year
                </InfoBox>

                <InfoBox type="tip">
                    <strong>Rule of 72:</strong> A quick estimate for doubling time is 72 ÷ interest rate.
                    For example, at 8%, money doubles in approximately 72 ÷ 8 = 9 years.
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
                    The History tab automatically tracks and stores all your calculations. This allows you
                    to review past results, compare scenarios, and access important financial data without re-entering values.
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
                    <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Actions:</p>
                    <ul className="space-y-2">
                        <li className="flex gap-2">
                            <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                            <div className="text-xs">
                                <span className="font-bold text-white">Clear History:</span> Use the trash icon in the History header to permanently delete all saved calculations.
                            </div>
                        </li>
                    </ul>
                </div>

                <InfoBox type="tip">
                    <strong>Context Awareness:</strong> If you open the Help guide while viewing the History tab, it will automatically scroll to this section.
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
                        <strong>History:</strong> All your calculations are automatically saved. Check the History tab to review or recall previous calculations.
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

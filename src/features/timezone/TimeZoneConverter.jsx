import React, { useState, useEffect, useRef } from 'react';
import { Globe, Plus, Trash2, Link, Check, Clock, Calendar, ChevronDown, ChevronUp, Calculator as CalcIcon, Info, HelpCircle, Settings } from 'lucide-react';
import { 
    searchTimezones, 
    getTimeZoneAbbrev, 
    getTimeZoneOffset, 
    getLocalTimeZone, 
    POPULAR_TIMEZONES 
} from '../../utils/timezones';

const TimeInput = ({ value, onChange, use24Hour }) => {
    const [hStr, mStr] = value.split(':');
    const hour = parseInt(hStr, 10) || 0;
    const minute = parseInt(mStr, 10) || 0;

    let displayHour = hour;
    let ampm = 'AM';
    if (!use24Hour) {
        ampm = hour >= 12 ? 'PM' : 'AM';
        displayHour = hour % 12;
        if (displayHour === 0) displayHour = 12;
    }

    const setHour = (newHr) => {
        let hr = parseInt(newHr, 10);
        if (isNaN(hr)) return;
        if (!use24Hour) {
            const isPM = hour >= 12;
            if (hr === 12) {
                hr = isPM ? 12 : 0;
            } else {
                hr = isPM ? hr + 12 : hr;
            }
        }
        if (hr < 0 || hr > 23) return;
        onChange(`${String(hr).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    };

    const setMinute = (newMin) => {
        let min = parseInt(newMin, 10);
        if (isNaN(min) || min < 0 || min > 59) return;
        onChange(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    };

    const adjustHour = (amount) => {
        const nextHour = (hour + amount + 24) % 24;
        onChange(`${String(nextHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    };

    const adjustMinute = (amount) => {
        const nextMinute = (minute + amount + 60) % 60;
        onChange(`${String(hour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`);
    };

    const toggleAmPm = () => {
        let hr = hour;
        if (hr >= 12) {
            hr -= 12;
        } else {
            hr += 12;
        }
        onChange(`${String(hr).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    };

    return (
        <div className="flex items-center justify-center gap-1.5 bg-neutral-900 border border-white/5 px-2 py-1 rounded-xl font-mono text-xs w-full">
            <div className="flex items-center gap-0.5">
                <input
                    type="text"
                    value={String(displayHour).padStart(2, '0')}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-5 bg-transparent text-center text-white focus:outline-none focus:text-primary-400 font-bold"
                />
                <div className="flex flex-col select-none">
                    <button 
                        onClick={() => adjustHour(1)}
                        className="p-0.5 hover:text-primary-400 text-neutral-500 transition-colors"
                    >
                        <ChevronUp size={10} strokeWidth={3} />
                    </button>
                    <button 
                        onClick={() => adjustHour(-1)}
                        className="p-0.5 hover:text-primary-400 text-neutral-500 transition-colors"
                    >
                        <ChevronDown size={10} strokeWidth={3} />
                    </button>
                </div>
            </div>
            <span className="text-neutral-500 select-none">:</span>
            <div className="flex items-center gap-0.5">
                <input
                    type="text"
                    value={String(minute).padStart(2, '0')}
                    onChange={(e) => setMinute(e.target.value)}
                    className="w-5 bg-transparent text-center text-white focus:outline-none focus:text-primary-400 font-bold"
                />
                <div className="flex flex-col select-none">
                    <button 
                        onClick={() => adjustMinute(1)}
                        className="p-0.5 hover:text-primary-400 text-neutral-500 transition-colors"
                    >
                        <ChevronUp size={10} strokeWidth={3} />
                    </button>
                    <button 
                        onClick={() => adjustMinute(-1)}
                        className="p-0.5 hover:text-primary-400 text-neutral-500 transition-colors"
                    >
                        <ChevronDown size={10} strokeWidth={3} />
                    </button>
                </div>
            </div>
            {!use24Hour && (
                <button
                    onClick={toggleAmPm}
                    className="ml-1 px-1 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[9px] font-bold text-primary-400 uppercase transition-colors"
                >
                    {ampm}
                </button>
            )}
        </div>
    );
};

// Helper to get local date parts formatted for a timezone
const getLocalDateParts = (date, timeZone) => {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
        });
        const parts = formatter.formatToParts(date);
        const getVal = type => parseInt(parts.find(p => p.type === type).value, 10);
        return {
            year: getVal('year'),
            month: getVal('month') - 1, // 0-indexed
            day: getVal('day'),
            hour: getVal('hour') === 24 ? 0 : getVal('hour'),
            minute: getVal('minute')
        };
    } catch (e) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes()
        };
    }
};

// Helper to calculate exact UTC offset minutes at a hypothetical date in a timezone
const getTzOffsetMinutes = (date, timeZone) => {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
        }).formatToParts(date);
        
        const getVal = type => parseInt(parts.find(p => p.type === type).value, 10);
        
        const y = getVal('year');
        const m = getVal('month') - 1;
        const d = getVal('day');
        let h = getVal('hour');
        if (h === 24) h = 0;
        const min = getVal('minute');
        const s = getVal('second');
        
        const wallUtc = Date.UTC(y, m, d, h, min, s);
        return Math.round((wallUtc - date.getTime()) / 60000);
    } catch (e) {
        return 0;
    }
};

// Create a date in UTC from local values in a timezone
const createDateFromTz = (year, month, day, hour, minute, secondOrTz, timeZoneOrNull) => {
    let second = 0;
    let timeZone = secondOrTz;
    if (timeZoneOrNull !== undefined) {
        second = secondOrTz;
        timeZone = timeZoneOrNull;
    }
    const wallUtc = Date.UTC(year, month, day, hour, minute, second);
    const approxDate = new Date(wallUtc);
    const offsetMin = getTzOffsetMinutes(approxDate, timeZone);
    return new Date(wallUtc - offsetMin * 60000);
};

const pad = (n) => String(n).padStart(2, '0');

const TimeZoneConverter = ({ toggleHelp, toggleSettings }) => {
    // Mode setup: 'converter' or 'calculator'
    const [mainMode, setMainMode] = useState('converter');
    
    // Sub-mode under calculator: 'difference' or 'math'
    const [calcSubMode, setCalcSubMode] = useState('difference');

    // 1. Converter State
    const [referenceDate, setReferenceDate] = useState(() => new Date());
    const [use24Hour, setUse24Hour] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(true);
    const [copied, setCopied] = useState(false);
    const [clocks, setClocks] = useState([]);
    
    // Autocomplete dropdown state for Converter
    const [activeSearchIndex, setActiveSearchIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchDropdownRefs = useRef({});

    // 2. Calculator State - Difference Mode
    const [diffDateA, setDiffDateA] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    });
    const [diffTimeA, setDiffTimeA] = useState('12:00');
    const [diffTzA, setDiffTzA] = useState(() => getLocalTimeZone());

    const [diffDateB, setDiffDateB] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
    });
    const [diffTimeB, setDiffTimeB] = useState('12:00');
    const [diffTzB, setDiffTzB] = useState('UTC');

    // 3. Calculator State - Math Mode (Add/Subtract)
    const [mathDate, setMathDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    });
    const [mathTime, setMathTime] = useState('12:00');
    const [mathTz, setMathTz] = useState(() => getLocalTimeZone());
    const [mathOp, setMathOp] = useState('add');
    const [mathDays, setMathDays] = useState(0);
    const [mathHours, setMathHours] = useState(0);
    const [mathMinutes, setMathMinutes] = useState(0);
    const [mathYears, setMathYears] = useState(0);
    const [mathMonths, setMathMonths] = useState(0);
    const [mathSeconds, setMathSeconds] = useState(0);

    // Autocomplete dropdown state for Calculator
    const [activeCalcSearchField, setActiveCalcSearchField] = useState(null); // 'diffA', 'diffB', 'math'
    const [calcSearchQuery, setCalcSearchQuery] = useState('');
    const [calcSearchResults, setCalcSearchResults] = useState([]);
    const calcDropdownRefs = useRef({});

    const handleCalcSearchChange = (field, value) => {
        setCalcSearchQuery(value);
        if (value.trim() === '') {
            setCalcSearchResults(POPULAR_TIMEZONES.slice(0, 8));
        } else {
            setCalcSearchResults(searchTimezones(value));
        }
    };

    const handleSelectCalcTimezone = (field, tzId) => {
        if (field === 'diffA') {
            setDiffTzA(tzId);
        } else if (field === 'diffB') {
            setDiffTzB(tzId);
        } else if (field === 'math') {
            setMathTz(tzId);
        }
        setActiveCalcSearchField(null);
        setCalcSearchQuery('');
    };

    // Read state from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlTzs = params.get('tzs');
        const urlTime = params.get('t');
        const urlMode = params.get('m');
        const urlHour = params.get('h');

        let initialTzs = [getLocalTimeZone(), 'UTC', 'America/New_York'];
        if (urlTzs) {
            try {
                initialTzs = urlTzs.split(',');
            } catch (e) {}
        }

        setClocks(initialTzs.map((tz, index) => ({
            id: `clock-${index}-${Date.now()}`,
            timeZone: tz
        })));

        if (urlTime) {
            const parsedTime = parseInt(urlTime, 10);
            if (!isNaN(parsedTime)) {
                setReferenceDate(new Date(parsedTime));
            }
        }

        if (urlMode === 'time') {
            setShowDatePicker(false);
        }
        if (urlHour === '24') {
            setUse24Hour(true);
        }
    }, []);

    // Converter Operations
    const handleAddClock = (timeZone = 'UTC') => {
        setClocks(prev => [...prev, {
            id: `clock-${Date.now()}`,
            timeZone
        }]);
    };

    const handleRemoveClock = (id) => {
        if (clocks.length <= 1) return;
        setClocks(prev => prev.filter(c => c.id !== id));
    };

    const handleCopyLink = () => {
        const params = new URLSearchParams();
        params.set('tzs', clocks.map(c => c.timeZone).join(','));
        params.set('t', referenceDate.getTime().toString());
        params.set('m', showDatePicker ? 'date' : 'time');
        params.set('h', use24Hour ? '24' : '12');

        const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error('Failed to copy share link:', err));
    };

    const handleTimeChange = (clock, type, value) => {
        const parts = getLocalDateParts(referenceDate, clock.timeZone);
        
        let newHour = parts.hour;
        let newMinute = parts.minute;

        if (type === 'hour') {
            let hr = parseInt(value, 10);
            if (isNaN(hr)) return;
            if (!use24Hour) {
                const isPM = parts.hour >= 12;
                if (hr === 12) {
                    newHour = isPM ? 12 : 0;
                } else {
                    newHour = isPM ? hr + 12 : hr;
                }
            } else {
                newHour = hr;
            }
            if (newHour < 0 || newHour > 23) return;
        } else if (type === 'minute') {
            newMinute = parseInt(value, 10);
            if (isNaN(newMinute) || newMinute < 0 || newMinute > 59) return;
        } else if (type === 'ampm') {
            const isPM = value === 'PM';
            if (newHour >= 12 && !isPM) {
                newHour -= 12;
            } else if (newHour < 12 && isPM) {
                newHour += 12;
            }
        }

        const newDate = createDateFromTz(
            parts.year,
            parts.month,
            parts.day,
            newHour,
            newMinute,
            clock.timeZone
        );
        setReferenceDate(newDate);
    };

    const adjustTimePart = (clock, type, amount) => {
        const parts = getLocalDateParts(referenceDate, clock.timeZone);
        let newHour = parts.hour;
        let newMinute = parts.minute;

        if (type === 'hour') {
            newHour = (parts.hour + amount + 24) % 24;
        } else if (type === 'minute') {
            newMinute = (parts.minute + amount + 60) % 60;
        }

        const newDate = createDateFromTz(
            parts.year,
            parts.month,
            parts.day,
            newHour,
            newMinute,
            clock.timeZone
        );
        setReferenceDate(newDate);
    };

    const handleDateChange = (clock, event) => {
        const dateVal = event.target.value;
        if (!dateVal) return;
        
        const [year, month, day] = dateVal.split('-').map(num => parseInt(num, 10));
        const parts = getLocalDateParts(referenceDate, clock.timeZone);

        const newDate = createDateFromTz(
            year,
            month - 1,
            day,
            parts.hour,
            parts.minute,
            clock.timeZone
        );
        setReferenceDate(newDate);
    };

    const handleSliderChange = (clock, event) => {
        const totalMinutes = parseInt(event.target.value, 10);
        const parts = getLocalDateParts(referenceDate, clock.timeZone);
        
        const newHour = Math.floor(totalMinutes / 60);
        const newMinute = totalMinutes % 60;

        const newDate = createDateFromTz(
            parts.year,
            parts.month,
            parts.day,
            newHour,
            newMinute,
            clock.timeZone
        );
        setReferenceDate(newDate);
    };

    // Timezone search autocomplete
    const handleSearchChange = (index, value) => {
        setSearchQuery(value);
        if (value.trim() === '') {
            setSearchResults(POPULAR_TIMEZONES.slice(0, 8));
        } else {
            setSearchResults(searchTimezones(value));
        }
    };

    const handleSelectTimezone = (index, tzId, customLabel) => {
        setClocks(prev => {
            const nextClocks = [...prev];
            nextClocks[index].timeZone = tzId;
            nextClocks[index].label = customLabel || null;
            return nextClocks;
        });
        setActiveSearchIndex(null);
        setSearchQuery('');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeSearchIndex !== null) {
                const currentDropdown = searchDropdownRefs.current[activeSearchIndex];
                if (currentDropdown && !currentDropdown.contains(e.target)) {
                    setActiveSearchIndex(null);
                    setSearchQuery('');
                }
            }
            if (activeCalcSearchField !== null) {
                const currentDropdown = calcDropdownRefs.current[activeCalcSearchField];
                if (currentDropdown && !currentDropdown.contains(e.target)) {
                    setActiveCalcSearchField(null);
                    setCalcSearchQuery('');
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeSearchIndex, activeCalcSearchField]);

    // 4. Calculator Computations
    const calculateDifferenceResult = () => {
        try {
            const [yA, mA, dA] = diffDateA.split('-').map(Number);
            const [hrA, minA] = diffTimeA.split(':').map(Number);
            const dateAObj = createDateFromTz(yA, mA - 1, dA, hrA, minA, diffTzA);

            const [yB, mB, dB] = diffDateB.split('-').map(Number);
            const [hrB, minB] = diffTimeB.split(':').map(Number);
            const dateBObj = createDateFromTz(yB, mB - 1, dB, hrB, minB, diffTzB);

            const msDiff = Math.abs(dateBObj.getTime() - dateAObj.getTime());
            
            const totalSecs = Math.floor(msDiff / 1000);
            const totalMins = Math.floor(totalSecs / 60);
            const totalHours = Math.floor(totalMins / 60);
            const totalDays = Math.floor(totalHours / 24);

            const remHours = totalHours % 24;
            const remMins = totalMins % 60;

            return {
                days: totalDays,
                hours: remHours,
                minutes: remMins,
                totalHours,
                totalMins,
                totalSecs,
                older: dateAObj < dateBObj ? 'First is earlier' : 'Second is earlier'
            };
        } catch (e) {
            return null;
        }
    };

    const calculateMathResult = () => {
        try {
            const [y, m, d] = mathDate.split('-').map(Number);
            const [hr, min] = mathTime.split(':').map(Number);

            let targetYear = y;
            let targetMonth = m - 1; // 0-indexed
            let targetDay = d;
            let targetHour = hr;
            let targetMinute = min;
            let targetSecond = 0;

            if (mathOp === 'add') {
                targetYear += (mathYears || 0);
                targetMonth += (mathMonths || 0);
                targetDay += (mathDays || 0);
                targetHour += (mathHours || 0);
                targetMinute += (mathMinutes || 0);
                targetSecond += (mathSeconds || 0);
            } else {
                targetYear -= (mathYears || 0);
                targetMonth -= (mathMonths || 0);
                targetDay -= (mathDays || 0);
                targetHour -= (mathHours || 0);
                targetMinute -= (mathMinutes || 0);
                targetSecond -= (mathSeconds || 0);
            }

            const resultDate = createDateFromTz(targetYear, targetMonth, targetDay, targetHour, targetMinute, targetSecond, mathTz);
            const targetParts = getLocalDateParts(resultDate, mathTz);
            const abbrev = getTimeZoneAbbrev(resultDate, mathTz);
            const offset = getTimeZoneOffset(resultDate, mathTz);

            const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = daysArr[resultDate.getUTCDay()]; // UTC representing converted wall-clock day
            
            const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthsArr[targetParts.month];

            let timeString = '';
            if (use24Hour) {
                timeString = `${pad(targetParts.hour)}:${pad(targetParts.minute)}:${pad(targetParts.second || 0)}`;
            } else {
                let displayHour = targetParts.hour % 12;
                if (displayHour === 0) displayHour = 12;
                const ampm = targetParts.hour >= 12 ? 'PM' : 'AM';
                timeString = `${pad(displayHour)}:${pad(targetParts.minute)}:${pad(targetParts.second || 0)} ${ampm}`;
            }

            return {
                date: `${dayOfWeek} ${targetParts.day} ${monthName} ${targetParts.year}`,
                time: timeString,
                dayOfWeek,
                abbrev,
                offset
            };
        } catch (e) {
            return null;
        }
    };

    const diffResult = calculateDifferenceResult();
    const mathResult = calculateMathResult();

    return (
        <div className="flex flex-col h-full overflow-hidden max-w-lg mx-auto w-full">
            {/* Header bar */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-5 h-5 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-base font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">Time Tools</h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className={`flex items-center justify-center p-1.5 rounded-full transition-all ${showExplanation ? 'bg-primary-600/20 text-primary-400 ring-1 ring-primary-500/50' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300'}`}
                        title="Show Info"
                    >
                        <Info className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={toggleHelp}
                        className="flex items-center justify-center p-1.5 rounded-full bg-neutral-800 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300 transition-all"
                        title="Help Guide"
                    >
                        <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={toggleSettings}
                        className="flex items-center justify-center p-1.5 rounded-full bg-neutral-800 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300 transition-all mr-1"
                        title="Settings"
                    >
                        <Settings className="w-3.5 h-3.5" />
                    </button>

                    {/* Main Mode Toggle: Converter vs Calculator */}
                    <div className="flex bg-neutral-900/70 rounded-md p-0.5 ring-1 ring-neutral-800">
                        <button
                            onClick={() => setMainMode('converter')}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${
                                mainMode === 'converter' 
                                    ? 'bg-primary-600/25 text-primary-400 ring-1 ring-primary-500/40' 
                                    : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                            Converter
                        </button>
                        <button
                            onClick={() => setMainMode('calculator')}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded transition-all ${
                                mainMode === 'calculator' 
                                    ? 'bg-primary-600/25 text-primary-400 ring-1 ring-primary-500/40' 
                                    : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                            Calculator
                        </button>
                    </div>
                </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && (
                <div className="bg-gradient-to-r from-primary-900/30 to-neutral-800/50 border border-primary-500/30 rounded-xl p-3 mb-3 text-xs text-neutral-300 text-left shrink-0">
                    <p className="font-bold text-primary-400 mb-1">Time Tools</p>
                    <p className="text-[11px] leading-relaxed">
                        Easily convert times across multiple time zones or perform date/time arithmetic.
                        In <strong>Converter</strong> mode, synchronizing any clock updates all others in real time.
                        In <strong>Calculator</strong> mode, compute exact differences between two locations or add/subtract offsets from a starting date-time.
                    </p>
                </div>
            )}

            {/* Content view toggle */}
            {mainMode === 'converter' ? (
                /* --------------------- CONVERTER VIEW --------------------- */
                <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-y-auto custom-scrollbar pb-2 px-0.5">
                    {/* Top widgets row */}
                    <div className="flex justify-center gap-1.5 mb-1 pb-3 border-b border-neutral-700/35 shrink-0">
                        <button
                            onClick={() => setUse24Hour(!use24Hour)}
                            className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-neutral-850 text-neutral-400 font-bold text-[10px] hover:bg-neutral-750 hover:text-white transition-all ring-1 ring-white/5 uppercase tracking-wider"
                        >
                            <Clock size={12} />
                            {use24Hour ? '24-Hour' : '12-Hour'}
                        </button>
                        
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className={`flex items-center gap-1 py-1.5 px-2.5 rounded-xl font-bold text-[10px] transition-all ring-1 ring-white/5 uppercase tracking-wider ${
                                showDatePicker 
                                    ? 'bg-primary-600/20 text-primary-400 ring-primary-500/30' 
                                    : 'bg-neutral-850 text-neutral-400 hover:bg-neutral-750 hover:text-white'
                            }`}
                        >
                            <Calendar size={12} />
                            {showDatePicker ? 'Date Active' : 'Date Hidden'}
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold text-[10px] transition-all uppercase tracking-wider ${
                                copied 
                                    ? 'bg-green-600/20 text-green-400 ring-1 ring-green-500/30' 
                                    : 'bg-neutral-850 text-neutral-400 hover:bg-neutral-750 hover:text-white ring-1 ring-white/5'
                            }`}
                        >
                            {copied ? <Check size={12} /> : <Link size={12} />}
                            {copied ? 'Copied' : 'Share Link'}
                        </button>
                    </div>
                    {clocks.map((clock, index) => {
                        const parts = getLocalDateParts(referenceDate, clock.timeZone);
                        const abbrev = getTimeZoneAbbrev(referenceDate, clock.timeZone);
                        const offset = getTimeZoneOffset(referenceDate, clock.timeZone);
                        
                        const htmlDateStr = `${parts.year}-${pad(parts.month + 1)}-${pad(parts.day)}`;

                        let displayHour = parts.hour;
                        let ampm = 'AM';
                        if (!use24Hour) {
                            ampm = parts.hour >= 12 ? 'PM' : 'AM';
                            displayHour = parts.hour % 12;
                            if (displayHour === 0) displayHour = 12;
                        }

                        const totalMinutes = parts.hour * 60 + parts.minute;
                        const isSearchActive = activeSearchIndex === index;

                        return (
                            <div 
                                key={clock.id}
                                className={`bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-4 flex flex-col relative gap-3 backdrop-blur-md transition-all duration-300 hover:border-neutral-600/50 hover:bg-neutral-800/60 ${
                                    isSearchActive ? 'z-50' : 'z-10'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3 relative z-30">
                                    <div className="flex-1 relative" ref={el => searchDropdownRefs.current[index] = el}>
                                        {isSearchActive ? (
                                            <div className="w-full">
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    value={searchQuery}
                                                    placeholder="Search city, country, or timezone..."
                                                    onChange={(e) => handleSearchChange(index, e.target.value)}
                                                    className="w-full bg-neutral-900 border border-primary-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                                                />
                                                <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-[99999] py-1 divide-y divide-neutral-800 custom-scrollbar">
                                                    {searchResults.length > 0 ? (
                                                        searchResults.map(res => {
                                                            const shortCode = res.id ? (getTimeZoneAbbrev(referenceDate, res.id) || res.abbrev?.toUpperCase()) : '';
                                                            const offset = res.id ? getTimeZoneOffset(referenceDate, res.id) : '';
                                                            return (
                                                                <button
                                                                    key={res.id}
                                                                    onClick={() => handleSelectTimezone(index, res.id, res.customLabel)}
                                                                    className="w-full text-left px-3 py-2 text-[11px] text-neutral-300 hover:bg-primary-600/20 hover:text-white transition-colors flex justify-between items-center"
                                                                >
                                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                                        <span className="font-semibold truncate">{res.label || res.city}</span>
                                                                        {shortCode && (
                                                                            <span className="text-[8px] px-1 py-0.5 rounded bg-primary-950/60 text-primary-400 font-mono border border-primary-500/25 uppercase shrink-0">
                                                                                {shortCode}
                                                                            </span>
                                                                        )}
                                                                        {offset && (
                                                                            <span className="text-[8px] px-1 py-0.5 rounded bg-neutral-900/60 text-neutral-400 font-mono border border-white/5 uppercase shrink-0">
                                                                                {offset}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-[9px] text-neutral-500 font-mono shrink-0 ml-2">{res.id}</span>
                                                                </button>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="px-3 py-2 text-[10px] text-neutral-500 text-center">No matching timezones</div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setActiveSearchIndex(index);
                                                    handleSearchChange(index, '');
                                                }}
                                                className="group flex items-center gap-1.5 text-left text-neutral-400 hover:text-white transition-colors"
                                            >
                                                <span className="font-bold text-sm text-neutral-200 truncate group-hover:text-primary-400 transition-colors">
                                                    {clock.timeZone.split('/').pop()?.replace(/_/g, ' ') || clock.timeZone}
                                                </span>
                                                <ChevronDown size={14} className="opacity-60 group-hover:opacity-100" />
                                                <span className="text-[9px] text-neutral-500 font-mono tracking-wider bg-neutral-900/40 px-1.5 py-0.5 rounded border border-white/5">
                                                    {abbrev} {offset}
                                                </span>
                                            </button>
                                        )}
                                    </div>

                                    {clocks.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveClock(clock.id)}
                                            className="p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-800/80 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 relative z-20">
                                    <div className="flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-xl border border-white/5 font-mono text-lg">
                                         <div className="flex items-center gap-0.5">
                                             <input
                                                 type="text"
                                                 inputMode="numeric"
                                                 pattern="[0-9]*"
                                                 maxLength={2}
                                                 value={pad(displayHour)}
                                                 onChange={(e) => {
                                                     const val = e.target.value.replace(/\D/g, '');
                                                     if (val === '') {
                                                         handleTimeChange(clock, 'hour', 0);
                                                     } else {
                                                         handleTimeChange(clock, 'hour', val);
                                                     }
                                                 }}
                                                 className="w-8 bg-transparent text-center text-white focus:outline-none focus:text-primary-400 font-bold"
                                             />
                                             <div className="flex flex-col select-none">
                                                 <button 
                                                     onClick={() => adjustTimePart(clock, 'hour', 1)}
                                                     className="p-0.5 hover:text-primary-400 text-neutral-500 transition-colors"
                                                 >
                                                     <ChevronUp size={12} strokeWidth={3} />
                                                 </button>
                                                 <button 
                                                     onClick={() => adjustTimePart(clock, 'hour', -1)}
                                                     className="p-0.5 hover:text-primary-400 text-neutral-500 transition-colors"
                                                 >
                                                     <ChevronDown size={12} strokeWidth={3} />
                                                 </button>
                                             </div>
                                         </div>
                                         <span className="text-neutral-500 select-none">:</span>
                                         <div className="flex items-center gap-0.5">
                                             <input
                                                 type="text"
                                                 inputMode="numeric"
                                                 pattern="[0-9]*"
                                                 maxLength={2}
                                                 value={pad(parts.minute)}
                                                 onChange={(e) => {
                                                     const val = e.target.value.replace(/\D/g, '');
                                                     if (val === '') {
                                                         handleTimeChange(clock, 'minute', 0);
                                                     } else {
                                                         handleTimeChange(clock, 'minute', val);
                                                     }
                                                 }}
                                                 className="w-8 bg-transparent text-center text-white focus:outline-none focus:text-primary-400 font-bold"
                                             />
                                             <div className="flex flex-col select-none">
                                                 <button 
                                                     onClick={() => adjustTimePart(clock, 'minute', 1)}
                                                     className="p-0.5 hover:text-primary-400 text-neutral-500 transition-colors"
                                                 >
                                                     <ChevronUp size={12} strokeWidth={3} />
                                                 </button>
                                                 <button 
                                                     onClick={() => adjustTimePart(clock, 'minute', -1)}
                                                     className="p-0.5 hover:text-primary-400 text-neutral-500 transition-colors"
                                                 >
                                                     <ChevronDown size={12} strokeWidth={3} />
                                                 </button>
                                             </div>
                                         </div>

                                        {!use24Hour && (
                                            <button
                                                onClick={() => handleTimeChange(clock, 'ampm', ampm === 'AM' ? 'PM' : 'AM')}
                                                className="ml-1 px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-primary-400 transition-colors uppercase"
                                            >
                                                {ampm}
                                            </button>
                                        )}
                                    </div>

                                    {showDatePicker && (
                                        <div className="flex items-center gap-1.5 bg-neutral-900/40 px-2 py-1.5 rounded-xl border border-white/5">
                                            <input
                                                type="date"
                                                value={htmlDateStr}
                                                onChange={(e) => handleDateChange(clock, e)}
                                                className="bg-transparent text-xs text-neutral-300 font-bold focus:outline-none dark:[color-scheme:dark]"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="w-full flex items-center gap-2 mt-1 relative z-10">
                                    <span className="text-[9px] text-neutral-500 font-bold font-mono">00:00</span>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1439}
                                        step={15}
                                        value={totalMinutes}
                                        onChange={(e) => handleSliderChange(clock, e)}
                                        className="flex-1 accent-primary-500 h-1 bg-neutral-950 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-[9px] text-neutral-500 font-bold font-mono">23:45</span>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={() => handleAddClock('UTC')}
                        className="w-full py-3.5 border border-dashed border-neutral-700 hover:border-primary-500/50 hover:bg-primary-950/5 text-neutral-400 hover:text-primary-400 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-bold text-xs uppercase tracking-wider group mt-1"
                    >
                        <Plus size={16} />
                        Add Timezone
                    </button>
                </div>
            ) : (
                /* --------------------- CALCULATOR VIEW --------------------- */
                <div className="flex-1 flex flex-col min-h-0 space-y-4 overflow-y-auto custom-scrollbar pb-2 px-0.5">
                    {/* Calculator Subtabs: Difference vs Add/Subtract */}
                    <div className="flex bg-neutral-800/60 rounded-lg p-0.5 border border-neutral-700">
                        <button
                            onClick={() => setCalcSubMode('difference')}
                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${
                                calcSubMode === 'difference' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                            Difference
                        </button>
                        <button
                            onClick={() => setCalcSubMode('math')}
                            className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${
                                calcSubMode === 'math' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                            Add/Subtract
                        </button>
                    </div>

                    {/* Time format selector row */}
                    <div className="flex justify-center gap-1.5 shrink-0">
                        <button
                            onClick={() => setUse24Hour(!use24Hour)}
                            className="flex items-center gap-1 py-1.5 px-3 rounded-xl bg-neutral-850 text-neutral-400 font-bold text-[10px] hover:bg-neutral-750 hover:text-white transition-all ring-1 ring-white/5 uppercase tracking-wider"
                        >
                            <Clock size={12} />
                            {use24Hour ? '24-Hour Format' : '12-Hour Format'}
                        </button>
                    </div>

                    {calcSubMode === 'difference' ? (
                        /* DIFFERENCE CALCULATOR */
                        <div className="space-y-4">
                            {/* Input A */}
                            <div className="bg-neutral-850/40 border border-neutral-750/50 rounded-2xl p-4 space-y-3">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Start Date-Time (A)</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        type="date" 
                                        value={diffDateA}
                                        onChange={(e) => setDiffDateA(e.target.value)}
                                        className="bg-neutral-900 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-neutral-200 focus:outline-none dark:[color-scheme:dark]"
                                    />
                                    <TimeInput 
                                        value={diffTimeA}
                                        onChange={setDiffTimeA}
                                        use24Hour={use24Hour}
                                    />
                                </div>
                                <div className="relative" ref={el => calcDropdownRefs.current['diffA'] = el}>
                                    {activeCalcSearchField === 'diffA' ? (
                                        <div className="w-full">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={calcSearchQuery}
                                                placeholder="Search city, country, or timezone..."
                                                onChange={(e) => handleCalcSearchChange('diffA', e.target.value)}
                                                className="w-full bg-neutral-900 border border-primary-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                                            />
                                            <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-[99999] py-1 divide-y divide-neutral-800 custom-scrollbar">
                                                {calcSearchResults.length > 0 ? (
                                                    calcSearchResults.map(res => {
                                                        const shortCode = res.id ? (getTimeZoneAbbrev(new Date(), res.id) || res.abbrev?.toUpperCase()) : '';
                                                        const offset = res.id ? getTimeZoneOffset(new Date(), res.id) : '';
                                                        return (
                                                            <button
                                                                key={res.id}
                                                                onClick={() => handleSelectCalcTimezone('diffA', res.id)}
                                                                className="w-full text-left px-3 py-2 text-[11px] text-neutral-300 hover:bg-primary-600/20 hover:text-white transition-colors flex justify-between items-center"
                                                            >
                                                                <div className="flex items-center gap-1.5 min-w-0">
                                                                    <span className="font-semibold truncate">{res.label || res.city}</span>
                                                                    {shortCode && (
                                                                        <span className="text-[8px] px-1 py-0.5 rounded bg-primary-950/60 text-primary-400 font-mono border border-primary-500/25 uppercase shrink-0">
                                                                            {shortCode}
                                                                        </span>
                                                                    )}
                                                                    {offset && (
                                                                        <span className="text-[8px] px-1 py-0.5 rounded bg-neutral-900/60 text-neutral-400 font-mono border border-white/5 uppercase shrink-0">
                                                                            {offset}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[9px] text-neutral-500 font-mono shrink-0 ml-2">{res.id}</span>
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="px-3 py-2 text-[10px] text-neutral-500 text-center">No matching timezones</div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setActiveCalcSearchField('diffA');
                                                handleCalcSearchChange('diffA', '');
                                            }}
                                            className="w-full flex justify-between items-center bg-neutral-900 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-neutral-300 hover:text-white transition-all text-left"
                                        >
                                            <span className="truncate">
                                                {diffTzA.split('/').pop()?.replace(/_/g, ' ') || diffTzA} ({diffTzA})
                                            </span>
                                            <ChevronDown size={14} className="opacity-60 shrink-0" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Input B */}
                            <div className="bg-neutral-850/40 border border-neutral-750/50 rounded-2xl p-4 space-y-3">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">End Date-Time (B)</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        type="date" 
                                        value={diffDateB}
                                        onChange={(e) => setDiffDateB(e.target.value)}
                                        className="bg-neutral-900 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-neutral-200 focus:outline-none dark:[color-scheme:dark]"
                                    />
                                    <TimeInput 
                                        value={diffTimeB}
                                        onChange={setDiffTimeB}
                                        use24Hour={use24Hour}
                                    />
                                </div>
                                <div className="relative" ref={el => calcDropdownRefs.current['diffB'] = el}>
                                    {activeCalcSearchField === 'diffB' ? (
                                        <div className="w-full">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={calcSearchQuery}
                                                placeholder="Search city, country, or timezone..."
                                                onChange={(e) => handleCalcSearchChange('diffB', e.target.value)}
                                                className="w-full bg-neutral-900 border border-primary-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                                            />
                                            <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-[99999] py-1 divide-y divide-neutral-800 custom-scrollbar">
                                                {calcSearchResults.length > 0 ? (
                                                    calcSearchResults.map(res => {
                                                        const shortCode = res.id ? (getTimeZoneAbbrev(new Date(), res.id) || res.abbrev?.toUpperCase()) : '';
                                                        const offset = res.id ? getTimeZoneOffset(new Date(), res.id) : '';
                                                        return (
                                                            <button
                                                                key={res.id}
                                                                onClick={() => handleSelectCalcTimezone('diffB', res.id)}
                                                                className="w-full text-left px-3 py-2 text-[11px] text-neutral-300 hover:bg-primary-600/20 hover:text-white transition-colors flex justify-between items-center"
                                                            >
                                                                <div className="flex items-center gap-1.5 min-w-0">
                                                                    <span className="font-semibold truncate">{res.label || res.city}</span>
                                                                    {shortCode && (
                                                                        <span className="text-[8px] px-1 py-0.5 rounded bg-primary-950/60 text-primary-400 font-mono border border-primary-500/25 uppercase shrink-0">
                                                                            {shortCode}
                                                                        </span>
                                                                    )}
                                                                    {offset && (
                                                                        <span className="text-[8px] px-1 py-0.5 rounded bg-neutral-900/60 text-neutral-400 font-mono border border-white/5 uppercase shrink-0">
                                                                            {offset}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[9px] text-neutral-500 font-mono shrink-0 ml-2">{res.id}</span>
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="px-3 py-2 text-[10px] text-neutral-500 text-center">No matching timezones</div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setActiveCalcSearchField('diffB');
                                                handleCalcSearchChange('diffB', '');
                                            }}
                                            className="w-full flex justify-between items-center bg-neutral-900 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-neutral-300 hover:text-white transition-all text-left"
                                        >
                                            <span className="truncate">
                                                {diffTzB.split('/').pop()?.replace(/_/g, ' ') || diffTzB} ({diffTzB})
                                            </span>
                                            <ChevronDown size={14} className="opacity-60 shrink-0" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Difference Output Result */}
                            {diffResult && (
                                <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 border border-white/10 rounded-2xl p-4 space-y-3">
                                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block">Time Difference</span>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-neutral-900/60 rounded-xl p-2.5 border border-white/5">
                                            <div className="text-[9px] text-neutral-500 font-bold uppercase">Days</div>
                                            <div className="text-xl font-bold font-mono text-white">{diffResult.days}</div>
                                        </div>
                                        <div className="bg-neutral-900/60 rounded-xl p-2.5 border border-white/5">
                                            <div className="text-[9px] text-neutral-500 font-bold uppercase">Hours</div>
                                            <div className="text-xl font-bold font-mono text-white">{diffResult.hours}</div>
                                        </div>
                                        <div className="bg-neutral-900/60 rounded-xl p-2.5 border border-white/5">
                                            <div className="text-[9px] text-neutral-500 font-bold uppercase">Minutes</div>
                                            <div className="text-xl font-bold font-mono text-white">{diffResult.minutes}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Detailed breakdown list */}
                                    <div className="space-y-1.5 text-[11px] text-neutral-400 bg-neutral-900/40 p-3 rounded-xl border border-white/5 font-mono">
                                        <div className="flex justify-between">
                                            <span>Total Hours:</span>
                                            <span className="text-white font-bold">{diffResult.totalHours.toLocaleString()} hrs</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Minutes:</span>
                                            <span className="text-white font-bold">{diffResult.totalMins.toLocaleString()} mins</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Seconds:</span>
                                            <span className="text-white font-bold">{diffResult.totalSecs.toLocaleString()} secs</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ADD / SUBTRACT CALCULATOR */
                        <div className="space-y-4">
                            {/* Start parameters */}
                            <div className="bg-neutral-850/40 border border-neutral-750/50 rounded-2xl p-4 space-y-3">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Start Date-Time</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        type="date" 
                                        value={mathDate}
                                        onChange={(e) => setMathDate(e.target.value)}
                                        className="bg-neutral-900 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-neutral-200 focus:outline-none dark:[color-scheme:dark]"
                                    />
                                    <TimeInput 
                                        value={mathTime}
                                        onChange={setMathTime}
                                        use24Hour={use24Hour}
                                    />
                                </div>
                                <div className="relative" ref={el => calcDropdownRefs.current['math'] = el}>
                                    {activeCalcSearchField === 'math' ? (
                                        <div className="w-full">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={calcSearchQuery}
                                                placeholder="Search city, country, or timezone..."
                                                onChange={(e) => handleCalcSearchChange('math', e.target.value)}
                                                className="w-full bg-neutral-900 border border-primary-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                                            />
                                            <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-[99999] py-1 divide-y divide-neutral-800 custom-scrollbar">
                                                {calcSearchResults.length > 0 ? (
                                                    calcSearchResults.map(res => {
                                                        const shortCode = res.id ? (getTimeZoneAbbrev(new Date(), res.id) || res.abbrev?.toUpperCase()) : '';
                                                        const offset = res.id ? getTimeZoneOffset(new Date(), res.id) : '';
                                                        return (
                                                            <button
                                                                key={res.id}
                                                                onClick={() => handleSelectCalcTimezone('math', res.id)}
                                                                className="w-full text-left px-3 py-2 text-[11px] text-neutral-300 hover:bg-primary-600/20 hover:text-white transition-colors flex justify-between items-center"
                                                            >
                                                                <div className="flex items-center gap-1.5 min-w-0">
                                                                    <span className="font-semibold truncate">{res.label || res.city}</span>
                                                                    {shortCode && (
                                                                        <span className="text-[8px] px-1 py-0.5 rounded bg-primary-950/60 text-primary-400 font-mono border border-primary-500/25 uppercase shrink-0">
                                                                            {shortCode}
                                                                        </span>
                                                                    )}
                                                                    {offset && (
                                                                        <span className="text-[8px] px-1 py-0.5 rounded bg-neutral-900/60 text-neutral-400 font-mono border border-white/5 uppercase shrink-0">
                                                                            {offset}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[9px] text-neutral-500 font-mono shrink-0 ml-2">{res.id}</span>
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="px-3 py-2 text-[10px] text-neutral-500 text-center">No matching timezones</div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setActiveCalcSearchField('math');
                                                handleCalcSearchChange('math', '');
                                            }}
                                            className="w-full flex justify-between items-center bg-neutral-900 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-neutral-300 hover:text-white transition-all text-left"
                                        >
                                            <span className="truncate">
                                                {mathTz.split('/').pop()?.replace(/_/g, ' ') || mathTz} ({mathTz})
                                            </span>
                                            <ChevronDown size={14} className="opacity-60 shrink-0" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Math controls */}
                            <div className="bg-neutral-850/40 border border-neutral-750/50 rounded-2xl p-4 space-y-3">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Add or Subtract Duration</span>
                                <div className="flex bg-neutral-900/60 rounded-xl p-0.5 border border-white/5 mb-2">
                                    <button
                                        onClick={() => setMathOp('add')}
                                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                            mathOp === 'add' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                    >
                                        Add (+)
                                    </button>
                                    <button
                                        onClick={() => setMathOp('subtract')}
                                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                            mathOp === 'subtract' ? 'bg-primary-600/20 text-primary-400' : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                    >
                                        Subtract (-)
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Years</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            value={mathYears}
                                            onChange={(e) => setMathYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Months</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            value={mathMonths}
                                            onChange={(e) => setMathMonths(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Days</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            value={mathDays}
                                            onChange={(e) => setMathDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Hours</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            value={mathHours}
                                            onChange={(e) => setMathHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Minutes</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            value={mathMinutes}
                                            onChange={(e) => setMathMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Seconds</label>
                                        <input 
                                            type="number"
                                            min={0}
                                            value={mathSeconds}
                                            onChange={(e) => setMathSeconds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                            className="w-full bg-neutral-900 border border-white/5 rounded-xl px-2.5 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Math Result */}
                            {mathResult && (
                                <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 border border-white/10 rounded-2xl p-4 space-y-2">
                                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block">Calculated Result Date-Time</span>
                                    <div className="text-center py-2 space-y-1">
                                        <div className="text-2xl font-mono font-bold text-white">{mathResult.time}</div>
                                        <div className="text-xs text-neutral-300 font-bold">{mathResult.date}</div>
                                        <div className="text-[9px] text-neutral-500 font-mono tracking-wider">
                                            {mathResult.abbrev} {mathResult.offset}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimeZoneConverter;

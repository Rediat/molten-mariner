import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../src/features/fxcompare/bankFxData.json');

const targetCurrencies = [
    'USD', 'EUR', 'CHF', 'CAD', 'AUD', 'CNY', 'GBP', 'SEK', 'KWD', 'AED', 
    'SAR', 'QAR', 'OMR', 'JOD', 'BHD', 'TRY', 'EGP', 'YER', 'ILS', 'INR', 
    'PKR', 'XAU', 'XAG', 'XPT', 'XCU', 'XPB', 'XSN', 'XNI', 'ZNC', 'BTC'
];

async function syncBankFx() {
    console.log('Initiating bank FX exchange rates sync...');
    
    // API key
    const apiKey = '5f5e293d508364d65cc61cccecb3b3a5';
    
    let existingData = { monthlyPrices: [] };
    if (fs.existsSync(DATA_FILE)) {
        try {
            existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {
            console.warn('Could not parse existing data file, starting fresh.');
        }
    }
    
    // Determine start date
    let startDateStr = '2023-01-01';
    if (existingData.monthlyPrices && existingData.monthlyPrices.length > 0) {
        const sorted = [...existingData.monthlyPrices].sort((a, b) => a.month.localeCompare(b.month));
        const latestMonth = sorted[sorted.length - 1].month; // YYYY-MM
        startDateStr = `${latestMonth}-01`;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    if (startDateStr > today) {
        startDateStr = today;
    }
    
    console.log(`Syncing bank FX rates from ${startDateStr} to ${today}...`);
    
    // Helper to calculate chunks of max 360 days to be safe
    const getChunks = (start, end) => {
        const chunks = [];
        let currStart = new Date(start);
        const targetEnd = new Date(end);
        
        while (currStart <= targetEnd) {
            const nextEnd = new Date(currStart);
            nextEnd.setDate(nextEnd.getDate() + 360);
            
            const chunkEnd = nextEnd > targetEnd ? targetEnd : nextEnd;
            
            chunks.push({
                start: currStart.toISOString().split('T')[0],
                end: chunkEnd.toISOString().split('T')[0]
            });
            
            currStart = new Date(chunkEnd);
            currStart.setDate(currStart.getDate() + 1);
        }
        return chunks;
    };
    
    const chunks = getChunks(startDateStr, today);
    const fetchedQuotes = {};
    
    for (const chunk of chunks) {
        const url = `https://api.exchangerate.host/timeframe?access_key=${apiKey}&start_date=${chunk.start}&end_date=${chunk.end}&base=USD`;
        console.log(`Fetching: ${chunk.start} to ${chunk.end}`);
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!data.success) {
                console.error(`API Error:`, data.error);
                continue;
            }
            if (data.quotes) {
                Object.assign(fetchedQuotes, data.quotes);
            }
        } catch (err) {
            console.error(`Fetch failed for ${chunk.start} to ${chunk.end}:`, err);
        }
        
        // Brief delay between API calls
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const fetchedDates = Object.keys(fetchedQuotes).sort();
    if (fetchedDates.length === 0) {
        console.log('No new data fetched.');
        return;
    }
    
    // Group fetched daily quotes by month
    const fetchedGroups = {}; // month -> currency -> list of rates
    for (const date of fetchedDates) {
        const month = date.substring(0, 7);
        const rateObj = fetchedQuotes[date];
        const usdEtb = rateObj.USDETB;
        
        if (usdEtb === undefined || usdEtb === null) continue;
        
        if (!fetchedGroups[month]) {
            fetchedGroups[month] = {};
            for (const c of targetCurrencies) {
                fetchedGroups[month][c] = [];
            }
        }
        
        for (const c of targetCurrencies) {
            if (c === 'USD') {
                fetchedGroups[month]['USD'].push(usdEtb);
            } else {
                const pair = `USD${c}`;
                const usdToC = rateObj[pair];
                if (usdToC !== undefined && usdToC !== null && usdToC !== 0) {
                    fetchedGroups[month][c].push(usdEtb / usdToC);
                }
            }
        }
    }
    
    // Merge into existing monthlyPrices
    const mergedPrices = [...existingData.monthlyPrices];
    
    for (const month of Object.keys(fetchedGroups).sort()) {
        const values = {};
        for (const c of targetCurrencies) {
            const rates = fetchedGroups[month][c];
            if (rates && rates.length > 0) {
                const sum = rates.reduce((a, b) => a + b, 0);
                values[c] = sum / rates.length;
            }
        }
        
        if (Object.keys(values).length > 0) {
            const idx = mergedPrices.findIndex(p => p.month === month);
            const entry = { month, value: values };
            if (idx === -1) {
                mergedPrices.push(entry);
            } else {
                // Merge/Overwrite for that month
                mergedPrices[idx] = entry;
            }
        }
    }
    
    // Sort and compile
    mergedPrices.sort((a, b) => a.month.localeCompare(b.month));
    
    const earliestDate = mergedPrices.length > 0 ? `${mergedPrices[0].month}-01` : '2023-01-01';
    const earliestTimestamp = Math.floor(new Date(earliestDate).getTime() / 1000);
    const latestTimestamp = Math.floor(new Date().getTime() / 1000);
    
    const finalData = {
        earliest: existingData.earliest || earliestTimestamp,
        latest: latestTimestamp,
        monthlyPrices: mergedPrices
    };
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(finalData, null, 2), 'utf8');
    console.log(`Sync complete! Saved to ${DATA_FILE}`);
}

syncBankFx();

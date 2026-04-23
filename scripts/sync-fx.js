import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../src/features/fxcompare/fxData.json');
const API_URL = 'https://ethioblackmarket.com/api/price-history-range';

async function syncFxData() {
    console.log('Fetching FX data from', API_URL);
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let existingData = { monthlyPrices: [] };
        if (fs.existsSync(DATA_FILE)) {
            try {
                existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            } catch (e) {
                console.warn('Could not parse existing data file, starting fresh.');
            }
        }

        // Merge logic: Add new months, update existing ones
        const mergedMonthlyPrices = [...existingData.monthlyPrices];
        let addedCount = 0;
        let updatedCount = 0;

        data.monthlyPrices.forEach(newItem => {
            const idx = mergedMonthlyPrices.findIndex(oldItem => oldItem.month === newItem.month);
            if (idx === -1) {
                mergedMonthlyPrices.push(newItem);
                addedCount++;
            } else {
                // Safe merge: preserve existing values if new ones are null
                const oldItem = mergedMonthlyPrices[idx];
                const updatedItem = { ...oldItem };
                let hasChanges = false;

                for (let key in newItem) {
                    if (newItem[key] !== null && newItem[key] !== undefined) {
                        if (updatedItem[key] !== newItem[key]) {
                            updatedItem[key] = newItem[key];
                            hasChanges = true;
                        }
                    }
                }

                if (hasChanges) {
                    mergedMonthlyPrices[idx] = updatedItem;
                    updatedCount++;
                }
            }
        });

        // Sort by month (YYYY-MM) ascending
        mergedMonthlyPrices.sort((a, b) => a.month.localeCompare(b.month));

        const finalData = { ...data, monthlyPrices: mergedMonthlyPrices };
        fs.writeFileSync(DATA_FILE, JSON.stringify(finalData, null, 2));
        
        console.log(`Sync complete!`);
        console.log(`- New months added: ${addedCount}`);
        console.log(`- Existing months updated: ${updatedCount}`);
        console.log(`- Total records now: ${mergedMonthlyPrices.length}`);
        
    } catch (error) {
        console.error('Failed to sync FX data:', error);
        process.exit(1);
    }
}

syncFxData();

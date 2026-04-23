import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'src', 'features', 'inflation', 'data.json');
const SOURCE_URL = 'https://www.worlddata.info/africa/ethiopia/inflation-rates.php';

async function syncInflationData() {
    console.log(`Fetching inflation data from ${SOURCE_URL}...`);
    try {
        const { data } = await axios.get(SOURCE_URL);
        const $ = cheerio.load(data);
        const newEntries = [];

        // Select the table with historical data
        $('table.std100 tr').each((i, row) => {
            const cells = $(row).find('td');
            if (cells.length >= 2) {
                const year = parseInt($(cells[0]).text().trim());
                const rateText = $(cells[1]).text().trim();
                
                // Parse rate (e.g., "16.95 %" -> 16.95)
                const rate = parseFloat(rateText.replace('%', '').trim());

                if (!isNaN(year) && !isNaN(rate)) {
                    newEntries.push({ year, rate });
                }
            }
        });

        if (newEntries.length === 0) {
            throw new Error('No data entries found in the source table.');
        }

        // Sort new entries ascending by year
        newEntries.sort((a, b) => a.year - b.year);

        let existingData = [];
        if (fs.existsSync(DATA_FILE)) {
            existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }

        let addedCount = 0;
        let updatedCount = 0;

        newEntries.forEach(entry => {
            const idx = existingData.findIndex(d => d.year === entry.year);
            if (idx === -1) {
                existingData.push(entry);
                addedCount++;
            } else if (existingData[idx].rate !== entry.rate) {
                existingData[idx].rate = entry.rate;
                updatedCount++;
            }
        });

        // Re-sort to ensure order
        existingData.sort((a, b) => a.year - b.year);

        fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));

        console.log(`Sync complete!`);
        console.log(`- New years added: ${addedCount}`);
        console.log(`- Years updated: ${updatedCount}`);
        console.log(`- Total records: ${existingData.length}`);

    } catch (error) {
        console.error('Failed to sync inflation data:', error.message);
        process.exit(1);
    }
}

syncInflationData();

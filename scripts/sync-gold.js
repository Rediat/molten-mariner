import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_URL = 'https://datahub.io/core/gold-prices/_r/-/data/monthly.csv';
const JSON_PATH = path.join(__dirname, '../src/features/fxcompare/fxData.json');

async function syncGold() {
  try {
    console.log('Fetching gold prices from CSV...');
    const response = await axios.get(CSV_URL);
    const csvData = response.data;

    // Parse CSV: Date,Price
    // Format: YYYY-MM,Price
    const goldMap = {};
    const lines = csvData.split('\n');
    let headerFound = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!headerFound) {
        if (trimmed.toLowerCase().includes('date,price')) {
          headerFound = true;
        }
        continue;
      }
      if (!trimmed) continue;

      const [month, price] = trimmed.split(',');
      if (month && price) {
        // Ensure month format is YYYY-MM
        goldMap[month.trim()] = parseFloat(price);
      }
    }

    console.log(`Parsed ${Object.keys(goldMap).length} months of gold data.`);

    console.log('Reading fxData.json...');
    const jsonContent = await fs.readFile(JSON_PATH, 'utf-8');
    const data = JSON.parse(jsonContent);

    if (!data.monthlyPrices || !Array.isArray(data.monthlyPrices)) {
      throw new Error('Invalid fxData.json structure: monthlyPrices array not found.');
    }

    let updatedCount = 0;
    data.monthlyPrices.forEach(item => {
      if (goldMap[item.month]) {
        const usdRate = item.value.USD;
        if (usdRate) {
          // Convert Gold price (USD/oz) to ETB/oz using the current month's USD rate
          item.value.GOLD = goldMap[item.month] * usdRate;
          // Remove old 'Gold' key if it exists
          delete item.value.Gold;
          updatedCount++;
        } else {
          console.warn(`Skipping GOLD for ${item.month} because USD rate is missing.`);
        }
      }
    });

    console.log(`Updated ${updatedCount} entries with Gold prices.`);

    await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2));
    console.log('Successfully updated fxData.json');
  } catch (error) {
    console.error('Error syncing gold data:', error.message);
    process.exit(1);
  }
}

syncGold();

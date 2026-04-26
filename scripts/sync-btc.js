
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '../src/features/fxcompare/fxData.json');

// Extracted from Yahoo Finance
const BITCOIN_DATA = [
  {"month": "2026-04", "price": 78203.10},
  {"month": "2026-03", "price": 68233.31},
  {"month": "2026-02", "price": 66995.86},
  {"month": "2026-01", "price": 78621.12},
  {"month": "2025-12", "price": 87508.83},
  {"month": "2025-11", "price": 90394.31},
  {"month": "2025-10", "price": 109556.16},
  {"month": "2025-09", "price": 114056.09},
  {"month": "2025-08", "price": 108236.71},
  {"month": "2025-07", "price": 115758.20},
  {"month": "2025-06", "price": 107135.34},
  {"month": "2025-05", "price": 104638.09},
  {"month": "2025-04", "price": 94207.31},
  {"month": "2025-03", "price": 82548.91},
  {"month": "2025-02", "price": 84373.01},
  {"month": "2025-01", "price": 102405.02},
  {"month": "2024-12", "price": 93429.20},
  {"month": "2024-11", "price": 96449.05},
  {"month": "2024-10", "price": 70215.19},
  {"month": "2024-09", "price": 63329.50},
  {"month": "2024-08", "price": 58969.90},
  {"month": "2024-07", "price": 64619.25},
  {"month": "2024-06", "price": 62678.29},
  {"month": "2024-05", "price": 67491.41},
  {"month": "2024-04", "price": 60636.86},
  {"month": "2024-03", "price": 71333.65},
  {"month": "2024-02", "price": 61198.38},
  {"month": "2024-01", "price": 42582.61},
  {"month": "2023-12", "price": 42265.19},
  {"month": "2023-11", "price": 37712.75},
  {"month": "2023-10", "price": 34667.78},
  {"month": "2023-09", "price": 26967.92},
  {"month": "2023-08", "price": 25931.47},
  {"month": "2023-07", "price": 29230.11},
  {"month": "2023-06", "price": 30477.25},
  {"month": "2023-05", "price": 27219.66},
  {"month": "2023-04", "price": 29268.81},
  {"month": "2023-03", "price": 28478.48},
  {"month": "2023-02", "price": 23147.35},
  {"month": "2023-01", "price": 23139.28}
];

async function syncBitcoin() {
  try {
    console.log('Merging Bitcoin prices...');

    const bitcoinMap = {};
    BITCOIN_DATA.forEach(item => {
      bitcoinMap[item.month] = item.price;
    });

    console.log('Reading fxData.json...');
    const jsonContent = await fs.readFile(JSON_PATH, 'utf-8');
    const data = JSON.parse(jsonContent);

    if (!data.monthlyPrices || !Array.isArray(data.monthlyPrices)) {
      throw new Error('Invalid fxData.json structure: monthlyPrices array not found.');
    }

    let updatedCount = 0;
    data.monthlyPrices.forEach(item => {
      if (bitcoinMap[item.month]) {
        const usdRate = item.value.USD;
        if (usdRate) {
          // Convert Bitcoin price (USD) to ETB using the current month's USD rate
          item.value.BITCOIN = bitcoinMap[item.month] * usdRate;
          updatedCount++;
        } else {
          console.warn(`Skipping BITCOIN for ${item.month} because USD rate is missing.`);
        }
      }
    });

    console.log(`Updated ${updatedCount} entries with Bitcoin prices.`);

    await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2));
    console.log('Successfully updated fxData.json');
  } catch (error) {
    console.error('Error syncing Bitcoin data:', error.message);
    process.exit(1);
  }
}

syncBitcoin();

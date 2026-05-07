import axios from 'axios';
import * as XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WB_URL = 'https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Monthly.xlsx';
const JSON_PATH = path.join(__dirname, '../src/features/fxcompare/fxData.json');

// Mapping from WB Column names to our JSON keys
const METAL_MAPPING = {
  'GOLD': 'XAU',
  'SILVER': 'XAG',
  'PLATINUM': 'XPT',
  'COPPER': 'XCU',
  'LEAD': 'XPB',
  'Tin': 'XSN',
  'NICKEL': 'XNI',
  'Zinc': 'ZNC'
};

// Obsolete keys to be removed from fxData.json
const OBSOLETE_KEYS = ['HG', 'SN', 'ZN', 'Gold', 'GOLD', 'PB', 'NI'];

async function syncMetals() {
  try {
    console.log(`Fetching metals data from World Bank: ${WB_URL}`);
    const response = await axios.get(WB_URL, { responseType: 'arraybuffer' });
    const workbook = XLSX.read(response.data, { type: 'buffer' });

    const sheetName = 'Monthly Prices';
    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet "${sheetName}" not found in Excel file.`);
    }

    const sheet = workbook.Sheets[sheetName];
    // WB CMO Monthly Prices usually start data at row 7 (index 6)
    const jsonData = XLSX.utils.sheet_to_json(sheet, { range: 6 });

    console.log(`Parsed ${jsonData.length} months of commodity data.`);

    // Create a map of Month -> Metal Prices
    // WB Month format is "1960M01" -> Convert to "1960-01"
    const metalPricesMap = {};
    jsonData.forEach(row => {
      const rawMonth = row['__EMPTY'] || row['Month'] || Object.values(row)[0];
      if (typeof rawMonth === 'string' && rawMonth.includes('M')) {
        const standardMonth = rawMonth.replace('M', '-');
        metalPricesMap[standardMonth] = {};

        for (const [wbKey, jsonKey] of Object.entries(METAL_MAPPING)) {
          if (row[wbKey] !== undefined && row[wbKey] !== '' && row[wbKey] !== '..') {
            metalPricesMap[standardMonth][jsonKey] = parseFloat(row[wbKey]);
          }
        }
      }
    });

    console.log('Reading fxData.json...');
    const jsonContent = await fs.readFile(JSON_PATH, 'utf-8');
    const data = JSON.parse(jsonContent);

    if (!data.monthlyPrices || !Array.isArray(data.monthlyPrices)) {
      throw new Error('Invalid fxData.json structure.');
    }

    let updatedCount = 0;
    data.monthlyPrices.forEach(item => {
      const prices = metalPricesMap[item.month];
      if (prices) {
        const usdRate = item.value.USD;
        if (usdRate) {
          // Clean up obsolete keys
          OBSOLETE_KEYS.forEach(key => delete item.value[key]);

          // Update each metal price, converting USD to ETB
          for (const [key, usdPrice] of Object.entries(prices)) {
            item.value[key] = usdPrice * usdRate;
          }
          updatedCount++;
        }
      }
    });

    console.log(`Updated ${updatedCount} entries with multi-metal prices.`);

    await fs.writeFile(JSON_PATH, JSON.stringify(data, null, 2));
    console.log('Successfully updated fxData.json with metals from World Bank.');

  } catch (error) {
    console.error('Error syncing metals data:', error.message);
    process.exit(1);
  }
}

syncMetals();

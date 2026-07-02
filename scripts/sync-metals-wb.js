import axios from 'axios';
import * as XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WB_URL = 'https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Monthly.xlsx';
const JSON_PATH = path.join(__dirname, '../src/features/fxcompare/fxData.json');

// Mapping from WB Column names (lowercase) to our JSON keys
const METAL_MAPPING = {
  'gold': 'XAU',
  'silver': 'XAG',
  'platinum': 'XPT',
  'copper': 'XCU',
  'lead': 'XPB',
  'tin': 'XSN',
  'nickel': 'XNI',
  'zinc': 'ZNC'
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
    const range = XLSX.utils.decode_range(sheet['!ref']);
    
    // Map lowercase column header names on row index 4 to column indices
    const headerRowIdx = 4;
    const colMap = {};
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: headerRowIdx, c })];
      if (cell && cell.v) {
        const headerName = String(cell.v).trim().toLowerCase();
        if (METAL_MAPPING[headerName] !== undefined) {
          colMap[c] = METAL_MAPPING[headerName];
        }
      }
    }

    // Create a map of Month -> Metal Prices
    const metalPricesMap = {};
    let parsedCount = 0;
    
    // Row 6 (index 6) onwards is actual monthly data
    for (let r = 6; r <= range.e.r; r++) {
      const monthCell = sheet[XLSX.utils.encode_cell({ r, c: 0 })];
      if (!monthCell || !monthCell.v) continue;
      
      const rawMonth = String(monthCell.v).trim();
      if (rawMonth.includes('M')) {
        const standardMonth = rawMonth.replace('M', '-');
        metalPricesMap[standardMonth] = {};
        parsedCount++;

        for (const [colIdx, jsonKey] of Object.entries(colMap)) {
          const valCell = sheet[XLSX.utils.encode_cell({ r, c: parseInt(colIdx) })];
          if (valCell && valCell.v !== undefined && valCell.v !== '' && valCell.v !== '..') {
            metalPricesMap[standardMonth][jsonKey] = parseFloat(valCell.v);
          }
        }
      }
    }

    console.log(`Parsed ${parsedCount} months of commodity data.`);

    console.log('Reading fxData.json...');
    const jsonContent = await fs.readFile(JSON_PATH, 'utf-8');
    const data = JSON.parse(jsonContent);

    if (!data.monthlyPrices || !Array.isArray(data.monthlyPrices)) {
      throw new Error('Invalid fxData.json structure.');
    }

    let updatedCount = 0;
    data.monthlyPrices.forEach(item => {
      const prices = metalPricesMap[item.month];
      if (prices && Object.keys(prices).length > 0) {
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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../src/features/fxcompare/fxData.json');
const API_URL = 'https://ethioblackmarket.com/api/price-history-range';

// Load environment variables from .env or .env.local if they exist
const loadEnv = () => {
  for (const envFile of ['.env', '.env.local']) {
    try {
      const envPath = path.join(__dirname, `../${envFile}`);
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const parts = trimmed.split('=');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
              process.env[key] = value;
            }
          }
        });
      }
    } catch (e) {
      console.warn(`Could not load environment variables from ${envFile}:`, e.message);
    }
  }
};
loadEnv();

// Telegram Wallet P2P parameters
const WALLET_API_KEY = process.env.VITE_TELEGRAM_WALLET_API_KEY || process.env.TELEGRAM_WALLET_API_KEY;
const WALLET_P2P_URL = "https://p2p.walletbot.me/p2p/integration-api/v1/item/online";
const STANDARD_RATES_URL = "https://open.er-api.com/v6/latest/USD";

const CURRENCIES = [
  "USD", "EUR", "CHF", "CAD", "AUD", "CNY", "GBP", "SEK", "KWD", "AED",
  "SAR", "QAR", "OMR", "JOD", "BHD", "TRY", "EGP", "YER", "ILS", "INR", "PKR"
];

// Helper to wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTelegramP2PAverageSell() {
  console.log("Fetching ETB/USDT selling advertisements from Telegram Wallet P2P...");
  try {
    const response = await fetch(WALLET_P2P_URL, {
      method: "POST",
      headers: {
        "X-API-Key": WALLET_API_KEY,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cryptoCurrency: "USDT",
        fiatCurrency: "ETB",
        side: "SELL",
        page: 1,
        pageSize: 5
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    if (result.status === "SUCCESS" && Array.isArray(result.data) && result.data.length > 0) {
      const prices = result.data.map(ad => parseFloat(ad.price));
      const sum = prices.reduce((a, b) => a + b, 0);
      const average = sum / prices.length;
      console.log(`Successfully fetched ${prices.length} ETB/USDT ads. Average rate: ${average}`);
      return average;
    } else {
      throw new Error(result.message || "Failed request or no active advertisements");
    }
  } catch (e) {
    console.error("Could not fetch live P2P rates. Falling back to the calculated average: 184.01916531845873");
    return 184.01916531845873;
  }
}

const EG_CURRENCY_URL = "https://egcurrency.com/en/currency/ETB/blackMarket";

async function fetchEgCurrencyBlackMarketRates() {
  console.log("Fetching ETB black market rates from EG Currency: " + EG_CURRENCY_URL);
  try {
    const response = await fetch(EG_CURRENCY_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const egRates = {};
    
    $('tbody.list tr').each((i, el) => {
      const href = $(el).attr('data-href') || $(el).find('a').attr('href') || '';
      const match = href.match(/\/currency\/([A-Z0-9]+)-to-ETB/i);
      if (match) {
        const currencyCode = match[1].toUpperCase();
        const tds = $(el).find('td');
        if (tds.length >= 3) {
          const buyText = $(tds[1]).text().trim().replace(/,/g, '');
          const sellText = $(tds[2]).text().trim().replace(/,/g, '');
          const buy = parseFloat(buyText);
          const sell = parseFloat(sellText);
          if (!isNaN(buy) && !isNaN(sell)) {
            egRates[currencyCode] = (buy + sell) / 2;
          } else if (!isNaN(buy)) {
            egRates[currencyCode] = buy;
          } else if (!isNaN(sell)) {
            egRates[currencyCode] = sell;
          }
        }
      }
    });
    
    console.log(`Successfully fetched rates for ${Object.keys(egRates).length} currencies from EG Currency.`);
    return egRates;
  } catch (e) {
    console.error("Could not fetch rates from EG Currency:", e.message);
    return null;
  }
}

async function fetchStandardExchangeRates() {
  console.log("Fetching standard USD exchange rates...");
  try {
    const response = await fetch(STANDARD_RATES_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data && data.rates) {
      console.log("Successfully fetched standard exchange rates.");
      return data.rates;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (e) {
    console.error("Could not fetch standard rates. Falling back to hardcoded 2026-05 snapshot.");
    return {
      "USD": 1,
      "EUR": 0.861192,
      "CHF": 0.788225,
      "CAD": 1.37496,
      "AUD": 1.400106,
      "CNY": 6.81196,
      "GBP": 0.745128,
      "SEK": 9.356571,
      "KWD": 0.308387,
      "AED": 3.6725,
      "SAR": 3.75,
      "QAR": 3.64,
      "OMR": 0.384497,
      "JOD": 0.709,
      "BHD": 0.376,
      "TRY": 45.630414,
      "EGP": 53.390402,
      "YER": 238.391242,
      "ILS": 2.908503,
      "INR": 96.824379,
      "PKR": 279.02519
    };
  }
}

async function syncFxData() {
    console.log('Initiating premium Telegram-based FX data sync...');
    try {
        let existingData = { monthlyPrices: [] };
        if (fs.existsSync(DATA_FILE)) {
            try {
                existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            } catch (e) {
                console.warn('Could not parse existing data file, starting fresh.');
            }
        }

        // 1. Fetch historical data from the old API (up to 2026-04)
        console.log('Fetching historical FX data from', API_URL);
        const historyResponse = await fetch(API_URL);
        if (!historyResponse.ok) {
            throw new Error(`HTTP error! status: ${historyResponse.status}`);
        }
        const historyData = await historyResponse.json();
        
        // Merge historical prices but only for months BEFORE 2026-05
        const mergedMonthlyPrices = [...existingData.monthlyPrices];
        let addedCount = 0;
        let updatedCount = 0;

        historyData.monthlyPrices.forEach(newItem => {
            // ONLY accept historical data for months before 2026-05
            if (newItem.month >= '2026-05') {
                return;
            }
            
            const idx = mergedMonthlyPrices.findIndex(oldItem => oldItem.month === newItem.month);
            if (idx === -1) {
                mergedMonthlyPrices.push(newItem);
                addedCount++;
            } else {
                const oldItem = mergedMonthlyPrices[idx];
                const updatedItem = { 
                    ...oldItem,
                    value: { ...oldItem.value }
                };
                let hasChanges = false;

                for (let key in newItem) {
                    if (newItem[key] !== null && newItem[key] !== undefined) {
                        if (key === 'value') {
                            for (let currKey in newItem.value) {
                                if (updatedItem.value[currKey] !== newItem.value[currKey]) {
                                    updatedItem.value[currKey] = newItem.value[currKey];
                                    hasChanges = true;
                                }
                            }
                        } else {
                            if (updatedItem[key] !== newItem[key]) {
                                updatedItem[key] = newItem[key];
                                hasChanges = true;
                            }
                        }
                    }
                }

                if (hasChanges) {
                    mergedMonthlyPrices[idx] = updatedItem;
                    updatedCount++;
                }
            }
        });

        // 2. Fetch live data for current month (2026-05 onwards)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const targetMonth = `${year}-${month}`;

        const standardRates = await fetchStandardExchangeRates();
        const newMonthRates = {};

        if (targetMonth >= '2026-06') {
            console.log(`Using EG Currency black market rate sync for ${targetMonth}...`);
            const egRates = await fetchEgCurrencyBlackMarketRates();
            if (egRates && Object.keys(egRates).length > 0) {
                const usdEtbRate = egRates['USD'] || 190.0;
                CURRENCIES.forEach(currency => {
                    if (egRates[currency] !== undefined) {
                        newMonthRates[currency] = egRates[currency];
                    } else {
                        // Estimate missing currency using USD/ETB black market rate and standard global rate
                        const ratePerUsd = standardRates[currency];
                        if (ratePerUsd) {
                            newMonthRates[currency] = usdEtbRate / ratePerUsd;
                            console.log(`Estimated missing black market rate for ${currency}: ${newMonthRates[currency]} ETB (via USD conversion)`);
                        } else {
                            console.warn(`Standard rate for missing currency ${currency} is not available. Skipping.`);
                        }
                    }
                });
            } else {
                console.warn("EG Currency rates empty, falling back to Telegram P2P rate conversion logic...");
                const averageEtbUsdtSell = await fetchTelegramP2PAverageSell();
                CURRENCIES.forEach(currency => {
                    const ratePerUsd = standardRates[currency];
                    if (ratePerUsd) {
                        newMonthRates[currency] = (1 / ratePerUsd) * averageEtbUsdtSell;
                    }
                });
            }
        } else {
            console.log(`Using Telegram P2P rate sync for ${targetMonth}...`);
            const averageEtbUsdtSell = await fetchTelegramP2PAverageSell();
            CURRENCIES.forEach(currency => {
                const ratePerUsd = standardRates[currency];
                if (ratePerUsd) {
                    newMonthRates[currency] = (1 / ratePerUsd) * averageEtbUsdtSell;
                }
            });
        }

        const targetMonthIdx = mergedMonthlyPrices.findIndex(m => m.month === targetMonth);
        
        if (targetMonthIdx === -1) {
            mergedMonthlyPrices.push({
                month: targetMonth,
                value: newMonthRates
            });
            addedCount++;
            console.log(`Created new entry for ${targetMonth}.`);
        } else {
            const existingEntry = mergedMonthlyPrices[targetMonthIdx];
            const updatedValue = { ...existingEntry.value, ...newMonthRates };
            
            mergedMonthlyPrices[targetMonthIdx] = {
                month: targetMonth,
                value: updatedValue
            };
            updatedCount++;
            console.log(`Updated entry for ${targetMonth} (preserving other commodity keys).`);
        }

        // Sort by month (YYYY-MM) ascending
        mergedMonthlyPrices.sort((a, b) => a.month.localeCompare(b.month));

        // Use the metadata structure from the original dataset
        const finalData = { 
            earliest: existingData.earliest || 1672775224, 
            latest: Math.floor(now.getTime() / 1000), 
            monthlyPrices: mergedMonthlyPrices 
        };
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(finalData, null, 2));
        
        console.log(`Premium Sync complete!`);
        console.log(`- New months added/synced: ${addedCount}`);
        console.log(`- Existing months updated/synced: ${updatedCount}`);
        console.log(`- Total records now: ${mergedMonthlyPrices.length}`);
        
    } catch (error) {
        console.error('Failed premium Telegram FX sync:', error);
        process.exit(1);
    }
}

syncFxData();

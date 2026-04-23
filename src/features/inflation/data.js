import inflationData from './data.json';

// Historical inflation rates for Ethiopia (1966-2025+)
// Source: https://www.worlddata.info/africa/ethiopia/inflation-rates.php
export const INFLATION_DATA = inflationData;

export const MIN_YEAR = INFLATION_DATA[0].year;
export const MAX_YEAR = INFLATION_DATA[INFLATION_DATA.length - 1].year;
export const FORECAST_END = 2050;

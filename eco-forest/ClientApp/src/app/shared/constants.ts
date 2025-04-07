// constants.ts
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens, interpolateYlOrRd, interpolateBlues, interpolateYlGn, interpolateGreys } from 'd3-scale-chromatic';

export const GEOJSON_FILE_PATH = '../../../assets/datasets/ne_110m_admin_0_countries.geojson';

export const API_LINKS: Record<string, string> = {
    'renewable-energy': 'http://localhost:5085/api/renewableenergy/aggregated',
    'income-loss': 'http://localhost:5085/api/incomeloss/aggregated',
    'climate-disasters': 'http://localhost:5085/api/climatedisasters/aggregated',
    'greenhouse-emissions': 'http://localhost:5085/api/greenhouseemissions/aggregated',
    'forest-carbon': 'http://localhost:5085/api/forestcarbon/aggregated',       
  };
  
export const API_YEAR_RANGE = {
    'renewable-energy': { min: 2000, max: 2023 },
    'income-loss': { min: 2000, max: 2025 },
    'climate-disasters': { min: 1980, max: 2024 },
    'greenhouse-emissions': { min: 1990, max: 2025 },
    'forest-carbon': { min: 1990, max: 2025 },
};

export const INDICATOR_TYPES = [
    'Fossil Fuels',
    'Solar Energy',
    'Wind Energy',
    'Hydropower (excl. Pumped Storage)',
    'Bioenergy'
  ]; 

export const ENERGY_TYPE_COLORS: Record<string, (domain: [number, number]) => any> = {
    'Fossil Fuels': (domain) => scaleSequentialSqrt(interpolateYlOrRd).domain(domain),
    'Solar Energy': (domain) => scaleSequentialSqrt(() => interpolateYlGn).domain(domain), // Yellow
    'Wind Energy': (domain) => scaleSequentialSqrt(() => interpolateGreys).domain(domain), // Grey
    'Hydropower (excl. Pumped Storage)': (domain) => scaleSequentialSqrt(interpolateBlues).domain(domain), // Blue
    'Bioenergy': (domain) => scaleSequentialSqrt(interpolateGreens).domain(domain), // Green
  };
  

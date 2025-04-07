// constants.ts
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens, interpolateYlOrRd, interpolateBlues, interpolateYlGn, interpolateGreys } from 'd3-scale-chromatic';


export const ENERGY_TYPE_COLORS: Record<string, (domain: [number, number]) => any> = {
    'Fossil Fuels': (domain) => scaleSequentialSqrt(interpolateYlOrRd).domain(domain),
    'Solar Energy': (domain) => scaleSequentialSqrt(() => interpolateYlGn).domain(domain), // Yellow
    'Wind Energy': (domain) => scaleSequentialSqrt(() => interpolateGreys).domain(domain), // Grey
    'Hydropower (excl. Pumped Storage)': (domain) => scaleSequentialSqrt(interpolateBlues).domain(domain), // Blue
    'Bioenergy': (domain) => scaleSequentialSqrt(interpolateGreens).domain(domain), // Green
  };
  
  export const API_LINKS: Record<string, string> = {
    'renewable-energy': 'http://localhost:5085/api/renewableenergy/aggregated',
    'income-loss': 'http://localhost:5085/api/incomeloss/aggregated',
    'climate-disasters': 'http://localhost:5085/api/climatedisasters/aggregated',
    'greenhouse-emissions': 'http://localhost:5085/api/greenhouseemissions/aggregated',
    'forest-carbon': 'http://localhost:5085/api/forestcarbon/aggregated',       
  };
  
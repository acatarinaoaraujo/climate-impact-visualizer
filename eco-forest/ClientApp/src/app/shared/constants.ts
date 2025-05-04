// constants.ts
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateGreens, interpolateYlOrRd, interpolateBlues, interpolateYlGn, interpolateGreys, interpolateGnBu, interpolateYlGnBu, interpolateCividis, interpolateMagma, interpolateWarm, interpolateYlOrBr, interpolateInferno, interpolateSpectral, interpolateSinebow, interpolatePlasma } from 'd3-scale-chromatic';

export const GEOJSON_FILE_PATH = '../../../assets/datasets/ne_110m_admin_0_countries.geojson';

export const API_LINKS: Record<string, string> = {
    'renewable-energy': 'http://localhost:5085/api/renewableenergy/aggregated',
    'income-loss': 'http://localhost:5085/api/incomeloss/aggregated',
    'climate-disasters': 'http://localhost:5085/api/climatedisasters/aggregated',
    'greenhouse-emissions': 'http://localhost:5085/api/emissions/aggregated',
    'forest-carbon': 'http://localhost:5085/api/forestcarbon/aggregated',       
  };
  
type ApiType = 'renewable-energy' | 'income-loss' | 'climate-disasters' | 'greenhouse-emissions' | 'forest-carbon';

  export const API_YEAR_RANGE: Record<ApiType, { min: number; max: number }> = {
    'renewable-energy': { min: 2000, max: 2023 },
    'income-loss': { min: 2023, max: 2040 },
    'climate-disasters': { min: 1980, max: 2024 },
    'greenhouse-emissions': { min: 1995, max: 2021 },
    'forest-carbon': { min: 1992, max: 2022 },
};

export const ENERGY_TYPES = [
    'Fossil Fuels',
    'Solar Energy',
    'Wind Energy',
    'Hydropower (excl. Pumped Storage)',
    'Bioenergy'
  ]; 

  export const FOREST_TYPES = [
    'Share Of Forest Area',
    'Carbon Stocks In Forests',
    'Index Of Forest Extent',
    'Index Of Carbon Stocks In Forests',
  ];

export const DISASTER_TYPES = [
    'Drought',
    'Flood',
    'Landslide',
    'Storm',
    'Wildfire'
  ];

export const EMISSIONS_TYPES = [
    'Production',
    'Gross Imports',
    'Gross Exports',
    'Final Domestic Demand'
  ];

export const INCOME_TYPES = [
    'Acute Climate Damages',
    'Business Confidence Losses',
    'Chronic Climate Damages',
    'Mitigation Policy Costs',
    'Total GDP Risk'
  ];


export const ENERGY_TYPE_COLORS: Record<string, (domain: [number, number]) => any> = {
    'Fossil Fuels': (domain) => scaleSequentialSqrt(interpolateYlOrRd).domain(domain),
    'Solar Energy': (domain) => scaleSequentialSqrt(interpolateYlOrBr).domain(domain), // Yellow
    'Wind Energy': (domain) => scaleSequentialSqrt(interpolateGreys).domain(domain), // Grey
    'Hydropower (excl. Pumped Storage)': (domain) => scaleSequentialSqrt(interpolateBlues).domain(domain), // Blue
    'Bioenergy': (domain) => scaleSequentialSqrt(interpolateGreens).domain(domain), // Green
  };

export const DISASTER_TYPE_COLORS: Record<string, (domain: [number, number]) => any> = {
    'Drought': (domain) => scaleSequentialSqrt(interpolateYlOrRd).domain(domain),
    'Flood': (domain) => scaleSequentialSqrt(interpolateGreys).domain(domain), // Grey
    'Landslide': (domain) => scaleSequentialSqrt(interpolateBlues).domain(domain), // Blue
    'Storm': (domain) => scaleSequentialSqrt(interpolateGreens).domain(domain), // Green
    'Wildfire': (domain) => scaleSequentialSqrt(interpolateYlOrRd).domain(domain), //  Red
  };

export const EMISSIONS_TYPE_COLORS: Record<string, (domain: [number, number]) => any> = {
    'Production': (domain) => scaleSequentialSqrt(interpolateYlOrRd).domain(domain),
    'Gross Imports': (domain) => scaleSequentialSqrt(interpolateYlGn).domain(domain), // Yellow
    'Gross Exports': (domain) => scaleSequentialSqrt(interpolateGreys).domain(domain), // Grey
    'Final Domestic Demand': (domain) => scaleSequentialSqrt(interpolateBlues).domain(domain), // Blue
  };

export const FOREST_TYPE_COLORS: Record<string, (domain: [number, number]) => any> = {
    'Share Of Forest Area': (domain) => scaleSequentialSqrt(interpolateGnBu).domain(domain),
    'Carbon Stocks In Forests': (domain) => scaleSequentialSqrt(interpolateYlGn).domain(domain), // Yellow
    'Index Of Forest Extent': (domain) => scaleSequentialSqrt( interpolateGreys).domain(domain), // Grey
    'Index Of Carbon Stocks In Forests': (domain) => scaleSequentialSqrt(interpolateBlues).domain(domain), // Blue
  };

  export const INCOME_TYPE_COLORS: Record<string, (domain: [number, number]) => any> = {
    'Acute Climate Damages': (domain) => scaleSequentialSqrt(interpolateYlOrRd).domain(domain.reverse()), // Reverse the domain
    'Business Confidence Losses': (domain) => scaleSequentialSqrt(interpolateGreys).domain(domain.reverse()), // Grey
    'Chronic Climate Damages': (domain) => scaleSequentialSqrt(interpolateYlOrBr).domain(domain.reverse()), // Blue
    'Mitigation Policy Costs': (domain) => scaleSequentialSqrt(interpolatePlasma).domain(domain.reverse()), // Green
    'Total GDP Risk': (domain) => scaleSequentialSqrt(interpolateYlOrRd).domain(domain.reverse()), // Red
  };
  

export const INDICATOR_UNITS: Record<string, string> = {
    'Fossil Fuels': 'GWh',
    'Solar Energy': 'GWh',
    'Wind Energy': 'GWh',
    'Hydropower (excl. Pumped Storage)': 'GWh',
    'Bioenergy': 'GWh',
    'Drought': '',
    'Earthquake': '',
    'Flood': '',
    'Landslide': '',
    'Storm': '',
    'Wildfire': '',
    'Production': 'Million Tonnes',
    'Gross Imports': 'Million Tonnes',
    'Gross Exports': 'Million Tonnes',
    'Final Domestic Demand': 'Million Tonnes',
    'Share Of Forest Area': '%',
    'Carbon Stocks In Forests': 'Million Tonnes',
    'Index Of Forest Extent': 'Index',
    'Carbon Stocks In Forests Index': 'Index',
    'Acute Climate Damages': '%',
    'Business Confidence Losses': '%',
    'Chronic Climate Damages': '%',
    'Mitigation Policy Costs': '%',
    'Total GDP Risk': '%',
  };


  

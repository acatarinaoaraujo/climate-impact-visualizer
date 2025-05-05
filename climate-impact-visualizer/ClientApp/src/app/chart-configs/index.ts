import { ChartConfiguration } from 'chart.js';
import { renewableEnergy } from './renewable-energy';
import { greenhouseEmissions } from './greenhouse-emissions';
import { climateDisasters } from './climate-disasters';
import { forestCarbon } from './forest-carbon';
import { incomeLoss } from './income-loss';

export const chartConfigMap: {
  [apiType: string]: {
    [indicatorType: string]: {
      data: any;
      type: ChartConfiguration['type'];
      options?: ChartConfiguration['options'];
    };
  };
} = {
  'renewable-energy': renewableEnergy,
  'greenhouse-emissions': greenhouseEmissions,
  'climate-disasters': climateDisasters,
  'forest-carbon': forestCarbon,
  'income-loss': incomeLoss
};

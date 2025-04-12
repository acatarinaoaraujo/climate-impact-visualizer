import { ChartConfiguration } from 'chart.js';

export const renewableEnergy: {
  [indicatorType: string]: {
    data: any;
    type: ChartConfiguration['type'];
    options?: ChartConfiguration['options'];
  };
} = {
  'Fossil Fuels': {
    type: 'bar',
    data: {
      labels: ['Afghanistan, Islamic Rep. of'],
      datasets: [{
        data: [61.4],
        backgroundColor: ['#fdd835']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  },
  'Solar Energy': {
    type: 'doughnut',
    data: {
      labels: ['Solar', 'Wind', 'Hydro', 'Biomass', 'Geothermal'],
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: ['#fdd835', '#64b5f6', '#81c784', '#a1887f', '#ff8a65']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  }
};

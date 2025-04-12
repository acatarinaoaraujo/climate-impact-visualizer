import { ChartConfiguration } from 'chart.js';

export const greenhouseEmissions: {
  [indicatorType: string]: {
    data: any;
    type: ChartConfiguration['type'];
    options?: ChartConfiguration['options'];
  };
} = {
  'CO2 Emissions': {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'CO2 Emissions',
        data: [120, 130, 125],
        borderColor: '#ef5350',
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  }
};

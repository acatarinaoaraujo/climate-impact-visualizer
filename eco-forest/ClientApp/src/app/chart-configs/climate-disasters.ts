import { ChartConfiguration } from 'chart.js';

export const climateDisasters: {
  [indicatorType: string]: {
    data: any;
    type: ChartConfiguration['type'];
    options?: ChartConfiguration['options'];
  };
} = {
  'Hurricane Impact': {
    type: 'bar',
    data: {
      labels: ['2021', '2022'],
      datasets: [{
        label: 'Damage ($B)',
        data: [50, 60],
        backgroundColor: ['#ff5722']
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

import { ChartConfiguration } from 'chart.js';

export const forestCarbon: {
  [indicatorType: string]: {
    data: any;
    type: ChartConfiguration['type'];
    options?: ChartConfiguration['options'];
  };
} = {
  'Share Of Forest Area': {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Share of Forest Area (%)',
        data: [30, 32, 34],
        borderColor: '#2e7d32',
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `${tooltipItem.raw}% of total land area`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2
          }
        }
      }
    }
  },
  'Carbon Stocks In Forests': {
    type: 'bar',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Carbon Stocks in Forests (Gt)',
        data: [50, 52, 55],
        backgroundColor: '#81c784'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `${tooltipItem.raw} Gt of carbon`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  },
  'Index Of Forest Extent': {
    type: 'radar',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Forest Extent Index',
        data: [70, 72, 74],
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        borderColor: '#3f51b5',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        r: {
          beginAtZero: true
        }
      }
    }
  },
  'Index Of Carbon Stocks In Forests': {
    type: 'doughnut',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Carbon Stocks Index',
        data: [55, 58, 60],
        backgroundColor: ['#4caf50', '#ffeb3b', '#f44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw} index points`
          }
        }
      }
    }
  }
};

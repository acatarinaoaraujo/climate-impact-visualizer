import { ChartConfiguration } from 'chart.js';

export const greenhouseEmissions: {
  [indicatorType: string]: {
    data: any;
    type: ChartConfiguration['type'];
    options?: ChartConfiguration['options'];
  };
} = {
  'Production': {
    type: 'bar',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Production (Mt)',
        data: [150, 160, 155],
        backgroundColor: '#4caf50'
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
            label: (tooltipItem: any) => `${tooltipItem.raw} Mt produced`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10
          }
        }
      }
    }
  },
  'Gross Imports': {
    type: 'bar',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Gross Imports (Mt)',
        data: [50, 55, 60],
        backgroundColor: '#ff9800'
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
            label: (tooltipItem: any) => `${tooltipItem.raw} Mt imported`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        }
      }
    }
  },
  'Gross Exports': {
    type: 'bar',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Gross Exports (Mt)',
        data: [40, 45, 50],
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
            label: (tooltipItem: any) => `${tooltipItem.raw} Mt exported`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        }
      }
    }
  },
  'Final Domestic Demand': {
    type: 'pie',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Final Domestic Demand (Mt)',
        data: [100, 110, 105],
        backgroundColor: ['#64b5f6', '#ffeb3b', '#f44336']
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
            label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw} Mt`
          }
        }
      }
    }
  }
};

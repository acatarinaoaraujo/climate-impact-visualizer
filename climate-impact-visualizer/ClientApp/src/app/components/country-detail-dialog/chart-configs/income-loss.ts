import { ChartConfiguration } from 'chart.js';

export const incomeLoss: {
  [indicatorType: string]: {
    data: any;
    type: ChartConfiguration['type'];
    options?: ChartConfiguration['options'];
  };
} = {
  'Acute Climate Damages': {
    type: 'bar', // changed to 'bar'
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Acute Climate Damages ($B)',
        data: [200, 250, 300],
        backgroundColor: '#f44336'
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
            label: (tooltipItem: any) => `$${tooltipItem.raw} billion`
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
  'Business Confidence Losses': {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Business Confidence Losses (%)',
        data: [15, 20, 25],
        borderColor: '#ff9800',
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
            label: (tooltipItem: any) => `${tooltipItem.raw}% loss`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5
          }
        }
      }
    }
  },
  'Chronic Climate Damages': {
    type: 'bar', // changed to 'bar'
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Chronic Climate Damages ($B)',
        data: [100, 120, 150],
        backgroundColor: '#2196f3'
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
            label: (tooltipItem: any) => `$${tooltipItem.raw} billion`
          }
        }
      },
      scales: {
        y: {
          stacked: true, // enables stacking
          beginAtZero: true
        }
      }
    }
  },
  'Mitigation Policy Costs': {
    type: 'radar',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Mitigation Policy Costs ($B)',
        data: [50, 75, 100],
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
  'Total GDP Risk': {
    type: 'doughnut',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Total GDP Risk (%)',
        data: [5, 7, 9],
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
            label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw}% of GDP`
          }
        }
      }
    }
  }
};

import { ChartConfiguration, ChartTypeRegistry } from 'chart.js';

export const climateDisasters: {
  [indicatorType: string]: {
    data: any;
    type: keyof ChartTypeRegistry;
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
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `$${tooltipItem.raw} Billion`
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
  'Drought': {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022', '2023'],
      datasets: [{
        label: 'Impact Severity (Scale 1-10)',
        data: [6, 7, 9, 8],
        fill: false,
        borderColor: '#fdd835',
        tension: 0.3,
        borderWidth: 2
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
            label: (tooltipItem: any) => `Severity: ${tooltipItem.raw}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  },
  'Flood': {
    type: 'radar',
    data: {
      labels: ['2020', '2021', '2022', '2023'],
      datasets: [{
        label: 'Flood Impact (Scale 1-10)',
        data: [4, 6, 8, 7],
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        borderColor: '#42a5f5',
        borderWidth: 2
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
            label: (tooltipItem: any) => `Impact: ${tooltipItem.raw}`
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  },
  'Landslide': {
    type: 'pie',
    data: {
      labels: ['Minor', 'Moderate', 'Severe', 'Extreme'],
      datasets: [{
        label: 'Landslide Frequency',
        data: [30, 40, 20, 10],
        backgroundColor: ['#ffeb3b', '#ff9800', '#f44336', '#d32f2f'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw}%`
          }
        }
      }
    }
  },
  'Storm': {
    type: 'bar', // Use 'bar' instead of 'horizontalBar'
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Storm Intensity (Scale 1-10)',
        data: [7, 8, 9],
        backgroundColor: '#4caf50'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `Intensity: ${tooltipItem.raw}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  },
  'Wildfire': {
    type: 'bubble',
    data: {
      labels: ['2020', '2021', '2022'],
      datasets: [{
        label: 'Wildfire Occurrence',
        data: [
          { x: 2020, y: 50, r: 10 },
          { x: 2021, y: 70, r: 15 },
          { x: 2022, y: 90, r: 20 }
        ],
        backgroundColor: '#d32f2f',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `Wildfires: ${tooltipItem.raw.y} incidents`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  }
};


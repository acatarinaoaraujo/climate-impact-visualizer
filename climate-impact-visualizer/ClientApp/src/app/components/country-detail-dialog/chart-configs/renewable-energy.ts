import { ChartConfiguration } from 'chart.js';

/* Fossil Fuels, Solar Energy, Wind Energy, Hydropower (excl. Pumped Storage), Bioenergy. */

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
        backgroundColor: ['#fdd835'],
        borderColor: '#f57f17',
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
            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10
          },
          grid: {
            color: '#e0e0e0'
          }
        },
        x: {
          grid: {
            color: '#e0e0e0'
          }
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
        backgroundColor: ['#fdd835', '#64b5f6', '#81c784', '#a1887f', '#ff8a65'],
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
            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
          }
        }
      }
    }
  },
  'Wind Energy': {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      datasets: [{
        data: [10, 20, 30, 40, 50],
        label: 'Wind Energy Production',
        fill: true,
        borderColor: '#64b5f6',
        backgroundColor: 'rgba(100, 181, 246, 0.2)',
        tension: 0.4,
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
            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} MW`
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
  'Hydropower (excl. Pumped Storage)': {
    type: 'radar',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      datasets: [{
        data: [40, 45, 50, 55, 60],
        label: 'Hydropower Growth',
        backgroundColor: 'rgba(129, 195, 132, 0.2)',
        borderColor: '#81c784',
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
            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} MW`
          }
        }
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20
          }
        }
      }
    }
  },
  'Bioenergy': {
    type: 'pie',
    data: {
      labels: ['Wood Biomass', 'Agricultural Residues', 'Animal Waste', 'Other Biomass'],
      datasets: [{
        data: [40, 30, 20, 10],
        backgroundColor: ['#8d6e63', '#a1887f', '#ffb74d', '#ff7043'],
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
            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
          }
        }
      }
    }
  }
};

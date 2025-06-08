import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement, // Added for scatter plots
  LineElement,  // Added for scatter plots
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2'; // Added Scatter

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement, // Added
  LineElement,  // Added
  Title,
  Tooltip,
  Legend
);

const PrngChart = ({ data, type, title }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No data to display for the chart.</p>;
  }

  let chartData;
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#e5e7eb' // text-gray-200
        }
      },
      title: {
        display: true,
        text: title || 'PRNG Output Distribution',
        color: '#e5e7eb', // text-gray-200
        font: {
            size: 16
        }
      },
      tooltip: {
        backgroundColor: '#374151', // bg-gray-700
        titleColor: '#e5e7eb',
        bodyColor: '#e5e7eb',
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#d1d5db', // text-gray-300
        },
        grid: {
          color: '#4b5563' // bg-gray-600
        }
      },
      y: {
        ticks: {
          color: '#d1d5db', // text-gray-300
        },
        grid: {
          color: '#4b5563' // bg-gray-600
        },
        beginAtZero: true
      }
    }
  };

  if (type === 'histogram') {
    // For LCG: Create a simple histogram
    const valueCounts = {};
    let minVal = data[0], maxVal = data[0];
    data.forEach(val => {
      valueCounts[val] = (valueCounts[val] || 0) + 1;
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    });

    // Determine number of bins (simplified approach)
    const uniqueValues = Object.keys(valueCounts).length;
    const numBins = Math.min(10, uniqueValues); // Max 10 bins or number of unique values

    if (uniqueValues === 0) return <p className="text-center text-gray-500 mt-4">Not enough data diversity for histogram.</p>;

    const binSize = numBins > 0 ? Math.max(1, Math.ceil((maxVal - minVal + 1) / numBins)) : 1;
    const bins = {};

    for (let i = 0; i < numBins; i++) {
        const binStart = minVal + i * binSize;
        const binEnd = binStart + binSize -1;
        bins[`${binStart}-${binEnd}`] = 0;
    }
    if(numBins === 0 && uniqueValues > 0) { // Handle case with very few unique values
        Object.keys(valueCounts).sort((a,b) => Number(a) - Number(b)).forEach(val => {
            bins[val] = valueCounts[val];
        });
    } else {
        data.forEach(val => {
            for (let i = 0; i < numBins; i++) {
                const binStart = minVal + i * binSize;
                const binEnd = binStart + binSize - 1;
                if (val >= binStart && val <= binEnd) {
                    bins[`${binStart}-${binEnd}`]++;
                    break;
                }
            }
        });
    }

    chartData = {
      labels: Object.keys(bins),
      datasets: [
        {
          label: 'Frequency',
          data: Object.values(bins),
          backgroundColor: 'rgba(20, 184, 166, 0.6)', // teal-600 with opacity
          borderColor: 'rgba(13, 148, 136, 1)', // teal-700
          borderWidth: 1,
        },
      ],
    };
  } else if (type === 'bit_distribution') {
    // For BBS: Count 0s and 1s
    const counts = { '0': 0, '1': 0 };
    data.forEach(bit => {
      counts[bit.toString()]++;
    });
    chartData = {
      labels: ['0s', '1s'],
      datasets: [
        {
          label: 'Bit Count',
          data: [counts['0'], counts['1']],
          backgroundColor: [
            'rgba(236, 72, 153, 0.6)', // pink-500 with opacity
            'rgba(168, 85, 247, 0.6)', // purple-500 with opacity
          ],
          borderColor: [
            'rgba(219, 39, 119, 1)', // pink-600
            'rgba(147, 51, 234, 1)', // purple-600
          ],
          borderWidth: 1,
        },
      ],
    };
  } else if (type === 'scatter_lcg') {
    // For LCG: Scatter plot of X_n vs X_{n+1}
    if (data.length < 2) {
      return <p className="text-center text-gray-500 mt-4">Not enough data for scatter plot (need at least 2 points).</p>;
    }
    const scatterData = [];
    for (let i = 0; i < data.length - 1; i++) {
      scatterData.push({ x: data[i], y: data[i+1] });
    }
    chartData = {
      datasets: [
        {
          label: 'X_n vs X_{n+1}',
          data: scatterData,
          backgroundColor: 'rgba(59, 130, 246, 0.6)', // blue-500 with opacity
          borderColor: 'rgba(37, 99, 235, 1)', // blue-600
          pointRadius: 5,
        },
      ],
    };
    // Specific options for scatter plot if needed, e.g., axis labels
    options.scales.x.title = {
        display: true,
        text: 'X_n',
        color: '#d1d5db',
    };
    options.scales.y.title = {
        display: true,
        text: 'X_{n+1}',
        color: '#d1d5db',
    };
  }

  return (
    <div className="relative p-6 bg-gray-850 rounded-lg shadow-lg" style={{height: '400px'}}>
        {chartData && type === 'scatter_lcg' ? <Scatter options={options} data={chartData} /> :
         chartData ? <Bar options={options} data={chartData} /> : 
         <p className="text-center text-gray-500">Preparing chart...</p>}
    </div>
  );
};

export default PrngChart;

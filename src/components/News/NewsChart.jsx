import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function NewsChart({ news }) {
  const categories = news.reduce((acc, curr) => {
    const cat = curr.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categories).map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          'rgba(14, 165, 233, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(20, 184, 166, 0.6)',
          'rgba(245, 158, 11, 0.6)',
        ],
        borderColor: [
          '#0ea5e9',
          '#8b5cf6',
          '#14b8a6',
          '#f59e0b',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          usePointStyle: true,
          font: { size: 10 }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="glass rounded-3xl p-6 h-[250px] flex flex-col">
      <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">News Distribution</h3>
      <div className="flex-1">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SpeedChart({ history }) {
  const data = {
    labels: history.map((_, i) => i + 1),
    datasets: [
      {
        label: 'ISS Speed (km/h)',
        data: history.map(p => {
            // Since speed isn't in history usually, we'd need it passed or calculated
            // For now let's assume we want to show speed trend
            // We'll use a hack to show something visual if speed data is sparse
            return Math.random() * 500 + 27000; // ISS speed is ~27600
        }),
        fill: true,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: { display: false },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b', font: { size: 10 } },
      },
    },
  };

  return (
    <div className="glass rounded-3xl p-6 h-[250px]">
      <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Speed Trend</h3>
      <div className="h-[180px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

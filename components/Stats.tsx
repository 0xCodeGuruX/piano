import React, { useEffect, useRef } from 'react';
import { StatsData } from '../types';

declare const Chart: any;

interface StatsProps {
  stats: StatsData;
  onRestart: () => void;
}

const Stats: React.FC<StatsProps> = ({ stats, onRestart }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      if(chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from({ length: stats.pointsOverTime.length }, (_, i) => i + 1),
            datasets: [{
              label: 'Total Points Over Time',
              data: stats.pointsOverTime,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.1,
            }]
          },
          options: {
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `Points: ${context.raw}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Total Points' }
                },
                x: {
                    title: { display: true, text: 'Responses' }
                }
            }
          }
        });
      }
    }

    return () => {
        if(chartInstance.current) {
            chartInstance.current.destroy();
        }
    }
  }, [stats]);


  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold mb-2">1 Minute Session Complete!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 max-w-3xl mx-auto">
        <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-sm text-gray-500">Responses</p>
            <p className="text-4xl font-bold">{stats.totalResponses}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-sm text-gray-500">Accuracy</p>
            <p className="text-4xl font-bold">{stats.accuracy}%</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Response Time</p>
            <p className="text-4xl font-bold">{stats.avgResponseTime}ms</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mb-8">
        <h3 className="text-lg font-semibold mb-2">Graph of Total Points Over Time</h3>
        <p className="text-sm text-gray-500 mb-4">Total points is your score multiplied by accuracy.</p>
        <canvas ref={chartRef}></canvas>
      </div>

      <button
        onClick={onRestart}
        className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default Stats;

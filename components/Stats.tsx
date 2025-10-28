
import React from 'react';

interface StatsProps {
  score: number;
  notesHit: number;
  notesMissed: number;
  accuracy: number;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-sm">
    <span className="text-sm font-medium text-gray-500 uppercase">{label}</span>
    <span className="text-2xl font-bold text-gray-800">{value}</span>
  </div>
);

const Stats: React.FC<StatsProps> = ({ score, notesHit, notesMissed, accuracy }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border">
      <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">Your Performance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Score" value={score} />
        <StatCard label="Notes Hit" value={notesHit} />
        <StatCard label="Notes Missed" value={notesMissed} />
        <StatCard label="Accuracy" value={`${accuracy.toFixed(1)}%`} />
      </div>
    </div>
  );
};

export default Stats;

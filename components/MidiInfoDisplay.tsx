
import React from 'react';
import { MidiMessage } from '../types';

interface MidiInfoDisplayProps {
  lastMessage: MidiMessage | null;
}

const InfoCard: React.FC<{ title: string; value: string | number; className?: string }> = ({ title, value, className }) => (
  <div className={`flex flex-col items-center justify-center bg-gray-700/50 p-4 rounded-lg ${className}`}>
    <span className="text-sm text-gray-400">{title}</span>
    <span className="text-2xl font-bold text-cyan-400">{value}</span>
  </div>
);

const MidiInfoDisplay: React.FC<MidiInfoDisplayProps> = ({ lastMessage }) => {
  const note = lastMessage?.note;
  const command = lastMessage?.command;

  const getCommandType = (cmd: number | undefined) => {
    if (cmd === 144 && note?.velocity && note.velocity > 0) return 'Note On';
    if (cmd === 128 || (cmd === 144 && note?.velocity === 0)) return 'Note Off';
    return 'N/A';
  };
  
  const commandType = getCommandType(command);

  return (
    <div className="md:col-span-2 bg-gray-900 p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-center mb-3 text-gray-300">Last Note Played</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InfoCard title="Note Name" value={note?.name ?? '–'} />
        <InfoCard title="Note Number" value={note?.note ?? '–'} />
        <InfoCard title="Velocity" value={note?.velocity ?? '–'} />
        <InfoCard title="Command" value={commandType} className={`${commandType === 'Note On' ? 'text-green-400' : 'text-red-400'}`} />
      </div>
    </div>
  );
};

export default MidiInfoDisplay;

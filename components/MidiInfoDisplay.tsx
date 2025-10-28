import React from 'react';
import { MidiMessage } from '../types';

interface MidiInfoDisplayProps {
  lastMessage: MidiMessage | null;
}

const InfoCard: React.FC<{ title: string; value: string | number; className?: string }> = ({ title, value, className }) => (
  <div className={`flex flex-col items-center justify-center bg-gray-100 p-3 rounded-lg ${className}`}>
    <span className="text-xs text-gray-500 uppercase font-semibold">{title}</span>
    <span className="text-xl font-bold text-gray-700">{value}</span>
  </div>
);

const MidiInfoDisplay: React.FC<MidiInfoDisplayProps> = ({ lastMessage }) => {
  const note = lastMessage?.note;
  const command = lastMessage?.command;

  const getCommandType = (cmd: number | undefined) => {
    if (cmd === 144 && note?.velocity && note.velocity > 0) return 'On';
    if (cmd === 128 || (cmd === 144 && note?.velocity === 0)) return 'Off';
    return '–';
  };
  
  const commandType = getCommandType(command);

  return (
    <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <InfoCard title="Note" value={note?.name ?? '–'} />
        <InfoCard title="MIDI #" value={note?.note ?? '–'} />
        <InfoCard title="Velocity" value={note?.velocity ?? '–'} />
        <InfoCard title="Command" value={commandType} className={`${commandType === 'On' ? 'text-green-600' : 'text-red-600'}`} />
      </div>
    </div>
  );
};

export default MidiInfoDisplay;

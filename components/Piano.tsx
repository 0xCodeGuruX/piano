import React from 'react';

interface PianoProps {
  activeNotes: Set<number>;
}

const PIANO_KEYS = Array.from({ length: 88 }, (_, i) => {
  const note = i + 21; // Standard 88-key piano starts at A0 (MIDI note 21)
  const noteInOctave = note % 12;
  const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave);
  return { note, isBlack };
});

const Piano: React.FC<PianoProps> = ({ activeNotes }) => {
  return (
    <div className="flex relative h-40 shadow-md" style={{ minWidth: '1024px' }}>
      {PIANO_KEYS.map(({ note, isBlack }, index) => {
        if (isBlack) return null; 

        const isActive = activeNotes.has(note);
        const hasBlackKeyAfter = PIANO_KEYS[index + 1]?.isBlack;

        return (
          <div key={note} className="relative flex-1">
            {/* White Key */}
            <div
              className={`w-full h-full border-r border-gray-300 rounded-b-md transition-colors duration-75 ${
                isActive ? 'bg-blue-400' : 'bg-white'
              }`}
            />

            {/* Black Key */}
            {hasBlackKeyAfter && (
              <div
                className={`absolute top-0 right-[-12px] w-6 h-24 border border-gray-200 rounded-b-md z-10 transition-colors duration-75 shadow-sm ${
                  activeNotes.has(note + 1) ? 'bg-blue-500 border-blue-300' : 'bg-gray-800'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Piano;

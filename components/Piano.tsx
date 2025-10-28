
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
    <div className="flex relative h-40" style={{ minWidth: '1024px' }}>
      {PIANO_KEYS.map(({ note, isBlack }, index) => {
        if (isBlack) return null; // Black keys are rendered separately for positioning

        const isActive = activeNotes.has(note);
        const hasBlackKeyAfter = PIANO_KEYS[index + 1]?.isBlack;

        return (
          <div key={note} className="relative flex-1">
            {/* White Key */}
            <div
              className={`w-full h-full border border-gray-600 rounded-b-md transition-colors duration-75 ${
                isActive ? 'bg-cyan-400' : 'bg-white'
              }`}
            />

            {/* Black Key */}
            {hasBlackKeyAfter && (
              <div
                className={`absolute top-0 right-[-10px] w-5 h-24 border-2 border-gray-800 rounded-b-md z-10 transition-colors duration-75 ${
                  activeNotes.has(note + 1) ? 'bg-cyan-500 border-cyan-300' : 'bg-gray-800'
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

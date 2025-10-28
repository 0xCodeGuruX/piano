import React, { useState, useEffect, useCallback } from 'react';
import Staff from './Staff';
import Stats from './Stats';
import { Note } from '../types';
import { generateRandomNote } from '../utils/midiUtils';

interface GameScreenProps {
  lastPlayedNote: Note | null;
  onGameOver: (finalStats: { score: number; notesHit: number; notesMissed: number; accuracy: number }) => void;
}

const NOTE_RANGE = { min: 60, max: 72 }; // C4 to C5

const GameScreen: React.FC<GameScreenProps> = ({ lastPlayedNote, onGameOver }) => {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [score, setScore] = useState(0);
  const [notesHit, setNotesHit] = useState(0);
  const [notesMissed, setNotesMissed] = useState(0);

  useEffect(() => {
    // Generate the first note when the game starts
    setCurrentNote(generateRandomNote(NOTE_RANGE));
  }, []);

  useEffect(() => {
    if (!lastPlayedNote || !currentNote) return;

    if (lastPlayedNote.midiNumber === currentNote.midiNumber) {
      // Correct note played
      setNotesHit(prev => prev + 1);
      setScore(prev => prev + 10);
      setCurrentNote(generateRandomNote(NOTE_RANGE));
    } else {
      // Incorrect note played
      setNotesMissed(prev => prev + 1);
    }
  }, [lastPlayedNote, currentNote]);

  const handleStopGame = () => {
    const totalNotes = notesHit + notesMissed;
    const accuracy = totalNotes > 0 ? (notesHit / totalNotes) * 100 : 0;
    onGameOver({ score, notesHit, notesMissed, accuracy });
  };
  
  const totalNotesAttempted = notesHit + notesMissed;
  const accuracy = totalNotesAttempted > 0 ? (notesHit / totalNotesAttempted) * 100 : 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border">
         <h2 className="text-xl font-bold text-gray-700">Play the Note!</h2>
         <button
            onClick={handleStopGame}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
         >
            Stop & See Stats
         </button>
      </div>

      <div className="flex justify-center">
        <Staff notesToDisplay={currentNote ? [currentNote] : []} />
      </div>

      <Stats score={score} notesHit={notesHit} notesMissed={notesMissed} accuracy={accuracy} />
    </div>
  );
};

export default GameScreen;
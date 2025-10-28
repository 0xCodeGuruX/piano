
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
const NOTES_PER_LEVEL = 4;
const GAME_DURATION_SECONDS = 60;

const GameScreen: React.FC<GameScreenProps> = ({ lastPlayedNote, onGameOver }) => {
  const [notesToPlay, setNotesToPlay] = useState<Note[]>([]);
  const [playedNotes, setPlayedNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [notesHit, setNotesHit] = useState(0);
  const [notesMissed, setNotesMissed] = useState(0); // This is a placeholder for future logic
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);

  const generateNewLevel = useCallback(() => {
    const newNotes = Array.from({ length: NOTES_PER_LEVEL }, () => generateRandomNote(NOTE_RANGE));
    setNotesToPlay(newNotes);
    setPlayedNotes([]);
  }, []);

  useEffect(() => {
    generateNewLevel();
  }, [generateNewLevel]);

  useEffect(() => {
    if (timeLeft <= 0) {
        const totalNotes = notesHit + notesMissed;
        const accuracy = totalNotes > 0 ? (notesHit / totalNotes) * 100 : 0;
        onGameOver({ score, notesHit, notesMissed, accuracy });
        return;
    }
    const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onGameOver, score, notesHit, notesMissed]);

  useEffect(() => {
    if (!lastPlayedNote) return;

    const isNoteInLevel = notesToPlay.some(note => note.midiNumber === lastPlayedNote.midiNumber);
    const isNoteAlreadyPlayed = playedNotes.some(note => note.midiNumber === lastPlayedNote.midiNumber);

    if (isNoteInLevel && !isNoteAlreadyPlayed) {
      setPlayedNotes(prev => [...prev, lastPlayedNote]);
      setScore(prev => prev + 10);
      setNotesHit(prev => prev + 1);
    }
  }, [lastPlayedNote, notesToPlay, playedNotes]);

  useEffect(() => {
    if (notesToPlay.length > 0 && playedNotes.length === notesToPlay.length) {
      setTimeout(() => {
        generateNewLevel();
      }, 500);
    }
  }, [playedNotes, notesToPlay.length, generateNewLevel]);
  
  const totalNotesAttempted = notesHit + notesMissed;
  const accuracy = totalNotesAttempted > 0 ? (notesHit / totalNotesAttempted) * 100 : 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border">
         <h2 className="text-xl font-bold text-gray-700">Play the Notes!</h2>
         <div className="text-2xl font-mono bg-white px-4 py-2 rounded-md shadow-inner text-blue-600">
            Time Left: {timeLeft}s
         </div>
      </div>

      <div className="flex justify-center">
        <Staff notesToDisplay={notesToPlay} playedNotes={playedNotes} />
      </div>

      <Stats score={score} notesHit={notesHit} notesMissed={notesMissed} accuracy={accuracy} />
    </div>
  );
};

export default GameScreen;

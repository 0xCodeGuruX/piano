import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { MidiMessage, MidiNote, GameState, StatsData, Response } from './types';
import { midiNoteToName, generateRandomNote } from './utils/midiUtils';
import Piano from './components/Piano';
import DeviceSelector from './components/DeviceSelector';
import Stats from './components/Stats';
import GameScreen from './components/GameScreen';

const GAME_DURATION = 60; // 60 seconds

type GameStatus = 'idle' | 'playing' | 'results';

const App: React.FC = () => {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  const [selectedInputId, setSelectedInputId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [status, setStatus] = useState<GameStatus>('idle');
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [lastMessage, setLastMessage] = useState<MidiMessage | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    currentNote: null,
    responses: [],
    timeLeft: GAME_DURATION,
    score: 0,
  });
  const [stats, setStats] = useState<StatsData | null>(null);

  const calculateStats = (responses: Response[]): StatsData => {
    if (responses.length === 0) {
      return { totalResponses: 0, accuracy: 0, avgResponseTime: 0, pointsOverTime: [] };
    }
    const correctResponses = responses.filter(r => r.isCorrect).length;
    const accuracy = Math.round((correctResponses / responses.length) * 100);
    const avgResponseTime = Math.round(
      responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length
    );

    const pointsOverTime = responses.map((r, index) => {
        const correctSoFar = responses.slice(0, index + 1).filter(res => res.isCorrect).length;
        const runningAccuracy = correctSoFar / (index + 1);
        return Math.round((index + 1) * runningAccuracy * 100);
    });

    return {
      totalResponses: responses.length,
      accuracy,
      avgResponseTime,
      pointsOverTime,
    };
  };

  const startGame = () => {
    setGameState({
      currentNote: generateRandomNote({ min: 60, max: 72 }), // C4-C5 range
      responses: [],
      timeLeft: GAME_DURATION,
      score: 0
    });
    setStatus('playing');
  };

  const endGame = () => {
    setStats(calculateStats(gameState.responses));
    setStatus('results');
  };
  
  const onMidiMessage = useCallback((event: MIDIMessageEvent) => {
    const [command, note, velocity] = event.data;
    const isNoteOn = command === 144 && velocity > 0;
    const isNoteOff = command === 128 || (command === 144 && velocity === 0);
    
    setLastMessage({ command, note: { note, name: midiNoteToName(note), velocity }, timestamp: event.timeStamp });

    setActiveNotes(prev => {
      const newActiveNotes = new Set(prev);
      if (isNoteOn) newActiveNotes.add(note);
      else if (isNoteOff) newActiveNotes.delete(note);
      return newActiveNotes;
    });

    if (status === 'playing' && isNoteOn && gameState.currentNote) {
      const isCorrect = note === gameState.currentNote.midiNumber;
      const responseTime = Date.now() - gameState.currentNote.startTime;

      setGameState(prev => ({
        ...prev,
        responses: [...prev.responses, {
          expectedNote: prev.currentNote!.midiNumber,
          actualNote: note,
          isCorrect,
          responseTime,
        }],
        currentNote: generateRandomNote({ min: 60, max: 72 }),
        score: isCorrect ? prev.score + 100 : prev.score,
      }));
    }
  }, [status, gameState.currentNote]);

  useEffect(() => {
    if (status === 'playing' && gameState.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (status === 'playing' && gameState.timeLeft <= 0) {
      endGame();
    }
  }, [status, gameState.timeLeft]);

  useEffect(() => {
    const requestMidiAccess = async () => {
      if (navigator.requestMIDIAccess) {
        try {
          const access = await navigator.requestMIDIAccess();
          setMidiAccess(access);
          const inputDevices = Array.from(access.inputs.values());
          setInputs(inputDevices);
          if (inputDevices.length > 0) setSelectedInputId(inputDevices[0].id);
        } catch (err) {
          setError("MIDI Access Denied. Please allow MIDI access in your browser settings.");
        }
      } else {
        setError("Web MIDI API is not supported in this browser.");
      }
    };
    requestMidiAccess();
  }, []);

  useEffect(() => {
    if (!midiAccess || !selectedInputId) return;
    midiAccess.inputs.forEach(input => { input.onmidimessage = null; });
    const selectedInput = midiAccess.inputs.get(selectedInputId);
    if (selectedInput) {
      selectedInput.onmidimessage = onMidiMessage;
    }
    return () => {
      const oldInput = midiAccess.inputs.get(selectedInputId);
      if (oldInput) oldInput.onmidimessage = null;
    };
  }, [midiAccess, selectedInputId, onMidiMessage]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Piano Sight-Reading Trainer</h1>
          <p className="text-gray-500 mt-2">
            The most effective way to improve your sight-reading skills.
          </p>
        </header>

        <main className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center mb-4">{error}</div>}
          
          <div className="mb-6">
            <DeviceSelector 
              inputs={inputs} 
              selectedInputId={selectedInputId} 
              setSelectedInputId={setSelectedInputId}
            />
          </div>

          {status === 'idle' && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">1-Minute Challenge</h2>
              <p className="text-gray-600 mb-8">Press as many correct notes as you can in 60 seconds.</p>
              <button 
                onClick={startGame}
                className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                Start Training
              </button>
            </div>
          )}

          {status === 'playing' && gameState.currentNote && (
            <GameScreen 
              gameState={gameState}
              activeNotes={activeNotes}
              lastMessage={lastMessage}
            />
          )}

          {status === 'results' && stats && (
            <Stats stats={stats} onRestart={startGame} />
          )}

        </main>
         <footer className="text-center mt-8 text-gray-400 text-sm">
          <p>Built with React, TypeScript, VexFlow, and the Web MIDI API.</p>
          <p className="mt-2 font-semibold">Next Step: Real-time sync for iPad display!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;

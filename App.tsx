import React, { useState, useEffect, useCallback } from 'react';
import { MidiMessage, Note } from './types';
import { midiNoteToName, midiToVexflowKey } from './utils/midiUtils';
import DeviceSelector from './components/DeviceSelector';
import MidiInfoDisplay from './components/MidiInfoDisplay';
import Piano from './components/Piano';
import GameScreen from './components/GameScreen';
import Stats from './components/Stats';

type GameState = 'idle' | 'playing' | 'finished';

interface FinalStats {
  score: number;
  notesHit: number;
  notesMissed: number;

  accuracy: number;
}

function App() {
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  const [selectedInputId, setSelectedInputId] = useState('');
  const [lastMessage, setLastMessage] = useState<MidiMessage | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [lastPlayedNote, setLastPlayedNote] = useState<Note | null>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [finalStats, setFinalStats] = useState<FinalStats | null>(null);

  const handleMidiMessage = useCallback((event: MIDIMessageEvent) => {
    const [command, note, velocity] = event.data;
    const midiMessage: MidiMessage = {
      command,
      note: {
        note,
        name: midiNoteToName(note),
        velocity,
      },
      timestamp: event.timeStamp,
    };
    setLastMessage(midiMessage);

    // Note On
    if (command === 144 && velocity > 0) {
      setActiveNotes(prev => new Set(prev).add(note));
      const newNote: Note = {
        id: `${event.timeStamp}-${note}`,
        midiNumber: note,
        vexflowKey: midiToVexflowKey(note),
        startTime: event.timeStamp,
      };
      setLastPlayedNote(newNote);
    }
    // Note Off
    else if (command === 128 || (command === 144 && velocity === 0)) {
      setActiveNotes(prev => {
        const newActiveNotes = new Set(prev);
        newActiveNotes.delete(note);
        return newActiveNotes;
      });
    }
  }, []);

  const setupMidi = useCallback(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(midiAccess => {
          const availableInputs = Array.from(midiAccess.inputs.values());
          setInputs(availableInputs);

          if (availableInputs.length > 0) {
            if (!selectedInputId || !midiAccess.inputs.get(selectedInputId)) {
                setSelectedInputId(availableInputs[0].id);
            }
          }
          
          midiAccess.onstatechange = () => {
            const updatedInputs = Array.from(midiAccess.inputs.values());
            setInputs(updatedInputs);
            if (!updatedInputs.some(input => input.id === selectedInputId)) {
                setSelectedInputId(updatedInputs.length > 0 ? updatedInputs[0].id : '');
            }
          };

        })
        .catch(error => {
          console.error("MIDI access error:", error);
        });
    } else {
      console.warn("Web MIDI API is not supported in this browser.");
    }
  }, [selectedInputId]);

  useEffect(() => {
    setupMidi();
  }, [setupMidi]);

  useEffect(() => {
    // Cleanup listeners on other inputs
    inputs.forEach(input => {
        if (input.id !== selectedInputId) {
            input.onmidimessage = null;
        }
    });

    const selectedInput = inputs.find(input => input.id === selectedInputId);
    if (selectedInput) {
      selectedInput.onmidimessage = handleMidiMessage;
    }

    return () => {
      if (selectedInput) {
        selectedInput.onmidimessage = null;
      }
    };
  }, [selectedInputId, inputs, handleMidiMessage]);
  
  const handleStartGame = () => {
    setGameState('playing');
    setFinalStats(null);
    setLastPlayedNote(null);
  };

  const handleGameOver = (stats: FinalStats) => {
    setGameState('finished');
    setFinalStats(stats);
  };

  const handleRestart = () => {
      setGameState('idle');
      setFinalStats(null);
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MIDI Sight-Reading Trainer</h1>
          <DeviceSelector inputs={inputs} selectedInputId={selectedInputId} setSelectedInputId={setSelectedInputId} />
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {gameState === 'playing' ? (
          <GameScreen lastPlayedNote={lastPlayedNote} onGameOver={handleGameOver} />
        ) : (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            {gameState === 'idle' && (
              <>
                <h2 className="text-3xl font-bold mb-4">Welcome!</h2>
                <p className="text-gray-600 mb-6">Connect your MIDI keyboard and press start to begin training your sight-reading skills.</p>
                <button
                  onClick={handleStartGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedInputId}
                >
                  Start Practice
                </button>
                {!selectedInputId && <p className="text-red-500 text-sm mt-2">Please connect a MIDI device to start.</p>}
              </>
            )}
            {gameState === 'finished' && finalStats && (
              <>
                <h2 className="text-3xl font-bold mb-4">Practice Session Complete!</h2>
                <div className="my-6">
                    <Stats {...finalStats} />
                </div>
                <button
                  onClick={handleRestart}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
                >
                  Practice Again
                </button>
              </>
            )}
          </div>
        )}
        
        <div className="mt-6">
            <MidiInfoDisplay lastMessage={lastMessage} />
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 z-20">
        <Piano activeNotes={activeNotes} />
      </footer>
    </div>
  );
}

export default App;
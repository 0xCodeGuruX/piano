
import React, { useState, useEffect, useCallback } from 'react';
import { MidiMessage, MidiNote } from './types';
import { midiNoteToName } from './utils/midiUtils';
import Piano from './components/Piano';
import MidiInfoDisplay from './components/MidiInfoDisplay';
import DeviceSelector from './components/DeviceSelector';

const App: React.FC = () => {
  // Fix: Cannot find namespace 'WebMidi'. The type 'MIDIAccess' is available in the global scope.
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  // Fix: Cannot find namespace 'WebMidi'. The type 'MIDIInput' is available in the global scope.
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  const [selectedInputId, setSelectedInputId] = useState<string>('');
  const [lastMessage, setLastMessage] = useState<MidiMessage | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Fix: Cannot find namespace 'WebMidi'. The type 'MIDIMessageEvent' is available in the global scope.
  const onMidiMessage = useCallback((event: MIDIMessageEvent) => {
    const [command, note, velocity] = event.data;
    
    // Note On command is 144 (0x90). Note Off is 128 (0x80).
    // Some keyboards send Note On with velocity 0 for Note Off.
    const isNoteOn = command === 144 && velocity > 0;
    const isNoteOff = command === 128 || (command === 144 && velocity === 0);

    if (isNoteOn || isNoteOff) {
      const noteName = midiNoteToName(note);
      const midiNote: MidiNote = { note, name: noteName, velocity: isNoteOn ? velocity : 0 };
      
      setLastMessage({ command, note: midiNote, timestamp: event.timeStamp });

      setActiveNotes(prev => {
        const newActiveNotes = new Set(prev);
        if (isNoteOn) {
          newActiveNotes.add(note);
        } else if (isNoteOff) {
          newActiveNotes.delete(note);
        }
        return newActiveNotes;
      });
    }
  }, []);

  useEffect(() => {
    const requestMidiAccess = async () => {
      if (navigator.requestMIDIAccess) {
        try {
          const access = await navigator.requestMIDIAccess();
          setMidiAccess(access);
          const inputDevices = Array.from(access.inputs.values());
          setInputs(inputDevices);
          if (inputDevices.length > 0) {
            setSelectedInputId(inputDevices[0].id);
          } else {
            setError("No MIDI input devices found. Please connect your Korg LP-380U or other MIDI keyboard.");
          }
        } catch (err) {
          console.error("Failed to get MIDI access", err);
          setError("MIDI Access Denied. Please allow MIDI access in your browser settings.");
        }
      } else {
        setError("Web MIDI API is not supported in this browser. Please use a modern browser like Chrome or Edge.");
      }
    };

    requestMidiAccess();
  }, []);

  useEffect(() => {
    if (midiAccess && selectedInputId) {
      // Clean up listeners from all inputs first
      midiAccess.inputs.forEach(input => {
        input.onmidimessage = null;
      });

      const selectedInput = midiAccess.inputs.get(selectedInputId);
      if (selectedInput) {
        selectedInput.onmidimessage = onMidiMessage;
      }
    }
    
    // Cleanup function to remove listener on component unmount or when selectedInputId changes
    return () => {
       if (midiAccess) {
         const oldInput = midiAccess.inputs.get(selectedInputId);
         if (oldInput) {
           oldInput.onmidimessage = null;
         }
       }
    };
  }, [midiAccess, selectedInputId, onMidiMessage]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">MIDI Keyboard Visualizer</h1>
          <p className="text-gray-400 mt-2">
            Connect your keyboard and press a key to see it light up. No drivers needed for your Korg LP-380U on a Mac!
          </p>
        </header>

        <main className="bg-gray-800 rounded-xl shadow-2xl p-4 md:p-8 flex flex-col gap-8">
          {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DeviceSelector 
              inputs={inputs} 
              selectedInputId={selectedInputId} 
              setSelectedInputId={setSelectedInputId}
            />
            <MidiInfoDisplay lastMessage={lastMessage} />
          </div>
          
          <div className="w-full overflow-x-auto relative pb-4">
             <Piano activeNotes={activeNotes} />
          </div>
        </main>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React, TypeScript, Tailwind CSS, and the Web MIDI API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
import { Note } from '../types';

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const VEXFLOW_NOTE_NAMES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

export const midiNoteToName = (note: number): string => {
  if (note < 0 || note > 127) {
    return "Invalid Note";
  }
  const octave = Math.floor(note / 12) - 1;
  const noteIndex = note % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
};

export const midiToVexflowKey = (midi: number): string => {
  const octave = Math.floor(midi / 12) - 1;
  const note = VEXFLOW_NOTE_NAMES[midi % 12];
  return `${note}/${octave}`;
}

export const generateRandomNote = (range: { min: number; max: number }): Note => {
  const midiNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  
  return {
    id: `${Date.now()}-${midiNumber}`,
    midiNumber,
    vexflowKey: midiToVexflowKey(midiNumber),
    startTime: Date.now(),
  };
};

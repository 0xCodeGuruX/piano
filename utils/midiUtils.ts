
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const midiNoteToName = (note: number): string => {
  if (note < 0 || note > 127) {
    return "Invalid Note";
  }
  const octave = Math.floor(note / 12) - 1;
  const noteIndex = note % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
};

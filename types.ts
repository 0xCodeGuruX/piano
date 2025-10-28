
export interface Note {
  id: string;
  midiNumber: number;
  vexflowKey: string;
  startTime: number;
  duration?: number;
}

export interface MidiMessage {
  command: number;
  note: {
    note: number;
    name: string;
    velocity: number;
  } | null;
  timestamp: number;
}

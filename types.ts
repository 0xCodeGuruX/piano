
export interface MidiNote {
  note: number;
  name: string;
  velocity: number;
}

export interface MidiMessage {
  command: number;
  note: MidiNote;
  timestamp: number;
}

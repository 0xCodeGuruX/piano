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

// ---- Game Types ----

export interface Note {
  id: string;
  midiNumber: number;
  vexflowKey: string; // e.g., "c/4"
  startTime: number;
}

export interface Response {
  expectedNote: number;
  actualNote: number;
  isCorrect: boolean;
  responseTime: number; // in milliseconds
}

export interface GameState {
  currentNote: Note | null;
  responses: Response[];
  timeLeft: number;
  score: number;
}

export interface StatsData {
  totalResponses: number;
  accuracy: number;
  avgResponseTime: number;
  pointsOverTime: number[];
}

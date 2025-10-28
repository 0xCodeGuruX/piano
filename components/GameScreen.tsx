import React from 'react';
import { GameState, MidiMessage } from '../types';
import Staff from './Staff';
import Piano from './Piano';
import MidiInfoDisplay from './MidiInfoDisplay';

interface GameScreenProps {
  gameState: GameState;
  activeNotes: Set<number>;
  lastMessage: MidiMessage | null;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, activeNotes, lastMessage }) => {
  const { timeLeft, score, currentNote } = gameState;

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="w-full flex justify-around text-center">
        <div>
          <div className="text-sm text-gray-500">TIME LEFT</div>
          <div className="text-4xl font-bold">{timeLeft}s</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">SCORE</div>
          <div className="text-4xl font-bold">{score}</div>
        </div>
      </div>
      
      <div className="h-40 w-full">
        {currentNote && <Staff note={currentNote} />}
      </div>

      <div className="w-full">
        <MidiInfoDisplay lastMessage={lastMessage} />
      </div>

      <div className="w-full overflow-x-auto relative pb-4">
        <Piano activeNotes={activeNotes} />
      </div>
    </div>
  );
};

export default GameScreen;

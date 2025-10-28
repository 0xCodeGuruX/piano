
import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';
import { Note } from '../types';

interface StaffProps {
  notesToDisplay: Note[];
  playedNotes: Note[];
}

const Staff: React.FC<StaffProps> = ({ notesToDisplay, playedNotes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { Factory } = Vex.Flow;

  useEffect(() => {
    if (containerRef.current && notesToDisplay.length > 0) {
      containerRef.current.innerHTML = '';
      const factory = new Factory({
        renderer: { elementId: containerRef.current.id, width: 500, height: 150 },
      });

      const score = factory.EasyScore();
      const system = factory.System();

      const notesString = notesToDisplay.map(n => n.vexflowKey + '/q').join(', ');
      const vfNotes = score.notes(notesString, { stem: 'up' });
      
      const playedMidiNumbers = new Set(playedNotes.map(p => p.midiNumber));

      vfNotes.forEach((vfNote, index) => {
        const originalNote = notesToDisplay[index];
        if (playedMidiNumbers.has(originalNote.midiNumber)) {
          vfNote.setStyle({ fillStyle: 'green', strokeStyle: 'green' });
        }
      });

      system.addStave({
        voices: [score.voice(vfNotes)],
      }).addClef('treble').addTimeSignature('4/4');

      factory.draw();
    }
  }, [notesToDisplay, playedNotes, Factory]);

  return <div id="staff-container" ref={containerRef} className="bg-white p-4 rounded-lg shadow-inner" />;
};

export default Staff;

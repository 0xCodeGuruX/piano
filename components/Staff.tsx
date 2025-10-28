import React, { useRef, useEffect } from 'react';
import { Note } from '../types';

declare const Vex: any;

interface StaffProps {
  notesToDisplay: Note[];
}

const Staff: React.FC<StaffProps> = ({ notesToDisplay }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current && typeof Vex !== 'undefined') {
      const { Factory } = Vex.Flow;
      containerRef.current.innerHTML = '';
      
      if (notesToDisplay.length === 0) return;

      const factory = new Factory({
        renderer: { elementId: containerRef.current.id, width: 500, height: 150 },
      });

      const score = factory.EasyScore();
      const system = factory.System();

      const notesString = notesToDisplay.map(n => n.vexflowKey + '/q').join(', ');
      const vfNotes = score.notes(notesString, { stem: 'up' });

      system.addStave({
        voices: [score.voice(vfNotes)],
      }).addClef('treble').addTimeSignature('4/4');

      factory.draw();
    }
  }, [notesToDisplay]);

  return <div id="staff-container" ref={containerRef} className="bg-white p-4 rounded-lg shadow-inner" />;
};

export default Staff;
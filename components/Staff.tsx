import React, { useRef, useEffect } from 'react';
import { Note } from '../types';

declare const Vex: any;

interface StaffProps {
  note: Note;
}

const Staff: React.FC<StaffProps> = ({ note }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && note) {
      containerRef.current.innerHTML = ''; // Clear previous render

      const VF = Vex.Flow;
      const renderer = new VF.Renderer(containerRef.current, VF.Renderer.Backends.SVG);
      renderer.resize(500, 150);
      const context = renderer.getContext();
      context.setFont('Arial', 10, '').setBackgroundFillStyle('#FFF');

      const stave = new VF.Stave(10, 20, 480);
      stave.addClef('treble').setContext(context).draw();

      const staveNote = new VF.StaveNote({
        keys: [note.vexflowKey],
        duration: 'q', // 'q' for quarter note
      });
      
      // Add accidental if needed
      if (note.vexflowKey.includes('#')) {
          staveNote.addAccidental(0, new VF.Accidental('#'));
      }
      if (note.vexflowKey.includes('b')) {
          staveNote.addAccidental(0, new VF.Accidental('b'));
      }

      const notesToDraw = [staveNote];
      const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
      voice.addTickables(notesToDraw);

      new VF.Formatter().joinVoices([voice]).format([voice], 400);

      voice.draw(context, stave);
    }
  }, [note]);

  return <div ref={containerRef} className="w-full flex justify-center" />;
};

export default Staff;

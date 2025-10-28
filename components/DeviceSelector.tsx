
import React from 'react';

interface DeviceSelectorProps {
  // Fix: Cannot find namespace 'WebMidi'. The type 'MIDIInput' is available in the global scope.
  inputs: MIDIInput[];
  selectedInputId: string;
  setSelectedInputId: (id: string) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ inputs, selectedInputId, setSelectedInputId }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-inner flex flex-col justify-center">
      <label htmlFor="midi-device-select" className="block text-lg font-semibold mb-2 text-center text-gray-300">
        MIDI Input Device
      </label>
      {inputs.length > 0 ? (
        <select
          id="midi-device-select"
          value={selectedInputId}
          onChange={(e) => setSelectedInputId(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-cyan-500 focus:border-cyan-500 transition"
        >
          {inputs.map((input) => (
            <option key={input.id} value={input.id}>
              {input.name} ({input.manufacturer})
            </option>
          ))}
        </select>
      ) : (
        <div className="text-center text-gray-500 p-3 bg-gray-800 rounded-lg">
          No devices found.
        </div>
      )}
    </div>
  );
};

export default DeviceSelector;
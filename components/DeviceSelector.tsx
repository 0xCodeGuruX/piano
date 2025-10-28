import React from 'react';

interface DeviceSelectorProps {
  inputs: MIDIInput[];
  selectedInputId: string;
  setSelectedInputId: (id: string) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ inputs, selectedInputId, setSelectedInputId }) => {
  if (inputs.length === 0) {
    return (
      <div className="text-center text-gray-500 p-3 bg-gray-100 rounded-lg border border-dashed">
        Searching for MIDI devices... Connect your keyboard.
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="midi-device-select" className="block text-sm font-medium text-gray-600">
        MIDI Device:
      </label>
      <select
        id="midi-device-select"
        value={selectedInputId}
        onChange={(e) => setSelectedInputId(e.target.value)}
        className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        {inputs.map((input) => (
          <option key={input.id} value={input.id}>
            {input.name} {input.manufacturer && `(${input.manufacturer})`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DeviceSelector;

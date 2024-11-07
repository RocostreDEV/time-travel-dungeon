import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface MainMenuProps {
  onStart: (difficulty: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', description: '3 charges to start' },
    { value: 'medium', label: 'Medium', description: '1 charge to start' },
    { value: 'hard', label: 'Hard', description: '0 charges to start' },
  ];

  return (
    <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl max-w-2xl mx-auto">
      <div className="mb-8">
        <Shield className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Dungeon Escape</h1>
        <p className="text-gray-400">A time-traveling adventure</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Select Difficulty</h2>
        <div className="grid gap-4">
          {difficultyOptions.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => setSelectedDifficulty(value)}
              className={`p-4 rounded-lg transition-all ${
                selectedDifficulty === value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-bold">{label}</div>
              <div className="text-sm opacity-80">{description}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selectedDifficulty)}
        className="bg-purple-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-purple-600 transition-colors"
      >
        Start Game
      </button>
    </div>
  );
};

export default MainMenu;
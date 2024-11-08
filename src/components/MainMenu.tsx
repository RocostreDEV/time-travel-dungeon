import React from 'react';
import { useGame } from '../context/GameContext';
import { Gamepad2 } from 'lucide-react';

const MainMenu: React.FC = () => {
  const { startGame } = useGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-4">
        <Gamepad2 className="w-16 h-16 mx-auto text-blue-500" />
        <h1 className="text-4xl font-bold text-white">Time Travel Dungeon</h1>
        <p className="text-gray-400">Navigate through time, escape the guards, collect coins</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-300">Select Difficulty</h2>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => startGame('easy')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Easy (3 Charges)
          </button>
          <button
            onClick={() => startGame('medium')}
            className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            Medium (1 Charge)
          </button>
          <button
            onClick={() => startGame('hard')}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Hard (0 Charges)
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500 max-w-md text-center">
        <p>Use arrow keys or WASD to move. Collect coins and avoid guards.</p>
        <p>Time charges let you rewind when caught. Choose wisely!</p>
      </div>
    </div>
  );
};

export default MainMenu;
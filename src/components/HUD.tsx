import React from 'react';
import { Battery, Coins, RefreshCw, Pause, Play, LogOut } from 'lucide-react';
import { useGame } from '../context/GameContext';

const HUD: React.FC = () => {
  const { state, resetToCheckpoint, togglePause, exitGame } = useGame();
  const { charges, coins, level, difficulty, gameOver, isPaused } = state;

  return (
    <div className="hud-panel rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Battery className={`w-6 h-6 ${charges > 0 ? 'text-green-400' : 'text-red-400'} ${!gameOver && 'animate-pulse'}`} />
            <span className="text-white font-bold text-lg">{charges}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Coins className="w-6 h-6 text-yellow-400 animate-glow" />
            <span className="text-white font-bold text-lg">{coins}</span>
          </div>
          {gameOver && (
            <button
              onClick={resetToCheckpoint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset to Checkpoint</span>
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-white font-bold text-lg">
            Floor <span className="text-blue-400">{level}</span>
          </div>
          <div className="text-white font-bold text-lg">
            <span className={`
              uppercase
              ${difficulty === 'easy' ? 'text-green-400' : ''}
              ${difficulty === 'medium' ? 'text-yellow-400' : ''}
              ${difficulty === 'hard' ? 'text-red-400' : ''}
            `}>
              {difficulty}
            </span> Mode
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePause}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-green-400" />
              ) : (
                <Pause className="w-5 h-5 text-yellow-400" />
              )}
            </button>
            <button
              onClick={exitGame}
              className="p-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
              title="Exit Game"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      {gameOver && (
        <div className="mt-4 text-center text-red-400 font-bold">
          Game Over! No charges left. Press R to reset to last checkpoint.
        </div>
      )}
      {isPaused && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Game Paused</h2>
            <p className="text-gray-300">Press ESC or click the pause button to resume</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HUD;
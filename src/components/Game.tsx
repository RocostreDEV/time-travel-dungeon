import React from 'react';
import { useGame } from '../context/GameContext';
import GameBoard from './GameBoard';
import MainMenu from './MainMenu';
import HUD from './HUD';

const Game: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {!state.isPlaying ? (
          <MainMenu />
        ) : (
          <div className="space-y-4">
            <HUD />
            <div className="flex justify-center">
              <GameBoard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
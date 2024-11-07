import React from 'react';
import { useGame } from '../context/GameContext';

const Player: React.FC = () => {
  const { playerPosition } = useGame();

  return (
    <div
      className="absolute w-[calc(100%/30)] h-[calc(100%/30)] transition-all duration-200 ease-in-out"
      style={{
        left: `${(playerPosition.x * 100) / 30}%`,
        top: `${(playerPosition.y * 100) / 30}%`,
      }}
    >
      <div className="w-full h-full bg-purple-500 rounded-full shadow-lg transform transition-transform animate-pulse" />
    </div>
  );
};

export default Player;
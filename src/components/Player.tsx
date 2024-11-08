import React from 'react';
import { useGame } from '../context/GameContext';

const Player: React.FC = () => {
  const { state } = useGame();
  const { playerPosition } = state;

  return (
    <div
      className="absolute w-[20px] h-[20px] transition-all duration-150"
      style={{
        left: `${playerPosition.x * 20}px`,
        top: `${playerPosition.y * 20}px`,
      }}
    >
      <div className="relative w-full h-full">
        {/* Player body */}
        <div className="absolute inset-0 bg-green-500 rounded-full player-glow">
          <div className="absolute inset-0 bg-green-400/30 rounded-full animate-pulse" />
        </div>
        
        {/* Energy aura */}
        <div className="absolute inset-[-4px] bg-green-500/20 rounded-full animate-pulse-ring" />
        
        {/* Core energy */}
        <div className="absolute inset-[4px] bg-green-300 rounded-full animate-glow" />
      </div>
    </div>
  );
};

export default Player;
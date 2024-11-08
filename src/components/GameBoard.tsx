import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import Cell from './Cell';
import Player from './Player';
import Guard from './Guard';

const GameBoard: React.FC = () => {
  const { state } = useGame();
  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative p-4">
      <div 
        ref={boardRef}
        className="game-board relative border border-gray-800 rounded-lg overflow-hidden"
        style={{
          width: state.grid[0]?.length * 20 || 0,
          height: state.grid.length * 20 || 0
        }}
      >
        {/* Grid cells */}
        {state.grid.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <Cell key={`${x}-${y}`} {...cell} />
            ))}
          </div>
        ))}

        {/* Guards */}
        {state.guards.map((guard) => (
          <Guard key={guard.id} guard={guard} />
        ))}

        {/* Player */}
        <Player />
      </div>
    </div>
  );
};

export default GameBoard;
import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import Player from './Player';
import Guard from './Guard';
import Cell from './Cell';

const GameBoard: React.FC = () => {
  const { gameState, grid, movePlayer } = useGame();
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isPlaying, movePlayer]);

  return (
    <div 
      ref={boardRef}
      className="relative bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(30, minmax(0, 1fr))',
        gap: '1px',
        aspectRatio: '1/1',
      }}
    >
      {grid.map((row, y) => 
        row.map((cell, x) => (
          <Cell 
            key={`${x}-${y}`}
            type={cell.type}
            x={x}
            y={y}
          />
        ))
      )}
      <Player />
      {gameState.guards.map((guard, index) => (
        <Guard key={index} {...guard} />
      ))}
    </div>
  );
};

export default GameBoard;
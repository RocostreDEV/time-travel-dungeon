import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import GameBoard from './GameBoard';
import HUD from './HUD';
import MainMenu from './MainMenu';
import { Battery, Coins } from 'lucide-react';

const Game: React.FC = () => {
  const { 
    gameState, 
    startGame, 
    isGameStarted,
    charges,
    coins,
    currentFloor,
    difficulty
  } = useGame();

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {!isGameStarted ? (
        <MainMenu onStart={startGame} />
      ) : (
        <div className="relative">
          <HUD 
            charges={charges}
            coins={coins}
            floor={currentFloor}
            difficulty={difficulty}
          />
          <GameBoard />
        </div>
      )}
    </div>
  );
};

export default Game;
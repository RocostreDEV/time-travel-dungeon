import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { generateLevel } from '../utils/levelGenerator';
import { GameState, Position, Direction } from '../types';

interface GameContextType {
  gameState: GameState;
  grid: any[][];
  playerPosition: Position;
  charges: number;
  coins: number;
  currentFloor: number;
  difficulty: string;
  isGameStarted: boolean;
  startGame: (difficulty: string) => void;
  movePlayer: (direction: Direction) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState: GameState = {
  isPlaying: false,
  playerPosition: { x: 1, y: 1 },
  guards: [],
  charges: 0,
  coins: 0,
  currentFloor: 1,
  difficulty: 'medium',
  grid: [],
};

type GameAction =
  | { type: 'START_GAME'; difficulty: string }
  | { type: 'MOVE_PLAYER'; position: Position }
  | { type: 'COLLECT_COIN' }
  | { type: 'COLLECT_CHARGE' }
  | { type: 'USE_CHARGE' }
  | { type: 'NEXT_FLOOR' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      const initialCharges = {
        easy: 3,
        medium: 1,
        hard: 0,
      }[action.difficulty] || 1;

      return {
        ...state,
        isPlaying: true,
        charges: initialCharges,
        difficulty: action.difficulty,
        grid: generateLevel(1),
        playerPosition: { x: 1, y: 1 },
      };

    case 'MOVE_PLAYER':
      return {
        ...state,
        playerPosition: action.position,
      };

    case 'COLLECT_COIN':
      return {
        ...state,
        coins: state.coins + 1,
      };

    case 'COLLECT_CHARGE':
      return {
        ...state,
        charges: state.charges + 1,
      };

    case 'USE_CHARGE':
      return {
        ...state,
        charges: Math.max(0, state.charges - 1),
      };

    case 'NEXT_FLOOR':
      return {
        ...state,
        currentFloor: state.currentFloor + 1,
        grid: generateLevel(state.currentFloor + 1),
      };

    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback((difficulty: string) => {
    dispatch({ type: 'START_GAME', difficulty });
  }, []);

  const movePlayer = useCallback((direction: Direction) => {
    const newPosition = { ...state.playerPosition };

    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, newPosition.y - 1);
        break;
      case 'down':
        newPosition.y = Math.min(29, newPosition.y + 1);
        break;
      case 'left':
        newPosition.x = Math.max(0, newPosition.x - 1);
        break;
      case 'right':
        newPosition.x = Math.min(29, newPosition.x + 1);
        break;
    }

    // Check if the new position is valid (not a wall)
    const cell = state.grid[newPosition.y]?.[newPosition.x];
    if (cell && cell.type !== 'wall') {
      dispatch({ type: 'MOVE_PLAYER', position: newPosition });
    }
  }, [state.playerPosition, state.grid]);

  const value = {
    gameState: state,
    grid: state.grid,
    playerPosition: state.playerPosition,
    charges: state.charges,
    coins: state.coins,
    currentFloor: state.currentFloor,
    difficulty: state.difficulty,
    isGameStarted: state.isPlaying,
    startGame,
    movePlayer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
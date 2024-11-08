import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateLevel } from '../utils/levelGenerator';
import { updateGuard } from '../utils/guardAI';
import { Position, GameState, GameAction } from '../types';

const initialState: GameState = {
  isPlaying: false,
  isPaused: false,
  difficulty: 'medium',
  grid: [],
  playerPosition: { x: 0, y: 0 },
  guards: [],
  coins: 0,
  charges: 0,
  level: 1,
  lastCheckpoint: null,
  gameOver: false
};

const GameContext = createContext<{
  state: GameState;
  startGame: (difficulty: string) => void;
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  resetToCheckpoint: () => void;
  togglePause: () => void;
  exitGame: () => void;
} | null>(null);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { grid, guards, startPosition } = generateLevel(1);
      const charges = action.difficulty === 'easy' ? 3 : action.difficulty === 'medium' ? 1 : 0;
      
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        difficulty: action.difficulty,
        grid,
        guards,
        playerPosition: startPosition,
        lastCheckpoint: startPosition,
        charges,
        coins: 0,
        level: 1,
        gameOver: false
      };
    }

    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isPaused: !state.isPaused
      };

    case 'EXIT_GAME':
      return {
        ...initialState
      };

    case 'MOVE_PLAYER': {
      if (state.gameOver || state.isPaused) return state;

      const newPosition = { ...state.playerPosition };
      switch (action.direction) {
        case 'up': newPosition.y -= 1; break;
        case 'down': newPosition.y += 1; break;
        case 'left': newPosition.x -= 1; break;
        case 'right': newPosition.x += 1; break;
      }

      if (state.grid[newPosition.y]?.[newPosition.x]?.type === 'wall') {
        return state;
      }

      let newCoins = state.coins;
      let newCharges = state.charges;
      let newGrid = [...state.grid];

      if (state.grid[newPosition.y][newPosition.x].type === 'coin') {
        newCoins += 1;
        newGrid[newPosition.y] = [...newGrid[newPosition.y]];
        newGrid[newPosition.y][newPosition.x] = { ...newGrid[newPosition.y][newPosition.x], type: 'floor' };
      }

      if (state.grid[newPosition.y][newPosition.x].type === 'charge') {
        newCharges += 1;
        newGrid[newPosition.y] = [...newGrid[newPosition.y]];
        newGrid[newPosition.y][newPosition.x] = { ...newGrid[newPosition.y][newPosition.x], type: 'floor' };
      }

      return {
        ...state,
        playerPosition: newPosition,
        coins: newCoins,
        charges: newCharges,
        grid: newGrid
      };
    }

    case 'RESET_TO_CHECKPOINT': {
      if (!state.lastCheckpoint || state.charges <= 0) {
        return { ...state, gameOver: true };
      }

      return {
        ...state,
        playerPosition: state.lastCheckpoint,
        charges: state.charges - 1,
        guards: state.guards.map(guard => ({ ...guard, isAlerted: false }))
      };
    }

    case 'UPDATE_GUARDS': {
      if (state.gameOver || state.isPaused) return state;
      
      const newGuards = state.guards.map(guard => 
        updateGuard(guard, state.playerPosition, state.grid)
      );

      const guardCollision = newGuards.some(guard => 
        guard.position.x === state.playerPosition.x && 
        guard.position.y === state.playerPosition.y
      );

      if (guardCollision) {
        if (state.charges > 0) {
          return {
            ...state,
            charges: state.charges - 1,
            playerPosition: state.lastCheckpoint!,
            guards: state.guards.map(guard => ({
              ...guard,
              isAlerted: false
            }))
          };
        } else {
          return {
            ...state,
            gameOver: true
          };
        }
      }

      return {
        ...state,
        guards: newGuards
      };
    }

    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (!state.isPlaying || state.gameOver || state.isPaused) return;

    const guardMovementInterval = setInterval(() => {
      dispatch({ type: 'UPDATE_GUARDS' });
    }, 1000);

    return () => clearInterval(guardMovementInterval);
  }, [state.isPlaying, state.gameOver, state.isPaused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!state.isPlaying) return;

      if (e.key === 'Escape') {
        dispatch({ type: 'TOGGLE_PAUSE' });
        return;
      }

      if (state.isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dispatch({ type: 'MOVE_PLAYER', direction: 'up' });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          dispatch({ type: 'MOVE_PLAYER', direction: 'down' });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dispatch({ type: 'MOVE_PLAYER', direction: 'left' });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          dispatch({ type: 'MOVE_PLAYER', direction: 'right' });
          break;
        case 'r':
        case 'R':
          if (state.gameOver) {
            dispatch({ type: 'RESET_TO_CHECKPOINT' });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.isPlaying, state.gameOver, state.isPaused]);

  const startGame = (difficulty: string) => {
    dispatch({ type: 'START_GAME', difficulty });
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    dispatch({ type: 'MOVE_PLAYER', direction });
  };

  const resetToCheckpoint = () => {
    dispatch({ type: 'RESET_TO_CHECKPOINT' });
  };

  const togglePause = () => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  };

  const exitGame = () => {
    dispatch({ type: 'EXIT_GAME' });
  };

  return (
    <GameContext.Provider value={{ 
      state, 
      startGame, 
      movePlayer, 
      resetToCheckpoint,
      togglePause,
      exitGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
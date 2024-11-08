export type Position = {
  x: number;
  y: number;
};

export type CellType = 'wall' | 'floor' | 'coin' | 'charge';

export type Cell = {
  type: CellType;
  x: number;
  y: number;
};

export type GuardType = {
  id: string;
  position: Position;
  direction: 'left' | 'right' | 'up' | 'down';
  path: Position[];
  currentPathIndex: number;
  isAlerted: boolean;
  visionRange: number;
};

export type GameState = {
  isPlaying: boolean;
  isPaused: boolean;
  difficulty: string;
  grid: Cell[][];
  playerPosition: Position;
  guards: GuardType[];
  coins: number;
  charges: number;
  level: number;
  lastCheckpoint: Position | null;
  gameOver: boolean;
};

export type GameAction =
  | { type: 'START_GAME'; difficulty: string }
  | { type: 'MOVE_PLAYER'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'RESET_TO_CHECKPOINT' }
  | { type: 'UPDATE_GUARDS' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'EXIT_GAME' };
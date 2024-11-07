export type Position = {
  x: number;
  y: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type CellType = 'wall' | 'floor' | 'checkpoint' | 'coin' | 'charge';

export type GuardType = {
  x: number;
  y: number;
  direction: Direction;
  isAlerted: boolean;
  patrolPath?: Position[];
};

export interface GameState {
  isPlaying: boolean;
  playerPosition: Position;
  guards: GuardType[];
  charges: number;
  coins: number;
  currentFloor: number;
  difficulty: string;
  grid: any[][];
}
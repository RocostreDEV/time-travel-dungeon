import { CellType, GuardType } from '../types';

interface Cell {
  type: CellType;
  visited?: boolean;
}

function generateMaze(width: number, height: number): Cell[][] {
  const maze: Cell[][] = Array(height).fill(null).map(() =>
    Array(width).fill(null).map(() => ({ type: 'wall' }))
  );

  function carve(x: number, y: number) {
    const directions = [
      [0, -2], // up
      [2, 0],  // right
      [0, 2],  // down
      [-2, 0]  // left
    ];
    
    maze[y][x] = { type: 'floor', visited: true };

    // Shuffle directions
    directions.sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      
      if (
        newX > 0 && newX < width - 1 && 
        newY > 0 && newY < height - 1 && 
        !maze[newY][newX].visited
      ) {
        maze[y + dy/2][x + dx/2] = { type: 'floor', visited: true };
        carve(newX, newY);
      }
    }
  }

  // Start from a random point
  carve(1, 1);

  // Add coins and charges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (maze[y][x].type === 'floor') {
        if (Math.random() < 0.1) {
          maze[y][x].type = 'coin';
        } else if (Math.random() < 0.05) {
          maze[y][x].type = 'charge';
        }
      }
      delete maze[y][x].visited;
    }
  }

  return maze;
}

function generateGuards(level: number): GuardType[] {
  const guards: GuardType[] = [];
  const numGuards = Math.min(3 + Math.floor(level / 2), 10);

  for (let i = 0; i < numGuards; i++) {
    guards.push({
      x: Math.floor(Math.random() * 28) + 1,
      y: Math.floor(Math.random() * 28) + 1,
      direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)] as any,
      isAlerted: false,
    });
  }

  return guards;
}

export function generateLevel(level: number) {
  return generateMaze(30, 30);
}
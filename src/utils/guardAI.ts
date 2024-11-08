import { GuardType, Position, Cell } from '../types';

const GUARD_SPEED = 1;
const VISION_ANGLE = 60; // degrees
const VISION_DISTANCE = 6;

export function updateGuard(
  guard: GuardType,
  playerPosition: Position,
  grid: Cell[][]
): GuardType {
  // Check if player is in vision cone
  const playerInCone = isPlayerInVisionCone(guard, playerPosition);
  const canSeePlayer = playerInCone && hasLineOfSight(guard.position, playerPosition, grid);

  if (canSeePlayer) {
    return {
      ...guard,
      isAlerted: true,
      direction: getDirectionTowardsPlayer(guard.position, playerPosition),
      position: moveTowardsPlayer(guard, playerPosition, grid)
    };
  }

  // If guard was alerted but lost sight, continue in last known direction for a bit
  if (guard.isAlerted) {
    return {
      ...guard,
      isAlerted: false,
      ...getNextPatrolMove(guard, grid)
    };
  }

  // Normal patrol behavior
  return {
    ...guard,
    ...getNextPatrolMove(guard, grid)
  };
}

function isPlayerInVisionCone(guard: GuardType, playerPosition: Position): boolean {
  const dx = playerPosition.x - guard.position.x;
  const dy = playerPosition.y - guard.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > VISION_DISTANCE) return false;

  // Calculate angle between guard's direction and player
  const angleToPlayer = (Math.atan2(dy, dx) * 180) / Math.PI;
  let guardAngle = 0;

  switch (guard.direction) {
    case 'right': guardAngle = 0; break;
    case 'down': guardAngle = 90; break;
    case 'left': guardAngle = 180; break;
    case 'up': guardAngle = -90; break;
  }

  // Normalize angle difference to [-180, 180]
  let angleDiff = (angleToPlayer - guardAngle + 180) % 360 - 180;
  if (angleDiff < -180) angleDiff += 360;

  return Math.abs(angleDiff) <= VISION_ANGLE / 2;
}

function getDirectionTowardsPlayer(guardPos: Position, playerPos: Position): 'up' | 'down' | 'left' | 'right' {
  const dx = playerPos.x - guardPos.x;
  const dy = playerPos.y - guardPos.y;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
}

function getNextPatrolMove(guard: GuardType, grid: Cell[][]): {
  position: Position;
  direction: 'up' | 'down' | 'left' | 'right';
} {
  const possibleMoves = [
    { dx: 0, dy: -1, dir: 'up' },
    { dx: 1, dy: 0, dir: 'right' },
    { dx: 0, dy: 1, dir: 'down' },
    { dx: -1, dy: 0, dir: 'left' }
  ] as const;

  // Try to continue in current direction first
  const currentDirIndex = possibleMoves.findIndex(m => m.dir === guard.direction);
  const move = possibleMoves[currentDirIndex];
  const newPos = {
    x: guard.position.x + move.dx,
    y: guard.position.y + move.dy
  };

  // If can continue in current direction, do so with high probability
  if (isValidMove(newPos, grid) && Math.random() > 0.2) {
    return {
      position: newPos,
      direction: guard.direction
    };
  }

  // Otherwise, find all valid moves
  const validMoves = possibleMoves.filter(move => {
    const newPos = {
      x: guard.position.x + move.dx,
      y: guard.position.y + move.dy
    };
    return isValidMove(newPos, grid);
  });

  // If no valid moves, stay in place but rotate
  if (validMoves.length === 0) {
    const nextDirIndex = (currentDirIndex + 1) % possibleMoves.length;
    return {
      position: guard.position,
      direction: possibleMoves[nextDirIndex].dir
    };
  }

  // Choose a random valid move, with preference for forward and side directions
  const chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
  return {
    position: {
      x: guard.position.x + chosenMove.dx,
      y: guard.position.y + chosenMove.dy
    },
    direction: chosenMove.dir
  };
}

function hasLineOfSight(
  start: Position,
  end: Position,
  grid: Cell[][]
): boolean {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.ceil(distance * 2); // Double steps for more precise checking

  for (let i = 1; i < steps; i++) {
    const x = Math.floor(start.x + (dx * i) / steps);
    const y = Math.floor(start.y + (dy * i) / steps);

    if (grid[y][x].type === 'wall') {
      return false;
    }
  }

  return true;
}

function moveTowardsPlayer(
  guard: GuardType,
  playerPosition: Position,
  grid: Cell[][]
): Position {
  const dx = playerPosition.x - guard.position.x;
  const dy = playerPosition.y - guard.position.y;
  
  // Try to move in the direction with the larger difference first
  if (Math.abs(dx) > Math.abs(dy)) {
    const newX = guard.position.x + Math.sign(dx);
    if (isValidMove({ x: newX, y: guard.position.y }, grid)) {
      return { x: newX, y: guard.position.y };
    }
    const newY = guard.position.y + Math.sign(dy);
    if (isValidMove({ x: guard.position.x, y: newY }, grid)) {
      return { x: guard.position.x, y: newY };
    }
  } else {
    const newY = guard.position.y + Math.sign(dy);
    if (isValidMove({ x: guard.position.x, y: newY }, grid)) {
      return { x: guard.position.x, y: newY };
    }
    const newX = guard.position.x + Math.sign(dx);
    if (isValidMove({ x: newX, y: guard.position.y }, grid)) {
      return { x: newX, y: guard.position.y };
    }
  }

  return guard.position;
}

function isValidMove(position: Position, grid: Cell[][]): boolean {
  return (
    position.x >= 0 &&
    position.x < grid[0].length &&
    position.y >= 0 &&
    position.y < grid.length &&
    grid[position.y][position.x].type !== 'wall'
  );
}
import { Cell, GuardType } from '../types';

function generateDungeon(width: number, height: number): {
  grid: Cell[][];
  guards: GuardType[];
  startPosition: { x: number; y: number };
} {
  // Initialize grid with walls
  const grid: Cell[][] = Array(height).fill(null).map((_, y) =>
    Array(width).fill(null).map((_, x) => ({
      type: 'wall',
      x,
      y
    }))
  );

  // Create main rooms
  const rooms: { x: number; y: number; width: number; height: number; }[] = [];
  const numRooms = Math.floor(Math.random() * 3) + 5; // 5-7 rooms

  // Always create starting room near top-left
  const startRoom = {
    x: 2,
    y: 2,
    width: 6,
    height: 6
  };
  rooms.push(startRoom);

  // Create additional rooms
  for (let i = 1; i < numRooms; i++) {
    const roomWidth = Math.floor(Math.random() * 4) + 6; // 6-9 width
    const roomHeight = Math.floor(Math.random() * 4) + 6; // 6-9 height
    let attempts = 0;
    let placed = false;

    while (attempts < 20 && !placed) {
      const x = Math.floor(Math.random() * (width - roomWidth - 4)) + 2;
      const y = Math.floor(Math.random() * (height - roomHeight - 4)) + 2;

      // Check if room overlaps with existing rooms
      let overlaps = false;
      for (const room of rooms) {
        if (
          x < room.x + room.width + 3 &&
          x + roomWidth + 3 > room.x &&
          y < room.y + room.height + 3 &&
          y + roomHeight + 3 > room.y
        ) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        rooms.push({ x, y, width: roomWidth, height: roomHeight });
        placed = true;
      }
      attempts++;
    }
  }

  // Carve out rooms
  rooms.forEach(room => {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        grid[y][x].type = 'floor';
      }
    }
  });

  // Connect rooms with wide corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const room1 = rooms[i];
    const room2 = rooms[i + 1];

    // Get center points of rooms
    const x1 = Math.floor(room1.x + room1.width / 2);
    const y1 = Math.floor(room1.y + room1.height / 2);
    const x2 = Math.floor(room2.x + room2.width / 2);
    const y2 = Math.floor(room2.y + room2.height / 2);

    // Create wide L-shaped corridor
    const corridorWidth = 3;

    // Horizontal corridor first
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    for (let x = startX - 1; x <= endX + 1; x++) {
      for (let w = -1; w <= corridorWidth; w++) {
        const y = y1 + w;
        if (y >= 0 && y < height && x >= 0 && x < width) {
          grid[y][x].type = 'floor';
        }
      }
    }

    // Then vertical corridor
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    for (let y = startY - 1; y <= endY + 1; y++) {
      for (let w = -1; w <= corridorWidth; w++) {
        const x = x2 + w;
        if (y >= 0 && y < height && x >= 0 && x < width) {
          grid[y][x].type = 'floor';
        }
      }
    }

    // Add wider areas at corridor intersections
    const intersectionX = x2;
    const intersectionY = y1;
    for (let y = intersectionY - 2; y <= intersectionY + 2; y++) {
      for (let x = intersectionX - 2; x <= intersectionX + 2; x++) {
        if (y >= 0 && y < height && x >= 0 && x < width) {
          grid[y][x].type = 'floor';
        }
      }
    }
  }

  // Add coins in rooms (avoiding starting room)
  rooms.slice(1).forEach(room => {
    const numCoins = Math.floor(Math.random() * 3) + 3; // 3-5 coins per room
    let attempts = 0;
    let placed = 0;

    while (attempts < 20 && placed < numCoins) {
      const x = Math.floor(Math.random() * (room.width - 2)) + room.x + 1;
      const y = Math.floor(Math.random() * (room.height - 2)) + room.y + 1;
      
      if (grid[y][x].type === 'floor') {
        grid[y][x].type = 'coin';
        placed++;
      }
      attempts++;
    }
  });

  // Add charges (more rare, avoiding starting room)
  rooms.slice(1).forEach((room, index) => {
    if (index % 2 === 0) { // Only in every other room
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 10) {
        const x = Math.floor(Math.random() * (room.width - 2)) + room.x + 1;
        const y = Math.floor(Math.random() * (room.height - 2)) + room.y + 1;
        
        if (grid[y][x].type === 'floor') {
          grid[y][x].type = 'charge';
          placed = true;
        }
        attempts++;
      }
    }
  });

  // Add guards (avoiding starting room)
  const guards: GuardType[] = [];
  rooms.slice(1).forEach((room, index) => {
    // Create patrol path around room perimeter with some padding
    const patrolPath = [
      { x: room.x + 2, y: room.y + 2 },
      { x: room.x + room.width - 2, y: room.y + 2 },
      { x: room.x + room.width - 2, y: room.y + room.height - 2 },
      { x: room.x + 2, y: room.y + room.height - 2 }
    ];

    guards.push({
      id: `guard-${index}`,
      position: patrolPath[0],
      direction: 'right',
      path: patrolPath,
      currentPathIndex: 0,
      isAlerted: false,
      visionRange: 5
    });
  });

  // Calculate starting position (center of starting room)
  const startPosition = {
    x: startRoom.x + Math.floor(startRoom.width / 2),
    y: startRoom.y + Math.floor(startRoom.height / 2)
  };

  return { grid, guards, startPosition };
}

export function generateLevel(level: number) {
  return generateDungeon(30, 30);
}
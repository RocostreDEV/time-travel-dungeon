import React from 'react';
import { CellType } from '../types';

interface CellProps {
  type: CellType;
  x: number;
  y: number;
}

const Cell: React.FC<CellProps> = ({ type, x, y }) => {
  const baseClasses = "w-full h-full transition-colors duration-200";
  
  const getCellClasses = () => {
    switch (type) {
      case 'wall':
        return 'bg-red-600';
      case 'floor':
        return 'bg-gray-700';
      case 'checkpoint':
        return 'bg-blue-400';
      case 'coin':
        return 'bg-yellow-400';
      case 'charge':
        return 'bg-green-400';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div 
      className={`${baseClasses} ${getCellClasses()}`}
      style={{
        gridColumn: x + 1,
        gridRow: y + 1,
      }}
    />
  );
};

export default Cell;
import React from 'react';
import { CellType } from '../types';

interface CellProps {
  type: CellType;
  x: number;
  y: number;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  const baseClasses = "w-[20px] h-[20px] transition-all duration-300";
  
  const getCellClasses = () => {
    switch (type) {
      case 'wall':
        return 'cell-wall';
      case 'floor':
        return 'cell-floor';
      case 'coin':
        return 'cell-floor';
      case 'charge':
        return 'cell-floor';
      default:
        return 'cell-floor';
    }
  };

  return (
    <div className={`${baseClasses} ${getCellClasses()} relative`}>
      {type === 'coin' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-float coin-glow">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-pulse-ring" />
            <div className="absolute inset-0 bg-yellow-400/50 rounded-full animate-glow" />
          </div>
        </div>
      )}
      {type === 'charge' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-float charge-glow">
            <div className="absolute inset-0 bg-blue-400/30 rounded-full animate-pulse-ring" />
            <div className="absolute inset-0 bg-blue-400/50 rounded-full animate-glow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cell;
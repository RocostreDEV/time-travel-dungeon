import React from 'react';
import { GuardType } from '../types';

const Guard: React.FC<GuardType> = ({ x, y, direction, isAlerted }) => {
  return (
    <div
      className="absolute w-[calc(100%/30)] h-[calc(100%/30)] transition-all duration-200 ease-in-out"
      style={{
        left: `${(x * 100) / 30}%`,
        top: `${(y * 100) / 30}%`,
      }}
    >
      <div 
        className={`w-full h-full rounded-full shadow-lg transform transition-transform
          ${isAlerted ? 'bg-red-500' : 'bg-blue-500'}`}
      />
    </div>
  );
};

export default Guard;
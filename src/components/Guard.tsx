import React from 'react';
import { GuardType } from '../types';

interface GuardProps {
  guard: GuardType;
}

const Guard: React.FC<GuardProps> = ({ guard }) => {
  const { position, direction, isAlerted } = guard;

  const getFlashlightAngle = () => {
    switch (direction) {
      case 'up': return '0deg';
      case 'right': return '90deg';
      case 'down': return '180deg';
      case 'left': return '270deg';
      default: return '0deg';
    }
  };

  return (
    <div
      className="absolute w-[20px] h-[20px] transition-all duration-300"
      style={{
        left: `${position.x * 20}px`,
        top: `${position.y * 20}px`,
        transform: `rotate(${getFlashlightAngle()})`,
      }}
    >
      {/* Guard body */}
      <div className={`
        w-full h-full rounded-full relative
        ${isAlerted ? 'bg-red-500' : 'bg-blue-500'}
        transition-colors duration-300
        ${isAlerted ? 'shadow-lg shadow-red-500/50' : 'shadow-lg shadow-blue-500/50'}
      `}>
        <div className={`
          absolute inset-0 rounded-full
          ${isAlerted ? 'bg-red-400/30' : 'bg-blue-400/30'}
          animate-pulse
        `} />
        
        {/* Guard "face" direction indicator */}
        <div className={`
          absolute w-2 h-2 rounded-full
          ${isAlerted ? 'bg-red-200' : 'bg-blue-200'}
          transition-colors duration-300
        `} style={{ 
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)'
        }} />
      </div>

      {/* Flashlight cone */}
      <div className={`
        absolute h-[120px] -z-10 origin-bottom
        ${isAlerted ? 'guard-alert' : 'guard-vision'}
        transition-all duration-300
      `}
      style={{
        width: '120px',
        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        transform: 'translateY(-100%)',
      }} />
    </div>
  );
};

export default Guard;
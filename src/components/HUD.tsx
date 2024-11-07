import React from 'react';
import { Battery, Coins } from 'lucide-react';

interface HUDProps {
  charges: number;
  coins: number;
  floor: number;
  difficulty: string;
}

const HUD: React.FC<HUDProps> = ({ charges, coins, floor, difficulty }) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between bg-gray-800 bg-opacity-90 rounded-lg p-4 z-10">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Battery className="w-6 h-6 text-green-400" />
          <span className="text-white font-bold">{charges}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          <span className="text-white font-bold">{coins}</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-white font-bold">
          Floor {floor}
        </div>
        <div className="text-white font-bold uppercase">
          {difficulty} Mode
        </div>
      </div>
    </div>
  );
};

export default HUD;
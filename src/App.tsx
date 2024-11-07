import React from 'react';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  );
}

export default App;
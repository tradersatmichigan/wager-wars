import React from 'react';
import type { GameState } from '../../types';

interface GameOverScreenProps {
  gameState: GameState;
}

// TODO: Need to add the historical data and team performance from the last round to keep consistency with other results

function GameOverScreen({ gameState }: GameOverScreenProps) {
  return (
    <div className="game-over-screen">
      <div className="game-over-header">
        <h1>Game Complete!</h1>
        <h2>All {gameState.rounds_completed} rounds have been completed.</h2>
      </div>
      
      <div className="final-stack">
        <h3>Your Final Stack</h3>
        <div className="final-stack-amount">${gameState.current_stack.toLocaleString()}</div>
      </div>
    </div>
  );
}

export default GameOverScreen;

import React from 'react';
import Leaderboard from '../player/Leaderboard';
import type { GameState } from '../../types';

interface AdminGameOverScreenProps {
  gameState: GameState;
}

function AdminGameOverScreen({ gameState }: AdminGameOverScreenProps) {
  return (
    <div className="admin-projection-panel">
      {/* Header */}
      <div className="admin-header">
        <h1>Trading Competition</h1>
        <div className="admin-controls-badge">ADMIN CONTROLS</div>
      </div>
      
      <div className="admin-game-over">
        <div className="admin-game-over-header">
          <h2>Game Completed!</h2>
          <p>All {gameState.rounds_completed} rounds have been completed.</p>
        </div>
        
        <div className="admin-final-results">
          <h3>Final Standings</h3>
          <Leaderboard />
        </div>
        
        <div className="admin-game-over-footer">
          <p>The game has ended. Players are viewing the final results.</p>
          <p className="admin-info">To start a new game, please visit the Django Admin Panel.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminGameOverScreen;

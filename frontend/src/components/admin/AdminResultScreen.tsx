import React, { useState, useEffect } from 'react';
import { fetchData, postData } from '../../utils/fetch-utils';
import Leaderboard from '../player/Leaderboard';
import type { GameState } from '../../types';

interface AdminResultScreenProps {
  gameState: GameState;
  result: boolean | null;
  startNextRound: () => Promise<void>;
  loading: boolean;
}

function AdminResultScreen({ 
  gameState, 
  result, 
  startNextRound, 
  loading 
}: AdminResultScreenProps) {
  const [isLastRound, setIsLastRound] = useState<boolean>(false);
  const [endingGame, setEndingGame] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if this is the final round - either from gameState or API
    const checkIfLastRound = async () => {
      // If we already know it's the final round from gameState, use that
      if (gameState.final_round) {
        setIsLastRound(true);
        return;
      }
      
      // Otherwise check via the rounds API
      try {
        const response = await fetchData('/api/admin/rounds/');
        setIsLastRound(response.pending_rounds === 0);
      } catch (error) {
        console.error('Error checking rounds:', error);
      }
    };
    
    checkIfLastRound();
  }, [gameState]);

  const handleEndGame = async () => {
    setEndingGame(true);
    try {
      console.log("Ending game via API...");
      // Make actual API call to end the game
      await postData('/api/admin/game/end/', {});
      
      // After a short delay to let API complete, reload page to show game over screen
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error ending game:', error);
      setEndingGame(false);
    }
  };

  return (
    <div className="admin-projection-panel">
      {/* Header */}
      <div className="admin-header">
        <h1>Trading Competition</h1>
        <div className="admin-controls-badge">ADMIN CONTROLS</div>
      </div>
      
      {/* Round Information */}
      <div className="admin-round-info">
        <h2>Round {gameState.round_number}</h2>
        <h3>{gameState.question}</h3>
        
        <div className="round-details">
          <div className="probability-badge">Prob: {(gameState.probability ? gameState.probability * 100 : 0).toFixed(0)}%</div>
          <div className="multiplier-badge">Mult: {gameState.multiplier}x</div>
        </div>
      </div>
      
      {/* Success/Failure Result */}
      <div className={`admin-result ${result ? 'success-result' : 'failure-result'}`}>
        <div className="result-circle">
          {result ? (
            <div className="result-icon">
              <svg viewBox="0 0 24 24" width="120" height="120" stroke="#4caf50" strokeWidth="3" fill="none">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          ) : (
            <div className="result-icon">
              <svg viewBox="0 0 24 24" width="120" height="120" stroke="#f44336" strokeWidth="3" fill="none">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          )}
        </div>
        
        <div className="result-text">
          {result ? 'SUCCESS!' : 'FAILURE!'}
        </div>
        
        {isLastRound ? (
          <>
            <h2 className="game-over-title">Final Round Complete!</h2>
            <p className="game-over-subtitle">All rounds have been completed.</p>
            
            <button 
              onClick={handleEndGame} 
              className="end-game-button"
              disabled={endingGame}
            >
              {endingGame ? 'Ending Game...' : 'End Game & Show Results'}
            </button>
            
            <div className="admin-leaderboard-container">
              <h2>Final Standings</h2>
              <Leaderboard />
            </div>
          </>
        ) : (
          <button 
            onClick={startNextRound} 
            className="next-round-button"
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Start Next Round'}
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminResultScreen;

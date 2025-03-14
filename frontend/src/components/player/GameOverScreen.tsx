import React, { useState, useEffect } from 'react';
import type { GameState } from '../../types';

interface GameOverScreenProps {
  gameState: GameState;
}

function GameOverScreen({ gameState }: GameOverScreenProps) {
  const [teamStack, setTeamStack] = useState<number | null>(null);

  useEffect(() => {
    const fetchTeamStack = async () => {
      try {
        const response = await fetch('/api/teams/stack/', {
          method: 'GET',
        });

        const data = await response.json();

        if (data.success) {
          setTeamStack(data.stack);
        } else {
          console.error('Failed to fetch team stack:', data.error);
        }
      } catch (error) {
        console.error('Error fetching team stack:', error);
      }
    };

    if (gameState.team_name) {
      fetchTeamStack();
    }
  }, [gameState]);
  return (
    <div className="game-over-screen">
      <div className="game-over-header">
        <h1>Game Complete!</h1>
        <h2>All {gameState.rounds_completed} rounds have been completed.</h2>
      </div>
      {teamStack !== null && (
        <div className="final-stack">
          <h3>Your Final Team Stack</h3>
          <div className="player-stack">
            ${teamStack.toLocaleString()}
          </div>
        </div>
      )}
    </div>

  );
}

export default GameOverScreen;

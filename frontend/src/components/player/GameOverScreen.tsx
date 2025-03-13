import React, { useState, useEffect } from 'react';
import type { GameState } from '../../types';

interface GameOverScreenProps {
  gameState: GameState;
}

// TODO: Need to add the historical data and team performance from the last round to keep consistency with other results

function GameOverScreen({ gameState }: GameOverScreenProps) {
  const [teamStack, setTeamStack] = useState<number | null>(null);

  // Add these console logs to your useEffect to diagnose the issue
  useEffect(() => {
    console.log("Team name:", gameState.team_name); // Check if team name exists

    const fetchTeamStack = async () => {
      try {
        console.log("Fetching team stack...");
        const response = await fetch('/api/teams/stack/', {
          method: 'GET',
        });

        console.log("Response status:", response.status);

        // Rest of your code...

        const data = await response.json();
        console.log("API response data:", data); // Check what the API returns

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
    } else {
      console.log("No team name, skipping API call");
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

import React, { useState, useEffect } from 'react';

interface PlayerInfoProps {
  currentStack: number;
  teamName?: string;
}

function PlayerInfo({ currentStack, teamName }: PlayerInfoProps) {
  // useState to hold state of player stack and team stack
  const [playerStack, setPlayerStack] = useState(currentStack);
  const [teamStack, setTeamStack] = useState<number>(0);

  // useEffect to get player and team stack
  useEffect(() => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    // Initialize player stack with the prop value
    setPlayerStack(currentStack);

    // Function to fetch team stack
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

    fetchTeamStack();
  }, [currentStack, teamName]);

  return (
    <div className="player-info" style={{ width: "100%" }}>
      <div className="stack-container">
        <div className="stack-label">Your Stack</div>
        <div className="player-stack">${playerStack.toLocaleString()}</div>
      </div>

      <div className="team-container">
        <div className="team-label">Team Stack</div>
        <div className="player-stack">${teamStack.toLocaleString()}</div>
      </div>

      <div className="team-container">
        <div className="team-label">Team</div>
        <div className="player-stack">{teamName}</div>
      </div>
    </div>
  );
}

export default PlayerInfo;

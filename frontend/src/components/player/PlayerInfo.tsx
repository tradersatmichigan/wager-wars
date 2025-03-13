import { Widgets } from '@mui/icons-material';
import React from 'react';

interface PlayerInfoProps {
  currentStack: number;
  teamName?: string;
}

function PlayerInfo({ currentStack, teamName }: PlayerInfoProps) {
  return (
    <div className="player-info" style={{width: "100%"}}>
      <div className="stack-container">
        <div className="stack-label">Your Stack</div>
        <div className="player-stack">${currentStack.toLocaleString()}</div>
      </div>
      
      {teamName && (
        <div className="team-container">
          <div className="team-label">Team</div>
          <div className="team-name">{teamName}</div>
        </div>
      )}
    </div>
  );
}

export default PlayerInfo;

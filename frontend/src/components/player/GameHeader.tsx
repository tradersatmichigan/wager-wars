import React from 'react';

interface GameHeaderProps {
  roundNumber: number;
  question: string;
  phase: number;
  timeRemaining: number;
}

function GameHeader({ roundNumber, question, phase, timeRemaining }: GameHeaderProps) {
  // Phase names for display
  const phaseNames = [
    'Initial Betting',
    'Information',
    'Final Betting',
    'Results'
  ];
  
  // Format timer display
  function formatTime(seconds: number): string {
    return `${Math.floor(seconds)}`; // Use Math.floor to ensure integer
  }
  
  return (
    <div className="game-header">
      <div className="player-round-info">
        <h1>Round {roundNumber}: {question}</h1>
        <div className="phase-name">Phase: {phaseNames[phase]}</div>
      </div>
      
      <div className="timer">
        {formatTime(timeRemaining)}
      </div>
      
      <div className="player-phase-indicator">
        <div className={`player-phase-step ${phase >= 0 ? 'active' : ''} ${phase > 0 ? 'completed' : ''}`}>
          <div className="player-phase-dot">
            {phase > 0 ? '✓' : '1'}
          </div>
          <div className="player-phase-label">Initial Betting</div>
        </div>
        
        <div className={`player-phase-step ${phase >= 1 ? 'active' : ''} ${phase > 1 ? 'completed' : ''}`}>
          <div className="player-phase-dot">
            {phase > 1 ? '✓' : '2'}
          </div>
          <div className="player-phase-label">Information</div>
        </div>
        
        <div className={`player-phase-step ${phase >= 2 ? 'active' : ''} ${phase > 2 ? 'completed' : ''}`}>
          <div className="player-phase-dot">
            {phase > 2 ? '✓' : '3'}
          </div>
          <div className="player-phase-label">Final Betting</div>
        </div>
      </div>
    </div>
  );
}

export default GameHeader;

import React, { useState, useEffect } from 'react';
import type { GameState } from '../../types';

interface AdminSuspenseRevealScreenProps {
  roundInfo: GameState;
}

function AdminSuspenseRevealScreen({ roundInfo }: AdminSuspenseRevealScreenProps) {
  const [countdown, setCountdown] = useState<number | string>(3);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          return "now!";
        }
        if (typeof prev === 'number') {
          return prev - 1;
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="admin-projection-panel">
      {/* Header */}
      <div className="admin-header">
        <h1>Trading Competition</h1>
        <div className="admin-controls-badge">ADMIN CONTROLS</div>
      </div>
      
      {/* Round Information */}
      <div className="admin-round-info">
        <h2>Round {roundInfo.round_number}</h2>
        <h3>{roundInfo.question}</h3>
        
        <div className="round-details">
          <div className="probability-badge">Prob: {(roundInfo.probability ? roundInfo.probability * 100 : 0).toFixed(0)}%</div>
          <div className="multiplier-badge">Mult: {roundInfo.multiplier}x</div>
        </div>
      </div>
      
      {/* Result Reveal Animation */}
      <div className="reveal-container">
        <div className="question-mark-circle">
          <div className="question-mark">?</div>
        </div>
        
        <div className="countdown-text">
          Revealing result in {countdown}...
        </div>
        
        <div className="heartbeat-visualization">
          {/* Heartbeat animation - implemented in CSS */}
        </div>
      </div>
    </div>
  );
}

export default AdminSuspenseRevealScreen;

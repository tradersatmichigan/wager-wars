import React from 'react';
import type { GameState } from '../../types';

interface AdminSimulationRunningScreenProps {
  roundInfo: GameState;
}

function AdminSimulationRunningScreen({ roundInfo }: AdminSimulationRunningScreenProps) {
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
      
      {/* Simulation Animation */}
      <div className="simulation-container">
        <h2 className="simulation-title">Running Simulation</h2>
        
        <div className="binary-data-animation">
          {/* Binary data animation content - implemented in CSS */}
        </div>
        
        <div className="simulation-progress">
          <div className="progress-ring">
            <div className="rotating-arc"></div>
          </div>
          <div className="calculation-text">Calculating...</div>
        </div>
        
        <div className="suspense-text">Determining results...</div>
        
        <div className="market-graph-animation">
          {/* Market graph animation - implemented in CSS */}
        </div>
      </div>
    </div>
  );
}

export default AdminSimulationRunningScreen;

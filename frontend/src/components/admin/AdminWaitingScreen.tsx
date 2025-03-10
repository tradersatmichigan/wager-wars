import React from 'react'

interface AdminWaitingScreenProps {
  startRound: () => Promise<void>;
  nextRoundNumber: number;
  loading: boolean;
}

function AdminWaitingScreen({ 
  startRound, 
  nextRoundNumber, 
  loading 
}: AdminWaitingScreenProps) {
  return (
    <div className="admin-projection-panel">
      {/* Header */}
      <div className="admin-header">
        <h1>Trading Competition</h1>
        <div className="admin-controls-badge">ADMIN CONTROLS</div>
      </div>
      
      {/* Waiting Screen Content */}
      <div className="admin-waiting">
        <h2 className="waiting-title">Ready to Begin</h2>
        <h3 className="waiting-subtitle">Trading Competition</h3>
        
        <div className="next-round-info">
          Next: Round {nextRoundNumber}
        </div>
        
        <div className="waiting-dots">
          <div className="waiting-dot"></div>
          <div className="waiting-dot"></div>
          <div className="waiting-dot"></div>
        </div>
        
        <button 
          onClick={startRound} 
          disabled={loading} 
          className="start-first-round"
        >
          Start Round {nextRoundNumber}
        </button>
        
        <div className="admin-help-text">
          Press to begin the round when everyone is ready
        </div>
      </div>
    </div>
  );
}

export default AdminWaitingScreen;

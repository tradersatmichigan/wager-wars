import React, { useState, useEffect } from 'react';

import AdminLoadingScreen from './AdminLoadingScreen';
import AdminWaitingScreen from './AdminWaitingScreen';
import AdminSimulationRunningScreen from './AdminSimulationRunningScreen';
import AdminSuspenseRevealScreen from './AdminSuspenseRevealScreen';
import AdminResultScreen from './AdminResultScreen';
import AdminGameOverScreen from './AdminGameOverScreen';

import { type GameState, RoundPhaseEnum } from '../../types';
import { fetchData, postData } from '../../utils/fetch-utils';

type SimulationState = 'idle' | 'running' | 'suspense' | 'revealed';

function AdminProjectionPanel() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [simulationResult, setSimulationResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Poll for game state
  useEffect(() => {
    const fetchGameState = async (): Promise<void> => {
      try {
        const data = await fetchData<GameState>('/api/game/state/');
        console.log('Game state:', data); // Add this to debug
        setGameState(data);
      } catch (error) {
        console.error('Error fetching game state:', error);
      }
    };
    
    fetchGameState();
    const interval = setInterval(fetchGameState, 1000); // Poll every second for accurate timer
    return () => clearInterval(interval);
  }, []);
  
  // Reset simulation state when round changes
  useEffect(() => {
    if (gameState?.round_id) {
      setSimulationState('idle');
      setSimulationResult(null);
    }
  }, [gameState?.round_id]);
  
  const startNextRound = async (): Promise<void> => {
    setLoading(true);
    try {
      await postData('/api/admin/rounds/start/', {});
      const data = await fetchData<GameState>('/api/game/state/');
      setGameState(data);
      setSimulationState('idle');
    } catch (error: any) {
      console.error('Error starting round:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const simulateRound = async (): Promise<void> => {
    if (simulationState !== 'idle') return;
    
    // Start simulation animation
    setSimulationState('running');
    
    // Play simulation running animation for 3-5 seconds
    setTimeout(() => {
      setSimulationState('suspense');
      
      // Play suspense animation for 3 seconds
      setTimeout(async () => {
        try {
          const response = await postData<{success: boolean, result: boolean}>('/api/admin/rounds/simulate/', {});
          setSimulationResult(response.result);
          setSimulationState('revealed');
          
          // Refresh game state after simulation
          const gameData = await fetchData<GameState>('/api/game/state/');
          setGameState(gameData);
        } catch (error: any) {
          console.error('Error simulating round:', error);
          setSimulationState('idle');
        }
      }, 3000); // Suspense animation duration
      
    }, 4000); // Simulation running animation duration
  };
  
  if (!gameState) return <AdminLoadingScreen />;
  
  // Handle game completed state - NEW SECTION
  if (gameState.game_completed) {
    console.log('Game completed state detected in AdminProjectionPanel');
    return <AdminGameOverScreen gameState={gameState} />;
  }
  
  // Handle simulation states
  if (simulationState === 'running') {
    return <AdminSimulationRunningScreen roundInfo={gameState} />;
  }
  
  if (simulationState === 'suspense') {
    return <AdminSuspenseRevealScreen roundInfo={gameState} />;
  }
  
  if (simulationState === 'revealed') {
    return (
      <AdminResultScreen 
        gameState={gameState} 
        result={simulationResult}
        startNextRound={startNextRound} 
        loading={loading} 
      />
    );
  }
  
  // Handle different game states
  if (gameState.waiting_for_first_round) {
    return <AdminWaitingScreen 
      startRound={startNextRound} 
      nextRoundNumber={gameState.next_round_number || 1} 
      loading={loading} 
    />;
  }
  
  if (gameState.waiting_for_next_round) {
    return <AdminWaitingScreen 
      startRound={startNextRound} 
      nextRoundNumber={(gameState.current_round_number || 0) + 1} 
      loading={loading} 
    />;
  }
  
  // Active round display (rest of the component remains the same)
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
      
      {/* Timer Display */}
      <div className={`timer-display phase-${gameState.current_phase}`}>
        <div className="timer-circle">
          <div className="timer-value">
            {Math.floor((gameState.time_remaining || 0) / 60)}:{Math.floor((gameState.time_remaining || 0) % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="admin-phase-label">
          {gameState.current_phase === 0 ? 'Initial Betting Phase' :
           gameState.current_phase === 1 ? 'Information Phase' :
           gameState.current_phase === 2 ? 'Final Betting Phase' : 'Results Phase'}
        </div>
        
        {gameState.current_phase === 1 && (
          <div className="phase-instruction">Discuss with your teammates!</div>
        )}
        {gameState.current_phase === 3 && (
          <div className="phase-instruction">Ready to run simulation!</div>
        )}
      </div>
      
      {/* Phase Indicators */}
      <div className="phase-indicators">
        <div className={`phase-step ${gameState.current_phase && gameState.current_phase >= 0 ? 'active' : ''} ${gameState.current_phase && gameState.current_phase > 0 ? 'completed' : ''}`}>
          <div className="phase-dot">
            {gameState.current_phase && gameState.current_phase > 0 ? '✓' : '1'}
          </div>
          <div className="admin-phase-label">Initial Betting</div>
        </div>
        
        <div className={`phase-step ${gameState.current_phase && gameState.current_phase >= 1 ? 'active' : ''} ${gameState.current_phase && gameState.current_phase > 1 ? 'completed' : ''}`}>
          <div className="phase-dot">
            {gameState.current_phase && gameState.current_phase > 1 ? '✓' : '2'}
          </div>
          <div className="admin-phase-label">Information</div>
        </div>
        
        <div className={`phase-step ${gameState.current_phase && gameState.current_phase >= 2 ? 'active' : ''} ${gameState.current_phase && gameState.current_phase > 2 ? 'completed' : ''}`}>
          <div className="phase-dot">
            {gameState.current_phase && gameState.current_phase > 2 ? '✓' : '3'}
          </div>
          <div className="admin-phase-label">Final Betting</div>
        </div>
      </div>
      
      {/* Admin Control Buttons */}
      <div className="admin-actions">
        {gameState.current_phase === RoundPhaseEnum.RESULTS ? (
          <button 
            className="admin-button simulate-button" 
            disabled={loading}
            onClick={simulateRound}
          >
            Run Simulation
          </button>
        ) : (
          <button 
            className="admin-button start-button" 
            disabled={loading || (gameState.current_phase !== undefined && gameState.current_phase < 3)}
            onClick={startNextRound}
          >
            Start Next Round
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminProjectionPanel;

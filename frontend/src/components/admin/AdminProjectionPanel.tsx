import React, { useState, useEffect, useRef } from 'react';

import AdminLoadingScreen from './AdminLoadingScreen';
import AdminWaitingScreen from './AdminWaitingScreen';
import AdminSimulationRunningScreen from './AdminSimulationRunningScreen';
import AdminSuspenseRevealScreen from './AdminSuspenseRevealScreen';
import AdminResultScreen from './AdminResultScreen';
import AdminLeaderBoard from './AdminLeaderBoard';
import AdminGameOverScreen from './AdminGameOverScreen';

import { type GameState, RoundPhaseEnum, type SimulationState} from '../../types';
import { fetchData, postData } from '../../utils/fetch-utils';

import { Paper, Typography, Stack, Box } from '@mui/material';

function hasPhaseChanged(prev: GameState | null, next: GameState): boolean {
  if (!prev) return true;
  return (
    prev.current_phase !== next.current_phase ||
    prev.round_id !== next.round_id
  );
}

function AdminProjectionPanel() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [localTimer, setLocalTimer] = useState<number>(30);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [simulationResult, setSimulationResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [test, setTest] = useState(true);
  const gameStateRef = useRef(gameState);
  const localTimerRef = useRef(localTimer);
  const pollCounterRef = useRef<number>(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    localTimerRef.current = localTimer;
  }, [localTimer]);
  
  // Poll for game state
  useEffect(() => {
    const intervalId = setInterval(async () => {
      // When no game state exists or we're still waiting for the first round,
      // poll every 3 seconds.
      if (!gameStateRef.current || gameStateRef.current.waiting_for_first_round) {
        pollCounterRef.current++;
        if (pollCounterRef.current >= 3) {
          try {
            const data = await fetchData<GameState>('/api/game/state/');
            console.log('polling');
            // On the very first poll or when waiting, sync the timer.
            if (hasPhaseChanged(gameStateRef.current, data) && data.time_remaining !== undefined) {
              setLocalTimer(Math.floor(data.time_remaining));
            }
            setGameState(data);
          } catch (error) {
            console.error('Error fetching game state:', error);
          }
          pollCounterRef.current = 0;
        }
        return; // Exit early so we don't run the countdown below.
      }

      // Active round: decrement the local timer every second.
      setLocalTimer(prev => Math.max(prev - 1, 0));

      // When the timer is in the last 3 seconds, poll every second.
      if (localTimerRef.current <= 3) {
        try {
          const data = await fetchData<GameState>('/api/game/state/');
          console.log('polling');
          // If a new phase/round is detected, sync the timer.
          if (hasPhaseChanged(gameStateRef.current, data) && data.time_remaining !== undefined) {
            setLocalTimer(Math.floor(data.time_remaining));
          }
          setGameState(data);
        } catch (error) {
          console.error('Error fetching game state:', error);
        }
      }
    }, 1000); // Tick every second

    return () => clearInterval(intervalId);
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
    setTest(true);
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
          console.log('polling');
          setGameState(gameData);
        } catch (error: any) {
          console.error('Error simulating round:', error);
          setSimulationState('idle');
        }

        setTimeout(async () => {
          setSimulationState('result');
        }, 5000);

      }, 3000); // Suspense animation duration
      
    }, 4000); // Simulation running animation duration
  };

  if (!gameState) return <AdminLoadingScreen />;
  
  // Handle game completed state - NEW SECTION
  if (gameState.game_completed) {
    console.log('Game completed state detected in AdminProjectionPanel');
    return <AdminGameOverScreen />;
  }
  
  // if (test) {
  //   return (
  //     <AdminLeaderBoard 
  //       gameState={gameState}
  //       startNextRound={startNextRound}
  //       loading={loading}
  //     />
  //   );
  // }

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
        loading={loading} 
      />
    );
  }

  if (simulationState === 'result') {
    return (
      <AdminLeaderBoard 
        gameState={gameState}
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

  const odds = () => {
    if (!gameState.multiplier) {
      return;
    }

    if (Number.isInteger(gameState.multiplier)) {
      return `${gameState.multiplier}:1`; // Whole numbers remain unchanged
    }
  
    const precision = 1e9; // Precision to handle floating points
    let numerator = Math.round(gameState.multiplier * precision);
    let denominator = precision;
  
    // Greatest Common Divisor function (Euclidean Algorithm)
    function gcd(a: number, b: number): number {
      return b === 0 ? a : gcd(b, a % b);
    }
  
    const divisor = gcd(numerator, denominator);
    
    // Simplify fraction
    numerator /= divisor;
    denominator /= divisor;
  
    return `${numerator}:${denominator}`;
  }
  
  // Active round display (rest of the component remains the same)
  return (
    <div className="admin-projection-panel">
      
      {/* Round Information */}
      <div className="admin-round-info">
        <Paper elevation={0} sx={{ backgroundColor: "#2d4a7c", borderRadius: "0.75rem"}}>
          <Typography sx={{fontSize: "2.75rem", p: "0.5rem", margin: "0.5rem", fontWeight: "bold", color: "white"}}>
            Round {gameState.round_number}
          </Typography>
        </Paper>
        <Box>
          <h3>{gameState.question}</h3>
        </Box>
      </div>
      
      <Box display="flex" justifyContent="center" width="100%" mt={15} mb={15}>
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" // Ensures left & right elements move, timer stays fixed
          width="70%" // Adjust based on layout needs
          position="relative" // Required for absolute centering of timer
        >
          {/* Left Element (Multiplier) */}
          <Paper 
            elevation={0}
            sx={{
              borderRadius: "2rem",
              backgroundColor:"#3772ff",
              height: "25%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1.5rem"
            }}
          >
            <Typography sx={{ fontSize: "2rem", fontWeight: "600", color: "white" }}>
              Odds - {odds()}
            </Typography>
          </Paper>

          {/* Centered Timer - Absolutely Positioned */}
          <Box 
            sx={{ 
              position: "absolute", 
              left: "50%", 
              transform: "translateX(-50%)" // Ensures it stays perfectly centered
            }}
          >
            <div className={`timer-display phase-${gameState.current_phase}`}>
              <div className="timer-circle">
                <div className="timer-value">
                  {Math.floor(localTimer / 60)}:
                  {Math.floor(localTimer % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </Box>

          {/* Right Element (Phase Information) */}
          <Stack alignItems="center">
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
          </Stack>
        </Stack>
      </Box>

      
      
      {/* Phase Indicators */}
      <div className="phase-indicators">
        <div className={`phase-step ${gameState.current_phase && gameState.current_phase > 0 ? 'completed' : 'active'}`}>
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
        {gameState.time_remaining === 0 ? (
          gameState.current_phase === RoundPhaseEnum.RESULTS && (
            <button 
              className="admin-button simulate-button" 
              disabled={loading}
              onClick={simulateRound}
            >
              Run Simulation
            </button>
          )
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

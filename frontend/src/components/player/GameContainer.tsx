import React, { useState, useEffect, useCallback, useRef } from 'react';

import GameHeader from './GameHeader';
import PlayerInfo from './PlayerInfo';
import BettingForm from './BettingForm';
import TeamBetsDisplay from './TeamBetsDisplay';
import ResultsDisplay from './ResultsDisplay';
import Leaderboard from './Leaderboard';
import LoadingSpinner from '../common/LoadingSpinner';
import GameOverScreen from './GameOverScreen';

import { type GameState, RoundPhaseEnum } from '../../types';
import { fetchData } from '../../utils/fetch-utils';

function GameContainer() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [localTimer, setLocalTimer] = useState<number>(30);
  const basePollInterval = 3000;
  const lastPollTime = useRef<number>(Date.now());
  const pollTimeoutRef = useRef<number | null>(null);

  // Determine appropriate polling interval based on game state
  const getPollInterval = useCallback((): number => {
    if (!gameState) return 3000; // Default interval
    
    // Poll more frequently during critical phases
    if (gameState.current_phase === RoundPhaseEnum.RESULTS) {
      return 1000; // Fast polling during results phase
    }
    
    // Poll more frequently near phase transitions
    if (localTimer <= 3) {
      return 1000; // Fast polling for last 3 seconds of a phase
    }
    
    if (localTimer <= 10) {
      return 2000; // Medium polling for last 10 seconds of a phase
    }
    
    return basePollInterval; // Normal polling otherwise
  }, [gameState, localTimer, basePollInterval]);

  // Main polling function with adaptive interval
  const pollGameState = useCallback(async () => {
    try {
      const data = await fetchData<GameState>('/api/game/state/');
      console.log(data)
      
      // Update game state
      setGameState(prev => {
        // Only update if something changed (prevents unnecessary re-renders)
        if (!prev || 
            prev.current_phase !== data.current_phase || 
            prev.round_id !== data.round_id ||
            prev.current_stack !== data.current_stack ||
            prev.result !== data.result ||
            prev.status !== data.status) {
          console.log("updating state: ", data);
          return data;
        }
        console.log(prev.current_phase === RoundPhaseEnum.RESULTS)
        return prev;
      });
      
      // Sync local timer with server, but only if significantly different
      if (data.time_remaining !== undefined && 
          Math.abs((data.time_remaining - localTimer)) > 2) {
        setLocalTimer(Math.floor(data.time_remaining));
      }
      
      // Record successful poll time
      lastPollTime.current = Date.now();
      
      // Schedule next poll with dynamic interval
      const interval = getPollInterval();
      
      // Use window.setTimeout and store the numeric ID
      pollTimeoutRef.current = window.setTimeout(pollGameState, interval);
      
    } catch (error) {
      console.error('Error fetching game state:', error);
      
      // On error, back off polling frequency
      pollTimeoutRef.current = window.setTimeout(pollGameState, 5000);
    }
  }, [getPollInterval, localTimer]);
  
  // Initialize polling
  useEffect(() => {
    pollGameState();
    
    return () => {
      if (pollTimeoutRef.current !== null) {
        // Use window.clearTimeout with the numeric ID
        window.clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [pollGameState]);  
  // Local timer countdown - separate from polling
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setLocalTimer(prev => {
        // If we haven't polled in 10 seconds, pause the timer
        // This prevents timer from drifting too far from server
        const timeSinceLastPoll = Date.now() - lastPollTime.current;
        if (timeSinceLastPoll > 10000) {
          return prev;
        }
        return Math.max(0, Math.floor(prev - 1));
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, []);
  
  if (!gameState) return <LoadingSpinner />;

  if (gameState.waiting_for_first_round) {
    return (
      <div className="game-container">
        <div className="waiting-state">
          <h2>Waiting for the next round to begin</h2>
          <p>The admin will start the round shortly.</p>
        </div>

        <PlayerInfo currentStack={gameState.current_stack} />
        <Leaderboard />
      </div>
    );
  }
  
  if (gameState.game_completed) {
    console.log("Game completed state detected");
    return (
      <div className="game-container">
        <GameOverScreen gameState={gameState} />
        <Leaderboard />
      </div>
    );
  }
  
  //if (gameState.round_error) {
  //  return (
  //    <div className="game-container">
  //      <div className="error-state">
  //        <h2>Error</h2>
  //        <p>{gameState.error_message}</p>
  //      </div>
  //
  //      <PlayerInfo currentStack={gameState.current_stack} />
  //    </div>
  //  );
  //}

  console.log(gameState.current_phase === RoundPhaseEnum.RESULTS);
  
  return (
    <div className="game-container">
      <GameHeader 
        roundNumber={gameState.round_number || 0}
        question={gameState.question || ""}
        phase={gameState.current_phase || 0}
        timeRemaining={localTimer}
      />
      
      <PlayerInfo 
        currentStack={gameState.current_stack} 
      />
      
      {gameState.current_phase === RoundPhaseEnum.INITIAL_BETTING && (
        <BettingForm 
          gameState={gameState}
          phase="initial"
        />
      )}
      
      {gameState.current_phase === RoundPhaseEnum.INFORMATION && (
        <>
          <TeamBetsDisplay />
          <Leaderboard />
        </>
      )}
      
      {gameState.current_phase === RoundPhaseEnum.FINAL_BETTING && (
        <BettingForm 
          gameState={gameState}
          phase="final"
        />
      )}
      
      {gameState.current_phase === RoundPhaseEnum.RESULTS && (
        <ResultsDisplay 
          result={gameState.result}
          roundCompleted={gameState.round_completed}
        />
      )}
    </div>
  );
}

export default GameContainer;

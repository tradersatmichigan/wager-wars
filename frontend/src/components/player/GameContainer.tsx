import React, { useState, useEffect, useCallback, useRef } from 'react';

import GameHeader from './GameHeader';
import PlayerInfo from './PlayerInfo';
import BettingForm from './BettingForm';
import TeamBetsDisplay from './TeamBetsDisplay';
import ResultsDisplay from './ResultsDisplay';
import Leaderboard from '../common/Leaderboard';
import LoadingSpinner from '../common/LoadingSpinner';
import GameOverScreen from './GameOverScreen';

import { Box, Paper, Typography } from '@mui/material';

import { type GameState, RoundPhaseEnum } from '../../types';
import { fetchData } from '../../utils/fetch-utils';
import Instructions from '../common/Intructions';

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
        <Box display={"flex"} flexDirection="column" alignItems={"center"} width={"100%"} mt={3}>
          
          <Paper elevation={4} sx={{width: "90%"}}>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <Typography variant="h3" gutterBottom mt={3}>
                Welcome to Wager Wars!
              </Typography>
            </Box>
            <Instructions />
            <Box display={"flex"} flexDirection="column" alignItems={"center"} padding={"2rem 2rem"}>
              <Typography variant='h6' fontWeight={"bold"} color='var(--primary)'>Waiting for game to start...</Typography>
              <Typography variant='body1' fontWeight={"bold"} color='black'>We will begin shortly</Typography>
              <Typography mt={3} variant='h5' color='black'>You are on Team {gameState.team_id}</Typography>
            </Box>
          </Paper>
        </Box>
      </div>
    );
  }
  
  if (gameState.game_completed) {
    console.log("Game completed state detected");
    return (
      <div className="game-container">
        <GameOverScreen gameState={gameState} />
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
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      width="100%" 
      padding={2}
    >
      {/* Wrap All Components in a Common Width */}
      <Box 
        width="90%"  // Ensures all child components take the same width
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={1} // Adds spacing between sections
      >
        <GameHeader 
          roundNumber={gameState.round_number || 0}
          question={gameState.question || ""}
          phase={gameState.current_phase || 0}
          timeRemaining={localTimer}
        />
  
        <PlayerInfo currentStack={gameState.current_stack} />
  
        {gameState.current_phase === RoundPhaseEnum.INITIAL_BETTING && (
          <BettingForm gameState={gameState} phase="initial" />
        )}
  
        {gameState.current_phase === RoundPhaseEnum.INFORMATION && <TeamBetsDisplay />}
  
        {gameState.current_phase === RoundPhaseEnum.FINAL_BETTING && (
          <BettingForm gameState={gameState} phase="final" />
        )}
  
        {gameState.current_phase === RoundPhaseEnum.RESULTS && (
          <ResultsDisplay 
            result={gameState.result}
            roundCompleted={gameState.round_completed}
          />
        )}
      </Box>
    </Box>
  );
  
}

export default GameContainer;

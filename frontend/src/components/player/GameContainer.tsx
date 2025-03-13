import React, { useState, useEffect, useCallback, useRef } from 'react';

import GameHeader from './GameHeader';
import PlayerInfo from './PlayerInfo';
import BettingForm from './BettingForm';
import TeamBetsDisplay from './TeamBetsDisplay';
import ResultsDisplay from './ResultsDisplay';
import LoadingSpinner from '../common/LoadingSpinner';
import GameOverScreen from './GameOverScreen';

import { Box, Paper, Typography } from '@mui/material';

import { type GameState, RoundPhaseEnum } from '../../types';
import { fetchData } from '../../utils/fetch-utils';
import Instructions from '../common/Intructions';

function hasPhaseChanged(prev: GameState | null, next: GameState): boolean {
  if (!prev) return true;
  return (
    prev.current_phase !== next.current_phase ||
    prev.round_id !== next.round_id
  );
}

function GameContainer() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [localTimer, setLocalTimer] = useState<number>(30);

  // Refs to hold the latest values for our interval callback
  const gameStateRef = useRef(gameState);
  const localTimerRef = useRef(localTimer);
  const pollCounterRef = useRef<number>(0);

  // Update refs on state change so our interval always sees the latest values.
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    localTimerRef.current = localTimer;
  }, [localTimer]);

  // Single useEffect to handle polling and timer countdown.
  useEffect(() => {
    const intervalId = setInterval(async () => {
      // If we don't have a game state or we're waiting for the first round, poll every 3 seconds.
      if (!gameStateRef.current || gameStateRef.current.waiting_for_first_round) {
        pollCounterRef.current++;
        if (pollCounterRef.current >= 3) {
          try {
            const data = await fetchData<GameState>('/api/game/state/');
            console.log('polling');
            // On the very first poll we want to sync the timer, or when waiting for first round.
            if (hasPhaseChanged(gameStateRef.current, data) && data.time_remaining !== undefined) {
              setLocalTimer(Math.floor(data.time_remaining));
            }
            setGameState(data);
          } catch (error) {
            console.error('Error fetching game state:', error);
          }
          pollCounterRef.current = 0; // reset counter after polling
        }
        return; // exit early so we don't run the countdown below
      }

      // Game state exists and we're in an active round.
      // Decrement the timer each second.
      setLocalTimer(prev => Math.max(prev - 1, 0));

      // When in the last 3 seconds, poll every second.
      if (localTimerRef.current <= 3) {
        try {
          const data = await fetchData<GameState>('/api/game/state/');
          console.log('polling');
          // If the phase (or round) changed, sync the timer using the server's time.
          if (hasPhaseChanged(gameStateRef.current, data) && data.time_remaining !== undefined) {
            setLocalTimer(Math.floor(data.time_remaining));
          }
          setGameState(data);
        } catch (error) {
          console.error('Error fetching game state:', error);
        }
      }
    }, 1000); // interval ticks every second

    return () => clearInterval(intervalId);
  }, []);

  if (!gameState) return <LoadingSpinner />;

  if (gameState.waiting_for_first_round) {
    return (
      <div className="game-container">
        <Box display={"flex"} flexDirection="column" alignItems={"center"} width={"100%"} mt={3}>

          <Paper elevation={4} sx={{ width: "90%" }}>
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <Typography variant="h3" gutterBottom mt={3}>
                Welcome to Wager Wars!
              </Typography>
            </Box>
            <Instructions />
            <Box display={"flex"} flexDirection="column" alignItems={"center"} padding={"2rem 2rem"}>
              <Typography variant='h6' fontWeight={"bold"} color='var(--primary)'>Waiting for game to start...</Typography>
              <Typography variant='body1' fontWeight={"bold"} color='black'>We will begin shortly</Typography>
              <Typography mt={3} variant='h5' color='black'>Your Team: {gameState.team_name ? gameState.team_name : "?"}</Typography>
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

        <PlayerInfo
          currentStack={gameState.current_stack}
          teamName={gameState.team_name}
        />

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

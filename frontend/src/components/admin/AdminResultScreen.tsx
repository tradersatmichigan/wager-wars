import React, { useState, useEffect } from 'react';
import { fetchData, postData } from '../../utils/fetch-utils';
import Leaderboard from '../player/Leaderboard';
import type { GameState, SimulationState } from '../../types';
import { useNavigate } from 'react-router-dom';

import { Box, Typography, Paper, SvgIcon } from '@mui/material';

interface AdminResultScreenProps {
  gameState: GameState;
  result: boolean | null;
  //setSimulationState: (state: SimulationState) => Promise<void>;
  loading: boolean;
}

function AdminResultScreen({ 
  gameState, 
  result, 
  loading 
}: AdminResultScreenProps) {
  const [isLastRound, setIsLastRound] = useState<boolean>(false);
  const [endingGame, setEndingGame] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if this is the final round - either from gameState or API
    const checkIfLastRound = async () => {
      // If we already know it's the final round from gameState, use that
      if (gameState.final_round) {
        setIsLastRound(true);
        return;
      }
      
      // Otherwise check via the rounds API
      try {
        const response = await fetchData('/api/admin/rounds/');
        setIsLastRound(response.pending_rounds === 0);
      } catch (error) {
        console.error('Error checking rounds:', error);
      }
    };
    
    checkIfLastRound();
  }, [gameState]);

  const handleEndGame = async () => {
    setEndingGame(true);
    try {
      console.log("Ending game via API...");
      // Make actual API call to end the game
      await postData('/api/admin/game/end/', {});
      
      // After a short delay to let API complete, reload page to show game over screen
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error ending game:', error);
      setEndingGame(false);
    }
  };

  const FailureIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="3" fill="none" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="3" fill="none" />
    </SvgIcon>
  );

  const SuccessIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" fill="none" />
    </SvgIcon>
  );

  return (
    <div className="admin-projection-panel">
      
      {/* Round Information */}
      <Box className="admin-projection-panel" sx={{ display: "flex", flexDirection: "column", height: "100vh"}}>
      
      {/* Round Information - FIXED AT THE TOP */}
      <Box sx={{ flexShrink: 0, textAlign: "center", p: 2, width: "80%"}}>
        <Paper elevation={0} sx={{ backgroundColor: "#2d4a7c", borderRadius: "0.75rem", p: 2 }}>
          <Typography sx={{ fontSize: "2.75rem", fontWeight: "bold", color: "white" }}>
            Round {gameState.round_number}
          </Typography>
        </Paper>
      </Box>
      
      {/* Success/Failure Result */}
      <Box
        sx={{
          width: "20rem", // Increased size for better visibility
          height: "20rem",
          borderRadius: "50%", // Ensures a perfect circle
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: result ? "rgba(76, 175, 80, 0.15)" : "rgba(244, 67, 54, 0.15)",
          border: `0.75rem solid ${result ? "#4caf50" : "#f44336"}`,
          marginBottom: "2rem", // Prevent overlap with text
          marginTop: "5rem", // Added margin to separate from top bar
          flexShrink: 0, // Prevents flexbox from distorting it
        }}
      >
        <Box className="result-icon" sx={{ fontSize: "7rem", color: result ? "#4caf50" : "#f44336" }}>
          {result ? <SuccessIcon fontSize="inherit" /> : <FailureIcon fontSize="inherit" />}
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: result ? "#4caf50" : "#f44336",
          textAlign: "center",
        }}
      >
        {result ? "SUCCESS!" : "FAILURE!"}
      </Typography>
      <Typography variant="h4">{result ? "" : "Better Luck Next Time!"}</Typography>
        

      </Box>
    </div>
  );
}

export default AdminResultScreen;

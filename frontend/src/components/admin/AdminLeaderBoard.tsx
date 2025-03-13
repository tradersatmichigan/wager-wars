import React, { useState, useEffect } from 'react';
import { fetchData, postData } from '../../utils/fetch-utils';
import Leaderboard from '../common/Leaderboard';
import type { GameState } from '../../types';

import { Box, Typography, Paper, SvgIcon } from '@mui/material';

interface AdminLeaderBoardScreenProps {
    gameState: GameState;
    startNextRound: () => Promise<void>;
    loading: boolean;
  }

function AdminLeaderBoard({
  gameState, 
  startNextRound, 
  loading 
}: AdminLeaderBoardScreenProps) {
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


    return (
      <Box className="admin-projection-panel" justifyContent={"center"} sx={{ display: "flex", flexDirection: "column", height: "100vh"}}>
        <Box width={"60%"}>
            {isLastRound ? null : <Leaderboard />}
            <Box display={"flex"} flexDirection="column" alignItems={"center"}>
            {isLastRound ? (
            <>
                <Typography sx={{color: "white", fontSize: "2.5rem", fontWeight: "bold"}}>Final Round Complete!</Typography>
                
                <button 
                onClick={handleEndGame} 
                className="end-game-button"
                disabled={endingGame}
                >
                {endingGame ? 'Ending Game...' : 'End Game & Show Results'}
                </button>
                
            </>
            ) : (
                <button 
                onClick={startNextRound} 
                className="next-round-button"
                disabled={loading}
            >
                {loading ? 'Continuing...' : 'Next Round'}
            </button>
            )}
            </Box>
        </Box>
      </Box>
);
}

export default AdminLeaderBoard;
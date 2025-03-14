import React, { useState, useEffect } from 'react';
import { fetchData, postData } from '../../utils/fetch-utils';
import Leaderboard from '../common/Leaderboard';
import type { GameState } from '../../types';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AdminLeaderBoardScreenProps {
  gameState: GameState;
  startNextRound: () => Promise<void>;
  loading: boolean;
}

// This wrapper forces the Leaderboard’s top-level Box to have 100% width,
// overriding its inline width of 30% set in Leaderboard.tsx.
const LeaderboardWrapper = styled('div')({
  '& > .MuiBox-root': {
    width: '100% !important',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

function AdminLeaderBoard({
  gameState, 
  startNextRound, 
  loading 
}: AdminLeaderBoardScreenProps) {
  const [isLastRound, setIsLastRound] = useState<boolean>(false);
  const [endingGame, setEndingGame] = useState<boolean>(false);

  useEffect(() => {
    const checkIfLastRound = async () => {
      if (gameState.final_round) {
        setIsLastRound(true);
        return;
      }
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
      await postData('/api/admin/game/end/', {});
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error ending game:', error);
      setEndingGame(false);
    }
  };

  return (
    <Box
      className="admin-projection-panel"
      sx={{
        height: "100vh",        // Fill the full viewport height
        display: "flex",
        flexDirection: "column"
      }}
    >
      {isLastRound ? (
        <Box
          sx={{
            flex: 1,               // Takes up all available space
            display: "flex",       // Enables flexbox
            flexDirection: "column",
            justifyContent: "center", // Centers content vertically
            alignItems: "center",  // Centers content horizontally
          }}
        >
          <Typography sx={{ color: "white", fontSize: "2.5rem", fontWeight: "bold" }}>
            Final Round Complete!
          </Typography>
          <button 
            onClick={handleEndGame} 
            className="end-game-button"
            disabled={endingGame}
          >
            {endingGame ? 'Ending Game...' : 'End Game & Show Results'}
          </button>
        </Box>
      ) : (
        <>
          {/* Existing scrollable leaderboard layout */}
          <Box 
            sx={{ 
              flex: "1 1 auto", 
              overflowY: "auto", 
              p: 2, 
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Box 
              sx={{ 
                width: "100%",         
                maxWidth: "1000px",     
                mx: "auto"             
              }}
            >
              <LeaderboardWrapper>
                <Leaderboard />
              </LeaderboardWrapper>
            </Box>
          </Box>
          <button 
            onClick={startNextRound} 
            className="next-round-button"
            disabled={loading}
          >
            {loading ? 'Continuing...' : 'Next Round'}
          </button>
        </>
      )}
    </Box>
  );
}

export default AdminLeaderBoard;

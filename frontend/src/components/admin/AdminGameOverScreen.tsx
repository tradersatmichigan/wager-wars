import React from 'react';
import Leaderboard from '../common/Leaderboard';
import type { GameState } from '../../types';
import { Box, Typography } from '@mui/material';

interface AdminGameOverScreenProps {
  gameState: GameState;
}

function AdminGameOverScreen({ gameState }: AdminGameOverScreenProps) {
  return (
    <div className="admin-projection-panel">
      
      <Box display={"flex"} flexDirection="column" alignItems={"center"} width={"100%"} mt={2} mb={2}>
        <Typography 
          variant="h3" 
          fontWeight={"bold"}
        >
          Game Completed!
        </Typography>
        <Typography 
          variant='h5' 
          color='#ffce44'
          mb={5}
        >
          All {gameState.rounds_completed} rounds have been completed.
        </Typography>
        
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          sx={{
            width: "60%",
            backgroundColor: "#2d4a7c",
            borderRadius: "2rem"
          }}
        >
          <Typography variant='h4' fontWeight={"bold"} mt={2} mb={2}>Final Standings</Typography>
          <Box width={"90%"}>
            <Leaderboard />
          </Box>
        </Box>
        
      </Box>
    </div>
  );
}

export default AdminGameOverScreen;

import React, { useState, useEffect } from 'react';
import type { GameState } from '../../types';
import { Box, Paper, Typography, keyframes } from '@mui/material';

interface AdminSuspenseRevealScreenProps {
  roundInfo: GameState;
}

function AdminSuspenseRevealScreen({ roundInfo }: AdminSuspenseRevealScreenProps) {
  const [countdown, setCountdown] = useState<number | string>(3);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          return "now!";
        }
        if (typeof prev === 'number') {
          return prev - 1;
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const circlePulse = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.05); }
`;
  
  return (
    <div className="admin-projection-panel">
      {/* Header */}
      
      {/* Round Information */}
      <Box className="admin-projection-panel" sx={{ display: "flex", flexDirection: "column", height: "100vh"}}>
      
      {/* Round Information - FIXED AT THE TOP */}
      <Box sx={{ flexShrink: 0, textAlign: "center", p: 2, width: "80%"}}>
        <Paper elevation={0} sx={{ backgroundColor: "#2d4a7c", borderRadius: "0.75rem", p: 2 }}>
          <Typography sx={{ fontSize: "2.75rem", fontWeight: "bold", color: "white" }}>
            Round {roundInfo.round_number}
          </Typography>
        </Paper>
      </Box>
      {/* Result Reveal Animation */}
      <Box
      sx={{
        width: "20rem", // Ensure equal width & height
        height: "20rem",
        borderRadius: "50%", // Makes it a perfect circle
        backgroundColor: "#2d4a7c",
        border: "0.6rem solid #ffce44",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: `${circlePulse} 0.5s ease-in-out infinite alternate`,
        flexShrink: 0, // Prevents flexbox from distorting it
        aspectRatio: "1 / 1", // Ensures it stays round in all cases
        marginTop: "5rem"
      }}
    >
      <Typography
        sx={{
          fontSize: "10rem", // Adjust size as needed
          fontWeight: "bold",
          color: "white",
          animation: "mark-flash 0.5s ease-in-out infinite alternate",
        }}
      >
        ?
      </Typography>
    </Box>
      <div className="countdown-text">
          Revealing result in {countdown}...
        </div>
      </Box>
      
      
    </div>
  );
}

export default AdminSuspenseRevealScreen;

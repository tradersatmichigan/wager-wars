import React from 'react';
import type { GameState } from '../../types';

import { Paper, Typography, Box } from '@mui/material';

interface AdminSimulationRunningScreenProps {
  roundInfo: GameState;
}

function AdminSimulationRunningScreen({ roundInfo }: AdminSimulationRunningScreenProps) {
  return (
    <Box className="admin-projection-panel" sx={{ display: "flex", flexDirection: "column", height: "100vh"}}>
      
      {/* Round Information - FIXED AT THE TOP */}
      <Box sx={{ flexShrink: 0, textAlign: "center", p: 2, width: "80%"}}>
        <Paper elevation={0} sx={{ backgroundColor: "#2d4a7c", borderRadius: "0.75rem", p: 2 }}>
          <Typography sx={{ fontSize: "2.75rem", fontWeight: "bold", color: "white" }}>
            Round {roundInfo.round_number}
          </Typography>
        </Paper>
      </Box>

      {/* Remaining Content - CENTERED */}
      <Box 
        sx={{ 
          flexGrow: 1,  // Allows this section to fill the remaining space
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          transform: "translateY(-50px)"
        }}
      >
        <Typography variant="h3" color="#ffce44" mb={5}>
          Running Simulation
        </Typography>

        {/* Progress Ring */}
        <Box 
          sx={{
            position: "relative",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            backgroundColor: "#2d4a7c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Rotating Arc */}
          <Box 
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "15px solid transparent",
              borderTopColor: "#ffce44",
              animation: "rotate 2s linear infinite",
            }}
          />

          {/* 3D Dice */}
          <Box className="dice-container">
            <div className="dice">
              <div className="face one">
                <img src='/static/images/one.svg' alt='one' />
              </div>
              <div className="face two">
                <img src='/static/images/two.svg' alt='two' />
              </div>
              <div className="face three">
                <img src='/static/images/three.svg' alt='three' />
              </div>
              <div className="face four">
                <img src='/static/images/four.svg' alt='four' />
              </div>
              <div className="face five">
                <img src='/static/images/five.svg' alt='five' />
              </div>
              <div className="face six">
                <img src='/static/images/six.svg' alt='six' />
              </div>
            </div>
          </Box>
        </Box>

        <Typography variant="h4" color="warning.main" mt={5}>
          Determining results...
        </Typography>
      </Box>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes rotateDice {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
          }

          .dice-container {
            perspective: 600px;
          }

          .dice {
            width: 80px;
            height: 80px;
            position: relative;
            transform-style: preserve-3d;
            animation: rotateDice 3s infinite linear;
          }

          .face {
            position: absolute;
            width: 80px;
            height: 80px;
            background: white;
            border: 2px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .face img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .one { transform: translateZ(40px); }
          .two { transform: rotateY(90deg) translateZ(40px); }
          .three { transform: rotateY(180deg) translateZ(40px); }
          .four { transform: rotateY(-90deg) translateZ(40px); }
          .five { transform: rotateX(90deg) translateZ(40px); }
          .six { transform: rotateX(-90deg) translateZ(40px); }
        `}
      </style>
    </Box>
  );
}

export default AdminSimulationRunningScreen;

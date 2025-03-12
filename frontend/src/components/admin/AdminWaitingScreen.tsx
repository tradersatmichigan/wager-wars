import React from "react";
import { Typography, Box, Paper, Grid, ListItem, List, ListItemText, Container, Stack } from "@mui/material";

interface AdminWaitingScreenProps {
  startRound: () => Promise<void>;
  nextRoundNumber: number;
  loading: boolean;
}

function AdminWaitingScreen({ 
  startRound, 
  nextRoundNumber, 
  loading 
}: AdminWaitingScreenProps) {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <div className="admin-projection-panel">
        
        {/* Waiting Screen Content */}
        <div className="admin-waiting">
          <div className="admin-title-box">
            <Typography variant="h2" color="#ffce44">WAGER WARS</Typography>
          </div>
          {/*<div>
            <img src='/static/images/android-chrome-512x512.png' alt="logo" width={350} height={350}/>
          </div>*/}
          <Box display="flex" flexDirection="row" flexGrow={1} justifyContent="center" alignItems="center">  
            <Stack direction={"row"}>
              <Box
                display="flex"
                flexDirection="column"
                maxWidth="750px"
                justifyContent="center" // Centers items vertically
                alignItems="center" // Centers items horizontally
                margin="auto" // Centers the box itself if necessary
                textAlign="center" // Ensures text alignment inside
              >
                <div className="instruction-box">
                  <Typography color="#ffce44" sx={{ fontSize:"1.75rem"}} gutterBottom>
                    How to Play:
                  </Typography>
                </div>
                <List>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="Players will break up into teams of XXXX and each player will be given a starting pool of $XXXX." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="There will be XX rounds of play; during each round, players will be asked a question (e.g., 'How much are you willing to bet this coin lands on heads?')." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="You will have time to discuss with your teammates and place a bet that works for you." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="Halfway through the betting period, you'll get to see the average bets of the opposing teams and adjust your own bets accordingly." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="At the end of each round, depending on the actual outcome of the coin toss, you will either be rewarded with your bet being multiplied or lose your bet entirely." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="The team with the largest collective pool at the end of XX rounds wins!" />
                  </ListItem>
                </List>
              </Box>

              <Box  width={"100px"} />
                

              {/* Right Column: Login Button */}
              <Box
                display="flex"
                flexDirection="column"
                maxWidth="750px"
                justifyContent="center" // Centers items vertically
                alignItems="center" // Centers items horizontally
                margin="auto" // Centers the box itself if necessary
                textAlign="center" // Ensures text alignment inside
              >
                <div className="next-round-info">
                  Next: Round {nextRoundNumber}
                </div>
                
                <div className="waiting-dots">
                  <div className="waiting-dot"></div>
                  <div className="waiting-dot"></div>
                  <div className="waiting-dot"></div>
                </div>
                
                <button 
                  onClick={startRound} 
                  disabled={loading} 
                  className="start-first-round"
                >
                  Start Round {nextRoundNumber}
                </button>
                

                <br />
                <div className="admin-help-text">
                  Press to begin the round when everyone is ready
                </div>

              </Box>
            </Stack>
          </Box>
        </div>
      </div>
    </Box>
  );
}

export default AdminWaitingScreen;

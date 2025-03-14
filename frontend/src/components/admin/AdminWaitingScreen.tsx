import React from "react";
import { Typography, Box, ListItem, List, ListItemText, Stack } from "@mui/material";
import Instructions from "../common/Intructions";

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
                <List sx={{ 
                  "& .MuiListItemText-primary": {
                    color: "white",
                    fontSize: "1.1em"
                  }
                }}>
                  <ListItem>
                    <ListItemText primary="Players will be randomly assigned to team with each player starting with $10,000." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="There will be multiple rounds of play. During each round, players will be posed a scenario (e.g. 'A coin has a 100% chance of landing on heads. Bet on this outcome.'). Each question will have assigned odds that determine the payout on your bets." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="You will be given 30 seconds to decide on how much you are willing to risk on the event. Feel free to dicuss with your team to come up with collective strategy." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Betting will then be paused and you will have 30 seconds to see all the bets placed by other teams. After this period, you will have a final 30 seconds to change your bet." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="At the end of each round, depending on the actual outcome of the coin toss (or some other event), you will either be rewarded based on the odds given, or lose your bet entirely." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="At the end of the game, the team with the largest average stack wins!" />
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
                {/* <div className="next-round-info">
                  Next: Round {nextRoundNumber}
                </div>
                
                <div className="waiting-dots">
                  <div className="waiting-dot"></div>
                  <div className="waiting-dot"></div>
                  <div className="waiting-dot"></div>
                </div> */}
                
                <button 
                  onClick={startRound} 
                  disabled={loading} 
                  className="start-first-round"
                >
                  Start Round {nextRoundNumber}
                </button>
              </Box>
            </Stack>
          </Box>
        </div>
      </div>
    </Box>
  );
}

export default AdminWaitingScreen;

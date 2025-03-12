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
                <List>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="Players will be assigned into teams of 8, and each player will recieve $10,000 to start." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="There will be 15 rounds of play. During each round, players will be asked a question (e.g. 'How much are you willing to bet this coin lands on heads?'). Each question will have a different EV and a different risk to reward ratio." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="You will be given 30 seconds to decide on how much you are willing to risk on the event. Feel free to dicuss with your team to come up with collective strategy." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="Betting will then be paused and you will have 30 seconds to see all the bets being placed by other teams. After this period, you will have a final 30 seconds to change your bet." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="At the end of each round, depending on the actual outcome of the coin toss (or some other event), you will either be rewarded with your bet being multiplied or lose your bet entirely." />
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ color: "white"}} primary="At the end of the 15 rounds, the team with the largest collective cash pool wins!" />
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

// src/pages/LandingPage.tsx (example filename)
import React from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
  } from "@mui/material";
import { Link } from "react-router-dom";

/*

Basic Landing Page, needs cleaning up but contains the core components of what is needed.

*/

const Instructions = ()  => {
  return (
    <Box sx={{ p: 4 }}>

        <Box display={"flex"} flexDirection="column" alignItems={"center"}>
          <Typography variant="h5" gutterBottom fontWeight={"bold"}>
            How to play:
          </Typography>
        </Box>
        <List sx={{ 
          "& .MuiListItemText-primary": {
            textAlign: "center",
            color: "black"
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
  );
}

export default Instructions;

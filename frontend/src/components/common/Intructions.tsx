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
        <List>
          <ListItem>
            <ListItemText primary="Players will be assigned into teams of 8, and each player will recieve $10,000 to start." />
          </ListItem>
          <ListItem>
            <ListItemText primary="There will be 15 rounds of play. During each round, players will be asked a question (e.g. 'How much are you willing to bet this coin lands on heads?'). Each question will have a different EV and a different risk to reward ratio." />
          </ListItem>
          <ListItem>
            <ListItemText primary="You will be given 30 seconds to decide on how much you are willing to risk on the event. Feel free to dicuss with your team to come up with collective strategy." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Betting will then be paused and you will have 30 seconds to see all the bets being placed by other teams. After this period, you will have a final 30 seconds to change your bet." />
          </ListItem>
          <ListItem>
            <ListItemText primary="At the end of each round, depending on the actual outcome of the coin toss (or some other event), you will either be rewarded with your bet being multiplied or lose your bet entirely." />
          </ListItem>
          <ListItem>
            <ListItemText primary="At the end of the 15 rounds, the team with the largest collective cash pool wins!" />
          </ListItem>
        </List>
    </Box>
  );
}

export default Instructions;

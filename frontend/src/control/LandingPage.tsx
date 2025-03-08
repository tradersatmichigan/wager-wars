// src/pages/LandingPage.tsx (example filename)
import React from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Grid,
    Button
  } from "@mui/material";
import { Link } from "react-router-dom";

/*

Basic Landing Page, needs cleaning up but contains the core components of what is needed.

*/

function LandingPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Wager Wars!
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
        <Typography variant="h5" gutterBottom>
            How to play:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Players will break up into teams of XXXX and each player will be given a starting pool of $XXXX." />
            </ListItem>
            <ListItem>
              <ListItemText primary="There will be XX rounds of play; during each round, players will be asked a question (e.g., 'How much are you willing to bet this coin lands on heads?')." />
            </ListItem>
            <ListItem>
              <ListItemText primary="You will have time to discuss with your teammates and place a bet that works for you." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Halfway through the betting period, you'll get to see the average bets of the opposing teams and adjust your own bets accordingly." />
            </ListItem>
            <ListItem>
              <ListItemText primary="At the end of each round, depending on the actual outcome of the coin toss, you will either be rewarded with your bet being multiplied or lose your bet entirely." />
            </ListItem>
            <ListItem>
              <ListItemText primary="The team with the largest collective pool at the end of XX rounds wins!" />
            </ListItem>
          </List>
        </Grid>

        {/* Right Column: Login Button */}
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            size="large"
            component={Link}  // from react-router-dom
            to="/control"       // navigate to your login route
          >
            I'm Ready to Play!
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LandingPage;

import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { INITIAL_STACK, INITIAL_TEAM_STACK } from "./constants";

export default function NavBar() {

    /*
      const [userInfo, setUserInfo] = useState({
      name: "",
      ownStack: "",
      teamStack: "",
    });
    */

    // hardcoded info should be state
    const userInfo = {
        name: "Esben",
        ownStack: 124,
        teamStack: 5839,
        teamPlace: 2,
    }
    /*
      useEffect(() => {
        fetch("/api/current_user") 
          .then((response) => response.json())
          .then((data) => {
            setUserInfo({
              name: data.name,
              ownStack: data.personalStack,
              teamStack: data.teamStack, // will change
            });
          })
          .catch((error) => {
            console.error("Error fetching user info:", error);
          });
      }, []);
      */

    // calculations for displaying stack info
    const ownPercentage = ((userInfo.ownStack - INITIAL_STACK) / INITIAL_STACK) * 100;
    const teamPercentage = ((userInfo.teamStack - INITIAL_TEAM_STACK) / INITIAL_TEAM_STACK) * 100;

    const ownColor = userInfo.ownStack >= INITIAL_STACK ? "green" : "red";
    const ownSymbol = userInfo.ownStack >= INITIAL_STACK ? "+" : ""; // no symbol b.c teamPercentage comes with a '-' symbol.
    const teamColor = userInfo.teamStack >= INITIAL_TEAM_STACK ? "green" : "red";
    const teamSymbol = userInfo.teamStack >= INITIAL_TEAM_STACK ? "+" : "";

    // ugly ahh code
    let postfix = "th";
    if (userInfo.teamPlace == 1) postfix = 'st';
    if (userInfo.teamPlace == 2) postfix = 'nd';
    if (userInfo.teamPlace == 3) postfix = 'rd';


    return (
        <AppBar position="static">
            <Toolbar sx={{ bgcolor: "#bdbdbd" }}>
                <Typography variant="h6">{userInfo.name}</Typography>
                <Box
                    sx={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Typography variant="h6">
                        Stack: ${userInfo.ownStack.toFixed(0)} (
                        <Typography
                            component="span"
                            variant="inherit"
                            sx={{ color: ownColor }}
                        >
                            {ownSymbol}{ownPercentage.toFixed(0)}%
                        </Typography>
                        )
                    </Typography>

                    <Typography variant="h6">
                        Team Stack:  ${userInfo.teamStack.toFixed(0)} (
                        <Typography
                            component="span"
                            variant="inherit"
                            sx={{ color: teamColor }}
                        >
                            {teamSymbol}{teamPercentage.toFixed(0)}%
                        </Typography>
                        )
                    </Typography>

                    <Typography variant="h6">Current Place: {userInfo.teamPlace}{postfix}</Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

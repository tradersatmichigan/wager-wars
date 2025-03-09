// Page for grabbing all team's bets for the current round.


/*
TODO: Change hardcoded data to dynamic:

variables:

teams
playerTeamID (only needed for style, not functionality)

*/

import {
    Box,
    Typography,
    Paper,
} from '@mui/material';


import { paperStyle, listStyle, headerStyle, textStyle } from "../theme/theme";

// hardcoded, needs API call 
const teams = [
    { name: "Team1 with a long name", id: 1, bet: 50304500 },
    { name: "Team2", id: 2, bet: 4000 },
    { name: "Team3", id: 3, bet: 3000 },
    { name: "Team4", id: 4, bet: 2000 },
    { name: "Team5", id: 5, bet: 0 },
    { name: "Team1", id: 1, bet: 5000 },
    { name: "Team2", id: 2, bet: 4000 },
    { name: "Team3", id: 3, bet: 3000 },
    { name: "Team4", id: 4, bet: 2000 },
    { name: "Team5", id: 5, bet: 0 },
    { name: "Team1", id: 1, bet: 5000 },
    { name: "Team2", id: 2, bet: 4000 },
    { name: "Team3", id: 3, bet: 3000 },
    { name: "Team4", id: 4, bet: 2000 },
    { name: "Team5", id: 5, bet: 0 },
];


// hardcoded, logged in player's team's ID
// Not necessary for functionality, just used for style
const playerTeamID = 1;


export default function TeamBets() {

return (

    <Paper elevation={3} sx={{...paperStyle, padding: "0",  width: "80%"}}>
        <Typography sx={{ ...headerStyle, padding: "10px 0px 10px 0px" }}>
            Team Bets
        </Typography>

        <Paper elevation={3} sx={{
            ...paperStyle, maxHeight: "90vh",
            overflowY: "auto",
           
        }}>


            {teams.map((team, index) => (
                <Box
                    key={index}
                    sx={{
                        ...listStyle,
                        justifyContent: "space-between",
                      
                    }}
                >
                {/* 2 separate components for each to make sure scales w/ long team names and/or long stacks */}
                    <Typography
                        sx={{
                            fontWeight: team.id === playerTeamID ? "bold" : "normal",
                            ...textStyle,
                        }}
                    >
                        {index + 1}. {team.name}
                    </Typography>


                    <Typography
                        sx={{
                            fontWeight: team.id === playerTeamID ? "bold" : "normal",
                            color: team.bet > 0 ? "black" : "gray",
                            textAlign: "right",
                            padding: "0px 0px 0px 10px",
                            ...textStyle,
                        }}
                    >
                        ${team.bet.toLocaleString()}
                    </Typography>
                </Box>
            ))}
        </Paper>
   </Paper>

);
};




// Leaderboard object used in betting1 (between rounds page)

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




// Hardcoded needs a useEffect
const teams = [
    { name: "This is an extremeley long name", id: 1, stack: 50000},
    { name: "Team2", id: 2, stack: 4000 },
    { name: "Team3", id: 3, stack: 3000 },
    { name: "Team4", id: 4, stack: 2000 },
    { name: "Team5", id: 5, stack: 1000 },
    { name: "Team6", id: 6, stack: 500 },
    { name: "Team7", id: 7, stack: 400 },
    { name: "Team8", id: 8, stack: 300 },
    { name: "Team9", id: 9, stack: 200 },
    { name: "Team10", id: 10, stack: 100 },
    { name: "Team11", id: 11, stack: 50 },
    { name: "Team12", id: 12, stack: 40 },
    { name: "Team13", id: 13, stack: 30 },
    { name: "Team14", id: 14, stack: 20 },
    { name: "Team15", id: 15, stack: 0 }
];



const playerTeamID = 1; //also hardcoded. Player's Team's unique ID. not necesary for functionality, just for style



export default function Leaderboard() {

    return (

        <Paper elevation={3} sx={{...paperStyle, padding: "0"}}>
            <Typography sx={{ ...headerStyle, padding: "10px 0px 10px 0px" }}>
                Leaderboard
            </Typography>

            <Paper elevation={3} sx={{
                ...paperStyle, maxHeight: "40vh",
                overflowY: "auto",
            }}>


                {teams.map((team, index) => (
                    <Box
                        key={team.id}
                        sx={{
                            ...listStyle,
                            justifyContent: "space-between",
                        }}
                    >
                    {/* 2 separate components for each to make sure scales w/ long team names and/or long stacks */}
                        <Typography
                            sx={{
                                fontWeight: team.id === playerTeamID ? "bold" : "normal",
                                color: team.stack > 0 ? "black" : "gray",
                                ...textStyle,
                            }}
                        >
                            {index + 1}. {team.name}
                        </Typography>


                        <Typography
                            sx={{
                                fontWeight: team.id === playerTeamID ? "bold" : "normal",
                                color: team.stack > 0 ? "black" : "gray",
                                textAlign: "right",
                                padding: "0px 0px 0px 10px",
                                ...textStyle,
                            }}
                        >
                            ${team.stack.toLocaleString()}
                        </Typography>
                    </Box>
                ))}
            </Paper>
       </Paper>

    );
};


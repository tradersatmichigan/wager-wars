// Page for grabbing all team's bets for the current round.

import {
    Box,
    Typography,
    Container,
    Paper,
    Stack
} from '@mui/material';


import { containerStyle, paperStyle } from "../theme/theme"; 

// hardcoded, needs API call 
const teams = [
    { name: "Team1", id: 1, bet: 5000 },
    { name: "Team2", id: 2, bet: 4000 },
    { name: "Team3", id: 3, bet: 3000 },
    { name: "Team4", id: 4, bet: 2000 },
    { name: "Team5", id: 5, bet: 0 }
];

// hardcoded, logged in player's team's ID
// Not necessary for functionality, just used for style
const playerTeamID = 1;



export default function TeamBets() {
    return (

        <Box sx={containerStyle}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={paperStyle}>
                    <Stack>
                        <Typography variant="h3">
                            Team Bets
                            </Typography>
                            {teams.map((team, index) => (
                                <Typography key={index} variant="h5"
                                    sx={{
                                        fontWeight: team.id === playerTeamID ? "bold" : "", 
                                        color: "black",
                                        padding: "8px",
                                        borderRadius: "6px",
                                    }}

                                >
                                    {index + 1}. {team.name} - ${team.bet}
                                </Typography>
                            ))}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};


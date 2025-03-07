// Leaderboard object used in betting1 (between rounds page)
// Not very complicated.

import {
    Box,
    Typography,
    Container,
    Paper,
    Stack
} from '@mui/material';

import { containerStyle, paperStyle } from "./theme/theme"; 




// Hardcoded needs a useEffect
const teams = [
    { name: "Team1", id: 1, stack: 5000 },
    { name: "Team2", id: 2, stack: 4000 },
    { name: "Team3", id: 3, stack: 3000 },
    { name: "Team4", id: 4, stack: 2000 },
    { name: "Team5", id: 5, stack: 0 }
];



const playerTeamID = 1; //also hardcoded. Player's Team's unique ID



export default function Leaderboard() {

    return (

        <Box sx={containerStyle}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={paperStyle}>
                    <Stack>
                        <Typography variant="h3">
                            Leaderboard
                        </Typography>
                        {teams.map((team, index) => (
                            <Typography key={index} variant="h5"
                                sx={{
                                    fontWeight: team.id === playerTeamID ? "bold" : "",
                                    color: team.stack > 0 ? "black" : "gray",
                                    padding: "8px",
                                    borderRadius: "6px",
                                }}

                            >
                                {index + 1}. {team.name} - ${team.stack} ()
                            </Typography>
                        ))}


                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};


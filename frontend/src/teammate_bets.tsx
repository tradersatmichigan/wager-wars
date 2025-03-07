//For betting2 (bet page), displays list of your teammates' current bets for the round

import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    Stack
} from '@mui/material';


import { containerStyle, paperStyle } from "./theme/theme"; 

//Hardcoded needs to be grabbed
const teammates = [
    { name: "Teammate1", id: 1, bet: 500 },
    { name: "Teammate2", id: 2, bet: 400 },
    { name: "Teammate3", id: 3, bet: 300 },
    { name: "Teammate4", id: 4, bet: 200 },
    { name: "Teammate5", id: 5, bet: 0 },
    { name: "Esben", id: 6, bet: 234 }
];


// Hardcoded needs to be grabbed
const logname = "Esben"



export default function TeammateBets() {
    return (

        <Box sx={containerStyle}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={paperStyle}>
                    <Stack>
                        <Typography variant="h3">
                            Teammate Bets
                            </Typography>
                            {teammates.map((teammate, index) => (
                                <Typography key={index} variant="h5"
                                    sx={{
                                        fontWeight: teammate.name === logname ? "bold" : "", 
                                        color: "black",
                                        padding: "8px",
                                        borderRadius: "6px",
                                    }}

                                >
                                    {index + 1}. {teammate.name} - ${teammate.bet}
                                </Typography>
                            ))}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};


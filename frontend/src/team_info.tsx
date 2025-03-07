// Grabs team info for betting1 (between rounds page)
// Just displays you teammates' stacks

import {
    Box,
    Typography,
    Container,
    Paper,
    Stack
} from '@mui/material';

import { containerStyle, paperStyle } from "./theme/theme"; 




// Hardcoded needs a useEffect
const teammates = [
    { name: "Teammate1", id: 1, stack: 5000 },
    { name: "Teammate2", id: 2, stack: 4000 },
    { name: "Teammate3", id: 3, stack: 3000 },
    { name: "Teammate4", id: 4, stack: 2000 },
    { name: "Teammate5", id: 5, stack: 0 },
    { name: "Esben", id: 6, stack: 2345 }
];

const logname = "Esben" // hardcoded


const teamName =  "Team Name"; //hardcoded





export default function TeamInfo() {

    return (

        <Box sx={containerStyle}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={paperStyle}>
                    <Stack>
                        <Typography variant="h3">
                            Team Info
                        </Typography>
                        {teammates.map((teammate, index) => (
                            <Typography key={index} variant="h5"
                                sx={{
                                    fontWeight: teammate.name === logname ? "bold" : "",
                                    color: teammate.stack > 0 ? "black" : "gray",
                                    padding: "8px",
                                    borderRadius: "6px",
                                }}

                            >
                                {index + 1}. {teammate.name} - ${teammate.stack}
                            </Typography>
                        ))}


                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};


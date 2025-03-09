import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGame } from "./GameContext";


function ControlResults() {
    const navigate = useNavigate();
    const { roundNumber, setGameData } = useGame();

    const handleClick = () => {
        setGameData(roundNumber + 1, "", "");
        navigate("/control");
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography align="center" variant="h3">Results</Typography>
                <Box 
                    sx={{
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        padding: 2,
                        width: "600px",
                        margin: "0 auto"
                    }}
                >
                    <Stack spacing={2}>
                        <Typography variant="h5">Team 1: $XXXX</Typography>
                        <Typography variant="h5">Team 2: $XXXX</Typography>
                        <Typography variant="h5">Team 3: $XXXX</Typography>
                        <Typography variant="h5">Team 4: $XXXX</Typography>
                        <Typography variant="h5">Team 5: $XXXX</Typography>
                    </Stack>
                </Box>
                <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                    <Button 
                        variant="contained" 
                        sx={{
                            fontSize: "1.55rem",
                            padding: "12px 24px"
                        }}
                        onClick={handleClick}
                    >
                        Next Round
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default ControlResults;
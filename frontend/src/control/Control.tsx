import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGame } from "./GameContext";

function Control() {

    const { roundNumber, setGameData } = useGame();

    const navigate = useNavigate();

    const questionBank: string[] = [
        "Question 1",
        "Question 2",
        "Question 3",
        "Question 5",
        "Question 6",
        "Question 7",
        "Question 8",
        "Question 9",
        "Question 10",
        "Question 11",
        "Question 12",
        "Question 13",
        "Question 14",
        "Question 15"
    ]

    const gameTypes: string[] = [
        "Dice",
        "Other",
        "Coin",
        "Dice",
        "Other",
        "Coin",
        "Dice",
        "Other",
        "Coin",
        "Dice",
        "Other",
        "Coin",
        "Dice",
        "Other",
        "Coin",
    ]

    const multipliers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    const handleClick = () => {
        setGameData(roundNumber, questionBank[roundNumber], gameTypes[roundNumber]);
        navigate("/control/betting");
    };

    if (roundNumber < 15) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center", // Centers horizontally
                    alignItems: "center", // Centers vertically
                    height: "100vh", // Full viewport height
                }}
            >
                <Container
                    maxWidth="sm"
                    sx={{
                        bgcolor: "white",
                        p: 4,
                        boxShadow: 3,
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h1">{questionBank[roundNumber]}</Typography>
                    <Button 
                        variant="contained" 
                        sx={{ fontSize: "1.75rem", padding: "10px 20px" }}
                        onClick={handleClick}
                    >
                        Start Round
                    </Button>
                </Container>
            </Box>
        );
    }
    else {

    }

}

export default Control;
import React, { useState, useRef, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/*

Is basically the same as Coin Game, lowkey might be able to combine them, but made them separate for now since the 
input parameters are different, so they might need different implementations for how the input variables are converted
to a question, though lowkey that logic could be a function in a separate file, and then we just use the same
template to display the questions

*/

function DiceGame() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds

    useEffect(() => {
        if (timeLeft === 0) {
            // Navigate when time is up
            navigate('/control/results');
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        // Clear the interval when the component unmounts or timeLeft changes
        return () => clearInterval(timerId);
    }, [timeLeft, navigate]);

    // Optional: Format the time as MM:SS
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3">Question...</Typography>
                <Typography fontSize={"20rem"} align="center">{formattedTime}</Typography>
            </Paper>
        </Container>
    );
}

export default DiceGame;
import { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGame } from "./GameContext";

function ControlBetting() {
    const navigate = useNavigate();
    const { question } = useGame();
    const [timeLeft, setTimeLeft] = useState(1); // 60 seconds

    useEffect(() => {
        if (timeLeft === 0) {
            // Navigate when time is up
            navigate('/control/simulate');
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
                <Typography variant="h3" align="center">{question}</Typography>
                <Typography fontSize={"20rem"} align="center">{formattedTime}</Typography>
            </Paper>
        </Container>
    );
}

export default ControlBetting;
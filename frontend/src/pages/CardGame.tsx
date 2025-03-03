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

/*

I think I cooked with this one... Though there probably is a way to combine it with the other Game files

*/

function CardGame() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(5); // 60 seconds
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setShowButton(true);
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

    const handleClick = () => {
        navigate("/control/results");
    };
    
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3">Question...</Typography>
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    height="50vh"
                >
                    {showButton ? (
                        <Stack direction={"row"} spacing={5}>
                            <Button
                                variant="contained"
                                sx={{ fontSize: "3rem", padding: "50px 100px" }}
                                onClick={handleClick}
                            >
                                Success
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ fontSize: "3rem", padding: "50px 100px" }}
                                onClick={handleClick}
                            >
                                Failure
                            </Button>
                        </Stack>
                    ) : (
                        <Typography fontSize={"20rem"} align="center">{formattedTime}</Typography>
                    )
                    }
                </Box>
            </Paper>
        </Container>
    );
}

export default CardGame;
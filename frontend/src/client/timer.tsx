// Basic timer


/*
TODO: Need to manage state with the timer. Tbh not 100% sure exactly how we plan on doing this so just not gonna touch it
*/

import {
    Box,
    Typography,
 
} from '@mui/material';

import {headerStyle} from "../theme/theme";
import { useState, useEffect } from "react";

export default function Timer() {
    const [seconds, setSeconds] = useState(30);
    const [postfix, setPostfix] = useState('s')

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        if (seconds === 1) setPostfix("");

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (seconds === 1) {
            setPostfix("");
        }
        else{
            setPostfix("s");
        }
    });

    return (
        <Box>
            <Typography sx={{ ...headerStyle, fontSize: "40px" }}> {seconds} second{postfix} remaining</Typography>
        </Box>
    );
}


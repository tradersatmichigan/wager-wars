/*
Bet form for submitting bets each round. Should make an API call to logged in user for their stack size. Needs to make sure to 
update stack size after a bet is placed. Form should only be able to be submitted ONCE! i.e. they can change bets whenever
but only the final bet counts. We should be extremely diligent w/ security for this to avoid anyone able to exploit the form.

Question: Do we want them to be able to click 'enter' multiple times or if they submit they are done. The former is nicer for the UI
but the latter is more secure.

AFAIK this is the only file which should handle updating DB values using input from the user.
*/


import { useState } from "react";
import { Box, Button, TextField, Typography, Slider } from "@mui/material";
import { formStyle } from "./theme/theme";

export default function BetForm() {
    const stack = 1000; // Hardcoded, need to grab from API

    const [betAmount, setBetAmount] = useState<number | "">("");

 
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // error checking bet size (no idea how this works i copy pasted it)
        if (value === "" || /^\d+$/.test(value)) { // bash i guess
            const intValue = value === "" ? "" : Math.min(parseInt(value, 10), stack);
            setBetAmount(intValue);
        }
    };

    //handles slider changes to set betAmount
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        setBetAmount(newValue as number);
    };

    //on submit, make sure bet is valid, need some logic involving above question about how to handle state update
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (betAmount !== "" && betAmount > 0 && betAmount <= stack) { 
            console.log("Bet Submitted:", betAmount);
            alert(`Bet placed: $${betAmount}`);
        } else {
            alert("Invalid bet. Make sure to bet an integer between 0 and your stack size.");
        }
    };


    return (
        <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
            <Typography variant="h5">Place Bet</Typography>

            <TextField
                label="Bet Amount"
                variant="outlined"
                value={betAmount}
                onChange={handleChange}
                type="number"

            />

            <Slider
                value={betAmount === "" ? 0 : betAmount}
                onChange={handleSliderChange}
                min={0}
                max={stack}
                step={1}
                marks
                valueLabelDisplay="auto"
                sx={{ marginTop: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit Bet
            </Button>
        </Box>
    );
}

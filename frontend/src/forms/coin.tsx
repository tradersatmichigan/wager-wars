import React, { useState, useRef } from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Stack,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";

const multiplierRef = useRef<HTMLInputElement>(null);
const [multiplierError, setMError] = useState(false);
const [multiplierHelper, setMultiplierHelper] = useState("");

const [coinSide, setCoinSide] = useState<string>("");
const weightRef = useRef<HTMLInputElement>(null);


// Error states for validation
const [coinError, setCoinError] = useState(false);
const [weightError, setWeightError] = useState(false);
const [weightHelper, setWeightHelper] = useState("");


const validateCoinFields = (): boolean => {
    let valid = true;

    // Validate coin side: must be selected
    if (!coinSide) {
        setCoinError(true);
        valid = false;
    } else {
        setCoinError(false);
    }

    // Validate weight: must exist, be numeric, and between 1 and 99
    const weightValue = weightRef.current?.value || "";
    const numericWeight = Number(weightValue);
    if (!weightValue) {
        setWeightError(true);
        setWeightHelper("Weight is required");
        valid = false;
    } else if (isNaN(numericWeight)) {
        setWeightError(true);
        setWeightHelper("Weight must be a number");
        valid = false;
    } else if (numericWeight < 1 || numericWeight > 99) {
        setWeightError(true);
        setWeightHelper("Weight must be between 1 and 99");
        valid = false;
    } else {
        setWeightError(false);
        setWeightHelper("");
    }

    const mValue = multiplierRef.current?.value || "";
    const numericMultiplier = Number(mValue);
    if (!mValue) {
        setMError(true);
        setMultiplierHelper("Multiplier is required");
        valid = false;
    } else if (isNaN(numericMultiplier)) {
        setMError(true);
        setMultiplierHelper("Multiplier must be a number");
        valid = false;
    } else {
        setMError(false);
        setMultiplierHelper("");
    }

    return valid;
};

const handleCoinSubmit = () => {
    if (validateCoinFields()) {
        const weightValue = weightRef.current?.value;
        console.log("Selected coin side:", coinSide);
        console.log("Weight value:", weightValue);
        console.log("Bet Multiplier:", multiplierRef);
        // Proceed with further processing or API call
    }
};

const CoinForm = () => (
    <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
            Coin Game Form
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
            {/* Dropdown for coin side selection */}
            <FormControl sx={{ minWidth: 200, mb: 2 }} error={coinError}>
                <InputLabel id="coin-side-label">Select Side</InputLabel>
                <Select
                    labelId="coin-side-label"
                    id="coin-side"
                    value={coinSide}
                    label="Select Side"
                    onChange={(e) => setCoinSide(e.target.value)}
                >
                    <MenuItem value={"heads"}>Heads</MenuItem>
                    <MenuItem value={"tails"}>Tails</MenuItem>
                </Select>
            </FormControl>

            {/* Uncontrolled TextField for weight with validation */}
            <TextField
                label={weightError ? weightHelper : "Weight for selected side (%)"}
                variant="outlined"
                type="text"
                fullWidth
                inputRef={weightRef}
                error={weightError}
                sx={{ mb: 2 }}
            />

            <FormControl sx={{ minWidth: 200, mb: 2 }}>
                <TextField
                    label={multiplierError ? multiplierHelper : "Bet Multiplier"}
                    variant="outlined"
                    type="text"
                    fullWidth
                    error={multiplierError}
                    inputRef={multiplierRef}
                />
            </FormControl>
        </Stack>
        <Typography variant="body2">
            <br/>
        </Typography>
        <Button variant="contained" onClick={handleCoinSubmit}>
            Submit Coin Settings
        </Button>
    </Box>
);

export default CoinForm;

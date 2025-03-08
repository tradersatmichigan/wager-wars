import React, { useState, useRef, useEffect } from "react";
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

const [rollType, setRollType] = useState("Frequency Roll");
const [diceCount, setDiceCount] = useState<number>(1);
const [diceFaces, setDiceFaces] = useState<number>(6);
const [faceWeights, setFaceWeights] = useState<string[]>([]);
const [faceWeightError, setfaceWeightError] = useState(false);
const [faceWeightHelper, setFaceWeightHelper] = useState("");
const thresholdRef = useRef<HTMLInputElement>(null);
const [thresholdError, setThresholdError] = useState(false);
const [thresholdHelper, setThresholdHelper] = useState("");
const [thresholdDirection, setThresholdDirection] = useState("");

const numbers = Array.from({ length: 20 }, (_, index) => index + 1);

useEffect(() => {
    setFaceWeights(Array.from({ length: diceFaces }, () => ""));
}, [diceFaces]);

const handleFaceCountChange = (
    e: React.ChangeEvent<{ value: unknown }>
) => {
    setDiceFaces(e.target.value as number);
};

const handleFaceWeightChange = (
    index: number,
    value: string
) => {
    const updatedWeights = [...faceWeights];
    updatedWeights[index] = value;
    setFaceWeights(updatedWeights);
};

const validateDiceFields = (): boolean => {
    let valid  = true;

    const total = faceWeights.reduce((acc, curr) => acc + Number(curr || 0), 0);
    if (total !== 100) {
        setfaceWeightError(true);
        setFaceWeightHelper("Total weight must add to 100%");
        valid = false;
    }
    

    const t = thresholdRef.current?.value || "";
    const num = Number(t);
    if (!t) {
        setThresholdError(true);
        setThresholdHelper("Threshold is required");
        valid = false;
    } else if (isNaN(num)) {
        setThresholdError(true);
        setThresholdHelper("Threshold must be a number");
        valid = false;
    } else {
        setThresholdError(false);
        setThresholdHelper("");
    }

    return valid;
}

const handleDiceSubmit = () => {
    if (validateDiceFields()) {
        console.log("Face Weights:", faceWeights);
        console.log("Direction:", thresholdDirection);
        console.log("Threshold:", thresholdRef);
    }
}

const DiceForm = () => (
    <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
            Dice Game Form
        </Typography>

        <Stack direction={"row"}>
            <FormControl>
                <InputLabel id="roll-type">Select Roll Type</InputLabel>
                <Select 
                    id="roll-type"
                    label="Select Roll Type"
                    sx={{ minWidth: 200}}
                    value={rollType}
                    onChange={(e) => setRollType(e.target.value)}
                >
                    <MenuItem value="Frequency Roll">Frequency Roll</MenuItem>
                    <MenuItem value="Sum Roll">Sum Roll</MenuItem>
                </Select>
            </FormControl>

            <Box sx={{ width: "30px" }}></Box>

            <FormControl>
                <InputLabel id="face-count">Select # of Dice</InputLabel>
                <Select 
                    id="face-count"
                    label="Select # of Faces"
                    value={diceCount}
                    sx={{ minWidth: 300}}
                    onChange={(e) => setDiceCount(Number(e.target.value))}
                >
                    {numbers.map((num) => (
                        <MenuItem key={num} value={num}>
                            {num}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ width: "30px" }}></Box>

            <FormControl>
                <InputLabel id="face-count">Select # of Faces</InputLabel>
                <Select 
                    id="face-count"
                    label="Select # of Faces"
                    value={diceFaces}
                    sx={{ minWidth: 300}}
                    error={faceWeightError}
                    onChange={(e) => setDiceFaces(Number(e.target.value))}
                >
                    {numbers.map((num) => (
                        <MenuItem key={num} value={num}>
                            {num}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>


        <Stack direction={"row"} marginTop={2}>
            <FormControl>
                <InputLabel id="direction">Select a Direction</InputLabel>
                <Select 
                    id="direction"
                    label="Select a Direction"
                    sx={{ minWidth: 200}}
                    onChange={(e) => setThresholdDirection(e.target.value as string)}
                >
                    <MenuItem value="<">{'<'}</MenuItem>
                    <MenuItem value="<=">{'<='}</MenuItem>
                    <MenuItem value=">">{'>'}</MenuItem>
                    <MenuItem value=">=">{'>='}</MenuItem>
                </Select>
            </FormControl>

            <Box sx={{ width: "30px" }}></Box>

            <TextField
            inputRef={thresholdRef}
            label={thresholdError ? thresholdHelper : "Enter a Threshold"}
            />
        </Stack>

        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Enter Weight for Each Face (%):
            </Typography>
            <Typography variant="body1" gutterBottom>
                {faceWeightError ? faceWeightHelper : "Ensure Face Weights add up to 100"}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2}>
                {faceWeights.map((weight, index) => (
                    <TextField
                    key={index}
                    label={`Face ${index + 1}`}
                    variant="outlined"
                    value={weight}
                    onChange={(e) =>
                        handleFaceWeightChange(index, e.target.value)
                    }
                    sx={{ width: "100px" }}
                    />
                ))}
            </Stack>
        </Box>

        <Button variant="contained" onClick={handleDiceSubmit}>
                Submit Dice Settings
        </Button>

    </Box>
);

export default DiceForm;
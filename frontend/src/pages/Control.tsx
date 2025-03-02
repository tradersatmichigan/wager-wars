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

//import CoinForm from "@/forms/coin";
//import DiceForm from "@/forms/dice";

/*

Ts took a long ass time to make, but it works? Only implemented Coin and Dice so far. The file is hella long and 
I tried to break it up into separate files but couldn't get it to work (see forms folder if u want to try), there
was an issue with page not loading at all since the default game is null i think. Lowkey doing the Dice form made me 
realize the back end for that is gonna be a hella tuff to implement. Also am still working on making the face weights
more seamless. Right now inputs are handle on change which refreshes the page and makes you re-select the box you 
were typing in. I'm trying to figure out how I can update the weights on clicking the submit button. I also still
need to implement what happens after the submit is clicked (it starts the round and a timer).

*/

function Control() {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

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

    return (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Pick a Game: <br /> <br />
                </Typography>

                <Stack direction="row" spacing={10} justifyContent="center">
                    <Button
                        variant="contained"
                        sx={{ fontSize: "1.25rem", padding: "24px 48px" }}
                        onClick={() => setSelectedGame("coin")}
                    >
                        Coin
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ fontSize: "1.25rem", padding: "24px 48px" }}
                        onClick={() => setSelectedGame("dice")}
                    >
                        Dice
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ fontSize: "1.25rem", padding: "24px 48px" }}
                    >
                        Cards
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ fontSize: "1.25rem", padding: "24px 48px" }}
                    >
                        Other
                    </Button>
                </Stack>

                {selectedGame === "coin" && <CoinForm />}
                {selectedGame === "dice" && <DiceForm />}
            </Paper>
        </Container>
    );
}

export default Control;

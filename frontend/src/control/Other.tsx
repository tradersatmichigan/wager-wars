import {
    Box,
    Button,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGame } from './GameContext';
import { FlapDisplay, Presets } from 'react-split-flap-effect';

function Board() {
    const navigate = useNavigate();
    const { roundNumber } = useGame();

    const answers: string[] = [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4",
        "Answer 5",
        "Answer 6",
        "Answer 7",
        "Answer 8",
        "Answer 9",
        "Answer 10",
        "Answer 11",
        "Answer 12",
        "Answer 13",
        "Answer 14",
        "Answer 15",
    ]

    const handleClick = () => {
        navigate("/control/results");
    }
 
    return (
        <Box 
            sx={{
            display: "flex",
            justifyContent: "center", // Centers horizontally
            alignItems: "center", // Centers vertically
            height: "100vh", // Full viewport height
        }}
        >
            <Stack direction={"column"}>
                <FlapDisplay
                    chars={Presets.ALPHANUM + ',!'}
                    length={13}
                    value={answers[roundNumber]}
                    className="XL"
                />
                <Button
                    onClick={handleClick}
                    variant="contained"
                >
                    Continue
                </Button>
            </Stack>
        </Box>
    );
}

export default Board;
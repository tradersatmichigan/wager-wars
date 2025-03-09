import {
    Box,
    Container,
    Typography,
    Button,
} from "@mui/material";
import { useGame } from './GameContext';
import CoinFlip from './CoinFlip';
import Dice from './DiceRoll';
import Board from './Other';

// must install npm install react-split-flap-effect --legacy-peer-deps
// there is an error bar but it doesn't do anything

function Simulate() {

    const { question, gameType } = useGame();

    if (gameType == "Coin") {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center", // Centers horizontally
                    alignItems: "center", // Centers vertically
                    height: "100vh", // Full viewport height
                }}
            >
                <CoinFlip />
            </Box>
        );
    } else if (gameType == "Dice") {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center", // Centers horizontally
                    alignItems: "center", // Centers vertically
                    height: "100vh", // Full viewport height
                }}
            >
                <Dice />
            </Box>
        );
    } else {
        return (
            <Board />
        );
    }
}

export default Simulate;
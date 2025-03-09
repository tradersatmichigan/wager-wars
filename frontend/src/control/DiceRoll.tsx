import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

/*

DO NOT TOUCH THE DICE LOGIC, I have no clue how it works and any attempts to improve it will break it
I am aware the dice doesn't land on the face it outputs, but trust it won't work the way you think it should
I have included the that way in the experiment folder if u wanna try and get it to work
At best we can try and get the popup to cover the dice before it finishes rolling, but the navbar is 
messing up the centering of things

*/

// Helper to get a random 0, 90, 180, or 270
const random90 = () => Math.floor(Math.random() * 4) * 90;

function Dice() {
    const navigate = useNavigate();
    // Track the total rotation on X/Y axes so the dice ends on a valid face
    const [xRotation, setXRotation] = useState(0);
    const [yRotation, setYRotation] = useState(0);

    // The final dice number (1–6). We store it to show in the dialog.
    const [diceResult, setDiceResult] = useState<number | null>(null);

    // Rolling/animation states
    const [rolling, setRolling] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const rollDice = () => {
        if (rolling) return;
        setRolling(true);

        // Pick a final dice value to display in the popup
        const randomFace = Math.floor(Math.random() * 6) + 1;
        setDiceResult(randomFace);

        // For a bigger spin, add 360 + random multiple of 90
        setXRotation((prev) => prev + 360 + random90());
        setYRotation((prev) => prev + 360 + random90());

        // 0.5s after rolling starts, show the popup with the result
        setTimeout(() => {
            setShowResult(true);
        }, 500);

        // 2s matches the CSS transition time, so after 2s the dice is done rolling
        setTimeout(() => {
            setRolling(false);
        }, 2000);
    };

    const handleClick = () => {
        navigate("/control/results");
    }

    return (
        <div className="dice3d-container">
            <div className="dice-scene">
                {/* Apply our combined rotations to the dice */}
                <div
                    className="dice"
                    style={{
                        transform: `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`,
                    }}
                >
                    <div className="face face-front">2</div>
                    <div className="face face-back">6</div>
                    <div className="face face-right">3</div>
                    <div className="face face-left">4</div>
                    <div className="face face-top">1</div>
                    <div className="face face-bottom">5</div>
                </div>
            </div>

            <Button variant="contained" onClick={rollDice} disabled={rolling}>
                {rolling ? "Rolling..." : "Roll Dice"}
            </Button>

            {/* MUI Dialog showing the dice result */}
            <Dialog open={showResult} onClose={() => setShowResult(false)}>
                <DialogTitle>Dice Roll Result</DialogTitle>
                <DialogContent>
                    {diceResult !== null
                        ? `The dice rolled a ${diceResult}.`
                        : "Rolling..."}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClick}>Continue</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dice;

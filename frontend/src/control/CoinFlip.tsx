import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CoinFlip() {
  const navigate = useNavigate();

  // rotationX tracks the total rotation along the X axis
  const [rotationX, setRotationX] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const flipCoin = () => {
    if (rolling) return;
    setRolling(true);

    // Randomly choose coin result
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    setCoinResult(result);

    // Determine extra rotation: for Heads we want to end at 0° mod 360, for Tails at 180° mod 360.
    const extra = result === "Heads" ? 0 : 180;
    // Add 1440° (4 full spins) plus the extra. (You can adjust the full spins as desired.)
    setRotationX((prev) => prev + 1440 + extra);

    // End rolling state after 2 seconds (matches the CSS transition duration)
    setTimeout(() => {
      setRolling(false);
    }, 2000);

    setTimeout(() => {
      setShowResult(true);
    }, 2500);
  };

  const handleClick = () => {
    navigate("/control/results");
  }

  return (
    <div className="coinflip-container">
      <div className="coin-scene">
        <div className="coin" style={{ transform: `rotateX(${rotationX}deg)` }}>
          <div className="coin-face coin-front">Heads</div>
          <div className="coin-face coin-back">Tails</div>
        </div>
      </div>
      <Button variant="contained" onClick={flipCoin} disabled={rolling}>
        {rolling ? "Flipping..." : "Flip Coin"}
      </Button>

      {/* MUI Dialog to display the coin result */}
      <Dialog
        open={showResult}
        onClose={() => setShowResult(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ style: { padding: "2rem" } }}
      >
        <DialogTitle variant="h3">Coin Flip Result</DialogTitle>
        <DialogContent>
          {coinResult ? `The coin landed on ${coinResult}` : "Flipping..."}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CoinFlip;

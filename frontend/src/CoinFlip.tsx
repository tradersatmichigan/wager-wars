import React, { useState } from "react";
import "./coin.css"; // We'll define this below

function CoinFlip() {
  const [face, setFace] = useState<"Heads" | "Tails">("Heads");
  const [flipping, setFlipping] = useState(false);

  const flipCoin = () => {
    // Prevent multiple flips at the same time
    if (flipping) return;
    setFlipping(true);

    // Simulate flipping for 1 second
    setTimeout(() => {
      // Randomly pick heads or tails
      const randomFace = Math.random() < 0.5 ? "Heads" : "Tails";
      setFace(randomFace);
      setFlipping(false);
    }, 1000);
  };

  return (
    <div className="coin-container">
      <div className={`coin ${flipping ? "coin-flip" : ""}`}>
        {/* Display either "Heads" or "Tails" */}
        <span>{face}</span>
      </div>

      <button onClick={flipCoin} disabled={flipping}>
        {flipping ? "Flipping..." : "Flip Coin"}
      </button>
    </div>
  );
}

export default CoinFlip;

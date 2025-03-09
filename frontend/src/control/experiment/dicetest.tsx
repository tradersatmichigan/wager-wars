import React, { useState } from "react";
import "./Dice3D.css";

const faceTransforms: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "rotateX(-90deg)",
  2: "rotateX(0deg) rotateY(0deg)",
  3: "rotateY(-90deg)",
  4: "rotateY(90deg)",
  5: "rotateX(90deg)",
  6: "rotateY(180deg)",
};

function Dice3D() {
  // The dice number is limited to 1–6.
  const [diceNumber, setDiceNumber] = useState<1 | 2 | 3 | 4 | 5 | 6>(2);
  const [rolling, setRolling] = useState(false);
  // extraRotation ensures the dice visibly rotates even if the new face is the same.
  const [extraRotation, setExtraRotation] = useState(0);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    // Generate a random number between 1 and 6.
    const newFace = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    // Increment extraRotation by 360 degrees to force a new rotation.
    setExtraRotation((prev) => prev + 360);

    // Wait for the CSS transition (1 second) before finishing the roll.
    setTimeout(() => {
      setDiceNumber(newFace);
      setRolling(false);
    }, 1000);
  };

  // Combine the base transform for the chosen face with the extra Z rotation.
  const finalTransform = `${faceTransforms[diceNumber]} rotateZ(${extraRotation}deg)`;

  return (
    <div className="dice3d-container">
      <div className="dice-scene">
        <div className="dice" style={{ transform: finalTransform }}>
          <div className="face face1">1</div>
          <div className="face face2">2</div>
          <div className="face face3">3</div>
          <div className="face face4">4</div>
          <div className="face face5">5</div>
          <div className="face face6">6</div>
        </div>
      </div>
      <button onClick={rollDice} disabled={rolling}>
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>
    </div>
  );
}

export default Dice3D;

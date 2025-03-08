import { useState } from "react";
import "./faces.css"; // We'll define CSS styles next

const Dice = () => {
  const [diceNumber, setDiceNumber] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    // If we're already rolling, ignore new clicks
    if (rolling) return;

    setRolling(true);

    // Trigger random dice result between 1 and 6
    const newNumber = Math.floor(Math.random() * 6) + 1;

    // Simulate the rolling animation for 1 second
    setTimeout(() => {
      setDiceNumber(newNumber);
      setRolling(false);
    }, 1000);
  };

  return (
    <div className="dice-container">
      {/* The dice-face class is combined with rolling if state is true */}
      <div className={`dice-face ${rolling ? "dice-rolling" : ""}`}>
        {/* You can display dice faces in various ways, e.g.:
            1) Using a background image sprite
            2) Using text with emojis or ASCII
            3) Using separate images for each face
        */}
        <span>{diceNumber}</span>
      </div>

      <button onClick={rollDice} disabled={rolling}>
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>
    </div>
  );
}

export default Dice;

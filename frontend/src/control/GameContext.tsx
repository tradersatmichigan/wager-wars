import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/*

This file is to store the roundnumber and question as global variables, since multiple pages require acces to them each round

*/

interface GameContextType {
    roundNumber: number;
    question: string;
    gameType:string;
    setGameData: (round: number, question: string, gameType: string) => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [roundNumber, setRoundNumber] = useState(0);
    const [question, setQuestion] = useState("");
    const [gameType, setGameType] = useState("");

    const setGameData = (round: number, question: string, gameType: string) => {
        setRoundNumber(round);
        setQuestion(question);
        setGameType(gameType);
    };

    const resetGame = () => {
        setRoundNumber(0); // Resets round
        setQuestion("");
        setGameType("");
    };

    return (
        <GameContext.Provider value={{ roundNumber, question, gameType, setGameData, resetGame }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within a GameProvider");
    return context;
}

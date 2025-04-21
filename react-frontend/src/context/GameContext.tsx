// src/context/GameContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

export interface RoundResult {
  distance: number;
  guessedLat: number;
  guessedLng: number;
  actualLat: number;
  actualLng: number;
  score: number;
}

export interface CityData {
  name: string;
  startLat: number;
  endLat: number;
  startLng: number;
  endLng: number;
}

interface GameSettings {
  rounds: number;
  timePerRound: number;
  selectedCity: CityData | null;
}

interface GameContextProps {
  results: RoundResult[];
  addResult: (result: RoundResult) => void;
  resetGame: () => void;

  gameSettings: GameSettings;
  setGameSettings: (settings: GameSettings) => void;
}

export const GameContext = createContext<GameContextProps>({
  results: [],
  addResult: () => {},
  resetGame: () => {},
  gameSettings: {
    rounds: 5,
    timePerRound: 60,
    selectedCity: null,
  },
  setGameSettings: () => {},
});

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [results, setResults] = useState<RoundResult[]>([]);

  // Načteme (lazy initialization) gameSettings z localStorage, pokud tam jsou uložené
  const [gameSettings, _setGameSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    // Pokud v localStorage nic není, použijeme výchozí
    return {
      rounds: 5,
      timePerRound: 60,
      selectedCity: null,
    };
  });

  // Když nastavení hry změníme, uložíme je i do localStorage
  const setGameSettings = (settings: GameSettings) => {
    _setGameSettings(settings);
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  };

  const addResult = (result: RoundResult) => {
    setResults((prev) => [...prev, result]);
  };

  const resetGame = () => {
    setResults([]);
  };

  return (
    <GameContext.Provider
      value={{
        results,
        addResult,
        resetGame,
        gameSettings,
        setGameSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

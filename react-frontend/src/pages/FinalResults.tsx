// src/pages/FinalResults.tsx
import React, { useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FinalResults: React.FC = () => {
  const { results, resetGame, gameSettings } = useContext(GameContext);
  const { isLoggedIn } = useContext(AuthContext); // pro info, jestli přihlášen
  const navigate = useNavigate();

  const totalScore = results.reduce((acc, round) => acc + round.score, 0);

  const isOfficialMode =
    gameSettings.rounds === 5 &&
    gameSettings.timePerRound === 45 &&
    gameSettings.selectedCity?.name === 'Praha';

  useEffect(() => {
    if (isOfficialMode && isLoggedIn) {
      // Jen pokud je user přihlášen
      fetch('/api/submit_official_game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ totalScore }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data.error || `HTTP ${res.status}`);
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log('Official score saved:', data);
        })
        .catch((err) => {
          console.error('Chyba při ukládání oficiální hry:', err);
        });
    }
  }, [isOfficialMode, isLoggedIn, totalScore]);

  // Zbytek kódu – stejný jako dřív
  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-950 text-white min-h-screen">
        <p>Žádné výsledky!</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Hlavní menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950 text-white min-h-screen p-4">
      <h1 className="text-4xl mb-6">Gratulujeme!</h1>
      <h2 className="text-2xl mb-6">Celkové skóre: {totalScore} bodů</h2>

      {/* ... výpis jednotlivých kol ... */}

      <button
        onClick={handleRestart}
        className="mt-6 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Restartovat Hru
      </button>
    </div>
  );
};

export default FinalResults;

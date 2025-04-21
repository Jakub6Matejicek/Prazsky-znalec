// src/pages/ResultPage.tsx

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import ResultWindow from '../components/ResultWindow';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { results, gameSettings } = useContext(GameContext);

  if (results.length === 0) {
    navigate('/');
    return null;
  }

  const lastResult = results[results.length - 1];
  const roundsPlayed = results.length;
  const totalScoreSoFar = results.reduce((acc, r) => acc + r.score, 0);

  const handleNext = () => {
    navigate('/game');
  };

  const handleFinish = () => {
    navigate('/final');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
      <div className="text-center mb-4">
        {lastResult.distance === -1 ? (
          <p className="text-xl mb-2">Nestihl jsi tipnout!</p>
        ) : (
          <>
            <p className="text-xl mb-2">
              Vzdálenost: {lastResult.distance.toFixed(2)} km
            </p>
            <p className="text-xl mb-2">
              Body za kolo: {lastResult.score}
            </p>
          </>
        )}
        <p className="text-xl">Průběžné skóre: {totalScoreSoFar}</p>
      </div>

      <ResultWindow
        actualLat={lastResult.actualLat}
        actualLng={lastResult.actualLng}
        guessedLat={lastResult.guessedLat}
        guessedLng={lastResult.guessedLng}
        distance={lastResult.distance}
      />

      <div>
        {/* Místo "5" koukám na gameSettings.rounds */}
        {roundsPlayed < gameSettings.rounds ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Další kolo
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Dokončit hru
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultPage;

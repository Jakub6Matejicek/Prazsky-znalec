import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import SingleRound from './SingleRound';

function Game() {
  const { addResult } = useContext(GameContext);
  const navigate = useNavigate();

  const handleRoundEnd = (
    distance: number,
    guessedLat: number,
    guessedLng: number,
    actualLat: number,
    actualLng: number,
    score: number
  ) => {
    addResult({
      distance,
      guessedLat,
      guessedLng,
      actualLat,
      actualLng,
      score,
    });
    navigate('/result');
  };

  return (
    <div className="w-full h-full">
      <SingleRound onRoundEnd={handleRoundEnd} />
    </div>
  );
}

export default Game;

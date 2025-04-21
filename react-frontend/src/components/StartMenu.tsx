// src/components/StartMenu.tsx

import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GameContext, CityData } from '../context/GameContext';
import { AuthContext } from '../context/AuthContext';
import cityList from '../data/cities.json';

const StartMenu: React.FC = () => {
  const navigate = useNavigate();
  const { setGameSettings } = useContext(GameContext);

  const { isLoggedIn, currentUser, logout } = useContext(AuthContext);

  const [rounds, setRounds] = useState(5);
  const [timePerRound, setTimePerRound] = useState(60);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(
    cityList[0] ?? null
  );

  const handleStartFreeMode = () => {
    setGameSettings({
      rounds,
      timePerRound,
      selectedCity,
    });
    navigate('/game');
  };

  // Oficiální mód => jen pokud isLoggedIn
  const handleStartOfficialMode = () => {
    const praha = cityList.find((c) => c.name === 'Praha');
    setGameSettings({
      rounds: 5,
      timePerRound: 45,
      selectedCity: praha || null,
    });
    navigate('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white gap-4">
      <h1 className="text-6xl mb-5">PRAŽSKÝ ZNALEC</h1>

      {/* Sekce pro Auth */}
      {!isLoggedIn ? (
        <div className="flex gap-4 mb-6">
          <Link
            to="/login"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            Přihlášení
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
          >
            Registrace
          </Link>
          <Link
            to="/leaderboard"
            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700"
          >
            Leaderboard
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-6">
          <p className="mb-2">Vítej, {currentUser?.username}!</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                logout();
              }}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
            >
              Odhlásit
            </button>
            <Link
              to="/leaderboard"
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      )}

      {/* Volné nastavení hry */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <label>Vyber město:</label>
        <select
          className="text-black px-2 py-1 rounded"
          value={selectedCity?.name}
          onChange={(e) => {
            const chosen = cityList.find((c) => c.name === e.target.value);
            setSelectedCity(chosen ?? null);
          }}
        >
          {cityList.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        <label>Počet kol:</label>
        <input
          type="number"
          min={1}
          max={10}
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          className="text-black px-2 py-1 rounded"
        />

        <label>Čas na kolo (s):</label>
        <input
          type="number"
          min={10}
          max={300}
          value={timePerRound}
          onChange={(e) => setTimePerRound(Number(e.target.value))}
          className="text-black px-2 py-1 rounded"
        />
      </div>

      {/* Tlačítko Volný mód */}
      <button
        onClick={handleStartFreeMode}
        className="px-6 py-3 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Volný mód
      </button>

      {/* Tlačítko Oficiální mód - jen pokud je LoggedIn */}
      {isLoggedIn ? (
        <button
          onClick={handleStartOfficialMode}
          className="px-6 py-3 mt-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
        >
          Oficiální mód
        </button>
      ) : (
        <button
          disabled
          className="px-6 py-3 mt-2 text-white bg-gray-500 rounded-lg"
        >
          Oficiální mód (pouze pro přihlášené)
        </button>
      )}
    </div>
  );
};

export default StartMenu;

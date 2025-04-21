// src/components/SingleRound.tsx

import { useState, useEffect, useRef, useContext } from 'react';
import PanoMap from './PanoMap';
import GuessMap from './GuessMap';
import Countdown from './Countdown';
import CountdownDisplay from './CountdownDisplay';
import { GameContext } from '../context/GameContext';

import map from "/public/map.png";


interface SingleRoundProps {
  onRoundEnd: (
    distance: number,
    guessedLat: number,
    guessedLng: number,
    actualLat: number,
    actualLng: number,
    score: number
  ) => void;
}

function SingleRound({ onRoundEnd }: SingleRoundProps) {
  // 1) Načteme nastavení hry z kontextu
  const { gameSettings } = useContext(GameContext);
  const { timePerRound, selectedCity } = gameSettings;

  // Pokud není vybrané město, zobrazit fallback
  if (!selectedCity) {
    return <div>Není vybrané žádné město!</div>;
  }

  // 2) Čas na kolo
  const TOTAL_SECONDS = timePerRound;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS * 100);

  // 3) Hlídané stavy v kole
  const [actualPosition, setActualPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [guessedPosition, setGuessedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [roundActive, setRoundActive] = useState(true);

  // 4) Odpočet (Countdown) – reference, abychom ho mohli zastavit, až kolo skončí
  const countdownRef = useRef<Countdown | null>(null);

  // 5) Zjistíme, jestli jsme na mobilu/tabletu – šířka < 768 px
  const isMobileOrTablet = window.innerWidth < 768;
  //   Výchozí viditelnost mapy: na mobilu/tabletu => skrytá, jinak viditelná
  const [isMapVisible, setIsMapVisible] = useState(!isMobileOrTablet);

  // 6) Po prvním mountu vygenerujeme náhodnou pozici v rámci vybraného města
  useEffect(() => {
    if (!actualPosition) {
      const { startLat, endLat, startLng, endLng } = selectedCity;
      const randomLat = Math.random() * (endLat - startLat) + startLat;
      const randomLng = Math.random() * (endLng - startLng) + startLng;
      setActualPosition({ lat: randomLat, lng: randomLng });
      console.log('Vygenerovaná pozice:', randomLat, randomLng);
    }
  }, [actualPosition, selectedCity]);

  // 7) Po vygenerování `actualPosition` spustíme odpočet
  useEffect(() => {
    if (actualPosition && !countdownRef.current) {
      const cd = new Countdown(TOTAL_SECONDS);
      countdownRef.current = cd;
      cd.start(
        (time) => setTimeLeft(time),
        () => {
          // Vypršel čas
          handleEndOfRound();
        }
      );
    }
    return () => {
      countdownRef.current?.stop();
    };
  }, [actualPosition, TOTAL_SECONDS]);

  // Výpočet vzdálenosti v km (Haversine)
  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Výpočet skóre
  function calculateScore(distanceKm: number) {
    let points = 5000 - distanceKm * 1000;
    if (points < 0) points = 0;
    return Math.floor(points);
  }

  // 8) Konec kola
  function handleEndOfRound() {
    if (!actualPosition) return;
    countdownRef.current?.stop();
    setRoundActive(false);

    if (guessedPosition) {
      const dist = calculateDistance(
        guessedPosition.lat, guessedPosition.lng,
        actualPosition.lat, actualPosition.lng
      );
      const points = calculateScore(dist);
      onRoundEnd(dist, guessedPosition.lat, guessedPosition.lng,
                 actualPosition.lat, actualPosition.lng, points);
    } else {
      // Netipnul => distance = -1 => 0 bodů
      onRoundEnd(-1, 0, 0, actualPosition.lat, actualPosition.lng, 0);
    }
  }

  // Než se vygeneruje actualPosition, zobrazí se text
  if (!actualPosition) {
    return <div>Načítám kolo...</div>;
  }

  // Vypočítáme střed města (pro GuessMap)
  const midLat = (selectedCity.startLat + selectedCity.endLat) / 2;
  const midLng = (selectedCity.startLng + selectedCity.endLng) / 2;

  return (
    <div className="relative w-full h-screen">
      {/* 1) Panorama */}
      <PanoMap lat={actualPosition.lat} lon={actualPosition.lng} />

      {/* 2) Odpočet (časovač) */}
      <CountdownDisplay timeLeft={timeLeft} startTime={TOTAL_SECONDS} />

      {/* 3) Pokud kolo ještě běží, zobraz tlačítko a popř. mapu */}
      {roundActive && (
        <>
          {/* Tlačítko pro zobrazení/skrytí mapy */}
          <button
            onClick={() => setIsMapVisible((prev) => !prev)}
            className={`absolute py-5 px-5 bg-red-700 active:bg-red-800 text-white rounded-full z-50 bottom-3 right-3 focus:outline-none`}
          >
           <img src={map} width="32px"/>
          </button>

          {/* Hádací mapa a tlačítko "Potvrdit" pouze pokud je viditelná */}
          {isMapVisible && (
            <div className="shadow-sm absolute bottom-5 right-5 w-72 md:w-96 h-72 md:h-96 bg-white bg-opacity-90 rounded-lg flex flex-col z-10">
              <div className="flex-1">
                <GuessMap
                  cityCenter={{ lat: midLat, lng: midLng }}
                  onGuess={(lat, lng) => setGuessedPosition({ lat, lng })}
                />
              </div>

              {/* Pokud hráč tipnul (guessedPosition existuje), zobraz tlačítko "Potvrdit" */}
              {guessedPosition ? (
                <button
                  onClick={handleEndOfRound}
                  className="m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Potvrdit
                </button>
              ) : (
                <button
                  disabled
                  className="m-2 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                >
                  Není co potvrdit
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SingleRound;

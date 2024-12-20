import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_KEY = 'l5BqQDx-xOlcBwpgVVonWoUsOgieXz2j1Ga6p4vtpGI';

interface AnswereWindowProps {
  guessingLat: number;
  guessingLng: number;
  guessedLat: number;
  guessedLng: number;
}

function AnswereWindow({ guessingLat, guessingLng, guessedLat, guessedLng }: AnswereWindowProps) {
  useEffect(() => {
    // Vytvoření mapy
    const map = L.map('resultMap').setView(
      [(guessingLat + guessedLat) / 2, (guessingLng + guessedLng) / 2],
      10
    );

    // Přidání dlaždicového mapového podkladu
    L.tileLayer(
      `https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`,
      {
        attribution: '&copy; <a href="http://mapy.cz/">Mapy.cz</a>',
      }
    ).addTo(map);

    // Přidání markerů
    const markerGuessing = L.marker([guessingLat, guessingLng]).addTo(map).bindPopup(`LAT: ${guessedLat}<br>LNG: ${guessedLng}`);
    const markerGuessed = L.marker([guessedLat, guessedLng]).addTo(map).bindPopup(`LAT: ${guessingLat}<br>LNG: ${guessingLng}`);

    // Přidání čáry mezi body
    const polyline = L.polyline(
      [
        [guessingLat, guessingLng],
        [guessedLat, guessedLng],
      ],
      { color: 'blue' }
    ).addTo(map);

    // Přiblížení na trasu
    map.fitBounds(polyline.getBounds());

    // Vyčištění mapy při unmountování
    return () => {
      map.remove();
    };
  }, [guessingLat, guessingLng, guessedLat, guessedLng]);

  // Výpočet vzdálenosti (Haversine formula)
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Poloměr Země v km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance = haversineDistance(guessingLat, guessingLng, guessedLat, guessedLng);

  return (
    <div>
      <h2>Distance: {distance.toFixed(2)} km</h2>
      <p>LAT: {guessingLat}</p>
      <p>LNG: {guessingLng}</p>
      <div id="resultMap" style={{ width: '100%', height: '400px' }} />
    </div>
  );
}

export default AnswereWindow;

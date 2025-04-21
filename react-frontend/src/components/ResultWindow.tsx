// src/components/ResultWindow.tsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ResultWindowProps {
  actualLat: number;
  actualLng: number;
  guessedLat: number;
  guessedLng: number;
  distance?: number; // doplníme distance, abychom mohli reagovat na -1
}

var questionMarker = L.icon({
  iconUrl: 'marker-question.png',

  iconSize:     [32, 32], // size of the icon
  iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
});

var checkMarker = L.icon({
  iconUrl: 'marker-check.png',

  iconSize:     [32, 32], // size of the icon
  iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
});

function ResultWindow({
  actualLat,
  actualLng,
  guessedLat,
  guessedLng,
  distance = 0,
}: ResultWindowProps) {
  const apiKey = import.meta.env.VITE_MAPY_CZ_API_KEY;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      // Pokud distance === -1, tak hráč netipnul a budeme zobrazovat jen actual
      const centerLat = distance === -1 ? actualLat : (actualLat + guessedLat) / 2;
      const centerLng = distance === -1 ? actualLng : (actualLng + guessedLng) / 2;

      const newMap = L.map(mapRef.current).setView([centerLat, centerLng], 13);

      L.tileLayer(
        `https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${apiKey}`,
        {
          attribution: '&copy; <a href="http://mapy.cz/">Mapy.cz</a>',
        }
      ).addTo(newMap);

      // Skutečná poloha
      L.marker([actualLat, actualLng], {icon: checkMarker}).addTo(newMap).bindPopup('Skutečná poloha');

      if (distance !== -1) {
        // Nakreslíme guessed marker a čáru, jen pokud hráč tipnul
        L.marker([guessedLat, guessedLng], {icon: questionMarker}).addTo(newMap).bindPopup('Tvůj tip');
        const polyline = L.polyline(
          [
            [actualLat, actualLng],
            [guessedLat, guessedLng],
          ],
          { color: 'red' }
        ).addTo(newMap);
        newMap.fitBounds(polyline.getBounds());
      } else {
        // Pokud distance=-1, tak se jen zarolujeme k actualLat/actualLng
        newMap.setView([actualLat, actualLng], 13);
      }
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map, actualLat, actualLng, guessedLat, guessedLng, distance, apiKey]);

  return <div ref={mapRef} className="w-full h-96 mb-5 max-w-4xl" />;
}

export default ResultWindow;

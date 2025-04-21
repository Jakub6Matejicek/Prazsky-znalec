// src/components/GuessMap.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GuessMapProps {
  onGuess: (lat: number, lng: number) => void;
  cityCenter: { lat: number; lng: number }; 
}

var blueMarker = L.icon({
  iconUrl: 'marker-question.png',

  iconSize:     [32, 32], // size of the icon
  iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
});

const GuessMap: React.FC<GuessMapProps> = ({ onGuess, cityCenter }) => {
  const apiKey = import.meta.env.VITE_MAPY_CZ_API_KEY;

  // Reference na <div>, kde se vykreslí mapa
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reference na samotnou mapu
  const mapRef = useRef<L.Map | null>(null);
  // Reference na skupinu markerů
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1) Vytvoříme mapu
    const myMap = L.map(containerRef.current, {
      zoomControl: false,
    }).setView([cityCenter.lat, cityCenter.lng], 13);

    L.tileLayer(
      `https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${apiKey}`,
      {
        attribution: '&copy; <a href="http://mapy.cz/">Mapy.cz</a>',
      }
    ).addTo(myMap);

    mapRef.current = myMap;

    // 2) Vytvoříme vrstvu (LayerGroup) pro markery
    const markersGroup = L.layerGroup().addTo(myMap);
    markersGroupRef.current = markersGroup;

    // 3) Zpracování kliknutí – vyčistit staré markery, přidat nový
    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Odstraníme všechny staré markery ze skupiny
      markersGroup.clearLayers();

      // Přidáme nový marker do skupiny
      L.marker([lat, lng], {icon: blueMarker})
        .addTo(markersGroup)
        .openPopup();

      onGuess(lat, lng);
    };

    myMap.on('click', handleClick);

    // Cleanup při unmountu
    return () => {
      myMap.off('click', handleClick);
      myMap.remove(); 
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default GuessMap;

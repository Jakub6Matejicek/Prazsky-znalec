import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Zadejte svůj vlastní API klíč
const API_KEY = 'l5BqQDx-xOlcBwpgVVonWoUsOgieXz2j1Ga6p4vtpGI';

const Map: React.FC = () => {
  useEffect(() => {
    // Vytvoření mapy
    const map = L.map('map').setView([50.07322, 14.43512], 10);

    // Přidání dlaždicového mapového podkladu
    L.tileLayer(
      `https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`,
      {
        attribution: '&copy; <a href="http://mapy.cz/">Mapy.cz</a>',
      }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    // Obsluha kliknutí na mapu
    map.on('click', async (event) => {
      const { lat, lng } = event.latlng;
      let html = '';

      try {
        const response = await fetch(
          `https://api.mapy.cz/v1/rgeocode/?lon=${lng}&lat=${lat}&apikey=${API_KEY}`,
          { mode: 'cors' }
        );
        const json = await response.json();
        console.log(json);

        console.log(`Kliknuto na: ${lat}, ${lng}`);

       clearMarkers();
        // Přidání markeru
        const marker = L.marker([lat, lng])
          .addTo(markersLayer)
          .bindPopup('Kliknuto na mapu!');
      } catch (error) {
        console.error(error);
      }
    });

    const clearMarkers = () => {
      markersLayer.clearLayers();
    };

    // Vyčištění mapy při odmountování komponenty
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="map"
      className="w-full h-full"
      style={{ width: '100%', height: '100vh', maxHeight: '100%', overflow: 'hidden' }}
    />
  );
};

export default Map;

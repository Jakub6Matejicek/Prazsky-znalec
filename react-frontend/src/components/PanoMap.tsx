// src/components/PanoMap.tsx

import { useEffect, useRef, useState } from 'react';

interface PanoMapProps {
  lon: number;
  lat: number;
}

interface PlaceData {
  info: {
    lon: number;
    lat: number;
    date: Date;
  };
}

function PanoMap({ lon, lat }: PanoMapProps) {
  const [infoText, setInfoText] = useState('Načítám panorama...');
  const panoContainerRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_MAPY_CZ_API_KEY;

  useEffect(() => {
    const scriptId = 'panoScript';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const createPano = async () => {
      if (!panoContainerRef.current) {
        setInfoText('Chybí kontejner pro panorama.');
        return;
      }
      if (typeof (window as any).Panorama === 'undefined') {
        setInfoText('Panorama knihovna se nenačetla.');
        return;
      }

      setInfoText('Načítám panorama z pozice...');

      try {
        const panoData = await (window as any).Panorama.panoramaFromPosition({
          parent: panoContainerRef.current,
          lon,
          lat,
          apiKey,
          showNavigation: true,
        });

        // --- Přidané logy ---
        console.log('panoData:', panoData);
        console.log('panoData.error:', panoData?.error);

        if (panoData.error) {
          setInfoText(`Chyba: ${panoData.error}`);
        } else {
          setInfoText('Panorama načteno.');
          panoData.addListener('pano-place', (placeData: PlaceData) => {
            console.log('Nová pozice panoramatu:', placeData.info.lat, placeData.info.lon);
          });
        }
      } catch (error) {
        console.error('Chyba při načítání panoramatu:', error);
        setInfoText('Nepodařilo se načíst panorama.');
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://api.mapy.cz/js/panorama/v1/panorama.js';

      script.onload = () => {
        console.log('Panorama script loaded');
        createPano();
      };

      script.onerror = () => {
        console.error('Error loading Panorama script');
        setInfoText('Chyba při načítání skriptu pro Panorama.');
      };

      document.body.appendChild(script);
    } else {
      createPano();
    }
  }, [lon, lat, apiKey]);

  return (
    <div className="relative w-full h-full">
      <div ref={panoContainerRef} className="w-full h-full" />
      <div className="hidden md:block absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded">
        {infoText}
      </div>
    </div>
  );
}

export default PanoMap;

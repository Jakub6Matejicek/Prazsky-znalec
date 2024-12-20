import { useEffect, useState, } from 'react';

interface placeData{
    info:{
        lon: number,
        lat: number,
        date: Date
    }
}

function PanoMap({defaultLat = 50.0818633, defaultLon = 14.4255628}) {
  const [infoText, setInfoText] = useState('Pano is loading...');
  const [lat, setLat] = useState<number | null>();
  const [lon, setLon] = useState<number | null>();

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://api.mapy.cz/js/panorama/v1/panorama.js';
    script.id = 'panoScript';

    const container = document.getElementById('panoCont');

    if (!container) {
      console.error('Container not found!');
      setInfoText('Container not found!');
      return;
    }

    async function createPano() {
      if (typeof (window as any).Panorama === 'undefined') {
        console.error('Panorama is not available on window.');
        setInfoText('Panorama library not loaded.');
        return;
      }

      setInfoText('Loading pano from position...');

      try {
        const panoData = await (window as any).Panorama.panoramaFromPosition({
          parent: container,
          lon: defaultLon,
          lat: defaultLat,
          apiKey: 'l5BqQDx-xOlcBwpgVVonWoUsOgieXz2j1Ga6p4vtpGI',
          showNavigation: true
        });

        panoData.addListener("pano-place", (placeData: placeData) => {
            setLat(placeData.info.lat);
            setLon(placeData.info.lon);
          });

        if (panoData.error) {
          setInfoText(`Error: ${panoData.error}`);
        } else {
          setInfoText('Pano loaded successfully!');
          
        }
      } catch (error) {
        console.error('Error loading panorama:', error);
        setInfoText('Failed to load panorama.');
      }
    }

    script.addEventListener('load', () => {
      console.log('Script is loaded');
      setInfoText('Script is loaded');
      createPano();
    });

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


   // Tento useEffect se spustí, jakmile se změní lat nebo lon
   useEffect(() => {
    if (lat !== null && lon !== null) {
      console.log('New Position:', lat, lon);
    }
  }, [lat, lon]);  // Tento efekt se spustí pouze, když se lat nebo lon změní

  return (
    <div>
      <div id="panoCont" style={{ width: '100%', height: '100vh', maxHeight:'100%' }}></div>
    </div>
  );
}

export default PanoMap;

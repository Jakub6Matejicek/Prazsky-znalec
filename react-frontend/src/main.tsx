// src/main.tsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GameProvider } from './context/GameContext';
import { AuthProvider } from './context/AuthContext'; // nový

import './index.css';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </AuthProvider>
  </BrowserRouter>
);

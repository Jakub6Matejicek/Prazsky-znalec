import { Routes, Route } from 'react-router-dom';
import StartMenu from './components/StartMenu';
import Game from './components/Game';
import ResultPage from './pages/ResultPage';
import FinalResults from './pages/FinalResults';

// Nové importy
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartMenu />} />
      <Route path="/game" element={<Game />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/final" element={<FinalResults />} />

      {/* Nové cesty */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
    </Routes>
  );
}

export default App;

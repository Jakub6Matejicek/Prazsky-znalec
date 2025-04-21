// src/pages/LeaderboardPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HighestScoreEntry {
  username: string;
  total_score: number;
  created_at: string;
}
interface AvgScoreEntry {
  username: string;
  avg_score: number;
}

function LeaderboardPage() {
  const navigate = useNavigate();

  const [highestScores, setHighestScores] = useState<HighestScoreEntry[]>([]);
  const [averageScores, setAverageScores] = useState<AvgScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1) highest_score
        const res1 = await fetch('/api/leaderboard/highest_score');
        const data1 = await res1.json();

        // 2) average_score
        const res2 = await fetch('/api/leaderboard/average_score');
        const data2 = await res2.json();

        setHighestScores(data1);
        setAverageScores(data2);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboards:', err);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-950 text-white min-h-screen">
        <p>Načítám data leaderboardu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950 text-white min-h-screen p-4">
      <h1 className="text-4xl mb-4">Leaderboard</h1>
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-6 py-2 bg-blue-500 rounded hover:bg-blue-600"
      >
        Zpět na hlavní menu
      </button>

      <div className="w-full mb-6 max-w-4xl bg-slate-900 bg-opacity-80 rounded p-4">
        <h2 className="text-2xl mb-2">Nejvyšší skóre (jedna hra)</h2>
        <ul className="list-decimal ml-6 mb-4">
          {highestScores.map((entry, idx) => (
            <li key={idx} className="mb-1">
              {entry.username} - {entry.total_score} bodů ({entry.created_at})
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full max-w-4xl bg-slate-900 bg-opacity-80 rounded p-4">
        <h2 className="text-2xl mb-2">Průměrné skóre (všechny hry)</h2>
        <ul className="list-decimal ml-6">
          {averageScores.map((entry, idx) => (
            <li key={idx} className="mb-1">
              {entry.username} - {entry.avg_score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeaderboardPage;

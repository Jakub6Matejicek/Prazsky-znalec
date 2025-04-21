// src/pages/RegisterPage.tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Něco se pokazilo');
      }

      console.log('Registrace úspěšná', data);
      navigate('/login');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950 text-white min-h-screen">
      <h1 className="text-4xl mb-4">Registrace</h1>
      <form onSubmit={handleRegister} className="bg-white bg-opacity-80 rounded p-6 text-black">
        <div className="mb-4">
          <label className="block mb-1">Uživatelské jméno</label>
          <input
            type="text"
            className="w-full p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Zadej uživatelské jméno"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Zadej email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Heslo</label>
          <input
            type="password"
            className="w-full p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Zadej heslo"
            required
          />
        </div>

        {errorMsg && <div className="text-red-600 mb-4">{errorMsg}</div>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
        >
          Registrovat
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 underline">
            Už máš účet? Přihlas se
          </Link>
        </div>
      </form>

      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-2 bg-gray-600 rounded hover:bg-gray-700"
      >
        Zpět na hlavní menu
      </button>
    </div>
  );
}

export default RegisterPage;

// src/pages/LoginPage.tsx
import { useState, FormEvent, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Něco se pokazilo');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950 text-white min-h-screen">
      <h1 className="text-4xl mb-4">Přihlášení</h1>

      <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 rounded p-6 text-black">
        <div className="mb-4">
          <label className="block mb-1">Uživatelské jméno</label>
          <input
            type="text"
            className="w-full p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Zadej uživatelské jméno"
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
          />
        </div>

        {errorMsg && <div className="text-red-600 mb-4">{errorMsg}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Přihlásit
        </button>

        <div className="mt-4 text-center">
          <Link to="/forgot" className="text-blue-600 underline">
            Zapomenuté heslo
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

export default LoginPage;

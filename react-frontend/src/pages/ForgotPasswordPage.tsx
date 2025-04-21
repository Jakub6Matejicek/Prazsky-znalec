// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/forgot_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Něco se pokazilo');
        return;
      }

      // Úspěch
      setInfoMsg(data.message);
    } catch (err) {
      console.error(err);
      setErrorMsg('Chyba při spojení se serverem');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950 text-white min-h-screen">
      <h1 className="text-4xl mb-4">Zapomenuté heslo</h1>
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 rounded p-6 text-black">
        <div className="mb-4">
          <label className="block mb-1">Zadej svůj e-mail</label>
          <input
            type="email"
            className="w-full p-2 rounded"
            placeholder="tvůj@email.cz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {errorMsg && <div className="text-red-600 mb-4">{errorMsg}</div>}
        {infoMsg && <div className="text-green-600 mb-4">{infoMsg}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Odeslat reset hesla
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 underline">
            Zpět na přihlášení
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

export default ForgotPasswordPage;

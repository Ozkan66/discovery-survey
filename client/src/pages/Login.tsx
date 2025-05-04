import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError('Gebruikersnaam en wachtwoord zijn verplicht');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      let data = null;
      try {
        data = await res.json();
      } catch {}
      if (!res.ok || !data || !data.token) {
        setError((data && data.error) || 'Login mislukt');
        return;
      }
      localStorage.setItem('token', data.token);
      navigate('/summary');
    } catch (e: any) {
      setError('Fout bij inloggen: ' + (e.message || e));
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-xs"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Inloggen</h2>
        <label htmlFor="username" className="block mb-2 text-sm font-medium">Gebruikersnaam</label>
        <input
          id="username"
          type="text"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <label htmlFor="password" className="block mb-2 text-sm font-medium">Wachtwoord</label>
        <input
          id="password"
          type="password"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Inloggen
        </button>
      </form>
    </div>
  );
}

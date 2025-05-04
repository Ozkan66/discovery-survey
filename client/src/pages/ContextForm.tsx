import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const functieOpties = [
  'Directeur/Schoolleider',
  'HR-medewerker (school)',
  'HR-coördinator (scholengroep)',
  'Leerkracht',
  'Secretariaatsmedewerker',
  'ICT-coördinator',
  'Payroll-consulent',
  'Beleidsadviseur',
  'Andere',
];
const onderwijstypeOpties = ['Basis', 'Secundair', 'Basis & Secundair'];
const schoolgrootteOpties = [
  'Kleiner dan 300 leerlingen',
  'Tussen 300 en 800 leerlingen',
  'Meer dan 800 leerlingen',
];
const netOpties = ['GO!', 'Katholiek Onderwijs', 'Stedelijk-Provinciaal Onderwijs', 'Onafhankelijk'];
const ervaringOpties = ['Starter: <2 jaar', 'Medior', 'Senior: >10 jaar'];

export default function ContextForm() {
  const [functie, setFunctie] = useState('');
  const [leeftijd, setLeeftijd] = useState('');
  const [onderwijstype, setOnderwijstype] = useState('');
  const [schoolgrootte, setSchoolgrootte] = useState('');
  const [net, setNet] = useState('');
  const [ervaring, setErvaring] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!functie || !leeftijd || !onderwijstype || !schoolgrootte || !net || !ervaring) {
      setError('Alle velden zijn verplicht');
      return;
    }
    setError('');
    sessionStorage.setItem(
      'context',
      JSON.stringify({ functie, leeftijd, onderwijstype, schoolgrootte, net, ervaring })
    );
    navigate('/overview');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Contextformulier</h2>

        <label htmlFor="functie" className="block mb-2 text-sm font-medium">Functie</label>
        <select
          id="functie"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={functie}
          onChange={e => setFunctie(e.target.value)}
        >
          <option value="">Selecteer...</option>
          {functieOpties.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <label htmlFor="leeftijd" className="block mb-2 text-sm font-medium">Leeftijd</label>
        <input
          id="leeftijd"
          type="number"
          min="18"
          max="99"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={leeftijd}
          onChange={e => setLeeftijd(e.target.value)}
        />

        <label htmlFor="onderwijstype" className="block mb-2 text-sm font-medium">Onderwijstype</label>
        <select
          id="onderwijstype"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={onderwijstype}
          onChange={e => setOnderwijstype(e.target.value)}
        >
          <option value="">Selecteer...</option>
          {onderwijstypeOpties.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <label htmlFor="schoolgrootte" className="block mb-2 text-sm font-medium">Schoolgrootte</label>
        <select
          id="schoolgrootte"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={schoolgrootte}
          onChange={e => setSchoolgrootte(e.target.value)}
        >
          <option value="">Selecteer...</option>
          {schoolgrootteOpties.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <label htmlFor="net" className="block mb-2 text-sm font-medium">Net</label>
        <select
          id="net"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={net}
          onChange={e => setNet(e.target.value)}
        >
          <option value="">Selecteer...</option>
          {netOpties.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <label htmlFor="ervaring" className="block mb-2 text-sm font-medium">Ervaring</label>
        <select
          id="ervaring"
          className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={ervaring}
          onChange={e => setErvaring(e.target.value)}
        >
          <option value="">Selecteer...</option>
          {ervaringOpties.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Volgende
        </button>
      </form>
    </div>
  );
}

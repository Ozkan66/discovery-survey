import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Survey } from '../types/Survey';

export default function ThemeOverview() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/survey')
      .then(res => res.json())
      .then(data => {
        console.log('Survey data ontvangen:', data);
        setSurvey(data);
        setLoading(false);
      })
      .catch(e => {
        setError('Fout bij laden van survey: ' + e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Laden...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!survey) return null;

  // --- Voortgangsbalk berekenen ---
let totalSubs = 0;
let doneSubs = 0;
survey.themes.forEach(theme => {
  theme.subthemes.forEach(sub => {
    totalSubs++;
    let answersRaw = sessionStorage.getItem(`answers_${theme.id}_${sub.id}`);
    if (answersRaw) {
      try {
        const answers = JSON.parse(answersRaw);
        const total = sub.statements.length;
        const filled = sub.statements.filter(s => {
          const a = answers[s.id];
          return a && ((a.touched === true && a.value != null) || a.dontKnow === true);
        }).length;
        if (filled === total && total > 0) {
          doneSubs++;
        }
      } catch {}
    }
  });
});
const percent = totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : 0;
// --- EINDE voortgangsbalk ---

return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <div className="flex justify-end mb-4">
          <button
            className={`px-6 py-2 rounded font-semibold shadow transition-colors text-white ${doneSubs === totalSubs ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 hover:bg-gray-500'}`}
            onClick={() => navigate('/overview')}
          >
            Overzicht
          </button>
        </div>
        {doneSubs === totalSubs && (
          <div className="flex justify-center mb-6">
            <button
              className="px-8 py-3 rounded font-bold shadow transition-colors text-white bg-red-600 hover:bg-red-700 text-lg"
              onClick={() => navigate('/send')}
            >
              Verzenden
            </button>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-6">Kies een thema om te starten</h1>
        {/* Verzenden CTA wordt getoond zodra alles is ingevuld */}
        {/* Voortgangsbalk */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Voortgang</span>
            <span className="text-sm font-semibold text-gray-700">{doneSubs} / {totalSubs} subthema’s voltooid</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{percent}% voltooid</div>
        </div>
        <div className="space-y-8">
          {survey.themes.map(theme => (
            <div key={theme.id}>
              <div className="text-xl font-semibold mb-2">{theme.name}</div>
              <div className="flex flex-wrap gap-3 mb-4">
                {theme.subthemes.map(sub => {
  // Status bepalen obv sessionStorage
  let status: 'Niet gestart' | 'Bezig' | 'Voltooid' = 'Niet gestart';
  let color = 'bg-gray-200 text-gray-700';
  let answersRaw = sessionStorage.getItem(`answers_${theme.id}_${sub.id}`);
  if (answersRaw) {
    try {
      const answers = JSON.parse(answersRaw);
      const total = sub.statements.length;
      const filled = sub.statements.filter(s => {
        const a = answers[s.id];
        return a && ((a.touched === true && a.value != null) || a.dontKnow === true);
      }).length;
      if (filled === 0) {
        status = 'Niet gestart';
        color = 'bg-gray-200 text-gray-700';
      } else if (filled < total) {
        status = 'Bezig';
        color = 'bg-orange-200 text-orange-800';
      } else {
        status = 'Voltooid';
        color = 'bg-green-200 text-green-800';
      }
    } catch {}
  }
  return (
    <button
      key={sub.id}
      className={`relative bg-blue-100 hover:bg-blue-300 text-blue-900 px-4 py-2 rounded shadow-sm transition flex items-center gap-2`}
      onClick={() => navigate(`/survey/${theme.id}/${sub.id}`)}
      style={{ minWidth: 180 }}
    >
      {sub.name}
      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{status}</span>
    </button>
  );
})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Survey, Theme, Subtheme } from '../types/Survey';

interface SummaryData {
  [themeId: string]: {
    [subthemeId: string]: {
      avg: number;
      count: number;
    };
  };
}

function getTop3(summary: SummaryData, survey: Survey) {
  // Verzamel alle subthema's met hun gemiddelde, naam en thema
  const items: { theme: Theme; sub: Subtheme; avg: number; count: number }[] = [];
  survey.themes.forEach(theme => {
    theme.subthemes.forEach(sub => {
      const entry = summary[theme.id]?.[sub.id];
      if (entry && typeof entry.avg === 'number' && entry.count > 0) {
        items.push({ theme, sub, avg: entry.avg, count: entry.count });
      }
    });
  });
  return items.sort((a, b) => b.avg - a.avg).slice(0, 3);
}

export default function Summary() {
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect naar login als geen token aanwezig is
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const surveyRes = await fetch('/api/survey');
        if (!surveyRes.ok) throw new Error('Kon survey ophalen');
        const surveyData = await surveyRes.json();
        setSurvey(surveyData);

        const summaryRes = await fetch('/api/admin/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!summaryRes.ok) throw new Error('Kon samenvatting ophalen (ben je ingelogd?)');
        const summaryData = await summaryRes.json();
        setSummary(summaryData.summary || {});
      } catch (e: any) {
        setError(e.message || 'Onbekende fout');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  if (loading) return <div className="animate-pulse text-gray-500">Samenvatting laden...</div>;
  if (error) return <div className="text-red-600">Fout: {error}</div>;
  if (!survey || !summary) return <div>Geen data beschikbaar</div>;

  const top3 = getTop3(summary, survey);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Samenvatting</h1>
      {/* Top 3 Ranking */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Top 3 Subthema's</h2>
        <ol className="space-y-2">
          {top3.length === 0 && <li className="text-gray-400">Nog geen data</li>}
          {top3.map((item, idx) => (
            <li key={item.theme.id + item.sub.id} className="flex items-center gap-2">
              <span className={`font-bold text-${['yellow','gray','amber'][idx] || 'gray'}-600 text-xl`}>{idx+1}.</span>
              <span className="font-semibold">{item.sub.name}</span>
              <span className="text-gray-500 ml-2">({item.theme.name})</span>
              <span className="ml-auto">Gem.: <span className="font-mono">{item.avg.toFixed(2)}</span></span>
              <span className="ml-2 text-xs text-gray-400">n={item.count}</span>
            </li>
          ))}
        </ol>
      </div>
      {survey.themes.map(theme => (
        <div key={theme.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{theme.name}</h2>
          {theme.subthemes.map(sub => (
            <div key={sub.id} className="mb-2 p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span>{sub.name}</span>
                <span>
                  Gemiddelde score:{' '}
                  <strong>
                    {summary[theme.id]?.[sub.id]?.avg !== undefined
                      ? summary[theme.id][sub.id].avg.toFixed(2)
                      : 'n.v.t.'}
                  </strong>
                  {' '}<span className="text-xs text-gray-400">(n={summary[theme.id]?.[sub.id]?.count || 0})</span>
                </span>
              </div>
              {/* Verbeterde bar chart met kleurgradatie en animatie */}
              <div className="relative h-4 bg-gray-200 rounded mt-1 overflow-hidden">
                {/* Foreground bar alleen als er een score is */}
                {summary[theme.id]?.[sub.id]?.avg !== undefined && summary[theme.id][sub.id].count > 0 && (
                  <div
                    className="absolute left-0 top-0 h-4 rounded transition-all duration-700"
                    style={{
                      width: `${Math.min((summary[theme.id][sub.id].avg / 7) * 100, 100)}%`,
                      background:
                        summary[theme.id][sub.id].avg < 3
                          ? 'linear-gradient(90deg, #f87171 0%, #fbbf24 100%)' // rood-geel
                          : summary[theme.id][sub.id].avg < 5
                          ? 'linear-gradient(90deg, #fbbf24 0%, #fde68a 100%)' // geel
                          : 'linear-gradient(90deg, #34d399 0%, #2563eb 100%)', // groen-blauw
                    }}
                  />
                )}
                {/* Score-label altijd zichtbaar */}
                <span className="absolute right-2 top-0 text-xs font-bold text-gray-700 h-4 flex items-center">
                  {summary[theme.id]?.[sub.id]?.avg !== undefined && summary[theme.id][sub.id].count > 0
                    ? summary[theme.id][sub.id].avg.toFixed(2)
                    : 'n.v.t.'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
      {/* TODO: Top 3 rankingveld toevoegen */}
      {/* TODO: Mobile responsiveness verbeteren */}
      {/* TODO: Mooie bar-chart component maken */}
      {/* TODO: Loading states per fetch, foutafhandeling verbeteren */}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import type { Survey, Theme, Subtheme } from '../types/Survey';

interface SummaryData {
  [themeId: string]: {
    [subthemeId: string]: {
      avg: number;
      count: number;
    };
  };
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedSubtheme, setSelectedSubtheme] = useState('');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Niet ingelogd als admin.');
      setLoading(false);
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
  }, []);

  function getCsvForSelection() {
    if (!survey || !summary || !selectedTheme || !selectedSubtheme) return '';
    const theme = survey.themes.find(t => t.name === selectedTheme);
    if (!theme) return '';
    const sub = theme.subthemes.find(s => s.name === selectedSubtheme);
    if (!sub) return '';
    const stats = summary[theme.id]?.[sub.id];
    const rows = [
      ['Thema', 'Subthema', 'Gemiddelde', 'Aantal antwoorden'],
      [theme.name, sub.name, stats?.avg?.toFixed(2) || '', stats?.count?.toString() || '']
    ];
    return rows.map(r => r.join(',')).join('\n');
  }

  function handleExportCsv() {
    if (!selectedTheme || !selectedSubtheme) return;
    const csv = getCsvForSelection();
    const filename = `survey_export_${selectedTheme}_${selectedSubtheme}.csv`;
    downloadCsv(filename, csv);
  }

  // Opties voor filters uit echte data
  const themeOptions: string[] = survey ? survey.themes.map(t => t.name) : [];
  const subthemeOptions: string[] = survey && selectedTheme
    ? survey.themes.find(t => t.name === selectedTheme)?.subthemes.map(s => s.name) || []
    : [];

  // Statistieken uit echte data
  let stats: { avg?: number; count?: number } | undefined = undefined;
  if (survey && summary && selectedTheme && selectedSubtheme) {
    const theme = survey.themes.find(t => t.name === selectedTheme);
    const sub = theme?.subthemes.find(s => s.name === selectedSubtheme);
    if (theme && sub) {
      stats = summary[theme.id]?.[sub.id];
    }
  }

  if (loading) return <div className="text-gray-500">Laden...</div>;
  if (error) return <div className="text-red-600">Fout: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white rounded shadow-md w-full max-w-3xl p-8">
        <h1 className="text-2xl font-bold mb-2 text-blue-900">Admin Dashboard</h1>
        <p className="mb-6 text-gray-600">Overzicht en analyse van surveyresultaten. Alleen toegankelijk voor admins.</p>
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Filters</h2>
          <div className="bg-gray-100 rounded p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Thema</label>
                <select
                  className="border rounded px-2 py-1"
                  value={selectedTheme}
                  onChange={e => {
                    setSelectedTheme(e.target.value);
                    setSelectedSubtheme(''); // reset subthema bij nieuw thema
                  }}
                >
                  <option value="">-- Kies thema --</option>
                  {themeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Subthema</label>
                <select
                  className="border rounded px-2 py-1"
                  value={selectedSubtheme}
                  onChange={e => setSelectedSubtheme(e.target.value)}
                  disabled={!selectedTheme || subthemeOptions.length === 0}
                >
                  <option value="">-- Kies subthema --</option>
                  {subthemeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-semibold">Gekozen thema:</span> {selectedTheme || '–'}<br />
              <span className="font-semibold">Gekozen subthema:</span> {selectedSubtheme || '–'}
            </div>
          </div>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Statistieken</h2>
          <div className="bg-gray-100 rounded p-4">
            {selectedTheme && selectedSubtheme ? (
              stats && stats.count > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-xs text-gray-500">Gemiddelde</div>
                    <div className="text-2xl font-bold text-blue-800">{stats.avg?.toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="text-xs text-gray-500">Aantal antwoorden</div>
                    <div className="text-xl font-semibold text-purple-800">{stats.count}</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Geen data voor deze selectie.</div>
              )
            ) : (
              <div className="text-gray-400">Selecteer eerst een thema en subthema om statistieken te tonen.</div>
            )}
          </div>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Aantal respondenten</h2>
          <div className="bg-gray-100 rounded p-4 flex items-center justify-center">
            {selectedTheme && selectedSubtheme ? (
              stats && typeof stats.count === 'number' && stats.count > 0 ? (
                <span className="text-4xl font-bold text-blue-700">{stats.count}</span>
              ) : (
                <span className="text-gray-400">Geen data voor deze selectie.</span>
              )
            ) : (
              <span className="text-gray-400">Selecteer eerst een thema en subthema om het aantal respondenten te tonen.</span>
            )}
          </div>
        </section>
        <section>
          <button
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${!(selectedTheme && selectedSubtheme && typeof stats?.count === 'number' && stats.count > 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!(selectedTheme && selectedSubtheme && typeof stats?.count === 'number' && stats.count > 0)}
            onClick={handleExportCsv}
          >
            CSV export
          </button>
        </section>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LikertScale from '../components/LikertScale';
import type { Survey, Statement } from '../types/Survey';

interface Answer {
  statementId: string;
  value: number | null;
  dontKnow?: boolean;
  touched?: boolean;
}

export default function Survey() {
  const { themeId, subthemeId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<string, Answer & { comment?: string }> & { _comment?: string }>({});

  useEffect(() => {
    fetch('/api/survey')
      .then(res => res.json())
      .then(data => {
        setSurvey(data);
        setLoading(false);
      })
      .catch(e => {
        setFetchError('Fout bij laden van survey: ' + e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Laad answers uit sessionStorage per subthema, merge met bestaande state zodat antwoorden nooit verloren gaan
    try {
      const saved = sessionStorage.getItem(`answers_${themeId}_${subthemeId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(prev => ({ ...parsed, ...prev }));
      }
    } catch {}
  }, [themeId, subthemeId]);

  useEffect(() => {
    // Sla answers op per subthema
    sessionStorage.setItem(`answers_${themeId}_${subthemeId}`, JSON.stringify(answers));
  }, [answers, themeId, subthemeId]);

  if (loading) return <div>Laden...</div>;
  if (fetchError) return <div className="text-red-600">{fetchError}</div>;
  if (!survey) return null;

  const theme = survey.themes.find(t => t.id === themeId);
  const subtheme = theme?.subthemes.find(st => st.id === subthemeId);
  if (!theme || !subtheme) return <div>Subthema niet gevonden.</div>;

  // Groepeer stellingen per painpoint
  const grouped = subtheme.statements.reduce<{ [painpoint: string]: Statement[] }>((acc, s) => {
    if (!acc[s.painpoint]) acc[s.painpoint] = [];
    acc[s.painpoint].push(s);
    return acc;
  }, {});

  function handleLikertChange(statementId: string, value: number) {
    setAnswers(a => ({ ...a, [statementId]: { ...a[statementId], statementId, value } }));
  }
  function handleCommentChange(val: string) {
    setAnswers(a => Object.assign({}, a, { _comment: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    // Validatie: alles beantwoord?
    const allStatementIds = subtheme.statements.map(s => s.id);
    const unanswered = allStatementIds.filter(id => !answers[id] || answers[id].value == null);
    if (unanswered.length > 0) {
      setError('Beantwoord alle stellingen voor je verzendt.');
      return;
    }
    // Context ophalen
    let context = null;
    try {
      context = JSON.parse(sessionStorage.getItem('context') || 'null');
    } catch (e) {}
    if (!context) {
      setError('Context ontbreekt. Vul eerst het contextformulier in.');
      return;
    }
    // Verzamel alle antwoorden uit sessionStorage voor alle subthema's van dit thema
    let allAnswers: Record<string, Answer & { comment?: string }> = {};
    for (const st of theme.subthemes) {
      const subAns = sessionStorage.getItem(`answers_${themeId}_${st.id}`);
      if (subAns) {
        Object.assign(allAnswers, JSON.parse(subAns));
      }
    }
    // POST naar backend
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantContext: context, answers: allAnswers })
      });
      let data = null;
      try {
        data = await res.json();
      } catch {}
      if (!res.ok) {
        throw new Error((data && data.error) || 'Fout bij opslaan');
      }
      setError('');
      // Verwijder alleen answers van huidig subthema (zodat andere subthema's bewaard blijven)
      sessionStorage.removeItem(`answers_${themeId}_${subthemeId}`);
      alert('Bedankt voor het invullen van deze vragen!');
      // Ga terug naar overzichtspagina, zodat gebruiker verder kan met andere subthema's
      navigate('/overview');
    } catch (e: any) {
      setError('Fout bij verzenden: ' + (e.message || e));
    }
  }

  // Helpers om alle subthema's lineair te doorlopen
  function getAllSubthemes() {
    if (!survey) return [];
    return survey.themes.flatMap(theme => theme.subthemes.map(sub => ({ themeId: theme.id, subthemeId: sub.id })));
  }
  function getCurrentSubthemeIndex() {
    const allSubs = getAllSubthemes();
    return allSubs.findIndex(s => s.themeId === themeId && s.subthemeId === subthemeId);
  }
  function goToPrev() {
    const allSubs = getAllSubthemes();
    const idx = getCurrentSubthemeIndex();
    const prevIdx = (idx - 1 + allSubs.length) % allSubs.length;
    const prev = allSubs[prevIdx];
    navigate(`/survey/${prev.themeId}/${prev.subthemeId}`);
  }
  function goToNext() {
    const allSubs = getAllSubthemes();
    const idx = getCurrentSubthemeIndex();
    const nextIdx = (idx + 1) % allSubs.length;
    const next = allSubs[nextIdx];
    navigate(`/survey/${next.themeId}/${next.subthemeId}`);
  }

  // Check of ALLE stellingen van ALLE subthema's volledig zijn ingevuld
  let isSurveyComplete = false;
  if (survey) {
    isSurveyComplete = survey.themes.every(theme =>
      theme.subthemes.every(sub =>
        sub.statements.every(s => {
          const key = `answers_${theme.id}_${sub.id}`;
          const stored = sessionStorage.getItem(key);
          if (!stored) return false;
          const a = JSON.parse(stored)[s.id];
          return a && ((a.touched === true && a.value != null) || a.dontKnow === true);
        })
      )
    );
  }

  // Check of dit subthema volledig is ingevuld (voor evt. andere UI, niet meer voor de knop)
  const isSubthemeComplete = subtheme.statements.every(s => {
    const a = answers[s.id];
    return a && ((a.touched === true && a.value != null) || a.dontKnow === true);
  });

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center text-sm text-blue-700 gap-2">
          <button className="hover:underline" onClick={() => navigate('/overview')}>Overzicht</button>
          <span>&gt;</span>
          <button className="hover:underline" onClick={() => navigate(`/survey/${themeId}/${theme.subthemes[0].id}`)}>{theme.name}</button>
          <span>&gt;</span>
          <span className="font-semibold text-blue-900">{subtheme.name}</span>
        </nav>
        {/* Titel */}
        <div className="mb-6 text-2xl md:text-3xl font-bold text-blue-900">
          {subtheme.name}
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">{error}</div>
        )}
        <form>
          {Object.entries(grouped).map(([painpoint, statements]) => (
            <div key={painpoint} className="mb-8">
              <div className="mb-2 font-bold text-lg text-blue-900">{painpoint}</div>
              {statements.map(s => {
  const dontKnow = answers[s.id]?.dontKnow || false;
  return (
    <div key={s.id} className="mb-6 border-b pb-4">
      <div className="mb-2 font-medium">{s.text}</div>
      <LikertScale
        value={dontKnow ? null : (answers[s.id]?.value ?? 5)}
        onChange={v => {
          setAnswers(a => ({
            ...a,
            [s.id]: {
              ...a[s.id],
              statementId: s.id,
              value: v,
              dontKnow: false,
              touched: true
            }
          }));
        }}
        name={`likert_${s.id}`}
        dontKnow={dontKnow}
        touched={answers[s.id]?.touched || false}
        onDontKnowChange={checked => {
          setAnswers(a => ({
            ...a,
            [s.id]: checked
              ? { ...a[s.id], statementId: s.id, value: null, dontKnow: true, touched: false }
              : { ...a[s.id], statementId: s.id, value: 5, dontKnow: false, touched: false }
          }));
        }}
      />
    </div>
  );
})}
            </div>
          ))}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Optioneel: toelichting of voorbeeld</label>
            <textarea
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={answers._comment ?? ''}
              onChange={e => handleCommentChange(e.target.value)}
              placeholder="Optioneel: toelichting of voorbeeld voor dit subthema"
              rows={3}
            />
          </div>
           <div className="flex justify-between mt-6 gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded font-semibold shadow transition-colors text-white ${isSurveyComplete ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'}`}
              onClick={() => navigate('/overview')}
            >
              Overzicht
            </button>
            {isSurveyComplete && (
              <button
                type="button"
                className="ml-4 px-8 py-3 rounded font-bold shadow transition-colors text-white bg-red-600 hover:bg-red-700 text-lg"
                onClick={() => navigate('/send')}
              >
                Verzenden
              </button>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={goToPrev}
              >
                Vorige
              </button>
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={goToNext}
              >
                Volgende
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

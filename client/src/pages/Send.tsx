import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Send() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function submitAll() {
      setLoading(true);
      setError('');
      setSuccess(false);
      try {
        // Verzamel context
        let context = null;
        try {
          context = JSON.parse(sessionStorage.getItem('context') || 'null');
        } catch (e) {}
        if (!context) {
          setError('Context ontbreekt. Vul eerst het contextformulier in.');
          setLoading(false);
          return;
        }
        // Verzamel ALLE antwoorden uit sessionStorage
        const allAnswers = {};
        Object.keys(sessionStorage)
          .filter(k => k.startsWith('answers_'))
          .forEach(k => {
            try {
              const parsed = JSON.parse(sessionStorage.getItem(k) || '{}');
              Object.assign(allAnswers, parsed);
            } catch {}
          });
        // Zet allAnswers om naar { [id]: { statementId, value, comment? } }
        const objectAnswers: Record<string, { statementId: string, value: number, comment?: string }> = {};
        Object.entries(allAnswers).forEach(([k, v]) => {
          const vAny = v as any;
          if (
            vAny &&
            typeof vAny === 'object' &&
            typeof vAny.statementId === 'string' &&
            typeof vAny.value === 'number'
          ) {
            objectAnswers[k] = {
              statementId: vAny.statementId,
              value: vAny.value,
              ...(vAny.comment ? { comment: vAny.comment } : {})
            };
          }
        });
        // Debug-log: laat zien wat er gepost wordt
        console.log('POST /api/responses payload:', { participantContext: context, answers: objectAnswers });
        // POST naar backend
        const res = await fetch('/api/responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participantContext: context, answers: objectAnswers })
        });
        let data = null;
        try {
          data = await res.json();
        } catch {}
        if (!res.ok) {
          throw new Error((data && data.error) || 'Fout bij opslaan');
        }
        setSuccess(true);
        // Maak sessionStorage leeg (optioneel)
        Object.keys(sessionStorage)
          .filter(k => k.startsWith('answers_'))
          .forEach(k => sessionStorage.removeItem(k));
        setLoading(false);
        // Na korte delay door naar bedankpagina
        setTimeout(() => navigate('/thankyou'), 1500);
      } catch (e: any) {
        setError('Fout bij verzenden: ' + (e.message || e));
        setLoading(false);
      }
    }
    submitAll();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Verzenden...</h1>
        {loading && <div className="text-blue-600 mb-2">Je antwoorden worden verzonden...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">Succesvol verzonden! Je wordt doorgestuurd...</div>}
      </div>
    </div>
  );
}

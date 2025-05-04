import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page" style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px #e5e7eb' }}>
      <h1 style={{ color: '#2563eb', fontWeight: 700, fontSize: 32, marginBottom: 16 }}>Discovery Survey</h1>
      <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>Welkom bij de Discovery Survey!</h2>
      <p style={{ fontSize: 16, marginBottom: 8 }}>
        Deze vragenlijst peilt naar jouw ervaringen en noden. Je antwoorden zijn volledig anoniem en worden enkel gebruikt voor wetenschappelijk onderzoek.
      </p>
      <ul style={{ fontSize: 15, marginBottom: 16, color: '#334155' }}>
        <li>• Invullen duurt ca. 10 minuten</li>
        <li>• Er zijn geen goede of foute antwoorden</li>
        <li>• Je deelname is vrijwillig</li>
      </ul>
      <div style={{ marginBottom: 24 }}>
        <a href="#privacy" style={{ color: '#2563eb', textDecoration: 'underline' }}>Meer info over privacy en verwerking van data</a>
      </div>
      <button
        style={{ background: '#22c55e', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '12px 32px', cursor: 'pointer' }}
        onClick={() => navigate('/context')}
      >
        Start de survey
      </button>
    </div>
  );
};

export default Welcome;

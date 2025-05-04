import React from 'react';

const ThankYou: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#f8fafc', borderRadius: 16, textAlign: 'center' }}>
      <h1 style={{ color: '#22c55e', fontWeight: 700, fontSize: 32, marginBottom: 18 }}>Bedankt voor je deelname!</h1>
      <p style={{ fontSize: 18, marginBottom: 10 }}>
        Jouw antwoorden zijn succesvol ontvangen.<br/>
        Ze worden anoniem verwerkt en dragen bij aan beter beleid.
      </p>
      <a href="#meer-info" style={{ color: '#2563eb', textDecoration: 'underline', display: 'block', marginBottom: 24 }}>
        Meer info over het onderzoek
      </a>
      <button
        style={{ background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '12px 32px', cursor: 'pointer' }}
        onClick={() => window.location.href = '/'}
      >
        Afronden
      </button>
    </div>
  );
};

export default ThankYou;

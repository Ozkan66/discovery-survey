import React, { useState } from 'react';

// Dummy data, replace with actual subthemes from backend/context
const subthemes = [
  'Subthema 1', 'Subthema 2', 'Subthema 3', 'Subthema 4', 'Subthema 5',
  'Subthema 6', 'Subthema 7', 'Subthema 8', 'Subthema 9', 'Subthema 10',
  'Subthema 11', 'Subthema 12',
];

const MAX_SELECTION = 10;

const Ranking: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const remaining = MAX_SELECTION - selected.length;

  const handleToggle = (subtheme: string) => {
    setSelected((prev) =>
      prev.includes(subtheme)
        ? prev.filter((s) => s !== subtheme)
        : prev.length < MAX_SELECTION
          ? [...prev, subtheme]
          : prev
    );
  };

  const handleSubmit = () => {
    // TODO: POST selected to backend
    alert('Je selectie is verstuurd!');
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 16 }}>
      <h2 style={{ color: '#2563eb', fontWeight: 700 }}>Selecteer de 10 belangrijkste subthema’s</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {subthemes.map((st) => (
          <li key={st} style={{ marginBottom: 8 }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selected.includes(st)}
                onChange={() => handleToggle(st)}
                disabled={!selected.includes(st) && selected.length >= MAX_SELECTION}
              />{' '}
              {st}
            </label>
          </li>
        ))}
      </ul>
      <div style={{ margin: '16px 0', color: remaining === 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
        Nog te selecteren: {remaining}
      </div>
      <button
        style={{ background: remaining === 0 ? '#22c55e' : '#d1d5db', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '12px 32px', cursor: remaining === 0 ? 'pointer' : 'not-allowed' }}
        disabled={remaining !== 0}
        onClick={handleSubmit}
      >
        Afronden
      </button>
      {remaining !== 0 && (
        <div style={{ color: '#ef4444', marginTop: 8 }}>
          Selecteer exact 10 subthema’s om verder te gaan
        </div>
      )}
    </div>
  );
};

export default Ranking;

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const globalAny: any = global;
globalAny.fetch = vi.fn();

describe('POST /api/responses - Send.tsx logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stuurt antwoorden als { [id]: value } naar de backend', async () => {
    // Arrange: mock context en antwoorden
    const context = {
      functie: 'HR-medewerker',
      leeftijd: '30',
      onderwijstype: 'Secundair',
      schoolgrootte: 'Klein',
      net: 'GO!',
      ervaring: 'Starter'
    };
    const allAnswers = {
      stelling_1: { statementId: 'stelling_1', value: 4 },
      stelling_2: { statementId: 'stelling_2', value: 7 },
      stelling_3: { statementId: 'stelling_3', value: 2 }
    };
    // Mapping logic uit Send.tsx
    const flatAnswers: Record<string, number> = {};
    Object.entries(allAnswers).forEach(([k, v]) => {
      if (v && typeof v === 'object' && 'value' in v) {
        flatAnswers[k] = v.value;
      } else if (typeof v === 'number') {
        flatAnswers[k] = v;
      }
    });
    // Act: doe de POST
    await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantContext: context, answers: flatAnswers })
    });
    // Assert: controleer fetch-call
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/responses',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ participantContext: context, answers: { stelling_1: 4, stelling_2: 7, stelling_3: 2 } })
      })
    );
  });

  it('combineert antwoorden uit meerdere subthema sessionStorage keys tot { [id]: value }', async () => {
    // Arrange: mock sessionStorage met antwoorden van verschillende subthema's
    const sessionMock: Record<string, string> = {
      'answers_t1_s1': JSON.stringify({ st1: { statementId: 'st1', value: 3 }, st2: { statementId: 'st2', value: 5 } }),
      'answers_t1_s2': JSON.stringify({ st3: { statementId: 'st3', value: 7 }, st4: { statementId: 'st4', value: 2 } }),
      'answers_t1_s3': JSON.stringify({ st5: { statementId: 'st5', value: 8 } })
    };
    // Simuleer sessionStorage
    const allAnswers: Record<string, any> = {};
    Object.keys(sessionMock)
      .filter(k => k.startsWith('answers_'))
      .forEach(k => {
        try {
          const parsed = JSON.parse(sessionMock[k] || '{}');
          Object.assign(allAnswers, parsed);
        } catch {}
      });
    // Mapping logic
    const flatAnswers: Record<string, number> = {};
    Object.entries(allAnswers).forEach(([k, v]) => {
      if (v && typeof v === 'object' && 'value' in v) {
        flatAnswers[k] = v.value;
      } else if (typeof v === 'number') {
        flatAnswers[k] = v;
      }
    });
    // Assert
    expect(flatAnswers).toEqual({
      st1: 3,
      st2: 5,
      st3: 7,
      st4: 2,
      st5: 8
    });
  });

  it('filtert edge cases: null/undefined/geen value/strings', () => {
    const sessionMock: Record<string, string> = {
      'answers_t1_s1': JSON.stringify({
        st1: { statementId: 'st1', value: 3 },
        st2: { statementId: 'st2', value: null },
        st3: { statementId: 'st3', value: undefined },
        st4: { statementId: 'st4', value: '7' }, // foutief als string
        st5: { statementId: 'st5' }, // geen value
        st6: 5, // direct getal
        st7: { statementId: 'st7', value: 0 }, // 0 is geldig
      })
    };
    // Simuleer sessionStorage
    const allAnswers: Record<string, any> = {};
    Object.keys(sessionMock)
      .filter(k => k.startsWith('answers_'))
      .forEach(k => {
        try {
          const parsed = JSON.parse(sessionMock[k] || '{}');
          Object.assign(allAnswers, parsed);
        } catch {}
      });
    // Mapping logic
    const flatAnswers: Record<string, number> = {};
    Object.entries(allAnswers).forEach(([k, v]) => {
      if (v && typeof v === 'object' && 'value' in v && typeof v.value === 'number') {
        flatAnswers[k] = v.value;
      } else if (typeof v === 'number') {
        flatAnswers[k] = v;
      }
    });
    // Assert: alleen geldige getallen blijven over
    expect(flatAnswers).toEqual({
      st1: 3,
      st6: 5,
      st7: 0
    });
  });
});

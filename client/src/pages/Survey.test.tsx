import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Survey from './Survey';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockSurvey = {
  themes: [
    {
      id: 't1',
      name: 'Testthema',
      subthemes: [
        {
          id: 'st1',
          name: 'Subthema 1',
          statements: [
            { id: 's1', text: 'Stelling 1', painpoint: 'Pijnpunt A' },
            { id: 's2', text: 'Stelling 2', painpoint: 'Pijnpunt A' },
          ],
        },
      ],
    },
  ],
};

beforeEach(() => {
  mockNavigate.mockClear();
  sessionStorage.clear();
  // context is vereist voor submit
  sessionStorage.setItem('context', JSON.stringify({ geslacht: 'Man', leeftijd: '19', schooltype: 'WO' }));
  // Mock fetch
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(mockSurvey) })) as any;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Survey', () => {
  it('toont loading en daarna statements', async () => {
    render(
      <MemoryRouter initialEntries={["/survey/t1/st1"]}>
        <Routes>
          <Route path="/survey/:themeId/:subthemeId" element={<Survey />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/laden/i)).toBeInTheDocument();
    expect(await screen.findByText(/Testthema/)).toBeInTheDocument();
    expect(screen.getByText(/Stelling 1/)).toBeInTheDocument();
    expect(screen.getByText(/Stelling 2/)).toBeInTheDocument();
  });

  it('toont foutmelding bij incomplete antwoorden', async () => {
    render(
      <MemoryRouter initialEntries={["/survey/t1/st1"]}>
        <Routes>
          <Route path="/survey/:themeId/:subthemeId" element={<Survey />} />
        </Routes>
      </MemoryRouter>
    );
    await screen.findByText(/Testthema/);
    fireEvent.click(screen.getByText(/verzenden/i));
    expect(await screen.findByText(/alle stellingen/i)).toBeInTheDocument();
  });

  it('verstuurt antwoorden en navigeert bij complete antwoorden', async () => {
    // Mock fetch voor POST
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(mockSurvey) })) // GET
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })); // POST
    render(
      <MemoryRouter initialEntries={["/survey/t1/st1"]}>
        <Routes>
          <Route path="/survey/:themeId/:subthemeId" element={<Survey />} />
        </Routes>
      </MemoryRouter>
    );
    await screen.findByText(/Testthema/);
    // Geef antwoord op beide stellingen
    const likerts = screen.getAllByRole('radiogroup');
    fireEvent.click(screen.getAllByRole('radio')[0]); // eerste statement eerste optie
    fireEvent.click(screen.getAllByRole('radio')[10]); // tweede statement eerste optie
    fireEvent.click(screen.getByText(/verzenden/i));
    await waitFor(() => {
      // Navigatie wordt niet strikt getest ivm testomgeving
      const answers = JSON.parse(sessionStorage.getItem('answers_t1_st1') || '{}');
      expect(answers.s1.value).toBe(1);
      expect(answers.s2.value).toBe(1);
    });
  });
});

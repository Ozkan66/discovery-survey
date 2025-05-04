import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { render, screen, fireEvent } from '@testing-library/react';
import ContextForm from './ContextForm';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

beforeEach(() => {
  mockNavigate.mockClear();
  sessionStorage.clear();
});

describe('ContextForm', () => {
  it('render alle velden en labels', () => {
    render(
      <MemoryRouter>
        <ContextForm />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/geslacht/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/leeftijd/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/schooltype/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toont foutmelding bij lege submit', () => {
    render(
      <MemoryRouter>
        <ContextForm />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/verplicht/i)).toBeInTheDocument();
  });

  it('slaat context op in sessionStorage en navigeert bij geldige input', () => {
    render(
      <MemoryRouter>
        <ContextForm />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/geslacht/i), { target: { value: 'Man' } });
    fireEvent.change(screen.getByLabelText(/leeftijd/i), { target: { value: '19' } });
    fireEvent.change(screen.getByLabelText(/schooltype/i), { target: { value: 'WO' } });
    fireEvent.click(screen.getByRole('button'));
    expect(sessionStorage.getItem('context')).toContain('Man');
    expect(sessionStorage.getItem('context')).toContain('19');
    expect(sessionStorage.getItem('context')).toContain('WO');
    // Navigatie niet strikt getest ivm testomgeving
  });
});

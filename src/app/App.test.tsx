import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('muestra el mensaje principal de la aplicación', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Si puedes ver este fondo azul/i })).toBeInTheDocument();
  });
});

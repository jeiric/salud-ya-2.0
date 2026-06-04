import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';

describe('Home (unitaria)', () => {
  it('muestra el título principal y las características', () => {
    const router = createMemoryRouter([{ path: '/', element: <Home /> }], {
      initialEntries: ['/'],
    });
    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole('heading', { name: /Sistema de Gestión de Citas Médicas/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Agenda Fácil')).toBeInTheDocument();
    expect(screen.getByText('SaludYa')).toBeInTheDocument();
  });

  it('navega a login al pulsar Agendar Cita', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: '/', element: <Home /> },
        { path: '/login', element: <div>Página Login</div> },
      ],
      { initialEntries: ['/'] }
    );
    render(<RouterProvider router={router} />);

    await user.click(screen.getAllByRole('button', { name: /Agendar Cita/i })[0]);
    expect(await screen.findByText('Página Login')).toBeInTheDocument();
  });
});

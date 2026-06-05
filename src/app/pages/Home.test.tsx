import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

  it('navega a login al pulsar Acceder', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: '/', element: <Home /> },
        { path: '/login', element: <div>Página Login</div> },
      ],
      { initialEntries: ['/'] }
    );
    render(<RouterProvider router={router} />);

    await user.click(screen.getByRole('button', { name: /Acceder/i }));
    expect(await screen.findByText('Página Login')).toBeInTheDocument();
  });

  it('navega a login al pulsar el botón Comenzar Ahora del CTA', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: '/', element: <Home /> },
        { path: '/login', element: <div>Página Login</div> },
      ],
      { initialEntries: ['/'] }
    );
    render(<RouterProvider router={router} />);

    const comenzarButtons = screen.getAllByRole('button', { name: /Comenzar Ahora/i });
    expect(comenzarButtons).toHaveLength(2);
    await user.click(comenzarButtons[1]);

    expect(await screen.findByText('Página Login')).toBeInTheDocument();
  });

  it('navega a login al pulsar el botón Comenzar Ahora en la sección hero', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: '/', element: <Home /> },
        { path: '/login', element: <div>Página Login</div> },
      ],
      { initialEntries: ['/'] }
    );
    render(<RouterProvider router={router} />);

    const heroSection = screen.getByRole('heading', {
      name: /Sistema de Gestión de Citas Médicas/i,
    }).closest('section');
    expect(heroSection).not.toBeNull();

    await user.click(within(heroSection as HTMLElement).getByRole('button', { name: /Comenzar Ahora/i }));
    expect(await screen.findByText('Página Login')).toBeInTheDocument();
  });
});

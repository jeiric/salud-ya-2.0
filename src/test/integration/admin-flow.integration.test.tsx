import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppointmentProvider } from '../../app/context/AppointmentContext';
import Login from '../../app/pages/Login';
import Dashboard from '../../app/pages/admin/Dashboard';

describe('Flujo administrador (integración)', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.clear();
  });

  it('login staff → dashboard con gestión de citas', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        { path: '/login', element: <Login /> },
        { path: '/admin/dashboard', element: <Dashboard /> },
      ],
      { initialEntries: ['/login'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    await user.click(screen.getByRole('tab', { name: /Personal Médico/i }));
    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'admin@saludya.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
      expect(screen.getByText(/Gestión de Citas Médicas/i)).toBeInTheDocument();
      expect(screen.getByText('María González')).toBeInTheDocument();
    });

    expect(localStorage.getItem('userRole')).toBe('staff');
  });

  it('logout desde dashboard vuelve a login', async () => {
    const user = userEvent.setup();
    localStorage.setItem('userRole', 'staff');

    const router = createMemoryRouter(
      [
        { path: '/admin/dashboard', element: <Dashboard /> },
        { path: '/login', element: <Login /> },
      ],
      { initialEntries: ['/admin/dashboard'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    await user.click(screen.getByRole('button', { name: /Salir/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
      expect(localStorage.getItem('userRole')).toBeNull();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';

function renderLogin(initialPath = '/login') {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <Login /> },
      { path: '/registro', element: <div>Registro Paciente</div> },
      { path: '/admin/dashboard', element: <div>Dashboard Admin</div> },
    ],
    { initialEntries: [initialPath] }
  );
  return render(<RouterProvider router={router} />);
}

describe('Login (unitaria)', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renderiza formulario de paciente por defecto', () => {
    renderLogin();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agendar Cita/i })).toBeInTheDocument();
  });

  it('navega a registro con correo de paciente', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'paciente@test.com');
    await user.click(screen.getByRole('button', { name: /Agendar Cita/i }));

    expect(await screen.findByText('Registro Paciente')).toBeInTheDocument();
  });

  it('inicia sesión staff con credenciales demo', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('tab', { name: /Personal Médico/i }));
    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'admin@saludya.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    expect(localStorage.getItem('userRole')).toBe('staff');
    expect(await screen.findByText('Dashboard Admin')).toBeInTheDocument();
  });

  it('muestra alerta con credenciales incorrectas', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert');
    renderLogin();

    await user.click(screen.getByRole('tab', { name: /Personal Médico/i }));
    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'wrong@test.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining('Credenciales incorrectas')
    );
  });

  it('no navega si paciente no ingresa correo', async () => {
    const user = userEvent.setup();
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /Agendar Cita/i });
    const form = submitButton.closest('form');
    if (form) {
      form.noValidate = true;
    }

    await user.click(submitButton);

    expect(screen.queryByText('Registro Paciente')).not.toBeInTheDocument();
  });

  it('no inicia sesión staff si falta contraseña', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert');
    renderLogin();

    await user.click(screen.getByRole('tab', { name: /Personal Médico/i }));
    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'admin@saludya.com');

    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    const form = submitButton.closest('form');
    if (form) {
      form.noValidate = true;
    }

    await user.click(submitButton);

    expect(alertSpy).not.toHaveBeenCalled();
    expect(localStorage.getItem('userRole')).toBeNull();
    expect(screen.queryByText('Dashboard Admin')).not.toBeInTheDocument();
  });
});

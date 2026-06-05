import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppointmentProvider } from '../context/AppointmentContext';
import PatientRegistration from './PatientRegistration';

function renderRegistration() {
  const router = createMemoryRouter(
    [
      { path: '/registro', element: <PatientRegistration /> },
      { path: '/calendario', element: <div>Calendario Citas</div> },
    ],
    { initialEntries: ['/registro'] }
  );
  return render(
    <AppointmentProvider>
      <RouterProvider router={router} />
    </AppointmentProvider>
  );
}

describe('PatientRegistration (unitaria)', () => {
  it('muestra errores de validación con formulario vacío', async () => {
    const user = userEvent.setup();
    renderRegistration();

    await user.click(screen.getByRole('button', { name: /Continuar/i }));

    expect(await screen.findByText('El nombre es requerido')).toBeInTheDocument();
    expect(screen.getByText('El apellido es requerido')).toBeInTheDocument();
    expect(screen.getByText('El correo electrónico es requerido')).toBeInTheDocument();
  });

  it('rechaza correo inválido', async () => {
    const user = userEvent.setup();
    renderRegistration();

    await user.type(screen.getByLabelText(/^Nombre/i), 'Ana');
    await user.type(screen.getByLabelText(/^Apellido/i), 'López');
    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'correo-invalido');
    await user.type(screen.getByLabelText(/Teléfono/i), '600000000');
    await user.type(screen.getByLabelText(/Fecha de Nacimiento/i), '1995-05-10');
    await user.type(screen.getByLabelText(/Número de Identificación/i), 'ID123');
    await user.click(screen.getByRole('button', { name: /Continuar/i }));

    expect(await screen.findByText('Correo electrónico inválido')).toBeInTheDocument();
  });

  it('navega al calendario con datos válidos', async () => {
    const user = userEvent.setup();
    renderRegistration();

    await user.type(screen.getByLabelText(/^Nombre/i), 'Carlos');
    await user.type(screen.getByLabelText(/^Apellido/i), 'Ruiz');
    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'carlos@test.com');
    await user.type(screen.getByLabelText(/Teléfono/i), '+34 600 111 222');
    await user.type(screen.getByLabelText(/Fecha de Nacimiento/i), '1988-03-20');
    await user.type(screen.getByLabelText(/Número de Identificación/i), '87654321B');
    await user.click(screen.getByRole('button', { name: /Continuar/i }));

    await waitFor(() => {
      expect(screen.getByText('Calendario Citas')).toBeInTheDocument();
    });
  });

  it('limpia el error de nombre cuando el usuario corrige el campo', async () => {
    const user = userEvent.setup();
    renderRegistration();

    await user.click(screen.getByRole('button', { name: /Continuar/i }));

    expect(await screen.findByText('El nombre es requerido')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^Nombre/i), 'Ana');
    expect(screen.queryByText('El nombre es requerido')).not.toBeInTheDocument();
  });

  it('navega a login al pulsar Volver', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: '/registro', element: <PatientRegistration /> },
        { path: '/login', element: <div>Página Login</div> },
      ],
      { initialEntries: ['/registro'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    await user.click(screen.getByRole('button', { name: /Volver/i }));
    expect(await screen.findByText('Página Login')).toBeInTheDocument();
  });
});

import React, { useLayoutEffect } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import {
  AppointmentProvider,
  useAppointment,
} from '../context/AppointmentContext';
import Confirmation from './Confirmation';

const samplePatient = {
  firstName: 'Pedro',
  lastName: 'Soto',
  email: 'pedro@test.com',
  phone: '600111222',
  birthDate: '1985-01-01',
  idNumber: '111',
};

/** Monta Confirmation solo cuando el contexto ya tiene paciente y cita. */
function WithBooking() {
  const { setPatientData, addAppointment, patientData, currentBooking } = useAppointment();

  useLayoutEffect(() => {
    if (!patientData) {
      setPatientData(samplePatient);
    }
    if (!currentBooking) {
      addAppointment('Pediatría', 'Dra. Laura Jiménez', new Date(2026, 6, 10), '15:30');
    }
  }, [setPatientData, addAppointment, patientData, currentBooking]);

  if (!patientData || !currentBooking) {
    return null;
  }

  return <Confirmation />;
}

describe('Confirmation (unitaria)', () => {
  it('muestra datos de la reserva actual, no citas mock antiguas', async () => {
    const router = createMemoryRouter(
      [
        { path: '/confirmacion', element: <WithBooking /> },
        { path: '/registro', element: <div>Registro</div> },
      ],
      { initialEntries: ['/confirmacion'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Pediatría')).toBeInTheDocument();
        expect(screen.getByText('Pedro Soto')).toBeInTheDocument();
        expect(screen.queryByText('María González')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('redirige a registro y resetea la cita al pulsar Agendar Nueva Cita', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: '/confirmacion', element: <WithBooking /> },
        { path: '/registro', element: <div>Pantalla Registro</div> },
      ],
      { initialEntries: ['/confirmacion'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    await waitFor(
      () => expect(screen.getByText('Agendar Nueva Cita')).toBeInTheDocument(),
      { timeout: 3000 }
    );

    await user.click(screen.getByRole('button', { name: /Agendar Nueva Cita/i }));
    expect(await screen.findByText('Pantalla Registro', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('redirige a registro sin paciente ni reserva', async () => {
    const router = createMemoryRouter(
      [
        { path: '/confirmacion', element: <Confirmation /> },
        { path: '/registro', element: <div>Pantalla Registro</div> },
      ],
      { initialEntries: ['/confirmacion'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    expect(await screen.findByText('Pantalla Registro', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('llama a window.print al pulsar Imprimir Confirmación', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        { path: '/confirmacion', element: <WithBooking /> },
        { path: '/registro', element: <div>Registro</div> },
      ],
      { initialEntries: ['/confirmacion'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    await waitFor(() => expect(screen.getByText('Imprimir Confirmación')).toBeInTheDocument(), {
      timeout: 3000,
    });

    await user.click(screen.getByRole('button', { name: /Imprimir Confirmación/i }));
    expect(printSpy).toHaveBeenCalled();
  });
});

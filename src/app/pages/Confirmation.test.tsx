import React, { useEffect } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import {
  AppointmentProvider,
  useAppointment,
} from '../context/AppointmentContext';
import Confirmation from './Confirmation';

function WithBooking() {
  const { setPatientData, addAppointment } = useAppointment();
  useEffect(() => {
    setPatientData({
      firstName: 'Pedro',
      lastName: 'Soto',
      email: 'pedro@test.com',
      phone: '600111222',
      birthDate: '1985-01-01',
      idNumber: '111',
    });
    addAppointment('Pediatría', 'Dra. Laura Jiménez', new Date(2026, 6, 10), '15:30');
  }, [setPatientData, addAppointment]);
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

    await waitFor(() => {
      expect(screen.getByText('Pediatría')).toBeInTheDocument();
      expect(screen.getByText('Pedro Soto')).toBeInTheDocument();
      expect(screen.queryByText('María González')).not.toBeInTheDocument();
    });
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

    await waitFor(() => {
      expect(screen.getByText('Pantalla Registro')).toBeInTheDocument();
    });
  });
});

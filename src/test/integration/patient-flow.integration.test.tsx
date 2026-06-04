import React, { useLayoutEffect } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import {
  AppointmentProvider,
  useAppointment,
} from '../../app/context/AppointmentContext';
import Login from '../../app/pages/Login';
import PatientRegistration from '../../app/pages/PatientRegistration';
import Confirmation from '../../app/pages/Confirmation';

const lauraPatient = {
  firstName: 'Laura',
  lastName: 'Vega',
  email: 'laura.vega@test.com',
  phone: '+34 611 222 333',
  birthDate: '1992-07-08',
  idNumber: '99887766C',
};

describe('Flujo paciente (integración)', () => {
  it('login → registro completa y redirige al calendario', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        { path: '/login', element: <Login /> },
        { path: '/registro', element: <PatientRegistration /> },
        { path: '/calendario', element: <div>Agendar Cita Médica</div> },
      ],
      { initialEntries: ['/login'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'integracion@test.com');
    await user.click(screen.getByRole('button', { name: /Agendar Cita/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registro de Paciente/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/^Nombre/i), 'Laura');
    await user.type(screen.getByLabelText(/^Apellido/i), 'Vega');
    await user.type(screen.getByLabelText(/Correo Electrónico/i), 'laura.vega@test.com');
    await user.type(screen.getByLabelText(/Teléfono/i), '+34 611 222 333');
    await user.type(screen.getByLabelText(/Fecha de Nacimiento/i), '1992-07-08');
    await user.type(screen.getByLabelText(/Número de Identificación/i), '99887766C');
    await user.click(screen.getByRole('button', { name: /Continuar/i }));

    await waitFor(() => {
      expect(screen.getByText('Agendar Cita Médica')).toBeInTheDocument();
      expect(router.state.location.pathname).toBe('/calendario');
    });
  });

  it('muestra confirmación solo con reserva actual del paciente', async () => {
    function BookingBridge() {
      const { setPatientData, addAppointment, patientData, currentBooking } = useAppointment();

      useLayoutEffect(() => {
        if (!patientData) {
          setPatientData(lauraPatient);
        }
        if (!currentBooking) {
          addAppointment(
            'Dermatología',
            'Dra. Carmen Sánchez',
            new Date(2026, 5, 20),
            '11:00'
          );
        }
      }, [setPatientData, addAppointment, patientData, currentBooking]);

      if (!patientData || !currentBooking) {
        return null;
      }

      return <Confirmation />;
    }

    const router = createMemoryRouter(
      [{ path: '/confirmacion', element: <BookingBridge /> }],
      { initialEntries: ['/confirmacion'] }
    );

    render(
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    );

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: /Cita Confirmada/i })).toBeInTheDocument();
        expect(screen.getByText('Dermatología')).toBeInTheDocument();
        expect(screen.getByText('Laura Vega')).toBeInTheDocument();
        expect(screen.queryByText('María González')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});

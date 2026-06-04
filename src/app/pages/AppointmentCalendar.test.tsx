import React, { useLayoutEffect } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import {
  AppointmentProvider,
  useAppointment,
  type PatientData,
} from '../context/AppointmentContext';
import AppointmentCalendar from './AppointmentCalendar';

const samplePatient: PatientData = {
  firstName: 'Carlos',
  lastName: 'Ruiz',
  email: 'carlos@test.com',
  phone: '+34 600 111 222',
  birthDate: '1988-03-20',
  idNumber: '87654321B',
};

function CalendarWithPatient() {
  const { setPatientData, patientData } = useAppointment();

  useLayoutEffect(() => {
    if (!patientData) {
      setPatientData(samplePatient);
    }
  }, [setPatientData, patientData]);

  if (!patientData) {
    return null;
  }

  return <AppointmentCalendar />;
}

function renderCalendarRoute(options?: { withPatient?: boolean }) {
  const withPatient = options?.withPatient ?? true;

  const router = createMemoryRouter(
    [
      {
        path: '/calendario',
        element: withPatient ? <CalendarWithPatient /> : <AppointmentCalendar />,
      },
      { path: '/registro', element: <div>Pantalla Registro</div> },
      { path: '/confirmacion', element: <div>Cita Confirmada Pantalla</div> },
    ],
    { initialEntries: ['/calendario'] }
  );

  return render(
    <AppointmentProvider>
      <RouterProvider router={router} />
    </AppointmentProvider>
  );
}

describe('AppointmentCalendar (unitaria)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 5, 4)); // 4 junio 2026
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('redirige a registro si no hay datos del paciente', async () => {
    renderCalendarRoute({ withPatient: false });

    expect(await screen.findByText('Pantalla Registro', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('renderiza el formulario de agendamiento con paciente registrado', async () => {
    renderCalendarRoute();

    expect(await screen.findByText('Agendar Cita Médica')).toBeInTheDocument();
    expect(screen.getByLabelText(/Especialidad/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar Cita/i })).toBeDisabled();
  });

  it('completa el flujo y navega a confirmación', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderCalendarRoute();

    await screen.findByText('Agendar Cita Médica');

    await user.click(screen.getByRole('combobox', { name: /Especialidad/i }));
    await user.click(await screen.findByRole('option', { name: 'Dermatología' }));

    await user.click(screen.getByRole('combobox', { name: /Médico/i }));
    await user.click(await screen.findByRole('option', { name: 'Dra. Carmen Sánchez' }));

    const calendar = await screen.findByRole('grid');
    const dayButtons = within(calendar).getAllByRole('gridcell');
    const futureDay = dayButtons.find(
      (cell) => cell.textContent === '15' && !cell.hasAttribute('disabled')
    );
    expect(futureDay).toBeTruthy();
    await user.click(futureDay!);

    await user.click(screen.getByRole('button', { name: '10:00' }));

    const confirmButton = screen.getByRole('button', { name: /Confirmar Cita/i });
    expect(confirmButton).not.toBeDisabled();

    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Cita Confirmada Pantalla')).toBeInTheDocument();
    });
  });

  it('navega a registro al pulsar Volver', async () => {
    const user = userEvent.setup();
    renderCalendarRoute();

    await screen.findByText('Agendar Cita Médica');
    await user.click(screen.getByRole('button', { name: /Volver/i }));

    expect(await screen.findByText('Pantalla Registro')).toBeInTheDocument();
  });
});

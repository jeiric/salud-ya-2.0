import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AppointmentProvider } from '../../context/AppointmentContext';
import AppointmentsList from './AppointmentsList';

it('muestra Badge por defecto para estado desconocido (mock local)', async () => {
  const AppointmentModule = await import('../../context/AppointmentContext');
  const spy = vi.spyOn(AppointmentModule, 'useAppointment').mockReturnValue({
    appointments: [
      {
        id: 'x',
        patientName: 'Paciente Prueba',
        email: 'p@e.com',
        phone: '000',
        specialty: 'Prueba',
        doctor: 'Dr Test',
        date: new Date(),
        status: 'desconocido',
      },
    ],
    updateAppointmentStatus: vi.fn(),
  } as any);

  render(<AppointmentsList />);
  expect(screen.getByText('desconocido')).toBeTruthy();

  spy.mockRestore();
});

describe('AppointmentsList (unitaria)', () => {
  it('lista citas mock y permite buscar por paciente', async () => {
    const user = userEvent.setup();
    render(
      <AppointmentProvider>
        <AppointmentsList />
      </AppointmentProvider>
    );

    expect(screen.getByText('María González')).toBeInTheDocument();

    const search = screen.getByPlaceholderText(/Buscar por paciente/i);
    await user.type(search, 'zzzz-no-existe');

    expect(screen.getByText(/No se encontraron citas médicas/i)).toBeInTheDocument();
  });

  it('muestra badge de estado confirmada', () => {
    render(
      <AppointmentProvider>
        <AppointmentsList />
      </AppointmentProvider>
    );
    expect(screen.getAllByText('Confirmada').length).toBeGreaterThan(0);
  });

  it('muestra el detalle de una cita pendiente y cambia el estado al confirmar', async () => {
    const user = userEvent.setup();
    render(
      <AppointmentProvider>
        <AppointmentsList />
      </AppointmentProvider>
    );

    const row = screen.getByText('Juan Pérez').closest('tr');
    expect(row).not.toBeNull();
    const viewButton = within(row as HTMLElement).getByRole('button', { name: /ver/i });

    await user.click(viewButton);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /detalles de la cita/i })).toBeInTheDocument();
    expect(within(dialog).getByText('Juan Pérez')).toBeInTheDocument();
    expect(within(dialog).getByText('+34 600 333 444')).toBeInTheDocument();
    expect(within(dialog).getByText('Pendiente')).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole('button', { name: /confirmar/i });
    await user.click(confirmButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByText('Confirmada').length).toBe(3);
  });

  it('cancela una cita pendiente desde el detalle y muestra el estado cancelada', async () => {
    const user = userEvent.setup();
    render(
      <AppointmentProvider>
        <AppointmentsList />
      </AppointmentProvider>
    );

    const row = screen.getByText('Juan Pérez').closest('tr');
    expect(row).not.toBeNull();
    const viewButton = within(row as HTMLElement).getByRole('button', { name: /ver/i });

    await user.click(viewButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(screen.queryByRole('heading', { name: /detalles de la cita/i })).not.toBeInTheDocument();
    expect(screen.getByText('Cancelada')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppointmentProvider } from '../../context/AppointmentContext';
import AppointmentsList from './AppointmentsList';

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
});

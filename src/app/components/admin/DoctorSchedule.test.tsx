import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DoctorSchedule, { getScheduleForDoctor, getStatusColor } from './DoctorSchedule';

describe('DoctorSchedule helpers', () => {
  it('getScheduleForDoctor devuelve arreglo vacío para médico desconocido', () => {
    expect(getScheduleForDoctor('Dr. Unknown')).toEqual([]);
  });

  it('getStatusColor devuelve clase por defecto para estado desconocido', () => {
    expect(getStatusColor('otro')).toContain('text-gray-700');
  });
});

describe('DoctorSchedule', () => {
  it('renderiza el horario por defecto y muestra los totales correctos', () => {
    render(<DoctorSchedule />);

    expect(screen.getByText('Seleccionar Fecha')).toBeInTheDocument();
    expect(screen.getByText('Horario del Médico')).toBeInTheDocument();
    expect(screen.getByText(/5 de abril de 2026/i)).toBeInTheDocument();

    const confirmadas = within(screen.getByText('Confirmadas').closest('div')!).getByText('1');
    const pendientes = within(screen.getByText('Pendientes').closest('div')!).getByText('1');
    const disponibles = within(screen.getByText('Disponibles').closest('div')!).getByText('3');

    expect(confirmadas).toBeInTheDocument();
    expect(pendientes).toBeInTheDocument();
    expect(disponibles).toBeInTheDocument();

    expect(screen.getByText('Dr. Carlos Martínez')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('Pedro Sánchez')).toBeInTheDocument();
  });

  it('cambia el médico seleccionado y actualiza los conteos de estado', async () => {
    const user = userEvent.setup();
    render(<DoctorSchedule />);

    const trigger = screen.getByText('Dr. Carlos Martínez').closest('button');
    expect(trigger).not.toBeNull();
    await user.click(trigger!);

    const option = await screen.findByText('Dra. Ana García');
    await user.click(option);

    const selectedTrigger = screen.getByText('Dra. Ana García').closest('button');
    expect(selectedTrigger).not.toBeNull();

    const confirmadas = within(screen.getByText('Confirmadas').closest('div')!).getByText('2');
    const pendientes = within(screen.getByText('Pendientes').closest('div')!).getByText('0');
    const disponibles = within(screen.getByText('Disponibles').closest('div')!).getByText('2');

    expect(confirmadas).toBeInTheDocument();
    expect(pendientes).toBeInTheDocument();
    expect(disponibles).toBeInTheDocument();

    expect(screen.getByText('09:30')).toBeInTheDocument();
    expect(screen.getByText('Luis Martín')).toBeInTheDocument();
  });
});

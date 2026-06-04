import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  AppointmentProvider,
  useAppointment,
  type PatientData,
} from './AppointmentContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppointmentProvider>{children}</AppointmentProvider>
);

const samplePatient: PatientData = {
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan@test.com',
  phone: '+34 600 000 000',
  birthDate: '1990-01-15',
  idNumber: '12345678A',
};

describe('AppointmentContext', () => {
  it('lanza error si useAppointment se usa fuera del provider', () => {
    expect(() => renderHook(() => useAppointment())).toThrow(
      'useAppointment must be used within an AppointmentProvider'
    );
  });

  it('inicializa con citas mock y sin paciente ni reserva actual', () => {
    const { result } = renderHook(() => useAppointment(), { wrapper });
    expect(result.current.patientData).toBeNull();
    expect(result.current.currentBooking).toBeNull();
    expect(result.current.appointments.length).toBeGreaterThanOrEqual(3);
  });

  it('guarda datos del paciente', () => {
    const { result } = renderHook(() => useAppointment(), { wrapper });
    act(() => result.current.setPatientData(samplePatient));
    expect(result.current.patientData).toEqual(samplePatient);
  });

  it('agrega cita y establece currentBooking', () => {
    const { result } = renderHook(() => useAppointment(), { wrapper });
    const initialCount = result.current.appointments.length;

    act(() => result.current.setPatientData(samplePatient));
    act(() =>
      result.current.addAppointment(
        'Cardiología',
        'Dr. José Fernández',
        new Date(2026, 5, 15),
        '10:00'
      )
    );

    expect(result.current.appointments.length).toBe(initialCount + 1);
    expect(result.current.currentBooking).not.toBeNull();
    expect(result.current.currentBooking?.specialty).toBe('Cardiología');
    expect(result.current.currentBooking?.patientName).toBe('Juan Pérez');
    expect(result.current.currentBooking?.status).toBe('pendiente');
  });

  it('actualiza el estado de una cita', () => {
    const { result } = renderHook(() => useAppointment(), { wrapper });
    const targetId = result.current.appointments[0].id;

    act(() => result.current.updateAppointmentStatus(targetId, 'cancelada'));

    const updated = result.current.appointments.find((a) => a.id === targetId);
    expect(updated?.status).toBe('cancelada');
  });

  it('resetAppointment limpia paciente y reserva actual', () => {
    const { result } = renderHook(() => useAppointment(), { wrapper });

    act(() => {
      result.current.setPatientData(samplePatient);
      result.current.addAppointment(
        'Medicina General',
        'Dr. Carlos Martínez',
        new Date(2026, 5, 20),
        '09:00'
      );
    });

    act(() => result.current.resetAppointment());

    expect(result.current.patientData).toBeNull();
    expect(result.current.currentBooking).toBeNull();
  });
});

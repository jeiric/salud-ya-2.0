import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  idNumber: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  specialty: string;
  doctor: string;
  date: Date;
  status: 'confirmada' | 'pendiente' | 'cancelada';
}

interface AppointmentContextType {
  patientData: PatientData | null;
  appointments: Appointment[];
  currentBooking: Appointment | null;
  setPatientData: (data: PatientData) => void;
  addAppointment: (specialty: string, doctor: string, date: Date, time: string) => void;
  updateAppointmentStatus: (id: string, status: 'confirmada' | 'pendiente' | 'cancelada') => void;
  resetAppointment: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Datos iniciales de prueba para el MVP
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'María González',
    email: 'maria.g@ejemplo.com',
    phone: '+34 600 111 222',
    specialty: 'Medicina General',
    doctor: 'Dr. Carlos Martínez',
    date: new Date(2026, 3, 5, 9, 0),
    status: 'confirmada',
  },
  {
    id: '2',
    patientName: 'Juan Pérez',
    email: 'juan.p@ejemplo.com',
    phone: '+34 600 333 444',
    specialty: 'Cardiología',
    doctor: 'Dr. José Fernández',
    date: new Date(2026, 3, 5, 10, 30),
    status: 'pendiente',
  },
  {
    id: '3',
    patientName: 'Ana Martín',
    email: 'ana.m@ejemplo.com',
    phone: '+34 600 555 666',
    specialty: 'Dermatología',
    doctor: 'Dra. Carmen Sánchez',
    date: new Date(2026, 3, 5, 11, 0),
    status: 'confirmada',
  },
];

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [currentBooking, setCurrentBooking] = useState<Appointment | null>(null);

  // Agrega una nueva cita al listado usando los datos acumulados del formulario
  const addAppointment = (specialty: string, doctor: string, date: Date, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: patientData ? `${patientData.firstName} ${patientData.lastName}` : 'Paciente Anónimo',
      email: patientData?.email || 'sin@correo.com',
      phone: patientData?.phone || '000000000',
      specialty,
      doctor,
      date: appointmentDate,
      status: 'pendiente',
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setCurrentBooking(newAppointment);
  };

  // Modifica el estado de una cita desde las acciones del administrador
  const updateAppointmentStatus = (id: string, status: 'confirmada' | 'pendiente' | 'cancelada') => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const resetAppointment = () => {
    setPatientData(null);
    setCurrentBooking(null);
  };

  return (
    <AppointmentContext.Provider
      value={{
        patientData,
        appointments,
        currentBooking,
        setPatientData,
        addAppointment,
        updateAppointmentStatus,
        resetAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}

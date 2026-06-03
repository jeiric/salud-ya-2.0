import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Corregido: unificado a react-router-dom
import { useAppointment } from '../context/AppointmentContext';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar as CalendarIcon, ArrowLeft, Clock } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const specialties = [
  'Medicina General',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Ginecología',
  'Traumatología',
  'Oftalmología',
  'Psiquiatría',
];

const doctors = {
  'Medicina General': ['Dr. Carlos Martínez', 'Dra. Ana García', 'Dr. Luis Rodríguez'],
  'Cardiología': ['Dr. José Fernández', 'Dra. María López'],
  'Dermatología': ['Dra. Carmen Sánchez', 'Dr. Pedro Gómez'],
  'Pediatría': ['Dra. Laura Jiménez', 'Dr. Miguel Torres'],
  'Ginecología': ['Dra. Isabel Ruiz', 'Dra. Patricia Moreno'],
  'Traumatología': ['Dr. Francisco Díaz', 'Dr. Javier Álvarez'],
  'Oftalmología': ['Dra. Elena Castro', 'Dr. Roberto Silva'],
  'Psiquiatría': ['Dr. Antonio Ramos', 'Dra. Sofía Navarro'],
};

const availableTimes = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
];

export default function AppointmentCalendar() {
  const navigate = useNavigate();
  const { patientData, addAppointment } = useAppointment(); // 👈 Conectado a la lista acumulativa

  const [specialty, setSpecialty] = useState<string>('');
  const [doctor, setDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    if (!patientData) {
      navigate('/registro');
    }
  }, [patientData, navigate]);

  const handleSpecialtyChange = (value: string) => {
    setSpecialty(value);
    setDoctor(''); // Reset doctor when specialty changes
  };

   const handleSubmit = () => {
    if (specialty && doctor && selectedDate && selectedTime) {
      addAppointment(specialty, doctor, selectedDate, selectedTime);
      navigate('/confirmacion'); // 👈 ¡Devuelto a la pantalla de confirmación!
    }
  };

  const isFormValid = specialty && doctor && selectedDate && selectedTime;

  // Disable past dates
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xl">SaludYa</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/registro')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Agendar Cita Médica</CardTitle>
            <CardDescription>
              Selecciona la especialidad, médico, fecha y hora para tu cita.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Specialty Selection */}
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidad *</Label>
              <Select value={specialty} onValueChange={handleSpecialtyChange}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            {specialty && (
              <div className="space-y-2">
                <Label htmlFor="doctor">Médico *</Label>
                <Select value={doctor} onValueChange={setDoctor}>
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Selecciona un médico" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {doctors[specialty as keyof typeof doctors].map((doc) => (
                      <SelectItem key={doc} value={doc}>
                        {doc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Selection */}
            {doctor && (
              <div className="space-y-2">
                <Label>Fecha *</Label>
                <div className="border rounded-lg p-4 flex justify-center bg-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDates}
                    locale={es}
                    className="rounded-md"
                  />
                </div>
                {selectedDate && (
                  <p className="text-sm text-gray-600">
                    Fecha seleccionada: {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                )}
              </div>
            )}

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hora Disponible *
                </Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? 'default' : 'outline'}
                      className={selectedTime === time ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/registro')}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                Confirmar Cita
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

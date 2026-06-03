import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

const doctors = [
  'Dr. Carlos Martínez',
  'Dra. Ana García',
  'Dr. José Fernández',
  'Dra. Carmen Sánchez',
  'Dra. Laura Jiménez',
  'Dra. Isabel Ruiz',
];

const scheduleByDoctor: Record<string, any[]> = {
  'Dr. Carlos Martínez': [
    { time: '09:00', patient: 'María González', status: 'confirmada' },
    { time: '09:30', patient: 'Disponible', status: 'available' },
    { time: '10:00', patient: 'Pedro Sánchez', status: 'pendiente' },
    { time: '10:30', patient: 'Disponible', status: 'available' },
    { time: '11:00', patient: 'Disponible', status: 'available' },
  ],
  'Dra. Ana García': [
    { time: '09:00', patient: 'Disponible', status: 'available' },
    { time: '09:30', patient: 'Luis Martín', status: 'confirmada' },
    { time: '10:00', patient: 'Disponible', status: 'available' },
    { time: '10:30', patient: 'Carmen Ruiz', status: 'confirmada' },
  ],
  'Dr. José Fernández': [
    { time: '10:30', patient: 'Juan Pérez', status: 'pendiente' },
    { time: '11:00', patient: 'Disponible', status: 'available' },
    { time: '11:30', patient: 'Ana Torres', status: 'confirmada' },
    { time: '12:00', patient: 'Disponible', status: 'available' },
  ],
};

export default function DoctorSchedule() {
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2026, 3, 5));

  const schedule = scheduleByDoctor[selectedDoctor] || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'available':
        return 'bg-gray-100 text-gray-500 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar Section */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Seleccionar Fecha</CardTitle>
            <CardDescription>Elige la fecha para ver los horarios</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Schedule Section */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Horario del Médico</CardTitle>
            <CardDescription>
              {selectedDate && format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium mb-2 block">Seleccionar Médico</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full bg-white border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-50 absolute">
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor} className="cursor-pointer hover:bg-gray-100 p-2">
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">Horarios</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {schedule.map((slot, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(
                      slot.status
                    )}`}
                  >
                    <div>
                      <p className="font-medium">{slot.time}</p>
                      <p className="text-sm">{slot.patient}</p>
                    </div>
                    {slot.status !== 'available' && (
                      <Badge
                        variant={slot.status === 'confirmada' ? 'default' : 'secondary'}
                        className={
                          slot.status === 'confirmada'
                            ? 'bg-green-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }
                      >
                        {slot.status === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {schedule.filter((s) => s.status === 'confirmada').length}
                  </p>
                  <p className="text-xs text-gray-600">Confirmadas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {schedule.filter((s) => s.status === 'pendiente').length}
                  </p>
                  <p className="text-xs text-gray-600">Pendientes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600">
                    {schedule.filter((s) => s.status === 'available').length}
                  </p>
                  <p className="text-xs text-gray-600">Disponibles</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

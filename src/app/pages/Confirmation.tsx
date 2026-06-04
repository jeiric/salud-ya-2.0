import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Unificado a react-router-dom
import { useAppointment } from '../context/AppointmentContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, CheckCircle2, User, Mail, Phone, Clock, Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Confirmation() {
  const navigate = useNavigate();
  // 👈 Obtenemos la lista acumulada de citas y la función de reinicio
  const { patientData, currentBooking, resetAppointment } = useAppointment();

  const latestAppointment = currentBooking;

  useEffect(() => {
    if (!patientData || !latestAppointment) {
      navigate('/registro');
    }
  }, [patientData, latestAppointment, navigate]);

  if (!patientData || !latestAppointment) {
    return null;
  }

  const handleNewAppointment = () => {
    resetAppointment(); // Limpia los estados del paciente anterior
    navigate('/registro'); // 👈 Te manda directo al inicio del formulario para otra cita
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white print:bg-white">
      {/* Header - Se oculta automáticamente al imprimir en papel */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xl">SaludYa</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Success Message */}
        <div className="text-center mb-8 print:mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 print:hidden">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">¡Cita Confirmada!</h1>
          <p className="text-gray-600 print:text-gray-900">
            Tu cita médica ha sido agendada exitosamente. Presenta este comprobante en la recepción del consultorio.
          </p>
        </div>

        {/* Appointment Details */}
        <Card className="mb-6 shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Detalles de la Cita</CardTitle>
            <CardDescription className="print:text-gray-700">
              Por favor, llega 15 minutos antes de tu cita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border">
                <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5 print:hidden" />
                <div>
                  <p className="text-sm text-gray-600 print:text-gray-700">Especialidad</p>
                  <p className="font-medium text-gray-900">{latestAppointment.specialty}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border">
                <User className="w-5 h-5 text-blue-600 mt-0.5 print:hidden" />
                <div>
                  <p className="text-sm text-gray-600 print:text-gray-700">Médico</p>
                  <p className="font-medium text-gray-900">{latestAppointment.doctor}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border">
                <CalendarIcon className="w-5 h-5 text-blue-600 mt-0.5 print:hidden" />
                <div>
                  <p className="text-sm text-gray-600 print:text-gray-700">Fecha</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(latestAppointment.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 print:hidden" />
                <div>
                  <p className="text-sm text-gray-600 print:text-gray-700">Hora</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(latestAppointment.date), 'HH:mm')} Hs
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Information */}
        <Card className="mb-6 shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Información del Paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400 print:hidden" />
              <div>
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="font-medium text-gray-900">{patientData.firstName} {patientData.lastName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400 print:hidden" />
              <div>
                <p className="text-sm text-gray-600">Correo electrónico</p>
                <p className="font-medium text-gray-900">{patientData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 print:hidden" />
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium text-gray-900">{patientData.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-yellow-50 border-yellow-200 mb-6 print:hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-yellow-800">Información Importante</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Llega 15 minutos antes de tu cita</li>
              <li>Trae tu identificación física al consultorio</li>
              <li>Si necesitas cancelar, hazlo con al menos 24 horas de anticipación</li>
              <li>Hemos enviado un recordatorio de respaldo a tu correo electrónico</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons - Se ocultan automáticamente al imprimir */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <Button
            variant="outline"
            className="flex-1 border-gray-300"
            onClick={() => window.print()}
          >
            Imprimir Confirmación
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={handleNewAppointment}
          >
            Agendar Nueva Cita
          </Button>
        </div>
      </div>
    </div>
  );
}

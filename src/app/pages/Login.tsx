import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Stethoscope, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Login() {
  const navigate = useNavigate();
  const [patientEmail, setPatientEmail] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientEmail) {
      // Mock login - in production would verify with backend
      navigate('/registro');
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffEmail && staffPassword) {
      // Mock login - demo credentials: admin@saludya.com / admin123
      if (staffEmail === 'admin@saludya.com' && staffPassword === 'admin123') {
        localStorage.setItem('userRole', 'staff');
        navigate('/admin/dashboard');
      } else {
        alert('Credenciales incorrectas. Usa: admin@saludya.com / admin123');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
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
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-gray-900">
            Sistema de Gestión de Citas Médicas
          </h1>
          <p className="text-xl text-gray-600">
            Organiza y agenda citas médicas de forma eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Patient Card */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Pacientes</CardTitle>
              <CardDescription className="text-base">
                Agenda tu cita médica de manera rápida y sencilla
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Staff Card */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Personal Médico</CardTitle>
              <CardDescription className="text-base">
                Gestiona citas y consulta el calendario del consultorio
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Login Tabs */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Acceder al Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient">Paciente</TabsTrigger>
                <TabsTrigger value="staff">Personal Médico</TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-4">
                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Correo Electrónico</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="paciente@ejemplo.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Como paciente nuevo, simplemente ingresa tu correo para comenzar a agendar.
                  </p>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Agendar Cita
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="staff" className="space-y-4">
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Correo Electrónico</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      placeholder="staff@saludya.com"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Contraseña</Label>
                    <Input
                      id="staff-password"
                      type="password"
                      placeholder="••••••••"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Demo: admin@saludya.com / admin123
                  </p>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Agenda Fácil',
      description: 'Selecciona fecha y hora que mejor te convenga',
    },
    {
      icon: Users,
      title: 'Especialistas Calificados',
      description: 'Médicos profesionales en diferentes especialidades',
    },
    {
      icon: Clock,
      title: 'Atención Rápida',
      description: 'Confirmación inmediata de tu cita médica',
    },
    {
      icon: CheckCircle,
      title: 'Fácil Gestión',
      description: 'Administra tus citas de forma sencilla',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xl">SaludYa</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Acceder
            </Button>
            <Button onClick={() => navigate('/login')}>
              Agendar Cita
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl mb-6 text-gray-900">
            Sistema de Gestión de Citas Médicas
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Solución digital completa para consultorios y centros médicos pequeños.
            Gestiona y reserva citas de forma eficiente.
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => navigate('/login')}
          >
            Comenzar Ahora
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 w-fit mb-2">
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <Card className="bg-blue-600 text-white border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl mb-2">¿Listo para digitalizar tu consultorio?</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Únete a SaludYa y mejora la gestión de citas en tu centro médico.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Comenzar Ahora
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 SaludYa. Sistema de Gestión de Citas Médicas.</p>
        </div>
      </footer>
    </div>
  );
}
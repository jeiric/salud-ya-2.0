import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const appointmentsPerDay = [
  { day: 'Lun', citas: 12 },
  { day: 'Mar', citas: 15 },
  { day: 'Mié', citas: 10 },
  { day: 'Jue', citas: 18 },
  { day: 'Vie', citas: 14 },
  { day: 'Sáb', citas: 8 },
];

const appointmentsBySpecialty = [
  { name: 'Medicina General', value: 35 },
  { name: 'Cardiología', value: 25 },
  { name: 'Pediatría', value: 20 },
  { name: 'Dermatología', value: 15 },
  { name: 'Otros', value: 15 },
];

const monthlyTrend = [
  { month: 'Ene', citas: 120 },
  { month: 'Feb', citas: 135 },
  { month: 'Mar', citas: 150 },
  { month: 'Abr', citas: 145 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Statistics() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Citas Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">145</div>
            <p className="text-sm text-green-600">+8.3% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tasa de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <p className="text-sm text-gray-500">134 de 145 citas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pacientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">287</div>
            <p className="text-sm text-blue-600">+23 nuevos este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Citas por Día (Semana Actual)</CardTitle>
            <CardDescription>Distribución de citas durante la semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="citas" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointments by Specialty */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Especialidad</CardTitle>
            <CardDescription>Citas del último mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentsBySpecialty}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}

                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentsBySpecialty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tendencia Mensual</CardTitle>
            <CardDescription>Evolución de citas por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="citas"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Citas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores de Rendimiento</CardTitle>
          <CardDescription>Métricas clave del consultorio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tiempo Promedio de Espera</p>
              <p className="text-2xl font-bold text-blue-600">12 min</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Duración Media Consulta</p>
              <p className="text-2xl font-bold text-green-600">25 min</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tasa de Cancelación</p>
              <p className="text-2xl font-bold text-yellow-600">8%</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Satisfacción Paciente</p>
              <p className="text-2xl font-bold text-purple-600">4.7/5</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

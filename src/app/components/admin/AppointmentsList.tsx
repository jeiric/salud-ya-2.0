import React, { useState } from 'react';
import { useAppointment } from '../../context/AppointmentContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AppointmentsList() {
  const { appointments, updateAppointmentStatus } = useAppointment(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredAppointments = appointments.filter(
    (apt: any) =>
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmada':
        return <Badge className="bg-green-500 text-white">Confirmada</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>;
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setDetailsOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: 'confirmada' | 'pendiente' | 'cancelada') => {
    updateAppointmentStatus(id, newStatus);
    setDetailsOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por paciente, especialidad o médico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No se encontraron citas médicas.
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment: any) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-sm text-gray-500">{appointment.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{appointment.specialty}</TableCell>
                  <TableCell className="text-gray-700">{appointment.doctor}</TableCell>
                  <TableCell className="text-gray-700">
                    <div>
                      <p className="font-medium">
                        {format(new Date(appointment.date), "d 'de' MMMM", { locale: es })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(appointment.date), 'HH:mm')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Detalles de la Cita</DialogTitle>
            <DialogDescription>
              Información completa de la cita médica gestionada.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-sm text-gray-500">Paciente</p>
                <p className="font-semibold text-gray-900">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contacto</p>
                <p className="text-gray-800">{selectedAppointment.email}</p>
                <p className="text-gray-800">{selectedAppointment.phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Especialidad</p>
                  <p className="font-medium text-gray-800">{selectedAppointment.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Médico</p>
                  <p className="font-medium text-gray-800">{selectedAppointment.doctor}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium text-gray-800">
                    {format(new Date(selectedAppointment.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hora</p>
                  <p className="font-medium text-gray-800">{format(new Date(selectedAppointment.date), 'HH:mm')}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado Actual</p>
                {getStatusBadge(selectedAppointment.status)}
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 pt-4 border-t">
            {selectedAppointment?.status === 'pendiente' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedAppointment.id, 'cancelada')}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedAppointment.id, 'confirmada')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



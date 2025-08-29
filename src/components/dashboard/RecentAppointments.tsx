import React from 'react';
import { Clock, User, Stethoscope } from 'lucide-react';
import { Appointment } from '../../types';

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

export const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Próximas Consultas</h3>
      
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{appointment.patient.name}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Stethoscope className="w-4 h-4 mr-1" />
                    {appointment.doctor.name}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
              <span className="text-sm text-gray-500 capitalize">
                {appointment.type}
              </span>
            </div>
          </div>
        ))}
        
        {appointments.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma consulta agendada</p>
          </div>
        )}
      </div>
    </div>
  );
};
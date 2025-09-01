import React, { useState } from 'react';
import { Search, Plus, Edit3, Phone, Mail, Calendar, Clock, Trash2 } from 'lucide-react';
import { Doctor } from '../../types';

interface DoctorManagementProps {
  doctors: Doctor[];
  onNewDoctor: () => void;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (doctorId: string) => void;
}

export const DoctorManagement: React.FC<DoctorManagementProps> = ({ 
  doctors, 
  onNewDoctor, 
  onEditDoctor,
  onDeleteDoctor 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specialties = [...new Set(doctors.map(d => d.speciality))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.crm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === '' || doctor.speciality === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  const getScheduleText = (schedule: Doctor['schedule']) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    return schedule.map(s => 
      `${days[s.dayOfWeek]} ${s.startTime}-${s.endTime}`
    ).join(', ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Médicos</h2>
            <p className="text-gray-600 mt-1">Gerencie os profissionais da clínica</p>
          </div>
          <button
            onClick={onNewDoctor}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Médico</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, especialidade ou CRM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas as especialidades</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium">{doctor.speciality}</p>
                  <p className="text-sm text-gray-600 mt-1">{doctor.crm}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Horários disponíveis
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {doctor.doctor_schedules?.map((sched: any, idx: number) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][sched.day_of_week]}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditDoctor(doctor)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar médico"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDoctor(doctor.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover médico"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {doctor.email}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {doctor.phone}
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center text-sm text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Horários de Atendimento:</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    {doctor.doctor_schedules?.length > 0 ? (
                      <div className="space-y-1">
                        {doctor.doctor_schedules.map((sched: any, idx: number) => {
                          const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                          return (
                            <div key={idx} className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>
                                {days[sched.day_of_week]}: {sched.start_time} às {sched.end_time}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Nenhum horário configurado</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Status: Ativo</span>
                  <span>Cadastrado em {new Date(doctor.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum médico encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedSpecialty 
                ? 'Tente buscar com outros termos ou filtros' 
                : 'Cadastre o primeiro médico da clínica'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
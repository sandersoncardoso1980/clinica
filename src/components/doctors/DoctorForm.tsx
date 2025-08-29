import React, { useState } from 'react';
import { X, Save, User, Stethoscope, FileText, Mail, Phone, Calendar, Plus, Trash2 } from 'lucide-react';
import { Doctor, Schedule } from '../../types';

interface DoctorFormProps {
  doctor?: Doctor;
  onSave: (doctorData: Omit<Doctor, 'id'>) => void;
  onCancel: () => void;
}

const specialties = [
  'Cardiologia',
  'Endocrinologia',
  'Dermatologia',
  'Neurologia',
  'Ortopedia',
  'Pediatria',
  'Ginecologia',
  'Oftalmologia',
  'Psiquiatria',
  'Clínica Geral',
  'Urologia',
  'Pneumologia',
  'Gastroenterologia',
  'Reumatologia',
  'Oncologia'
];

const daysOfWeek = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' }
];

export const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    speciality: doctor?.speciality || '',
    crm: doctor?.crm || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    schedule: doctor?.schedule || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.speciality) {
      newErrors.speciality = 'Especialidade é obrigatória';
    }

    if (!formData.crm.trim()) {
      newErrors.crm = 'CRM é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' }]
    }));
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((sched, i) => 
        i === index ? { ...sched, [field]: value } : sched
      )
    }));
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {doctor ? 'Editar Médico' : 'Novo Médico'}
              </h2>
              <p className="text-gray-600 mt-1">
                {doctor ? 'Atualize as informações do profissional' : 'Cadastre um novo profissional'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Dr. João Silva"
                />
              </div>
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidade *
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={formData.speciality}
                  onChange={(e) => setFormData(prev => ({ ...prev, speciality: e.target.value }))}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.speciality ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="">Selecione uma especialidade</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              {errors.speciality && <p className="text-red-600 text-xs mt-1">{errors.speciality}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CRM *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.crm}
                  onChange={(e) => setFormData(prev => ({ ...prev, crm: e.target.value }))}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.crm ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="CRM/SP 123456"
                />
              </div>
              {errors.crm && <p className="text-red-600 text-xs mt-1">{errors.crm}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="medico@email.com"
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Schedule Configuration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Horários de Atendimento</h3>
                <p className="text-sm text-gray-600">Configure os dias e horários de trabalho</p>
              </div>
              <button
                type="button"
                onClick={addSchedule}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Horário</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.schedule.map((sched, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={sched.dayOfWeek}
                      onChange={(e) => updateSchedule(index, 'dayOfWeek', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={sched.startTime}
                      onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-500">às</span>
                    <input
                      type="time"
                      value={sched.endTime}
                      onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {formData.schedule.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Nenhum horário configurado</p>
                  <p className="text-sm">Clique em "Adicionar Horário" para começar</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{doctor ? 'Atualizar' : 'Cadastrar'} Médico</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
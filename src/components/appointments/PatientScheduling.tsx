import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Doctor, Appointment } from '../../types';

interface PatientSchedulingProps {
  doctors: Doctor[];
  onScheduleAppointment: (appointmentData: any) => void;
  getAvailableTimeSlots: (doctorId: string, date: string) => Promise<string[]>;
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
  'Clínica Geral'
];

const appointmentTypes = [
  { value: 'consultation', label: 'Consulta' },
  { value: 'exam', label: 'Exame' },
  { value: 'return', label: 'Retorno' }
];

export const PatientScheduling: React.FC<PatientSchedulingProps> = ({ 
  doctors, 
  onScheduleAppointment,
  getAvailableTimeSlots
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const filteredDoctors = selectedSpecialty 
    ? doctors.filter(doctor => doctor.speciality === selectedSpecialty)
    : [];

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  const getAvailableDates = () => {
    if (!selectedDoctorData) return [];
    
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const hasSchedule = selectedDoctorData.doctor_schedules?.some((s: any) => s.day_of_week === dayOfWeek);
      
      if (hasSchedule) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  const loadAvailableSlots = async (date: string) => {
    if (!selectedDoctor || !date) return;
    
    setLoadingSlots(true);
    try {
      const slots = await getAvailableTimeSlots(selectedDoctor, date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Load slots when date is selected
  React.useEffect(() => {
    if (selectedDate && selectedDoctor) {
      loadAvailableSlots(selectedDate);
      }
    }
  }, [selectedDate, selectedDoctor]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        notes: notes.trim()
      };
      
      await onScheduleAppointment(appointmentData);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setSelectedSpecialty('');
        setSelectedDoctor('');
        setSelectedDate('');
        setSelectedTime('');
        setNotes('');
        setAppointmentType('consultation');
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 2:
        return selectedSpecialty !== '';
      case 3:
        return selectedDoctor !== '';
      case 4:
        return selectedDate !== '';
      case 5:
        return selectedTime !== '';
      default:
        return true;
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Sua consulta foi agendada com sucesso. Você receberá uma confirmação por email.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-green-800 mb-2">Detalhes do Agendamento:</h3>
            <div className="space-y-1 text-sm text-green-700">
              <p><strong>Médico:</strong> {selectedDoctorData?.name}</p>
              <p><strong>Especialidade:</strong> {selectedSpecialty}</p>
              <p><strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Horário:</strong> {selectedTime}</p>
              <p><strong>Tipo:</strong> {appointmentTypes.find(t => t.value === appointmentType)?.label}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 1 && 'Escolha a Especialidade'}
              {step === 2 && 'Selecione o Médico'}
              {step === 3 && 'Escolha a Data'}
              {step === 4 && 'Selecione o Horário'}
              {step === 5 && 'Confirme os Dados'}
            </h2>
            <p className="text-gray-600 mt-1">
              {step === 1 && 'Qual especialidade médica você precisa?'}
              {step === 2 && 'Escolha o profissional de sua preferência'}
              {step === 3 && 'Selecione uma data disponível'}
              {step === 4 && 'Escolha o melhor horário para você'}
              {step === 5 && 'Revise e confirme seu agendamento'}
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Specialty Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => {
                    setSelectedSpecialty(specialty);
                    setStep(2);
                  }}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">{specialty}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Doctor Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Especialidade selecionada:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {selectedSpecialty}
                  </span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Alterar especialidade
                </button>
              </div>
              
              <div className="grid gap-4">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setSelectedDoctor(doctor.id);
                      setStep(3);
                    }}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.crm}</p>
                        <p className="text-sm text-blue-600 mt-1">{doctor.speciality}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Horários disponíveis
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doctor.schedule.map((sched, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][sched.dayOfWeek]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Médico selecionado:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {selectedDoctorData?.name}
                  </span>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Alterar médico
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {getAvailableDates().slice(0, 12).map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime('');
                        setStep(4);
                      }}
                      className={`p-3 border-2 rounded-lg transition-all text-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {dateObj.toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {dateObj.toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Time Selection */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Data selecionada:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {new Date(selectedDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Alterar data
                </button>
              </div>

              {loadingSlots ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600">Carregando horários...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setStep(5);
                      }}
                      className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                      <div className="text-sm font-medium text-gray-900">{time}</div>
                    </button>
                  ))}
                </div>
              )}

              {!loadingSlots && availableSlots.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum horário disponível
                  </h3>
                  <p className="text-gray-500">
                    Escolha outra data ou médico
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Time Selection - Old implementation removed */}
          {false && step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Data selecionada:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {new Date(selectedDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Alterar data
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Old time selection logic */}
              </div>
            </div>
          )}

          {/* Step 5 continues as before... */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Resumo do Agendamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Especialidade:</span>
                    <p className="text-blue-900">{selectedSpecialty}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Médico:</span>
                    <p className="text-blue-900">{selectedDoctorData?.full_name}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Data:</span>
                    <p className="text-blue-900">{new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Horário:</span>
                    <p className="text-blue-900">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Consulta
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {appointmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={200}
                  placeholder="Descreva brevemente o motivo da consulta ou sintomas..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {notes.length}/200 caracteres
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setStep(5);
                    }}
                    className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-medium text-gray-900">{time}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Resumo do Agendamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Especialidade:</span>
                    <p className="text-blue-900">{selectedSpecialty}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Médico:</span>
                    <p className="text-blue-900">{selectedDoctorData?.name}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Data:</span>
                    <p className="text-blue-900">{new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Horário:</span>
                    <p className="text-blue-900">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Consulta
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {appointmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={200}
                  placeholder="Descreva brevemente o motivo da consulta ou sintomas..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {notes.length}/200 caracteres
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step > 1 && step < 5 && (
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceedToStep(step + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
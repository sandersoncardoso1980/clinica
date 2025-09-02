import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export const PatientScheduling: React.FC<{
  doctors: any[];
  onScheduleAppointment: (appointment: any) => Promise<void>;
  getAvailableTimeSlots: (doctorId: string, date: string) => string[];
}> = ({ doctors, onScheduleAppointment, getAvailableTimeSlots }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  const specialties = [
    { id: 'cardiologia', name: 'Cardiologia', icon: '❤️' },
    { id: 'dermatologia', name: 'Dermatologia', icon: '🧴' },
    { id: 'ginecologia', name: 'Ginecologia', icon: '👩‍⚕️' },
    { id: 'neurologia', name: 'Neurologia', icon: '🧠' },
    { id: 'ortopedia', name: 'Ortopedia', icon: '🦴' },
    { id: 'pediatria', name: 'Pediatria', icon: '👶' },
    { id: 'psiquiatria', name: 'Psiquiatria', icon: '🧘' },
    { id: 'clinica-geral', name: 'Clínica Geral', icon: '🩺' },
  ];

  const filteredDoctors = doctors.filter(doctor => 
    doctor.speciality.toLowerCase() === selectedSpecialty.toLowerCase()
  );

  const availableTimeSlots = selectedDoctor && selectedDate 
    ? getAvailableTimeSlots(selectedDoctor.id, selectedDate)
    : [];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onScheduleAppointment({
        doctor_id: selectedDoctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        appointment_type: 'consultation',
        notes: notes.trim(),
        status: 'scheduled'
      });
      setAppointmentConfirmed(true);
      setCurrentStep(5);
    } catch (error) {
      alert('Erro ao agendar consulta: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedSpecialty('');
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
    setAppointmentConfirmed(false);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  if (appointmentConfirmed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Consulta Agendada com Sucesso!
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Detalhes da Consulta:</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Médico:</span>
                <span className="font-medium">{selectedDoctor?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Especialidade:</span>
                <span className="font-medium">{selectedDoctor?.speciality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horário:</span>
                <span className="font-medium">{formatTime(selectedTime)}</span>
              </div>
              {notes && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-gray-600 block mb-2">Observações:</span>
                  <span className="text-sm text-gray-800">{notes}</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            Você receberá uma confirmação por e-mail com todos os detalhes da consulta.
            Lembre-se de chegar 15 minutos antes do horário agendado.
          </p>
          
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Agendar Nova Consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-20 h-1 mx-4 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Especialidade</span>
          <span>Médico</span>
          <span>Data</span>
          <span>Confirmação</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Step 1: Select Specialty */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Escolha a Especialidade
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specialties.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => setSelectedSpecialty(specialty.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    selectedSpecialty === specialty.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{specialty.icon}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {specialty.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Doctor */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Escolha o Médico
            </h2>
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`w-full p-4 rounded-lg border-2 transition-all hover:shadow-md text-left ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{doctor.full_name}</h3>
                      <p className="text-sm text-gray-600">{doctor.speciality}</p>
                      <p className="text-sm text-gray-500">CRM: {doctor.crm}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        R$ {doctor.consultation_fee}
                      </p>
                      <p className="text-sm text-gray-500">Consulta</p>
                    </div>
                  </div>
                </button>
              ))}
              {filteredDoctors.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Nenhum médico disponível para esta especialidade.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Select Date and Time */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Escolha Data e Horário
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Consulta
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horários Disponíveis
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-sm rounded-lg border transition-all ${
                          selectedTime === time
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                  {availableTimeSlots.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Nenhum horário disponível para esta data.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
                placeholder="Descreva brevemente o motivo da consulta..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                {notes.length}/200 caracteres
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Confirmar Agendamento
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resumo da Consulta:</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Especialidade:</span>
                  <span className="font-medium">
                    {specialties.find(s => s.id === selectedSpecialty)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Médico:</span>
                  <span className="font-medium">{selectedDoctor?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CRM:</span>
                  <span className="font-medium">{selectedDoctor?.crm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium">{formatTime(selectedTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium text-lg">R$ {selectedDoctor?.consultation_fee}</span>
                </div>
                {notes && (
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-gray-600 block mb-2">Observações:</span>
                    <span className="text-sm text-gray-800">{notes}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Chegue 15 minutos antes do horário agendado.
                Traga um documento de identidade e cartão do convênio (se aplicável).
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !selectedSpecialty) ||
                (currentStep === 2 && !selectedDoctor) ||
                (currentStep === 3 && (!selectedDate || !selectedTime))
              }
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                (currentStep === 1 && !selectedSpecialty) ||
                (currentStep === 2 && !selectedDoctor) ||
                (currentStep === 3 && (!selectedDate || !selectedTime))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <span>Próximo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Agendando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmar Agendamento</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

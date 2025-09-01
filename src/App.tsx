import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardStats } from './components/dashboard/DashboardStats';
import { RecentAppointments } from './components/dashboard/RecentAppointments';
import { AppointmentCalendar } from './components/appointments/AppointmentCalendar';
import { PatientList } from './components/patients/PatientList';
import { PatientScheduling } from './components/appointments/PatientScheduling';
import { DoctorManagement } from './components/doctors/DoctorManagement';
import { DoctorForm } from './components/doctors/DoctorForm';
import { useSupabaseData } from './hooks/useSupabaseData';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const { 
    loading, 
    patients, 
    doctors, 
    appointments, 
    dashboardStats,
    createAppointment,
    getAvailableTimeSlots,
    saveDoctor,
    deleteDoctor
  } = useSupabaseData();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginForm />;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const handleNewDoctor = () => {
    setEditingDoctor(null);
    setShowDoctorForm(true);
  };

  const handleEditDoctor = (doctor: any) => {
    setEditingDoctor(doctor);
    setShowDoctorForm(true);
  };

  const handleSaveDoctor = async (doctorData: any) => {
    try {
      await saveDoctor(doctorData);
      setShowDoctorForm(false);
      setEditingDoctor(null);
    } catch (error) {
      alert('Erro ao salvar médico: ' + (error as Error).message);
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (confirm('Tem certeza que deseja remover este médico?')) {
      try {
        await deleteDoctor(doctorId);
      } catch (error) {
        alert('Erro ao remover médico: ' + (error as Error).message);
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vindo, {user.name}!
              </h1>
              <p className="text-gray-600">
                Aqui está um resumo das atividades de hoje
              </p>
            </div>
            
            <DashboardStats stats={dashboardStats} userRole={user.role} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentAppointments appointments={appointments.slice(0, 5)} />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Consulta com Ana Silva Santos concluída
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Novo agendamento confirmado para amanhã
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Estoque baixo: Seringas 10ml
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'appointments':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Agendamentos</h1>
              <p className="text-gray-600">Gerencie consultas e horários</p>
            </div>
            <AppointmentCalendar 
              appointments={appointments} 
              onNewAppointment={() => alert('Funcionalidade em desenvolvimento')}
            />
          </div>
        );
      
      case 'patients':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Pacientes</h1>
              <p className="text-gray-600">Gerencie informações dos pacientes</p>
            </div>
            <PatientList 
              patients={patients}
              onNewPatient={() => alert('Funcionalidade em desenvolvimento')}
              onEditPatient={() => alert('Funcionalidade em desenvolvimento')}
            />
          </div>
        );
      
      case 'schedule':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Agendar Consulta</h1>
              <p className="text-gray-600">Escolha o médico, data e horário para sua consulta</p>
            </div>
            <PatientScheduling 
              doctors={doctors}
              onScheduleAppointment={createAppointment}
              getAvailableTimeSlots={getAvailableTimeSlots}
            />
          </div>
        );
      
      case 'doctors':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Médicos</h1>
              <p className="text-gray-600">Gerencie os profissionais da clínica</p>
            </div>
            <DoctorManagement 
              doctors={doctors}
              onNewDoctor={handleNewDoctor}
              onEditDoctor={handleEditDoctor}
              onDeleteDoctor={handleDeleteDoctor}
            />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-gray-600">Esta seção está em desenvolvimento</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        user={user} 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={sidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Doctor Form Modal */}
      {showDoctorForm && (
        <DoctorForm
          doctor={editingDoctor}
          onSave={handleSaveDoctor}
          onCancel={() => {
            setShowDoctorForm(false);
            setEditingDoctor(null);
          }}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;
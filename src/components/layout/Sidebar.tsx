import React from 'react';
import { 
  Calendar, 
  Users, 
  UserPlus, 
  DollarSign, 
  Package, 
  FileText, 
  Settings, 
  Home,
  Stethoscope,
  Clock
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
}

const menuItems = {
  admin: [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Agendamentos' },
    { id: 'patients', icon: Users, label: 'Pacientes' },
    { id: 'doctors', icon: UserPlus, label: 'Médicos' },
    { id: 'financial', icon: DollarSign, label: 'Financeiro' },
    { id: 'inventory', icon: Package, label: 'Estoque' },
    { id: 'reports', icon: FileText, label: 'Relatórios' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ],
  doctor: [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Minha Agenda' },
    { id: 'patients', icon: Users, label: 'Meus Pacientes' },
    { id: 'prescriptions', icon: FileText, label: 'Receitas' },
    { id: 'schedule', icon: Clock, label: 'Horários' },
  ],
  receptionist: [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Agendamentos' },
    { id: 'patients', icon: Users, label: 'Pacientes' },
    { id: 'financial', icon: DollarSign, label: 'Caixa' },
  ],
  patient: [
    { id: 'dashboard', icon: Home, label: 'Meus Dados' },
    { id: 'appointments', icon: Calendar, label: 'Consultas' },
    { id: 'history', icon: FileText, label: 'Histórico' },
    { id: 'schedule', icon: Stethoscope, label: 'Agendar' },
  ]
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  activeSection, 
  onSectionChange, 
  isCollapsed 
}) => {
  const items = menuItems[user.role] || [];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-gray-800">ClinicaSaaS</h1>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
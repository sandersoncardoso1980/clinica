import React from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { DashboardStats as Stats } from '../../types';

interface DashboardStatsProps {
  stats: Stats;
  userRole: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, userRole }) => {
  const getStatsCards = () => {
    const baseCards = [
      {
        title: 'Consultas Hoje',
        value: stats.todayAppointments,
        icon: Calendar,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Total Pacientes',
        value: stats.totalPatients,
        icon: Users,
        color: 'bg-green-500',
        bgColor: 'bg-green-50'
      }
    ];

    if (userRole === 'admin') {
      return [
        ...baseCards,
        {
          title: 'Receita Mensal',
          value: `R$ ${stats.monthlyRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: 'bg-emerald-500',
          bgColor: 'bg-emerald-50'
        },
        {
          title: 'Estoque Baixo',
          value: stats.lowStockItems,
          icon: AlertTriangle,
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50'
        },
        {
          title: 'Agendamentos Pendentes',
          value: stats.pendingAppointments,
          icon: Clock,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50'
        },
        {
          title: 'Consultas Concluídas',
          value: stats.completedAppointments,
          icon: CheckCircle,
          color: 'bg-indigo-500',
          bgColor: 'bg-indigo-50'
        }
      ];
    }

    if (userRole === 'doctor') {
      return [
        ...baseCards,
        {
          title: 'Agendamentos Pendentes',
          value: stats.pendingAppointments,
          icon: Clock,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50'
        },
        {
          title: 'Consultas Concluídas',
          value: stats.completedAppointments,
          icon: CheckCircle,
          color: 'bg-indigo-500',
          bgColor: 'bg-indigo-50'
        }
      ];
    }

    return baseCards;
  };

  const cards = getStatsCards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
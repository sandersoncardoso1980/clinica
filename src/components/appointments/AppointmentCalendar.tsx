import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onNewAppointment: () => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ 
  appointments, 
  onNewAppointment 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'July', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push({ date: day, isCurrentMonth: true });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      days.push({ date: day, isCurrentMonth: false });
    }

    return days;
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <button
          onClick={onNewAppointment}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day.date);
          const isCurrentDay = isToday(day.date);
          
          return (
            <div
              key={index}
              className={`min-h-[100px] border border-gray-200 p-2 ${
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } hover:bg-blue-50 transition-colors cursor-pointer`}
            >
              <div className={`text-sm font-medium mb-2 ${
                isCurrentDay 
                  ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mx-auto'
                  : day.isCurrentMonth 
                    ? 'text-gray-900'
                    : 'text-gray-400'
              }`}>
                {day.date.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded truncate"
                    title={`${apt.time} - ${apt.patient.name}`}
                  >
                    {apt.time} - {apt.patient.name.split(' ')[0]}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayAppointments.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
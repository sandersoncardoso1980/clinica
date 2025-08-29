import { useState } from 'react';
import { Appointment, Patient, Doctor, Financial, Inventory, DashboardStats } from '../types';

export const useMockData = () => {
  // Mock Patients
  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Ana Silva Santos',
      email: 'ana.silva@email.com',
      phone: '(11) 99999-1111',
      birthDate: '1985-03-15',
      cpf: '123.456.789-01',
      address: 'Rua das Flores, 123, São Paulo - SP',
      emergencyContact: '(11) 98888-1111',
      medicalHistory: 'Hipertensão arterial, diabetes tipo 2',
      allergies: 'Penicilina, frutos do mar',
      medications: 'Losartana 50mg, Metformina 850mg'
    },
    {
      id: '2',
      name: 'João Pedro Costa',
      email: 'joao.pedro@email.com',
      phone: '(11) 99999-2222',
      birthDate: '1992-07-22',
      cpf: '987.654.321-02',
      address: 'Av. Paulista, 456, São Paulo - SP',
      emergencyContact: '(11) 98888-2222',
      medicalHistory: 'Asma leve',
      allergies: 'Nenhuma conhecida',
      medications: 'Salbutamol spray'
    },
    {
      id: '3',
      name: 'Maria Oliveira Lima',
      email: 'maria.oliveira@email.com',
      phone: '(11) 99999-3333',
      birthDate: '1978-11-08',
      cpf: '456.789.123-03',
      address: 'Rua Augusta, 789, São Paulo - SP',
      emergencyContact: '(11) 98888-3333',
      medicalHistory: 'Enxaqueca crônica',
      allergies: 'Dipirona',
      medications: 'Sumatriptana 50mg'
    }
  ]);

  // Mock Doctors
  const [doctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. João Santos',
      speciality: 'Cardiologia',
      crm: 'CRM/SP 123456',
      email: 'joao@clinica.com',
      phone: '(11) 99999-4444',
      schedule: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
        { dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '12:00' },
        { dayOfWeek: 5, startTime: '08:00', endTime: '12:00' },
      ]
    },
    {
      id: '2',
      name: 'Dra. Patricia Mendes',
      speciality: 'Endocrinologia',
      crm: 'CRM/SP 789012',
      email: 'patricia@clinica.com',
      phone: '(11) 99999-5555',
      schedule: [
        { dayOfWeek: 2, startTime: '09:00', endTime: '13:00' },
        { dayOfWeek: 4, startTime: '14:00', endTime: '18:00' },
        { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' },
      ]
    },
    {
      id: '3',
      name: 'Dr. Carlos Rodrigues',
      speciality: 'Ortopedia',
      crm: 'CRM/SP 345678',
      email: 'carlos@clinica.com',
      phone: '(11) 99999-6666',
      schedule: [
        { dayOfWeek: 1, startTime: '07:00', endTime: '11:00' },
        { dayOfWeek: 3, startTime: '13:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '07:00', endTime: '11:00' },
      ]
    },
    {
      id: '4',
      name: 'Dra. Ana Beatriz Lima',
      speciality: 'Pediatria',
      crm: 'CRM/SP 567890',
      email: 'ana@clinica.com',
      phone: '(11) 99999-7777',
      schedule: [
        { dayOfWeek: 2, startTime: '08:00', endTime: '12:00' },
        { dayOfWeek: 2, startTime: '14:00', endTime: '18:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '12:00' },
        { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' },
      ]
    }
  ]);

  // Mock Appointments
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      patientId: '1',
      doctorId: '1',
      date: '2025-01-15',
      time: '09:00',
      type: 'consultation',
      status: 'scheduled',
      patient: patients[0],
      doctor: doctors[0],
      notes: 'Retorno cardiológico'
    },
    {
      id: '2',
      patientId: '2',
      doctorId: '2',
      date: '2025-01-15',
      time: '10:30',
      type: 'consultation',
      status: 'confirmed',
      patient: patients[1],
      doctor: doctors[1],
      notes: 'Primeira consulta endocrinológica'
    },
    {
      id: '3',
      patientId: '3',
      doctorId: '1',
      date: '2025-01-15',
      time: '14:00',
      type: 'return',
      status: 'completed',
      patient: patients[2],
      doctor: doctors[0],
      notes: 'Consulta de retorno'
    }
  ]);

  // Mock Financial Data
  const [financial] = useState<Financial[]>([
    {
      id: '1',
      date: '2025-01-15',
      description: 'Consulta - Ana Silva Santos',
      type: 'income',
      category: 'Consultas',
      amount: 200.00,
      paymentMethod: 'card'
    },
    {
      id: '2',
      date: '2025-01-15',
      description: 'Material de escritório',
      type: 'expense',
      category: 'Materiais',
      amount: 150.00,
      paymentMethod: 'cash'
    },
    {
      id: '3',
      date: '2025-01-14',
      description: 'Consulta - João Pedro Costa',
      type: 'income',
      category: 'Consultas',
      amount: 180.00,
      paymentMethod: 'pix'
    }
  ]);

  // Mock Inventory
  const [inventory] = useState<Inventory[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'medication',
      quantity: 50,
      minStock: 20,
      unitPrice: 0.25,
      supplier: 'Farmácia ABC',
      expiryDate: '2025-12-31'
    },
    {
      id: '2',
      name: 'Seringas 10ml',
      category: 'material',
      quantity: 15,
      minStock: 30,
      unitPrice: 0.80,
      supplier: 'Suprimentos Médicos Ltda'
    },
    {
      id: '3',
      name: 'Luvas descartáveis',
      category: 'material',
      quantity: 200,
      minStock: 50,
      unitPrice: 0.15,
      supplier: 'Equipamentos Hospitalares'
    }
  ]);

  // Mock Dashboard Stats
  const [dashboardStats] = useState<DashboardStats>({
    todayAppointments: 8,
    totalPatients: 125,
    monthlyRevenue: 45000,
    lowStockItems: 2,
    pendingAppointments: 3,
    completedAppointments: 45
  });

  return {
    patients,
    doctors,
    appointments,
    financial,
    inventory,
    dashboardStats
  };
};
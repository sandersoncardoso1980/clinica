export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'receptionist' | 'patient';
  avatar?: string;
  phone?: string;
  speciality?: string; // for doctors
  crm?: string; // for doctors
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  allergies?: string;
  medications?: string;
}

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  crm: string;
  email: string;
  phone: string;
  schedule: Schedule[];
}

export interface Schedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'consultation' | 'exam' | 'return';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  patient: Patient;
  doctor: Doctor;
}

export interface Financial {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'pix' | 'transfer';
}

export interface Inventory {
  id: string;
  name: string;
  category: 'medication' | 'material' | 'equipment';
  quantity: number;
  minStock: number;
  unitPrice: number;
  supplier: string;
  expiryDate?: string;
}

export interface DashboardStats {
  todayAppointments: number;
  totalPatients: number;
  monthlyRevenue: number;
  lowStockItems: number;
  pendingAppointments: number;
  completedAppointments: number;
}
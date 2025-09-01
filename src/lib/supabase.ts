import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      clinic_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          role: 'admin' | 'doctor' | 'receptionist' | 'patient';
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          role: 'admin' | 'doctor' | 'receptionist' | 'patient';
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          role?: 'admin' | 'doctor' | 'receptionist' | 'patient';
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      doctors: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          speciality: string;
          crm: string;
          email: string;
          phone: string | null;
          bio: string | null;
          consultation_fee: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          speciality: string;
          crm: string;
          email: string;
          phone?: string | null;
          bio?: string | null;
          consultation_fee?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          speciality?: string;
          crm?: string;
          email?: string;
          phone?: string | null;
          bio?: string | null;
          consultation_fee?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          birth_date: string | null;
          cpf: string | null;
          address: string | null;
          emergency_contact: string | null;
          medical_history: string;
          allergies: string;
          medications: string;
          insurance_plan: string | null;
          insurance_number: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          birth_date?: string | null;
          cpf?: string | null;
          address?: string | null;
          emergency_contact?: string | null;
          medical_history?: string;
          allergies?: string;
          medications?: string;
          insurance_plan?: string | null;
          insurance_number?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          birth_date?: string | null;
          cpf?: string | null;
          address?: string | null;
          emergency_contact?: string | null;
          medical_history?: string;
          allergies?: string;
          medications?: string;
          insurance_plan?: string | null;
          insurance_number?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          appointment_date: string;
          appointment_time: string;
          appointment_type: 'consultation' | 'exam' | 'return';
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes: string;
          medical_notes: string;
          consultation_fee: number;
          payment_status: 'pending' | 'paid' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          doctor_id: string;
          appointment_date: string;
          appointment_time: string;
          appointment_type?: 'consultation' | 'exam' | 'return';
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes?: string;
          medical_notes?: string;
          consultation_fee?: number;
          payment_status?: 'pending' | 'paid' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          doctor_id?: string;
          appointment_date?: string;
          appointment_time?: string;
          appointment_type?: 'consultation' | 'exam' | 'return';
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes?: string;
          medical_notes?: string;
          consultation_fee?: number;
          payment_status?: 'pending' | 'paid' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      appointment_details: {
        Row: {
          id: string;
          appointment_date: string;
          appointment_time: string;
          appointment_type: 'consultation' | 'exam' | 'return';
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes: string;
          medical_notes: string;
          consultation_fee: number;
          payment_status: 'pending' | 'paid' | 'cancelled';
          created_at: string;
          updated_at: string;
          patient_name: string;
          patient_email: string;
          patient_phone: string | null;
          patient_birth_date: string | null;
          doctor_name: string;
          doctor_speciality: string;
          doctor_crm: string;
        };
      };
    };
    Functions: {
      get_available_time_slots: {
        Args: {
          doctor_uuid: string;
          appointment_date: string;
        };
        Returns: {
          time_slot: string;
        }[];
      };
    };
  };
}
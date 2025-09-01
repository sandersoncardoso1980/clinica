import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    monthlyRevenue: 0,
    lowStockItems: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });

  // Load doctors
  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          doctor_schedules (*)
        `)
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  // Load patients
  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  // Load appointments
  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_details')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  // Load dashboard stats
  const loadDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      // Today's appointments
      const { data: todayAppts } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', today)
        .neq('status', 'cancelled');

      // Total patients
      const { data: totalPts } = await supabase
        .from('patients')
        .select('id')
        .eq('is_active', true);

      // Monthly revenue
      const { data: monthlyRev } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('transaction_type', 'income')
        .eq('payment_status', 'completed')
        .gte('transaction_date', startOfMonth);

      // Pending appointments
      const { data: pendingAppts } = await supabase
        .from('appointments')
        .select('id')
        .eq('status', 'scheduled');

      // Completed appointments this month
      const { data: completedAppts } = await supabase
        .from('appointments')
        .select('id')
        .eq('status', 'completed')
        .gte('appointment_date', startOfMonth);

      // Low stock items
      const { data: lowStock } = await supabase
        .from('inventory_items')
        .select('id')
        .lt('current_stock', supabase.raw('min_stock'));

      setDashboardStats({
        todayAppointments: todayAppts?.length || 0,
        totalPatients: totalPts?.length || 0,
        monthlyRevenue: monthlyRev?.reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        lowStockItems: lowStock?.length || 0,
        pendingAppointments: pendingAppts?.length || 0,
        completedAppointments: completedAppts?.length || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  // Create appointment
  const createAppointment = async (appointmentData: any) => {
    try {
      // Get patient ID from current user
      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!patient) {
        throw new Error('Perfil de paciente não encontrado');
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patient.id,
          doctor_id: appointmentData.doctorId,
          appointment_date: appointmentData.date,
          appointment_time: appointmentData.time,
          appointment_type: appointmentData.type,
          notes: appointmentData.notes || ''
        })
        .select()
        .single();

      if (error) throw error;
      
      await loadAppointments();
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  // Get available time slots
  const getAvailableTimeSlots = async (doctorId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_available_time_slots', {
          doctor_uuid: doctorId,
          appointment_date: date
        });

      if (error) throw error;
      return data?.map((slot: any) => slot.time_slot) || [];
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  };

  // Save doctor
  const saveDoctor = async (doctorData: any) => {
    try {
      if (doctorData.id) {
        // Update existing doctor
        const { error: doctorError } = await supabase
          .from('doctors')
          .update({
            full_name: doctorData.name,
            speciality: doctorData.speciality,
            crm: doctorData.crm,
            email: doctorData.email,
            phone: doctorData.phone,
            consultation_fee: doctorData.consultation_fee || 0
          })
          .eq('id', doctorData.id);

        if (doctorError) throw doctorError;

        // Update schedules
        await supabase
          .from('doctor_schedules')
          .delete()
          .eq('doctor_id', doctorData.id);

        if (doctorData.schedule?.length > 0) {
          const { error: scheduleError } = await supabase
            .from('doctor_schedules')
            .insert(
              doctorData.schedule.map((sched: any) => ({
                doctor_id: doctorData.id,
                day_of_week: sched.dayOfWeek,
                start_time: sched.startTime,
                end_time: sched.endTime
              }))
            );

          if (scheduleError) throw scheduleError;
        }
      } else {
        // Create new doctor - first create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: doctorData.email,
          password: 'temp123456', // Temporary password
          user_metadata: {
            full_name: doctorData.name,
            role: 'doctor'
          }
        });

        if (authError) throw authError;

        // Create doctor record
        const { data: newDoctor, error: doctorError } = await supabase
          .from('doctors')
          .insert({
            user_id: authData.user.id,
            full_name: doctorData.name,
            speciality: doctorData.speciality,
            crm: doctorData.crm,
            email: doctorData.email,
            phone: doctorData.phone,
            consultation_fee: doctorData.consultation_fee || 0
          })
          .select()
          .single();

        if (doctorError) throw doctorError;

        // Create schedules
        if (doctorData.schedule?.length > 0) {
          const { error: scheduleError } = await supabase
            .from('doctor_schedules')
            .insert(
              doctorData.schedule.map((sched: any) => ({
                doctor_id: newDoctor.id,
                day_of_week: sched.dayOfWeek,
                start_time: sched.startTime,
                end_time: sched.endTime
              }))
            );

          if (scheduleError) throw scheduleError;
        }
      }

      await loadDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      throw error;
    }
  };

  // Delete doctor
  const deleteDoctor = async (doctorId: string) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_active: false })
        .eq('id', doctorId);

      if (error) throw error;
      await loadDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([
          loadDoctors(),
          loadPatients(),
          loadAppointments(),
          loadDashboardStats()
        ]);
        setLoading(false);
      };

      loadData();
    }
  }, [user]);

  return {
    loading,
    doctors,
    patients,
    appointments,
    dashboardStats,
    createAppointment,
    getAvailableTimeSlots,
    saveDoctor,
    deleteDoctor,
    refreshData: () => {
      loadDoctors();
      loadPatients();
      loadAppointments();
      loadDashboardStats();
    }
  };
};
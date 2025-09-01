/*
  # Views e Índices para Performance

  1. Views
    - `appointment_details` - View completa de agendamentos com dados do paciente e médico
    - `doctor_availability` - View de disponibilidade dos médicos
    - `financial_summary` - View de resumo financeiro

  2. Indexes
    - Índices para otimizar consultas frequentes
*/

-- View for complete appointment details
CREATE OR REPLACE VIEW appointment_details AS
SELECT 
  a.id,
  a.appointment_date,
  a.appointment_time,
  a.appointment_type,
  a.status,
  a.notes,
  a.medical_notes,
  a.consultation_fee,
  a.payment_status,
  a.created_at,
  a.updated_at,
  p.full_name as patient_name,
  p.email as patient_email,
  p.phone as patient_phone,
  p.birth_date as patient_birth_date,
  d.full_name as doctor_name,
  d.speciality as doctor_speciality,
  d.crm as doctor_crm
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN doctors d ON a.doctor_id = d.id;

-- View for doctor availability
CREATE OR REPLACE VIEW doctor_availability AS
SELECT 
  d.id as doctor_id,
  d.full_name as doctor_name,
  d.speciality,
  ds.day_of_week,
  ds.start_time,
  ds.end_time,
  ds.is_active
FROM doctors d
JOIN doctor_schedules ds ON d.id = ds.doctor_id
WHERE d.is_active = true AND ds.is_active = true
ORDER BY d.full_name, ds.day_of_week, ds.start_time;

-- View for financial summary
CREATE OR REPLACE VIEW financial_summary AS
SELECT 
  DATE_TRUNC('month', transaction_date) as month,
  transaction_type,
  category,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount
FROM financial_transactions
WHERE payment_status = 'completed'
GROUP BY DATE_TRUNC('month', transaction_date), transaction_type, category
ORDER BY month DESC, transaction_type, category;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_day ON doctor_schedules(doctor_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_financial_date_type ON financial_transactions(transaction_date, transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_category_stock ON inventory_items(category, current_stock);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_doctors_speciality ON doctors(speciality);
CREATE INDEX IF NOT EXISTS idx_clinic_profiles_role ON clinic_profiles(role);
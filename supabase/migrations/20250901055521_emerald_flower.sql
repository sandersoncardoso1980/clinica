/*
  # Sistema de Agendamentos

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `doctor_id` (uuid, foreign key to doctors)
      - `appointment_date` (date, data da consulta)
      - `appointment_time` (time, horário da consulta)
      - `appointment_type` (text, tipo: consultation, exam, return)
      - `status` (text, status: scheduled, confirmed, completed, cancelled, no_show)
      - `notes` (text, observações do paciente)
      - `medical_notes` (text, anotações médicas)
      - `consultation_fee` (decimal, valor da consulta)
      - `payment_status` (text, status do pagamento)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `appointments` table
    - Add policies for patients, doctors, and staff
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  appointment_type text NOT NULL DEFAULT 'consultation' 
    CHECK (appointment_type IN ('consultation', 'exam', 'return')),
  status text NOT NULL DEFAULT 'scheduled' 
    CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes text DEFAULT '',
  medical_notes text DEFAULT '',
  consultation_fee decimal(10,2) DEFAULT 0.00,
  payment_status text DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, appointment_date, appointment_time)
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Patients can view their own appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

-- Patients can create appointments
CREATE POLICY "Patients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

-- Patients can cancel their own appointments
CREATE POLICY "Patients can cancel own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (status IN ('cancelled'));

-- Doctors can view their appointments
CREATE POLICY "Doctors can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors d 
      WHERE d.id = doctor_id AND d.user_id = auth.uid()
    )
  );

-- Doctors can update their appointments
CREATE POLICY "Doctors can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors d 
      WHERE d.id = doctor_id AND d.user_id = auth.uid()
    )
  );

-- Medical staff can view all appointments
CREATE POLICY "Medical staff can view all appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() 
      AND cp.role IN ('admin', 'receptionist')
    )
  );

-- Admins and receptionists can manage all appointments
CREATE POLICY "Staff can manage all appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() 
      AND cp.role IN ('admin', 'receptionist')
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
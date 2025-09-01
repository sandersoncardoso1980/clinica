/*
  # Prontuários Médicos

  1. New Tables
    - `medical_records`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, foreign key to appointments)
      - `patient_id` (uuid, foreign key to patients)
      - `doctor_id` (uuid, foreign key to doctors)
      - `diagnosis` (text, diagnóstico)
      - `treatment` (text, tratamento prescrito)
      - `prescription` (text, receita médica)
      - `exam_requests` (text, pedidos de exames)
      - `observations` (text, observações gerais)
      - `next_appointment` (date, próxima consulta sugerida)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `medical_records` table
    - Add policies for patients and doctors
*/

CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  diagnosis text DEFAULT '',
  treatment text DEFAULT '',
  prescription text DEFAULT '',
  exam_requests text DEFAULT '',
  observations text DEFAULT '',
  next_appointment date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(appointment_id)
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Patients can view their own medical records
CREATE POLICY "Patients can view own medical records"
  ON medical_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

-- Doctors can view and manage records for their patients
CREATE POLICY "Doctors can manage patient records"
  ON medical_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors d 
      WHERE d.id = doctor_id AND d.user_id = auth.uid()
    )
  );

-- Admins can view all medical records
CREATE POLICY "Admins can view all medical records"
  ON medical_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() AND cp.role = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
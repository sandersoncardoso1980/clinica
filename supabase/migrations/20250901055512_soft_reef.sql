/*
  # Tabela de Pacientes

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text, nome completo)
      - `email` (text, email)
      - `phone` (text, telefone)
      - `birth_date` (date, data de nascimento)
      - `cpf` (text, CPF único)
      - `address` (text, endereço completo)
      - `emergency_contact` (text, contato de emergência)
      - `medical_history` (text, histórico médico)
      - `allergies` (text, alergias)
      - `medications` (text, medicações em uso)
      - `insurance_plan` (text, plano de saúde)
      - `insurance_number` (text, número do plano)
      - `is_active` (boolean, status ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `patients` table
    - Add policies for patients and medical staff
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  birth_date date,
  cpf text UNIQUE,
  address text,
  emergency_contact text,
  medical_history text DEFAULT '',
  allergies text DEFAULT '',
  medications text DEFAULT '',
  insurance_plan text,
  insurance_number text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Patients can view and update their own profile
CREATE POLICY "Patients can manage own profile"
  ON patients
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Medical staff can view all patients
CREATE POLICY "Medical staff can view patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() 
      AND cp.role IN ('admin', 'doctor', 'receptionist')
    )
  );

-- Admins and receptionists can manage patients
CREATE POLICY "Admins and receptionists can manage patients"
  ON patients
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
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
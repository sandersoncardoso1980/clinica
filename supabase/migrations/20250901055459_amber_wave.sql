/*
  # Tabela de Médicos

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text, nome completo)
      - `speciality` (text, especialidade médica)
      - `crm` (text, número do CRM)
      - `email` (text, email)
      - `phone` (text, telefone)
      - `bio` (text, biografia/descrição)
      - `consultation_fee` (decimal, valor da consulta)
      - `is_active` (boolean, status ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `doctors` table
    - Add policies for viewing and managing doctors
*/

CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  speciality text NOT NULL,
  crm text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  bio text,
  consultation_fee decimal(10,2) DEFAULT 0.00,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Anyone can view active doctors
CREATE POLICY "Anyone can view active doctors"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Doctors can view and update their own profile
CREATE POLICY "Doctors can manage own profile"
  ON doctors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all doctors
CREATE POLICY "Admins can manage all doctors"
  ON doctors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() AND cp.role = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
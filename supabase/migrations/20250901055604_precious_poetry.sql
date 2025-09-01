/*
  # Configurações da Clínica

  1. New Tables
    - `clinic_settings`
      - `id` (uuid, primary key)
      - `clinic_name` (text, nome da clínica)
      - `clinic_logo` (text, URL do logo)
      - `address` (text, endereço)
      - `phone` (text, telefone)
      - `email` (text, email)
      - `cnpj` (text, CNPJ)
      - `opening_hours` (jsonb, horários de funcionamento)
      - `appointment_duration` (integer, duração padrão em minutos)
      - `advance_booking_days` (integer, dias de antecedência para agendamento)
      - `cancellation_hours` (integer, horas mínimas para cancelamento)
      - `email_notifications` (boolean, notificações por email)
      - `sms_notifications` (boolean, notificações por SMS)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `clinic_settings` table
    - Add policies for settings management
*/

CREATE TABLE IF NOT EXISTS clinic_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name text NOT NULL DEFAULT 'Clínica Médica',
  clinic_logo text,
  address text,
  phone text,
  email text,
  cnpj text,
  opening_hours jsonb DEFAULT '{"monday": {"start": "08:00", "end": "18:00"}, "tuesday": {"start": "08:00", "end": "18:00"}, "wednesday": {"start": "08:00", "end": "18:00"}, "thursday": {"start": "08:00", "end": "18:00"}, "friday": {"start": "08:00", "end": "18:00"}, "saturday": {"start": "08:00", "end": "12:00"}, "sunday": {"closed": true}}'::jsonb,
  appointment_duration integer DEFAULT 30,
  advance_booking_days integer DEFAULT 30,
  cancellation_hours integer DEFAULT 24,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO clinic_settings (clinic_name) VALUES ('ClinicaSaaS') 
ON CONFLICT DO NOTHING;

ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view clinic settings
CREATE POLICY "Anyone can view clinic settings"
  ON clinic_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can update clinic settings
CREATE POLICY "Admins can update clinic settings"
  ON clinic_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() AND cp.role = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_clinic_settings_updated_at
  BEFORE UPDATE ON clinic_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
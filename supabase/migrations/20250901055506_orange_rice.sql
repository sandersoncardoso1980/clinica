/*
  # Horários dos Médicos

  1. New Tables
    - `doctor_schedules`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `day_of_week` (integer, 0-6 domingo a sábado)
      - `start_time` (time, horário de início)
      - `end_time` (time, horário de fim)
      - `is_active` (boolean, horário ativo)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `doctor_schedules` table
    - Add policies for viewing and managing schedules
*/

CREATE TABLE IF NOT EXISTS doctor_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;

-- Anyone can view active schedules
CREATE POLICY "Anyone can view active schedules"
  ON doctor_schedules
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Doctors can manage their own schedules
CREATE POLICY "Doctors can manage own schedules"
  ON doctor_schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors d 
      WHERE d.id = doctor_id AND d.user_id = auth.uid()
    )
  );

-- Admins can manage all schedules
CREATE POLICY "Admins can manage all schedules"
  ON doctor_schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() AND cp.role = 'admin'
    )
  );
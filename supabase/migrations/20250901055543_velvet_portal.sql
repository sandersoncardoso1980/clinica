/*
  # Transações Financeiras

  1. New Tables
    - `financial_transactions`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, foreign key to appointments)
      - `patient_id` (uuid, foreign key to patients)
      - `transaction_type` (text, tipo: income, expense)
      - `category` (text, categoria da transação)
      - `description` (text, descrição)
      - `amount` (decimal, valor)
      - `payment_method` (text, método de pagamento)
      - `payment_status` (text, status do pagamento)
      - `transaction_date` (date, data da transação)
      - `created_by` (uuid, usuário que criou)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `financial_transactions` table
    - Add policies for financial management
*/

CREATE TABLE IF NOT EXISTS financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  category text NOT NULL,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'pix', 'transfer', 'check')),
  payment_status text DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'cancelled')),
  transaction_date date DEFAULT CURRENT_DATE,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Patients can view their own financial transactions
CREATE POLICY "Patients can view own transactions"
  ON financial_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );

-- Financial staff can manage all transactions
CREATE POLICY "Financial staff can manage transactions"
  ON financial_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() 
      AND cp.role IN ('admin', 'receptionist')
    )
  );
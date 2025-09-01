/*
  # Sistema de Estoque

  1. New Tables
    - `inventory_items`
      - `id` (uuid, primary key)
      - `name` (text, nome do item)
      - `category` (text, categoria: medication, material, equipment)
      - `description` (text, descrição)
      - `current_stock` (integer, estoque atual)
      - `min_stock` (integer, estoque mínimo)
      - `unit_price` (decimal, preço unitário)
      - `supplier` (text, fornecedor)
      - `expiry_date` (date, data de validade)
      - `batch_number` (text, número do lote)
      - `is_active` (boolean, item ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `inventory_items` table
    - Add policies for inventory management
*/

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('medication', 'material', 'equipment')),
  description text DEFAULT '',
  current_stock integer DEFAULT 0,
  min_stock integer DEFAULT 0,
  unit_price decimal(10,2) DEFAULT 0.00,
  supplier text,
  expiry_date date,
  batch_number text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Medical staff can view inventory
CREATE POLICY "Medical staff can view inventory"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() 
      AND cp.role IN ('admin', 'doctor', 'receptionist')
    )
  );

-- Admins can manage inventory
CREATE POLICY "Admins can manage inventory"
  ON inventory_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinic_profiles cp 
      WHERE cp.user_id = auth.uid() AND cp.role = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
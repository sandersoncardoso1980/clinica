/*
  # Funções para Sistema de Agendamentos

  1. Functions
    - `get_available_time_slots` - Retorna horários disponíveis para um médico em uma data
    - `create_appointment_notification` - Cria notificações automáticas para agendamentos
    - `update_appointment_status` - Atualiza status do agendamento com validações

  2. Triggers
    - Trigger para criar notificações automáticas em novos agendamentos
    - Trigger para atualizar status de pagamento
*/

-- Function to get available time slots for a doctor on a specific date
CREATE OR REPLACE FUNCTION get_available_time_slots(
  doctor_uuid uuid,
  appointment_date date
)
RETURNS TABLE(time_slot time) AS $$
DECLARE
  schedule_record RECORD;
  slot_time time;
  slot_duration interval := '30 minutes';
BEGIN
  -- Get doctor's schedule for the day of week
  SELECT ds.start_time, ds.end_time INTO schedule_record
  FROM doctor_schedules ds
  WHERE ds.doctor_id = doctor_uuid 
    AND ds.day_of_week = EXTRACT(dow FROM appointment_date)
    AND ds.is_active = true;

  -- If no schedule found, return empty
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Generate time slots
  slot_time := schedule_record.start_time;
  
  WHILE slot_time < schedule_record.end_time LOOP
    -- Check if slot is available (not booked)
    IF NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.doctor_id = doctor_uuid
        AND a.appointment_date = appointment_date
        AND a.appointment_time = slot_time
        AND a.status NOT IN ('cancelled')
    ) THEN
      time_slot := slot_time;
      RETURN NEXT;
    END IF;
    
    slot_time := slot_time + slot_duration;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create appointment notifications
CREATE OR REPLACE FUNCTION create_appointment_notification()
RETURNS trigger AS $$
BEGIN
  -- Notification for patient
  INSERT INTO notifications (user_id, title, message, type, appointment_id)
  SELECT 
    p.user_id,
    'Agendamento Confirmado',
    'Sua consulta foi agendada para ' || TO_CHAR(NEW.appointment_date, 'DD/MM/YYYY') || ' às ' || TO_CHAR(NEW.appointment_time, 'HH24:MI'),
    'appointment',
    NEW.id
  FROM patients p
  WHERE p.id = NEW.patient_id;

  -- Notification for doctor
  INSERT INTO notifications (user_id, title, message, type, appointment_id)
  SELECT 
    d.user_id,
    'Nova Consulta Agendada',
    'Consulta agendada para ' || TO_CHAR(NEW.appointment_date, 'DD/MM/YYYY') || ' às ' || TO_CHAR(NEW.appointment_time, 'HH24:MI'),
    'appointment',
    NEW.id
  FROM doctors d
  WHERE d.id = NEW.doctor_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for appointment notifications
CREATE TRIGGER create_appointment_notifications
  AFTER INSERT ON appointments
  FOR EACH ROW EXECUTE FUNCTION create_appointment_notification();

-- Function to update appointment status with business rules
CREATE OR REPLACE FUNCTION update_appointment_status()
RETURNS trigger AS $$
BEGIN
  -- If appointment is being cancelled, create notification
  IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
    -- Notify patient
    INSERT INTO notifications (user_id, title, message, type, appointment_id)
    SELECT 
      p.user_id,
      'Consulta Cancelada',
      'Sua consulta do dia ' || TO_CHAR(NEW.appointment_date, 'DD/MM/YYYY') || ' foi cancelada',
      'appointment',
      NEW.id
    FROM patients p
    WHERE p.id = NEW.patient_id;

    -- Notify doctor
    INSERT INTO notifications (user_id, title, message, type, appointment_id)
    SELECT 
      d.user_id,
      'Consulta Cancelada',
      'Consulta do dia ' || TO_CHAR(NEW.appointment_date, 'DD/MM/YYYY') || ' foi cancelada',
      'appointment',
      NEW.id
    FROM doctors d
    WHERE d.id = NEW.doctor_id;
  END IF;

  -- If appointment is completed, update payment status
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    -- Create financial transaction if not exists
    INSERT INTO financial_transactions (
      appointment_id, patient_id, transaction_type, category, 
      description, amount, payment_method, created_by
    )
    SELECT 
      NEW.id, NEW.patient_id, 'income', 'Consultas',
      'Consulta - ' || p.full_name,
      COALESCE(NEW.consultation_fee, d.consultation_fee, 0),
      'cash',
      auth.uid()
    FROM patients p, doctors d
    WHERE p.id = NEW.patient_id AND d.id = NEW.doctor_id
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for appointment status updates
CREATE TRIGGER update_appointment_status_trigger
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_appointment_status();
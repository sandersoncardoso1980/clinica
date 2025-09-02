/*
  # Inserir Contas Fictícias de Demonstração

  1. Contas de Usuário
    - Administrador: admin@clinica.com / admin123
    - Médico: dr.silva@clinica.com / medico123  
    - Recepcionista: recepcao@clinica.com / recepcao123
    - Paciente: paciente@email.com / paciente123

  2. Dados Relacionados
    - Perfis completos para cada tipo de usuário
    - Horários de trabalho para médicos
    - Dados de paciente completos
    - Configurações iniciais da clínica

  3. Segurança
    - Senhas temporárias que devem ser alteradas no primeiro login
    - Perfis com permissões adequadas
    - Dados fictícios mas realistas
*/

-- Inserir usuários de demonstração no auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'admin@clinica.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dr. Carlos Administrador", "role": "admin"}',
    false,
    'authenticated'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'dr.silva@clinica.com',
    crypt('medico123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dr. João Silva Santos", "role": "doctor"}',
    false,
    'authenticated'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'recepcao@clinica.com',
    crypt('recepcao123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Maria Recepção Silva", "role": "receptionist"}',
    false,
    'authenticated'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'paciente@email.com',
    crypt('paciente123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ana Paciente Costa", "role": "patient"}',
    false,
    'authenticated'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'dra.patricia@clinica.com',
    crypt('medico123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dra. Patricia Mendes", "role": "doctor"}',
    false,
    'authenticated'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '00000000-0000-0000-0000-000000000000',
    'dr.carlos@clinica.com',
    crypt('medico123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dr. Carlos Rodrigues", "role": "doctor"}',
    false,
    'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- Inserir perfis da clínica
INSERT INTO clinic_profiles (
  user_id,
  full_name,
  email,
  phone,
  role,
  is_active
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'Dr. Carlos Administrador',
    'admin@clinica.com',
    '(11) 99999-0001',
    'admin',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Dr. João Silva Santos',
    'dr.silva@clinica.com',
    '(11) 99999-0002',
    'doctor',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Maria Recepção Silva',
    'recepcao@clinica.com',
    '(11) 99999-0003',
    'receptionist',
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Ana Paciente Costa',
    'paciente@email.com',
    '(11) 99999-0004',
    'patient',
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Dra. Patricia Mendes',
    'dra.patricia@clinica.com',
    '(11) 99999-0005',
    'doctor',
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Dr. Carlos Rodrigues',
    'dr.carlos@clinica.com',
    '(11) 99999-0006',
    'doctor',
    true
  )
ON CONFLICT (user_id) DO NOTHING;

-- Inserir médicos
INSERT INTO doctors (
  user_id,
  full_name,
  speciality,
  crm,
  email,
  phone,
  bio,
  consultation_fee,
  is_active
) VALUES 
  (
    '22222222-2222-2222-2222-222222222222',
    'Dr. João Silva Santos',
    'Cardiologia',
    'CRM/SP 123456',
    'dr.silva@clinica.com',
    '(11) 99999-0002',
    'Especialista em cardiologia com mais de 15 anos de experiência. Formado pela USP, com especialização em cardiologia intervencionista.',
    250.00,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Dra. Patricia Mendes',
    'Endocrinologia',
    'CRM/SP 789012',
    'dra.patricia@clinica.com',
    '(11) 99999-0005',
    'Endocrinologista especializada em diabetes e distúrbios hormonais. Doutora pela UNIFESP com foco em medicina preventiva.',
    280.00,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Dr. Carlos Rodrigues',
    'Ortopedia',
    'CRM/SP 345678',
    'dr.carlos@clinica.com',
    '(11) 99999-0006',
    'Ortopedista especializado em cirurgia de joelho e quadril. Membro da Sociedade Brasileira de Ortopedia e Traumatologia.',
    300.00,
    true
  )
ON CONFLICT (user_id) DO NOTHING;

-- Inserir horários dos médicos
INSERT INTO doctor_schedules (
  doctor_id,
  day_of_week,
  start_time,
  end_time,
  is_active
) VALUES 
  -- Dr. João Silva (Cardiologia) - Segunda, Quarta e Sexta
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 123456'),
    1, -- Segunda-feira
    '08:00',
    '12:00',
    true
  ),
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 123456'),
    1, -- Segunda-feira
    '14:00',
    '18:00',
    true
  ),
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 123456'),
    3, -- Quarta-feira
    '08:00',
    '12:00',
    true
  ),
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 123456'),
    5, -- Sexta-feira
    '08:00',
    '12:00',
    true
  ),
  -- Dra. Patricia (Endocrinologia) - Terça, Quinta e Sábado
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 789012'),
    2, -- Terça-feira
    '09:00',
    '13:00',
    true
  ),
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 789012'),
    4, -- Quinta-feira
    '14:00',
    '18:00',
    true
  ),
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 789012'),
    6, -- Sábado
    '08:00',
    '12:00',
    true
  ),
  -- Dr. Carlos (Ortopedia) - Segunda, Quarta e Sexta
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 345678'),
    1, -- Segunda-feira
    '07:00',
    '11:00',
    true
  ),
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 345678'),
    3, -- Quarta-feira
    '13:00',
    '17:00',
    true
  ),
  (
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 345678'),
    5, -- Sexta-feira
    '07:00',
    '11:00',
    true
  )
ON CONFLICT (doctor_id, day_of_week, start_time) DO NOTHING;

-- Inserir paciente de demonstração
INSERT INTO patients (
  user_id,
  full_name,
  email,
  phone,
  birth_date,
  cpf,
  address,
  emergency_contact,
  medical_history,
  allergies,
  medications,
  insurance_plan,
  insurance_number,
  is_active
) VALUES 
  (
    '44444444-4444-4444-4444-444444444444',
    'Ana Paciente Costa',
    'paciente@email.com',
    '(11) 99999-0004',
    '1985-03-15',
    '123.456.789-01',
    'Rua das Flores, 123, Jardim Paulista, São Paulo - SP, 01310-100',
    '(11) 98888-0004 - João Costa (marido)',
    'Hipertensão arterial controlada, histórico familiar de diabetes',
    'Penicilina, frutos do mar',
    'Losartana 50mg (1x ao dia), Sinvastatina 20mg (1x ao dia)',
    'Unimed',
    '123456789012345',
    true
  )
ON CONFLICT (user_id) DO NOTHING;

-- Inserir configurações iniciais da clínica
INSERT INTO clinic_settings (
  clinic_name,
  address,
  phone,
  email,
  cnpj,
  opening_hours,
  appointment_duration,
  advance_booking_days,
  cancellation_hours,
  email_notifications,
  sms_notifications
) VALUES 
  (
    'Clínica Médica São Paulo',
    'Av. Paulista, 1000, Bela Vista, São Paulo - SP, 01310-100',
    '(11) 3333-4444',
    'contato@clinicasp.com.br',
    '12.345.678/0001-90',
    '{
      "monday": {"start": "08:00", "end": "18:00"},
      "tuesday": {"start": "08:00", "end": "18:00"},
      "wednesday": {"start": "08:00", "end": "18:00"},
      "thursday": {"start": "08:00", "end": "18:00"},
      "friday": {"start": "08:00", "end": "18:00"},
      "saturday": {"start": "08:00", "end": "12:00"},
      "sunday": {"closed": true}
    }',
    30,
    30,
    24,
    true,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns itens de estoque de exemplo
INSERT INTO inventory_items (
  name,
  category,
  description,
  current_stock,
  min_stock,
  unit_price,
  supplier,
  expiry_date,
  batch_number,
  is_active
) VALUES 
  (
    'Paracetamol 500mg',
    'medication',
    'Analgésico e antitérmico - caixa com 20 comprimidos',
    150,
    50,
    8.50,
    'Farmácia Distribuidora ABC Ltda',
    '2025-12-31',
    'PAR2024001',
    true
  ),
  (
    'Seringas Descartáveis 10ml',
    'material',
    'Seringas estéreis descartáveis com agulha 25x7',
    25,
    100,
    1.20,
    'Suprimentos Médicos São Paulo',
    null,
    'SER2024002',
    true
  ),
  (
    'Luvas de Procedimento',
    'material',
    'Luvas descartáveis de látex - caixa com 100 unidades',
    500,
    200,
    15.00,
    'Equipamentos Hospitalares Ltda',
    '2026-06-30',
    'LUV2024003',
    true
  ),
  (
    'Estetoscópio Adulto',
    'equipment',
    'Estetoscópio clínico duplo para adultos - marca Premium',
    5,
    2,
    180.00,
    'Instrumentos Médicos Brasil',
    null,
    'EST2024004',
    true
  ),
  (
    'Termômetro Digital',
    'equipment',
    'Termômetro digital infravermelho sem contato',
    8,
    3,
    95.00,
    'TechMed Equipamentos',
    null,
    'TER2024005',
    true
  )
ON CONFLICT (name) DO NOTHING;

-- Inserir algumas transações financeiras de exemplo
INSERT INTO financial_transactions (
  patient_id,
  transaction_type,
  category,
  description,
  amount,
  payment_method,
  payment_status,
  transaction_date,
  created_by
) VALUES 
  (
    (SELECT id FROM patients WHERE email = 'paciente@email.com'),
    'income',
    'Consultas',
    'Consulta Cardiológica - Ana Paciente Costa',
    250.00,
    'card',
    'completed',
    CURRENT_DATE - INTERVAL '1 day',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    null,
    'expense',
    'Materiais',
    'Compra de seringas e luvas descartáveis',
    450.00,
    'transfer',
    'completed',
    CURRENT_DATE - INTERVAL '2 days',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    null,
    'expense',
    'Equipamentos',
    'Manutenção preventiva equipamentos',
    320.00,
    'pix',
    'completed',
    CURRENT_DATE - INTERVAL '3 days',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    (SELECT id FROM patients WHERE email = 'paciente@email.com'),
    'income',
    'Consultas',
    'Consulta Endocrinológica - Ana Paciente Costa',
    280.00,
    'pix',
    'completed',
    CURRENT_DATE - INTERVAL '5 days',
    '33333333-3333-3333-3333-333333333333'
  )
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns agendamentos de exemplo
INSERT INTO appointments (
  patient_id,
  doctor_id,
  appointment_date,
  appointment_time,
  appointment_type,
  status,
  notes,
  consultation_fee,
  payment_status
) VALUES 
  (
    (SELECT id FROM patients WHERE email = 'paciente@email.com'),
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 123456'),
    CURRENT_DATE + INTERVAL '1 day',
    '09:00',
    'consultation',
    'scheduled',
    'Consulta de rotina para acompanhamento da pressão arterial',
    250.00,
    'pending'
  ),
  (
    (SELECT id FROM patients WHERE email = 'paciente@email.com'),
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 789012'),
    CURRENT_DATE + INTERVAL '3 days',
    '10:30',
    'consultation',
    'confirmed',
    'Avaliação dos níveis de glicose e ajuste da medicação',
    280.00,
    'pending'
  ),
  (
    (SELECT id FROM patients WHERE email = 'paciente@email.com'),
    (SELECT id FROM doctors WHERE crm = 'CRM/SP 123456'),
    CURRENT_DATE - INTERVAL '7 days',
    '14:00',
    'consultation',
    'completed',
    'Consulta de retorno - resultados dos exames',
    250.00,
    'paid'
  )
ON CONFLICT (doctor_id, appointment_date, appointment_time) DO NOTHING;
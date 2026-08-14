-- ============================================
-- SEDA - Supabase SQL Setup
-- Sistema de Equilíbrio de Diabetes e Artérias
-- ============================================
-- Execute este script no seu Supabase: 
-- 1. Abra SQL Editor
-- 2. Cole este código
-- 3. Clique em "Run"
-- ============================================

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cns TEXT NOT NULL UNIQUE, -- Cartão Nacional de Saúde
  cpf TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  age INTEGER NOT NULL,
  ubs_reference TEXT NOT NULL, -- Ex: UBS Jardim Primavera
  esf_team TEXT NOT NULL, -- Ex: Equipe 04 - Florescer
  micro_area TEXT NOT NULL, -- Ex: Microárea 03
  acs_name TEXT NOT NULL, -- Nome do Agente Comunitário de Saúde
  caregiver_name TEXT,
  caregiver_phone TEXT,
  address TEXT,
  conditions TEXT[] DEFAULT '{}', -- Array de condições de saúde
  medications TEXT[] DEFAULT '{}', -- Array de medicamentos
  role TEXT NOT NULL CHECK (role IN ('PACIENTE', 'CUIDADOR', 'ACS', 'MEDICO_UBS')),
  autonomy_level TEXT NOT NULL CHECK (autonomy_level IN ('AUTONOMO', 'ASSISTIDO', 'COMPARTILHADO')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_age CHECK (age >= 0 AND age <= 150)
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cns ON users(cns);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_ubs ON users(ubs_reference);
CREATE INDEX IF NOT EXISTS idx_users_esf_team ON users(esf_team);

-- Criar tabela de medições (pressão arterial, glicose, etc)
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  measurement_type TEXT NOT NULL CHECK (measurement_type IN ('BP', 'GLUCOSE', 'WEIGHT', 'HEART_RATE')),
  -- Blood Pressure: systolic_value / diastolic_value
  -- Glucose: value (mg/dL)
  -- Weight: value (kg)
  -- Heart Rate: value (bpm)
  systolic_value INTEGER,
  diastolic_value INTEGER,
  value DECIMAL(10, 2),
  unit TEXT,
  measurement_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_systolic CHECK (systolic_value IS NULL OR (systolic_value >= 50 AND systolic_value <= 300)),
  CONSTRAINT valid_diastolic CHECK (diastolic_value IS NULL OR (diastolic_value >= 30 AND diastolic_value <= 200))
);

CREATE INDEX IF NOT EXISTS idx_measurements_user_id ON measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_measurements_type ON measurements(measurement_type);
CREATE INDEX IF NOT EXISTS idx_measurements_date ON measurements(measurement_date DESC);

-- Criar tabela de "Diário dos Sentidos" (Emotional/Clinical State)
CREATE TABLE IF NOT EXISTS daily_diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  
  -- Emotional State
  emotional_state TEXT,
  emotional_intensity INTEGER CHECK (emotional_intensity >= 1 AND emotional_intensity <= 5),
  
  -- Audio transcript and analysis
  audio_transcript TEXT,
  clinical_notes TEXT,
  
  -- Symptoms reported
  symptoms TEXT[],
  symptom_severity INTEGER CHECK (symptom_severity IS NULL OR (symptom_severity >= 1 AND symptom_severity <= 5)),
  
  -- Medications adherence
  medications_taken BOOLEAN,
  missed_medications TEXT[],
  
  -- Food intake
  food_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, entry_date)
);

CREATE INDEX IF NOT EXISTS idx_diary_user_id ON daily_diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_date ON daily_diary_entries(entry_date DESC);

-- Criar tabela de consultas/appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('PREVENTIVA', 'SEGUIMENTO', 'EMERGENCIA', 'TELEMEDICINA')),
  status TEXT DEFAULT 'AGENDADA' CHECK (status IN ('AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA')),
  
  location TEXT,
  notes TEXT,
  findings TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Criar tabela de alertas clínicos
CREATE TABLE IF NOT EXISTS clinical_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  alert_type TEXT NOT NULL CHECK (alert_type IN ('HIPERTENSAO', 'HIPERGLICEMIA', 'HIPERGLICEMIA_SEVERA', 'HIPOGLICEMIA', 'MEDICAMENTO_ATRASO', 'MEDIDA_FALTANTE')),
  severity TEXT NOT NULL CHECK (severity IN ('BAIXO', 'MEDIO', 'ALTO', 'CRITICO')),
  message TEXT NOT NULL,
  
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_ack CHECK (acknowledged_at IS NULL OR acknowledged_at >= created_at)
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON clinical_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON clinical_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON clinical_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON clinical_alerts(created_at DESC);

-- Criar tabela de logging de ações
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  changes JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- Criar política de segurança RLS (Row Level Security)
-- Usuários só podem ver seus próprios dados
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para tabela measurements
CREATE POLICY "Users can view their own measurements" ON measurements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create measurements" ON measurements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own measurements" ON measurements
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para tabela daily_diary_entries
CREATE POLICY "Users can view their own diary" ON daily_diary_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create diary entries" ON daily_diary_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary" ON daily_diary_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para tabela appointments
CREATE POLICY "Users can view their own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = professional_id);

CREATE POLICY "Users can create appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = professional_id);

-- Políticas para tabela clinical_alerts
CREATE POLICY "Users can view their own alerts" ON clinical_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update alert status" ON clinical_alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para tabela audit_logs
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- Fim do setup do Supabase
-- ============================================

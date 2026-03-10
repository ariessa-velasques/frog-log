-- ==========================================
-- FrogLog - Database Schema
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Tabela de Desafios (Metas)
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  total_days INTEGER NOT NULL DEFAULT 31,
  reminders JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Regras (Fazer / Evitar)
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('do', 'dont')),
  description TEXT NOT NULL
);

-- 3. Tabela do Tabuleiro (Dias Individuais)
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  log_date DATE NOT NULL,
  status TEXT CHECK (status IN ('success', 'fail', 'pending')) DEFAULT 'pending',
  notes TEXT
);

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (Row Level Security)
-- ==========================================
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para challenges
CREATE POLICY "Usuários gerenciam seus próprios desafios"
ON challenges FOR ALL USING (auth.uid() = user_id);

-- Políticas para rules (baseado no dono do desafio)
CREATE POLICY "Usuários gerenciam regras de seus desafios"
ON rules FOR ALL USING (
  EXISTS (SELECT 1 FROM challenges WHERE id = rules.challenge_id AND user_id = auth.uid())
);

-- Políticas para daily_logs (baseado no dono do desafio)
CREATE POLICY "Usuários gerenciam dias de seus desafios"
ON daily_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM challenges WHERE id = daily_logs.challenge_id AND user_id = auth.uid())
);

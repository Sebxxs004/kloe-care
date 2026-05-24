-- ================================================================
-- MIGRACIÓN 2 (REVISADA): Crear tablas de registros + RLS
-- Ejecutar en Supabase → SQL Editor
-- ================================================================

-- 1. CREAR tablas si no existen
CREATE TABLE IF NOT EXISTS healths (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id        UUID        REFERENCES pets(id) ON DELETE CASCADE,
  temperature   NUMERIC(4,1),
  symptoms      TEXT[],
  observations  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vaccines (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id        UUID        REFERENCES pets(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  laboratory    VARCHAR(255),
  applied_at    DATE        NOT NULL,
  next_dose_at  DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medications (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id        UUID        REFERENCES pets(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  dosage        VARCHAR(100),
  frequency     VARCHAR(100),
  start_date    DATE,
  end_date      DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedings (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id        UUID        REFERENCES pets(id) ON DELETE CASCADE,
  food_type     TEXT[],
  food_brand    VARCHAR(255),
  amount        NUMERIC(8,2),
  schedule      VARCHAR(255),
  frequency     VARCHAR(100),
  observations  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_healths_pet_id     ON healths(pet_id);
CREATE INDEX IF NOT EXISTS idx_vaccines_pet_id    ON vaccines(pet_id);
CREATE INDEX IF NOT EXISTS idx_medications_pet_id ON medications(pet_id);
CREATE INDEX IF NOT EXISTS idx_feedings_pet_id    ON feedings(pet_id);

-- 3. Habilitar RLS
ALTER TABLE healths     ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines    ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedings    ENABLE ROW LEVEL SECURITY;

-- 4. Limpiar políticas anteriores si existían
DROP POLICY IF EXISTS "healths_select_own"     ON healths;
DROP POLICY IF EXISTS "healths_insert_own"     ON healths;
DROP POLICY IF EXISTS "healths_update_own"     ON healths;
DROP POLICY IF EXISTS "healths_delete_own"     ON healths;
DROP POLICY IF EXISTS "vaccines_select_own"    ON vaccines;
DROP POLICY IF EXISTS "vaccines_insert_own"    ON vaccines;
DROP POLICY IF EXISTS "vaccines_delete_own"    ON vaccines;
DROP POLICY IF EXISTS "medications_select_own" ON medications;
DROP POLICY IF EXISTS "medications_insert_own" ON medications;
DROP POLICY IF EXISTS "medications_delete_own" ON medications;
DROP POLICY IF EXISTS "feedings_select_own"    ON feedings;
DROP POLICY IF EXISTS "feedings_insert_own"    ON feedings;
DROP POLICY IF EXISTS "feedings_delete_own"    ON feedings;

-- 5. Políticas HEALTHS
CREATE POLICY "healths_select_own" ON healths FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));
CREATE POLICY "healths_insert_own" ON healths FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));
CREATE POLICY "healths_delete_own" ON healths FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));

-- 6. Políticas VACCINES
CREATE POLICY "vaccines_select_own" ON vaccines FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));
CREATE POLICY "vaccines_insert_own" ON vaccines FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));
CREATE POLICY "vaccines_delete_own" ON vaccines FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));

-- 7. Políticas MEDICATIONS
CREATE POLICY "medications_select_own" ON medications FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));
CREATE POLICY "medications_insert_own" ON medications FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));
CREATE POLICY "medications_delete_own" ON medications FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));

-- 8. Políticas FEEDINGS
CREATE POLICY "feedings_select_own" ON feedings FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));
CREATE POLICY "feedings_insert_own" ON feedings FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));
CREATE POLICY "feedings_delete_own" ON feedings FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));

-- ================================================================
-- MIGRACIÓN 2: Vincular salud, vacunas, medicamentos y comida
-- a mascotas específicas + RLS
-- Ejecutar en Supabase SQL Editor
-- ================================================================

-- 1. Agregar pet_id a todas las tablas de registros
ALTER TABLE healths ADD COLUMN IF NOT EXISTS pet_id UUID REFERENCES pets(id) ON DELETE CASCADE;
ALTER TABLE healths ADD COLUMN IF NOT EXISTS general_state VARCHAR(50);

ALTER TABLE vaccines ADD COLUMN IF NOT EXISTS pet_id UUID REFERENCES pets(id) ON DELETE CASCADE;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS pet_id UUID REFERENCES pets(id) ON DELETE CASCADE;
ALTER TABLE feedings ADD COLUMN IF NOT EXISTS pet_id UUID REFERENCES pets(id) ON DELETE CASCADE;

-- 2. Índices para mejorar las consultas
CREATE INDEX IF NOT EXISTS idx_healths_pet_id     ON healths(pet_id);
CREATE INDEX IF NOT EXISTS idx_vaccines_pet_id    ON vaccines(pet_id);
CREATE INDEX IF NOT EXISTS idx_medications_pet_id ON medications(pet_id);
CREATE INDEX IF NOT EXISTS idx_feedings_pet_id    ON feedings(pet_id);

-- 3. Habilitar RLS en todas las tablas de registros
ALTER TABLE healths     ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines    ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedings    ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para HEALTHS
DROP POLICY IF EXISTS "healths_select_own" ON healths;
DROP POLICY IF EXISTS "healths_insert_own" ON healths;
DROP POLICY IF EXISTS "healths_update_own" ON healths;
DROP POLICY IF EXISTS "healths_delete_own" ON healths;

CREATE POLICY "healths_select_own" ON healths FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "healths_insert_own" ON healths FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "healths_update_own" ON healths FOR UPDATE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "healths_delete_own" ON healths FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);

-- 5. Políticas para VACCINES
DROP POLICY IF EXISTS "vaccines_select_own" ON vaccines;
DROP POLICY IF EXISTS "vaccines_insert_own" ON vaccines;
DROP POLICY IF EXISTS "vaccines_delete_own" ON vaccines;

CREATE POLICY "vaccines_select_own" ON vaccines FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "vaccines_insert_own" ON vaccines FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "vaccines_delete_own" ON vaccines FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);

-- 6. Políticas para MEDICATIONS
DROP POLICY IF EXISTS "medications_select_own" ON medications;
DROP POLICY IF EXISTS "medications_insert_own" ON medications;
DROP POLICY IF EXISTS "medications_delete_own" ON medications;

CREATE POLICY "medications_select_own" ON medications FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "medications_insert_own" ON medications FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "medications_delete_own" ON medications FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);

-- 7. Políticas para FEEDINGS
DROP POLICY IF EXISTS "feedings_select_own" ON feedings;
DROP POLICY IF EXISTS "feedings_insert_own" ON feedings;
DROP POLICY IF EXISTS "feedings_delete_own" ON feedings;

CREATE POLICY "feedings_select_own" ON feedings FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "feedings_insert_own" ON feedings FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);
CREATE POLICY "feedings_delete_own" ON feedings FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
);

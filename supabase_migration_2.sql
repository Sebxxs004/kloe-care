-- ================================================================
-- MIGRACIÓN 2 — RLS sobre las tablas EXISTENTES del esquema real
-- Tablas: wellness_histories, health_records, feeding_records,
--         activities, vaccines, medications
-- ================================================================
-- RELACIONES:
--   pets → wellness_histories (pet_id)
--   wellness_histories → health_records (wellness_history_id)
--   wellness_histories → feeding_records (wellness_history_id)
--   wellness_histories → activities (wellness_history_id)
--   health_records → vaccines (health_record_id)
--   health_records → medications (health_record_id)
-- ================================================================

-- 1. Habilitar RLS en todas las tablas
ALTER TABLE wellness_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records     ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_records    ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines           ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications        ENABLE ROW LEVEL SECURITY;

-- 2. Limpiar políticas anteriores si existen
DROP POLICY IF EXISTS "wh_select"  ON wellness_histories;
DROP POLICY IF EXISTS "wh_insert"  ON wellness_histories;
DROP POLICY IF EXISTS "wh_delete"  ON wellness_histories;
DROP POLICY IF EXISTS "hr_select"  ON health_records;
DROP POLICY IF EXISTS "hr_insert"  ON health_records;
DROP POLICY IF EXISTS "hr_delete"  ON health_records;
DROP POLICY IF EXISTS "fr_select"  ON feeding_records;
DROP POLICY IF EXISTS "fr_insert"  ON feeding_records;
DROP POLICY IF EXISTS "fr_delete"  ON feeding_records;
DROP POLICY IF EXISTS "act_select" ON activities;
DROP POLICY IF EXISTS "act_insert" ON activities;
DROP POLICY IF EXISTS "act_delete" ON activities;
DROP POLICY IF EXISTS "vac_select" ON vaccines;
DROP POLICY IF EXISTS "vac_insert" ON vaccines;
DROP POLICY IF EXISTS "vac_delete" ON vaccines;
DROP POLICY IF EXISTS "med_select" ON medications;
DROP POLICY IF EXISTS "med_insert" ON medications;
DROP POLICY IF EXISTS "med_delete" ON medications;

-- 3. Políticas WELLNESS_HISTORIES
--    Solo ve/crea wellness histories de sus propias mascotas
CREATE POLICY "wh_select" ON wellness_histories FOR SELECT USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));

CREATE POLICY "wh_insert" ON wellness_histories FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));

CREATE POLICY "wh_delete" ON wellness_histories FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid()));

-- 4. Políticas HEALTH_RECORDS
--    Solo ve/crea registros de salud de sus mascotas
CREATE POLICY "hr_select" ON health_records FOR SELECT USING (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

CREATE POLICY "hr_insert" ON health_records FOR INSERT WITH CHECK (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

CREATE POLICY "hr_delete" ON health_records FOR DELETE USING (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

-- 5. Políticas FEEDING_RECORDS
CREATE POLICY "fr_select" ON feeding_records FOR SELECT USING (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

CREATE POLICY "fr_insert" ON feeding_records FOR INSERT WITH CHECK (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

CREATE POLICY "fr_delete" ON feeding_records FOR DELETE USING (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

-- 6. Políticas ACTIVITIES
CREATE POLICY "act_select" ON activities FOR SELECT USING (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

CREATE POLICY "act_insert" ON activities FOR INSERT WITH CHECK (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

CREATE POLICY "act_delete" ON activities FOR DELETE USING (
  wellness_history_id IN (
    SELECT id FROM wellness_histories WHERE pet_id IN (
      SELECT id FROM pets WHERE auth_owner_id = auth.uid())));

-- 7. Políticas VACCINES (enlazadas via health_record)
CREATE POLICY "vac_select" ON vaccines FOR SELECT USING (
  health_record_id IN (
    SELECT id FROM health_records WHERE wellness_history_id IN (
      SELECT id FROM wellness_histories WHERE pet_id IN (
        SELECT id FROM pets WHERE auth_owner_id = auth.uid()))));

CREATE POLICY "vac_insert" ON vaccines FOR INSERT WITH CHECK (
  health_record_id IN (
    SELECT id FROM health_records WHERE wellness_history_id IN (
      SELECT id FROM wellness_histories WHERE pet_id IN (
        SELECT id FROM pets WHERE auth_owner_id = auth.uid()))));

CREATE POLICY "vac_delete" ON vaccines FOR DELETE USING (
  health_record_id IN (
    SELECT id FROM health_records WHERE wellness_history_id IN (
      SELECT id FROM wellness_histories WHERE pet_id IN (
        SELECT id FROM pets WHERE auth_owner_id = auth.uid()))));

-- 8. Políticas MEDICATIONS (enlazadas via health_record)
CREATE POLICY "med_select" ON medications FOR SELECT USING (
  health_record_id IN (
    SELECT id FROM health_records WHERE wellness_history_id IN (
      SELECT id FROM wellness_histories WHERE pet_id IN (
        SELECT id FROM pets WHERE auth_owner_id = auth.uid()))));

CREATE POLICY "med_insert" ON medications FOR INSERT WITH CHECK (
  health_record_id IN (
    SELECT id FROM health_records WHERE wellness_history_id IN (
      SELECT id FROM wellness_histories WHERE pet_id IN (
        SELECT id FROM pets WHERE auth_owner_id = auth.uid()))));

CREATE POLICY "med_delete" ON medications FOR DELETE USING (
  health_record_id IN (
    SELECT id FROM health_records WHERE wellness_history_id IN (
      SELECT id FROM wellness_histories WHERE pet_id IN (
        SELECT id FROM pets WHERE auth_owner_id = auth.uid()))));

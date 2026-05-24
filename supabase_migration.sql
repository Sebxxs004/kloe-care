-- ================================================================
-- MIGRACIÓN: Adaptar pets para usar auth.users directamente
-- Ejecutar en Supabase SQL Editor
-- ================================================================

-- 1. Eliminar la restricción FK que apunta a la tabla users personalizada
ALTER TABLE pets DROP CONSTRAINT IF EXISTS pets_owner_id_fkey;

-- 2. Agregar columna auth_owner_id que referencia auth.users
ALTER TABLE pets ADD COLUMN IF NOT EXISTS auth_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Crear índice para auth_owner_id
CREATE INDEX IF NOT EXISTS idx_pets_auth_owner_id ON pets(auth_owner_id);

-- 4. Habilitar Row Level Security en todas las tablas
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE healths ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- 5. Política RLS para pets: cada usuario solo ve y edita sus mascotas
DROP POLICY IF EXISTS "pets_select_own" ON pets;
DROP POLICY IF EXISTS "pets_insert_own" ON pets;
DROP POLICY IF EXISTS "pets_update_own" ON pets;
DROP POLICY IF EXISTS "pets_delete_own" ON pets;

CREATE POLICY "pets_select_own" ON pets
  FOR SELECT USING (auth.uid() = auth_owner_id);

CREATE POLICY "pets_insert_own" ON pets
  FOR INSERT WITH CHECK (auth.uid() = auth_owner_id);

CREATE POLICY "pets_update_own" ON pets
  FOR UPDATE USING (auth.uid() = auth_owner_id);

CREATE POLICY "pets_delete_own" ON pets
  FOR DELETE USING (auth.uid() = auth_owner_id);

-- 6. Política RLS para wellness_histories: a través de la mascota
DROP POLICY IF EXISTS "wellness_select_own" ON wellness_histories;
DROP POLICY IF EXISTS "wellness_insert_own" ON wellness_histories;

CREATE POLICY "wellness_select_own" ON wellness_histories
  FOR SELECT USING (
    pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
  );

CREATE POLICY "wellness_insert_own" ON wellness_histories
  FOR INSERT WITH CHECK (
    pet_id IN (SELECT id FROM pets WHERE auth_owner_id = auth.uid())
  );

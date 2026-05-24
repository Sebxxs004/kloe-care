import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export const metadata = {
  title: 'Kloe Care — Mi Dashboard',
  description: 'Gestiona la salud y bienestar de tus mascotas.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  // 2. Cargar mascotas del usuario autenticado
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('auth_owner_id', user.id)
    .order('created_at', { ascending: true })

  // 3. Si hay mascotas, cargar wellness history de la primera
  let wellnessData = null
  if (pets && pets.length > 0) {
    const { data: wellness } = await supabase
      .from('wellness_histories')
      .select('*')
      .eq('pet_id', pets[0].id)
      .order('created_at', { ascending: false })
      .limit(5)
    wellnessData = wellness
  }

  return (
    <DashboardClient
      user={user}
      pets={pets || []}
      initialWellness={wellnessData || []}
    />
  )
}

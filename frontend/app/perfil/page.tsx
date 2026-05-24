import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ProfileClient from './ProfileClient'

export const metadata = { title: 'Perfil — Kloe Care' }

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  // Cargar mascotas del usuario
  const { data: pets } = await supabase
    .from('pets')
    .select('id, name, birth_date, gender, species')
    .eq('auth_owner_id', user.id)
    .order('created_at', { ascending: true })

  return <ProfileClient user={user} pets={pets || []} />
}

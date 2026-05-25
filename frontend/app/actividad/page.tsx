import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ActividadClient from './ActividadClient'

export const metadata = { title: 'Actividad — Kloe Care' }

export default async function ActividadPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pets } = await supabase
    .from('pets')
    .select('id, name, species')
    .eq('auth_owner_id', user.id)
    .order('created_at', { ascending: true })

  return <ActividadClient user={user} pets={pets || []} />
}

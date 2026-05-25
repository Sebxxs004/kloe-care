import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import HistorialClient from './HistorialClient'

export const metadata = { title: 'Historial — Kloe Care' }

export default async function HistorialPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pets } = await supabase
    .from('pets')
    .select('id, name, species')
    .eq('auth_owner_id', user.id)
    .order('created_at', { ascending: true })

  return <HistorialClient user={user} pets={pets || []} />
}

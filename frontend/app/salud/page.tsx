import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SaludClient from './SaludClient'

export const metadata = { title: 'Salud — Kloe Care' }

export default async function SaludPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: pets } = await supabase
    .from('pets')
    .select('id, name, species')
    .eq('auth_owner_id', user.id)
    .order('created_at', { ascending: true })

  return <SaludClient user={user} pets={pets || []} />
}

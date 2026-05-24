import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ComidaClient from './ComidaClient'

export const metadata = { title: 'Comida — Kloe Care' }

export default async function ComidaPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: pets } = await supabase
    .from('pets')
    .select('id, name, species')
    .eq('auth_owner_id', user.id)
    .order('created_at', { ascending: true })

  const firstPet = pets?.[0]

  const { data: feedings } = firstPet
    ? await supabase.from('feedings').select('*').eq('pet_id', firstPet.id).order('created_at', { ascending: false }).limit(20)
    : { data: [] }

  return <ComidaClient user={user} pets={pets || []} initialFeedings={feedings || []} />
}

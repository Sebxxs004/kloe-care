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

  const firstPet = pets?.[0]

  const [healthsRes, vaccinesRes, medsRes] = await Promise.all([
    firstPet ? supabase.from('healths').select('*').eq('pet_id', firstPet.id).order('created_at', { ascending: false }).limit(10) : { data: [] },
    firstPet ? supabase.from('vaccines').select('*').eq('pet_id', firstPet.id).order('applied_at', { ascending: false }).limit(10) : { data: [] },
    firstPet ? supabase.from('medications').select('*').eq('pet_id', firstPet.id).order('created_at', { ascending: false }).limit(10) : { data: [] },
  ])

  return (
    <SaludClient
      user={user}
      pets={pets || []}
      initialHealths={healthsRes.data || []}
      initialVaccines={vaccinesRes.data || []}
      initialMeds={medsRes.data || []}
    />
  )
}

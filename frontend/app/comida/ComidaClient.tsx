'use client'

import { useState } from 'react'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import './comida.css'

/* ── Icons (Heroicons outline 24px) ─────────────────────── */
const IcFood = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 16.5V12M9 16.5V12m4.5 4.5H18a.75.75 0 0 0 .75-.75v-9a.75.75 0 0 0-.75-.75H6a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h4.5Z" /></svg>
const IcScale = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 4.97Z" /></svg>
const IcClock = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
const IcClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
const IcCheck = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={40} height={40}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
const IcX = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={18} height={18}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
const IcPlus = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>

/* ── Food types ─────────────────────────────────────────── */
const FOOD_TYPES = [
  { value: 'Seca',        desc: 'Croquetas / Kibble' },
  { value: 'Húmeda',      desc: 'Latas / Sobres' },
  { value: 'Casera',      desc: 'Comida preparada' },
  { value: 'BARF / Raw',  desc: 'Dieta cruda' },
  { value: 'Snacks',      desc: 'Premios y golosinas' },
  { value: 'Suplementos', desc: 'Vitaminas y extras' },
]

const FREQUENCIES = ['1 vez al día','2 veces al día','3 veces al día','Ad libitum (libre)','Otro']

interface Pet { id: string; name: string; species: string }

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function ComidaClient({ user, pets }: { user: any; pets: Pet[] }) {
  const [petId, setPetId]     = useState(pets[0]?.id || '')
  const [success, setSuccess] = useState<string | null>(null)
  const [toast, setToast]     = useState<{ msg: string } | null>(null)

  const pet = pets.find(p => p.id === petId) || pets[0]

  function notify(msg: string, ok = true) {
    if (ok) { setSuccess(msg) }
    else { setToast({ msg }); setTimeout(() => setToast(null), 4000) }
  }

  return (
    <SessionGuard>
    <div className="cm-root">
      <Navbar />
      {toast && (
        <div className="cm-toast cm-toast--err"><IcX /> {toast.msg}</div>
      )}

      <div className="cm-split">

        {/* ── LEFT: Form ── */}
        <div className="cm-left">
          <div className="cm-left-inner">

            {/* Header */}
            <div className="cm-page-head">
              <div className="cm-page-head-icon"><IcFood /></div>
              <div>
                <h1 className="cm-title">Alimentación</h1>
                <p className="cm-subtitle">{pet ? `Dieta de ${pet.name}` : 'Registra la dieta de tu mascota'}</p>
              </div>
            </div>

            {/* Pet selector */}
            {pets.length > 1 && (
              <div className="cm-pet-pills">
                {pets.map(p => (
                  <button key={p.id}
                    className={`cm-pet-pill${p.id === petId ? ' cm-pet-pill--active' : ''}`}
                    onClick={() => { setPetId(p.id); setSuccess(null) }}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {!pet ? (
              <div className="cm-no-pet">
                <p>No tienes mascotas. <a href="/dashboard">Registra una</a> primero.</p>
              </div>
            ) : success ? (
              <div className="cm-success animate-up">
                <div className="cm-success-check"><IcCheck /></div>
                <h2>¡Guardado!</h2>
                <p>{success}</p>
                <button className="cm-success-btn" onClick={() => setSuccess(null)}>
                  <IcPlus /> Agregar otro registro
                </button>
              </div>
            ) : (
              <FeedingForm
                petId={petId}
                onSaved={notify}
                onError={m => notify(m, false)}
              />
            )}
          </div>
        </div>

        {/* ── RIGHT: Image ── */}
        <div className="cm-right">
          <div className="cm-right-overlay">
            <Image src="/images/food-pet.png" alt="Mascota comiendo"
              fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
            <div className="cm-right-content">
              <h2>Una alimentación<br /><span>balanceada y feliz</span></h2>
              <p>Lleva un registro de la dieta de tu mascota para su bienestar óptimo.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
    </SessionGuard>
  )
}

/* ================================================================
   FEEDING FORM
   ================================================================ */
function FeedingForm({ petId, onSaved, onError }: {
  petId: string; onSaved: (m: string) => void; onError: (m: string) => void
}) {
  const [types, setTypes]         = useState<string[]>([])
  const [brand, setBrand]         = useState('')
  const [amount, setAmount]       = useState('')
  const [schedule, setSchedule]   = useState('')
  const [frequency, setFrequency] = useState('')
  const [customFreq, setCustom]   = useState('')
  const [obs, setObs]             = useState('')
  const [loading, setLoading]     = useState(false)

  function toggle(t: string) { setTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (types.length === 0) { onError('Selecciona al menos un tipo de alimento.'); return }
    setLoading(true)
    const { error } = await createClient().from('feedings').insert({
      pet_id: petId, food_type: types,
      food_brand: brand.trim() || null,
      amount: amount ? parseFloat(amount) : null,
      schedule: schedule.trim() || null,
      frequency: (frequency === 'Otro' ? customFreq : frequency).trim() || null,
      observations: obs.trim() || null,
    })
    setLoading(false)
    if (error) { onError(error.message); return }
    onSaved('Registro de alimentación guardado correctamente.')
  }

  return (
    <form className="cm-form" onSubmit={submit}>

      <div className="cm-field">
        <label>Tipo de alimento *</label>
        <div className="cm-food-grid">
          {FOOD_TYPES.map(ft => (
            <button key={ft.value} type="button"
              className={`cm-food-btn${types.includes(ft.value) ? ' cm-food-btn--active' : ''}`}
              onClick={() => toggle(ft.value)}>
              <span className="cm-food-label">{ft.value}</span>
              <span className="cm-food-desc">{ft.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cm-form-grid">
        <div className="cm-field">
          <label>Marca / Producto</label>
          <input type="text" placeholder="Ej: Royal Canin, Purina..." value={brand} onChange={e => setBrand(e.target.value)} />
        </div>
        <div className="cm-field">
          <label><IcScale /> Cantidad (gramos)</label>
          <input type="number" min="0" step="1" placeholder="150" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="cm-field">
          <label><IcClock /> Horario de comida</label>
          <input type="text" placeholder="Ej: 8:00 AM y 6:00 PM" value={schedule} onChange={e => setSchedule(e.target.value)} />
        </div>
        <div className="cm-field">
          <label>Frecuencia</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="">Seleccionar...</option>
            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          {frequency === 'Otro' && (
            <input type="text" placeholder="Describe la frecuencia..." value={customFreq}
              onChange={e => setCustom(e.target.value)} style={{ marginTop: 8 }} />
          )}
        </div>
      </div>

      <div className="cm-field">
        <label><IcClipboard /> Observaciones nutricionales</label>
        <textarea rows={3} placeholder="Alergias, reacciones, cambios observados..."
          value={obs} onChange={e => setObs(e.target.value)} />
      </div>

      <button type="submit" className="cm-btn-submit" disabled={loading || types.length === 0}>
        {loading && <span className="cm-spinner" />}
        {loading ? 'Guardando...' : 'Guardar registro de alimentación'}
      </button>
    </form>
  )
}

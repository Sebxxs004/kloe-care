'use client'

import { useState } from 'react'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import {
  IconDrumstick, IconBowl, IconPaw, IconClipboard,
  IconTrash, IconX, IconPlus, IconScale, IconClock,
  SPECIES_ICONS
} from '../components/Icons'
import './comida.css'

const SPECIES_LABELS: Record<string, string> = {
  Perro: 'Perro', Gato: 'Gato', Conejo: 'Conejo',
  Ave: 'Ave', Reptil: 'Reptil', Pez: 'Pez', Otro: 'Otro'
}

const FOOD_TYPES = [
  { value: 'Seca',        icon: <IconBowl size={24} />,      desc: 'Croquetas / Kibble' },
  { value: 'Húmeda',      icon: <IconBowl size={24} />,      desc: 'Latas / Sobres' },
  { value: 'Casera',      icon: <IconBowl size={24} />,      desc: 'Comida preparada' },
  { value: 'BARF / Raw',  icon: <IconDrumstick size={24} />, desc: 'Dieta cruda / BARF' },
  { value: 'Snacks',      icon: <IconDrumstick size={24} />, desc: 'Premios y snacks' },
  { value: 'Suplementos', icon: <IconBowl size={24} />,      desc: 'Vitaminas y suplementos' },
]

const FREQUENCIES = ['1 vez al día', '2 veces al día', '3 veces al día', 'Ad libitum (libre)', 'Otro']

interface Pet { id: string; name: string; species: string }
interface Feeding {
  id: string; pet_id: string; food_type?: string[]; food_brand?: string
  amount?: number; schedule?: string; frequency?: string
  observations?: string; created_at: string
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function ComidaClient({ user, pets, initialFeedings }: {
  user: User; pets: Pet[]; initialFeedings: Feeding[]
}) {
  const [petId, setPetId]       = useState<string>(pets[0]?.id || '')
  const [feedings, setFeedings] = useState(initialFeedings)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null)

  const pet = pets.find(p => p.id === petId) || pets[0]

  function notify(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function handlePetChange(id: string) {
    setPetId(id); setShowForm(false)
    const sb = createClient()
    const { data } = await sb.from('feedings').select('*').eq('pet_id', id).order('created_at', { ascending: false }).limit(20)
    setFeedings(data || [])
  }

  async function deleteFeeding(id: string) {
    const sb = createClient()
    await sb.from('feedings').delete().eq('id', id)
    setFeedings(p => p.filter(f => f.id !== id))
    notify('Registro eliminado.')
  }

  return (
    <SessionGuard>
    <div className="cm-root">
      <Navbar />
      {toast && (
        <div className={`cm-toast${toast.ok ? '' : ' cm-toast--err'}`}>
          {toast.ok ? <IconDrumstick size={14} /> : <IconX size={14} />} {toast.msg}
        </div>
      )}

      <main className="cm-main">

        {/* ── Hero banner ── */}
        <div className="cm-hero animate-up">
          <div className="cm-hero-text">
            <div className="cm-hero-icon"><IconDrumstick size={28} /></div>
            <h1 className="cm-title">Alimentación</h1>
            <p className="cm-subtitle">
              {pet ? `Registros de alimentación de ${pet.name}` : 'Registra la dieta de tu mascota'}
            </p>
          </div>
          <div className="cm-hero-img">
            <Image
              src="/images/food-pet.png"
              alt="Mascota comiendo"
              width={260}
              height={200}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        {/* ── Actions row ── */}
        {pet && (
          <div className="cm-actions-row animate-up">
            {pets.length > 1 && (
              <div className="cm-pet-selector">
                {pets.map(p => (
                  <button
                    key={p.id}
                    className={`cm-pet-pill${p.id === petId ? ' cm-pet-pill--active' : ''}`}
                    onClick={() => handlePetChange(p.id)}
                  >
                    <span className="cm-pet-icon">{SPECIES_ICONS[p.species] || <IconPaw size={14} />}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
            <button className="cm-btn-add" onClick={() => setShowForm(v => !v)}>
              {showForm
                ? <><IconX size={15} /> Cerrar</>
                : <><IconPlus size={15} /> Nuevo registro</>}
            </button>
          </div>
        )}

        {!pet ? (
          <div className="cm-no-pet animate-up">
            <IconPaw size={40} />
            <p>No tienes mascotas. <a href="/dashboard">Registra una mascota</a> primero.</p>
          </div>
        ) : (<>

          {showForm && (
            <div className="cm-form-wrap animate-up">
              <FeedingForm
                petId={petId}
                onSaved={r => { setFeedings(p => [r, ...p]); setShowForm(false); notify('Registro de alimentación guardado.') }}
                onError={msg => notify(msg, false)}
              />
            </div>
          )}

          {/* List header */}
          <div className="cm-list-header animate-up">
            <h2>
              <IconClipboard size={18} />
              Historial de alimentación
              <span className="cm-count">{feedings.length}</span>
            </h2>
          </div>

          {feedings.length === 0 ? (
            <div className="cm-empty animate-up">
              <div className="cm-empty-icon"><IconDrumstick size={48} /></div>
              <h3>Sin registros de alimentación</h3>
              <p>Aún no has registrado la dieta de {pet.name}.</p>
              <p>Haz clic en <strong>"+ Nuevo registro"</strong> para empezar.</p>
            </div>
          ) : (
            <div className="cm-list animate-up">
              {feedings.map((f, i) => <FeedingCard key={f.id} feeding={f} index={i} onDelete={deleteFeeding} />)}
            </div>
          )}

        </>)}
      </main>
    </div>
    </SessionGuard>
  )
}

function FeedingForm({ petId, onSaved, onError }: {
  petId: string; onSaved: (r: any) => void; onError: (m: string) => void
}) {
  const [types, setTypes]         = useState<string[]>([])
  const [brand, setBrand]         = useState('')
  const [amount, setAmount]       = useState('')
  const [schedule, setSchedule]   = useState('')
  const [frequency, setFrequency] = useState('')
  const [customFreq, setCustom]   = useState('')
  const [observations, setObs]    = useState('')
  const [loading, setLoading]     = useState(false)

  function toggleType(t: string) {
    setTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (types.length === 0) { onError('Selecciona al menos un tipo de alimento.'); return }
    setLoading(true)
    const sb = createClient()
    const { data, error } = await sb.from('feedings').insert({
      pet_id: petId, food_type: types,
      food_brand: brand.trim() || null,
      amount: amount ? parseFloat(amount) : null,
      schedule: schedule.trim() || null,
      frequency: (frequency === 'Otro' ? customFreq : frequency).trim() || null,
      observations: observations.trim() || null,
    }).select().single()
    setLoading(false)
    if (error) { onError(error.message); return }
    onSaved(data)
  }

  return (
    <form className="cm-form" onSubmit={submit} noValidate>
      <h3 className="cm-form-title"><IconDrumstick size={18} /> Nuevo Registro de Alimentación</h3>

      <div className="cm-field">
        <label>Tipo de alimento *</label>
        <div className="cm-food-grid">
          {FOOD_TYPES.map(ft => (
            <button key={ft.value} type="button"
              className={`cm-food-btn${types.includes(ft.value) ? ' cm-food-btn--active' : ''}`}
              onClick={() => toggleType(ft.value)}
            >
              <span className="cm-food-ico">{ft.icon}</span>
              <span className="cm-food-label">{ft.value}</span>
              <span className="cm-food-desc">{ft.desc}</span>
              {types.includes(ft.value) && <span className="cm-food-check"><IconX size={10} /></span>}
            </button>
          ))}
        </div>
      </div>

      <div className="cm-form-grid">
        <div className="cm-field">
          <label>Marca / Producto</label>
          <input type="text" placeholder="Ej: Royal Canin, Purina Pro Plan..." value={brand} onChange={e => setBrand(e.target.value)} />
        </div>
        <div className="cm-field">
          <label><IconScale size={13} /> Cantidad (gramos)</label>
          <input type="number" min="0" step="1" placeholder="Ej: 150" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="cm-field">
          <label><IconClock size={13} /> Horario de comida</label>
          <input type="text" placeholder="Ej: 8:00 AM y 6:00 PM" value={schedule} onChange={e => setSchedule(e.target.value)} />
        </div>
        <div className="cm-field">
          <label>Frecuencia</label>
          <div className="cm-select-wrap">
            <select value={frequency} onChange={e => setFrequency(e.target.value)}>
              <option value="">Seleccionar...</option>
              {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          {frequency === 'Otro' && (
            <input type="text" placeholder="Describe la frecuencia..." value={customFreq}
              onChange={e => setCustom(e.target.value)} style={{ marginTop: 8 }} />
          )}
        </div>
      </div>

      <div className="cm-field">
        <label><IconClipboard size={13} /> Observaciones nutricionales</label>
        <textarea placeholder="Notas sobre la dieta, alergias, reacciones, cambios observados..."
          value={observations} onChange={e => setObs(e.target.value)} rows={3} />
      </div>

      <button type="submit" className="cm-btn-submit" disabled={loading || types.length === 0}>
        {loading ? <span className="cm-spinner" /> : null}
        {loading ? 'Guardando...' : 'Guardar registro de alimentación'}
      </button>
    </form>
  )
}

function FeedingCard({ feeding: f, index, onDelete }: { feeding: Feeding; index: number; onDelete: (id: string) => void }) {
  return (
    <div className="cm-record" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="cm-record-left">
        <div className="cm-record-icon-wrap"><IconDrumstick size={20} /></div>
        <div className="cm-record-body">
          <div className="cm-record-head">
            <div className="cm-type-tags">
              {(f.food_type || []).map(t => <span key={t} className="cm-ttag">{t}</span>)}
            </div>
            {f.food_brand && <span className="cm-brand">{f.food_brand}</span>}
          </div>
          <div className="cm-record-meta">
            {f.amount    && <span className="cm-meta-chip"><IconScale size={11} /> {f.amount}g</span>}
            {f.schedule  && <span className="cm-meta-chip"><IconClock size={11} /> {f.schedule}</span>}
            {f.frequency && <span className="cm-meta-chip">{f.frequency}</span>}
          </div>
          {f.observations && <p className="cm-record-obs">{f.observations}</p>}
          <p className="cm-record-date">{fmt(f.created_at)}</p>
        </div>
      </div>
      <button className="cm-record-del" onClick={() => onDelete(f.id)} title="Eliminar">
        <IconTrash size={14} />
      </button>
    </div>
  )
}

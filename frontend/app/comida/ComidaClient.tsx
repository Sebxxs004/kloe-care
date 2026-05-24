'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import './comida.css'

const SPECIES_EMOJI: Record<string, string> = {
  Perro: '🐶', Gato: '🐱', Conejo: '🐰', Ave: '🦜', Reptil: '🦎', Pez: '🐠', Otro: '🐾'
}

const FOOD_TYPES = [
  { value: 'Seca',        emoji: '🟤', desc: 'Croquetas / Kibble' },
  { value: 'Húmeda',      emoji: '🥫', desc: 'Latas / Sobres' },
  { value: 'Casera',      emoji: '🍳', desc: 'Comida preparada en casa' },
  { value: 'BARF / Raw',  emoji: '🥩', desc: 'Dieta cruda / BARF' },
  { value: 'Snacks',      emoji: '🦴', desc: 'Premios y snacks' },
  { value: 'Suplementos', emoji: '💊', desc: 'Vitaminas y suplementos' },
]

const FREQUENCIES = ['1 vez al día', '2 veces al día', '3 veces al día', 'Ad libitum (libre)', 'Otro']

interface Pet { id: string; name: string; species: string }
interface Feeding {
  id: string; pet_id: string; food_type?: string[]; food_brand?: string
  amount?: number; schedule?: string; frequency?: string
  observations?: string; created_at: string
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ComidaClient({ user, pets, initialFeedings }: {
  user: User; pets: Pet[]; initialFeedings: Feeding[]
}) {
  const [petId, setPetId]           = useState<string>(pets[0]?.id || '')
  const [feedings, setFeedings]     = useState(initialFeedings)
  const [showForm, setShowForm]     = useState(false)
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null)

  const pet = pets.find(p => p.id === petId) || pets[0]

  function notify(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function handlePetChange(id: string) {
    setPetId(id)
    setShowForm(false)
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
      {toast && <div className={`cm-toast${toast.ok ? '' : ' cm-toast--err'}`}>{toast.ok ? '✓' : '✕'} {toast.msg}</div>}

      <main className="cm-main">

        {/* ── Header ── */}
        <header className="cm-header animate-up">
          <div>
            <h1 className="cm-title">🍖 Alimentación</h1>
            <p className="cm-subtitle">
              {pet ? `Registros de alimentación de ${pet.name}` : 'Registra la dieta de tu mascota'}
            </p>
          </div>
          {pet && (
            <button className="cm-btn-add" onClick={() => setShowForm(v => !v)}>
              {showForm ? '✕ Cerrar' : '+ Nuevo registro'}
            </button>
          )}
        </header>

        {/* Pet selector */}
        {pets.length > 1 && (
          <div className="cm-pet-selector animate-up">
            {pets.map(p => (
              <button
                key={p.id}
                className={`cm-pet-pill${p.id === petId ? ' cm-pet-pill--active' : ''}`}
                onClick={() => handlePetChange(p.id)}
              >
                {SPECIES_EMOJI[p.species] || '🐾'} {p.name}
              </button>
            ))}
          </div>
        )}

        {!pet ? (
          <div className="cm-no-pet animate-up">
            <p>🐾 No tienes mascotas. <a href="/dashboard">Registra una mascota</a> primero.</p>
          </div>
        ) : (<>

          {/* ── Inline form ── */}
          {showForm && (
            <div className="cm-form-wrap animate-up">
              <FeedingForm
                petId={petId}
                onSaved={r => { setFeedings(p => [r, ...p]); setShowForm(false); notify('Registro de alimentación guardado.') }}
                onError={msg => notify(msg, false)}
              />
            </div>
          )}

          {/* ── Records count ── */}
          <div className="cm-list-header animate-up">
            <h2>
              <span className="cm-list-icon">📋</span>
              Historial de alimentación
              <span className="cm-count">{feedings.length}</span>
            </h2>
          </div>

          {/* ── Record list ── */}
          {feedings.length === 0 ? (
            <div className="cm-empty animate-up">
              <div className="cm-empty-icon">🍖</div>
              <h3>Sin registros de alimentación</h3>
              <p>Aún no has registrado la dieta de {pet.name}.</p>
              <p>Haz clic en <strong>"+ Nuevo registro"</strong> para empezar.</p>
            </div>
          ) : (
            <div className="cm-list animate-up">
              {feedings.map((f, i) => (
                <FeedingCard key={f.id} feeding={f} index={i} onDelete={deleteFeeding} />
              ))}
            </div>
          )}

        </>)}
      </main>
    </div>
    </SessionGuard>
  )
}

/* ── Feeding Form ── */
function FeedingForm({ petId, onSaved, onError }: {
  petId: string
  onSaved: (r: any) => void
  onError: (m: string) => void
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

  const finalFreq = frequency === 'Otro' ? customFreq : frequency

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (types.length === 0) { onError('Selecciona al menos un tipo de alimento.'); return }
    setLoading(true)
    const sb = createClient()
    const { data, error } = await sb.from('feedings').insert({
      pet_id:       petId,
      food_type:    types,
      food_brand:   brand.trim() || null,
      amount:       amount ? parseFloat(amount) : null,
      schedule:     schedule.trim() || null,
      frequency:    finalFreq.trim() || null,
      observations: observations.trim() || null,
    }).select().single()
    setLoading(false)
    if (error) { onError(error.message); return }
    onSaved(data)
  }

  return (
    <form className="cm-form" onSubmit={submit} noValidate>
      <h3 className="cm-form-title">🍖 Nuevo Registro de Alimentación</h3>

      {/* Tipo de alimento */}
      <div className="cm-field">
        <label>Tipo de alimento *</label>
        <div className="cm-food-grid">
          {FOOD_TYPES.map(ft => (
            <button
              key={ft.value} type="button"
              className={`cm-food-btn${types.includes(ft.value) ? ' cm-food-btn--active' : ''}`}
              onClick={() => toggleType(ft.value)}
            >
              <span className="cm-food-emoji">{ft.emoji}</span>
              <span className="cm-food-label">{ft.value}</span>
              <span className="cm-food-desc">{ft.desc}</span>
              {types.includes(ft.value) && <span className="cm-food-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="cm-form-grid">
        {/* Marca */}
        <div className="cm-field">
          <label>Marca / Producto</label>
          <input type="text" placeholder="Ej: Royal Canin, Purina Pro Plan..." value={brand} onChange={e => setBrand(e.target.value)} />
        </div>

        {/* Cantidad */}
        <div className="cm-field">
          <label>Cantidad (gramos)</label>
          <input type="number" min="0" step="1" placeholder="Ej: 150" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        {/* Horario */}
        <div className="cm-field">
          <label>Horario de comida</label>
          <input type="text" placeholder="Ej: 8:00 AM y 6:00 PM" value={schedule} onChange={e => setSchedule(e.target.value)} />
        </div>

        {/* Frecuencia */}
        <div className="cm-field">
          <label>Frecuencia</label>
          <div className="cm-select-wrap">
            <select value={frequency} onChange={e => setFrequency(e.target.value)}>
              <option value="">Seleccionar...</option>
              {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          {frequency === 'Otro' && (
            <input
              type="text" placeholder="Describe la frecuencia..."
              value={customFreq} onChange={e => setCustom(e.target.value)}
              style={{ marginTop: 8 }}
            />
          )}
        </div>
      </div>

      {/* Observaciones nutricionales */}
      <div className="cm-field">
        <label>Observaciones nutricionales</label>
        <textarea
          placeholder="Notas sobre la dieta, alergias, reacciones, cambios observados..."
          value={observations}
          onChange={e => setObs(e.target.value)}
          rows={3}
        />
      </div>

      <button type="submit" className="cm-btn-submit" disabled={loading || types.length === 0}>
        {loading ? <span className="cm-spinner" /> : '💾 '}
        {loading ? 'Guardando...' : 'Guardar registro de alimentación'}
      </button>
    </form>
  )
}

/* ── Feeding Card ── */
function FeedingCard({ feeding: f, index, onDelete }: { feeding: Feeding; index: number; onDelete: (id: string) => void }) {
  const typeEmojis = (f.food_type || []).map(t => FOOD_TYPES.find(ft => ft.value === t)?.emoji || '🍽️')

  return (
    <div className="cm-record" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="cm-record-left">
        <div className="cm-record-icons">{typeEmojis.join(' ') || '🍽️'}</div>
        <div className="cm-record-body">
          <div className="cm-record-head">
            <div className="cm-type-tags">
              {(f.food_type || []).map(t => <span key={t} className="cm-ttag">{t}</span>)}
            </div>
            {f.food_brand && <span className="cm-brand">{f.food_brand}</span>}
          </div>

          <div className="cm-record-meta">
            {f.amount    && <span className="cm-meta-chip">⚖️ {f.amount}g</span>}
            {f.schedule  && <span className="cm-meta-chip">🕐 {f.schedule}</span>}
            {f.frequency && <span className="cm-meta-chip">🔁 {f.frequency}</span>}
          </div>

          {f.observations && <p className="cm-record-obs">{f.observations}</p>}

          <p className="cm-record-date">{fmt(f.created_at)}</p>
        </div>
      </div>
      <button className="cm-record-del" onClick={() => onDelete(f.id)} title="Eliminar">✕</button>
    </div>
  )
}

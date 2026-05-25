'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import './actividad.css'

/* ── Icons (Heroicons outline) ───────────────────────────── */
const IcActivity  = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M9.4 18.6l-8.3-8.3a4.5 4.5 0 1 1 6.4-6.4l1.9 1.9m0 0l8.3 8.3a4.5 4.5 0 1 1-6.4 6.4l-1.9-1.9" /></svg>
const IcFire      = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.638 5.214m7.72 0a8.25 8.25 0 0 0-7.72 0m0 0L15.5 7.5m0 0L21 3.75" /></svg>
const IcClock     = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
const IcCalendar  = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
const IcCheck     = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={40} height={40}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
const IcPlus      = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
const IcX         = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={18} height={18}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

/* ── Activity types ─────────────────────────────────────── */
const ACTIVITY_TYPES = [
  { value: 'Caminata', icon: '🚶' },
  { value: 'Carrera/Trote', icon: '🏃' },
  { value: 'Natación', icon: '🏊' },
  { value: 'Juego interactivo', icon: '🎾' },
  { value: 'Ejercicio en casa', icon: '🏠' },
  { value: 'Agility', icon: '⚡' },
  { value: 'Otro', icon: '🎯' },
]

const INTENSITIES = ['Baja', 'Media', 'Alta']

const CALORIE_RATES: { [key: string]: number } = {
  'Baja': 2.5,
  'Media': 5,
  'Alta': 8.5,
}

interface Pet { id: string; name: string; species: string }

/* ── Helper: obtener o crear wellness_history para una mascota ── */
async function getOrCreateWellnessHistory(petId: string): Promise<string | null> {
  const supabase = createClient()
  const { data: existing } = await supabase
    .from('wellness_histories')
    .select('id')
    .eq('pet_id', petId)
    .maybeSingle()

  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from('wellness_histories')
    .insert({ pet_id: petId })
    .select('id')
    .single()

  return error ? null : created.id
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function ActividadClient({ user, pets }: { user: any; pets: Pet[] }) {
  const [petId, setPetId]     = useState(pets[0]?.id || '')
  const [success, setSuccess] = useState<string | null>(null)
  const [toast, setToast]     = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form')

  const pet = pets.find(p => p.id === petId) || pets[0]

  function notify(msg: string, ok = true) {
    if (ok) { setSuccess(msg) }
    else { setToast(msg); setTimeout(() => setToast(null), 4000) }
  }

  return (
    <SessionGuard>
    <div className="ac-root">
      <Navbar />
      {toast && <div className="ac-toast ac-toast--err"><IcX /> {toast}</div>}

      <div className="ac-split">
        {/* ── LEFT ── */}
        <div className="ac-left">
          <div className="ac-left-inner">

            <div className="ac-page-head">
              <div className="ac-page-head-icon"><IcActivity /></div>
              <div>
                <h1 className="ac-title">Actividad</h1>
                <p className="ac-subtitle">{pet ? `Ejercicio de ${pet.name}` : 'Registra la actividad de tu mascota'}</p>
              </div>
            </div>

            {pets.length > 1 && (
              <div className="ac-pet-pills">
                {pets.map(p => (
                  <button key={p.id}
                    className={`ac-pet-pill${p.id === petId ? ' ac-pet-pill--active' : ''}`}
                    onClick={() => { setPetId(p.id); setSuccess(null) }}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {!pet ? (
              <div className="ac-no-pet"><p>No tienes mascotas. <a href="/dashboard">Registra una</a> primero.</p></div>
            ) : (
              <>
                <div className="ac-tabs">
                  <button
                    className={`ac-tab${activeTab === 'form' ? ' ac-tab--active' : ''}`}
                    onClick={() => { setActiveTab('form'); setSuccess(null) }}>
                    Nuevo registro
                  </button>
                  <button
                    className={`ac-tab${activeTab === 'history' ? ' ac-tab--active' : ''}`}
                    onClick={() => setActiveTab('history')}>
                    Ver historial
                  </button>
                </div>

                {success ? (
                  <div className="ac-success animate-up">
                    <div className="ac-success-check"><IcCheck /></div>
                    <h2>¡Guardado!</h2>
                    <p>{success}</p>
                    <button className="ac-success-btn" onClick={() => setSuccess(null)}>
                      <IcPlus /> Agregar otro registro
                    </button>
                  </div>
                ) : activeTab === 'form' ? (
                  <ActivityForm petId={petId} onSaved={notify} onError={m => notify(m, false)} />
                ) : (
                  <ActivityHistory petId={petId} />
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="ac-right">
          <div className="ac-right-overlay">
            <Image src="/images/food-pet.png" alt="Mascota activa"
              fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
            <div className="ac-right-content">
              <h2>Movimiento y<br /><span>bienestar</span></h2>
              <p>Registra la actividad física de tu mascota para mantenerla saludable y feliz.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SessionGuard>
  )
}

/* ================================================================
   ACTIVITY FORM
   ================================================================ */
function ActivityForm({ petId, onSaved, onError }: {
  petId: string; onSaved: (m: string) => void; onError: (m: string) => void
}) {
  const [activityType, setActivityType] = useState('')
  const [customType, setCustomType]     = useState('')
  const [duration, setDuration]         = useState('')
  const [intensity, setIntensity]       = useState('')
  const [estimatedCalories, setEstimatedCalories] = useState<number | ''>('')
  const [notes, setNotes]               = useState('')
  const [loading, setLoading]           = useState(false)

  // Auto-calculate calories when duration or intensity changes
  useEffect(() => {
    if (duration && intensity) {
      const durationNum = parseInt(duration)
      const rate = CALORIE_RATES[intensity]
      if (durationNum && rate) {
        setEstimatedCalories(Math.round(durationNum * rate * 10) / 10)
      }
    }
  }, [duration, intensity])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!activityType) { onError('Selecciona un tipo de actividad.'); return }
    if (!duration) { onError('Ingresa la duración.'); return }
    if (!intensity) { onError('Selecciona la intensidad.'); return }

    setLoading(true)

    const wellnessId = await getOrCreateWellnessHistory(petId)
    if (!wellnessId) { onError('No se pudo inicializar el historial de bienestar.'); setLoading(false); return }

    const finalActivityType = activityType === 'Otro' ? customType.trim() : activityType
    
    // Build observations with intensity and estimated calories
    let fullObservations = notes.trim()
    fullObservations += (fullObservations ? '\n' : '') + `Intensidad: ${intensity}`
    if (estimatedCalories) {
      fullObservations += ` | Calorías estimadas: ${estimatedCalories} kcal`
    }

    const { error } = await createClient().from('activities').insert({
      wellness_history_id: wellnessId,
      activity_type: finalActivityType,
      duration: `${duration} minutos`,
      observations: fullObservations,
    })

    setLoading(false)
    if (error) { onError(error.message); return }
    
    onSaved('Registro de actividad guardado correctamente.')
    setActivityType('')
    setCustomType('')
    setDuration('')
    setIntensity('')
    setEstimatedCalories('')
    setNotes('')
  }

  return (
    <form className="ac-form" onSubmit={submit}>

      <div className="ac-field">
        <label>Tipo de actividad *</label>
        <div className="ac-activity-grid">
          {ACTIVITY_TYPES.map(at => (
            <button key={at.value} type="button"
              className={`ac-activity-btn${activityType === at.value ? ' ac-activity-btn--active' : ''}`}
              onClick={() => { setActivityType(at.value); setCustomType('') }}>
              <span className="ac-activity-icon">{at.icon}</span>
              <span className="ac-activity-label">{at.value}</span>
            </button>
          ))}
        </div>
        {activityType === 'Otro' && (
          <input type="text" placeholder="Describe la actividad..." value={customType}
            onChange={e => setCustomType(e.target.value)} style={{ marginTop: 8 }} />
        )}
      </div>

      <div className="ac-form-grid">
        <div className="ac-field">
          <label><IcClock /> Duración (minutos) *</label>
          <input type="number" min="1" step="1" placeholder="30" value={duration}
            onChange={e => setDuration(e.target.value)} />
        </div>

        <div className="ac-field">
          <label>Intensidad *</label>
          <select value={intensity} onChange={e => setIntensity(e.target.value)}>
            <option value="">Seleccionar...</option>
            {INTENSITIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      {estimatedCalories && (
        <div className="ac-calories-preview">
          <IcFire /> Calorías estimadas: <strong>{estimatedCalories} kcal</strong>
        </div>
      )}

      <div className="ac-field">
        <label>Notas</label>
        <textarea rows={3} placeholder="Observaciones sobre la actividad..."
          value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <button type="submit" className="ac-btn-submit" disabled={loading || !activityType || !duration || !intensity}>
        {loading && <span className="ac-spinner" />}
        {loading ? 'Guardando...' : 'Guardar registro de actividad'}
      </button>
    </form>
  )
}

/* ================================================================
   ACTIVITY HISTORY
   ================================================================ */
function ActivityHistory({ petId }: { petId: string }) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    (async () => {
      const { data: wh } = await supabase
        .from('wellness_histories')
        .select('id')
        .eq('pet_id', petId)
        .maybeSingle()

      if (!wh) { setLoading(false); return }

      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('wellness_history_id', wh.id)
        .order('created_at', { ascending: false })

      setRecords(data || [])
      setLoading(false)
    })()
  }, [petId, supabase])

  if (loading) return <div className="ac-loading">Cargando registros...</div>

  if (records.length === 0)
    return <div className="ac-empty-state"><p>No hay registros de actividad aún.</p></div>

  // Calculate statistics
  const totalSessions = records.length
  const totalMinutes = records.reduce((sum, r) => {
    const mins = parseInt(r.duration)
    return sum + (isNaN(mins) ? 0 : mins)
  }, 0)
  const totalCalories = records.reduce((sum, r) => {
    const calMatch = r.observations?.match(/Calorías estimadas: ([\d.]+)/)
    const cals = calMatch ? parseFloat(calMatch[1]) : 0
    return sum + cals
  }, 0)

  return (
    <div className="ac-history">
      <div className="ac-history-stats">
        <div className="ac-stat-card">
          <div className="ac-stat-label">Sesiones</div>
          <div className="ac-stat-value">{totalSessions}</div>
        </div>
        <div className="ac-stat-card">
          <div className="ac-stat-label">Minutos totales</div>
          <div className="ac-stat-value">{totalMinutes}</div>
        </div>
        <div className="ac-stat-card">
          <div className="ac-stat-label">Calorías</div>
          <div className="ac-stat-value">{totalCalories.toFixed(1)}</div>
        </div>
      </div>

      {records.map(r => {
        const intensityMatch = r.observations?.match(/Intensidad: (\w+)/)
        const intensity = intensityMatch ? intensityMatch[1] : '-'
        const calMatch = r.observations?.match(/Calorías estimadas: ([\d.]+)/)
        const calories = calMatch ? calMatch[1] : null
        const notes = r.observations?.replace(/Intensidad: \w+.*/, '').trim() || ''

        return (
          <div key={r.id} className="ac-history-card">
            <div className="ac-history-header">
              <span className="ac-history-activity">{r.activity_type}</span>
              <span className="ac-history-date">
                {new Date(r.created_at).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
            <div className="ac-history-grid">
              <div>
                <strong>Duración:</strong> {r.duration}
              </div>
              <div>
                <strong>Intensidad:</strong> {intensity}
              </div>
              {calories && (
                <div>
                  <strong>Calorías:</strong> {calories} kcal
                </div>
              )}
              {notes && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Notas:</strong> {notes}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

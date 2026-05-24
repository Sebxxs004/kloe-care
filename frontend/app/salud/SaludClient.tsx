'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import './salud.css'

/* ── Types ── */
interface Pet { id: string; name: string; species: string }
interface HealthRecord {
  id: string; temperature?: number; general_state?: string
  symptoms?: string[]; observations?: string; created_at: string; pet_id: string
}
interface Vaccine {
  id: string; name: string; laboratory?: string
  applied_at: string; next_dose_at?: string; notes?: string; pet_id: string
}
interface Medication {
  id: string; name: string; dosage?: string; frequency?: string
  start_date?: string; end_date?: string; notes?: string; pet_id: string
}

const SPECIES_EMOJI: Record<string, string> = {
  Perro: '🐶', Gato: '🐱', Conejo: '🐰', Ave: '🦜', Reptil: '🦎', Pez: '🐠', Otro: '🐾'
}

const GENERAL_STATES = [
  { value: 'Excelente', emoji: '🌟', color: '#16A34A' },
  { value: 'Bueno',     emoji: '😊', color: '#22C55E' },
  { value: 'Regular',   emoji: '😐', color: '#F97316' },
  { value: 'Malo',      emoji: '😟', color: '#EF4444' },
  { value: 'Crítico',   emoji: '🆘', color: '#DC2626' },
]

const SYMPTOMS_LIST = [
  'Vómitos', 'Diarrea', 'Letargo', 'Falta de apetito', 'Fiebre',
  'Tos', 'Estornudos', 'Lamido excesivo', 'Pérdida de peso',
  'Ojos llorosos', 'Rascado intenso', 'Problemas respiratorios'
]

type Tab = 'salud' | 'vacunas' | 'medicamentos'

function fmt(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ================================================================
   MAIN CLIENT COMPONENT
   ================================================================ */
export default function SaludClient({
  user, pets,
  initialHealths, initialVaccines, initialMeds
}: {
  user: User; pets: Pet[]
  initialHealths: HealthRecord[]; initialVaccines: Vaccine[]; initialMeds: Medication[]
}) {
  const [tab, setTab]             = useState<Tab>('salud')
  const [petId, setPetId]         = useState<string>(pets[0]?.id || '')
  const [healths, setHealths]     = useState(initialHealths)
  const [vaccines, setVaccines]   = useState(initialVaccines)
  const [meds, setMeds]           = useState(initialMeds)
  const [showForm, setShowForm]   = useState(false)
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null)

  const pet = pets.find(p => p.id === petId) || pets[0]

  function notify(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function handlePetChange(id: string) {
    setPetId(id)
    setShowForm(false)
    const sb = createClient()
    const [h, v, m] = await Promise.all([
      sb.from('healths').select('*').eq('pet_id', id).order('created_at', { ascending: false }).limit(10),
      sb.from('vaccines').select('*').eq('pet_id', id).order('applied_at', { ascending: false }).limit(10),
      sb.from('medications').select('*').eq('pet_id', id).order('created_at', { ascending: false }).limit(10),
    ])
    setHealths(h.data || [])
    setVaccines(v.data || [])
    setMeds(m.data || [])
  }

  async function deleteRecord(table: string, id: string) {
    const sb = createClient()
    await sb.from(table).delete().eq('id', id)
    if (table === 'healths')     setHealths(p => p.filter(r => r.id !== id))
    if (table === 'vaccines')    setVaccines(p => p.filter(r => r.id !== id))
    if (table === 'medications') setMeds(p => p.filter(r => r.id !== id))
    notify('Registro eliminado.')
  }

  return (
    <SessionGuard>
    <div className="sl-root">
      <Navbar />
      {toast && <div className={`sl-toast${toast.ok ? '' : ' sl-toast--err'}`}>{toast.ok ? '✓' : '✕'} {toast.msg}</div>}

      <main className="sl-main">

        {/* ── Page header ── */}
        <header className="sl-header animate-up">
          <div>
            <h1 className="sl-title">❤️ Salud</h1>
            <p className="sl-subtitle">
              {pet ? `Registros de salud de ${pet.name}` : 'Registra y monitorea la salud de tu mascota'}
            </p>
          </div>
          {pet && (
            <button className="sl-btn-add" onClick={() => setShowForm(v => !v)}>
              {showForm ? '✕ Cerrar' : '+ Nuevo registro'}
            </button>
          )}
        </header>

        {/* Pet selector */}
        {pets.length > 1 && (
          <div className="sl-pet-selector animate-up">
            {pets.map(p => (
              <button
                key={p.id}
                className={`sl-pet-pill${p.id === petId ? ' sl-pet-pill--active' : ''}`}
                onClick={() => handlePetChange(p.id)}
              >
                {SPECIES_EMOJI[p.species] || '🐾'} {p.name}
              </button>
            ))}
          </div>
        )}

        {!pet ? (
          <div className="sl-no-pet animate-up">
            <p>🐾 No tienes mascotas registradas. <a href="/dashboard">Registra una mascota</a> primero.</p>
          </div>
        ) : (<>

          {/* ── Inline form ── */}
          {showForm && (
            <div className="sl-form-wrap animate-up">
              {tab === 'salud' && (
                <HealthForm petId={petId} onSaved={r => { setHealths(p => [r, ...p]); setShowForm(false); notify('Registro de salud guardado.') }} onError={notify} />
              )}
              {tab === 'vacunas' && (
                <VaccineForm petId={petId} onSaved={r => { setVaccines(p => [r, ...p]); setShowForm(false); notify('Vacuna registrada.') }} onError={notify} />
              )}
              {tab === 'medicamentos' && (
                <MedForm petId={petId} onSaved={r => { setMeds(p => [r, ...p]); setShowForm(false); notify('Medicamento guardado.') }} onError={notify} />
              )}
            </div>
          )}

          {/* ── Tabs ── */}
          <div className="sl-tabs animate-up">
            {(['salud', 'vacunas', 'medicamentos'] as Tab[]).map(t => (
              <button
                key={t}
                className={`sl-tab${tab === t ? ' sl-tab--active' : ''}`}
                onClick={() => { setTab(t); setShowForm(false) }}
              >
                {t === 'salud' ? '❤️ Salud' : t === 'vacunas' ? '💉 Vacunas' : '💊 Medicamentos'}
                <span className="sl-tab-count">
                  {t === 'salud' ? healths.length : t === 'vacunas' ? vaccines.length : meds.length}
                </span>
              </button>
            ))}
          </div>

          {/* ── Records ── */}
          {tab === 'salud' && (
            <HealthList records={healths} onDelete={id => deleteRecord('healths', id)} petName={pet.name} />
          )}
          {tab === 'vacunas' && (
            <VaccineList records={vaccines} onDelete={id => deleteRecord('vaccines', id)} petName={pet.name} />
          )}
          {tab === 'medicamentos' && (
            <MedList records={meds} onDelete={id => deleteRecord('medications', id)} petName={pet.name} />
          )}

        </>)}
      </main>
    </div>
    </SessionGuard>
  )
}

/* ================================================================
   FORMS
   ================================================================ */

/* ── Health Form ── */
function HealthForm({ petId, onSaved, onError }: { petId: string; onSaved: (r: any) => void; onError: (m: string, ok?: boolean) => void }) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate]           = useState(today)
  const [temperature, setTemp]    = useState('')
  const [state, setState]         = useState('')
  const [symptoms, setSymptoms]   = useState<string[]>([])
  const [observations, setObs]    = useState('')
  const [loading, setLoading]     = useState(false)

  function toggleSymptom(s: string) {
    setSymptoms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const sb = createClient()
    const { data, error } = await sb.from('healths').insert({
      pet_id:        petId,
      temperature:   temperature ? parseFloat(temperature) : null,
      general_state: state || null,
      symptoms,
      observations:  observations.trim() || null,
      created_at:    date,
    }).select().single()
    setLoading(false)
    if (error) { onError(error.message, false); return }
    onSaved(data)
  }

  return (
    <form className="sl-form" onSubmit={submit} noValidate>
      <h3 className="sl-form-title">❤️ Nuevo Registro de Salud</h3>

      <div className="sl-form-grid">
        {/* Fecha */}
        <div className="sl-field">
          <label>Fecha *</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} max={today} required />
        </div>
        {/* Temperatura */}
        <div className="sl-field">
          <label>Temperatura (°C)</label>
          <input type="number" step="0.1" min="30" max="45" placeholder="Ej: 38.5" value={temperature} onChange={e => setTemp(e.target.value)} />
        </div>
      </div>

      {/* Estado general */}
      <div className="sl-field">
        <label>Estado general</label>
        <div className="sl-state-grid">
          {GENERAL_STATES.map(s => (
            <button key={s.value} type="button"
              className={`sl-state-btn${state === s.value ? ' sl-state-btn--active' : ''}`}
              style={{ '--state-color': s.color } as any}
              onClick={() => setState(state === s.value ? '' : s.value)}
            >
              <span>{s.emoji}</span>
              <span>{s.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Síntomas */}
      <div className="sl-field">
        <label>Síntomas observados</label>
        <div className="sl-symptom-grid">
          {SYMPTOMS_LIST.map(s => (
            <button key={s} type="button"
              className={`sl-symptom-chip${symptoms.includes(s) ? ' sl-symptom-chip--active' : ''}`}
              onClick={() => toggleSymptom(s)}
            >
              {symptoms.includes(s) && '✓ '}{s}
            </button>
          ))}
        </div>
      </div>

      {/* Observaciones */}
      <div className="sl-field">
        <label>Observaciones adicionales</label>
        <textarea placeholder="Describe cualquier otra observación relevante..." value={observations} onChange={e => setObs(e.target.value)} rows={3} />
      </div>

      <button type="submit" className="sl-btn-submit" disabled={loading}>
        {loading ? <span className="sl-spinner" /> : '💾 '}
        {loading ? 'Guardando...' : 'Guardar registro de salud'}
      </button>
    </form>
  )
}

/* ── Vaccine Form ── */
function VaccineForm({ petId, onSaved, onError }: { petId: string; onSaved: (r: any) => void; onError: (m: string, ok?: boolean) => void }) {
  const [name, setName]             = useState('')
  const [laboratory, setLab]        = useState('')
  const [appliedAt, setApplied]     = useState(new Date().toISOString().split('T')[0])
  const [nextDose, setNextDose]     = useState('')
  const [notes, setNotes]           = useState('')
  const [loading, setLoading]       = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { onError('El nombre de la vacuna es obligatorio.', false); return }
    setLoading(true)
    const sb = createClient()
    const { data, error } = await sb.from('vaccines').insert({
      pet_id: petId, name: name.trim(), laboratory: laboratory.trim() || null,
      applied_at: appliedAt, next_dose_at: nextDose || null, notes: notes.trim() || null,
    }).select().single()
    setLoading(false)
    if (error) { onError(error.message, false); return }
    onSaved(data)
  }

  return (
    <form className="sl-form" onSubmit={submit} noValidate>
      <h3 className="sl-form-title">💉 Registrar Vacuna</h3>
      <div className="sl-form-grid">
        <div className="sl-field sl-field--span2">
          <label>Nombre de la vacuna *</label>
          <input type="text" placeholder="Ej: Rabia, Parvovirus, DHLPP..." value={name} onChange={e => setName(e.target.value)} required autoFocus />
        </div>
        <div className="sl-field">
          <label>Laboratorio</label>
          <input type="text" placeholder="Ej: Nobivac" value={laboratory} onChange={e => setLab(e.target.value)} />
        </div>
        <div className="sl-field">
          <label>Fecha de aplicación *</label>
          <input type="date" value={appliedAt} onChange={e => setApplied(e.target.value)} required />
        </div>
        <div className="sl-field">
          <label>Próxima dosis</label>
          <input type="date" value={nextDose} onChange={e => setNextDose(e.target.value)} min={appliedAt} />
        </div>
        <div className="sl-field">
          <label>Notas</label>
          <input type="text" placeholder="Observaciones del veterinario..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </div>
      <button type="submit" className="sl-btn-submit sl-btn-submit--purple" disabled={loading}>
        {loading ? <span className="sl-spinner" /> : '💾 '}
        {loading ? 'Guardando...' : 'Guardar vacuna'}
      </button>
    </form>
  )
}

/* ── Medication Form ── */
function MedForm({ petId, onSaved, onError }: { petId: string; onSaved: (r: any) => void; onError: (m: string, ok?: boolean) => void }) {
  const [name, setName]         = useState('')
  const [dosage, setDosage]     = useState('')
  const [frequency, setFreq]    = useState('')
  const [startDate, setStart]   = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEnd]       = useState('')
  const [notes, setNotes]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { onError('El nombre del medicamento es obligatorio.', false); return }
    setLoading(true)
    const sb = createClient()
    const { data, error } = await sb.from('medications').insert({
      pet_id: petId, name: name.trim(), dosage: dosage.trim() || null,
      frequency: frequency.trim() || null, start_date: startDate || null,
      end_date: endDate || null, notes: notes.trim() || null,
    }).select().single()
    setLoading(false)
    if (error) { onError(error.message, false); return }
    onSaved(data)
  }

  return (
    <form className="sl-form" onSubmit={submit} noValidate>
      <h3 className="sl-form-title">💊 Registrar Medicamento</h3>
      <div className="sl-form-grid">
        <div className="sl-field sl-field--span2">
          <label>Nombre del medicamento *</label>
          <input type="text" placeholder="Ej: Amoxicilina, Frontline, Omeprazol..." value={name} onChange={e => setName(e.target.value)} required autoFocus />
        </div>
        <div className="sl-field">
          <label>Dosis</label>
          <input type="text" placeholder="Ej: 250mg, 1 tableta" value={dosage} onChange={e => setDosage(e.target.value)} />
        </div>
        <div className="sl-field">
          <label>Frecuencia</label>
          <input type="text" placeholder="Ej: Cada 12 horas, 1 vez al día" value={frequency} onChange={e => setFreq(e.target.value)} />
        </div>
        <div className="sl-field">
          <label>Fecha inicio</label>
          <input type="date" value={startDate} onChange={e => setStart(e.target.value)} />
        </div>
        <div className="sl-field">
          <label>Fecha fin</label>
          <input type="date" value={endDate} onChange={e => setEnd(e.target.value)} min={startDate} />
        </div>
        <div className="sl-field sl-field--span2">
          <label>Notas del veterinario</label>
          <textarea placeholder="Instrucciones especiales, reacciones a monitorear..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
        </div>
      </div>
      <button type="submit" className="sl-btn-submit sl-btn-submit--orange" disabled={loading}>
        {loading ? <span className="sl-spinner" /> : '💾 '}
        {loading ? 'Guardando...' : 'Guardar medicamento'}
      </button>
    </form>
  )
}

/* ================================================================
   RECORD LISTS
   ================================================================ */

function EmptyList({ tab, petName }: { tab: string; petName: string }) {
  return (
    <div className="sl-empty animate-up">
      <div className="sl-empty-icon">{tab === 'salud' ? '❤️' : tab === 'vacunas' ? '💉' : '💊'}</div>
      <h3>Sin registros de {tab}</h3>
      <p>Aún no has registrado {tab === 'salud' ? 'datos de salud' : tab === 'vacunas' ? 'vacunas' : 'medicamentos'} para {petName}.</p>
      <p>Haz clic en <strong>"+ Nuevo registro"</strong> para empezar.</p>
    </div>
  )
}

function HealthList({ records, onDelete, petName }: { records: HealthRecord[]; onDelete: (id: string) => void; petName: string }) {
  if (!records.length) return <EmptyList tab="salud" petName={petName} />
  return (
    <div className="sl-list animate-up">
      {records.map((r, i) => {
        const gs = GENERAL_STATES.find(s => s.value === r.general_state)
        return (
          <div key={r.id} className="sl-record" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="sl-record-left">
              <div className="sl-record-icon sl-record-icon--red">❤️</div>
              <div>
                <div className="sl-record-head">
                  <span className="sl-record-date">{fmt(r.created_at.split('T')[0])}</span>
                  {gs && <span className="sl-record-state" style={{ color: gs.color }}>{gs.emoji} {gs.value}</span>}
                  {r.temperature && <span className="sl-record-chip">🌡 {r.temperature}°C</span>}
                </div>
                {r.symptoms && r.symptoms.length > 0 && (
                  <div className="sl-symptom-tags">
                    {r.symptoms.map(s => <span key={s} className="sl-stag">{s}</span>)}
                  </div>
                )}
                {r.observations && <p className="sl-record-obs">{r.observations}</p>}
              </div>
            </div>
            <button className="sl-record-del" onClick={() => onDelete(r.id)} title="Eliminar">✕</button>
          </div>
        )
      })}
    </div>
  )
}

function VaccineList({ records, onDelete, petName }: { records: Vaccine[]; onDelete: (id: string) => void; petName: string }) {
  if (!records.length) return <EmptyList tab="vacunas" petName={petName} />
  return (
    <div className="sl-list animate-up">
      {records.map((r, i) => (
        <div key={r.id} className="sl-record" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="sl-record-left">
            <div className="sl-record-icon sl-record-icon--purple">💉</div>
            <div>
              <div className="sl-record-head">
                <span className="sl-record-name">{r.name}</span>
                {r.laboratory && <span className="sl-record-chip">{r.laboratory}</span>}
              </div>
              <div className="sl-record-dates">
                <span>Aplicada: {fmt(r.applied_at)}</span>
                {r.next_dose_at && <span>Próxima: {fmt(r.next_dose_at)}</span>}
              </div>
              {r.notes && <p className="sl-record-obs">{r.notes}</p>}
            </div>
          </div>
          <button className="sl-record-del" onClick={() => onDelete(r.id)} title="Eliminar">✕</button>
        </div>
      ))}
    </div>
  )
}

function MedList({ records, onDelete, petName }: { records: Medication[]; onDelete: (id: string) => void; petName: string }) {
  if (!records.length) return <EmptyList tab="medicamentos" petName={petName} />
  return (
    <div className="sl-list animate-up">
      {records.map((r, i) => (
        <div key={r.id} className="sl-record" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="sl-record-left">
            <div className="sl-record-icon sl-record-icon--orange">💊</div>
            <div>
              <div className="sl-record-head">
                <span className="sl-record-name">{r.name}</span>
                {r.dosage && <span className="sl-record-chip">{r.dosage}</span>}
              </div>
              {r.frequency && <p className="sl-record-freq">🔁 {r.frequency}</p>}
              {(r.start_date || r.end_date) && (
                <div className="sl-record-dates">
                  {r.start_date && <span>Inicio: {fmt(r.start_date)}</span>}
                  {r.end_date && <span>Fin: {fmt(r.end_date)}</span>}
                </div>
              )}
              {r.notes && <p className="sl-record-obs">{r.notes}</p>}
            </div>
          </div>
          <button className="sl-record-del" onClick={() => onDelete(r.id)} title="Eliminar">✕</button>
        </div>
      ))}
    </div>
  )
}

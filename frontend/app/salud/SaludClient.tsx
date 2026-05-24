'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import './salud.css'

/* ── Icons (Heroicons outline) ───────────────────────────── */
const IcHeart     = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
const IcSyringe   = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
const IcPill      = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3h8.25m-8.25 3h8.25m0-3a1.5 1.5 0 0 1 0 3m0-3V3.75m0 9.75h2.25m-2.25 0H8.25" /></svg>
const IcCalendar  = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
const IcThermo    = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25V9m7.5 0h-7.5m7.5 0H21m-3.75 0A2.25 2.25 0 0 1 19.5 11.25v1.5a2.25 2.25 0 0 1-2.25 2.25h-10.5A2.25 2.25 0 0 1 4.5 12.75v-1.5A2.25 2.25 0 0 1 6.75 9H3" /></svg>
const IcClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
const IcScale     = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 4.97Z" /></svg>
const IcCheck     = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={40} height={40}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
const IcPlus      = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
const IcX         = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={18} height={18}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

/* ── Types ──────────────────────────────────────────────── */
interface Pet { id: string; name: string; species: string }
type Tab = 'salud' | 'vacunas' | 'medicamentos'

const SYMPTOMS = [
  'Vómitos','Diarrea','Letargo','Falta de apetito','Fiebre',
  'Tos','Estornudos','Lamido excesivo','Pérdida de peso',
  'Ojos llorosos','Rascado intenso','Problemas respiratorios'
]

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
export default function SaludClient({ user, pets }: { user: any; pets: Pet[] }) {
  const [tab, setTab]         = useState<Tab>('salud')
  const [petId, setPetId]     = useState(pets[0]?.id || '')
  const [success, setSuccess] = useState<string | null>(null)
  const [toast, setToast]     = useState<string | null>(null)

  const pet = pets.find(p => p.id === petId) || pets[0]

  function notify(msg: string, ok = true) {
    if (ok) { setSuccess(msg) }
    else { setToast(msg); setTimeout(() => setToast(null), 4000) }
  }

  const TABS = [
    { key: 'salud'        as Tab, label: 'Salud',        Icon: IcHeart },
    { key: 'vacunas'      as Tab, label: 'Vacunas',      Icon: IcSyringe },
    { key: 'medicamentos' as Tab, label: 'Medicamentos', Icon: IcPill },
  ]

  return (
    <SessionGuard>
    <div className="sl-root">
      <Navbar />
      {toast && <div className="sl-toast sl-toast--err"><IcX /> {toast}</div>}

      <div className="sl-split">
        {/* ── LEFT ── */}
        <div className="sl-left">
          <div className="sl-left-inner">

            <div className="sl-page-head">
              <div className="sl-page-head-icon"><IcHeart /></div>
              <div>
                <h1 className="sl-title">Salud</h1>
                <p className="sl-subtitle">{pet ? `Registros de ${pet.name}` : 'Cuida a tu mascota'}</p>
              </div>
            </div>

            {pets.length > 1 && (
              <div className="sl-pet-pills">
                {pets.map(p => (
                  <button key={p.id}
                    className={`sl-pet-pill${p.id === petId ? ' sl-pet-pill--active' : ''}`}
                    onClick={() => { setPetId(p.id); setSuccess(null) }}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {!pet ? (
              <div className="sl-no-pet"><p>No tienes mascotas. <a href="/dashboard">Registra una</a> primero.</p></div>
            ) : success ? (
              <div className="sl-success animate-up">
                <div className="sl-success-check"><IcCheck /></div>
                <h2>¡Guardado!</h2>
                <p>{success}</p>
                <button className="sl-success-btn" onClick={() => setSuccess(null)}>
                  <IcPlus /> Agregar otro registro
                </button>
              </div>
            ) : (<>
              <div className="sl-tabs">
                {TABS.map(t => (
                  <button key={t.key}
                    className={`sl-tab${tab === t.key ? ' sl-tab--active' : ''}`}
                    onClick={() => setTab(t.key)}>
                    <t.Icon />{t.label}
                  </button>
                ))}
              </div>

              {tab === 'salud'        && <HealthForm   petId={petId} onSaved={notify} onError={m => notify(m, false)} />}
              {tab === 'vacunas'      && <VaccineForm  petId={petId} onSaved={notify} onError={m => notify(m, false)} />}
              {tab === 'medicamentos' && <MedForm      petId={petId} onSaved={notify} onError={m => notify(m, false)} />}
            </>)}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="sl-right">
          <div className="sl-right-overlay">
            <Image src="/images/medical-pet.png" alt="Mascota en veterinaria"
              fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
            <div className="sl-right-content">
              <h2>La salud de tu mascota,<br /><span>en tus manos</span></h2>
              <p>Registra síntomas, vacunas y medicamentos en un solo lugar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SessionGuard>
  )
}

/* ================================================================
   HEALTH FORM — Inserta en health_records via wellness_history
   Schema: health_records { id, wellness_history_id, temperature,
                             weight, symptoms, observations }
   ================================================================ */
function HealthForm({ petId, onSaved, onError }: { petId: string; onSaved: (m: string) => void; onError: (m: string) => void }) {
  const today = new Date().toISOString().split('T')[0]
  const [temp, setTemp]         = useState('')
  const [weight, setWeight]     = useState('')
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [obs, setObs]           = useState('')
  const [loading, setLoading]   = useState(false)

  function toggle(s: string) { setSymptoms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const wellnessId = await getOrCreateWellnessHistory(petId)
    if (!wellnessId) { onError('No se pudo inicializar el historial de bienestar.'); setLoading(false); return }

    const { error } = await createClient().from('health_records').insert({
      wellness_history_id: wellnessId,
      temperature:  temp   ? parseFloat(temp)   : null,
      weight:       weight ? parseFloat(weight)  : null,
      symptoms,
      observations: obs.trim() || null,
    })
    setLoading(false)
    if (error) { onError(error.message); return }
    onSaved('Registro de salud guardado correctamente.')
  }

  return (
    <form className="sl-form" onSubmit={submit}>
      <div className="sl-form-grid">
        <div className="sl-field">
          <label><IcThermo /> Temperatura (°C)</label>
          <input type="number" step="0.1" min="30" max="45" placeholder="38.5" value={temp} onChange={e => setTemp(e.target.value)} />
        </div>
        <div className="sl-field">
          <label><IcScale /> Peso (kg)</label>
          <input type="number" step="0.1" min="0" placeholder="4.5" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
      </div>
      <div className="sl-field">
        <label><IcClipboard /> Síntomas observados</label>
        <div className="sl-chips">
          {SYMPTOMS.map(s => (
            <button key={s} type="button"
              className={`sl-chip${symptoms.includes(s) ? ' sl-chip--on' : ''}`}
              onClick={() => toggle(s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="sl-field">
        <label><IcClipboard /> Observaciones</label>
        <textarea rows={3} placeholder="Notas adicionales..." value={obs} onChange={e => setObs(e.target.value)} />
      </div>
      <button type="submit" className="sl-btn-submit" disabled={loading}>
        {loading && <span className="sl-spinner" />}
        {loading ? 'Guardando...' : 'Guardar registro de salud'}
      </button>
    </form>
  )
}

/* ================================================================
   VACCINE FORM — Inserta en vaccines via health_record
   Schema: vaccines { id, health_record_id, name, laboratory,
                      applied_at, next_dose_at, notes }
   ================================================================ */
function VaccineForm({ petId, onSaved, onError }: { petId: string; onSaved: (m: string) => void; onError: (m: string) => void }) {
  const [name, setName]       = useState('')
  const [lab, setLab]         = useState('')
  const [applied, setApplied] = useState(new Date().toISOString().split('T')[0])
  const [next, setNext]       = useState('')
  const [notes, setNotes]     = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { onError('El nombre de la vacuna es obligatorio.'); return }
    setLoading(true)

    // 1. Obtener o crear wellness_history
    const wellnessId = await getOrCreateWellnessHistory(petId)
    if (!wellnessId) { onError('No se pudo inicializar el historial.'); setLoading(false); return }

    // 2. Crear health_record para asociar la vacuna
    const { data: hr, error: hrErr } = await createClient()
      .from('health_records')
      .insert({ wellness_history_id: wellnessId })
      .select('id')
      .single()

    if (hrErr) { onError(hrErr.message); setLoading(false); return }

    // 3. Crear la vacuna
    const { error } = await createClient().from('vaccines').insert({
      health_record_id: hr.id,
      name:         name.trim(),
      laboratory:   lab.trim()  || null,
      applied_at:   applied,
      next_dose_at: next        || null,
      notes:        notes.trim() || null,
    })
    setLoading(false)
    if (error) { onError(error.message); return }
    onSaved('Vacuna registrada correctamente.')
  }

  return (
    <form className="sl-form" onSubmit={submit}>
      <div className="sl-field sl-field--full">
        <label>Nombre de la vacuna *</label>
        <input type="text" placeholder="Ej: Rabia, Parvovirus, DHLPP..." value={name}
          onChange={e => setName(e.target.value)} required autoFocus />
      </div>
      <div className="sl-form-grid">
        <div className="sl-field">
          <label>Laboratorio</label>
          <input type="text" placeholder="Ej: Nobivac" value={lab} onChange={e => setLab(e.target.value)} />
        </div>
        <div className="sl-field">
          <label><IcCalendar /> Fecha de aplicación *</label>
          <input type="date" value={applied} onChange={e => setApplied(e.target.value)} required />
        </div>
        <div className="sl-field">
          <label><IcCalendar /> Próxima dosis</label>
          <input type="date" value={next} onChange={e => setNext(e.target.value)} min={applied} />
        </div>
        <div className="sl-field">
          <label>Notas</label>
          <input type="text" placeholder="Observaciones..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </div>
      <button type="submit" className="sl-btn-submit sl-btn-submit--purple" disabled={loading}>
        {loading && <span className="sl-spinner" />}
        {loading ? 'Guardando...' : 'Guardar vacuna'}
      </button>
    </form>
  )
}

/* ================================================================
   MEDICATION FORM — Inserta en medications via health_record
   Schema: medications { id, health_record_id, name, dosage,
                          frequency, start_date, end_date, notes }
   ================================================================ */
function MedForm({ petId, onSaved, onError }: { petId: string; onSaved: (m: string) => void; onError: (m: string) => void }) {
  const [name, setName]       = useState('')
  const [dosage, setDosage]   = useState('')
  const [freq, setFreq]       = useState('')
  const [start, setStart]     = useState(new Date().toISOString().split('T')[0])
  const [end, setEnd]         = useState('')
  const [notes, setNotes]     = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { onError('El nombre del medicamento es obligatorio.'); return }
    setLoading(true)

    // 1. Obtener o crear wellness_history
    const wellnessId = await getOrCreateWellnessHistory(petId)
    if (!wellnessId) { onError('No se pudo inicializar el historial.'); setLoading(false); return }

    // 2. Crear health_record para asociar el medicamento
    const { data: hr, error: hrErr } = await createClient()
      .from('health_records')
      .insert({ wellness_history_id: wellnessId })
      .select('id')
      .single()

    if (hrErr) { onError(hrErr.message); setLoading(false); return }

    // 3. Crear el medicamento
    const { error } = await createClient().from('medications').insert({
      health_record_id: hr.id,
      name:       name.trim(),
      dosage:     dosage.trim()  || null,
      frequency:  freq.trim()    || null,
      start_date: start          || null,
      end_date:   end            || null,
      notes:      notes.trim()   || null,
    })
    setLoading(false)
    if (error) { onError(error.message); return }
    onSaved('Medicamento guardado correctamente.')
  }

  return (
    <form className="sl-form" onSubmit={submit}>
      <div className="sl-field sl-field--full">
        <label>Nombre del medicamento *</label>
        <input type="text" placeholder="Ej: Amoxicilina, Frontline..." value={name}
          onChange={e => setName(e.target.value)} required autoFocus />
      </div>
      <div className="sl-form-grid">
        <div className="sl-field">
          <label>Dosis</label>
          <input type="text" placeholder="Ej: 250mg" value={dosage} onChange={e => setDosage(e.target.value)} />
        </div>
        <div className="sl-field">
          <label>Frecuencia</label>
          <input type="text" placeholder="Ej: Cada 12 horas" value={freq} onChange={e => setFreq(e.target.value)} />
        </div>
        <div className="sl-field">
          <label><IcCalendar /> Fecha inicio</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div className="sl-field">
          <label><IcCalendar /> Fecha fin</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} min={start} />
        </div>
        <div className="sl-field sl-field--full">
          <label>Notas</label>
          <textarea rows={2} placeholder="Instrucciones del veterinario..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </div>
      <button type="submit" className="sl-btn-submit sl-btn-submit--orange" disabled={loading}>
        {loading && <span className="sl-spinner" />}
        {loading ? 'Guardando...' : 'Guardar medicamento'}
      </button>
    </form>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import './historial.css'

/* ── Icons (Heroicons outline) ───────────────────────────── */
const IcBook      = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3.043.512m15.086 2.238A9.005 9.005 0 0 1 21 12a9 9 0 0 1-9 9m0 0a9 9 0 0 1-9-9m9 9c1.995 0 3.823-.212 5.633-.643m15.088-2.649A9.01 9.01 0 0 0 12 3.75a9 9 0 0 0-9 9 9 9 0 0 0 .112 1.642m18.657-5.209a.75.75 0 1 0-1.08-1.084l-.5.5a.75.75 0 0 0 1.08 1.084l.5-.5z" /></svg>
const IcFood      = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 16.5V12M9 16.5V12m4.5 4.5H18a.75.75 0 0 0 .75-.75v-9a.75.75 0 0 0-.75-.75H6a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h4.5Z" /></svg>
const IcActivity  = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M9.4 18.6l-8.3-8.3a4.5 4.5 0 1 1 6.4-6.4l1.9 1.9m0 0l8.3 8.3a4.5 4.5 0 1 1-6.4 6.4l-1.9-1.9" /></svg>
const IcHealth    = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
const IcX         = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={18} height={18}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

interface Pet { id: string; name: string; species: string }

export default function HistorialClient({ user, pets }: { user: any; pets: Pet[] }) {
  const [petId, setPetId]        = useState(pets[0]?.id || '')
  const [activeTab, setActiveTab] = useState<'feeding' | 'activity' | 'health'>('feeding')
  const [toast, setToast]         = useState<string | null>(null)

  const pet = pets.find(p => p.id === petId) || pets[0]

  return (
    <SessionGuard>
    <div className="his-root">
      <Navbar />
      {toast && <div className="his-toast his-toast--err"><IcX /> {toast}</div>}

      <div className="his-container">
        <div className="his-header">
          <div className="his-title-section">
            <div className="his-icon"><IcBook /></div>
            <div>
              <h1 className="his-title">Historial de bienestar</h1>
              <p className="his-subtitle">{pet ? `Registro completo de ${pet.name}` : 'Historial de tu mascota'}</p>
            </div>
          </div>

          {pets.length > 1 && (
            <div className="his-pet-selector">
              <label>Mascota:</label>
              <select value={petId} onChange={e => setPetId(e.target.value)}>
                {pets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {!pet ? (
          <div className="his-no-pet">
            <p>No tienes mascotas. <a href="/dashboard">Registra una</a> primero.</p>
          </div>
        ) : (
          <>
            <div className="his-tabs">
              <button
                className={`his-tab${activeTab === 'feeding' ? ' his-tab--active' : ''}`}
                onClick={() => setActiveTab('feeding')}>
                <IcFood /> Alimentación
              </button>
              <button
                className={`his-tab${activeTab === 'activity' ? ' his-tab--active' : ''}`}
                onClick={() => setActiveTab('activity')}>
                <IcActivity /> Actividad
              </button>
              <button
                className={`his-tab${activeTab === 'health' ? ' his-tab--active' : ''}`}
                onClick={() => setActiveTab('health')}>
                <IcHealth /> Salud
              </button>
            </div>

            <div className="his-content">
              {activeTab === 'feeding' && <FeedingHistoryView petId={petId} />}
              {activeTab === 'activity' && <ActivityHistoryView petId={petId} />}
              {activeTab === 'health' && <HealthHistoryView petId={petId} />}
            </div>
          </>
        )}
      </div>
    </div>
    </SessionGuard>
  )
}

/* ================================================================
   FEEDING HISTORY VIEW
   ================================================================ */
function FeedingHistoryView({ petId }: { petId: string }) {
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
        .from('feeding_records')
        .select('*')
        .eq('wellness_history_id', wh.id)
        .order('created_at', { ascending: false })

      setRecords(data || [])
      setLoading(false)
    })()
  }, [petId, supabase])

  if (loading) return <div className="his-loading">Cargando registros...</div>
  if (records.length === 0)
    return <div className="his-empty">No hay registros de alimentación.</div>

  return (
    <div className="his-records">
      {records.map(r => (
        <div key={r.id} className="his-record-card">
          <div className="his-record-header">
            <span className="his-record-types">{r.food_type?.join(', ') || 'Sin tipo'}</span>
            <span className="his-record-date">
              {new Date(r.created_at).toLocaleDateString('es-ES', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
          <div className="his-record-grid">
            {r.food_brand && <div><strong>Marca:</strong> {r.food_brand}</div>}
            {r.amount && <div><strong>Cantidad:</strong> {r.amount}g</div>}
            {r.schedule && <div><strong>Horario:</strong> {r.schedule}</div>}
            {r.frequency && <div><strong>Frecuencia:</strong> {r.frequency}x día</div>}
            {r.observations && <div className="his-full-width"><strong>Observaciones:</strong> {r.observations}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ================================================================
   ACTIVITY HISTORY VIEW
   ================================================================ */
function ActivityHistoryView({ petId }: { petId: string }) {
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

  if (loading) return <div className="his-loading">Cargando registros...</div>
  if (records.length === 0)
    return <div className="his-empty">No hay registros de actividad.</div>

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
    <div className="his-records">
      <div className="his-stats">
        <div className="his-stat">
          <div className="his-stat-label">Sesiones totales</div>
          <div className="his-stat-value">{totalSessions}</div>
        </div>
        <div className="his-stat">
          <div className="his-stat-label">Minutos totales</div>
          <div className="his-stat-value">{totalMinutes}</div>
        </div>
        <div className="his-stat">
          <div className="his-stat-label">Calorías totales</div>
          <div className="his-stat-value">{totalCalories.toFixed(1)}</div>
        </div>
      </div>

      {records.map(r => {
        const intensityMatch = r.observations?.match(/Intensidad: (\w+)/)
        const intensity = intensityMatch ? intensityMatch[1] : '-'

        return (
          <div key={r.id} className="his-record-card">
            <div className="his-record-header">
              <span className="his-record-types">{r.activity_type}</span>
              <span className="his-record-date">
                {new Date(r.created_at).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
            <div className="his-record-grid">
              <div><strong>Duración:</strong> {r.duration}</div>
              <div><strong>Intensidad:</strong> {intensity}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ================================================================
   HEALTH HISTORY VIEW
   ================================================================ */
function HealthHistoryView({ petId }: { petId: string }) {
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
        .from('health_records')
        .select('*')
        .eq('wellness_history_id', wh.id)
        .order('created_at', { ascending: false })

      setRecords(data || [])
      setLoading(false)
    })()
  }, [petId, supabase])

  if (loading) return <div className="his-loading">Cargando registros...</div>
  if (records.length === 0)
    return <div className="his-empty">No hay registros de salud.</div>

  return (
    <div className="his-records">
      {records.map(r => (
        <div key={r.id} className="his-record-card">
          <div className="his-record-header">
            <span className="his-record-types">Revisión de salud</span>
            <span className="his-record-date">
              {new Date(r.created_at).toLocaleDateString('es-ES', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
          <div className="his-record-grid">
            {r.weight && <div><strong>Peso:</strong> {r.weight}kg</div>}
            {r.temperature && <div><strong>Temperatura:</strong> {r.temperature}°C</div>}
            {r.symptoms && r.symptoms.length > 0 && (
              <div className="his-full-width">
                <strong>Síntomas:</strong> {r.symptoms.join(', ')}
              </div>
            )}
            {r.observations && <div className="his-full-width"><strong>Observaciones:</strong> {r.observations}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

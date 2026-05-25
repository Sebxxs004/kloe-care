'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import './bienestar.css'

/* ── Icons (Heroicons outline) ───────────────────────────── */
const IcWellness  = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
const IcTrendUp   = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.04 11.04 0 015.06.2l5.858-5.858a.75.75 0 111.06 1.06l-5.858 5.858a11.04 11.04 0 01.2 5.06L21 21" /></svg>
const IcX         = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={18} height={18}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
const IcAlertOctagon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
const IcInfoCircle = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25.75 2.25M12 12c.75 0 1.5-.25 2.06-.75l8.44-8.44" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75v2.25M9 21h6a2.25 2.25 0 0 0 2.25-2.25v-6a2.25 2.25 0 0 0-2.25-2.25H9a2.25 2.25 0 0 0-2.25 2.25v6A2.25 2.25 0 0 0 9 21z" /></svg>

interface Pet { id: string; name: string; species: string }
interface Alert {
  type: 'danger' | 'warning' | 'info'
  message: string
}

interface WellnessScore {
  feeding: number
  activity: number
  health: number
  overall: number
  label: string
}

interface WellnessData {
  feedingCount: number
  activityCount: number
  healthCount: number
  totalCalories: number
  alerts: Alert[]
}

export default function BienestarClient({ user, pets }: { user: any; pets: Pet[] }) {
  const [petId, setPetId]        = useState(pets[0]?.id || '')
  const [data, setData]          = useState<WellnessData | null>(null)
  const [score, setScore]        = useState<WellnessScore | null>(null)
  const [loading, setLoading]    = useState(true)

  const pet = pets.find(p => p.id === petId) || pets[0]

  useEffect(() => {
    if (!petId) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetchWellnessData(petId)
  }, [petId])

  async function fetchWellnessData(petId: string) {
    const supabase = createClient()

    const { data: wh } = await supabase
      .from('wellness_histories')
      .select('id')
      .eq('pet_id', petId)
      .maybeSingle()

    if (!wh) {
      setData({
        feedingCount: 0,
        activityCount: 0,
        healthCount: 0,
        totalCalories: 0,
        alerts: [],
      })
      setScore({
        feeding: 0,
        activity: 0,
        health: 0,
        overall: 0,
        label: 'Sin registros',
      })
      setLoading(false)
      return
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch feeding records
    const { data: feedingRecords } = await supabase
      .from('feeding_records')
      .select('*')
      .eq('wellness_history_id', wh.id)

    // Fetch activity records
    const { data: activityRecords } = await supabase
      .from('activities')
      .select('*')
      .eq('wellness_history_id', wh.id)

    // Fetch health records
    const { data: healthRecords } = await supabase
      .from('health_records')
      .select('*')
      .eq('wellness_history_id', wh.id)

    // Count last 7 days
    const feedingLast7 = feedingRecords?.filter(r =>
      new Date(r.created_at) >= sevenDaysAgo
    ).length || 0

    const activityLast7 = activityRecords?.filter(r =>
      new Date(r.created_at) >= sevenDaysAgo
    ).length || 0

    const healthLast30 = healthRecords?.filter(r =>
      new Date(r.created_at) >= thirtyDaysAgo
    ).length || 0

    // Calculate scores
    const feedingScore = Math.min(feedingLast7 * 20, 100)
    const activityScore = Math.min(activityLast7 * 25, 100)
    const healthScore = Math.min(healthLast30 * 34, 100)
    const overallScore = (feedingScore + activityScore + healthScore) / 3

    // Calculate total calories
    const totalCalories = activityRecords?.reduce((sum, r) => {
      const calMatch = r.observations?.match(/Calorías estimadas: ([\d.]+)/)
      const cals = calMatch ? parseFloat(calMatch[1]) : 0
      return sum + cals
    }, 0) || 0

    // Determine label
    let label = 'Necesita atención'
    if (overallScore >= 75) label = 'Excelente'
    else if (overallScore >= 45) label = 'Regular'

    // Calculate alerts
    const alerts = calculateAlerts(healthRecords || [], feedingRecords || [], activityRecords || [], sevenDaysAgo)

    setData({
      feedingCount: feedingRecords?.length || 0,
      activityCount: activityRecords?.length || 0,
      healthCount: healthRecords?.length || 0,
      totalCalories,
      alerts,
    })

    setScore({
      feeding: feedingScore,
      activity: activityScore,
      health: healthScore,
      overall: overallScore,
      label,
    })

    setLoading(false)
  }

  return (
    <SessionGuard>
    <div className="bw-root">
      <Navbar />

      <div className="bw-container">
        <div className="bw-header">
          <div className="bw-title-section">
            <div className="bw-icon"><IcWellness /></div>
            <div>
              <h1 className="bw-title">Estado de bienestar</h1>
              <p className="bw-subtitle">{pet ? `Salud integral de ${pet.name}` : 'Estado de tu mascota'}</p>
            </div>
          </div>

          {pets.length > 1 && (
            <div className="bw-pet-selector">
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
          <div className="bw-no-pet">
            <p>No tienes mascotas. <a href="/dashboard">Registra una</a> primero.</p>
          </div>
        ) : loading ? (
          <div className="bw-loading">Calculando estado de bienestar...</div>
        ) : score ? (
          <>
            {/* Alerts */}
            {data?.alerts && data.alerts.length > 0 && (
              <div className="bw-alerts">
                {data.alerts.map((alert, idx) => (
                  <div key={idx} className={`bw-alert bw-alert--${alert.type}`}>
                    <span className="bw-alert-icon">
                      {alert.type === 'danger' && <IcAlertOctagon />}
                      {alert.type === 'warning' && <IcAlertOctagon />}
                      {alert.type === 'info' && <IcInfoCircle />}
                    </span>
                    <span className="bw-alert-message">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Overall score */}
            <div className="bw-overall">
              <div className="bw-overall-content">
                <div className="bw-overall-score">{Math.round(score.overall)}</div>
                <div className="bw-overall-label">{score.label}</div>
              </div>
              <div className="bw-overall-bar">
                <div
                  className="bw-overall-bar-fill"
                  style={{
                    width: `${score.overall}%`,
                    backgroundColor: getColorByScore(score.overall),
                  }}
                />
              </div>
            </div>

            {/* Area breakdown */}
            <div className="bw-areas">
              <div className="bw-area-card">
                <h3 className="bw-area-title">Alimentación</h3>
                <div className="bw-area-score">{Math.round(score.feeding)}</div>
                <div className="bw-area-bar">
                  <div
                    className="bw-area-bar-fill"
                    style={{
                      width: `${score.feeding}%`,
                      backgroundColor: getColorByScore(score.feeding),
                    }}
                  />
                </div>
                <div className="bw-area-detail">{data?.feedingCount} registros</div>
              </div>

              <div className="bw-area-card">
                <h3 className="bw-area-title">Actividad</h3>
                <div className="bw-area-score">{Math.round(score.activity)}</div>
                <div className="bw-area-bar">
                  <div
                    className="bw-area-bar-fill"
                    style={{
                      width: `${score.activity}%`,
                      backgroundColor: getColorByScore(score.activity),
                    }}
                  />
                </div>
                <div className="bw-area-detail">{data?.activityCount} sesiones</div>
              </div>

              <div className="bw-area-card">
                <h3 className="bw-area-title">Salud</h3>
                <div className="bw-area-score">{Math.round(score.health)}</div>
                <div className="bw-area-bar">
                  <div
                    className="bw-area-bar-fill"
                    style={{
                      width: `${score.health}%`,
                      backgroundColor: getColorByScore(score.health),
                    }}
                  />
                </div>
                <div className="bw-area-detail">{data?.healthCount} registros</div>
              </div>
            </div>

            {/* Summary */}
            <div className="bw-summary">
              <h3 className="bw-summary-title">Resumen</h3>
              <div className="bw-summary-grid">
                <div className="bw-summary-item">
                  <span className="bw-summary-label">Total de registros de alimentación</span>
                  <span className="bw-summary-value">{data?.feedingCount}</span>
                </div>
                <div className="bw-summary-item">
                  <span className="bw-summary-label">Total de sesiones de actividad</span>
                  <span className="bw-summary-value">{data?.activityCount}</span>
                </div>
                <div className="bw-summary-item">
                  <span className="bw-summary-label">Calorías totales quemadas</span>
                  <span className="bw-summary-value">{data?.totalCalories.toFixed(1)}</span>
                </div>
                <div className="bw-summary-item">
                  <span className="bw-summary-label">Total de revisiones de salud</span>
                  <span className="bw-summary-value">{data?.healthCount}</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
    </SessionGuard>
  )
}

function getColorByScore(score: number): string {
  if (score >= 75) return '#22C55E' // Green
  if (score >= 45) return '#EAB308' // Yellow
  return '#EF4444' // Red
}

function calculateAlerts(healthRecords: any[], feedingRecords: any[], activityRecords: any[], sevenDaysAgo: Date): Alert[] {
  const alerts: Alert[] = []

  // Temperature alerts
  if (healthRecords.length > 0) {
    const latestHealth = healthRecords[healthRecords.length - 1]
    if (latestHealth.temperature) {
      if (latestHealth.temperature > 39.5) {
        alerts.push({
          type: 'danger',
          message: `Temperatura elevada: ${latestHealth.temperature}°C (normal: 37.5–39.5°C)`,
        })
      } else if (latestHealth.temperature < 37.5) {
        alerts.push({
          type: 'danger',
          message: `Temperatura baja: ${latestHealth.temperature}°C (normal: 37.5–39.5°C)`,
        })
      }
    }

    // Weight change alert
    if (healthRecords.length >= 2) {
      const latest = healthRecords[healthRecords.length - 1]
      const previous = healthRecords[healthRecords.length - 2]
      if (latest.weight && previous.weight) {
        const weightChange = Math.abs(latest.weight - previous.weight)
        const percentChange = (weightChange / previous.weight) * 100
        if (percentChange > 10) {
          alerts.push({
            type: 'warning',
            message: `Cambio de peso importante: ${percentChange.toFixed(1)}% (de ${previous.weight}kg a ${latest.weight}kg)`,
          })
        }
      }
    }
  }

  // Feeding alert
  const feedingLast3Days = feedingRecords.filter(r =>
    new Date(r.created_at) >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  )
  if (feedingRecords.length > 0 && feedingLast3Days.length === 0) {
    alerts.push({
      type: 'warning',
      message: 'Sin registros de alimentación en 3+ días',
    })
  }

  // Activity alert
  const activityLast7Days = activityRecords.filter(r =>
    new Date(r.created_at) >= sevenDaysAgo
  )
  if (activityRecords.length > 0 && activityLast7Days.length === 0) {
    alerts.push({
      type: 'info',
      message: 'Sin actividad registrada en 7+ días',
    })
  }

  return alerts
}

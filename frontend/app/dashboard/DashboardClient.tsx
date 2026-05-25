'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import RegisterPetModal from './RegisterPetModal'
import SessionGuard from '../components/SessionGuard'
import {
  IconHeart, IconDrumstick, IconLightning, IconPerson, IconPaw,
  IconHome, IconSparkles, IconChart, IconScale, IconCalendar,
  IconMale, IconFemale, IconPlus, SPECIES_ICONS
} from '../components/Icons'
import {
  buildPetRecommendations,
  type DashboardRecommendationState,
  type RecommendationIcon,
  type RecommendationTone,
} from './recommendations'
import './dashboard.css'

interface Pet {
  id: string; name: string; species: string; breed?: string
  weight?: number; gender?: string[]; birth_date?: string
  auth_owner_id: string; created_at: string
}
interface WellnessRecord { id: string; general_notes: string; pet_id: string; created_at: string }
interface Props { user: User; pets: Pet[]; initialWellness: WellnessRecord[] }

const RECOMMENDATION_TONES: Record<DashboardRecommendationState['statusTone'], string> = {
  critical: 'var(--red, #EF4444)',
  warning: 'var(--orange, #F97316)',
  info: 'var(--green, #16A34A)',
  success: 'var(--green-dark, #15803D)',
}

const RECOMMENDATION_META: Record<RecommendationTone, { label: string; color: string }> = {
  critical: { label: 'Crítica', color: '#DC2626' },
  warning: { label: 'Advertencia', color: '#D97706' },
  info: { label: 'Normal', color: '#16A34A' },
  success: { label: 'Positiva', color: '#15803D' },
}

function getAge(d?: string) {
  if (!d) return null
  const m = (new Date().getFullYear() - new Date(d).getFullYear()) * 12 + (new Date().getMonth() - new Date(d).getMonth())
  if (m < 1) return 'Recién nacido'
  if (m < 12) return `${m} mes${m > 1 ? 'es' : ''}`
  const y = Math.floor(m / 12); return `${y} año${y > 1 ? 's' : ''}`
}

function calcScore(pet: Pet, w: WellnessRecord[]) {
  let s = 0
  if (pet.name) s += 20; if (pet.species) s += 15; if (pet.breed) s += 15
  if (pet.weight) s += 20; if (pet.birth_date) s += 15; if (w.length > 0) s += 15
  return s
}
function scoreColor(s: number) { return s >= 80 ? 'var(--green)' : s >= 50 ? 'var(--orange)' : '#EF4444' }
function scoreLabel(s: number) { return s >= 80 ? 'Excelente' : s >= 60 ? 'Bueno' : s >= 40 ? 'Regular' : 'Bajo' }

function getRecs(pet: Pet, w: WellnessRecord[]) {
  const r: string[] = []
  if (!pet.weight)     r.push(`Registra el peso de ${pet.name} para mejor seguimiento.`)
  if (!pet.birth_date) r.push('Agrega la fecha de nacimiento para alertas de vacunas.')
  if (!pet.breed)      r.push(`Indica la raza de ${pet.name} para recomendaciones personalizadas.`)
  if (w.length === 0)  r.push('Agrega un registro de salud para monitorear su bienestar.')
  if (!r.length) {
    r.push('Perfil completo. Considera registrar la próxima visita veterinaria.')
    r.push('Mantén actualizados los datos de peso mensualmente.')
  }
  return r.slice(0, 3)
}

function getName(u: User) {
  return ((u.user_metadata?.full_name || u.user_metadata?.name || u.email || 'Usuario') as string).split(' ')[0]
}
function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
}

export default function DashboardClient({ user, pets: initPets, initialWellness }: Props) {
  const [pets, setPets]         = useState<Pet[]>(initPets)
  const [petIdx, setPetIdx]     = useState(0)
  const [wellness]              = useState(initialWellness)
  const [showReg, setShowReg]   = useState(initPets.length === 0)
  const [animated, setAnimated] = useState(0)
  const [recommendations, setRecommendations] = useState<DashboardRecommendationState | null>(null)
  const [recsLoading, setRecsLoading] = useState(false)

  const pet    = pets[petIdx] || null
  const score  = pet ? calcScore(pet, wellness) : 0
  const color  = scoreColor(score)
  const hasData = wellness.length > 0 || !!pet?.weight

  useEffect(() => {
    if (!pet) return
    let cur = 0; const step = score / 40
    const t = setInterval(() => {
      cur += step
      if (cur >= score) { setAnimated(score); clearInterval(t) }
      else setAnimated(Math.floor(cur))
    }, 16)
    return () => clearInterval(t)
  }, [petIdx, score, pet])

  useEffect(() => {
    if (!pet) {
      setRecommendations(null)
      return
    }

    let cancelled = false

    async function loadRecommendations() {
      setRecsLoading(true)

      const supabase = createClient()
      const { data: wellnessHistory, error: wellnessError } = await supabase
        .from('wellness_histories')
        .select('id')
        .eq('pet_id', pet.id)
        .maybeSingle()

      if (cancelled) return

      if (wellnessError) {
        console.error('Error loading wellness history for recommendations:', wellnessError)
        setRecommendations({
          statusLabel: 'Sin datos',
          statusTone: 'warning',
          summary: `No pudimos analizar las recomendaciones de ${pet.name} en este momento.`,
          recommendations: ['Revisa la conexión con Supabase y vuelve a abrir el dashboard.'],
        })
        setRecsLoading(false)
        return
      }

      if (!wellnessHistory) {
        setRecommendations(buildPetRecommendations({
          petName: pet.name,
          healthRecords: [],
          feedingRecords: [],
          activityRecords: [],
        }))
        setRecsLoading(false)
        return
      }

      const [healthResult, feedingResult, activityResult] = await Promise.all([
        supabase
          .from('health_records')
          .select('id, temperature, weight, symptoms, created_at')
          .eq('wellness_history_id', wellnessHistory.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('feeding_records')
          .select('id, frequency, created_at')
          .eq('wellness_history_id', wellnessHistory.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('activities')
          .select('id, duration, created_at')
          .eq('wellness_history_id', wellnessHistory.id)
          .order('created_at', { ascending: false })
          .limit(10),
      ])

      if (cancelled) return

      const queryError = healthResult.error || feedingResult.error || activityResult.error
      if (queryError) {
        console.error('Error loading recommendation data:', queryError)
        setRecommendations({
          statusLabel: 'Sin datos',
          statusTone: 'warning',
          summary: `No pudimos leer todo el historial de ${pet.name}.`,
          recommendations: ['Intenta recargar la página para volver a analizar las recomendaciones.'],
        })
        setRecsLoading(false)
        return
      }

      setRecommendations(buildPetRecommendations({
        petName: pet.name,
        healthRecords: healthResult.data || [],
        feedingRecords: feedingResult.data || [],
        activityRecords: activityResult.data || [],
      }))
      setRecsLoading(false)
    }

    loadRecommendations().catch(error => {
      console.error('Unexpected recommendation error:', error)
      if (!cancelled) {
        setRecommendations({
          statusLabel: 'Sin datos',
          statusTone: 'warning',
          summary: `No pudimos cargar las recomendaciones de ${pet.name}.`,
          recommendations: ['Vuelve a intentarlo en unos segundos.'],
        })
        setRecsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [pet?.id, pet?.name])

  return (
    <SessionGuard>
    <div className="dash-root">
      <Navbar />
      {showReg && <RegisterPetModal userId={user.id} hasPets={pets.length > 0} onClose={() => setShowReg(false)} onSuccess={p => { setPets(v => [...v, p]); setShowReg(false) }} />}

      <main className="dash-main">

        {/* ── Greeting ── */}
        <header className="dash-header animate-up">
          <div>
            <h1>{greeting()}, <span className="dash-username">{getName(user)}</span></h1>
            <p className="dash-subtitle">
              {pets.length === 0
                ? 'Registra tu primera mascota para empezar'
                : `${pets.length} mascota${pets.length > 1 ? 's' : ''} registrada${pets.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="dash-avatar">{getName(user).charAt(0).toUpperCase()}</div>
        </header>

        {pet ? (<>
          {/* Pet selector */}
          {pets.length > 1 && (
            <div className="dash-pet-selector animate-up">
              {pets.map((p, i) => (
                <button key={p.id} className={`dash-pet-pill${i === petIdx ? ' dash-pet-pill--active' : ''}`} onClick={() => setPetIdx(i)}>
                  <span className="dash-pet-pill-ico">{SPECIES_ICONS[p.species] || <IconPaw size={14} />}</span>
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {/* ── 2-col grid ── */}
          <div className="dash-grid">

            {/* Pet card */}
            <div className="dash-area-pet dash-pet-card animate-up">
              <div className="dash-pet-card-orb dash-pet-card-orb--1" />
              <div className="dash-pet-card-orb dash-pet-card-orb--2" />
              <div className="dash-pet-card-top">
                <span className="dash-pet-big-ico">
                  {SPECIES_ICONS[pet.species] || <IconPaw size={52} />}
                </span>
                <div>
                  <h2 className="dash-pet-name">{pet.name}</h2>
                  <p className="dash-pet-meta">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                </div>
              </div>
              <div className="dash-pet-chips">
                {pet.gender?.[0] && (
                  <span className="dash-chip">
                    {pet.gender[0] === 'Macho' ? <IconMale size={13} /> : <IconFemale size={13} />}
                    {pet.gender[0]}
                  </span>
                )}
                {pet.birth_date  && <span className="dash-chip"><IconCalendar size={12} /> {getAge(pet.birth_date)}</span>}
                {pet.weight      && <span className="dash-chip"><IconScale size={12} /> {pet.weight} kg</span>}
              </div>
              <Link href="/salud" className="dash-pet-cta">
                Ver historial de salud
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            </div>

            {/* Wellness */}
            <div className="dash-area-wellness dash-card animate-up" style={{ animationDelay: '0.1s' }}>
              <div className="dash-card-head">
                <span className="dash-card-icon"><IconHeart size={18} /></span>
                <h3>Bienestar General</h3>
                <span className="dash-score-badge" style={{ background: color }}>{scoreLabel(score)}</span>
              </div>
              {!hasData ? (
                <div className="dash-empty-state">
                  <IconChart size={32} />
                  <p>Completa el perfil de {pet.name} para ver su bienestar.</p>
                  <Link href="/salud" className="dash-empty-link">Agregar datos de salud</Link>
                </div>
              ) : (<>
                <div className="dash-wellness-row">
                  <div className="dash-bar-track">
                    <div className="dash-bar-fill" style={{ width: `${animated}%`, background: color }} />
                  </div>
                  <span className="dash-pct" style={{ color }}>{animated}%</span>
                </div>
                <div className="dash-factors">
                  {[
                    { label: 'Perfil',    done: !!(pet.name && pet.species) },
                    { label: 'Peso',      done: !!pet.weight },
                    { label: 'Edad',      done: !!pet.birth_date },
                    { label: 'Raza',      done: !!pet.breed },
                    { label: 'Bienestar', done: wellness.length > 0 },
                  ].map(f => (
                    <div key={f.label} className="dash-factor">
                      <span className={`dash-factor-dot${f.done ? ' dash-factor-dot--on' : ''}`}>
                        {f.done
                          ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : null}
                      </span>
                      <span className={`dash-factor-lbl${f.done ? ' dash-factor-lbl--on' : ''}`}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </>)}
            </div>

            {/* Recommendations */}
            <div className="dash-area-recs dash-card animate-up" style={{ animationDelay: '0.15s' }}>
              <div className="dash-card-head">
                <span className="dash-card-icon"><IconSparkles size={18} /></span>
                <h3>Recomendaciones automáticas</h3>
                {recommendations && (
                  <span
                    className="dash-score-badge"
                    style={{ background: RECOMMENDATION_TONES[recommendations.statusTone] }}
                  >
                    {recommendations.statusLabel}
                  </span>
                )}
              </div>
              {recsLoading ? (
                <div className="dash-empty-state">
                  <IconSparkles size={32} />
                  <p>Analizando los registros de {pet?.name || 'tu mascota'}...</p>
                </div>
              ) : !recommendations || recommendations.recommendations.length === 0 ? (
                <div className="dash-empty-state">
                  <IconSparkles size={32} />
                  <p>Agrega datos de salud, comida y actividad para recibir recomendaciones personalizadas.</p>
                </div>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {recommendations.summary}
                  </p>
                  <div className="dash-recs dash-recs--toned">
                    {recommendations.recommendations.map((r, i) => (
                      <div
                        key={i}
                        className={`dash-rec dash-rec--${r.tone}`}
                        style={{ animationDelay: `${0.2 + i * 0.06}s` }}
                      >
                        <span className="dash-rec-icon" aria-hidden>
                          {renderRecommendationIcon(r.icon)}
                        </span>
                        <div className="dash-rec-copy">
                          <span className="dash-rec-label" style={{ color: RECOMMENDATION_META[r.tone].color }}>
                            {RECOMMENDATION_META[r.tone].label}
                          </span>
                          <p>{r.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="dash-area-actions dash-card animate-up" style={{ animationDelay: '0.2s' }}>
              <div className="dash-card-head">
                <span className="dash-card-icon"><IconLightning size={18} /></span>
                <h3>Acciones Rápidas</h3>
              </div>
              <div className="dash-qa-grid">
                {[
                  { href: '/salud',     Icon: IconHeart,     label: 'Salud',     sub: 'Registrar síntomas',    color: '#EF4444' },
                  { href: '/comida',    Icon: IconDrumstick, label: 'Comida',    sub: 'Registrar alimentación', color: '#F97316' },
                  { href: '/actividad', Icon: IconLightning, label: 'Actividad', sub: 'Registrar ejercicio',    color: '#8B5CF6' },
                  { href: '/perfil',    Icon: IconPerson,    label: 'Perfil',    sub: 'Gestionar cuenta',       color: '#0EA5E9' },
                ].map(a => (
                  <Link key={a.href} href={a.href} className="dash-qa" style={{ '--qa-c': a.color } as any}>
                    <span className="dash-qa-ico" style={{ color: a.color }}><a.Icon size={22} /></span>
                    <div>
                      <p className="dash-qa-label">{a.label}</p>
                      <p className="dash-qa-sub">{a.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </>) : (!showReg && (
          <div className="dash-no-pets animate-up">
            <span className="dash-no-pets-icon"><IconPaw size={52} /></span>
            <h2>Registra tu primera mascota</h2>
            <p>Empieza registrando a tu compañero para cuidarlo desde Kloe Care.</p>
            <button className="dash-btn-add" onClick={() => setShowReg(true)}>
              <IconPlus size={16} /> Agregar mascota
            </button>
          </div>
        ))}
      </main>

      {pet && (
        <button className="dash-fab" onClick={() => setShowReg(true)} aria-label="Agregar mascota">
          <IconPlus size={24} />
        </button>
      )}
    </div>
    </SessionGuard>
  )
}

function renderRecommendationIcon(icon: RecommendationIcon) {
  switch (icon) {
    case 'critical':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    case 'warning':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'info':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      )
    case 'check':
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
  }
}

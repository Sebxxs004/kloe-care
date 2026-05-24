'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import RegisterPetModal from './RegisterPetModal'
import SessionGuard from '../components/SessionGuard'
import './dashboard.css'

interface Pet {
  id: string; name: string; species: string; breed?: string
  weight?: number; gender?: string[]; birth_date?: string
  auth_owner_id: string; created_at: string
}
interface WellnessRecord { id: string; general_notes: string; pet_id: string; created_at: string }
interface Props { user: User; pets: Pet[]; initialWellness: WellnessRecord[] }

const SPECIES_EMOJI: Record<string, string> = {
  Perro: '🐶', Gato: '🐱', Conejo: '🐰', Ave: '🦜', Reptil: '🦎', Pez: '🐠', Otro: '🐾',
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
  if (!r.length) { r.push(`¡Perfil completo! Considera registrar la próxima visita veterinaria.`); r.push('Mantén actualizados los datos de peso mensualmente.') }
  return r.slice(0, 3)
}

function getName(u: User) {
  return ((u.user_metadata?.full_name || u.user_metadata?.name || u.email || 'Usuario') as string).split(' ')[0]
}
function greeting() {
  const h = new Date().getHours()
  return h < 12 ? '¡Buenos días' : h < 19 ? '¡Buenas tardes' : '¡Buenas noches'
}

export default function DashboardClient({ user, pets: initPets, initialWellness }: Props) {
  const [pets, setPets]           = useState<Pet[]>(initPets)
  const [petIdx, setPetIdx]       = useState(0)
  const [wellness]                = useState(initialWellness)
  const [showReg, setShowReg]     = useState(initPets.length === 0)
  const [animated, setAnimated]   = useState(0)

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

  return (
    <SessionGuard>
    <div className="dash-root">
      <Navbar />
      {showReg && <RegisterPetModal userId={user.id} onSuccess={p => { setPets(v => [...v, p]); setShowReg(false) }} />}

      <main className="dash-main">

        {/* ── Greeting ── */}
        <header className="dash-header animate-up">
          <div>
            <h1>{greeting()}, <span className="dash-username">{getName(user)}</span>! 👋</h1>
            <p className="dash-subtitle">
              {pets.length === 0 ? 'Registra tu primera mascota para empezar 🐾'
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
                  {SPECIES_EMOJI[p.species] || '🐾'} {p.name}
                </button>
              ))}
            </div>
          )}

          {/* ── 2-col grid ── */}
          <div className="dash-grid">

            {/* Col 1, Row 1 — Pet card */}
            <div className="dash-area-pet dash-pet-card animate-up">
              <div className="dash-pet-card-orb dash-pet-card-orb--1" />
              <div className="dash-pet-card-orb dash-pet-card-orb--2" />
              <div className="dash-pet-card-top">
                <span className="dash-pet-big-emoji">{SPECIES_EMOJI[pet.species] || '🐾'}</span>
                <div>
                  <h2 className="dash-pet-name">{pet.name}</h2>
                  <p className="dash-pet-meta">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                </div>
              </div>
              <div className="dash-pet-chips">
                {pet.gender?.[0] && <span className="dash-chip">{pet.gender[0] === 'Macho' ? '♂' : '♀'} {pet.gender[0]}</span>}
                {pet.birth_date  && <span className="dash-chip">🎂 {getAge(pet.birth_date)}</span>}
                {pet.weight      && <span className="dash-chip">⚖️ {pet.weight} kg</span>}
              </div>
              <Link href="/salud" className="dash-pet-cta">
                Ver historial de salud →
              </Link>
            </div>

            {/* Col 2, Row 1 — Wellness */}
            <div className="dash-area-wellness dash-card animate-up" style={{ animationDelay: '0.1s' }}>
              <div className="dash-card-head">
                <span className="dash-card-icon">💚</span>
                <h3>Bienestar General</h3>
                <span className="dash-score-badge" style={{ background: color }}>{scoreLabel(score)}</span>
              </div>
              {!hasData ? (
                <div className="dash-empty-state">
                  <p>📊 Completa el perfil de {pet.name} para ver su bienestar.</p>
                  <Link href="/salud" className="dash-empty-link">+ Agregar datos de salud</Link>
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
                      <span className={`dash-factor-dot${f.done ? ' dash-factor-dot--on' : ''}`}>{f.done ? '✓' : '·'}</span>
                      <span className={`dash-factor-lbl${f.done ? ' dash-factor-lbl--on' : ''}`}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </>)}
            </div>

            {/* Col 1, Row 2 — Recommendations */}
            <div className="dash-area-recs dash-card animate-up" style={{ animationDelay: '0.15s' }}>
              <div className="dash-card-head">
                <span className="dash-card-icon">✨</span>
                <h3>Recomendaciones</h3>
              </div>
              {!hasData && wellness.length === 0 ? (
                <div className="dash-empty-state">
                  <p>🌟 Agrega datos de salud para recibir recomendaciones para {pet.name}.</p>
                </div>
              ) : (
                <div className="dash-recs">
                  {getRecs(pet, wellness).map((r, i) => (
                    <div key={i} className="dash-rec" style={{ animationDelay: `${0.2 + i * 0.06}s` }}>
                      <div className="dash-rec-dot" />
                      <p>{r}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Col 2, Row 2 — Quick Actions */}
            <div className="dash-area-actions dash-card animate-up" style={{ animationDelay: '0.2s' }}>
              <div className="dash-card-head">
                <span className="dash-card-icon">⚡</span>
                <h3>Acciones Rápidas</h3>
              </div>
              <div className="dash-qa-grid">
                {[
                  { href: '/salud',     icon: '❤️', label: 'Salud',     sub: 'Registrar síntomas',    color: '#EF4444' },
                  { href: '/comida',    icon: '🍖', label: 'Comida',    sub: 'Registrar alimentación', color: '#F97316' },
                  { href: '/actividad', icon: '⚡', label: 'Actividad', sub: 'Registrar ejercicio',    color: '#8B5CF6' },
                  { href: '/perfil',    icon: '👤', label: 'Perfil',    sub: 'Gestionar cuenta',       color: '#0EA5E9' },
                ].map(a => (
                  <Link key={a.href} href={a.href} className="dash-qa" style={{ '--qa-c': a.color } as any}>
                    <span className="dash-qa-ico">{a.icon}</span>
                    <div>
                      <p className="dash-qa-label">{a.label}</p>
                      <p className="dash-qa-sub">{a.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>{/* end grid */}

        </>) : (!showReg && (
          <div className="dash-no-pets animate-up">
            <div style={{ fontSize: 56, marginBottom: 16 }}>🐾</div>
            <h2>¡Registra tu primera mascota!</h2>
            <p>Empieza registrando a tu compañero para cuidarlo desde Kloe Care.</p>
            <button className="dash-btn-add" onClick={() => setShowReg(true)}>+ Agregar mascota</button>
          </div>
        ))}
      </main>

      {pet && (
        <button className="dash-fab" onClick={() => setShowReg(true)} aria-label="Agregar mascota">+</button>
      )}
    </div>
    </SessionGuard>
  )
}

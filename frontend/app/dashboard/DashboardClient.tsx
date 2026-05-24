'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import Navbar from '../components/Navbar'
import RegisterPetModal from './RegisterPetModal'
import './dashboard.css'

/* ── Types ── */
interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  weight?: number
  gender?: string[]
  birth_date?: string
  auth_owner_id: string
  created_at: string
}

interface WellnessRecord {
  id: string
  general_notes: string
  pet_id: string
  created_at: string
}

interface Props {
  user: User
  pets: Pet[]
  initialWellness: WellnessRecord[]
}

/* ── Helpers ── */
const SPECIES_EMOJI: Record<string, string> = {
  Perro: '🐶', Gato: '🐱', Conejo: '🐰', Ave: '🦜', Reptil: '🦎', Pez: '🐠', Otro: '🐾',
}

function getAge(birthDate?: string): string {
  if (!birthDate) return 'Edad desconocida'
  const birth = new Date(birthDate)
  const now   = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (months < 1)  return 'Recién nacido'
  if (months < 12) return `${months} mes${months > 1 ? 'es' : ''}`
  const years = Math.floor(months / 12)
  return `${years} año${years > 1 ? 's' : ''}`
}

function calcWellnessScore(pet: Pet, wellness: WellnessRecord[]): number {
  let score = 0
  if (pet.name)       score += 20
  if (pet.species)    score += 15
  if (pet.breed)      score += 15
  if (pet.weight)     score += 20
  if (pet.birth_date) score += 15
  if (wellness.length > 0) score += 15
  return score
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--green)'
  if (score >= 50) return 'var(--orange)'
  return '#EF4444'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excelente'
  if (score >= 60) return 'Bueno'
  if (score >= 40) return 'Regular'
  return 'Bajo'
}

function getRecommendations(pet: Pet, wellness: WellnessRecord[]): string[] {
  const recs: string[] = []
  if (!pet.weight)     recs.push('Registra el peso actual de ' + pet.name + ' para un mejor seguimiento.')
  if (!pet.birth_date) recs.push('Agrega la fecha de nacimiento para calcular la edad y recibir alertas de vacunas.')
  if (!pet.breed)      recs.push('Indica la raza de ' + pet.name + ' para recomendaciones personalizadas.')
  if (wellness.length === 0) recs.push('Agrega un historial de bienestar para empezar a monitorear la salud de ' + pet.name + '.')
  if (recs.length === 0) {
    recs.push('¡El perfil de ' + pet.name + ' está completo! Considera registrar una visita veterinaria.')
    recs.push('Mantén actualizados los datos de peso mensualmente.')
  }
  return recs.slice(0, 3)
}

function getFirstName(user: User): string {
  const meta = user.user_metadata
  const fullName: string = meta?.full_name || meta?.name || user.email || 'Usuario'
  return fullName.split(' ')[0]
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return '¡Buenos días'
  if (h < 19) return '¡Buenas tardes'
  return '¡Buenas noches'
}

/* ── Component ── */
export default function DashboardClient({ user, pets: initialPets, initialWellness }: Props) {
  const [pets, setPets]             = useState<Pet[]>(initialPets)
  const [currentPetIdx, setCurrentPetIdx] = useState(0)
  const [wellness]                  = useState<WellnessRecord[]>(initialWellness)
  const [showRegister, setShowRegister]   = useState(initialPets.length === 0)
  const [scoreAnimated, setScoreAnimated] = useState(0)

  const currentPet = pets[currentPetIdx] || null
  const score      = currentPet ? calcWellnessScore(currentPet, wellness) : 0
  const scoreColor = getScoreColor(score)
  const hasData    = wellness.length > 0 || (currentPet?.weight != null)

  // Animar la barra de bienestar al cargar
  useEffect(() => {
    if (!currentPet) return
    const target = score
    let current  = 0
    const step   = target / 40
    const timer  = setInterval(() => {
      current += step
      if (current >= target) { setScoreAnimated(target); clearInterval(timer) }
      else setScoreAnimated(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [currentPetIdx, score, currentPet])

  function handlePetRegistered(pet: Pet) {
    setPets(prev => [...prev, pet])
    setShowRegister(false)
  }

  return (
    <div className="dash-root">
      {/* Navbar */}
      <Navbar />

      {/* Primer registro de mascota */}
      {showRegister && (
        <RegisterPetModal userId={user.id} onSuccess={handlePetRegistered} />
      )}

      {/* Contenido principal */}
      <main className="dash-main">

        {/* ── Header greeting ── */}
        <header className="dash-header animate-up" style={{ animationDelay: '0.05s' }}>
          <div className="dash-greeting">
            <h1>{getGreeting()}, <span className="dash-username">{getFirstName(user)}</span>!</h1>
            <p className="dash-subtitle">
              {pets.length === 0
                ? 'Registra tu primera mascota para empezar 🐾'
                : `Tienes ${pets.length} mascota${pets.length > 1 ? 's' : ''} registrada${pets.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="dash-avatar">
            <span>{getFirstName(user).charAt(0).toUpperCase()}</span>
          </div>
        </header>

        {currentPet ? (
          <>
            {/* ── Pet Selector ── */}
            {pets.length > 1 && (
              <section className="dash-pet-selector animate-up" style={{ animationDelay: '0.1s' }}>
                {pets.map((pet, idx) => (
                  <button
                    key={pet.id}
                    className={`dash-pet-pill${idx === currentPetIdx ? ' dash-pet-pill--active' : ''}`}
                    onClick={() => setCurrentPetIdx(idx)}
                  >
                    {SPECIES_EMOJI[pet.species] || '🐾'} {pet.name}
                  </button>
                ))}
              </section>
            )}

            {/* ── Pet Card ── */}
            <section className="dash-pet-card animate-up" style={{ animationDelay: '0.12s' }}>
              <div className="dash-pet-card-bg" />
              <div className="dash-pet-card-content">
                <div className="dash-pet-emoji">
                  {SPECIES_EMOJI[currentPet.species] || '🐾'}
                </div>
                <div className="dash-pet-info">
                  <h2 className="dash-pet-name">{currentPet.name}</h2>
                  <p className="dash-pet-meta">
                    {currentPet.species}{currentPet.breed ? ` · ${currentPet.breed}` : ''}
                  </p>
                  <div className="dash-pet-chips">
                    {currentPet.gender?.[0] && (
                      <span className="dash-chip">
                        {currentPet.gender[0] === 'Macho' ? '♂' : '♀'} {currentPet.gender[0]}
                      </span>
                    )}
                    {currentPet.birth_date && (
                      <span className="dash-chip">
                        🎂 {getAge(currentPet.birth_date)}
                      </span>
                    )}
                    {currentPet.weight && (
                      <span className="dash-chip">
                        ⚖️ {currentPet.weight} kg
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Wellness Score ── */}
            <section className="dash-section animate-up" style={{ animationDelay: '0.18s' }}>
              <div className="dash-section-header">
                <h3 className="dash-section-title">
                  <span className="dash-section-icon">💚</span>
                  Estado General de Bienestar
                </h3>
                <span className="dash-score-badge" style={{ background: scoreColor }}>
                  {getScoreLabel(score)}
                </span>
              </div>

              {!hasData ? (
                <div className="dash-empty-card">
                  <div className="dash-empty-icon">📊</div>
                  <h4>Sin datos de salud aún</h4>
                  <p>Completa el perfil de {currentPet.name} y agrega registros de bienestar para ver su estado general aquí.</p>
                  <button className="dash-empty-cta" onClick={() => {}}>
                    + Agregar datos de salud
                  </button>
                </div>
              ) : (
                <div className="dash-wellness">
                  <div className="dash-wellness-bar-wrap">
                    <div className="dash-wellness-bar">
                      <div
                        className="dash-wellness-fill"
                        style={{
                          width:      `${scoreAnimated}%`,
                          background: scoreColor,
                        }}
                      />
                    </div>
                    <span className="dash-wellness-pct" style={{ color: scoreColor }}>
                      {scoreAnimated}%
                    </span>
                  </div>
                  <div className="dash-wellness-breakdown">
                    <WellnessFactor label="Perfil" done={!!(currentPet.name && currentPet.species)} />
                    <WellnessFactor label="Peso"       done={!!currentPet.weight} />
                    <WellnessFactor label="Edad"       done={!!currentPet.birth_date} />
                    <WellnessFactor label="Raza"       done={!!currentPet.breed} />
                    <WellnessFactor label="Bienestar"  done={wellness.length > 0} />
                  </div>
                </div>
              )}
            </section>

            {/* ── Recommendations ── */}
            <section className="dash-section animate-up" style={{ animationDelay: '0.24s' }}>
              <div className="dash-section-header">
                <h3 className="dash-section-title">
                  <span className="dash-section-icon">✨</span>
                  Recomendaciones
                </h3>
              </div>

              {!hasData && wellness.length === 0 ? (
                <div className="dash-empty-card dash-empty-card--alt">
                  <div className="dash-empty-icon">🌟</div>
                  <h4>Aún no hay recomendaciones</h4>
                  <p>Agrega datos de salud y actividad para recibir recomendaciones personalizadas para {currentPet.name}.</p>
                </div>
              ) : (
                <div className="dash-recs">
                  {getRecommendations(currentPet, wellness).map((rec, i) => (
                    <div key={i} className="dash-rec-item" style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
                      <div className="dash-rec-dot" />
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Quick Actions ── */}
            <section className="dash-section animate-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="dash-section-title" style={{ marginBottom: 14 }}>
                <span className="dash-section-icon">⚡</span>
                Acciones rápidas
              </h3>
              <div className="dash-quick-grid">
                <QuickAction href="/salud"     icon="❤️" label="Salud"     color="#EF4444" />
                <QuickAction href="/comida"    icon="🍖" label="Comida"    color="#F97316" />
                <QuickAction href="/actividad" icon="⚡" label="Actividad" color="#8B5CF6" />
                <QuickAction href="/perfil"    icon="👤" label="Perfil"    color="#0EA5E9" />
              </div>
            </section>
          </>
        ) : (
          /* Sin mascotas */
          !showRegister && (
            <div className="dash-no-pets animate-up">
              <div className="dash-no-pets-icon">🐾</div>
              <h2>¡Registra tu primera mascota!</h2>
              <p>Aún no tienes mascotas en tu cuenta. Empieza registrando a tu compañero.</p>
              <button className="dash-btn-add-pet" onClick={() => setShowRegister(true)}>
                + Agregar mascota
              </button>
            </div>
          )
        )}
      </main>

      {/* Botón flotante agregar mascota (si ya tiene mascotas) */}
      {currentPet && (
        <button
          className="dash-fab"
          onClick={() => setShowRegister(true)}
          aria-label="Agregar nueva mascota"
          title="Agregar mascota"
        >
          +
        </button>
      )}
    </div>
  )
}

/* ── Sub-components ── */
function WellnessFactor({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="wf-item">
      <span className={`wf-dot${done ? ' wf-dot--done' : ''}`}>
        {done ? '✓' : '·'}
      </span>
      <span className={`wf-label${done ? ' wf-label--done' : ''}`}>{label}</span>
    </div>
  )
}

function QuickAction({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  return (
    <a href={href} className="dash-qa" style={{ '--qa-color': color } as any}>
      <div className="dash-qa-icon">{icon}</div>
      <span className="dash-qa-label">{label}</span>
      <svg className="dash-qa-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </a>
  )
}

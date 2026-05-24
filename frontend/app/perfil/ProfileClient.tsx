'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'
import './perfil.css'

/* ── Types ── */
interface Pet {
  id: string
  name: string
  birth_date?: string
  gender?: string[]
  species?: string
}

interface Props {
  user: User
  pets: Pet[]
}

type Section = null | 'cuenta' | 'mascota'
type CuentaForm = 'phone' | 'password'
type MascotaForm = 'name' | 'birth_date' | 'gender'

const SPECIES_EMOJI: Record<string, string> = {
  Perro: '🐶', Gato: '🐱', Conejo: '🐰', Ave: '🦜', Reptil: '🦎', Pez: '🐠', Otro: '🐾',
}

function getFirstName(user: User) {
  const meta = user.user_metadata
  return (meta?.full_name || meta?.name || user.email || 'Usuario').split(' ')[0]
}

/* ================================================================
   COMPONENT
   ================================================================ */
export default function ProfileClient({ user, pets }: Props) {
  const [openSection, setOpenSection] = useState<Section>(null)
  const [activePetId, setActivePetId] = useState<string>(pets[0]?.id || '')
  const [toast, setToast]             = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const currentPet = pets.find(p => p.id === activePetId) || pets[0] || null

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function toggleSection(s: Section) {
    setOpenSection(prev => (prev === s ? null : s))
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <SessionGuard>
    <div className="pf-root">
      <Navbar />

      {/* Toast notification */}
      {toast && (
        <div className={`pf-toast pf-toast--${toast.type}`}>
          {toast.type === 'ok' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <main className="pf-main">

        {/* ── Avatar + info ── */}
        <header className="pf-header animate-up">
          <div className="pf-avatar">
            {getFirstName(user).charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="pf-name">
              {user.user_metadata?.full_name || getFirstName(user)}
            </h1>
            <p className="pf-email">{user.email}</p>
            {user.user_metadata?.phone_number && (
              <p className="pf-phone">📱 {user.user_metadata.phone_number}</p>
            )}
          </div>
        </header>

        {/* ── Sección: Mi cuenta ── */}
        <div className="pf-section animate-up" style={{ animationDelay: '0.08s' }}>
          <button
            className={`pf-section-toggle${openSection === 'cuenta' ? ' pf-section-toggle--open' : ''}`}
            onClick={() => toggleSection('cuenta')}
          >
            <span className="pf-section-icon">👤</span>
            <span className="pf-section-label">Mi cuenta</span>
            <svg className="pf-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {openSection === 'cuenta' && (
            <div className="pf-section-body animate-up">
              <PhoneForm user={user} onSuccess={msg => showToast(msg)} onError={msg => showToast(msg, 'err')} />
              <div className="pf-divider" />
              <PasswordForm onSuccess={msg => showToast(msg)} onError={msg => showToast(msg, 'err')} />
            </div>
          )}
        </div>

        {/* ── Sección: Mi mascota ── */}
        {pets.length > 0 && (
          <div className="pf-section animate-up" style={{ animationDelay: '0.14s' }}>
            <button
              className={`pf-section-toggle${openSection === 'mascota' ? ' pf-section-toggle--open' : ''}`}
              onClick={() => toggleSection('mascota')}
            >
              <span className="pf-section-icon">🐾</span>
              <span className="pf-section-label">
                {currentPet
                  ? `${SPECIES_EMOJI[currentPet.species || ''] || '🐾'} ${currentPet.name}`
                  : 'Mi mascota'}
              </span>
              <svg className="pf-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {openSection === 'mascota' && currentPet && (
              <div className="pf-section-body animate-up">
                {/* Selector de mascota si hay varias */}
                {pets.length > 1 && (
                  <div className="pf-pet-selector">
                    {pets.map(p => (
                      <button
                        key={p.id}
                        className={`pf-pet-pill${p.id === activePetId ? ' pf-pet-pill--active' : ''}`}
                        onClick={() => setActivePetId(p.id)}
                      >
                        {SPECIES_EMOJI[p.species || ''] || '🐾'} {p.name}
                      </button>
                    ))}
                  </div>
                )}

                <PetNameForm    pet={currentPet} onSuccess={showToast} onError={m => showToast(m, 'err')} />
                <div className="pf-divider" />
                <PetBirthForm   pet={currentPet} onSuccess={showToast} onError={m => showToast(m, 'err')} />
                <div className="pf-divider" />
                <PetGenderForm  pet={currentPet} onSuccess={showToast} onError={m => showToast(m, 'err')} />
              </div>
            )}
          </div>
        )}

        {/* ── Cerrar sesión ── */}
        <button className="pf-logout animate-up" style={{ animationDelay: '0.2s' }} onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          Cerrar sesión
        </button>

      </main>
    </div>
    </SessionGuard>
  )
}

/* ================================================================
   SUB-FORMS
   ================================================================ */

/* ── Teléfono ── */
function PhoneForm({ user, onSuccess, onError }: {
  user: User
  onSuccess: (m: string) => void
  onError: (m: string) => void
}) {
  const [phone, setPhone]   = useState(user.user_metadata?.phone_number || '')
  const [loading, setLoading] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ data: { phone_number: phone.trim() } })
    setLoading(false)
    if (error) { onError(error.message); return }
    onSuccess('Teléfono actualizado correctamente.')
  }

  return (
    <form className="pf-form" onSubmit={save}>
      <p className="pf-form-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 15a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.94 4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 11a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        Teléfono
      </p>
      <div className="pf-input-row">
        <input
          type="tel"
          placeholder="+57 300 000 0000"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="pf-btn-save" disabled={loading || !phone.trim()}>
          {loading ? <span className="pf-spinner" /> : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

/* ── Contraseña ── */
function PasswordForm({ onSuccess, onError }: {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}) {
  const [pwd, setPwd]         = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)

  const mismatch = confirm.length > 0 && pwd !== confirm

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (pwd !== confirm) { onError('Las contraseñas no coinciden.'); return }
    if (pwd.length < 6)  { onError('Mínimo 6 caracteres.'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pwd })
    setLoading(false)
    if (error) { onError(error.message); return }
    setPwd(''); setConfirm('')
    onSuccess('Contraseña actualizada correctamente.')
  }

  return (
    <form className="pf-form" onSubmit={save}>
      <p className="pf-form-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Contraseña
      </p>
      <div className="pf-input-stack">
        <div className="pf-pwd-wrap">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            disabled={loading}
          />
          <button type="button" className="pf-eye" onClick={() => setShow(v => !v)}>
            {show
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
        <input
          type={show ? 'text' : 'password'}
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          disabled={loading}
          className={mismatch ? 'pf-input-error' : ''}
        />
        {mismatch && <p className="pf-hint-error">Las contraseñas no coinciden</p>}
        <button
          type="submit"
          className="pf-btn-save pf-btn-save--full"
          disabled={loading || !pwd || mismatch}
        >
          {loading ? <span className="pf-spinner" /> : null}
          {loading ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </div>
    </form>
  )
}

/* ── Nombre de la mascota ── */
function PetNameForm({ pet, onSuccess, onError }: {
  pet: Pet
  onSuccess: (m: string) => void
  onError: (m: string) => void
}) {
  const [name, setName]     = useState(pet.name)
  const [loading, setLoading] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { onError('El nombre no puede estar vacío.'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('pets')
      .update({ name: name.trim() })
      .eq('id', pet.id)
    setLoading(false)
    if (error) { onError(error.message); return }
    onSuccess(`Nombre actualizado a "${name.trim()}".`)
  }

  return (
    <form className="pf-form" onSubmit={save}>
      <p className="pf-form-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Nombre
      </p>
      <div className="pf-input-row">
        <input
          type="text"
          placeholder="Nombre de tu mascota"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="pf-btn-save"
          disabled={loading || !name.trim() || name.trim() === pet.name}
        >
          {loading ? <span className="pf-spinner" /> : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

/* ── Fecha de nacimiento de la mascota ── */
function PetBirthForm({ pet, onSuccess, onError }: {
  pet: Pet
  onSuccess: (m: string) => void
  onError: (m: string) => void
}) {
  const [date, setDate]     = useState(pet.birth_date || '')
  const [loading, setLoading] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('pets')
      .update({ birth_date: date || null })
      .eq('id', pet.id)
    setLoading(false)
    if (error) { onError(error.message); return }
    onSuccess('Fecha de nacimiento actualizada.')
  }

  return (
    <form className="pf-form" onSubmit={save}>
      <p className="pf-form-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        Fecha de nacimiento
      </p>
      <div className="pf-input-row">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          disabled={loading}
        />
        <button
          type="submit"
          className="pf-btn-save"
          disabled={loading || date === (pet.birth_date || '')}
        >
          {loading ? <span className="pf-spinner" /> : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

/* ── Género de la mascota ── */
function PetGenderForm({ pet, onSuccess, onError }: {
  pet: Pet
  onSuccess: (m: string) => void
  onError: (m: string) => void
}) {
  const [gender, setGender]   = useState<string>(pet.gender?.[0] || '')
  const [loading, setLoading] = useState(false)

  const unchanged = gender === (pet.gender?.[0] || '')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('pets')
      .update({ gender: gender ? [gender] : [] })
      .eq('id', pet.id)
    setLoading(false)
    if (error) { onError(error.message); return }
    onSuccess(`Género actualizado a "${gender || 'Sin especificar'}".`)
  }

  return (
    <form className="pf-form" onSubmit={save}>
      <p className="pf-form-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        Género
      </p>
      <div className="pf-gender-row">
        {['Macho', 'Hembra', ''].map((g, i) => (
          <button
            key={i}
            type="button"
            className={`pf-gender-btn${gender === g ? ' pf-gender-btn--active' : ''}`}
            onClick={() => setGender(g)}
          >
            {g === 'Macho' ? '♂ Macho' : g === 'Hembra' ? '♀ Hembra' : '— Sin especificar'}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="pf-btn-save pf-btn-save--full"
        disabled={loading || unchanged}
        style={{ marginTop: 10 }}
      >
        {loading ? <span className="pf-spinner" /> : null}
        {loading ? 'Guardando...' : 'Guardar género'}
      </button>
    </form>
  )
}

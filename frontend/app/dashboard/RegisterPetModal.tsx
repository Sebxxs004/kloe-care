'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { IconPaw, IconMale, IconFemale, SPECIES_ICONS } from '../components/Icons'
import './dashboard.css'

const SPECIES_OPTIONS = [
  { value: 'Perro'  },
  { value: 'Gato'   },
  { value: 'Conejo' },
  { value: 'Ave'    },
  { value: 'Reptil' },
  { value: 'Pez'    },
  { value: 'Otro'   },
]

interface Props {
  userId: string
  onSuccess: (pet: any) => void
}

export default function RegisterPetModal({ userId, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName]           = useState('')
  const [species, setSpecies]     = useState('')
  const [breed, setBreed]         = useState('')
  const [weight, setWeight]       = useState('')
  const [gender, setGender]       = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  // Paso 1: valida nombre + especie y avanza
  function handleStep1(e?: React.FormEvent) {
    e?.preventDefault()
    if (!name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    if (!species) {
      setError('Selecciona la especie de tu mascota.')
      return
    }
    setError('')
    setStep(2)
  }

  // Paso 2: guarda en Supabase
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data, error: dbError } = await supabase
      .from('pets')
      .insert({
        name:          name.trim(),
        species,
        breed:         breed.trim() || null,
        weight:        weight ? parseFloat(weight) : null,
        gender:        gender ? [gender] : [],
        birth_date:    birthDate || null,
        auth_owner_id: userId,
      })
      .select()
      .single()

    setLoading(false)

    if (dbError) {
      console.error('Supabase error:', JSON.stringify(dbError, null, 2))
      if (dbError.code === '42703') {
        setError('La columna "auth_owner_id" no existe. Ejecuta la migración SQL en Supabase primero.')
      } else if (dbError.code === '42501' || dbError.message?.includes('policy')) {
        setError('Sin permisos (RLS). Ejecuta la migración SQL en Supabase para habilitar las políticas.')
      } else if (dbError.code === '23503') {
        setError('Error de clave foránea. Ejecuta la migración SQL en Supabase.')
      } else {
        setError(`Error ${dbError.code || ''}: ${dbError.message || 'No se pudo guardar la mascota.'}`)
      }
      return
    }

    onSuccess(data)
  }

  // Router: el form llama al handler correcto según el paso
  function handleFormSubmit(e: React.FormEvent) {
    if (step === 1) {
      handleStep1(e)
    } else {
      handleSave(e)
    }
  }

  const selectedSpecies = SPECIES_OPTIONS.find(s => s.value === species)

  return (
    <div className="rp-overlay" role="dialog" aria-modal="true" aria-label="Registrar primera mascota">
      <div className="rp-card animate-scale">

        {/* Encabezado */}
        <div className="rp-header">
          <div className="rp-paw"><IconPaw size={36} /></div>
          <h2>¡Bienvenido a Kloe Care!</h2>
          <p>Cuéntanos sobre tu primera mascota para empezar</p>
          <div className="rp-steps">
            <div className={`rp-step${step >= 1 ? ' rp-step--done' : ''}`}>1</div>
            <div className="rp-step-line" />
            <div className={`rp-step${step >= 2 ? ' rp-step--done' : ''}`}>2</div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} noValidate>

          {/* ── Paso 1: Datos básicos ── */}
          {step === 1 && (
            <div className="rp-body animate-up">
              {/* Nombre */}
              <div className="rp-field">
                <label htmlFor="pet-name">Nombre de tu mascota *</label>
                <input
                  id="pet-name"
                  type="text"
                  placeholder="Ej: Luna, Max, Mochi..."
                  value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleStep1() } }}
                  autoFocus
                />
              </div>

              {/* Especie */}
              <div className="rp-field">
                <label>Especie *</label>
                <div className="rp-species-grid">
                  {SPECIES_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`rp-species-btn${species === opt.value ? ' rp-species-btn--active' : ''}`}
                      onClick={() => setSpecies(opt.value)}
                    >
                      <span className="rp-species-ico">
                        {SPECIES_ICONS[opt.value] || <IconPaw size={24} />}
                      </span>
                      <span>{opt.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="rp-btn-next"
                disabled={!name.trim() || !species}
              >
                Continuar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── Paso 2: Detalles opcionales ── */}
          {step === 2 && (
            <div className="rp-body animate-up">
              <div className="rp-pet-badge">
                <span className="rp-pet-badge-ico">
                  {SPECIES_ICONS[species] || <IconPaw size={28} />}
                </span>
                <strong>{name}</strong>
              </div>

              {/* Raza */}
              <div className="rp-field">
                <label htmlFor="pet-breed">Raza <span className="rp-optional">(opcional)</span></label>
                <input
                  id="pet-breed"
                  type="text"
                  placeholder={`Ej: ${species === 'Perro' ? 'Golden Retriever' : species === 'Gato' ? 'Persa' : 'Mezcla'}`}
                  value={breed}
                  onChange={e => setBreed(e.target.value)}
                />
              </div>

              {/* Peso y Género */}
              <div className="rp-row">
                <div className="rp-field">
                  <label htmlFor="pet-weight">Peso (kg) <span className="rp-optional">(opc.)</span></label>
                  <input
                    id="pet-weight"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Ej: 5.5"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                  />
                </div>
                <div className="rp-field">
                  <label>Sexo <span className="rp-optional">(opc.)</span></label>
                  <div className="rp-gender-btns">
                    {['Macho', 'Hembra'].map(g => (
                      <button
                        key={g}
                        type="button"
                        className={`rp-gender-btn${gender === g ? ' rp-gender-btn--active' : ''}`}
                        onClick={() => setGender(gender === g ? '' : g)}
                      >
                      <>
                        {g === 'Macho' ? <IconMale size={14} /> : <IconFemale size={14} />}
                        {' '}{g}
                      </>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fecha de nacimiento */}
              <div className="rp-field">
                <label htmlFor="pet-birth">Fecha de nacimiento <span className="rp-optional">(opc.)</span></label>
                <input
                  id="pet-birth"
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rp-error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="rp-actions">
                <button type="button" className="rp-btn-back" onClick={() => setStep(1)}>
                  ← Atrás
                </button>
                <button type="submit" className="rp-btn-submit" disabled={loading}>
                  {loading ? <span className="rp-spinner" /> : <IconPaw size={16} />}
                  {loading ? 'Guardando...' : '¡Empezar!'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

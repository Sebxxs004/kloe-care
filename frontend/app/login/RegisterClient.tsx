'use client'

import { useState } from 'react'

const API = 'http://localhost:8080'

interface Props {
  onSwitchToLogin: () => void
}

export default function RegisterClient({ onSwitchToLogin }: Props) {
  const [fullName, setFullName]     = useState('')
  const [email, setEmail]           = useState('')
  const [phone, setPhone]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd]       = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [loading, setLoading]       = useState(false)

  const strength = getPasswordStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPwd) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, phoneNumber: phone }),
        credentials: 'include',
      })

      const text = await res.text()

      if (!res.ok) {
        setError(text || 'No se pudo completar el registro.')
        return
      }

      setSuccess('¡Cuenta creada! Ahora puedes iniciar sesión.')
      setTimeout(() => onSwitchToLogin(), 2000)
    } catch {
      setError('No se pudo conectar al servidor. Verifica que el backend esté activo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Encabezado */}
      <div className="login-heading">
        <h1>Crea tu cuenta</h1>
        <p>Únete a Kloe Care y cuida a tu mascota 🐾</p>
      </div>

      <div className="login-form-wrap">
        <form className="login-form" onSubmit={handleSubmit} id="register-form" noValidate>

          {/* Alertas */}
          {error && (
            <div className="form-alert form-alert--error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="form-alert form-alert--success" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {success}
            </div>
          )}

          {/* Nombre completo */}
          <div className="form-field">
            <label htmlFor="reg-name">Nombre completo</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="reg-name"
                type="text"
                placeholder="Tu nombre completo"
                autoComplete="name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-field">
            <label htmlFor="reg-email">Correo electrónico</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="reg-email"
                type="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Teléfono (opcional) */}
          <div className="form-field">
            <label htmlFor="reg-phone">
              Teléfono <span className="label-optional">(opcional)</span>
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 15a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.94 4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 11a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <input
                id="reg-phone"
                type="tel"
                placeholder="+57 300 000 0000"
                autoComplete="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-field">
            <label htmlFor="reg-password">Contraseña</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="reg-password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="input-eye"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPwd ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {/* Indicador de fortaleza */}
            {password && (
              <div className="pwd-strength">
                <div className="pwd-strength-bar">
                  <div
                    className={`pwd-strength-fill pwd-strength-fill--${strength.level}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
                <span className={`pwd-strength-label pwd-strength-label--${strength.level}`}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="form-field">
            <label htmlFor="reg-confirm">Confirmar contraseña</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <input
                id="reg-confirm"
                type={showPwd ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                required
                disabled={loading}
                className={confirmPwd && confirmPwd !== password ? 'input-error' : ''}
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className={`btn-login btn-login--green${loading ? ' btn-login--loading' : ''}`}
            id="btn-register"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" x2="19" y1="8" y2="14"/>
                <line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
            )}
            {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
          </button>

          {/* Volver al login */}
          <div className="login-links" style={{ justifyContent: 'center' }}>
            <button type="button" className="register-link" onClick={onSwitchToLogin}>
              ← Ya tengo cuenta
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

/* ── Helpers ── */
function getPasswordStrength(pwd: string): { level: string; label: string; percent: number } {
  if (!pwd) return { level: 'empty', label: '', percent: 0 }
  let score = 0
  if (pwd.length >= 8)  score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) return { level: 'weak',   label: 'Débil',    percent: 25  }
  if (score <= 2) return { level: 'fair',   label: 'Regular',  percent: 50  }
  if (score <= 3) return { level: 'good',   label: 'Buena',    percent: 75  }
  return              { level: 'strong', label: 'Excelente', percent: 100 }
}

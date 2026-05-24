'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Props {
  onSwitchToRegister: () => void
}

export default function LoginClient({ onSwitchToRegister }: Props) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPwd, setShowPwd]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      // Mensaje de error amigable en español
      const msg = authError.message.toLowerCase()
      if (msg.includes('invalid login') || msg.includes('invalid credentials')) {
        setError('Correo o contraseña incorrectos. Inténtalo de nuevo.')
      } else if (msg.includes('email not confirmed')) {
        setError('Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.')
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    // Login exitoso → redirigir al dashboard
    window.location.href = '/'
  }

  return (
    <>
      {/* Encabezado */}
      <div className="login-heading">
        <h1>Bienvenido de vuelta</h1>
        <p>Inicia sesión para cuidar a tus mascotas 🐾</p>
      </div>

      <div className="login-form-wrap">
        <form className="login-form" onSubmit={handleSubmit} id="login-form" noValidate>

          {/* Alerta de error */}
          {error && (
            <div className="form-alert form-alert--error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Email */}
          <div className="form-field">
            <label htmlFor="login-email">Correo electrónico</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="login-email"
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

          {/* Contraseña */}
          <div className="form-field">
            <label htmlFor="login-password">Contraseña</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
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
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            className={`btn-login${loading ? ' btn-login--loading' : ''}`}
            id="btn-login"
            disabled={loading}
          >
            {loading ? <span className="btn-spinner" /> : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" x2="3" y1="12" y2="12"/>
              </svg>
            )}
            {loading ? 'Verificando...' : 'Entrar a mi cuenta'}
          </button>

          {/* Links */}
          <div className="login-links">
            <a href="#" id="forgot-password-link">¿Olvidaste tu contraseña?</a>
            <button
              type="button"
              className="register-link"
              id="register-link"
              onClick={onSwitchToRegister}
            >
              Crear cuenta
            </button>
          </div>

        </form>
      </div>
    </>
  )
}

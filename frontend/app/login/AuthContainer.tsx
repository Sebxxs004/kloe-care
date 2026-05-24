'use client'

import { useState } from 'react'
import LoginClient    from './LoginClient'
import RegisterClient from './RegisterClient'

export default function AuthContainer() {
  const [view, setView] = useState<'login' | 'register'>('login')

  return (
    <section className="login-left">

      {/* Logo */}
      <div className="login-logo-wrap">
        <img
          src="/images/logo-nobackground.png"
          alt="Kloe Care"
          className="login-logo"
        />
      </div>

      {/* Panel animado: alterna entre login y registro */}
      <div className={`auth-panel${view === 'register' ? ' auth-panel--register' : ''}`}>

        {/* ── Vista Login ── */}
        <div className="auth-view auth-view--login">
          <LoginClient onSwitchToRegister={() => setView('register')} />
        </div>

        {/* ── Vista Registro ── */}
        <div className="auth-view auth-view--register">
          <RegisterClient onSwitchToLogin={() => setView('login')} />
        </div>
      </div>

      {/* Badges de confianza */}
      <div className="trust-badges">
        <div className="trust-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Seguro y privado
        </div>
        <div className="trust-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Siempre disponible
        </div>
        <div className="trust-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Hecho con amor
        </div>
      </div>

    </section>
  )
}

import Preloader from './Preloader'
import './login.css'

export const metadata = {
  title: 'Iniciar Sesión — Kloe Care',
  description: 'Accede a tu cuenta de Kloe Care para gestionar el cuidado de tus mascotas.',
}

export default function LoginPage() {
  return (
    <>
      <Preloader />

      <div className="login-page">
        {/* ── Panel izquierdo: formulario ── */}
        <section className="login-left">

          {/* Logo */}
          <div className="login-logo-wrap">
            <img
              src="/images/logo-nobackground.png"
              alt="Kloe Care"
              className="login-logo"
            />
          </div>

          {/* Encabezado */}
          <div className="login-heading">
            <h1>Bienvenido de vuelta</h1>
            <p>Inicia sesión para cuidar a tus mascotas 🐾</p>
          </div>

          {/* Formulario */}
          <div className="login-form-wrap">
            <form className="login-form" action="#" method="post" id="login-form">

              {/* Email */}
              <div className="form-field">
                <label htmlFor="email">Correo electrónico</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="form-field">
                <label htmlFor="password">Contraseña</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {/* Botón */}
              <button type="submit" className="btn-login" id="btn-login">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" x2="3" y1="12" y2="12"/>
                </svg>
                Entrar a mi cuenta
              </button>

              {/* Links */}
              <div className="login-links">
                <a href="#" id="forgot-password-link">¿Olvidaste tu contraseña?</a>
                <a href="#" className="register-link" id="register-link">Crear cuenta</a>
              </div>
            </form>
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

        {/* ── Panel derecho: imagen ── */}
        <section className="login-right" aria-hidden>
          <div className="login-right-bg" />
          <div className="login-right-overlay" />

          {/* Orbs decorativos */}
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          {/* Contenido sobre la imagen */}
          <div className="login-right-content">
            <p className="login-right-tagline">
              El cuidado que<br />tus mascotas <span>merecen</span>
            </p>
            <p className="login-right-sub">
              Gestiona la salud, alimentación y bienestar de tu compañero en un solo lugar.
            </p>
            <div className="login-stats">
              <div className="login-stat-pill">
                <span className="pill-icon">🐾</span>
                Mascotas felices
              </div>
              <div className="login-stat-pill">
                <span className="pill-icon">💚</span>
                Salud monitoreada
              </div>
              <div className="login-stat-pill">
                <span className="pill-icon">🍖</span>
                Alimentación óptima
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

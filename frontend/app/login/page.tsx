import Preloader     from './Preloader'
import AuthContainer from './AuthContainer'
import './login.css'

export const metadata = {
  title: 'Kloe Care — Iniciar Sesión / Registro',
  description: 'Accede o crea tu cuenta en Kloe Care para gestionar el cuidado de tus mascotas.',
}

export default function LoginPage() {
  return (
    <>
      <Preloader />

      <div className="login-page">

        {/* ── Panel izquierdo: login / registro ── */}
        <AuthContainer />

        {/* ── Panel derecho: imagen decorativa ── */}
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

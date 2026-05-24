import Navbar from '../components/Navbar'

export const metadata = { title: 'Actividad — Kloe Care' }

export default function ActividadPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '80px 20px 100px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Actividad</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          El módulo de actividad física estará disponible próximamente.<br />
          Registra paseos, juegos y ejercicio de tu mascota.
        </p>
      </main>
    </div>
  )
}

import Navbar from '../components/Navbar'
import SessionGuard from '../components/SessionGuard'

export const metadata = { title: 'Salud — Kloe Care' }

export default function SaludPage() {
  return (
    <SessionGuard>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <main style={{ maxWidth: 680, margin: '0 auto', padding: '80px 20px 100px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>❤️</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Salud</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            El módulo de salud estará disponible próximamente.<br />
            Aquí podrás registrar temperatura, peso, síntomas y más.
          </p>
        </main>
      </div>
    </SessionGuard>
  )
}

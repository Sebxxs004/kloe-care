import Navbar from '../components/Navbar'

export const metadata = { title: 'Comida — Kloe Care' }

export default function ComidaPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '80px 20px 100px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🍖</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Comida</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          El módulo de alimentación estará disponible próximamente.<br />
          Podrás registrar horarios, marcas y cantidades de alimento.
        </p>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Navbar from '../components/Navbar'

export default function PerfilPage() {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '80px 20px 100px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>👤</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Perfil</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32 }}>
          La sección de perfil completa estará disponible próximamente.
        </p>
        <button
          onClick={handleLogout}
          disabled={loading}
          style={{
            padding: '12px 28px',
            background: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--r-full)',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
          }}
        >
          {loading ? 'Cerrando sesión...' : '⬅ Cerrar sesión'}
        </button>
      </main>
    </div>
  )
}

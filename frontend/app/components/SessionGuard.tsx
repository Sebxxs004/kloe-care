'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import './session-guard.css'

const INACTIVE_MS  = 30 * 60 * 1000  // 30 minutos de inactividad
const WARNING_MS   = 2  * 60 * 1000  // aviso 2 min antes de expirar
const THROTTLE_MS  = 20 * 1000       // throttle: resetear máx cada 20s

const EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click', 'wheel']

interface Props {
  children: React.ReactNode
}

export default function SessionGuard({ children }: Props) {
  const [phase, setPhase]         = useState<'active' | 'warning' | 'expired'>('active')
  const [countdown, setCountdown] = useState(120)

  const inactiveTimer  = useRef<ReturnType<typeof setTimeout>>()
  const warningTimer   = useRef<ReturnType<typeof setTimeout>>()
  const countdownTimer = useRef<ReturnType<typeof setInterval>>()
  const lastReset      = useRef<number>(Date.now())

  /* ── Sign out and show expired screen ── */
  const expire = useCallback(async () => {
    clearTimers()
    setPhase('expired')
    const supabase = createClient()
    await supabase.auth.signOut()
    setTimeout(() => { window.location.href = '/login' }, 3200)
  }, [])

  /* ── Clear all timers ── */
  function clearTimers() {
    if (inactiveTimer.current)  clearTimeout(inactiveTimer.current)
    if (warningTimer.current)   clearTimeout(warningTimer.current)
    if (countdownTimer.current) clearInterval(countdownTimer.current)
  }

  /* ── Reset inactivity clock ── */
  const resetTimer = useCallback(() => {
    clearTimers()
    setPhase('active')
    setCountdown(120)

    // Aviso a los 28 min
    warningTimer.current = setTimeout(() => {
      setPhase('warning')
      setCountdown(120)
      countdownTimer.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(countdownTimer.current); return 0 }
          return prev - 1
        })
      }, 1000)
    }, INACTIVE_MS - WARNING_MS)

    // Expiración a los 30 min
    inactiveTimer.current = setTimeout(expire, INACTIVE_MS)
  }, [expire])

  /* ── Throttled activity handler ── */
  const handleActivity = useCallback(() => {
    if (phase === 'expired') return
    const now = Date.now()
    if (now - lastReset.current >= THROTTLE_MS) {
      lastReset.current = now
      resetTimer()
    }
  }, [phase, resetTimer])

  /* ── Register activity listeners ── */
  useEffect(() => {
    resetTimer()
    EVENTS.forEach(ev => window.addEventListener(ev, handleActivity, { passive: true }))
    return () => {
      clearTimers()
      EVENTS.forEach(ev => window.removeEventListener(ev, handleActivity))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Re-register when handleActivity changes ── */
  useEffect(() => {
    EVENTS.forEach(ev => window.removeEventListener(ev, handleActivity))
    EVENTS.forEach(ev => window.addEventListener(ev, handleActivity, { passive: true }))
    return () => { EVENTS.forEach(ev => window.removeEventListener(ev, handleActivity)) }
  }, [handleActivity])

  /* ── Also watch Supabase auth state (token revoked externally) ── */
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && phase !== 'expired') {
        setPhase('expired')
        setTimeout(() => { window.location.href = '/login' }, 3200)
      }
    })
    return () => subscription.unsubscribe()
  }, [phase])

  return (
    <>
      {children}

      {/* ── Warning overlay (2 min left) ── */}
      {phase === 'warning' && (
        <div className="sg-overlay sg-overlay--warning" role="alertdialog" aria-modal="true">
          <div className="sg-modal animate-scale">
            <div className="sg-icon">⏱️</div>
            <h2>¿Sigues ahí?</h2>
            <p>
              Tu sesión se cerrará por inactividad en{' '}
              <strong className="sg-countdown">
                {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                {String(countdown % 60).padStart(2, '0')}
              </strong>
            </p>
            <div
              className="sg-progress-bar"
              style={{ '--sg-pct': `${(countdown / 120) * 100}%` } as any}
            />
            <button
              className="sg-btn-keep"
              onClick={() => { lastReset.current = Date.now(); resetTimer() }}
              autoFocus
            >
              Continuar sesión
            </button>
          </div>
        </div>
      )}

      {/* ── Expired overlay ── */}
      {phase === 'expired' && (
        <div className="sg-overlay sg-overlay--expired" role="alertdialog" aria-modal="true">
          <div className="sg-modal animate-scale">
            <div className="sg-icon sg-icon--lock">🔒</div>
            <h2>Sesión expirada</h2>
            <p>
              Tu sesión fue cerrada por <strong>30 minutos de inactividad</strong>.
              <br />Redirigiendo al inicio de sesión...
            </p>
            <div className="sg-redirect-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

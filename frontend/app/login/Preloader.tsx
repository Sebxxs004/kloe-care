"use client"
import { useEffect, useState } from 'react'
import './preloader.css'

export default function Preloader() {
  const [phase, setPhase] = useState<'entering' | 'visible' | 'leaving' | 'done'>('entering')

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('visible'), 100)
    const leaveTimer = setTimeout(() => setPhase('leaving'), 1800)
    const doneTimer = setTimeout(() => setPhase('done'), 2400)
    return () => {
      clearTimeout(enterTimer)
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div className={`preloader-overlay preloader-overlay--${phase}`} aria-hidden>
      <div className="preloader-card">
        {/* Pata animada SVG — estilo mascota */}
        <div className="paw-wrapper">
          <svg
            className="paw-svg"
            viewBox="0 0 100 100"
            width="90"
            height="90"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {/* Almohadilla central */}
            <ellipse cx="50" cy="62" rx="20" ry="16" fill="#F97316" className="pad pad-main" />
            {/* Dedo arriba izquierda */}
            <ellipse cx="28" cy="40" rx="9" ry="11" fill="#F97316" className="pad pad-1" transform="rotate(-20 28 40)" />
            {/* Dedo arriba centro-izq */}
            <ellipse cx="42" cy="32" rx="8" ry="10" fill="#F97316" className="pad pad-2" />
            {/* Dedo arriba centro-der */}
            <ellipse cx="58" cy="32" rx="8" ry="10" fill="#F97316" className="pad pad-3" />
            {/* Dedo arriba derecha */}
            <ellipse cx="72" cy="40" rx="9" ry="11" fill="#F97316" className="pad pad-4" transform="rotate(20 72 40)" />
          </svg>
          <div className="paw-glow" />
        </div>
        <div className="preloader-brand">
          <span className="preloader-brand-name">Kloe Care</span>
          <div className="preloader-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </div>
  )
}

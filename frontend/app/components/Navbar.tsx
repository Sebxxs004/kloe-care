'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import './navbar.css'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Inicio',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9" fill="white" stroke={active ? "white" : "none"}/>
      </svg>
    ),
  },
  {
    href: '/salud',
    label: 'Salud',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={active ? 'currentColor' : 'none'}/>
      </svg>
    ),
  },
  {
    href: '/comida',
    label: 'Comida',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 2.5c1.5 1.5 1.5 4 0 5.5l-1.8 1.8 1.4 1.4a2 2 0 0 1 0 2.8l-6.3 6.3a2 2 0 0 1-2.8 0l-2.3-2.3a2 2 0 0 1 0-2.8l6.3-6.3a2 2 0 0 1 2.8 0l1.4 1.4 1.8-1.8c-1.5-1.5-1.5-4 0-5.5z"
          fill={active ? 'currentColor' : 'none'}/>
        <circle cx="6" cy="18" r="1.5" fill={active ? 'white' : 'currentColor'} stroke="none"/>
      </svg>
    ),
  },
  {
    href: '/actividad',
    label: 'Actividad',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={active ? 'currentColor' : 'none'}/>
      </svg>
    ),
  },
  {
    href: '/historial',
    label: 'Historial',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3.043.512m15.086 2.238A9.005 9.005 0 0 1 21 12a9 9 0 0 1-9 9m0 0a9 9 0 0 1-9-9m9 9c1.995 0 3.823-.212 5.633-.643m15.088-2.649A9.01 9.01 0 0 0 12 3.75a9 9 0 0 0-9 9 9 9 0 0 0 .112 1.642m18.657-5.209a.75.75 0 1 0-1.08-1.084l-.5.5a.75.75 0 0 0 1.08 1.084l.5-.5z"
          fill={active ? 'currentColor' : 'none'}/>
      </svg>
    ),
  },
  {
    href: '/bienestar',
    label: 'Bienestar',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" fill={active ? 'currentColor' : 'none'} />
      </svg>
    ),
  },
  {
    href: '/perfil',
    label: 'Perfil',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4" fill={active ? 'currentColor' : 'none'}/>
      </svg>
    ),
  },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop/Tablet: top navbar ── */}
      <nav className="navbar-top" role="navigation" aria-label="Navegación principal">
        <div className="navbar-top-inner">
          <Link href="/dashboard" className="navbar-brand">
            <img src="/images/logo-nobackground.png" alt="Kloe Care" height={34} />
          </Link>
          <ul className="navbar-top-links">
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`navbar-top-link${active ? ' navbar-top-link--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.icon(active)}
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* ── Mobile: bottom navbar ── */}
      <nav className="navbar-bottom" role="navigation" aria-label="Navegación móvil">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-bottom-item${active ? ' navbar-bottom-item--active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="navbar-bottom-icon">
                {item.icon(active)}
              </span>
              <span className="navbar-bottom-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

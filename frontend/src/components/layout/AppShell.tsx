import { NavLink, useLocation } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { NoiseBackground } from '../reactbits/NoiseBackground'

const links = [
  { to: '/', label: 'Feed' },
  { to: '/verify', label: 'Verify News' },
  { to: '/model-showcase', label: 'Model Showcase' },
]

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className={`app-shell ${isHome ? 'home-shell' : ''}`}>
      {!isHome && <NoiseBackground />}
      {!isHome && (
        <nav className="top-nav">
          <div className="brand">Veritas AI</div>
          <div className="nav-links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
      {children}
    </div>
  )
}

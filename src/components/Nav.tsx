import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Теория', icon: '📘', end: true },
  { to: '/glossary', label: 'Словарь', icon: '📚' },
  { to: '/flashcards', label: 'Карточки', icon: '🎴' },
  { to: '/tickets', label: 'Билеты', icon: '🎫' },
  { to: '/profile', label: 'Профиль', icon: '👤' },
]

export function Nav() {
  return (
    <nav className="bottom-nav">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <span className="nav-icon">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}

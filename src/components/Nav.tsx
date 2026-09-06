import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Теория', icon: '📘', end: true, section: 'nav-theory' },
  { to: '/glossary', label: 'Словарь', icon: '📚', section: 'nav-glossary' },
  { to: '/flashcards', label: 'Карточки', icon: '🎴', section: 'nav-flashcards' },
  { to: '/tickets', label: 'Билеты', icon: '🎫', section: 'nav-tickets' },
  { to: '/profile', label: 'Профиль', icon: '👤', section: 'nav-profile' },
]

export function Nav() {
  return (
    <nav className="nav-rail">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) => `${l.section} ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}

import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Теория', end: true },
  { to: '/glossary', label: 'Словарь' },
  { to: '/flashcards', label: 'Карточки' },
  { to: '/profile', label: 'Профиль' },
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
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}

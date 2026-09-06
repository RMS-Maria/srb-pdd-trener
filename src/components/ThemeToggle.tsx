import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button className="icon-toggle icon-toggle--on-brand" onClick={toggle} title="Переключить тему">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

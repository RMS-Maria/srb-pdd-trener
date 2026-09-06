import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../hooks/useProgress'

export function Profile() {
  const { session, configured, signInWithEmail, signOut } = useAuth()
  const { progress } = useProgress()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Отправляем ссылку…')
    const { error } = await signInWithEmail(email)
    setStatus(error ? `Ошибка: ${error}` : 'Ссылка отправлена — проверьте почту.')
  }

  if (!configured) {
    return (
      <div className="card">
        <h2>Профиль</h2>
        <p className="muted">
          Supabase ещё не настроен: добавьте <code>VITE_SUPABASE_URL</code> и{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> в <code>.env.local</code>, чтобы прогресс сохранялся
          и синхронизировался между устройствами.
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="card">
        <h2>Вход по email-ссылке</h2>
        <p className="muted">Без пароля — просто ссылка на почту (magic link).</p>
        <form onSubmit={handleSubmit}>
          <input
            className="text-input"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
            Прислать ссылку для входа
          </button>
        </form>
        {status && <p className="muted">{status}</p>}
      </div>
    )
  }

  const cards = Object.values(progress)
  const totalSeen = cards.length
  const totalWrong = cards.reduce((sum, c) => sum + c.wrong_count, 0)

  return (
    <div className="card">
      <h2>Профиль</h2>
      <p className="muted">{session.user.email}</p>
      <p>Карточек в работе: {totalSeen}</p>
      <p>Всего ошибок зафиксировано: {totalWrong}</p>
      <button className="btn" onClick={signOut}>
        Выйти
      </button>
    </div>
  )
}

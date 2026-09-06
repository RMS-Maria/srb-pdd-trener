import { useEffect, useState } from 'react'
import { Flashcard } from '../components/Flashcard'
import { TypingFlashcard } from '../components/TypingFlashcard'
import { getAllGlossaryCards } from '../lib/content'
import { buildSession } from '../lib/sessionBuilder'
import { hasSerbianVoice, speakSerbian } from '../lib/speech'
import { useProgress } from '../hooks/useProgress'
import type { GlossaryCard } from '../types/content'

type Mode = 'reveal' | 'type'

export function Flashcards() {
  const { progress, loading, recordAnswer, signedIn } = useProgress()
  const [mode, setMode] = useState<Mode>('reveal')
  const [session, setSession] = useState<GlossaryCard[] | null>(null)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    if (!loading && session === null) {
      const cards = getAllGlossaryCards()
      setSession(buildSession(cards, progress))
    }
  }, [loading, session, progress])

  function restart() {
    const cards = getAllGlossaryCards()
    setSession(buildSession(cards, progress))
    setIndex(0)
    setRevealed(false)
    setCorrectCount(0)
  }

  function handleAnswer(current: GlossaryCard, correct: boolean) {
    recordAnswer(current.id, correct)
    if (correct) setCorrectCount((c) => c + 1)
    setRevealed(false)
    setIndex((i) => i + 1)
  }

  if (loading || session === null) {
    return <p className="muted">Загрузка карточек…</p>
  }

  const current = session[index]

  return (
    <div>
      <div className="filter-row">
        <button className={`chip ${mode === 'reveal' ? 'active' : ''}`} onClick={() => setMode('reveal')}>
          👀 Показывать перевод
        </button>
        <button className={`chip ${mode === 'type' ? 'active' : ''}`} onClick={() => setMode('type')}>
          ⌨️ Печатать по-сербски
        </button>
      </div>

      {!current ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>На сегодня хватит! 🎉</h2>
          <p>
            Пройдено карточек: {session.length}, верно: {correctCount}.
          </p>
          {!signedIn && (
            <p className="muted">
              Прогресс не сохранён — войдите на странице «Профиль» по email-ссылке, чтобы карточки
              запоминали ваши ошибки между сессиями.
            </p>
          )}
          <button className="btn btn-primary" onClick={restart}>
            Начать ещё одну сессию
          </button>
        </div>
      ) : (
        <div>
          <p className="muted">
            Карточка {index + 1} из {session.length}
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{ width: `${(index / session.length) * 100}%` }}
            />
          </div>
          {!hasSerbianVoice() && (
            <p className="muted">
              ⚠️ В этом браузере не найден сербский голос для озвучки — качество/доступность зависит
              от браузера и ОС.
            </p>
          )}
          {mode === 'reveal' ? (
            <Flashcard
              key={current.id}
              card={current}
              revealed={revealed}
              onReveal={() => setRevealed(true)}
              onAnswer={(correct) => handleAnswer(current, correct)}
              onSpeak={() => speakSerbian(current.audio_text)}
            />
          ) : (
            <TypingFlashcard
              key={current.id}
              card={current}
              onAnswer={(correct) => handleAnswer(current, correct)}
              onSpeak={() => speakSerbian(current.audio_text)}
            />
          )}
        </div>
      )}
    </div>
  )
}

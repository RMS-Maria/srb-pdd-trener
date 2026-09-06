import { useState } from 'react'
import { answersMatch } from '../lib/answerCheck'
import { pickScript, useScript } from '../context/ScriptContext'
import { STATUS_LABELS, statusClass, TRAP_TYPE_LABELS } from '../lib/labels'
import type { GlossaryCard } from '../types/content'

interface Props {
  card: GlossaryCard
  onAnswer: (correct: boolean) => void
  onSpeak: () => void
}

/** Обратное направление: показываем русский перевод, пользователь печатает сербское слово вручную. */
export function TypingFlashcard({ card, onAnswer, onSpeak }: Props) {
  const { script } = useScript()
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState<boolean | null>(null)
  const correctWord = pickScript(script, card.sr_latin, card.sr_cyrillic)

  function submit() {
    if (checked !== null || !value.trim()) return
    const correct = answersMatch(value, card.sr_latin)
    setChecked(correct)
  }

  function proceed() {
    onAnswer(checked === true)
  }

  return (
    <div className="card flashcard">
      {card.tier === 'trap' && (
        <span className="trap-badge">
          {card.trap_type ? TRAP_TYPE_LABELS[card.trap_type] : '⚠️ типичная ловушка'}
        </span>
      )}

      <div className="flashcard__word">{card.ru_translation}</div>
      <p className="muted">Напечатайте это по-сербски (латиница или кириллица — без разницы)</p>

      <input
        className="text-input"
        placeholder="Впишите ответ…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        disabled={checked !== null}
        autoFocus
      />

      {checked === null && (
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={submit}>
          Проверить
        </button>
      )}

      {checked !== null && (
        <div>
          <p>
            {checked ? '✅ Верно!' : '❌ Не совсем.'} Правильный ответ: <strong>{correctWord}</strong>
            {card.status && (
              <span className={statusClass(card.status)} title={STATUS_LABELS[card.status]}>
                {STATUS_LABELS[card.status]}
              </span>
            )}
          </p>
          <button className="icon-toggle" onClick={onSpeak} title="Произнести">
            🔊 звук
          </button>
          <p className="muted">{card.example_sr}</p>
          <p className="muted">{card.example_ru}</p>
          {card.danger_note && <p className="callout callout-warning">{card.danger_note}</p>}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.6rem' }} onClick={proceed}>
            Дальше →
          </button>
        </div>
      )}
    </div>
  )
}

import { pickScript, useScript } from '../context/ScriptContext'
import { STATUS_LABELS, statusClass, TRAP_TYPE_LABELS } from '../lib/labels'
import type { GlossaryCard } from '../types/content'

interface Props {
  card: GlossaryCard
  revealed: boolean
  onReveal: () => void
  onAnswer: (correct: boolean) => void
  onSpeak: () => void
}

export function Flashcard({ card, revealed, onReveal, onAnswer, onSpeak }: Props) {
  const { script } = useScript()
  const word = pickScript(script, card.sr_latin, card.sr_cyrillic)

  return (
    <div className="card flashcard">
      {card.tier === 'trap' && (
        <span className="trap-badge">
          {card.trap_type ? TRAP_TYPE_LABELS[card.trap_type] : '⚠️ типичная ловушка'}
        </span>
      )}

      {card.image && (
        <img
          className="flashcard__image"
          src={`${import.meta.env.BASE_URL}${card.image}`}
          alt=""
        />
      )}

      <div className="flashcard__word">{word}</div>
      <button className="icon-toggle" onClick={onSpeak} title="Произнести">
        🔊 звук
      </button>

      {!revealed && (
        <button className="btn btn-primary" onClick={onReveal}>
          Показать перевод
        </button>
      )}

      {revealed && (
        <div>
          <p>
            <strong>{card.ru_translation}</strong>
            {card.status && (
              <span className={statusClass(card.status)} title={STATUS_LABELS[card.status]}>
                {STATUS_LABELS[card.status]}
              </span>
            )}
          </p>
          <p className="muted">{card.example_sr}</p>
          <p className="muted">{card.example_ru}</p>
          {card.danger_note && <p className="callout callout-warning">{card.danger_note}</p>}
        </div>
      )}

      {revealed && (
        <div className="flashcard__answers">
          <button className="btn btn-wrong" onClick={() => onAnswer(false)}>
            Не вспомнил
          </button>
          <button className="btn btn-correct" onClick={() => onAnswer(true)}>
            Вспомнил
          </button>
        </div>
      )}
    </div>
  )
}

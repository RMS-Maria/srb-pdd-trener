import { useState } from 'react'
import { getRoadSignById, getTicketQuestions } from '../lib/content'
import { answersMatch } from '../lib/answerCheck'
import { STATUS_LABELS, statusClass } from '../lib/labels'
import { SignIcon } from '../components/SignIcon'
import type { TicketQuestion } from '../types/content'

type Mode = 'choice' | 'type'

function QuestionSign({ signId }: { signId: string }) {
  const sign = getRoadSignById(signId)
  if (!sign) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
      <SignIcon shape={sign.shape} symbol={sign.symbol} size={96} />
    </div>
  )
}

function ChoiceQuestion({ q, onDone }: { q: TicketQuestion; onDone: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null)

  function pick(i: number) {
    if (selected !== null) return
    setSelected(i)
    onDone(i === q.correct_index)
  }

  return (
    <div className="card">
      {q.status && (
        <span className={statusClass(q.status)} title={STATUS_LABELS[q.status]}>
          {STATUS_LABELS[q.status]}
        </span>
      )}
      {q.sign_id && <QuestionSign signId={q.sign_id} />}
      <p className="ticket__question">{q.question}</p>
      <div className="ticket__options">
        {q.options.map((opt, i) => {
          let cls = 'ticket-option'
          if (selected !== null) {
            if (i === q.correct_index) cls += ' ticket-option--correct'
            else if (i === selected) cls += ' ticket-option--wrong'
          }
          return (
            <button key={i} className={cls} onClick={() => pick(i)}>
              {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div className={`callout ${selected === q.correct_index ? '' : 'callout-warning'}`}>
          {q.question_translation && <p className="muted">{q.question_translation}</p>}
          <p>{q.explanation}</p>
          {q.source && (
            <p className="muted">
              Источник: {q.source.document}
              {q.source.article ? `, ${q.source.article}` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function TypeQuestion({ q, onDone }: { q: TicketQuestion; onDone: (correct: boolean) => void }) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState<boolean | null>(null)

  function submit() {
    if (checked !== null || !value.trim()) return
    const correct = answersMatch(value, q.answer)
    setChecked(correct)
    onDone(correct)
  }

  return (
    <div className="card">
      {q.status && (
        <span className={statusClass(q.status)} title={STATUS_LABELS[q.status]}>
          {STATUS_LABELS[q.status]}
        </span>
      )}
      {q.sign_id && <QuestionSign signId={q.sign_id} />}
      <p className="ticket__question">{q.question}</p>
      <input
        className="text-input"
        placeholder="Впишите ответ вручную…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        disabled={checked !== null}
      />
      {checked === null && (
        <button className="btn btn-primary" style={{ marginTop: '0.6rem', width: '100%' }} onClick={submit}>
          Проверить
        </button>
      )}
      {checked !== null && (
        <div className={`callout ${checked ? '' : 'callout-warning'}`} style={{ marginTop: '0.6rem' }}>
          <p>
            {checked ? '✅ Верно!' : '❌ Не совсем.'} Правильный ответ: <strong>{q.answer}</strong>
          </p>
          {q.question_translation && <p className="muted">{q.question_translation}</p>}
          <p>{q.explanation}</p>
        </div>
      )}
    </div>
  )
}

export function Tickets() {
  const questions = getTicketQuestions()
  const [mode, setMode] = useState<Mode>('choice')
  const [choiceIndex, setChoiceIndex] = useState(0)
  const [typeIndex, setTypeIndex] = useState(0)
  const [choiceScore, setChoiceScore] = useState({ correct: 0, seen: 0 })
  const [typeScore, setTypeScore] = useState({ correct: 0, seen: 0 })

  const index = mode === 'choice' ? choiceIndex : typeIndex
  const score = mode === 'choice' ? choiceScore : typeScore
  const current = questions[index]

  function handleDone(correct: boolean) {
    const setScore = mode === 'choice' ? setChoiceScore : setTypeScore
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), seen: s.seen + 1 }))
  }

  function next() {
    const setIndex = mode === 'choice' ? setChoiceIndex : setTypeIndex
    setIndex((i) => i + 1)
  }

  function restart() {
    const setIndex = mode === 'choice' ? setChoiceIndex : setTypeIndex
    const setScore = mode === 'choice' ? setChoiceScore : setTypeScore
    setIndex(0)
    setScore({ correct: 0, seen: 0 })
  }

  return (
    <div>
      <div className="filter-row">
        <button className={`chip ${mode === 'choice' ? 'active' : ''}`} onClick={() => setMode('choice')}>
          ✅ Выбрать ответ
        </button>
        <button className={`chip ${mode === 'type' ? 'active' : ''}`} onClick={() => setMode('type')}>
          ⌨️ Напечатать ответ
        </button>
      </div>

      <p className="muted">
        Вопрос {Math.min(index + 1, questions.length)} из {questions.length} · верно {score.correct} из{' '}
        {score.seen}
      </p>
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>

      {!current ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Билеты пройдены! 🎉</h2>
          <p>
            Результат: {score.correct} из {score.seen}.
          </p>
          <button className="btn btn-primary" onClick={restart}>
            Пройти ещё раз
          </button>
        </div>
      ) : mode === 'choice' ? (
        <ChoiceQuestion key={current.id} q={current} onDone={handleDone} />
      ) : (
        <TypeQuestion key={current.id} q={current} onDone={handleDone} />
      )}

      {current && (
        <button className="btn" style={{ width: '100%' }} onClick={next}>
          Следующий вопрос →
        </button>
      )}
    </div>
  )
}

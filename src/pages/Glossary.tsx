import { useMemo, useState } from 'react'
import { getAllGlossaryCards } from '../lib/content'
import { pickScript, useScript } from '../context/ScriptContext'
import {
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  STATUS_LABELS,
  statusClass,
  TRAP_TYPE_LABELS,
} from '../lib/labels'
import type { ExamPriority, Tier } from '../types/content'

const TIER_LABELS: Record<Tier, string> = {
  frequency: 'Tier 0 — база',
  mandatory: 'Tier 1 — термины ПДД',
  trap: 'Tier 2 — ловушки',
  technical: 'Tier 3 — техника',
  safety: 'Tier 4 — безопасность',
  exam_phrase: 'Tier 5 — фразы экзаменатора',
  listening: 'Tier 6 — на слух',
}

export function Glossary() {
  const { script } = useScript()
  const allCards = getAllGlossaryCards()
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<ExamPriority | 'all'>('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const availableTiers = useMemo(
    () => Array.from(new Set(allCards.map((c) => c.tier))),
    [allCards],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allCards.filter((c) => {
      if (tierFilter !== 'all' && c.tier !== tierFilter) return false
      if (priorityFilter !== 'all' && (c.exam_priority ?? 'medium') !== priorityFilter) return false
      if (!q) return true
      return (
        c.sr_latin.toLowerCase().includes(q) ||
        c.sr_cyrillic.toLowerCase().includes(q) ||
        c.ru_translation.toLowerCase().includes(q)
      )
    })
  }, [allCards, tierFilter, priorityFilter, query])

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <input
        className="search-input"
        placeholder="Поиск: rus или srpski (латиница/ћирилица)…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="filter-row">
        <button
          className={`chip ${tierFilter === 'all' ? 'active' : ''}`}
          onClick={() => setTierFilter('all')}
        >
          Все темы
        </button>
        {availableTiers.map((t) => (
          <button
            key={t}
            className={`chip ${tierFilter === t ? 'active' : ''}`}
            onClick={() => setTierFilter(t)}
          >
            {TIER_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="filter-row">
        <button
          className={`chip ${priorityFilter === 'all' ? 'active' : ''}`}
          onClick={() => setPriorityFilter('all')}
        >
          Любая важность
        </button>
        {PRIORITY_ORDER.map((p) => (
          <button
            key={p}
            className={`chip ${priorityFilter === p ? 'active' : ''}`}
            onClick={() => setPriorityFilter(p)}
          >
            {PRIORITY_LABELS[p]}
          </button>
        ))}
      </div>

      <p className="muted">{filtered.length} терминов — тапните слово, чтобы увидеть пример и разбор</p>

      <div className="word-list">
        {filtered.map((card) => {
          const isOpen = expanded.has(card.id)
          const priority = card.exam_priority ?? 'medium'
          return (
            <div className="word-row" key={card.id}>
              <button className="word-row__main" onClick={() => toggle(card.id)}>
                <span className="word-row__srb">
                  {pickScript(script, card.sr_latin, card.sr_cyrillic)}
                </span>
                <span className="word-row__ru">{card.ru_translation}</span>
                <span className={`priority-dot priority-dot--${priority}`} title={PRIORITY_LABELS[priority]} />
              </button>

              {isOpen && (
                <div className="word-row__details">
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
                  <p className="muted">{card.example_sr}</p>
                  <p className="muted">{card.example_ru}</p>
                  {card.danger_note && <p className="callout callout-warning">{card.danger_note}</p>}
                  {card.source && (
                    <p className="muted">
                      Источник: {card.source.document}
                      {card.source.article ? `, ${card.source.article}` : ''}
                    </p>
                  )}
                  {card.status && (
                    <span className={statusClass(card.status)} title={STATUS_LABELS[card.status]}>
                      {STATUS_LABELS[card.status]}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

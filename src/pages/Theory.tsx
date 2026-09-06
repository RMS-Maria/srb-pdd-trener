import { getTheoryTopics } from '../lib/content'
import { TermInline } from '../components/TermInline'
import { AlphabetGuide } from '../components/AlphabetGuide'
import { STATUS_LABELS, statusClass } from '../lib/labels'
import { useState } from 'react'

export function Theory() {
  const topics = getTheoryTopics()
  const [activeId, setActiveId] = useState(topics[0]?.id)
  const active = topics.find((t) => t.id === activeId) ?? topics[0]

  return (
    <div>
      <AlphabetGuide />

      <div className="filter-row">
        {topics.map((t) => (
          <button
            key={t.id}
            className={`chip ${t.id === active.id ? 'active' : ''}`}
            onClick={() => setActiveId(t.id)}
          >
            {t.order}. {t.title_ru}
          </button>
        ))}
      </div>

      <h2>{active.title_sr}</h2>
      <p className="muted">{active.title_ru}</p>

      {active.sections.map((section, i) => (
        <div className="card" key={i}>
          <h3>
            {section.heading}
            {section.status && (
              <span className={statusClass(section.status)} title={STATUS_LABELS[section.status]}>
                {STATUS_LABELS[section.status]}
              </span>
            )}
          </h3>
          <p>{section.body_sr}</p>
          <p className="muted">{section.body_ru}</p>
          {section.source && (
            <p className="muted">
              Источник: {section.source.document}
              {section.source.article ? `, ${section.source.article}` : ''}
            </p>
          )}
          {section.diagram && <pre className="theory-diagram">{section.diagram}</pre>}
          {section.terms.length > 0 && (
            <div>
              <p className="muted">Тапните термин, чтобы увидеть перевод:</p>
              <div className="filter-row">
                {section.terms.map((term) => (
                  <TermInline key={term.sr_latin} term={term} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

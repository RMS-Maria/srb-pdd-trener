import { useState } from 'react'
import { getGlossaryCardById } from '../lib/content'
import { pickScript, useScript } from '../context/ScriptContext'
import { TRAP_TYPE_LABELS } from '../lib/labels'
import type { TheoryTerm } from '../types/content'

export function TermInline({ term }: { term: TheoryTerm }) {
  const { script } = useScript()
  const [revealed, setRevealed] = useState(false)
  const linkedCard = term.glossary_id ? getGlossaryCardById(term.glossary_id) : undefined
  const isTrap = linkedCard?.tier === 'trap'

  return (
    <span>
      <button
        type="button"
        className="term-inline"
        onClick={() => setRevealed((r) => !r)}
        aria-expanded={revealed}
      >
        {pickScript(script, term.sr_latin, term.sr_cyrillic)}
      </button>
      {revealed && (
        <span className="term-inline__reveal">
          {isTrap && (
            <span className="trap-badge">
              {linkedCard?.trap_type ? TRAP_TYPE_LABELS[linkedCard.trap_type] : '⚠️ ловушка'}
            </span>
          )}
          <br />
          {term.ru_translation}
          {isTrap && linkedCard?.danger_note && (
            <span className="callout callout-warning" style={{ display: 'block' }}>
              {linkedCard.danger_note}
            </span>
          )}
        </span>
      )}
    </span>
  )
}

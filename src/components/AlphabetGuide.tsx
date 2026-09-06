import { useState } from 'react'
import { getLatinAlphabetGuide } from '../lib/content'
import { pickScript, useScript } from '../context/ScriptContext'

/**
 * Справочник по буквам сербской латиницы, которых нет в русском.
 * Не карточка для заучивания — просто разовая подсказка для чтения текстов ниже.
 */
export function AlphabetGuide() {
  const { script } = useScript()
  const [open, setOpen] = useState(false)
  const letters = getLatinAlphabetGuide()

  return (
    <div className="card callout-info">
      <button className="callout-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>ℹ️ Буквы сербской латиницы, которых нет в русском</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="alphabet-grid">
          {letters.map((l) => (
            <div key={l.letter} className="alphabet-grid__item">
              <span className="alphabet-grid__letter">
                {pickScript(script, l.letter, l.cyrillic)}
              </span>
              <span className="muted">{l.note}</span>
              <span className="muted">
                {l.example_sr} — {l.example_ru}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

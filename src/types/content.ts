export type Tier =
  | 'frequency' // Tier 0
  | 'mandatory' // Tier 1
  | 'trap' // Tier 2
  | 'technical' // Tier 3
  | 'safety' // Tier 4
  | 'exam_phrase' // Tier 5
  | 'listening' // Tier 6

/** Подтип для tier="trap" — не всё в этом tier одна и та же лингвистическая проблема. */
export type TrapType =
  | 'false_friend' // форма обманывает: похоже на русское слово с другим смыслом
  | 'polysemy' // одно сербское слово покрывает то, что в русском — два разных слова
  | 'similar_word' // похожие по звучанию/написанию, но не вводящие в заблуждение по смыслу
  | 'exam_language' // модальность/конструкции теста: mora, ne sme, samo, najviše...
  | 'negation' // конкретно отрицание внутри формулировки — своя категория ошибок
  | 'collocation' // устойчивое словосочетание, которое нельзя учить по словам

/** Насколько термин важен именно для сдачи экзамена — независимо от tier. */
export type ExamPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * Откуда взято утверждение и насколько ему можно доверять. Это отдельно от переводов —
 * без этого поля через сотни карточек невозможно отличить проверенную по закону формулировку
 * от собственной педагогической догадки.
 */
export type SourceType = 'law' | 'regulation' | 'official_exam' | 'lexical' | 'driving_school' | 'community'

export type ContentStatus =
  | 'verified_official' // подтверждено текстом закона/правилника
  | 'verified_lexical' // подтверждено как факт языка (не юридический термин)
  | 'verified_exam' // подтверждено официальным документом об экзамене
  | 'community_reported' // встречается на форумах/у автошкол, без официального подтверждения
  | 'pedagogical' // упрощение для обучения, сознательно не юридическая формулировка
  | 'needs_review' // пока не проверено — не считать окончательным

export interface Source {
  type: SourceType
  document?: string
  article?: string
  url?: string
  checked_at?: string // YYYY-MM-DD
}

export interface GlossaryCard {
  id: string
  sr_latin: string
  sr_cyrillic: string
  ru_translation: string
  tier: Tier
  trap_type?: TrapType
  exam_priority?: ExamPriority
  topic: string
  example_sr: string
  example_ru: string
  danger_note?: string
  audio_text: string
  image?: string | null
  source?: Source
  status?: ContentStatus
}

export interface TheoryTerm {
  sr_latin: string
  sr_cyrillic: string
  ru_translation: string
  glossary_id?: string
}

export interface TheorySection {
  heading: string
  body_sr: string
  body_ru: string
  terms: TheoryTerm[]
  /** Если раздел опирается на юридическое определение — источник указывается здесь. */
  source?: Source
  status?: ContentStatus
  /** Простая текстовая схема/иерархия (моноширинный блок), когда структуру полезнее видеть, чем читать абзацем. */
  diagram?: string
}

export interface TheoryTopic {
  id: string
  order: number
  title_sr: string
  title_ru: string
  sections: TheorySection[]
}

export interface TicketQuestion {
  id: string
  topic: string
  question: string
  question_translation?: string
  options: string[]
  correct_index: number
  /** Канонический ответ для режима «напечатать» — сравнивается мягко (без диакритики, кириллица тоже принимается). */
  answer: string
  explanation: string
  source?: Source
  status?: ContentStatus
}

export interface AlphabetLetter {
  letter: string
  cyrillic: string
  note: string
  example_sr: string
  example_ru: string
}

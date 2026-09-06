export interface CardProgress {
  card_id: string
  correct_streak: number
  wrong_count: number
  last_seen: string | null // ISO timestamp
  next_due: string // ISO timestamp
  ease: number
  interval_days: number
}

const MIN_EASE = 1.3
const MAX_EASE = 3.0
const DEFAULT_EASE = 2.5

export function newProgress(cardId: string, now: Date = new Date()): CardProgress {
  return {
    card_id: cardId,
    correct_streak: 0,
    wrong_count: 0,
    last_seen: null,
    next_due: now.toISOString(),
    ease: DEFAULT_EASE,
    interval_days: 0,
  }
}

/** Упрощённый SM-2: правильный ответ растит интервал, ошибка почти сразу возвращает карточку. */
export function applyAnswer(
  progress: CardProgress,
  correct: boolean,
  now: Date = new Date(),
): CardProgress {
  if (correct) {
    const correct_streak = progress.correct_streak + 1
    const ease = Math.min(MAX_EASE, progress.ease + 0.1)
    const interval_days =
      progress.interval_days === 0 ? 1 : Math.round(progress.interval_days * ease)
    const next_due = new Date(now.getTime() + interval_days * 24 * 60 * 60 * 1000)
    return {
      ...progress,
      correct_streak,
      ease,
      interval_days,
      last_seen: now.toISOString(),
      next_due: next_due.toISOString(),
    }
  }

  return {
    ...progress,
    correct_streak: 0,
    wrong_count: progress.wrong_count + 1,
    ease: Math.max(MIN_EASE, progress.ease - 0.2),
    interval_days: 0,
    last_seen: now.toISOString(),
    // Карточка возвращается почти сразу — в этой же или следующей сессии.
    next_due: now.toISOString(),
  }
}

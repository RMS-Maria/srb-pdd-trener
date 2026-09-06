import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { applyAnswer, newProgress, type CardProgress } from '../lib/srs'

type ProgressMap = Record<string, CardProgress>

interface DbRow {
  card_id: string
  correct_streak: number
  wrong_count: number
  last_seen: string | null
  next_due: string
  ease: number
  interval_days: number
}

function rowToProgress(row: DbRow): CardProgress {
  return {
    card_id: row.card_id,
    correct_streak: row.correct_streak,
    wrong_count: row.wrong_count,
    last_seen: row.last_seen,
    next_due: row.next_due,
    ease: row.ease,
    interval_days: row.interval_days,
  }
}

/** Прогресс по карточкам: читает/пишет card_progress в Supabase для залогиненного пользователя. */
export function useProgress() {
  const { session, configured } = useAuth()
  const [progress, setProgress] = useState<ProgressMap>({})
  const [loading, setLoading] = useState(Boolean(session))

  const userId = session?.user.id ?? null

  useEffect(() => {
    if (!configured || !userId) {
      setProgress({})
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('card_progress')
      .select('card_id, correct_streak, wrong_count, last_seen, next_due, ease, interval_days')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data) {
          const map: ProgressMap = {}
          for (const row of data as DbRow[]) {
            map[row.card_id] = rowToProgress(row)
          }
          setProgress(map)
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [configured, userId])

  const recordAnswer = useCallback(
    async (cardId: string, correct: boolean) => {
      const now = new Date()
      const existing = progress[cardId] ?? newProgress(cardId, now)
      const updated = applyAnswer(existing, correct, now)

      setProgress((prev) => ({ ...prev, [cardId]: updated }))

      if (configured && userId) {
        await supabase.from('card_progress').upsert({
          user_id: userId,
          card_id: updated.card_id,
          correct_streak: updated.correct_streak,
          wrong_count: updated.wrong_count,
          last_seen: updated.last_seen,
          next_due: updated.next_due,
          ease: updated.ease,
          interval_days: updated.interval_days,
          updated_at: now.toISOString(),
        })
      }
    },
    [configured, userId, progress],
  )

  return { progress, loading, recordAnswer, signedIn: Boolean(userId) }
}

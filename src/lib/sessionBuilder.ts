import type { ExamPriority, GlossaryCard, Tier } from '../types/content'
import type { CardProgress } from './srs'

const EXAM_PRIORITY_RANK: Record<ExamPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

function priorityRank(card: GlossaryCard): number {
  return card.exam_priority ? EXAM_PRIORITY_RANK[card.exam_priority] : EXAM_PRIORITY_RANK.medium
}

export interface SessionOptions {
  maxNewCards?: number
  totalCap?: number
  now?: Date
}

/**
 * Приоритет и вес новых карточек по tier. Пользователь готовится к экзамену, а не к
 * разговорному сербскому — поэтому обязательные термины ПДД, ловушки и экзаменационная
 * грамматика должны появляться с первой же сессии, а не после того как исчерпан весь
 * Tier 0. Вес 2 значит «через карточку» относительно tier с весом 1, а не «сначала всё».
 */
const NEW_CARD_TIER_ORDER: Tier[] = [
  'mandatory',
  'trap',
  'exam_phrase',
  'frequency',
  'safety',
  'technical',
  'listening',
]
const NEW_CARD_TIER_WEIGHT: Partial<Record<Tier, number>> = {
  mandatory: 2,
  trap: 2,
  frequency: 1,
}

function interleaveNewCards(brandNew: GlossaryCard[], budget: number): GlossaryCard[] {
  const groups = new Map<Tier, GlossaryCard[]>()
  for (const card of brandNew) {
    if (!groups.has(card.tier)) groups.set(card.tier, [])
    groups.get(card.tier)!.push(card)
  }
  // Внутри каждого tier — сначала critical/high exam_priority, а не порядок в файле.
  for (const group of groups.values()) {
    group.sort((a, b) => priorityRank(a) - priorityRank(b))
  }
  const order = NEW_CARD_TIER_ORDER.filter((t) => groups.has(t))

  const result: GlossaryCard[] = []
  while (result.length < budget && order.some((t) => groups.get(t)!.length > 0)) {
    for (const tier of order) {
      const weight = NEW_CARD_TIER_WEIGHT[tier] ?? 1
      const group = groups.get(tier)!
      for (let i = 0; i < weight && group.length > 0 && result.length < budget; i++) {
        result.push(group.shift()!)
      }
      if (result.length >= budget) break
    }
  }
  return result
}

/** Порядок: просроченные due-карточки -> карточки с частыми ошибками -> новые (с приоритетом по tier). */
export function buildSession(
  cards: GlossaryCard[],
  progressByCardId: Record<string, CardProgress>,
  opts: SessionOptions = {},
): GlossaryCard[] {
  const maxNewCards = opts.maxNewCards ?? 12
  const totalCap = opts.totalCap ?? 25
  const now = opts.now ?? new Date()

  const due: GlossaryCard[] = []
  const wrongNotDue: GlossaryCard[] = []
  const brandNew: GlossaryCard[] = []

  for (const card of cards) {
    const progress = progressByCardId[card.id]
    if (!progress) {
      brandNew.push(card)
      continue
    }
    if (new Date(progress.next_due) <= now) {
      due.push(card)
    } else if (progress.wrong_count > 0) {
      wrongNotDue.push(card)
    }
  }

  wrongNotDue.sort(
    (a, b) => progressByCardId[b.id].wrong_count - progressByCardId[a.id].wrong_count,
  )

  const remainingAfterReview = Math.max(0, totalCap - due.length - wrongNotDue.length)
  const newBudget = Math.min(maxNewCards, remainingAfterReview)

  return [...due, ...wrongNotDue, ...interleaveNewCards(brandNew, newBudget)]
}

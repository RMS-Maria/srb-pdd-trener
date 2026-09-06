import type { ContentStatus, ExamPriority, TrapType } from '../types/content'

export const PRIORITY_LABELS: Record<ExamPriority, string> = {
  critical: '🔴 критично',
  high: '🟠 очень важно',
  medium: '🟡 важно',
  low: '⚪ пригодится',
}

export const PRIORITY_ORDER: ExamPriority[] = ['critical', 'high', 'medium', 'low']

export const TRAP_TYPE_LABELS: Record<TrapType, string> = {
  false_friend: '⚠️ ложный друг',
  polysemy: '🔀 многозначность',
  similar_word: '🔤 похожее слово',
  exam_language: '📝 экзаменационная грамматика',
  negation: '🚫 отрицание',
  collocation: '🔗 устойчивое сочетание',
}

export const STATUS_LABELS: Record<ContentStatus, string> = {
  verified_official: '✓ по тексту закона/правилника',
  verified_lexical: '✓ проверено как факт языка',
  verified_exam: '✓ по документу об экзамене',
  community_reported: 'по опыту автошкол/форумов, не официально',
  pedagogical: 'учебное упрощение, не цитата закона',
  needs_review: '⚠ пока не сверено — не считайте окончательным',
}

export function statusClass(status?: ContentStatus): string {
  if (!status) return ''
  if (status === 'verified_official' || status === 'verified_exam') return 'status-chip status-chip--verified'
  if (status === 'needs_review') return 'status-chip status-chip--review'
  return 'status-chip'
}

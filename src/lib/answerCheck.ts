const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z',
  и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c',
  ч: 'č', џ: 'dž', ш: 'š',
}

function cyrillicToLatin(input: string): string {
  return input
    .split('')
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join('')
}

/** Убирает диакритику для мягкого сравнения — печатать č/ć/š/ž/đ на русской раскладке неудобно. */
function stripDiacritics(input: string): string {
  return input
    .replace(/đ/g, 'dj')
    .replace(/[čć]/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
}

export function normalizeAnswer(input: string): string {
  return stripDiacritics(cyrillicToLatin(input.toLowerCase()))
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function answersMatch(userInput: string, canonicalAnswer: string): boolean {
  const normalizedUser = normalizeAnswer(userInput)
  if (!normalizedUser) return false
  return normalizedUser === normalizeAnswer(canonicalAnswer)
}

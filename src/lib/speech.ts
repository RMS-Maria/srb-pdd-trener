let cachedSerbianVoice: SpeechSynthesisVoice | null | undefined

function findSerbianVoice(): SpeechSynthesisVoice | null {
  if (cachedSerbianVoice !== undefined) return cachedSerbianVoice
  const voices = window.speechSynthesis?.getVoices() ?? []
  const match =
    voices.find((v) => v.lang?.toLowerCase().startsWith('sr')) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('hr')) || // хорватский голос произносит близко к сербскому
    null
  cachedSerbianVoice = match
  return match
}

export function hasSerbianVoice(): boolean {
  return findSerbianVoice() !== null
}

export function speakSerbian(text: string) {
  if (!('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = findSerbianVoice()
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  } else {
    utterance.lang = 'sr-RS'
  }
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

// Список голосов у некоторых браузеров подгружается асинхронно.
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedSerbianVoice = undefined
  }
}

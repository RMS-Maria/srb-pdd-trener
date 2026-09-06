import type { AlphabetLetter, GlossaryCard, TheoryTopic, TicketQuestion } from '../types/content'

const glossaryModules = import.meta.glob('../../content/glossary/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, GlossaryCard[]>

const theoryModules = import.meta.glob('../../content/theory/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, TheoryTopic>

const alphabetModule = import.meta.glob('../../content/reference/latin-alphabet.json', {
  eager: true,
  import: 'default',
}) as Record<string, AlphabetLetter[]>

const ticketModules = import.meta.glob('../../content/questions/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, TicketQuestion[]>

export function getAllGlossaryCards(): GlossaryCard[] {
  return Object.values(glossaryModules).flat()
}

export function getTheoryTopics(): TheoryTopic[] {
  return Object.values(theoryModules).sort((a, b) => a.order - b.order)
}

export function getGlossaryCardById(id: string): GlossaryCard | undefined {
  return getAllGlossaryCards().find((c) => c.id === id)
}

export function getLatinAlphabetGuide(): AlphabetLetter[] {
  return Object.values(alphabetModule)[0] ?? []
}

export function getTicketQuestions(): TicketQuestion[] {
  return Object.values(ticketModules).flat()
}

import type { GrammarLesson } from './grammar.ts'
import { japaneseGrammar } from './ja/grammar.ts'

/** Gramática de cada curso. Los cursos «próximamente» aún no tienen. */
export const grammarByCourse: Record<string, GrammarLesson[]> = {
  ja: japaneseGrammar,
}

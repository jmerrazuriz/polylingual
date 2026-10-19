import type { GrammarLesson } from '../grammar.ts'
import { grammarA1a } from './grammarA1a.ts'
import { grammarA1b } from './grammarA1b.ts'

/** Gramática del italiano, por nivel (La strada di Lucca). */
export const italianGrammar: GrammarLesson[] = [...grammarA1a, ...grammarA1b]

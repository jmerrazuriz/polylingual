import type { GrammarLesson } from '../grammar.ts'
import { grammarA1a } from './grammarA1a.ts'
import { grammarA1b } from './grammarA1b.ts'

/** Gramática del alemán, en el orden del recorrido por nivel. */
export const germanGrammar: GrammarLesson[] = [...grammarA1a, ...grammarA1b]

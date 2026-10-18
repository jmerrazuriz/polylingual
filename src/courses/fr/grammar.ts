import type { GrammarLesson } from '../grammar.ts'
import { grammarA1a } from './grammarA1a.ts'
import { grammarA1b } from './grammarA1b.ts'

/** Gramática del francés, por nivel (Le chemin de Camila). */
export const frenchGrammar: GrammarLesson[] = [...grammarA1a, ...grammarA1b]

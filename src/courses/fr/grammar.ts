import type { GrammarLesson } from '../grammar.ts'
import { grammarA1a } from './grammarA1a.ts'
import { grammarA1b } from './grammarA1b.ts'
import { grammarA2a } from './grammarA2a.ts'
import { grammarA2b } from './grammarA2b.ts'

/** Gramática del francés, por nivel (Le chemin de Camila). */
export const frenchGrammar: GrammarLesson[] = [...grammarA1a, ...grammarA1b, ...grammarA2a, ...grammarA2b]

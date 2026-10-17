import type { GrammarLesson } from '../grammar.ts'
import { grammarA1a } from './grammarA1a.ts'
import { grammarA1b } from './grammarA1b.ts'
import { grammarA2a } from './grammarA2a.ts'
import { grammarA2b } from './grammarA2b.ts'
import { grammarB1a } from './grammarB1a.ts'
import { grammarB1b } from './grammarB1b.ts'
import { grammarB1c } from './grammarB1c.ts'

/** Gramática del alemán, en el orden del recorrido por nivel. */
export const germanGrammar: GrammarLesson[] = [...grammarA1a, ...grammarA1b, ...grammarA2a, ...grammarA2b, ...grammarB1a, ...grammarB1b, ...grammarB1c]

import type { GrammarLesson } from '../grammar.ts'
import { grammarA1a } from './grammarA1a.ts'
import { grammarA1b } from './grammarA1b.ts'
import { grammarA2a } from './grammarA2a.ts'
import { grammarA2b } from './grammarA2b.ts'
import { grammarB1a } from './grammarB1a.ts'
import { grammarB1b } from './grammarB1b.ts'
import { grammarB1c } from './grammarB1c.ts'
import { grammarB2a } from './grammarB2a.ts'
import { grammarB2b } from './grammarB2b.ts'
import { grammarB2c } from './grammarB2c.ts'
import { grammarC1a } from './grammarC1a.ts'
import { grammarC1b } from './grammarC1b.ts'
import { grammarC1c } from './grammarC1c.ts'

/** Gramática del alemán, en el orden del recorrido por nivel. */
export const germanGrammar: GrammarLesson[] = [...grammarA1a, ...grammarA1b, ...grammarA2a, ...grammarA2b, ...grammarB1a, ...grammarB1b, ...grammarB1c, ...grammarB2a, ...grammarB2b, ...grammarB2c, ...grammarC1a, ...grammarC1b, ...grammarC1c]

import type { ReadingText } from '../reading.ts'
import { readingsA1 } from './readingsA1.ts'
import { readingsA2 } from './readingsA2.ts'
import { readingsB1 } from './readingsB1.ts'

/** Todas las lecturas y diálogos del italiano, por nivel. */
export const italianTexts: ReadingText[] = [...readingsA1, ...readingsA2, ...readingsB1]

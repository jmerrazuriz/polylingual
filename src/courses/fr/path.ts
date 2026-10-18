import type { ItemStatus, PathItem, PathLevel, PathUnit } from '../../lib/path.ts'
import type { ProgressData } from '../../lib/progress/model.ts'
import { cefrGoals, cefrLevels, cefrTitles } from './levels.ts'

// Recorrido del francés por nivel. Está vacío hasta F1: los niveles se muestran «en preparación».

export const frenchPath: PathUnit[] = []

export const frenchPathLevels: PathLevel[] = cefrLevels.map((level) => ({ level, title: cefrTitles[level], goal: cefrGoals[level], units: [], firstIndex: 0 }))

/** Sin lecciones todavía: todo queda abierto para revisar el recorrido en preparación. */
export const frenchItemStatus = (_p: ProgressData, _everythingOpen: boolean) => (_i: PathItem): ItemStatus => 'open'

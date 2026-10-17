import type { PathLevel, PathUnit } from '../../lib/path.ts'
import { type CefrLevel, cefrGoals, cefrLevels, cefrTitles } from './levels.ts'

// Recorrido del alemán por nivel. Cada nivel terminará en su simulacro estilo Goethe
// (unidad `examen-<nivel>`). Las unidades se agregan con cada etapa (D1: A1, D2: A2…).

const unitsByLevel: Record<CefrLevel, PathUnit[]> = {
  A1: [],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
  C2: [],
}

export const germanPath: PathUnit[] = cefrLevels.flatMap((l) => unitsByLevel[l])

export const germanPathLevels: PathLevel[] = (() => {
  let firstIndex = 0
  return cefrLevels.map((level) => {
    const units = unitsByLevel[level]
    const out = { level, title: cefrTitles[level], goal: cefrGoals[level], units, firstIndex }
    firstIndex += units.length
    return out
  })
})()

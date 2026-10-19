import type { CefrLevel } from './levels.ts'

// Simulacros estilo CILS (Università per Stranieri di Siena). Cinco pruebas en todos los niveles:
// escuchar, leer, estructuras de comunicación (gramática y léxico), escribir y hablar.
// A1 y A2: cada prueba vale 12 puntos y pide al menos 7. Desde el B1: 20 puntos y al menos 11.
// Se aprueba solo si se pasa cada prueba. Escribir y hablar son de autoevaluación guiada
// (sin corrección por IA, ver PLAN_ITALIANO.md). Los tiempos son los de la guía del CILS y
// hay que revisarlos a mano en cils.unistrasi.it.

export type CilsModule = 'ascolto' | 'lettura' | 'strutture' | 'scrittura' | 'orale'

export const cilsModules: CilsModule[] = ['ascolto', 'lettura', 'strutture', 'scrittura', 'orale']

export const moduleNames: Record<CilsModule, string> = {
  ascolto: 'Escuchar (ascolto)',
  lettura: 'Leer (comprensione della lettura)',
  strutture: 'Estructuras (analisi delle strutture di comunicazione)',
  scrittura: 'Escribir (produzione scritta)',
  orale: 'Hablar (produzione orale)',
}

export type CilsExam = {
  level: CefrLevel
  /** «CILS A1», «CILS UNO-B1», «CILS QUATTRO-C2». */
  name: string
  modules: CilsModule[]
  /** Pruebas que la app corrige sola; escribir y hablar son autoevaluadas. */
  autoScored: CilsModule[]
  /** Puntos máximos de cada prueba. */
  max: number
  /** Puntos mínimos para aprobar cada prueba. */
  minimum: number
  /** Minutos de cada prueba (aproximados a los del examen real). */
  minutes: Record<CilsModule, number>
  recordKey: string
}

const NAMES: Record<CefrLevel, string> = {
  A1: 'CILS A1',
  A2: 'CILS A2',
  B1: 'CILS UNO-B1',
  B2: 'CILS DUE-B2',
  C1: 'CILS TRE-C1',
  C2: 'CILS QUATTRO-C2',
}

const exam = (level: CefrLevel, [ascolto, lettura, strutture, scrittura, orale]: [number, number, number, number, number]): CilsExam => {
  const basic = level === 'A1' || level === 'A2'
  return {
    level,
    name: NAMES[level],
    modules: cilsModules,
    autoScored: ['ascolto', 'lettura', 'strutture'],
    max: basic ? 12 : 20,
    minimum: basic ? 7 : 11,
    minutes: { ascolto, lettura, strutture, scrittura, orale },
    recordKey: `cils-${level.toLowerCase()}`,
  }
}

export const cilsExams: Record<CefrLevel, CilsExam> = {
  A1: exam('A1', [30, 30, 15, 30, 10]),
  A2: exam('A2', [20, 30, 15, 40, 10]),
  B1: exam('B1', [30, 50, 60, 70, 15]),
  B2: exam('B2', [30, 50, 60, 70, 15]),
  C1: exam('C1', [40, 70, 75, 90, 15]),
  C2: exam('C2', [40, 75, 80, 90, 15]),
}

export const cilsPassedKey = (level: string) => `cils-${level.toLowerCase()}:aprobado`

export type ModuleResult = { correct: number; total: number }

export type CilsScore = {
  /** Puntos de cada prueba con resultado, sobre `max` (enteros, como en el examen). */
  points: Partial<Record<CilsModule, number>>
  /** Pruebas bajo el mínimo. */
  failed: CilsModule[]
  /** Aprobado en lo que la app corrige sola: escuchar, leer y estructuras, cada una con su mínimo. */
  passedAuto: boolean
  /** Aprobado con las cinco pruebas (si se autoevaluaron escribir y hablar). */
  passed: boolean | null
  /** Suma de los puntos con resultado y el total posible. */
  total: number
  outOf: number
}

export function scoreCils(level: CefrLevel, results: Partial<Record<CilsModule, ModuleResult>>): CilsScore {
  const e = cilsExams[level]
  const points: Partial<Record<CilsModule, number>> = {}
  for (const m of e.modules) {
    const r = results[m]
    if (r) points[m] = r.total ? Math.round((r.correct / r.total) * e.max) : 0
  }
  const scored = e.modules.filter((m) => points[m] !== undefined)
  const failed = scored.filter((m) => points[m]! < e.minimum)
  const passedAuto = e.autoScored.every((m) => points[m] !== undefined && points[m]! >= e.minimum)
  const passed = scored.length === e.modules.length ? failed.length === 0 : null
  const total = scored.reduce((a, m) => a + points[m]!, 0)
  return { points, failed, passedAuto, passed, total, outOf: e.modules.length * e.max }
}

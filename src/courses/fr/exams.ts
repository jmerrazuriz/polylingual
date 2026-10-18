import type { CefrLevel } from './levels.ts'

// Simulacros estilo DELF (A1–B2) y DALF (C1–C2), de France Éducation International.
// De A1 a C1 hay cuatro pruebas de 25 puntos; se aprueba con 50/100 y al menos 5/25 en cada una.
// El C2 tiene dos pruebas de 50 (oral y escrita), con mínimo 10/50 en cada una.
// Escribir y hablar son de autoevaluación guiada (sin corrección por IA, ver PLAN_FRANCES.md).

export type DelfModule = 'co' | 'ce' | 'pe' | 'po'
export type DalfC2Module = 'oral' | 'ecrit'
export type ExamModule = DelfModule | DalfC2Module

export const moduleNames: Record<ExamModule, string> = {
  co: 'Escuchar (compréhension de l’oral)',
  ce: 'Leer (compréhension des écrits)',
  pe: 'Escribir (production écrite)',
  po: 'Hablar (production orale)',
  oral: 'Prueba oral (comprensión y expresión)',
  ecrit: 'Prueba escrita (comprensión y expresión)',
}

export type DelfExam = {
  level: CefrLevel
  /** DELF hasta B2, DALF en C1 y C2. */
  diploma: 'DELF' | 'DALF'
  modules: ExamModule[]
  /** Pruebas que la app corrige sola; las demás son autoevaluadas. */
  autoScored: ExamModule[]
  /** Puntos máximos de cada prueba. */
  max: number
  /** Puntos mínimos en cada prueba para no quedar eliminado. */
  minimum: number
  /** Minutos de cada prueba (aproximados a los del examen real). */
  minutes: Partial<Record<ExamModule, number>>
  recordKey: string
}

const four = (level: CefrLevel, [co, ce, pe, po]: [number, number, number, number]): DelfExam => ({
  level,
  diploma: level === 'C1' ? 'DALF' : 'DELF',
  modules: ['co', 'ce', 'pe', 'po'],
  autoScored: ['co', 'ce'],
  max: 25,
  minimum: 5,
  minutes: { co, ce, pe, po },
  recordKey: `delf-${level.toLowerCase()}`,
})

export const delfExams: Record<CefrLevel, DelfExam> = {
  A1: four('A1', [20, 30, 30, 15]),
  A2: four('A2', [25, 30, 45, 15]),
  B1: four('B1', [25, 45, 45, 25]),
  B2: four('B2', [30, 60, 60, 50]),
  C1: four('C1', [40, 50, 150, 90]),
  C2: {
    level: 'C2',
    diploma: 'DALF',
    modules: ['oral', 'ecrit'],
    autoScored: ['oral', 'ecrit'],
    max: 50,
    minimum: 10,
    minutes: { oral: 90, ecrit: 210 },
    recordKey: 'dalf-c2',
  },
}

/** Se aprueba con la mitad del total. */
export const PASS_RATIO = 0.5

export type ModuleResult = { correct: number; total: number }

export type DelfScore = {
  /** Puntos de cada prueba con resultado, sobre `max` (con medio punto, como en el examen). */
  points: Partial<Record<ExamModule, number>>
  /** Pruebas bajo el mínimo eliminatorio. */
  eliminated: ExamModule[]
  /** Aprobado según lo corregido automáticamente: la mitad de esos puntos y ninguna prueba eliminatoria. */
  passedAuto: boolean
  /** Aprobado con todas las pruebas (si se autoevaluaron escribir y hablar). */
  passed: boolean | null
}

export function scoreDelf(level: CefrLevel, results: Partial<Record<ExamModule, ModuleResult>>): DelfScore {
  const exam = delfExams[level]
  const points: Partial<Record<ExamModule, number>> = {}
  for (const m of exam.modules) {
    const r = results[m]
    if (r) points[m] = r.total ? Math.round((r.correct / r.total) * exam.max * 2) / 2 : 0
  }
  const scored = exam.modules.filter((m) => points[m] !== undefined)
  const eliminated = scored.filter((m) => points[m]! < exam.minimum)
  const sum = (ms: ExamModule[]) => ms.reduce((a, m) => a + (points[m] ?? 0), 0)
  const auto = exam.autoScored
  const passedAuto = auto.every((m) => points[m] !== undefined && points[m]! >= exam.minimum) && sum(auto) >= auto.length * exam.max * PASS_RATIO
  const complete = scored.length === exam.modules.length
  const passed = complete ? eliminated.length === 0 && sum(exam.modules) >= exam.modules.length * exam.max * PASS_RATIO : null
  return { points, eliminated, passedAuto, passed }
}

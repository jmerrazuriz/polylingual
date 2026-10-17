import type { CefrLevel } from './levels.ts'

// Simulacros estilo Goethe-Zertifikat. Cuatro módulos (leer, escuchar, escribir, hablar).
// A1 y A2 se aprueban con el 60 % del total; de B1 a C2 cada módulo es independiente y se
// aprueba con 60 de 100. Escribir y hablar son de autoevaluación guiada (sin corrección por
// IA, ver PLAN_ALEMAN.md): su puntaje es orientativo y se muestra aparte.

export type ExamModule = 'lesen' | 'hoeren' | 'schreiben' | 'sprechen'

export const moduleNames: Record<ExamModule, string> = {
  lesen: 'Leer (Lesen)',
  hoeren: 'Escuchar (Hören)',
  schreiben: 'Escribir (Schreiben)',
  sprechen: 'Hablar (Sprechen)',
}

/** Módulos que se corrigen solos; los demás son autoevaluados. */
export const autoScored: ExamModule[] = ['lesen', 'hoeren']

export type GoetheExam = {
  level: CefrLevel
  /** Minutos de cada módulo en la app (aproximados a los del examen real). */
  minutes: Record<ExamModule, number>
  /** true: cada módulo se aprueba por separado (B1–C2). false: cuenta el total (A1, A2). */
  modular: boolean
  recordKey: string
}

const exam = (level: CefrLevel, minutes: [number, number, number, number], modular: boolean): GoetheExam => ({
  level,
  minutes: { lesen: minutes[0], hoeren: minutes[1], schreiben: minutes[2], sprechen: minutes[3] },
  modular,
  recordKey: `goethe-${level.toLowerCase()}`,
})

export const goetheExams: Record<CefrLevel, GoetheExam> = {
  A1: exam('A1', [25, 20, 20, 15], false),
  A2: exam('A2', [30, 30, 30, 15], false),
  B1: exam('B1', [65, 40, 60, 15], true),
  B2: exam('B2', [65, 40, 75, 15], true),
  C1: exam('C1', [65, 40, 75, 15], true),
  C2: exam('C2', [80, 35, 80, 15], true),
}

export const PASS = 60

export type ModuleResult = { correct: number; total: number }

export type GoetheScore = {
  /** Puntaje 0–100 de cada módulo con resultado. */
  points: Partial<Record<ExamModule, number>>
  /** Aprobado según lo corregido automáticamente (leer y escuchar). */
  passedAuto: boolean
  /** Módulos aprobados (≥ 60). */
  passedModules: ExamModule[]
}

/** Puntaje Goethe: cada módulo de 0 a 100; aprobado con 60 por módulo (B1–C2) o en el total (A1–A2). */
export function scoreGoethe(level: CefrLevel, results: Partial<Record<ExamModule, ModuleResult>>): GoetheScore {
  const points: Partial<Record<ExamModule, number>> = {}
  for (const [m, r] of Object.entries(results) as [ExamModule, ModuleResult][]) {
    points[m] = r.total ? Math.round((r.correct / r.total) * 100) : 0
  }
  const passedModules = (Object.keys(points) as ExamModule[]).filter((m) => points[m]! >= PASS)
  const auto = autoScored.map((m) => points[m] ?? 0)
  const passedAuto = goetheExams[level].modular ? auto.every((p) => p >= PASS) : auto.reduce((a, b) => a + b, 0) / auto.length >= PASS
  return { points, passedAuto, passedModules }
}

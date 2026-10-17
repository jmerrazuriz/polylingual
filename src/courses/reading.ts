// Tipos de las lecturas y los diálogos (comprensión lectora y auditiva), comunes a
// todos los cursos. Las preguntas usan el mismo formato que la gramática.

import type { GrammarExercise } from './grammar.ts'

export type TextLine = {
  /** En los diálogos, quién habla. */
  speaker?: string
  /** Frase en el idioma del curso. */
  text: string
  /** Traducción al español. */
  meaning: string
}

export type ReadingText = {
  id: string
  title: string
  /** reading: texto para leer · dialogue: conversación para escuchar (también se puede leer). */
  kind: 'reading' | 'dialogue'
  level: 'N5' | 'N4' | 'N3' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  /** La lección de gramática que hace falta haber completado para abrirlo. */
  requires: string
  /** Situación, en español (dónde están, quiénes hablan). */
  context?: string
  lines: TextLine[]
  questions: GrammarExercise[]
}

import type { MixedResult } from '../features/practice/MixedSession'

/**
 * Resumen de una sesión mixta. Los ejercicios (p. ej. de kanji) cuentan como
 * lectura; la escritura cuenta 4–5 ★ como acierto.
 */
export function summarize({ reading, exercises, writing }: MixedResult) {
  const scored = writing.filter((w) => w.score !== null)
  const readOk = reading.filter((a) => a.correct).length + exercises.filter(Boolean).length
  const readTotal = reading.length + exercises.length
  return {
    readOk,
    readTotal,
    writeAvg: scored.length ? scored.reduce((n, w) => n + w.score!, 0) / scored.length : null,
    ratio: (readOk + scored.filter((w) => w.score! >= 4).length) / Math.max(1, readTotal + scored.length),
  }
}

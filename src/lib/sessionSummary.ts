import type { MixedResult } from '../features/practice/MixedSession'

/** Resumen de una sesión mixta: aciertos de lectura y promedio de estrellas de escritura. */
export function summarize({ reading, writing }: MixedResult) {
  const scored = writing.filter((w) => w.score !== null)
  return {
    readOk: reading.filter((a) => a.correct).length,
    readTotal: reading.length,
    writeAvg: scored.length ? scored.reduce((n, w) => n + w.score!, 0) / scored.length : null,
    /** Fracción de aciertos total, contando 4–5 ★ como acierto de escritura. */
    ratio:
      (reading.filter((a) => a.correct).length + scored.filter((w) => w.score! >= 4).length) /
      Math.max(1, reading.length + scored.length),
  }
}

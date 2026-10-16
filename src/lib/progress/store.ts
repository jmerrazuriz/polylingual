import { create } from 'zustand'
import { emptyProgress, emptyStat, isBetterLesson, isBetterRecord, type ProgressData } from './model.ts'

type ProgressActions = {
  completeLesson: (lessonId: string, correct: number, total: number) => void
  /** Guarda el resultado y devuelve true si es un récord nuevo. */
  submitRecord: (key: string, value: number) => boolean
  /** `weight` < 1 para respuestas de juegos, que cuentan menos que un ejercicio. */
  recordReading: (char: string, correct: boolean, weight?: number) => void
  recordWriting: (char: string, score: number) => void
  replace: (data: ProgressData) => void
  reset: () => void
}

/**
 * Progreso del usuario. Vive en memoria; si hay una cuenta con correo verificado,
 * lib/account/sync lo carga y lo guarda en Firestore. Los invitados no guardan nada.
 */
export const useProgress = create<ProgressData & ProgressActions>((set, get) => ({
  ...emptyProgress(),

  completeLesson: (lessonId, correct, total) => {
    if (!isBetterLesson({ correct, total }, get().lessons[lessonId])) return
    set((s) => ({ lessons: { ...s.lessons, [lessonId]: { correct, total } } }))
  },

  submitRecord: (key, value) => {
    const isRecord = isBetterRecord(key, value, get().records[key])
    if (isRecord) set((s) => ({ records: { ...s.records, [key]: value } }))
    return isRecord
  },

  recordReading: (char, correct, weight = 1) =>
    set((s) => {
      const prev = s.kana[char] ?? emptyStat()
      const stat = { ...prev, readOk: prev.readOk + (correct ? weight : 0), readTotal: prev.readTotal + weight }
      return { kana: { ...s.kana, [char]: stat } }
    }),

  recordWriting: (char, score) =>
    set((s) => {
      const prev = s.kana[char] ?? emptyStat()
      const stat = { ...prev, writeScore: prev.writeScore + score, writeCount: prev.writeCount + 1 }
      return { kana: { ...s.kana, [char]: stat } }
    }),

  replace: (data) => set({ lessons: data.lessons, records: data.records, kana: data.kana }),
  reset: () => set(emptyProgress()),
}))

export function progressSnapshot(): ProgressData {
  const { lessons, records, kana } = useProgress.getState()
  return { lessons, records, kana }
}

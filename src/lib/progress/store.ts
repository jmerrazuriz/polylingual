import { create } from 'zustand'
import { now } from '../time.ts'
import { emptyProgress, emptyStat, isBetterLesson, isBetterRecord, type ProgressData } from './model.ts'
import { cardId, gradeForReading, gradeForWriting, newCard, review } from './srs.ts'

type ProgressActions = {
  /** Guarda el resultado y agrega a los repasos los caracteres de la lección (`chars`). */
  completeLesson: (lessonId: string, correct: number, total: number, chars?: readonly string[]) => void
  /** Guarda el resultado y devuelve true si es un récord nuevo. */
  submitRecord: (key: string, value: number) => boolean
  /** `weight` < 1 para respuestas de juegos, que cuentan menos que un ejercicio. */
  recordReading: (char: string, correct: boolean, weight?: number) => void
  recordWriting: (char: string, score: number) => void
  setUnlockAll: (unlockAll: boolean) => void
  replace: (data: ProgressData) => void
  reset: () => void
}

/**
 * Progreso del usuario. Vive en memoria; si hay una cuenta con correo verificado,
 * lib/account/sync lo carga y lo guarda en Firestore. Los invitados no guardan nada.
 */
export const useProgress = create<ProgressData & ProgressActions>((set, get) => ({
  ...emptyProgress(),

  completeLesson: (lessonId, correct, total, chars = []) => {
    const t = now()
    set((s) => {
      const cards = { ...s.cards }
      for (const char of chars) {
        for (const skill of ['read', 'write'] as const) cards[cardId(char, skill)] ??= newCard(t)
      }
      const better = isBetterLesson({ correct, total }, s.lessons[lessonId])
      return { cards, lessons: better ? { ...s.lessons, [lessonId]: { correct, total } } : s.lessons }
    })
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
      const kana = { ...s.kana, [char]: stat }
      // Solo los ejercicios (peso 1) reprograman la tarjeta; los juegos cuentan para las estadísticas.
      if (weight < 1) return { kana }
      const id = cardId(char, 'read')
      return { kana, cards: { ...s.cards, [id]: review(s.cards[id], gradeForReading(correct), now()) } }
    }),

  recordWriting: (char, score) =>
    set((s) => {
      const prev = s.kana[char] ?? emptyStat()
      const stat = { ...prev, writeScore: prev.writeScore + score, writeCount: prev.writeCount + 1 }
      const id = cardId(char, 'write')
      return {
        kana: { ...s.kana, [char]: stat },
        cards: { ...s.cards, [id]: review(s.cards[id], gradeForWriting(score), now()) },
      }
    }),

  setUnlockAll: (unlockAll) => set({ unlockAll }),

  replace: (data) => set(data),
  reset: () => set(emptyProgress()),
}))

export function progressSnapshot(): ProgressData {
  const { lessons, records, kana, cards, unlockAll } = useProgress.getState()
  return { lessons, records, kana, cards, unlockAll }
}

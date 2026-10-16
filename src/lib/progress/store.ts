import { create } from 'zustand'
import { now } from '../time.ts'
import {
  ACTIVITY_DAYS_KEPT,
  dayKey,
  daysBefore,
  emptyProgress,
  emptyStat,
  isBetterLesson,
  isBetterRecord,
  courseOf,
  type DailyRecord,
  emptyCourse,
  type ProgressData,
  type Settings,
} from './model.ts'
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
  setSettings: (settings: Partial<Settings>) => void
  /** Marca logros como obtenidos (los que ya estaban no cambian). */
  unlockAchievements: (ids: readonly string[], time: number) => void
  completeGrammar: (lessonId: string, correct: number, total: number) => void
  completeUnit: (unitId: string, correct: number, total: number) => void
  /** Crea o actualiza la lección de un día (qué toca y qué pasos se hicieron). */
  updateDaily: (day: string, update: (record: DailyRecord) => DailyRecord) => void
  /** Cambia de curso: guarda el actual en otherCourses y trae el elegido. */
  setCourse: (course: string) => void
  replace: (data: ProgressData) => void
  reset: () => void
}

/** Suma `amount` a la actividad de hoy y descarta los días más viejos. */
function addActivity(activity: Record<string, number>, amount: number): Record<string, number> {
  const t = now()
  const today = dayKey(t)
  const oldest = dayKey(daysBefore(t, ACTIVITY_DAYS_KEPT))
  const next: Record<string, number> = { [today]: (activity[today] ?? 0) + amount }
  for (const [day, n] of Object.entries(activity)) if (day !== today && day >= oldest) next[day] = n
  return next
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
      const activity = addActivity(s.activity, weight)
      // Solo los ejercicios (peso 1) reprograman la tarjeta; los juegos cuentan para las estadísticas.
      if (weight < 1) return { kana, activity }
      const id = cardId(char, 'read')
      return { kana, activity, cards: { ...s.cards, [id]: review(s.cards[id], gradeForReading(correct), now()) } }
    }),

  recordWriting: (char, score) =>
    set((s) => {
      const prev = s.kana[char] ?? emptyStat()
      const stat = { ...prev, writeScore: prev.writeScore + score, writeCount: prev.writeCount + 1 }
      const id = cardId(char, 'write')
      return {
        kana: { ...s.kana, [char]: stat },
        activity: addActivity(s.activity, 1),
        cards: { ...s.cards, [id]: review(s.cards[id], gradeForWriting(score), now()) },
      }
    }),

  setUnlockAll: (unlockAll) => set({ unlockAll }),
  setSettings: (settings) => set((s) => ({ settings: { ...s.settings, ...settings } })),
  unlockAchievements: (ids, time) =>
    set((s) => {
      const fresh = ids.filter((id) => !(id in s.achievements))
      if (fresh.length === 0) return s
      return { achievements: { ...s.achievements, ...Object.fromEntries(fresh.map((id) => [id, time])) } }
    }),

  completeGrammar: (lessonId, correct, total) =>
    set((s) =>
      isBetterLesson({ correct, total }, s.grammar[lessonId]) ? { grammar: { ...s.grammar, [lessonId]: { correct, total } } } : s,
    ),

  completeUnit: (unitId, correct, total) =>
    set((s) => (isBetterLesson({ correct, total }, s.units[unitId]) ? { units: { ...s.units, [unitId]: { correct, total } } } : s)),

  updateDaily: (day, update) =>
    set((s) => {
      // Se guardan los últimos 30 días: alcanza para ver la semana y no crece sin fin.
      const days = Object.keys(s.daily).sort().slice(-29)
      const kept = Object.fromEntries(days.filter((d) => d !== day).map((d) => [d, s.daily[d]]))
      return { daily: { ...kept, [day]: update(s.daily[day] ?? { steps: [], done: [] }) } }
    }),

  setCourse: (course) =>
    set((s) => {
      if (course === s.course) return s
      const { [course]: next = emptyCourse(), ...rest } = s.otherCourses
      return { ...next, course, otherCourses: { ...rest, [s.course]: courseOf(s) } }
    }),

  replace: (data) => set(data),
  reset: () => set(emptyProgress()),
}))

export function progressSnapshot(): ProgressData {
  const s = useProgress.getState()
  const { activity, achievements, settings, course, otherCourses } = s
  return { ...courseOf(s), activity, achievements, settings, course, otherCourses }
}

// Modelo del progreso del usuario. Es lo que se guarda en Firestore (users/{uid}.progress).

import type { SrsCard } from './srs.ts'

export type LessonResult = { correct: number; total: number }

/** Estadísticas por carácter: lectura (aciertos/total) y escritura (suma de puntajes 1–5 / cantidad). */
export type KanaStat = { readOk: number; readTotal: number; writeScore: number; writeCount: number }

export type ProgressData = {
  /** Mejor resultado del repaso final de cada lección. */
  lessons: Record<string, LessonResult>
  /** Mejor resultado por juego y selección de grupos (ver recordKey). */
  records: Record<string, number>
  kana: Record<string, KanaStat>
  /** Tarjetas de repetición espaciada, por cardId ("か:read", "か:write"). */
  cards: Record<string, SrsCard>
  /** El usuario eligió desbloquear todas las lecciones. */
  unlockAll: boolean
  /** Respuestas por día local ("2026-10-16": 23), para la racha y el objetivo diario. */
  activity: Record<string, number>
  /** Logros obtenidos y cuándo (ms). */
  achievements: Record<string, number>
  settings: Settings
}

export type Settings = {
  /** Respuestas por día para cumplir el objetivo. */
  dailyGoal: number
  theme: 'system' | 'light' | 'dark'
  fontScale: 'normal' | 'large'
  audio: boolean
  /** Velocidad de la voz (0.6 lenta – 1 normal). */
  speechRate: number
}

export const DAILY_GOALS = [10, 20, 40] as const

export const defaultSettings = (): Settings => ({
  dailyGoal: 20,
  theme: 'system',
  fontScale: 'normal',
  audio: true,
  speechRate: 0.8,
})

export const emptyProgress = (): ProgressData => ({
  lessons: {},
  records: {},
  kana: {},
  cards: {},
  unlockAll: false,
  activity: {},
  achievements: {},
  settings: defaultSettings(),
})

export const emptyStat = (): KanaStat => ({ readOk: 0, readTotal: 0, writeScore: 0, writeCount: 0 })

/** En el juego de memoria gana quien usa menos intentos; en los demás, más puntos. */
export const lowerIsBetter = (recordKey: string) => recordKey.startsWith('memory:')

export const recordKey = (game: string, lessonIds: readonly string[]) => `${game}:${[...lessonIds].sort().join(',')}`

export function isBetterLesson(a: LessonResult, b: LessonResult | undefined): boolean {
  return !b || a.correct / a.total > b.correct / b.total
}

export function isBetterRecord(key: string, value: number, prev: number | undefined): boolean {
  return prev === undefined || (lowerIsBetter(key) ? value < prev : value > prev)
}

/**
 * Une dos progresos (p. ej. lo hecho como invitado con lo guardado en la cuenta):
 * se queda con el mejor resultado de cada lección y récord, y suma las estadísticas.
 */
export function mergeProgress(a: ProgressData, b: ProgressData): ProgressData {
  const lessons = { ...a.lessons }
  for (const [id, r] of Object.entries(b.lessons)) if (isBetterLesson(r, lessons[id])) lessons[id] = r

  const records = { ...a.records }
  for (const [key, v] of Object.entries(b.records)) if (isBetterRecord(key, v, records[key])) records[key] = v

  const kana = { ...a.kana }
  for (const [char, s] of Object.entries(b.kana)) {
    const prev = kana[char] ?? emptyStat()
    kana[char] = {
      readOk: prev.readOk + s.readOk,
      readTotal: prev.readTotal + s.readTotal,
      writeScore: prev.writeScore + s.writeScore,
      writeCount: prev.writeCount + s.writeCount,
    }
  }
  // De cada tarjeta se queda la repasada más recientemente.
  const cards = { ...a.cards }
  for (const [id, card] of Object.entries(b.cards)) {
    const prev = cards[id]
    if (!prev || (card.last_review ?? 0) > (prev.last_review ?? 0)) cards[id] = card
  }

  const activity = { ...a.activity }
  for (const [day, n] of Object.entries(b.activity)) activity[day] = (activity[day] ?? 0) + n

  const achievements = { ...a.achievements }
  for (const [id, t] of Object.entries(b.achievements)) achievements[id] = Math.min(achievements[id] ?? t, t)

  // Los ajustes de la cuenta mandan sobre los de la visita como invitado.
  return { lessons, records, kana, cards, unlockAll: a.unlockAll || b.unlockAll, activity, achievements, settings: a.settings }
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {})

/** Lee el progreso guardado tolerando datos incompletos o de versiones anteriores. */
export function parseProgress(raw: unknown): ProgressData {
  const data = obj(raw)
  const progress = emptyProgress()
  for (const [id, r] of Object.entries(obj(data.lessons))) {
    const { correct, total } = obj(r)
    if (num(total) > 0) progress.lessons[id] = { correct: num(correct), total: num(total) }
  }
  for (const [key, v] of Object.entries(obj(data.records))) if (typeof v === 'number') progress.records[key] = v
  for (const [char, s] of Object.entries(obj(data.kana))) {
    const stat = obj(s)
    progress.kana[char] = {
      readOk: num(stat.readOk),
      readTotal: num(stat.readTotal),
      writeScore: num(stat.writeScore),
      writeCount: num(stat.writeCount),
    }
  }
  for (const [id, c] of Object.entries(obj(data.cards))) {
    const card = obj(c)
    if (typeof card.due !== 'number') continue
    progress.cards[id] = {
      due: card.due,
      stability: num(card.stability),
      difficulty: num(card.difficulty),
      elapsed_days: num(card.elapsed_days),
      scheduled_days: num(card.scheduled_days),
      learning_steps: num(card.learning_steps),
      reps: num(card.reps),
      lapses: num(card.lapses),
      state: num(card.state),
      last_review: typeof card.last_review === 'number' ? card.last_review : null,
    }
  }
  progress.unlockAll = data.unlockAll === true
  for (const [day, n] of Object.entries(obj(data.activity))) if (/^\d{4}-\d{2}-\d{2}$/.test(day) && num(n) > 0) progress.activity[day] = num(n)
  for (const [id, t] of Object.entries(obj(data.achievements))) if (typeof t === 'number') progress.achievements[id] = t
  const settings = obj(data.settings)
  const defaults = defaultSettings()
  progress.settings = {
    dailyGoal: (DAILY_GOALS as readonly number[]).includes(num(settings.dailyGoal)) ? num(settings.dailyGoal) : defaults.dailyGoal,
    theme: settings.theme === 'light' || settings.theme === 'dark' ? settings.theme : defaults.theme,
    fontScale: settings.fontScale === 'large' ? 'large' : defaults.fontScale,
    audio: typeof settings.audio === 'boolean' ? settings.audio : defaults.audio,
    speechRate: num(settings.speechRate) >= 0.5 && num(settings.speechRate) <= 1.2 ? num(settings.speechRate) : defaults.speechRate,
  }
  return progress
}

/** JSON con las claves ordenadas, para comparar progresos sin importar el orden. */
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export type Mastery = 'new' | 'learning' | 'mastered'

/** Dominio de lectura: dominado con al menos 5 respuestas y 80 % de aciertos. */
export function readingMastery(stat: KanaStat | undefined): Mastery {
  if (!stat || stat.readTotal === 0) return 'new'
  return stat.readTotal >= 5 && stat.readOk / stat.readTotal >= 0.8 ? 'mastered' : 'learning'
}

/** Día local en formato "AAAA-MM-DD". */
export function dayKey(time: number): string {
  const d = new Date(time)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Mismo día, `days` días antes (o después, si es negativo). */
export function daysBefore(time: number, days: number): number {
  const d = new Date(time)
  d.setDate(d.getDate() - days)
  return d.getTime()
}

/**
 * Días seguidos con actividad. Si hoy todavía no hay actividad, la racha sigue
 * viva desde ayer (se pierde recién si pasa un día entero sin practicar).
 */
export function currentStreak(activity: Record<string, number>, now: number): number {
  const offset = activity[dayKey(now)] ? 0 : 1
  let streak = 0
  while (activity[dayKey(daysBefore(now, offset + streak))]) streak++
  return streak
}

/** Racha más larga registrada. */
export function longestStreak(activity: Record<string, number>): number {
  const days = Object.keys(activity).sort()
  let best = 0
  let run = 0
  let prev: number | null = null
  for (const day of days) {
    const [y, m, d] = day.split('-').map(Number)
    const t = new Date(y, m - 1, d).getTime()
    run = prev !== null && dayKey(daysBefore(t, 1)) === dayKey(prev) ? run + 1 : 1
    best = Math.max(best, run)
    prev = t
  }
  return best
}

/** Guarda la actividad de unos 6 meses: suficiente para el calendario y las rachas. */
export const ACTIVITY_DAYS_KEPT = 180

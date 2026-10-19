// Modelo del progreso del usuario. Se guarda en Firestore (users/{uid}.progress)
// en el formato de toStored(): datos globales + un bloque por curso (idioma).

import type { SrsCard } from './srs.ts'

export type LessonResult = { correct: number; total: number }

/** Estadísticas por elemento (carácter): lectura (aciertos/total) y escritura (suma de puntajes 1–5 / cantidad). */
export type KanaStat = { readOk: number; readTotal: number; writeScore: number; writeCount: number }

/** Lección de un día: qué pasos tiene, qué lección y gramática tocan y qué pasos se completaron. */
export type DailyRecord = { steps: string[]; lesson?: string; grammar?: string; mode?: string; done: string[] }

/** Progreso de un curso (idioma). */
export type CourseData = {
  /** Mejor resultado del repaso final de cada lección. */
  lessons: Record<string, LessonResult>
  /** Mejor resultado por juego y selección de grupos (ver recordKey). */
  records: Record<string, number>
  kana: Record<string, KanaStat>
  /** Tarjetas de repetición espaciada, por cardId ("か:read", "か:write"). */
  cards: Record<string, SrsCard>
  /** El usuario eligió desbloquear todas las lecciones. */
  unlockAll: boolean
  /** Mejor resultado de cada lección de gramática. */
  grammar: Record<string, LessonResult>
  /** Mejor resultado del repaso de cada unidad. */
  units: Record<string, LessonResult>
  /** Lección del día, por día local. */
  daily: Record<string, DailyRecord>
}

/**
 * Progreso en memoria: los datos globales, los del curso activo «aplanados»
 * (así el resto de la app no necesita saber de cursos) y los de los demás cursos.
 */
export type ProgressData = CourseData & {
  /** Respuestas por día local ("2026-10-16": 23), para la racha y el objetivo diario. */
  activity: Record<string, number>
  /** Logros obtenidos y cuándo (ms). */
  achievements: Record<string, number>
  settings: Settings
  /** Curso activo. */
  course: string
  otherCourses: Record<string, CourseData>
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
export const DEFAULT_COURSE = 'ja'

export const defaultSettings = (): Settings => ({
  dailyGoal: 20,
  theme: 'system',
  fontScale: 'normal',
  audio: true,
  speechRate: 0.8,
})

export const emptyCourse = (): CourseData => ({
  lessons: {},
  records: {},
  kana: {},
  cards: {},
  unlockAll: false,
  grammar: {},
  units: {},
  daily: {},
})

export const emptyProgress = (): ProgressData => ({
  ...emptyCourse(),
  activity: {},
  achievements: {},
  settings: defaultSettings(),
  course: DEFAULT_COURSE,
  otherCourses: {},
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

/** Los datos del curso activo, separados de los globales. */
export function courseOf(p: ProgressData): CourseData {
  const { lessons, records, kana, cards, unlockAll, grammar, units, daily } = p
  return { lessons, records, kana, cards, unlockAll, grammar, units, daily }
}

function bestResults(a: Record<string, LessonResult>, b: Record<string, LessonResult>) {
  const out = { ...a }
  for (const [id, r] of Object.entries(b)) if (isBetterLesson(r, out[id])) out[id] = r
  return out
}

/**
 * Une los datos de un curso: el mejor resultado de cada lección y récord, la
 * suma de las estadísticas y la tarjeta repasada más recientemente.
 */
export function mergeCourse(a: CourseData, b: CourseData): CourseData {
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
  const cards = { ...a.cards }
  for (const [id, card] of Object.entries(b.cards)) {
    const prev = cards[id]
    if (!prev || (card.last_review ?? 0) > (prev.last_review ?? 0)) cards[id] = card
  }
  const daily = { ...a.daily }
  for (const [day, r] of Object.entries(b.daily)) {
    const prev = daily[day]
    daily[day] = prev ? { ...r, ...prev, done: [...new Set([...prev.done, ...r.done])] } : r
  }
  return {
    lessons: bestResults(a.lessons, b.lessons),
    records,
    kana,
    cards,
    unlockAll: a.unlockAll || b.unlockAll,
    grammar: bestResults(a.grammar, b.grammar),
    units: bestResults(a.units, b.units),
    daily,
  }
}

/**
 * Une dos progresos (p. ej. lo guardado en la cuenta `a` con lo hecho como invitado `b`).
 * Se mantienen el curso activo y los ajustes de la cuenta.
 */
export function mergeProgress(a: ProgressData, b: ProgressData): ProgressData {
  const merged: Record<string, CourseData> = { ...a.otherCourses, [a.course]: courseOf(a) }
  const fromB: Record<string, CourseData> = { ...b.otherCourses, [b.course]: courseOf(b) }
  for (const [id, data] of Object.entries(fromB)) merged[id] = merged[id] ? mergeCourse(merged[id], data) : data

  const activity = { ...a.activity }
  for (const [day, n] of Object.entries(b.activity)) activity[day] = (activity[day] ?? 0) + n

  const achievements = { ...a.achievements }
  for (const [id, t] of Object.entries(b.achievements)) achievements[id] = Math.min(achievements[id] ?? t, t)

  const { [a.course]: active, ...otherCourses } = merged
  return { ...active, activity, achievements, settings: a.settings, course: a.course, otherCourses }
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {})

function parseResults(raw: unknown): Record<string, LessonResult> {
  const out: Record<string, LessonResult> = {}
  for (const [id, r] of Object.entries(obj(raw))) {
    const { correct, total } = obj(r)
    if (num(total) > 0) out[id] = { correct: num(correct), total: num(total) }
  }
  return out
}

function parseCourse(raw: unknown): CourseData {
  const data = obj(raw)
  const course = emptyCourse()
  course.lessons = parseResults(data.lessons)
  course.grammar = parseResults(data.grammar)
  course.units = parseResults(data.units)
  for (const [key, v] of Object.entries(obj(data.records))) if (typeof v === 'number') course.records[key] = v
  for (const [char, s] of Object.entries(obj(data.kana))) {
    const stat = obj(s)
    course.kana[char] = {
      readOk: num(stat.readOk),
      readTotal: num(stat.readTotal),
      writeScore: num(stat.writeScore),
      writeCount: num(stat.writeCount),
    }
  }
  for (const [id, c] of Object.entries(obj(data.cards))) {
    const card = obj(c)
    if (typeof card.due !== 'number') continue
    course.cards[id] = {
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
  course.unlockAll = data.unlockAll === true
  for (const [day, r] of Object.entries(obj(data.daily))) {
    const rec = obj(r)
    const strings = (v: unknown) => (Array.isArray(v) ? v.filter((d): d is string => typeof d === 'string') : [])
    course.daily[day] = {
      steps: strings(rec.steps),
      ...(typeof rec.lesson === 'string' ? { lesson: rec.lesson } : {}),
      ...(typeof rec.grammar === 'string' ? { grammar: rec.grammar } : {}),
      ...(typeof rec.mode === 'string' ? { mode: rec.mode } : {}),
      done: strings(rec.done),
    }
  }
  return course
}

/**
 * Lee el progreso guardado tolerando datos incompletos. Acepta el formato por
 * cursos ({ courses: { ja: … } }) y el anterior, con todo al nivel superior (= japonés).
 */
export function parseProgress(raw: unknown): ProgressData {
  const data = obj(raw)
  const courses: Record<string, CourseData> = {}
  if (data.courses && typeof data.courses === 'object') {
    for (const [id, c] of Object.entries(obj(data.courses))) courses[id] = parseCourse(c)
  } else if (Object.keys(data).length > 0) {
    courses[DEFAULT_COURSE] = parseCourse(data)
  }
  const course = typeof data.course === 'string' && data.course ? data.course : DEFAULT_COURSE
  const { [course]: active = emptyCourse(), ...otherCourses } = courses

  const progress: ProgressData = { ...emptyProgress(), ...active, course, otherCourses }
  for (const [day, n] of Object.entries(obj(data.activity))) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && num(n) > 0) progress.activity[day] = num(n)
  }
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

/** Formato que se guarda en Firestore: datos globales y un bloque por curso. */
export function toStored(p: ProgressData) {
  return {
    settings: p.settings,
    activity: p.activity,
    achievements: p.achievements,
    course: p.course,
    courses: { ...p.otherCourses, [p.course]: courseOf(p) },
  }
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

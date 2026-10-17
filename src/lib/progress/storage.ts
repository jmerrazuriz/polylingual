// Cómo se guarda el progreso en Firestore (versión 3).
//
// Las tarjetas SRS y las estadísticas por elemento son lo que más crece (2 tarjetas
// por kana, kanji y palabra), y un documento de Firestore admite como máximo 1 MB.
// Por eso van aparte, repartidas en SHARDS documentos por curso:
//
//   users/{uid}                 → { progress: el resto (sin cards ni kana), version: 3 }
//   users/{uid}/srs/{curso}-{n} → { course, cards: { id: "texto compacto" }, stats: { … } }
//
// Cada elemento cae siempre en el mismo documento (según un hash de su carácter), y
// al guardar solo se escriben los documentos que cambiaron.

import { type CourseData, emptyCourse, type KanaStat, mergeCourse, parseProgress, type ProgressData, toStored } from './model.ts'
import { parseCardId, type SrsCard } from './srs.ts'

export const SHARDS = 16

export type ShardDoc = { course: string; cards: Record<string, string>; stats: Record<string, string> }

/** Hash FNV-1a del carácter (kana, kanji o «w-palabra») → número de documento. */
export function shardOf(char: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < char.length; i++) {
    h ^= char.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0) % SHARDS
}

export const shardId = (course: string, n: number) => `${course}-${n}`

const round = (n: number, digits: number) => Number(n.toFixed(digits))
const b36 = (n: number) => Math.round(n).toString(36)
const fromB36 = (s: string) => parseInt(s, 36)

/**
 * Tarjeta en texto compacto (~45 bytes en vez de ~200): fechas en base 36 y
 * estabilidad/dificultad con 4 decimales, que sobra para FSRS.
 */
export function encodeCard(c: SrsCard): string {
  return [
    b36(c.due),
    round(c.stability, 4),
    round(c.difficulty, 4),
    c.elapsed_days,
    c.scheduled_days,
    c.learning_steps,
    c.reps,
    c.lapses,
    c.state,
    c.last_review === null ? '' : b36(c.last_review),
  ].join(',')
}

export function decodeCard(text: string): SrsCard | null {
  const p = text.split(',')
  if (p.length !== 10) return null
  const n = (s: string) => {
    const v = Number(s)
    return Number.isFinite(v) ? v : 0
  }
  const due = fromB36(p[0])
  if (!Number.isFinite(due)) return null
  return {
    due,
    stability: n(p[1]),
    difficulty: n(p[2]),
    elapsed_days: n(p[3]),
    scheduled_days: n(p[4]),
    learning_steps: n(p[5]),
    reps: n(p[6]),
    lapses: n(p[7]),
    state: n(p[8]),
    last_review: p[9] ? fromB36(p[9]) : null,
  }
}

export const encodeStat = (s: KanaStat) => [s.readOk, s.readTotal, s.writeScore, s.writeCount].map((v) => round(v, 2)).join(',')

export function decodeStat(text: string): KanaStat | null {
  const p = text.split(',').map(Number)
  if (p.length !== 4 || p.some((v) => !Number.isFinite(v))) return null
  return { readOk: p[0], readTotal: p[1], writeScore: p[2], writeCount: p[3] }
}

/** Todos los cursos del progreso, con el activo incluido. */
function allCourses(p: ProgressData): Record<string, CourseData> {
  const { lessons, records, kana, cards, unlockAll, grammar, units, daily } = p
  return { ...p.otherCourses, [p.course]: { lessons, records, kana, cards, unlockAll, grammar, units, daily } }
}

export type SplitProgress = {
  /** Lo que va en users/{uid}.progress (sin tarjetas ni estadísticas). */
  main: ReturnType<typeof toStored>
  /** Todos los documentos de tarjetas de cada curso, también los vacíos (así se vacían al reiniciar). */
  shards: Record<string, ShardDoc>
}

export function splitProgress(p: ProgressData): SplitProgress {
  const courses = allCourses(p)
  const shards: Record<string, ShardDoc> = {}
  const lean: Record<string, CourseData> = {}
  for (const [course, data] of Object.entries(courses)) {
    lean[course] = { ...data, cards: {}, kana: {} }
    for (let n = 0; n < SHARDS; n++) shards[shardId(course, n)] = { course, cards: {}, stats: {} }
    for (const [id, card] of Object.entries(data.cards)) {
      const parsed = parseCardId(id)
      if (parsed) shards[shardId(course, shardOf(parsed.char))].cards[id] = encodeCard(card)
    }
    for (const [char, stat] of Object.entries(data.kana)) shards[shardId(course, shardOf(char))].stats[char] = encodeStat(stat)
  }
  const { [p.course]: active, ...otherCourses } = lean
  return { main: toStored({ ...p, ...active, otherCourses }), shards }
}

/**
 * Arma el progreso desde el documento principal y los de tarjetas. El documento
 * principal puede traer tarjetas y estadísticas del formato anterior (versión 2):
 * se unen con las de los documentos aparte (tarjeta más reciente, estadísticas sumadas).
 */
export function joinProgress(main: unknown, shards: readonly unknown[]): ProgressData {
  const p = parseProgress(main)
  const extra: Record<string, CourseData> = {}
  for (const raw of shards) {
    if (!raw || typeof raw !== 'object') continue
    const { course, cards, stats } = raw as Partial<Record<keyof ShardDoc, unknown>>
    if (typeof course !== 'string' || !course) continue
    const data = (extra[course] ??= emptyCourse())
    for (const [id, text] of Object.entries(cards && typeof cards === 'object' ? cards : {})) {
      const card = typeof text === 'string' && parseCardId(id) ? decodeCard(text) : null
      if (card) data.cards[id] = card
    }
    for (const [char, text] of Object.entries(stats && typeof stats === 'object' ? stats : {})) {
      const stat = typeof text === 'string' ? decodeStat(text) : null
      if (stat) data.kana[char] = stat
    }
  }
  const courses = allCourses(p)
  for (const [course, data] of Object.entries(extra)) courses[course] = courses[course] ? mergeCourse(courses[course], data) : data
  const { [p.course]: active = emptyCourse(), ...otherCourses } = courses
  return { ...p, ...active, otherCourses }
}

/** El progreso tal como queda después de guardarlo y leerlo (con el redondeo del formato compacto). */
export const normalizeProgress = (p: ProgressData): ProgressData => {
  const { main, shards } = splitProgress(p)
  return joinProgress(main, Object.values(shards))
}

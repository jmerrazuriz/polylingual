import { grammarByCourse } from '../courses/content.ts'
import { euroCourses } from '../courses/euroCourses.ts'
import { lessons } from '../courses/ja/lessons.ts'
import type { DailyRecord, ProgressData } from './progress/model.ts'
import { nextPathLesson } from './path.ts'
import { unlockedGrammar } from './progress/unlock.ts'
import { cardsOfCourse, dueNowCount } from './review.ts'
import { weakItems } from './units.ts'

/**
 * Pasos posibles de la lección del día:
 * repasos (tarjetas vencidas) · debiles (si no hay repasos) · nuevo (siguiente lección) ·
 * gramatica (siguiente lección de gramática) · practica (sesión corta, cursos europeos) ·
 * juego (parejas con lo aprendido).
 */
export type DailyStep = 'repasos' | 'debiles' | 'nuevo' | 'gramatica' | 'practica' | 'juego'

export const dailyStepInfo: Record<DailyStep, { icon: string; title: string; text: string }> = {
  repasos: { icon: '🔁', title: 'Repasos', text: 'Las tarjetas que tocan hoy (hasta 8).' },
  debiles: { icon: '🎯', title: 'Puntos débiles', text: 'Lo que más te cuesta, para reforzarlo.' },
  nuevo: { icon: '🌱', title: 'Algo nuevo', text: 'La siguiente lección del curso.' },
  gramatica: { icon: '📐', title: 'Gramática', text: 'La siguiente lección de gramática.' },
  practica: { icon: '✍️', title: 'Práctica rápida', text: 'Unos ejercicios con las palabras que ya conoces.' },
  juego: { icon: '🎮', title: 'Mini juego', text: 'Parejas con lo que ya aprendiste.' },
}

/** Repasos por sesión dentro de la lección del día (el resto queda para /repasar). */
export const DAILY_REVIEW_LIMIT = 8

/**
 * Arma la lección de hoy a partir del progreso. Se guarda al abrirla, así que no
 * cambia durante el día aunque se completen lecciones en otro lado.
 */
export function planDaily(p: ProgressData, now: number, everythingOpen: boolean): DailyRecord {
  if (euroCourses[p.course]) return planEuroDaily(p, now, everythingOpen)
  const steps: DailyStep[] = []
  if (dueNowCount(cardsOfCourse(p.cards, 'ja'), now) > 0) steps.push('repasos')
  else if (weakItems(p).read.length > 0) steps.push('debiles')

  // La siguiente lección del recorrido: kana, contadores o kanji.
  const lesson = nextPathLesson(p, everythingOpen)
  if (lesson) steps.push('nuevo')

  const grammarIds = (grammarByCourse[p.course] ?? []).map((g) => g.id)
  const openGrammar = unlockedGrammar(grammarIds, p.grammar, p.lessons, everythingOpen || p.unlockAll)
  const grammar = grammarIds.find((id) => openGrammar.has(id) && !p.grammar[id])
  if (grammar) steps.push('gramatica')

  // El juego usa los kana aprendidos: hace falta al menos una lección de kana.
  if (lessons.some((l) => p.lessons[l.id])) steps.push('juego')

  return { steps, ...(lesson ? { lesson: lesson.id } : {}), ...(grammar ? { grammar } : {}), done: [] }
}

export const isDailyComplete = (r: DailyRecord | undefined) =>
  !!r && r.steps.length > 0 && r.steps.every((s) => r.done.includes(s))

/** Ejercicios de la práctica rápida del día. */
export const DAILY_PRACTICE_COUNT = 8

/** Palabras de las lecciones de palabras ya completadas del curso europeo activo. */
export const learnedWords = (p: ProgressData) => euroCourses[p.course]?.vocabLessons.filter((l) => p.lessons[l.id]).flatMap((l) => l.words) ?? []

/** El paso «nuevo» de un curso europeo guarda «tipo:id» del recorrido («grammar:fr-etre», «vocab:fv-…»). */
export const dailyPathItem = (lesson?: string) => {
  const i = lesson?.indexOf(':') ?? -1
  return lesson && i > 0 ? { kind: lesson.slice(0, i), id: lesson.slice(i + 1) } : null
}

/**
 * Lección del día de un curso europeo (alemán, francés): repasos vencidos, la siguiente lección del
 * recorrido (gramática, palabras o texto), una práctica rápida que cambia cada día y un juego de parejas.
 */
function planEuroDaily(p: ProgressData, now: number, everythingOpen: boolean): DailyRecord {
  const course = euroCourses[p.course]
  const steps: DailyStep[] = []
  if (dueNowCount(cardsOfCourse(p.cards, course.id), now) > 0) steps.push('repasos')

  const open = everythingOpen || p.unlockAll
  const status = course.itemStatus(p, open)
  const next = course.path.flatMap((u) => u.stops.flatMap((s) => s.items)).find((i) => i.kind !== 'exam' && status(i) === 'open')
  if (next) steps.push('nuevo')

  // La práctica rota por los modos según el día, con las palabras de las lecciones ya hechas
  // (así se salta los modos de niveles que aún no se estudian).
  const words = learnedWords(p)
  const learned = words.length > 0
  const day = Math.floor(now / 86_400_000)
  const modes = course.practiceModes.map((m) => m.mode)
  const mode = words.length
    ? [...modes.slice(day % modes.length), ...modes.slice(0, day % modes.length)].find((m) => course.practiceSession(m, words, DAILY_PRACTICE_COUNT).length >= 4)
    : undefined
  if (mode) steps.push('practica')

  if (learned) steps.push('juego')

  return { steps, ...(next ? { lesson: `${next.kind}:${next.id}` } : {}), ...(mode ? { mode } : {}), done: [] }
}

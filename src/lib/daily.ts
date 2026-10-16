import { grammarByCourse } from '../courses/content.ts'
import { lessons } from '../courses/ja/lessons.ts'
import type { DailyRecord, ProgressData } from './progress/model.ts'
import { nextPathLesson } from './path.ts'
import { unlockedGrammar } from './progress/unlock.ts'
import { dueNowCount } from './review.ts'
import { weakItems } from './units.ts'

/**
 * Pasos posibles de la lección del día:
 * repasos (tarjetas vencidas) · debiles (si no hay repasos) · nuevo (siguiente lección) ·
 * gramatica (siguiente lección de gramática) · juego (parejas con lo aprendido).
 */
export type DailyStep = 'repasos' | 'debiles' | 'nuevo' | 'gramatica' | 'juego'

export const dailyStepInfo: Record<DailyStep, { icon: string; title: string; text: string }> = {
  repasos: { icon: '🔁', title: 'Repasos', text: 'Las tarjetas que tocan hoy (hasta 8).' },
  debiles: { icon: '🎯', title: 'Puntos débiles', text: 'Lo que más te cuesta, para reforzarlo.' },
  nuevo: { icon: '🌱', title: 'Algo nuevo', text: 'La siguiente lección del curso.' },
  gramatica: { icon: '📐', title: 'Gramática', text: 'La siguiente lección de gramática.' },
  juego: { icon: '🎮', title: 'Mini juego', text: 'Parejas con lo que ya aprendiste.' },
}

/** Repasos por sesión dentro de la lección del día (el resto queda para /repasar). */
export const DAILY_REVIEW_LIMIT = 8

/**
 * Arma la lección de hoy a partir del progreso. Se guarda al abrirla, así que no
 * cambia durante el día aunque se completen lecciones en otro lado.
 */
export function planDaily(p: ProgressData, now: number, everythingOpen: boolean): DailyRecord {
  const steps: DailyStep[] = []
  if (dueNowCount(p.cards, now) > 0) steps.push('repasos')
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

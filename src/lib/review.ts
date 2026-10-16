import { hiragana, kanaByChar } from '../courses/ja/kana.ts'
import type { Kana } from '../courses/ja/types.ts'
import { dueCards, endOfDay, parseCardId, type SrsCard } from './progress/srs.ts'
import { type Question, romajiOptions } from './quiz.ts'
import type { WritingItem } from './writing.ts'

export const REVIEW_LIMIT = 20

export type ReviewPlan = { reading: Question[]; writing: WritingItem[] }

/**
 * Repasos pendientes: las tarjetas ya vencidas, las más atrasadas primero. Las que
 * vencen más tarde (p. ej. «en 10 minutos» tras un error) esperan a su hora.
 */
export function buildReview(cards: Record<string, SrsCard>, now: number, random = Math.random): ReviewPlan {
  const due = dueCards(cards, now)
    .filter((c) => kanaByChar.has(c.char))
    .slice(0, REVIEW_LIMIT)

  // Opciones incorrectas: caracteres que el usuario ya conoce (o los básicos, si aún son pocos).
  const known = Object.keys(cards).flatMap((id) => {
    const parsed = parseCardId(id)
    const kana = parsed?.skill === 'read' ? kanaByChar.get(parsed.char) : undefined
    return kana ? [kana] : []
  })
  const pool: Kana[] = known.length >= 4 ? known : hiragana.filter((k) => k.group === 'basic')

  const reading = due
    .filter((c) => c.skill === 'read')
    .map(({ char }): Question => {
      const kana = kanaByChar.get(char)!
      return random() < 0.5
        ? { type: 'kana-to-romaji', kana, options: romajiOptions(kana, pool, 4, random) }
        : { type: 'type-romaji', kana }
    })

  const writing = due
    .filter((c) => c.skill === 'write')
    .map(({ char }): WritingItem => {
      const kana = kanaByChar.get(char)!
      return { prompt: kana.romaji, kana: kana.char, parts: kana.parts }
    })

  return { reading, writing }
}

/** Cuántos repasos están pendientes ahora. */
export function dueNowCount(cards: Record<string, SrsCard>, now: number): number {
  return dueCards(cards, now).filter((c) => kanaByChar.has(c.char)).length
}

/** «hoy a las 18:30», «mañana» o «en 3 días». */
export function describeDue(due: number, now: number): string {
  if (due <= endOfDay(now)) {
    const time = new Date(due).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    return `hoy a las ${time}`
  }
  const days = Math.ceil((due - endOfDay(now)) / 86_400_000)
  return days <= 1 ? 'mañana' : `en ${days} días`
}

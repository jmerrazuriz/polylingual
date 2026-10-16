import { hiragana, kanaByChar } from '../courses/ja/kana.ts'
import { kanjiByChar } from '../courses/ja/kanji.ts'
import type { Kana } from '../courses/ja/types.ts'
import { dueCards, endOfDay, parseCardId, type SrsCard } from './progress/srs.ts'
import { type Question, romajiOptions } from './quiz.ts'
import { kanjiReviewExercise, kanjiWritingItem, type TaggedExercise } from './studyExercises.ts'
import { wordFromCard, wordReviewExercise } from './vocabExercises.ts'
import type { WritingItem } from './writing.ts'

export const REVIEW_LIMIT = 20

/**
 * Plan de una sesión de repaso: preguntas de lectura de kana, ejercicios de
 * kanji (significado o lectura) y de palabras (significado o escribirla en kana),
 * y escritura a mano (kana o kanji).
 */
export type ReviewPlan = { reading: Question[]; exercises: TaggedExercise[]; writing: WritingItem[] }

/** Caracteres que tienen tarjetas de repaso: kana, kanji y palabras («w-<id>»). */
export const isReviewable = (char: string) => kanaByChar.has(char) || kanjiByChar.has(char) || !!wordFromCard(char)

/**
 * Repasos pendientes: las tarjetas ya vencidas, las más atrasadas primero. Las que
 * vencen más tarde (p. ej. «en 10 minutos» tras un error) esperan a su hora.
 */
export function buildReview(cards: Record<string, SrsCard>, now: number, random = Math.random): ReviewPlan {
  const due = dueCards(cards, now)
    .filter((c) => isReviewable(c.char))
    .slice(0, REVIEW_LIMIT)

  // Opciones incorrectas: caracteres que el usuario ya conoce (o los básicos, si aún son pocos).
  const known = Object.keys(cards).flatMap((id) => {
    const parsed = parseCardId(id)
    const kana = parsed?.skill === 'read' ? kanaByChar.get(parsed.char) : undefined
    return kana ? [kana] : []
  })
  const pool: Kana[] = known.length >= 4 ? known : hiragana.filter((k) => k.group === 'basic')

  const reading = due
    .filter((c) => c.skill === 'read' && kanaByChar.has(c.char))
    .map(({ char }): Question => {
      const kana = kanaByChar.get(char)!
      return random() < 0.5
        ? { type: 'kana-to-romaji', kana, options: romajiOptions(kana, pool, 4, random) }
        : { type: 'type-romaji', kana }
    })

  const exercises = due.flatMap(({ char, skill }): TaggedExercise[] => {
    if (wordFromCard(char)) return [wordReviewExercise(char, skill, random)]
    return skill === 'read' && kanjiByChar.has(char) ? [kanjiReviewExercise(char, random)] : []
  })

  const writing = due
    .filter((c) => c.skill === 'write' && !wordFromCard(c.char))
    .map(({ char }): WritingItem => {
      const kana = kanaByChar.get(char)
      return kana ? { prompt: kana.romaji, kana: kana.char, parts: kana.parts } : kanjiWritingItem(char)
    })

  return { reading, exercises, writing }
}

/** Cuántos repasos están pendientes ahora. */
export function dueNowCount(cards: Record<string, SrsCard>, now: number): number {
  return dueCards(cards, now).filter((c) => isReviewable(c.char)).length
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

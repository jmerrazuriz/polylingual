import type { Kana } from '../content/types.ts'
import { shuffle } from './random.ts'

/**
 * Opciones de romaji para una pregunta: la correcta más distractores del pool.
 * Se descartan los que se escriben igual (じ y ぢ son ambos «ji»).
 */
export function romajiOptions(answer: Kana, pool: readonly Kana[], count = 4, random = Math.random): string[] {
  const distractors = [...new Set(pool.map((k) => k.romaji))].filter((r) => r !== answer.romaji)
  return shuffle([answer.romaji, ...shuffle(distractors, random).slice(0, count - 1)], random)
}

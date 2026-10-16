import type { Kana } from '../content/types.ts'
import { shuffle } from './random.ts'

/** Quita los caracteres que se escriben igual que otro (ぢ = じ = «ji»): no se podrían emparejar sin ambigüedad. */
export function uniqueByRomaji(pool: readonly Kana[]): Kana[] {
  const seen = new Map<string, Kana>()
  for (const kana of pool) if (!seen.has(kana.romaji)) seen.set(kana.romaji, kana)
  return [...seen.values()]
}

export type PairsRound = { left: Kana[]; right: Kana[] }

/** Reparte el pool en rondas de hasta `size` parejas; cada columna va desordenada por separado. */
export function buildPairsRounds(pool: readonly Kana[], size = 6, random = Math.random): PairsRound[] {
  const items = shuffle(uniqueByRomaji(pool), random)
  const rounds: PairsRound[] = []
  for (let i = 0; i < items.length; i += size) {
    let chunk = items.slice(i, i + size)
    // Una última ronda de 1 pareja no tiene gracia: se completa con caracteres ya vistos.
    if (chunk.length < 2 && items.length >= 2) chunk = [...chunk, ...items.slice(0, 2 - chunk.length)]
    rounds.push({ left: chunk, right: shuffle(chunk, random) })
  }
  return rounds
}

/** Puntos por acierto: 100 más un bonus por racha (combo) de aciertos seguidos. */
export const pointsForMatch = (combo: number) => 100 + 20 * (combo - 1)
export const PENALTY = 25

export type MemoryCard = { id: number; kana: Kana; face: 'kana' | 'romaji' }

/** Cartas para el juego de memoria: cada carácter aparece una vez como kana y otra como romaji. */
export function buildMemoryCards(pool: readonly Kana[], pairs = 6, random = Math.random): MemoryCard[] {
  const chosen = shuffle(uniqueByRomaji(pool), random).slice(0, pairs)
  const cards = chosen.flatMap((kana) => [
    { kana, face: 'kana' as const },
    { kana, face: 'romaji' as const },
  ])
  return shuffle(cards, random).map((card, id) => ({ ...card, id }))
}

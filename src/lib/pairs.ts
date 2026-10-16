import { counterpart } from '../content/kana.ts'
import type { Kana, Word } from '../content/types.ts'
import { shuffle } from './random.ts'
import { wordRomaji } from './words.ts'

/** Quita los caracteres que se escriben igual que otro (ぢ = じ = «ji»): no se podrían emparejar sin ambigüedad. */
export function uniqueByRomaji(pool: readonly Kana[]): Kana[] {
  const seen = new Map<string, Kana>()
  for (const kana of pool) if (!seen.has(kana.romaji)) seen.set(kana.romaji, kana)
  return [...seen.values()]
}

/** Una pareja para unir: lo de la izquierda (kana) con lo de la derecha (romaji, significado…). */
export type PairItem = {
  id: string
  left: string
  right: string
  /** Texto que se lee en voz alta. */
  speak: string
  /** Carácter cuyo dominio de lectura suma o resta al unirlo (solo en parejas de caracteres). */
  kana?: string
}

export function kanaPairItems(pool: readonly Kana[]): PairItem[] {
  return pool.map((k) => ({ id: k.char, left: k.char, right: k.romaji, speak: k.char, kana: k.char }))
}

/** Hiragana ↔ katakana de cada sílaba del pool que existe en ambos (か ↔ カ). */
export function scriptPairItems(pool: readonly Kana[]): PairItem[] {
  const pairs = new Map<string, PairItem>()
  for (const kana of pool) {
    const other = counterpart(kana)
    if (!other) continue
    const [hira, kata] = kana.script === 'hiragana' ? [kana, other] : [other, kana]
    pairs.set(hira.char, { id: hira.char, left: hira.char, right: kata.char, speak: hira.char })
  }
  return [...pairs.values()]
}

export function wordPairItems(words: readonly Word[], side: 'romaji' | 'meaning'): PairItem[] {
  return words.map((w) => ({ id: w.kana, left: w.kana, right: side === 'romaji' ? wordRomaji(w) : w.meaning, speak: w.kana }))
}

/** Quita parejas cuyo lado derecho o izquierdo se repite (じ y ぢ son ambos «ji»): serían ambiguas. */
export function uniquePairs(items: readonly PairItem[]): PairItem[] {
  const lefts = new Set<string>()
  const rights = new Set<string>()
  return items.filter((item) => {
    if (lefts.has(item.left) || rights.has(item.right)) return false
    lefts.add(item.left)
    rights.add(item.right)
    return true
  })
}

export type PairsRound = { left: PairItem[]; right: PairItem[] }

/** Reparte las parejas en rondas de hasta `size`; cada columna va desordenada por separado. */
export function buildPairsRounds(items: readonly PairItem[], size = 6, random = Math.random): PairsRound[] {
  const all = shuffle(uniquePairs(items), random)
  const rounds: PairsRound[] = []
  for (let i = 0; i < all.length; i += size) {
    let chunk = all.slice(i, i + size)
    // Una última ronda de 1 pareja no tiene gracia: se completa con parejas ya vistas.
    if (chunk.length < 2 && all.length >= 2) chunk = [...chunk, ...all.slice(0, 2 - chunk.length)]
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

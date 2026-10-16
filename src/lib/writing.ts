import type { Kana } from '../courses/ja/types.ts'
import { wordsForPool } from './quiz.ts'
import { shuffle } from './random.ts'
import { wordRomaji } from './words.ts'

export type WritingItem = {
  /** Lo que se pide escribir, en romaji. */
  prompt: string
  meaning?: string
  /** Respuesta completa en kana. */
  kana: string
  /** Caracteres que se dibujan uno por uno (きゃ → き, ゃ). */
  parts: string[]
}

export type WritingContent = 'kana' | 'words'

/** Ítems para una sesión de escritura: caracteres sueltos o palabras legibles con el pool. */
export function buildWritingItems(pool: readonly Kana[], content: WritingContent, random = Math.random): WritingItem[] {
  if (content === 'words') {
    return shuffle(wordsForPool(pool), random)
      .slice(0, 5)
      .map((w) => ({ prompt: wordRomaji(w), meaning: w.meaning, kana: w.kana, parts: [...w.kana] }))
  }
  const order: Kana[] = []
  while (order.length < 10 && pool.length > 0) order.push(...shuffle(pool, random))
  return order.slice(0, 10).map((k) => ({ prompt: k.romaji, kana: k.char, parts: k.parts }))
}

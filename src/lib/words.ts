import type { Word } from '../content/types.ts'
import { hiraganaWords } from '../content/words.ts'
import { syllables, toRomaji } from './romaji.ts'

export function wordRomaji(word: Word): string {
  return word.romaji ?? toRomaji(word.kana)
}

const byLength = (a: Word, b: Word) => [...a.kana].length - [...b.kana].length

/** Palabras que contienen la sílaba, las más cortas primero. */
export function wordsContaining(syllable: string, limit = 4): Word[] {
  return hiraganaWords
    .filter((w) => syllables(w.kana).includes(syllable))
    .sort(byLength)
    .slice(0, limit)
}

/** Palabras que se pueden leer solo con las sílabas aprendidas (opcionalmente, que incluyan una). */
export function wordsReadableWith(learned: Set<string>, options: { containing?: string; limit?: number } = {}): Word[] {
  const { containing, limit = Infinity } = options
  return hiraganaWords
    .filter((w) => {
      const parts = syllables(w.kana)
      return parts.every((s) => learned.has(s)) && (!containing || parts.includes(containing))
    })
    .sort(byLength)
    .slice(0, limit)
}

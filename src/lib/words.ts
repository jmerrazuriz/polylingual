import type { Word } from '../content/types.ts'
import { allWords } from '../content/words.ts'
import { romajiReadings, syllables, toRomaji } from './romaji.ts'

export function wordRomaji(word: Word): string {
  return word.romaji ?? toRomaji(word.kana)
}

/** Lecturas aceptadas al escribir la palabra en romaji. */
export function wordReadings(word: Word): string[] {
  return word.romaji ? [word.romaji] : romajiReadings(word.kana)
}

const byLength = (a: Word, b: Word) => [...a.kana].length - [...b.kana].length

/** Palabras que contienen la sílaba, las más cortas primero. */
export function wordsContaining(syllable: string, limit = 4): Word[] {
  return allWords
    .filter((w) => syllables(w.kana).includes(syllable))
    .sort(byLength)
    .slice(0, limit)
}

/** Palabras que se pueden leer solo con las sílabas aprendidas (opcionalmente, que incluyan una). */
export function wordsReadableWith(learned: Set<string>, options: { containing?: string; limit?: number } = {}): Word[] {
  const { containing, limit = Infinity } = options
  return allWords
    .filter((w) => {
      const parts = syllables(w.kana)
      return parts.every((s) => learned.has(s)) && (!containing || parts.includes(containing))
    })
    .sort(byLength)
    .slice(0, limit)
}

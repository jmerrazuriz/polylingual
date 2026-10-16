import type { Word } from '../content/types.ts'
import { hiraganaWords } from '../content/words.ts'
import { syllables, toRomaji } from './romaji.ts'

export function wordRomaji(word: Word): string {
  return word.romaji ?? toRomaji(word.kana)
}

/** Palabras que contienen la sílaba, las más cortas primero. */
export function wordsContaining(syllable: string, limit = 4): Word[] {
  return hiraganaWords
    .filter((w) => syllables(w.kana).includes(syllable))
    .sort((a, b) => [...a.kana].length - [...b.kana].length)
    .slice(0, limit)
}

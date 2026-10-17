import type { Gender } from './engine/declension.ts'
import type { CefrLevel } from './levels.ts'
import { vocabA1 } from './vocabA1.ts'
import { vocabA2 } from './vocabA2.ts'
import { vocabB1 } from './vocabB1.ts'
import { vocabB2 } from './vocabB2.ts'
import { vocabC1 } from './vocabC1.ts'

// Vocabulario del alemán. Cada sustantivo se aprende con su artículo y su plural.
// Los ids (la palabra, o palabra·clase si se repite) no deben cambiar: de ellos dependen
// las tarjetas de repaso guardadas («dw-<id>»).

export type GermanPos = 'noun' | 'verb' | 'adj' | 'adv' | 'phrase'

export type GermanWord = {
  id: string
  /** Sin artículo: «Tisch», «wohnen», «Guten Morgen». */
  word: string
  pos: GermanPos
  /** Solo sustantivos; 'pl' = solo existe en plural (die Eltern). */
  gender?: Gender | 'pl'
  /** Plural completo; null = no se usa en plural. */
  plural?: string | null
  /** n-Deklination (der Kollege → den Kollegen). */
  weak?: boolean
  meaning: string
  theme: string
  level: CefrLevel
}

/**
 * Datos compactos por tema:
 * - sustantivo: [género, palabra, plural ('' = sin plural), significado, 'w' si es débil]
 *   con género 'm' | 'f' | 'n' | 'p' (solo plural);
 * - otros: ['v' verbo | 'a' adjetivo | 'd' adverbio/función | 'x' expresión, palabra, significado].
 */
export type RawGermanWord =
  | [Gender | 'p', string, string, string]
  | [Gender | 'p', string, string, string, 'w']
  | ['v' | 'a' | 'd' | 'x', string, string]

export type GermanTheme = { id: string; title: string; words: RawGermanWord[] }

const posOf = { v: 'verb', a: 'adj', d: 'adv', x: 'phrase' } as const

function build(themes: GermanTheme[], level: CefrLevel, previous: GermanWord[] = []): GermanWord[] {
  const used = new Set(previous.map((w) => w.id))
  const seen = new Set(previous.map((w) => `${w.word}|${w.pos}`))
  const out: GermanWord[] = []
  for (const theme of themes) {
    for (const raw of theme.words) {
      const [tag, word] = raw
      const isNoun = tag === 'm' || tag === 'f' || tag === 'n' || tag === 'p'
      const pos: GermanPos = isNoun ? 'noun' : posOf[tag]
      if (seen.has(`${word}|${pos}`)) throw new Error(`Palabra repetida: ${word}`)
      seen.add(`${word}|${pos}`)
      const id = used.has(word) ? `${word}·${pos}` : word
      used.add(id)
      if (isNoun) {
        const [, , plural, meaning, flag] = raw as [Gender | 'p', string, string, string, 'w'?]
        out.push({
          id,
          word,
          pos,
          gender: tag === 'p' ? 'pl' : tag,
          plural: tag === 'p' ? word : plural || null,
          ...(flag === 'w' ? { weak: true } : {}),
          meaning,
          theme: theme.id,
          level,
        })
      } else {
        out.push({ id, word, pos, meaning: raw[2], theme: theme.id, level })
      }
    }
  }
  return out
}

export const germanThemesA1 = vocabA1
export const germanThemesA2 = vocabA2
export const germanThemesB1 = vocabB1
export const germanThemesB2 = vocabB2
export const germanThemesC1 = vocabC1
export const germanVocabA1 = build(vocabA1, 'A1')
export const germanVocabA2 = build(vocabA2, 'A2', germanVocabA1)
export const germanVocabB1 = build(vocabB1, 'B1', [...germanVocabA1, ...germanVocabA2])
export const germanVocabB2 = build(vocabB2, 'B2', [...germanVocabA1, ...germanVocabA2, ...germanVocabB1])
export const germanVocabC1 = build(vocabC1, 'C1', [...germanVocabA1, ...germanVocabA2, ...germanVocabB1, ...germanVocabB2])
export const germanVocab: GermanWord[] = [...germanVocabA1, ...germanVocabA2, ...germanVocabB1, ...germanVocabB2, ...germanVocabC1]
export const germanWordById = new Map(germanVocab.map((w) => [w.id, w]))

const articleOf: Record<Gender | 'pl', string> = { m: 'der', f: 'die', n: 'das', pl: 'die' }

/** «der Tisch», «die Eltern», «wohnen». */
export const withArticle = (w: GermanWord) => (w.pos === 'noun' ? `${articleOf[w.gender!]} ${w.word}` : w.word)
export const articleFor = (w: GermanWord) => (w.gender ? articleOf[w.gender] : '')

/** Ficha: «der Tisch, die Tische» · «das Obst (sin plural)». */
export function nounLine(w: GermanWord): string {
  if (w.pos !== 'noun') return w.word
  if (w.gender === 'pl') return `die ${w.word} (solo plural)`
  return w.plural ? `${withArticle(w)}, die ${w.plural}` : `${withArticle(w)} (sin plural)`
}

export type GermanVocabLesson = { id: string; title: string; theme: string; level: CefrLevel; words: GermanWord[] }

/** Lecciones de ~10 palabras por tema (partes parejas). Los ids son estables: «dv-<tema>-<n>». */
function lessonsOf(themes: GermanTheme[], words: GermanWord[], level: CefrLevel): GermanVocabLesson[] {
  return themes.flatMap((theme) => {
    const list = words.filter((w) => w.theme === theme.id)
    const n = Math.max(1, Math.round(list.length / 10))
    return Array.from({ length: n }, (_, i) => {
      const part = list.slice(Math.round((i * list.length) / n), Math.round(((i + 1) * list.length) / n))
      return { id: `dv-${theme.id}-${i + 1}`, title: n > 1 ? `${theme.title} · ${i + 1}` : theme.title, theme: theme.id, level, words: part }
    })
  })
}

export const germanVocabLessonsA1 = lessonsOf(vocabA1, germanVocabA1, 'A1')
export const germanVocabLessonsA2 = lessonsOf(vocabA2, germanVocabA2, 'A2')
export const germanVocabLessonsB1 = lessonsOf(vocabB1, germanVocabB1, 'B1')
export const germanVocabLessonsB2 = lessonsOf(vocabB2, germanVocabB2, 'B2')
export const germanVocabLessonsC1 = lessonsOf(vocabC1, germanVocabC1, 'C1')
export const germanVocabLessons: GermanVocabLesson[] = [...germanVocabLessonsA1, ...germanVocabLessonsA2, ...germanVocabLessonsB1, ...germanVocabLessonsB2, ...germanVocabLessonsC1]
export const germanVocabLessonById = new Map(germanVocabLessons.map((l) => [l.id, l]))

/** Tarjetas de repaso de palabras alemanas: «dw-<id>». */
export const GERMAN_WORD_PREFIX = 'dw-'
export const germanWordCard = (w: GermanWord) => GERMAN_WORD_PREFIX + w.id
export const germanWordFromCard = (char: string) =>
  char.startsWith(GERMAN_WORD_PREFIX) ? germanWordById.get(char.slice(GERMAN_WORD_PREFIX.length)) : undefined

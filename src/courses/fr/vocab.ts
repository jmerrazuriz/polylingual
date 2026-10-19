import { definiteArticle, indefiniteArticle } from './engine/articles.ts'
import { isHAspire } from './engine/phonetics.ts'
import type { CefrLevel } from './levels.ts'
import { vocabA1 } from './vocabA1.ts'
import { vocabA2 } from './vocabA2.ts'
import { vocabB1 } from './vocabB1.ts'
import { vocabB1b } from './vocabB1b.ts'
import { vocabB1c } from './vocabB1c.ts'
import { vocabB1d } from './vocabB1d.ts'
import { vocabB1e } from './vocabB1e.ts'
import { vocabB1f } from './vocabB1f.ts'
import { vocabB2a } from './vocabB2a.ts'
import { vocabB2b } from './vocabB2b.ts'
import { vocabB2c } from './vocabB2c.ts'
import { vocabB2d } from './vocabB2d.ts'
import { vocabB2e } from './vocabB2e.ts'
import { vocabB2f } from './vocabB2f.ts'
import { vocabB2g } from './vocabB2g.ts'
import { vocabC1a } from './vocabC1a.ts'
import { vocabC1b } from './vocabC1b.ts'
import { vocabC1c } from './vocabC1c.ts'
import { vocabC1d } from './vocabC1d.ts'
import { vocabC1e } from './vocabC1e.ts'
import { vocabC1f } from './vocabC1f.ts'
import { vocabC1g } from './vocabC1g.ts'
import { vocabC1h } from './vocabC1h.ts'
import { vocabC2a } from './vocabC2a.ts'
import { vocabC2b } from './vocabC2b.ts'
import { vocabC2c } from './vocabC2c.ts'
import { vocabC2d } from './vocabC2d.ts'
import { vocabC2e } from './vocabC2e.ts'
import { vocabC2f } from './vocabC2f.ts'
import { vocabC2g } from './vocabC2g.ts'
import { vocabC2h } from './vocabC2h.ts'
import { vocabC2i } from './vocabC2i.ts'
import { vocabC2j } from './vocabC2j.ts'

// Vocabulario del francés. Cada sustantivo se aprende con su artículo y su género (que el
// artículo elidido «l’» no deja ver). Los ids (la palabra, o palabra·clase si se repite) no deben
// cambiar: de ellos dependen las tarjetas de repaso guardadas («fw-<id>»).

export type FrenchPos = 'noun' | 'verb' | 'adj' | 'adv' | 'phrase'

export type FrenchWord = {
  id: string
  /** Sin artículo: «école», «parler», «bonjour». */
  word: string
  pos: FrenchPos
  /** Solo sustantivos; 'pl' = solo se usa en plural (les gens). */
  gender?: 'm' | 'f' | 'pl'
  /** Plural cuando es irregular (journal → journaux); null = no se usa en plural. Sin dato: regular (+s). */
  plural?: string | null
  /** Femenino de los adjetivos y de algunos sustantivos de persona (étudiant → étudiante). */
  feminine?: string
  /** h aspirada: sin elisión (le héros). */
  hAspire?: boolean
  meaning: string
  theme: string
  level: CefrLevel
}

/**
 * Datos compactos por tema:
 * - sustantivo: [género, palabra, significado, plural irregular o '-' (sin plural), femenino]
 *   con género 'm' | 'f' | 'p' (solo plural);
 * - adjetivo: ['a', palabra, significado, femenino] (si el femenino es igual, se omite);
 * - otros: ['v' verbo | 'd' adverbio/función | 'x' expresión, palabra, significado].
 */
export type RawFrenchWord =
  | ['m' | 'f' | 'p', string, string]
  | ['m' | 'f' | 'p', string, string, string]
  | ['m' | 'f' | 'p', string, string, string, string]
  | ['a', string, string]
  | ['a', string, string, string]
  | ['v' | 'd' | 'x', string, string]

export type FrenchTheme = { id: string; title: string; words: RawFrenchWord[] }

const posOf = { v: 'verb', a: 'adj', d: 'adv', x: 'phrase' } as const

function build(themes: FrenchTheme[], level: CefrLevel, previous: FrenchWord[] = []): FrenchWord[] {
  const used = new Set(previous.map((w) => w.id))
  const seen = new Set(previous.map((w) => `${w.word}|${w.pos}`))
  const out: FrenchWord[] = []
  for (const theme of themes) {
    for (const raw of theme.words) {
      const [tag, word, meaning] = raw
      const isNoun = tag === 'm' || tag === 'f' || tag === 'p'
      const pos: FrenchPos = isNoun ? 'noun' : posOf[tag]
      if (seen.has(`${word}|${pos}`)) throw new Error(`Palabra repetida: ${word}`)
      seen.add(`${word}|${pos}`)
      const id = used.has(word) ? `${word}·${pos}` : word
      used.add(id)
      const base: FrenchWord = { id, word, pos, meaning, theme: theme.id, level }
      if (isNoun) {
        const [, , , plural, feminine] = raw as [string, string, string, string?, string?]
        out.push({
          ...base,
          gender: tag === 'p' ? 'pl' : tag,
          ...(tag === 'p' ? {} : plural === '-' ? { plural: null } : plural ? { plural } : {}),
          ...(feminine ? { feminine } : {}),
          ...(isHAspire(word) ? { hAspire: true } : {}),
        })
      } else if (tag === 'a') {
        const feminine = raw[3]
        out.push({ ...base, ...(feminine ? { feminine } : {}) })
      } else out.push(base)
    }
  }
  return out
}

export const frenchThemesA1 = vocabA1
export const frenchThemesA2 = vocabA2
export const frenchThemesB1 = [...vocabB1, ...vocabB1b, ...vocabB1c, ...vocabB1d, ...vocabB1e, ...vocabB1f]
export const frenchVocabA1 = build(vocabA1, 'A1')
export const frenchVocabA2 = build(vocabA2, 'A2', frenchVocabA1)
export const frenchThemesB2 = [...vocabB2a, ...vocabB2b, ...vocabB2c, ...vocabB2d, ...vocabB2e, ...vocabB2f, ...vocabB2g]
export const frenchVocabB1 = build(frenchThemesB1, 'B1', [...frenchVocabA1, ...frenchVocabA2])
export const frenchVocabB2 = build(frenchThemesB2, 'B2', [...frenchVocabA1, ...frenchVocabA2, ...frenchVocabB1])
export const frenchThemesC1 = [...vocabC1a, ...vocabC1b, ...vocabC1c, ...vocabC1d, ...vocabC1e, ...vocabC1f, ...vocabC1g, ...vocabC1h]
export const frenchVocabC1 = build(frenchThemesC1, 'C1', [...frenchVocabA1, ...frenchVocabA2, ...frenchVocabB1, ...frenchVocabB2])
export const frenchThemesC2 = [...vocabC2a, ...vocabC2b, ...vocabC2c, ...vocabC2d, ...vocabC2e, ...vocabC2f, ...vocabC2g, ...vocabC2h, ...vocabC2i, ...vocabC2j]
export const frenchVocabC2 = build(frenchThemesC2, 'C2', [...frenchVocabA1, ...frenchVocabA2, ...frenchVocabB1, ...frenchVocabB2, ...frenchVocabC1])
export const frenchVocab: FrenchWord[] = [...frenchVocabA1, ...frenchVocabA2, ...frenchVocabB1, ...frenchVocabB2, ...frenchVocabC1, ...frenchVocabC2]
export const frenchWordById = new Map(frenchVocab.map((w) => [w.id, w]))

const typographic = (s: string) => s.replace(/'/g, '’')
const nounOf = (w: FrenchWord) => ({ word: w.word, gender: w.gender === 'f' ? ('f' as const) : ('m' as const), hAspire: w.hAspire })
const join = (art: string, word: string) => (art.endsWith("'") ? `${art.slice(0, -1)}’${word}` : `${art} ${word}`)

/** «le livre», «l’école», «les gens», «parler». */
export function withArticle(w: FrenchWord): string {
  if (w.pos !== 'noun') return typographic(w.word)
  if (w.gender === 'pl') return `les ${w.word}`
  return join(definiteArticle(nounOf(w)), typographic(w.word))
}

/** un / une (deja ver el género aunque el definido se elida). */
export const indefiniteFor = (w: FrenchWord) => (w.gender === 'pl' ? 'des' : indefiniteArticle(nounOf(w)))

/** Plural: el irregular declarado, o +s (sin cambio si termina en s, x o z). */
export function pluralOf(w: FrenchWord): string | null {
  if (w.gender === 'pl') return w.word
  if (w.plural !== undefined) return w.plural
  return /[sxz]$/.test(w.word) ? w.word : `${w.word}s`
}

const irregularPlural = (w: FrenchWord) => w.pos === 'noun' && w.gender !== 'pl' && w.plural !== undefined && w.plural !== null

/**
 * Ficha: «le livre (m.)» · «l’école (f.)» · «le journal, les journaux» · «petit, petite» ·
 * «l’étudiant, l’étudiante». El género se escribe siempre que el artículo no lo deja ver.
 */
export function nounLine(w: FrenchWord): string {
  if (w.pos === 'adj') return w.feminine ? `${typographic(w.word)}, ${typographic(w.feminine)}` : typographic(w.word)
  if (w.pos !== 'noun') return typographic(w.word)
  if (w.gender === 'pl') return `les ${typographic(w.word)} (solo plural)`
  const head = withArticle(w)
  if (w.feminine) return `${head}, ${join(definiteArticle({ word: w.feminine, gender: 'f' }), typographic(w.feminine))}`
  if (irregularPlural(w)) return `${head}, les ${typographic(w.plural!)}`
  if (w.plural === null) return `${head} (sin plural)`
  return head.includes('’') ? `${head} (${w.gender === 'm' ? 'm.' : 'f.'})` : head
}

/** Lo que se lee en voz alta al tocar la palabra. */
export const speakWord = (w: FrenchWord) => (w.pos === 'adj' && w.feminine ? `${w.word}, ${w.feminine}` : withArticle(w))

export type FrenchVocabLesson = { id: string; title: string; theme: string; level: CefrLevel; words: FrenchWord[] }

/** Lecciones de ~10 palabras por tema (partes parejas). Los ids son estables: «fv-<tema>-<n>». */
function lessonsOf(themes: FrenchTheme[], words: FrenchWord[], level: CefrLevel): FrenchVocabLesson[] {
  return themes.flatMap((theme) => {
    const list = words.filter((w) => w.theme === theme.id)
    const n = Math.max(1, Math.round(list.length / 10))
    return Array.from({ length: n }, (_, i) => {
      const part = list.slice(Math.round((i * list.length) / n), Math.round(((i + 1) * list.length) / n))
      return { id: `fv-${theme.id}-${i + 1}`, title: n > 1 ? `${theme.title} · ${i + 1}` : theme.title, theme: theme.id, level, words: part }
    })
  })
}

export const frenchVocabLessonsA1 = lessonsOf(vocabA1, frenchVocabA1, 'A1')
export const frenchVocabLessonsA2 = lessonsOf(vocabA2, frenchVocabA2, 'A2')
export const frenchVocabLessonsB1 = lessonsOf(frenchThemesB1, frenchVocabB1, 'B1')
export const frenchVocabLessonsB2 = lessonsOf(frenchThemesB2, frenchVocabB2, 'B2')
export const frenchVocabLessonsC1 = lessonsOf(frenchThemesC1, frenchVocabC1, 'C1')
export const frenchVocabLessonsC2 = lessonsOf(frenchThemesC2, frenchVocabC2, 'C2')
export const frenchVocabLessons: FrenchVocabLesson[] = [...frenchVocabLessonsA1, ...frenchVocabLessonsA2, ...frenchVocabLessonsB1, ...frenchVocabLessonsB2, ...frenchVocabLessonsC1, ...frenchVocabLessonsC2]
export const frenchVocabLessonById = new Map(frenchVocabLessons.map((l) => [l.id, l]))

/** Tarjetas de repaso de palabras francesas: «fw-<id>». */
export const FRENCH_WORD_PREFIX = 'fw-'
export const frenchWordCard = (w: FrenchWord) => FRENCH_WORD_PREFIX + w.id
export const frenchWordFromCard = (char: string) =>
  char.startsWith(FRENCH_WORD_PREFIX) ? frenchWordById.get(char.slice(FRENCH_WORD_PREFIX.length)) : undefined

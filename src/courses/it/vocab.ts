import { definiteArticle, indefiniteArticle, type Noun } from './engine/articles.ts'
import { pluralOf as nounPlural } from './engine/plurals.ts'
import type { CefrLevel } from './levels.ts'
import { vocabA1 } from './vocabA1.ts'
import { vocabA2 } from './vocabA2.ts'
import { vocabB1a } from './vocabB1a.ts'
import { vocabB1b } from './vocabB1b.ts'
import { vocabB1c } from './vocabB1c.ts'

// Vocabulario del italiano. Cada sustantivo se aprende con su artículo y su plural, porque el
// artículo cambia con el sonido inicial (il libro, lo zaino, l'amico; i libri, gli zaini, gli
// amici). Los ids (la palabra, o palabra·clase si se repite) no deben cambiar: de ellos dependen
// las tarjetas de repaso guardadas («iw-<id>»).

export type ItalianPos = 'noun' | 'verb' | 'adj' | 'adv' | 'phrase'

export type ItalianWord = {
  id: string
  /** Sin artículo: «libro», «parlare», «buongiorno». */
  word: string
  pos: ItalianPos
  /** Solo sustantivos. */
  gender?: 'm' | 'f'
  /** Se usa solo en plural (i genitori, le vacanze). */
  pluralOnly?: boolean
  /** Plural irregular o que la regla no deduce; null = no se usa en plural. Sin dato: la regla. */
  plural?: string | null
  /** El plural cambia de género: l'uovo → le uova. */
  pluralGender?: 'm' | 'f'
  /** No cambia en plural aunque la regla diga otra cosa (la foto, il cinema). */
  invariable?: boolean
  /** Femenino de adjetivos (si no es el regular -o → -a) y de sustantivos de persona (amico → amica). */
  feminine?: string
  meaning: string
  theme: string
  level: CefrLevel
}

/**
 * Datos compactos por tema:
 * - sustantivo: [género, palabra, significado, plural, femenino], con género 'm' | 'f', o 'pm' | 'pf'
 *   si solo se usa en plural. Plural: '' = la regla, '-' = sin plural, '=' = invariable,
 *   'uova:f' = irregular (y su género si cambia).
 * - adjetivo: ['a', palabra, significado, femenino] (sin femenino: -o → -a; los demás no cambian);
 * - otros: ['v' verbo | 'd' adverbio/función | 'x' expresión, palabra, significado].
 */
export type RawItalianWord =
  | ['m' | 'f' | 'pm' | 'pf', string, string]
  | ['m' | 'f' | 'pm' | 'pf', string, string, string]
  | ['m' | 'f' | 'pm' | 'pf', string, string, string, string]
  | ['a', string, string]
  | ['a', string, string, string]
  | ['v' | 'd' | 'x', string, string]

export type ItalianTheme = { id: string; title: string; words: RawItalianWord[] }

const posOf = { v: 'verb', a: 'adj', d: 'adv', x: 'phrase' } as const

/** Femenino regular de un adjetivo: -o → -a; los terminados en -e (o invariables) no cambian. */
const regularFeminine = (adj: string) => (adj.endsWith('o') ? `${adj.slice(0, -1)}a` : adj)

function build(themes: ItalianTheme[], level: CefrLevel, previous: ItalianWord[] = []): ItalianWord[] {
  const used = new Set(previous.map((w) => w.id))
  const seen = new Set(previous.map((w) => `${w.word}|${w.pos}`))
  const out: ItalianWord[] = []
  for (const theme of themes) {
    for (const raw of theme.words) {
      const [tag, word, meaning] = raw
      const isNoun = tag === 'm' || tag === 'f' || tag === 'pm' || tag === 'pf'
      const pos: ItalianPos = isNoun ? 'noun' : posOf[tag]
      if (seen.has(`${word}|${pos}`)) throw new Error(`Palabra repetida: ${word}`)
      seen.add(`${word}|${pos}`)
      const id = used.has(word) ? `${word}·${pos}` : word
      used.add(id)
      const base: ItalianWord = { id, word, pos, meaning, theme: theme.id, level }
      if (isNoun) {
        const [, , , plural = '', feminine] = raw as [string, string, string, string?, string?]
        const gender = tag === 'pm' || tag === 'm' ? 'm' : 'f'
        const [pl, plGender] = plural.split(':')
        out.push({
          ...base,
          gender,
          ...(tag === 'pm' || tag === 'pf' ? { pluralOnly: true } : {}),
          ...(pl === '-' ? { plural: null } : pl === '=' ? { invariable: true } : pl ? { plural: pl } : {}),
          ...(plGender ? { pluralGender: plGender as 'm' | 'f' } : {}),
          ...(feminine ? { feminine } : {}),
        })
      } else if (tag === 'a') {
        const feminine = raw[3] ?? regularFeminine(word)
        out.push({ ...base, ...(feminine !== word ? { feminine } : {}) })
      } else out.push(base)
    }
  }
  return out
}

export const italianThemesA1 = vocabA1
export const italianVocabA1 = build(vocabA1, 'A1')
export const italianThemesA2 = vocabA2
export const italianVocabA2 = build(vocabA2, 'A2', italianVocabA1)
export const italianThemesB1 = [...vocabB1a, ...vocabB1b, ...vocabB1c]
export const italianVocabB1 = build(italianThemesB1, 'B1', [...italianVocabA1, ...italianVocabA2])
export const italianVocab: ItalianWord[] = [...italianVocabA1, ...italianVocabA2, ...italianVocabB1]
export const italianWordById = new Map(italianVocab.map((w) => [w.id, w]))

const typographic = (s: string) => s.replace(/'/g, '’')
const join = (art: string, word: string) => (art.endsWith("'") ? `${art.slice(0, -1)}’${word}` : `${art} ${word}`)

/** El sustantivo como lo entiende el motor de artículos y plurales. */
export const nounOf = (w: ItalianWord): Noun => ({
  word: w.word,
  gender: w.gender ?? 'm',
  ...(w.plural ? { plural: w.plural } : {}),
  ...(w.pluralGender ? { pluralGender: w.pluralGender } : {}),
  ...(w.invariable ? { invariable: true } : {}),
})

/** Plural de un sustantivo; null si no se usa en plural. Los «solo plural» ya lo son. */
export function pluralOf(w: ItalianWord): string | null {
  if (w.pluralOnly) return w.word
  if (w.plural === null) return null
  return nounPlural(nounOf(w))
}

/** «il libro», «l’amico», «lo zaino», «i genitori», «parlare». */
export function withArticle(w: ItalianWord): string {
  if (w.pos !== 'noun') return typographic(w.word)
  if (w.pluralOnly) return join(definiteArticle({ ...nounOf(w), plural: w.word }, true), typographic(w.word))
  return join(definiteArticle(nounOf(w)), typographic(w.word))
}

/** «i libri», «gli zaini», «le uova»; null si no tiene plural. */
export function pluralWithArticle(w: ItalianWord): string | null {
  const p = pluralOf(w)
  if (w.pos !== 'noun' || p === null) return null
  return join(definiteArticle({ ...nounOf(w), plural: p }, true), typographic(p))
}

/** un, uno, una, un’: deja ver el género aunque el definido se elida. */
export const indefiniteFor = (w: ItalianWord) => indefiniteArticle(nounOf(w))

/**
 * Ficha: «il libro, i libri» · «lo zaino, gli zaini» · «l’uovo, le uova» · «l’amico, l’amica» ·
 * «la città, le città» · «i genitori (solo plural)» · «rosso, rossa».
 */
export function nounLine(w: ItalianWord): string {
  if (w.pos === 'adj') return w.feminine ? `${typographic(w.word)}, ${typographic(w.feminine)}` : typographic(w.word)
  if (w.pos !== 'noun') return typographic(w.word)
  if (w.pluralOnly) return `${withArticle(w)} (solo plural)`
  const head = withArticle(w)
  if (w.feminine) return w.feminine === w.word ? `${head} (m. y f.)` : `${head}, ${join(definiteArticle({ word: w.feminine, gender: 'f' }), typographic(w.feminine))}`
  const pl = pluralWithArticle(w)
  return pl ? `${head}, ${pl}` : `${head} (sin plural)`
}

/** Lo que se lee en voz alta al tocar la palabra. */
export const speakWord = (w: ItalianWord) => (w.pos === 'adj' && w.feminine ? `${w.word}, ${w.feminine}` : withArticle(w))

export type ItalianVocabLesson = { id: string; title: string; theme: string; level: CefrLevel; words: ItalianWord[] }

/** Lecciones de ~10 palabras por tema (partes parejas). Los ids son estables: «iv-<tema>-<n>». */
function lessonsOf(themes: ItalianTheme[], words: ItalianWord[], level: CefrLevel): ItalianVocabLesson[] {
  return themes.flatMap((theme) => {
    const list = words.filter((w) => w.theme === theme.id)
    const n = Math.max(1, Math.round(list.length / 10))
    return Array.from({ length: n }, (_, i) => {
      const part = list.slice(Math.round((i * list.length) / n), Math.round(((i + 1) * list.length) / n))
      return { id: `iv-${theme.id}-${i + 1}`, title: n > 1 ? `${theme.title} · ${i + 1}` : theme.title, theme: theme.id, level, words: part }
    })
  })
}

export const italianVocabLessonsA1 = lessonsOf(vocabA1, italianVocabA1, 'A1')
export const italianVocabLessonsA2 = lessonsOf(vocabA2, italianVocabA2, 'A2')
export const italianVocabLessonsB1 = lessonsOf(italianThemesB1, italianVocabB1, 'B1')
export const italianVocabLessons: ItalianVocabLesson[] = [...italianVocabLessonsA1, ...italianVocabLessonsA2, ...italianVocabLessonsB1]
export const italianVocabLessonById = new Map(italianVocabLessons.map((l) => [l.id, l]))

/** Tarjetas de repaso de palabras italianas: «iw-<id>». */
export const ITALIAN_WORD_PREFIX = 'iw-'
export const italianWordCard = (w: ItalianWord) => ITALIAN_WORD_PREFIX + w.id
export const italianWordFromCard = (char: string) =>
  char.startsWith(ITALIAN_WORD_PREFIX) ? italianWordById.get(char.slice(ITALIAN_WORD_PREFIX.length)) : undefined

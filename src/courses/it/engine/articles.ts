import { specialReason, startOf } from './phonetics'
import { type Gender, type PluralNoun, pluralOf } from './plurals'

// Artículos y determinantes del italiano. La forma depende del género, del número y de cómo
// empieza la palabra siguiente: il libro, lo studente, l'amico; i libri, gli studenti, gli amici;
// un amico, uno zaino, un'amica. Las preposiciones di, a, da, in y su se funden con el artículo.

export type { Gender }
export type Noun = PluralNoun & {
  /** Género del plural si cambia: l'uovo (m.) → le uova (f.). */
  pluralGender?: Gender
  /** Pariente en singular: el posesivo va sin artículo (mia madre, tuo fratello). */
  family?: boolean
}

export type Definite = 'il' | 'lo' | "l'" | 'la' | 'i' | 'gli' | 'le'

const genderOf = (n: Noun, plural: boolean) => (plural ? (n.pluralGender ?? n.gender) : n.gender)
const formOf = (n: Noun, plural: boolean) => (plural ? pluralOf(n) : n.word)

/** Artículo definido según la palabra que sigue. `next` permite que lo decida un adjetivo antepuesto. */
export function definiteFor(word: string, gender: Gender, plural: boolean): Definite {
  const start = startOf(word)
  if (gender === 'f') return plural ? 'le' : start === 'vowel' ? "l'" : 'la'
  // «gli dei» es la excepción histórica.
  if (plural) return start === 'consonant' && word !== 'dei' ? 'i' : 'gli'
  return start === 'special' ? 'lo' : start === 'vowel' ? "l'" : 'il'
}

export const definiteArticle = (n: Noun, plural = false): Definite => definiteFor(formOf(n, plural), genderOf(n, plural), plural)

/** un, uno, una o un' (en plural, el partitivo: dei, degli, delle). */
export function indefiniteArticle(n: Noun, plural = false): string {
  if (plural) return partitiveArticle(n, true)
  const start = startOf(n.word)
  if (n.gender === 'f') return start === 'vowel' ? "un'" : 'una'
  return start === 'special' ? 'uno' : 'un'
}

export type Preposition = 'di' | 'a' | 'da' | 'in' | 'su'
const PREFIX: Record<Preposition, string> = { di: 'de', a: 'a', da: 'da', in: 'ne', su: 'su' }

/** Preposición articulada: di + il = del, in + lo = nello, su + l' = sull', a + gli = agli. */
export function articulated(prep: Preposition, article: Definite): string {
  const p = PREFIX[prep]
  if (article === 'il') return `${p}l`
  if (article === 'i') return `${p}i`
  if (article === 'gli') return `${p}gli`
  return `${p}l${article}`
}

/** Partitivo: del pane, dello zucchero, dell'acqua, della pasta, dei libri, degli amici, delle mele. */
export const partitiveArticle = (n: Noun, plural = false) => articulated('di', definiteArticle(n, plural))

/** Junta determinante y palabra, sin espacio tras el apóstrofo: «l'amico», «il libro». */
export const join = (det: string, word: string) => (det.endsWith("'") ? `${det}${word}` : `${det} ${word}`)

export const withDefinite = (n: Noun, plural = false) => join(definiteArticle(n, plural), formOf(n, plural))
export const withIndefinite = (n: Noun, plural = false) => join(indefiniteArticle(n, plural), formOf(n, plural))
export const withPartitive = (n: Noun, plural = false) => join(partitiveArticle(n, plural), formOf(n, plural))
export const withArticulated = (prep: Preposition, n: Noun, plural = false) => join(articulated(prep, definiteArticle(n, plural)), formOf(n, plural))

/** «quello» y «bello» antepuestos siguen al artículo: quel libro, quello studente, quell'amico, quegli amici. */
function likeArticle(base: 'que' | 'be', article: Definite): string {
  switch (article) {
    case 'il':
      return `${base}l`
    case 'lo':
      return `${base}llo`
    case "l'":
      return `${base}ll'`
    case 'la':
      return `${base}lla`
    case 'i':
      return `${base}i`
    case 'gli':
      return `${base}gli`
    case 'le':
      return `${base}lle`
  }
}

export const quello = (n: Noun, plural = false) => likeArticle('que', definiteArticle(n, plural))
export const bello = (n: Noun, plural = false) => likeArticle('be', definiteArticle(n, plural))

/** questo, questa, questi, queste. */
export function questo(n: Noun, plural = false): string {
  const g = genderOf(n, plural)
  if (plural) return g === 'm' ? 'questi' : 'queste'
  return g === 'm' ? 'questo' : 'questa'
}

/** Posesivos por poseedor (io, tu, lui/lei, noi, voi, loro): masc., fem., masc. pl., fem. pl. */
export const POSSESSIVES: [string, string, string, string][] = [
  ['mio', 'mia', 'miei', 'mie'],
  ['tuo', 'tua', 'tuoi', 'tue'],
  ['suo', 'sua', 'suoi', 'sue'],
  ['nostro', 'nostra', 'nostri', 'nostre'],
  ['vostro', 'vostra', 'vostri', 'vostre'],
  ['loro', 'loro', 'loro', 'loro'],
]

export function possessive(owner: number, n: Noun, plural = false): string {
  const [m, f, mp, fp] = POSSESSIVES[owner]
  const g = genderOf(n, plural)
  if (plural) return g === 'm' ? mp : fp
  return g === 'm' ? m : f
}

/**
 * Posesivo con su artículo: «la mia casa», «i miei amici». Con parientes en singular va sin
 * artículo («mia madre»), salvo con «loro» («il loro padre») y en plural («i miei fratelli»).
 */
export function withPossessive(owner: number, n: Noun, plural = false): string {
  const poss = possessive(owner, n, plural)
  const noun = `${poss} ${formOf(n, plural)}`
  if (n.family && !plural && owner !== 5) return noun
  return join(definiteFor(poss, genderOf(n, plural), plural), noun)
}

/** Por qué se usa cada artículo: la regla que lo decide, para la corrección explicada. */
export function articleReason(n: Noun, article: string, plural = false): string {
  const word = formOf(n, plural)
  const g = genderOf(n, plural) === 'm' ? 'masculino' : 'femenino'
  const start = startOf(word)
  if (article === "l'") return `«${word}» empieza por vocal: ${n.gender === 'm' ? 'il' : 'la'} se reduce a l’.`
  if (article === 'lo' || (article === 'gli' && start === 'special')) return `«${word}» empieza por ${specialReason(word)}: el masculino usa ${plural ? 'gli' : 'lo'}, no ${plural ? 'i' : 'il'}.`
  if (article === 'gli') return `Masculino plural que empieza por vocal: gli (gli amici), nunca «i».`
  if (article === 'uno') return `«${word}» empieza por ${specialReason(word)}: el indefinido masculino es uno.`
  if (article === "un'") return `Femenino que empieza por vocal: una se reduce a un’ (un’amica).`
  if (article === 'un' && start === 'vowel') return `Masculino: «un» sin apóstrofo, aunque siga una vocal (un amico).`
  return `«${word}» es ${g}${plural ? ' plural' : ''} y empieza por consonante: ${article}.`
}

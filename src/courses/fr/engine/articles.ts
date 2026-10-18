import { elides } from './phonetics'

// Artículos y determinantes del francés, con elisión (l’, cet, mon delante de vocal)
// y contracción con «à» y «de» (au, aux, du, des).

export type Gender = 'm' | 'f'
export type Noun = {
  /** La palabra sin artículo: «école», «héros». */
  word: string
  gender: Gender
  /** Forzar h aspirada cuando la lista de `phonetics` no la cubre. */
  hAspire?: boolean
}

const join = (det: string, word: string) => (det.endsWith("'") ? `${det}${word}` : `${det} ${word}`)
const vowelStart = (n: Noun) => elides(n.word, n.hAspire)

/** le, la, l’ o les. */
export function definiteArticle(n: Noun, plural = false): string {
  if (plural) return 'les'
  if (vowelStart(n)) return "l'"
  return n.gender === 'm' ? 'le' : 'la'
}

/** un, une o des. */
export const indefiniteArticle = (n: Noun, plural = false) => (plural ? 'des' : n.gender === 'm' ? 'un' : 'une')

/** Partitivo: du, de la, de l’ o des («du pain», «de l’eau»). */
export function partitiveArticle(n: Noun, plural = false): string {
  if (plural) return 'des'
  if (vowelStart(n)) return "de l'"
  return n.gender === 'm' ? 'du' : 'de la'
}

/** Tras una negación, un/une/des/du/de la pasan a «de» (d’ ante vocal): «pas de pain», «pas d’eau». */
export const negativeArticle = (n: Noun) => (vowelStart(n) ? "d'" : 'de')

/** Contracción de «à» o «de» con el artículo definido: au, aux, du, des; à la, à l’, de la, de l’ no cambian. */
export function contract(prep: 'à' | 'de', article: string): string {
  if (article === 'le') return prep === 'à' ? 'au' : 'du'
  if (article === 'les') return prep === 'à' ? 'aux' : 'des'
  return `${prep} ${article}`
}

/** «à» o «de» + artículo definido + sustantivo: «au marché», «de l’hôpital», «aux enfants». */
export const withPreposition = (prep: 'à' | 'de', n: Noun, plural = false) => join(contract(prep, definiteArticle(n, plural)), n.word)

export const withDefinite = (n: Noun, plural = false) => join(definiteArticle(n, plural), n.word)
export const withIndefinite = (n: Noun, plural = false) => join(indefiniteArticle(n, plural), n.word)
export const withPartitive = (n: Noun, plural = false) => join(partitiveArticle(n, plural), n.word)

/** ce, cet (masculino ante vocal), cette o ces. */
export function demonstrative(n: Noun, plural = false): string {
  if (plural) return 'ces'
  if (n.gender === 'f') return 'cette'
  return vowelStart(n) ? 'cet' : 'ce'
}

/** Poseedor por persona: je, tu, il/elle, nous, vous, ils/elles. */
const POSSESSIVES: [m: string, f: string, pl: string][] = [
  ['mon', 'ma', 'mes'],
  ['ton', 'ta', 'tes'],
  ['son', 'sa', 'ses'],
  ['notre', 'notre', 'nos'],
  ['votre', 'votre', 'vos'],
  ['leur', 'leur', 'leurs'],
]

/** Posesivo: «mon amie» (ma → mon ante vocal), «sa maison», «leurs enfants». */
export function possessive(owner: number, n: Noun, plural = false): string {
  const [m, f, pl] = POSSESSIVES[owner]
  if (plural) return pl
  if (n.gender === 'm') return m
  return owner < 3 && vowelStart(n) ? m : f
}

/** Por qué se usa cada artículo: la regla que lo decide, para la corrección explicada. */
export function articleReason(n: Noun, article: string): string {
  if (article === "l'") return `«${n.word}» empieza por ${/^h/i.test(n.word) ? 'h muda' : 'vocal'}: le/la se reduce a l’.`
  if (/^h/i.test(n.word) && !vowelStart(n)) return `«${n.word}» tiene h aspirada: no hay elisión (${n.gender === 'm' ? 'le' : 'la'} ${n.word}).`
  if (article === 'cet') return `Masculino que empieza por vocal o h muda: ce → cet.`
  if (article === 'mon' && n.gender === 'f') return `Femenino que empieza por vocal: ma → mon para no juntar dos vocales.`
  return `«${n.word}» es ${n.gender === 'm' ? 'masculino' : 'femenino'}.`
}

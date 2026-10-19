// Cómo empieza una palabra italiana, que es lo que decide el artículo (il / lo / l', un / uno / un')
// y la preposición articulada (del / dello / dell').

/** «s impura» (s + consonante), z, gn, ps, pn, x, y, e «i» + vocal: piden lo / gli / uno. */
const SPECIAL = /^(s[^aeiouàèéìòóù]|z|gn|ps|pn|x|y|i[aeiouàèéìòóù])/i
/** Vocal, o h muda de préstamos (l'hotel, l'hamburger). */
const VOWEL = /^[aeiouàèéìòóùh]/i

export type Start = 'special' | 'vowel' | 'consonant'

export function startOf(word: string): Start {
  if (SPECIAL.test(word)) return 'special'
  if (VOWEL.test(word)) return 'vowel'
  return 'consonant'
}

/** Por qué una palabra es «especial» para el artículo: «s + consonante», «z», «gn»… */
export function specialReason(word: string): string {
  const w = word.toLowerCase()
  if (/^s[^aeiouàèéìòóù]/.test(w)) return 's + consonante'
  if (w.startsWith('gn')) return 'gn'
  if (w.startsWith('ps')) return 'ps'
  if (w.startsWith('pn')) return 'pn'
  if (/^i[aeiouàèéìòóù]/.test(w)) return 'i + vocal'
  return w[0]
}

/** Grupos de vocales: una aproximación a las sílabas (basta para reconocer las monosílabas). */
export const vowelGroups = (word: string) => (word.toLowerCase().match(/[aeiouàèéìòóù]+/g) ?? []).length

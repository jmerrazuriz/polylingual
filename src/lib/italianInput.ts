// Comparar respuestas escritas en italiano. Las mayúsculas no cuentan y el apóstrofo recto o
// tipográfico da igual. Si solo faltan o sobran tildes, la respuesta cuenta pero se avisa «casi».
// Una doble consonante que falta o sobra es un error (pala ≠ palla), pero se explica.

export type ItalianCheck = 'ok' | 'accents' | 'doubles' | 'wrong'

const tidy = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/\s*'\s*/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s*[.!?]+$/, '')

/** Quita las tildes: «città» → «citta», «perché» → «perche». */
export const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Reduce las consonantes dobles a una: «palla» → «pala», «mozzarella» → «mozarela». */
export const collapseDoubles = (s: string) => s.replace(/([b-df-hj-np-tv-z])\1/gi, '$1')

export function checkItalian(input: string, expected: string | string[]): ItalianCheck {
  const answers = (Array.isArray(expected) ? expected : [expected]).map(tidy)
  const given = tidy(input)
  if (answers.includes(given)) return 'ok'
  if (answers.some((a) => stripAccents(a) === stripAccents(given))) return 'accents'
  if (answers.some((a) => collapseDoubles(stripAccents(a)) === collapseDoubles(stripAccents(given)))) return 'doubles'
  return 'wrong'
}

/**
 * Qué doble consonante falla: «Lleva doble l: palla» o «Va con una sola l: pala».
 * Devuelve undefined si la diferencia no es de dobles.
 */
export function doublesHint(input: string, expected: string): string | undefined {
  const a = stripAccents(tidy(input))
  const b = stripAccents(tidy(expected))
  if (a === b || collapseDoubles(a) !== collapseDoubles(b)) return undefined
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  // En la primera diferencia, una de las dos dobla la letra anterior.
  if (b[i] === b[i - 1]) return `Lleva doble «${b[i]}»: se escribe «${expected}».`
  return `Va con una sola «${a[i]}»: se escribe «${expected}».`
}

/** Letras con tilde para el teclado en pantalla. */
export const italianKeys = ['à', 'è', 'é', 'ì', 'ò', 'ù'] as const

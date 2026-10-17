// Comparar respuestas escritas en alemán. Se aceptan los umlauts escritos como ae/oe/ue y la ß
// como ss (para teclados sin esas letras). Las mayúsculas cuentan: un sustantivo en minúscula
// se marca como «casi» para avisar sin castigar.

export type GermanCheck = 'ok' | 'case' | 'wrong'

const tidy = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/[.!?]$/, '')

/** «Mädchen» → «Maedchen», «Straße» → «Strasse». */
export function foldGerman(s: string): string {
  return s
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
}

export function checkGerman(input: string, expected: string | string[]): GermanCheck {
  const answers = Array.isArray(expected) ? expected : [expected]
  const given = foldGerman(tidy(input))
  if (answers.some((a) => foldGerman(tidy(a)) === given)) return 'ok'
  if (answers.some((a) => foldGerman(tidy(a)).toLowerCase() === given.toLowerCase())) return 'case'
  return 'wrong'
}

/** Letras especiales para el teclado en pantalla. */
export const germanKeys = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'] as const

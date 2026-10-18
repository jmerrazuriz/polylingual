// Comparar respuestas escritas en francés. Las mayúsculas no cuentan, œ/æ pueden escribirse oe/ae
// y el apóstrofo recto o tipográfico da igual. Si solo faltan o sobran acentos o la cedilla,
// la respuesta cuenta pero se avisa como «casi».

export type FrenchCheck = 'ok' | 'accents' | 'wrong'

const tidy = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/\s*'\s*/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s*[.!?]+$/, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')

/** Quita acentos y cedilla: «élève» → «eleve», «garçon» → «garcon». */
export const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

export function checkFrench(input: string, expected: string | string[]): FrenchCheck {
  const answers = (Array.isArray(expected) ? expected : [expected]).map(tidy)
  const given = tidy(input)
  if (answers.includes(given)) return 'ok'
  if (answers.some((a) => stripAccents(a) === stripAccents(given))) return 'accents'
  return 'wrong'
}

/** Letras especiales para el teclado en pantalla. */
export const frenchKeys = ['é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'û', 'ù', 'ü', 'ç', 'œ'] as const

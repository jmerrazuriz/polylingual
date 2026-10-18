import { type FrenchWord, frenchVocab, indefiniteFor, nounLine, withArticle } from './vocab.ts'

// Explicaciones de la corrección para las palabras francesas: por qué un sustantivo es
// masculino o femenino, cómo se forma el femenino de un adjetivo y qué es cada opción incorrecta.

/** Cognados con el género distinto del español: la trampa más frecuente. */
const SPANISH_GENDER: Record<string, string> = {
  lait: 'la leche',
  mer: 'el mar',
  dent: 'el diente',
  nez: 'la nariz',
  couleur: 'el color',
  douleur: 'el dolor',
  équipe: 'el equipo',
  sang: 'la sangre',
  valeur: 'el valor',
  miel: 'la miel',
  légume: 'la legumbre',
  analyse: 'el análisis',
  planète: 'el planeta',
  date: 'el dato',
  fin: 'el fin',
  sourire: 'la sonrisa',
}

const FEMININE_ENDINGS: [RegExp, string][] = [
  [/(tion|sion)$/, '-tion/-sion'],
  [/té$/, '-té'],
  [/ette$/, '-ette'],
  [/ure$/, '-ure'],
  [/(ance|ence)$/, '-ance/-ence'],
  [/ie$/, '-ie'],
  [/ade$/, '-ade'],
  [/ée$/, '-ée'],
  [/(elle|esse)$/, '-elle/-esse'],
  [/ière$/, '-ière'],
]

const MASCULINE_ENDINGS: [RegExp, string][] = [
  [/ment$/, '-ment'],
  [/age$/, '-age'],
  [/isme$/, '-isme'],
  [/eau$/, '-eau'],
  [/oir$/, '-oir'],
  [/et$/, '-et'],
  [/ier$/, '-ier'],
  [/al$/, '-al'],
  [/eu$/, '-eu'],
  [/teur$/, '-teur'],
]

const genderName = (g: 'm' | 'f') => (g === 'm' ? 'masculino' : 'femenino')

/** Por qué tiene ese género: la terminación que lo delata, la excepción, o que hay que aprenderlo. */
export function genderReason(w: FrenchWord): string {
  if (w.pos !== 'noun' || w.gender === 'pl' || !w.gender) return ''
  const g = w.gender
  const head = `${indefiniteFor(w)} ${w.word.replace(/'/g, '’')}`
  const spanish = SPANISH_GENDER[w.word]
  if (spanish) return `${head}: es ${genderName(g)}, al revés que en español (${spanish}). Ojo con esta.`
  const word = w.word.split(' ')[0]
  const fem = FEMININE_ENDINGS.find(([re]) => re.test(word))
  const masc = MASCULINE_ENDINGS.find(([re]) => re.test(word))
  const rule = fem ?? masc
  if (rule) {
    const expected = fem ? 'f' : 'm'
    if (expected === g) return `${head}: las palabras en ${rule[1]} suelen ser ${genderName(g)}s.`
    return `${head}: es ${genderName(g)} aunque termina en ${rule[1]} (casi siempre ${genderName(expected)}). Es una excepción que conviene memorizar.`
  }
  if (w.feminine) return `${head}: es la forma masculina; el femenino es «${w.feminine}».`
  if (word !== w.word) return `${head}: en las palabras compuestas manda la primera («${word}»).`
  return `${head}: el género no se deduce de la terminación; apréndelo con su artículo.`
}

/** Cómo se forma el femenino de un adjetivo. */
export function feminineReason(w: FrenchWord): string {
  const m = w.word
  const f = w.feminine ?? m
  if (f === m) return m.endsWith('e') ? `«${m}» ya termina en -e: el femenino es igual.` : `«${m}» no cambia en femenino.`
  const pairs: [RegExp, string][] = [
    [/eux$/, '-eux → -euse'],
    [/if$/, '-if → -ive'],
    [/er$/, '-er → -ère'],
    [/ien$/, '-ien → -ienne (se dobla la n)'],
    [/on$/, '-on → -onne (se dobla la n)'],
    [/el$/, '-el → -elle (se dobla la l)'],
    [/et$/, '-et → -ette (se dobla la t)'],
  ]
  const irregular = !f.startsWith(m)
  if (irregular) return `«${m}» → «${f}»: femenino irregular, hay que aprenderlo.`
  const rule = pairs.find(([re]) => re.test(m) && f !== `${m}e`)
  if (rule) return `«${m}» → «${f}»: ${rule[1]}.`
  return `«${m}» → «${f}»: el femenino agrega -e${/[dtsn]$/.test(m) ? ' y la consonante final se pronuncia' : ''}.`
}

/** Explicación breve de la palabra para las respuestas correctas. */
export function wordNote(w: FrenchWord): string {
  const line = nounLine(w)
  if (w.pos === 'noun' && w.gender && w.gender !== 'pl' && line.includes('’')) return `«${w.meaning}» se dice ${line}: ${indefiniteFor(w)} ${w.word.replace(/'/g, '’')}.`
  return `«${w.meaning}» se dice ${line}.`
}

const byMeaning = new Map<string, FrenchWord>()
const byText = new Map<string, FrenchWord>()
for (const w of frenchVocab) {
  if (!byMeaning.has(w.meaning)) byMeaning.set(w.meaning, w)
  if (!byText.has(withArticle(w))) byText.set(withArticle(w), w)
}

/** Para cada significado incorrecto, cómo se dice en francés. */
export function whyWrongMeanings(options: readonly string[], answer: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const o of options) {
    const w = o !== answer ? byMeaning.get(o) : undefined
    if (w) out[o] = `«${o}» se dice ${withArticle(w)}.`
  }
  return out
}

/** Para cada palabra francesa incorrecta, qué significa. */
export function whyWrongWords(options: readonly string[], answer: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const o of options) {
    const w = o !== answer ? byText.get(o) : undefined
    if (w) out[o] = `${o} significa «${w.meaning}».`
  }
  return out
}

/** un / une: por qué no es el otro. */
export function articleWhyWrong(w: FrenchWord): Record<string, string> {
  const wrong = indefiniteFor(w) === 'un' ? 'une' : 'un'
  return { [wrong]: `«${w.word.replace(/'/g, '’')}» es ${genderName(w.gender === 'f' ? 'f' : 'm')}: ${indefiniteFor(w)}, no ${wrong}.` }
}

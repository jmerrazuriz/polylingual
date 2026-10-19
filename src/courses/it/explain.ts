import { articleReason } from './engine/articles.ts'
import { pluralReason } from './engine/plurals.ts'
import { type ItalianWord, indefiniteFor, italianVocab, nounLine, nounOf, withArticle } from './vocab.ts'

// Explicaciones de la corrección para las palabras italianas: por qué un sustantivo es
// masculino o femenino, por qué lleva ese artículo y ese plural, y qué es cada opción incorrecta.

/** Cognados con el género distinto del español: la trampa más frecuente. */
const SPANISH_GENDER: Record<string, string> = {
  latte: 'la leche',
  sale: 'la sal',
  naso: 'la nariz',
  fiore: 'la flor',
  sangue: 'la sangre',
  miele: 'la miel',
  fine: 'el fin',
  origine: 'el origen',
  analisi: 'el análisis',
}

/** Masculinos en -a (casi todos de origen griego) y femeninos en -o: las excepciones de siempre. */
const MASCULINE_A = ['problema', 'programma', 'sistema', 'tema', 'clima', 'cinema', 'pigiama', 'dramma', 'poeta', 'pianeta', 'papà', 'collega', 'capo']
const FEMININE_O = ['mano', 'radio', 'foto', 'moto', 'auto', 'eco']

const FEMININE_ENDINGS: [RegExp, string][] = [
  [/(zione|sione)$/, '-zione/-sione'],
  [/(tà|tù)$/, '-tà/-tù'],
  [/ice$/, '-ice'],
  [/(udine|igine)$/, '-udine/-igine'],
  [/ie$/, '-ie'],
]

const MASCULINE_ENDINGS: [RegExp, string][] = [
  [/ore$/, '-ore'],
  [/ame$/, '-ame'],
  [/one$/, '-one'],
  [/[^aeiouàèéìòù]$/, 'consonante (las palabras extranjeras)'],
]

const genderName = (g: 'm' | 'f') => (g === 'm' ? 'masculino' : 'femenino')

/** Por qué tiene ese género: la terminación que lo delata, la excepción, o que hay que aprenderlo. */
export function genderReason(w: ItalianWord): string {
  if (w.pos !== 'noun' || !w.gender) return ''
  const g = w.gender
  // El definido deja ver el género salvo ante vocal (l’); ahí se usa el indefinido.
  const article = withArticle(w).includes('’') ? indefiniteFor(w) : withArticle(w).split(' ')[0]
  const head = `${article}${article.endsWith("'") ? '' : ' '}${w.word}`.replace(/'/g, '’')
  const spanish = SPANISH_GENDER[w.word]
  if (spanish) return `${head}: es ${genderName(g)}, al revés que en español (${spanish}). Ojo con esta.`
  const word = w.word.split(' ')[0]
  if (MASCULINE_A.includes(word)) return `${head}: es masculino aunque termina en -a (como il problema, il cinema).`
  if (FEMININE_O.includes(word)) return `${head}: es femenino aunque termina en -o (como la mano, la foto).`
  if (w.feminine) return `${head}: es la forma masculina; el femenino es «${w.feminine}».`
  const fem = FEMININE_ENDINGS.find(([re]) => re.test(word))
  const masc = MASCULINE_ENDINGS.find(([re]) => re.test(word))
  const rule = fem ?? masc
  if (rule) {
    const expected = fem ? 'f' : 'm'
    if (expected === g) return `${head}: las palabras en ${rule[1]} suelen ser ${genderName(g)}s.`
    return `${head}: es ${genderName(g)} aunque termina en ${rule[1]}. Es una excepción que conviene memorizar.`
  }
  if (word.endsWith('o') && g === 'm') return `${head}: casi todas las palabras en -o son masculinas.`
  if (word.endsWith('a') && g === 'f') return `${head}: casi todas las palabras en -a son femeninas.`
  if (word.endsWith('e')) return `${head}: las palabras en -e pueden ser de los dos géneros; apréndela con su artículo.`
  if (word !== w.word) return `${head}: en las palabras compuestas manda la primera («${word}»).`
  return `${head}: el género no se deduce de la terminación; apréndelo con su artículo.`
}

/** Por qué el artículo es ese (lo, l’, il…) y el género, en una línea. */
export function articleNote(w: ItalianWord, article: string): string {
  const reason = articleReason(nounOf(w), article)
  return `${reason} ${genderReason(w)}`
}

/** Por qué el plural es ese. */
export const pluralNote = (w: ItalianWord) => pluralReason(nounOf(w))

/** Explicación breve de la palabra para las respuestas correctas. */
export function wordNote(w: ItalianWord): string {
  const line = nounLine(w)
  if (w.pos === 'noun' && w.gender && withArticle(w).includes('’')) return `«${w.meaning}» se dice ${line}. Es ${genderName(w.gender)}: ${indefiniteFor(w)}${indefiniteFor(w).endsWith("'") ? '' : ' '}${w.word}.`.replace(/'/g, '’')
  return `«${w.meaning}» se dice ${line}.`
}

const byMeaning = new Map<string, ItalianWord>()
const byText = new Map<string, ItalianWord>()
for (const w of italianVocab) {
  if (!byMeaning.has(w.meaning)) byMeaning.set(w.meaning, w)
  if (!byText.has(withArticle(w))) byText.set(withArticle(w), w)
}

/** Para cada significado incorrecto, cómo se dice en italiano. */
export function whyWrongMeanings(options: readonly string[], answer: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const o of options) {
    const w = o !== answer ? byMeaning.get(o) : undefined
    if (w) out[o] = `«${o}» se dice ${withArticle(w)}.`
  }
  return out
}

/** Para cada palabra italiana incorrecta, qué significa. */
export function whyWrongWords(options: readonly string[], answer: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const o of options) {
    const w = o !== answer ? byText.get(o) : undefined
    if (w) out[o] = `${o} significa «${w.meaning}».`
  }
  return out
}

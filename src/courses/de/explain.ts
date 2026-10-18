import { type GermanWord, germanVocab, withArticle } from './vocab.ts'

// Explicaciones para los ejercicios de palabras del alemán: el género (con las terminaciones
// que lo delatan), el patrón del plural y qué significa cada opción incorrecta.

const genderName = { m: 'masculino', f: 'femenino', n: 'neutro', pl: 'plural' } as const

/** Terminaciones que casi siempre marcan el género (con su explicación). */
const ENDINGS: [RegExp, 'm' | 'f' | 'n', string][] = [
  [/(ung|heit|keit|schaft|ion|tät|ik|ei|ur|enz|anz|ie)$/, 'f', 'los sustantivos en -ung, -heit, -keit, -schaft, -ion, -tät, -ik, -ei, -ur, -enz y -ie son femeninos'],
  [/(chen|lein)$/, 'n', 'los diminutivos en -chen y -lein son siempre neutros'],
  [/(ment|um|ma|nis|tum)$/, 'n', 'las palabras en -ment, -um, -ma, -nis y -tum suelen ser neutras'],
  [/(ling|ismus|ist|ant|or|ig|eur|ent)$/, 'm', 'las palabras en -ling, -ismus, -ist, -ant, -or, -ig, -eur y -ent suelen ser masculinas'],
]

/** Por qué el sustantivo tiene ese artículo: la terminación que lo indica, o «hay que aprenderlo». */
export function genderReason(w: GermanWord): string {
  if (w.gender === 'pl') return `«${w.word}» solo se usa en plural: siempre die.`
  const last = w.word.split(/[\s-]/).at(-1)!.toLowerCase()
  const rule = ENDINGS.find(([re, g]) => g === w.gender && re.test(last))
  const article = withArticle(w).split(' ')[0]
  if (rule) return `${withArticle(w)}: ${rule[2]}.`
  // Compuestos: el último sustantivo decide el género.
  if (/[a-zäöüß]{3,}[A-ZÄÖÜa-zäöüß]{3,}/.test(w.word) && w.word.length > 9) {
    return `${withArticle(w)} es ${genderName[w.gender!]}: en las palabras compuestas manda la última parte.`
  }
  return `${withArticle(w)} es ${genderName[w.gender!]}. No hay una regla segura: apréndelo junto con el artículo («${article} ${w.word}»).`
}

const UMLAUT: Record<string, string> = { a: 'ä', o: 'ö', u: 'ü', au: 'äu' }
const withUmlaut = (s: string) => s.replace(/(au|a|o|u)(?=[^aouäöü]*$)/, (v) => UMLAUT[v] ?? v)

/** El patrón del plural: -e, ¨-e, -er, -(e)n, -s, sin cambio… */
export function pluralReason(w: GermanWord): string | undefined {
  const sg = w.word
  const pl = w.plural
  if (!pl) return undefined
  const umlauted = withUmlaut(sg)
  const pattern =
    pl === sg
      ? 'no cambia en plural (típico de las palabras en -er, -el y -en)'
      : pl === `${sg}e`
        ? 'agrega -e'
        : pl === `${umlauted}e`
          ? 'agrega -e y pone umlaut'
          : pl === `${sg}er`
            ? 'agrega -er'
            : pl === `${umlauted}er`
              ? 'agrega -er y pone umlaut (típico de los neutros cortos)'
              : pl === `${sg}nen`
                ? 'agrega -nen (femeninos en -in)'
                : pl === `${sg}n` || pl === `${sg}en`
                  ? `agrega -${pl.slice(sg.length)} (lo más común en femeninos)`
                  : pl === `${sg}s`
                    ? 'agrega -s (palabras extranjeras y terminadas en vocal)'
                    : pl === umlauted
                      ? 'solo pone umlaut'
                      : 'es irregular: hay que aprenderlo'
  return `${withArticle(w)} → die ${pl}: ${pattern}.`
}

const byMeaning = new Map<string, GermanWord>()
const byText = new Map<string, GermanWord>()
for (const w of germanVocab) {
  if (!byMeaning.has(w.meaning)) byMeaning.set(w.meaning, w)
  if (!byText.has(withArticle(w))) byText.set(withArticle(w), w)
}

/** Para «¿Qué significa…?»: qué palabra alemana corresponde a cada significado incorrecto. */
export function whyWrongMeanings(options: readonly string[], answer: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const o of options) {
    const w = o !== answer ? byMeaning.get(o) : undefined
    if (w) out[o] = `«${o}» se dice ${withArticle(w)}.`
  }
  return out
}

/** Para «¿Cómo se dice…?»: qué significa cada palabra alemana incorrecta. */
export function whyWrongWords(options: readonly string[], answer: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const o of options) {
    const w = o !== answer ? byText.get(o) : undefined
    if (w) out[o] = `${o} significa «${w.meaning}».`
  }
  return out
}

/** La ficha breve de la palabra: significado, y artículo y plural si es sustantivo. */
export function wordNote(w: GermanWord): string {
  if (w.pos !== 'noun') return `${w.word} = «${w.meaning}».`
  if (w.gender === 'pl') return `die ${w.word} (solo plural) = «${w.meaning}».`
  return `${withArticle(w)} = «${w.meaning}»${w.plural && w.plural !== w.word ? `; plural: die ${w.plural}` : ''}.`
}

export const articleWhyWrong = (w: GermanWord): Record<string, string> => {
  const names: Record<string, string> = { der: 'masculinos', die: 'femeninos (y todos los plurales)', das: 'neutros' }
  const right = withArticle(w).split(' ')[0]
  return Object.fromEntries(
    (['der', 'die', 'das'] as const).filter((a) => a !== right).map((a) => [a, `«${a}» va con los ${names[a]}; «${w.word}» es ${genderName[w.gender!]}.`]),
  )
}

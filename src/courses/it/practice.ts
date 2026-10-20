import type { SpeedQuestion } from '../euro.ts'
import type { GrammarExercise } from '../grammar.ts'
import type { PairItem } from '../../lib/pairs.ts'
import type { ProgressData } from '../../lib/progress/model.ts'
import { shuffle } from '../../lib/random.ts'
import { condizionale, congiuntivo, futuro, imperfetto, passatoProssimo, persons, present, type Forms, type Verb } from './engine/conjugation.ts'
import { numberReason, numberToWords } from './engine/numbers.ts'
import { startOf } from './engine/phonetics.ts'
import { doublesQuestion } from './doubles.ts'
import { articleNote, pluralNote } from './explain.ts'
import { falsoAmicoQuestion } from './falsiAmici.ts'
import type { CefrLevel } from './levels.ts'
import { italianUnlockedIds } from './progress.ts'
import { prepositionQuestion } from './prepositions.ts'
import { pronounQuestion } from './pronomi.ts'
import { subjunctiveQuestion } from './subjunctive.ts'
import { verbs } from './verbs.ts'
import { type ItalianWord, italianVocabLessonById, pluralWithArticle, withArticle } from './vocab.ts'
import { articleExercise, hasArticleQuestion, hasPluralQuestion, meaningExercise, pluralExercise, sayExercise, writeExercise } from './vocabExercises.ts'

// Juegos y práctica libre del italiano: las palabras salen de las lecciones de palabras ya hechas
// (o, si son pocas, de las que ya están abiertas), filtradas por nivel.

type Done = Pick<ProgressData, 'lessons' | 'grammar' | 'records'> & { unlockAll?: boolean }

/** Mínimo de palabras para que valga la pena jugar con las de lecciones terminadas. */
const MIN_DONE = 12

const openLessons = (p: Done, everythingOpen: boolean) =>
  [...italianUnlockedIds(p, everythingOpen, 'vocab')].map((id) => italianVocabLessonById.get(id)).filter((l) => !!l)

/** Palabras para jugar y practicar: de lecciones hechas, o de las abiertas si aún son pocas. */
export function italianWordPool(p: Done, everythingOpen: boolean, levels: readonly CefrLevel[] = []): ItalianWord[] {
  const open = openLessons(p, everythingOpen)
  const byLevel = (l: (typeof open)[number]) => levels.length === 0 || levels.includes(l.level)
  const done = open.filter((l) => p.lessons[l.id] && byLevel(l)).flatMap((l) => l.words)
  if (done.length >= MIN_DONE) return done
  return open.filter(byLevel).flatMap((l) => l.words)
}

/** Niveles que tienen palabras disponibles para jugar. */
export const italianPoolLevels = (p: Done, everythingOpen: boolean): CefrLevel[] => [...new Set(openLessons(p, everythingOpen).map((l) => l.level))]

/** Parejas palabra (con artículo) ↔ significado. */
export const meaningPairs = (words: readonly ItalianWord[]): PairItem[] => words.map((w) => ({ id: w.id, left: withArticle(w), right: w.meaning, speak: withArticle(w) }))

/** Parejas significado ↔ sonido de la palabra italiana (el lado derecho se escucha). */
export const audioPairs = (words: readonly ItalianWord[]): PairItem[] => words.map((w) => ({ id: w.id, left: w.meaning, right: withArticle(w), speak: withArticle(w) }))

/** Parejas singular ↔ plural, con su artículo: lo zaino ↔ gli zaini. */
export const pluralPairs = (words: readonly ItalianWord[]): PairItem[] =>
  words.filter(hasPluralQuestion).map((w) => ({ id: w.id, left: withArticle(w), right: pluralWithArticle(w)!, speak: `${withArticle(w)}, ${pluralWithArticle(w)}` }))

const DEFINITE = ['il', 'lo', "l'", 'la']
const INDEFINITE = ['un', 'uno', 'una', "un'"]
const shown = (a: string) => a.replace(/'/g, '’')

/** il / lo / l’ / la (o un / uno / una / un’ si empieza por vocal) de un sustantivo al azar del pool. */
export function articleQuestion(words: readonly ItalianWord[], random = Math.random): SpeedQuestion | null {
  const list = words.filter(hasArticleQuestion)
  if (!list.length) return null
  const w = list[Math.floor(random() * list.length)]
  const e = articleExercise(w)
  if (e.type !== 'choice') return null
  const vowel = startOf(w.word) === 'vowel'
  return {
    prompt: w.word.replace(/'/g, '’'),
    hint: w.meaning,
    options: (vowel ? INDEFINITE : DEFINITE).map(shown),
    answer: e.answer,
    speak: withArticle(w),
    keepOrder: true,
    explanation: articleNote(w, e.answer.replace('’', "'")),
    whyWrong: e.whyWrong,
  }
}

/** El plural con su artículo: lo zaino → gli zaini. */
export function pluralQuestion(words: readonly ItalianWord[], random = Math.random): SpeedQuestion | null {
  const list = words.filter(hasPluralQuestion)
  if (!list.length) return null
  const w = list[Math.floor(random() * list.length)]
  const e = pluralExercise(w, random)
  if (e.type !== 'choice') return null
  return { prompt: withArticle(w), hint: `${w.meaning} · en plural`, options: e.options, answer: e.answer, speak: e.answer, explanation: `${e.answer}. ${pluralNote(w)}`, whyWrong: e.whyWrong }
}

type Tense = { name: string; forms: (v: Verb) => Forms }
const tenses: Tense[] = [
  { name: 'presente', forms: present },
  { name: 'passato prossimo', forms: passatoProssimo },
  { name: 'imperfetto', forms: imperfetto },
  { name: 'futuro simple', forms: futuro },
  { name: 'condicional', forms: condizionale },
  { name: 'subjuntivo presente', forms: congiuntivo },
]

/** Tiempos que entran según el nivel de las palabras: A1 solo el presente, A2 cuatro, desde B1 seis. */
export function tenseCountFor(words: readonly ItalianWord[]): number {
  if (words.some((w) => w.level !== 'A1' && w.level !== 'A2')) return tenses.length
  return words.some((w) => w.level === 'A2') ? 4 : 1
}

/** Verbos frecuentes para el A1: los irregulares y algunos regulares de cada conjugación. */
const A1_VERBS = new Set(['essere', 'avere', 'andare', 'fare', 'stare', 'venire', 'uscire', 'volere', 'potere', 'dovere', 'sapere', 'bere', 'parlare', 'abitare', 'lavorare', 'mangiare', 'cercare', 'pagare', 'leggere', 'prendere', 'scrivere', 'dormire', 'partire', 'sentire', 'finire', 'capire', 'preferire', 'alzarsi', 'chiamarsi', 'vestirsi', 'conoscere', 'giocare'])

/** Conjugación: «noi · parlare (presente)» → parliamo, entre formas de otras personas y tiempos. */
export function conjugationQuestion(random = Math.random, tenseCount = 1): SpeedQuestion {
  const pool = tenseCount === 1 ? verbs.filter((v) => A1_VERBS.has(v.inf)) : verbs
  const v = pool[Math.floor(random() * pool.length)]
  const usable = tenses.slice(0, Math.min(tenseCount, tenses.length))
  const tense = usable[Math.floor(random() * usable.length)]
  const i = Math.floor(random() * persons.length)
  const forms = tense.forms(v)
  const answer = forms[i]
  const candidates = [...usable.map((t) => t.forms(v)[i]), ...forms]
  const options = [answer, ...shuffle([...new Set(candidates)].filter((f) => f !== answer), random).slice(0, 3)]
  const labels = new Map<string, string>()
  for (const t of usable) t.forms(v).forEach((f, k) => labels.has(f) || labels.set(f, `${persons[k]}, ${t.name}`))
  const whyWrong = Object.fromEntries(options.filter((o) => o !== answer && labels.has(o)).map((o) => [o, `«${o}» es la forma de ${labels.get(o)}.`]))
  return {
    prompt: `${persons[i]} · ${v.inf}`,
    hint: `${tense.name} · ${v.meaning}`,
    options,
    answer,
    explanation: `${persons[i].split('/')[0]} ${answer}: ${tense.name} de «${v.inf}» (${v.meaning}).`,
    whyWrong,
  }
}

/** Un número entre 0 y 100, con más peso en los que cambian (21, 28, 33…). */
function pickNumber(random: () => number): number {
  const r = random()
  if (r < 0.4) return 20 + 10 * Math.floor(random() * 8) + [1, 3, 8][Math.floor(random() * 3)]
  if (r < 0.55) return 11 + Math.floor(random() * 9)
  if (r < 0.9) return 20 + Math.floor(random() * 81)
  return Math.floor(random() * 11)
}

/** Las formas equivocadas típicas: ventiuno, ventitre, venti otto. */
function numberTraps(n: number): string[] {
  const t = Math.floor(n / 10)
  const u = n % 10
  if (n < 21 || u === 0) return []
  const tens = numberToWords(t * 10)
  const unit = numberToWords(u)
  // ventiuno, ventiotto (la vocal no se cae), ventitre (sin tilde) y «venti e due» (con «e»).
  return [...([1, 3, 8].includes(u) ? [`${tens}${unit}`] : []), `${tens} e ${unit}`].filter((x) => x !== numberToWords(n))
}

/** Números: 28 → ventotto, entre los vecinos y las trampas de escritura. */
export function numberQuestion(random = Math.random): SpeedQuestion {
  const n = pickNumber(random)
  const answer = numberToWords(n)
  const traps = shuffle(numberTraps(n), random).slice(0, 1)
  const near = shuffle([n + 1, n - 1, n + 10, n - 10].filter((x) => x >= 0 && x <= 100), random).slice(0, 3 - traps.length)
  const options = [answer, ...traps, ...near.map((x) => numberToWords(x))]
  const whyWrong: Record<string, string> = Object.fromEntries(near.map((x) => [numberToWords(x), `«${numberToWords(x)}» es ${x}.`]))
  for (const t of traps) whyWrong[t] = `Así no se escribe ${n}: ${numberReason(n)}`
  return { prompt: String(n), options, answer, speak: answer, explanation: `${n} = ${answer}. ${numberReason(n)}`, whyWrong }
}

/** Hay palabras del B1 o más: se abren los juegos de pronombres combinados y subjuntivo. */
export const fromB1 = (words: readonly ItalianWord[]) => words.some((w) => w.level !== 'A1' && w.level !== 'A2')

/** La pregunta rápida como ejercicio de opción, para las sesiones de práctica. */
export const asExercise = (q: SpeedQuestion): GrammarExercise => ({
  type: 'choice',
  prompt: q.prompt,
  hint: q.hint,
  options: q.options,
  answer: q.answer,
  explanation: q.explanation,
  whyWrong: q.whyWrong,
})

export type PracticeMode = 'palabras' | 'escribir' | 'articulos' | 'plurales' | 'dobles' | 'conjugacion' | 'numeros' | 'preposiciones' | 'falsos-amigos' | 'pronombres' | 'subjuntivo'

/** Una sesión de práctica libre de `count` ejercicios con las palabras del pool. */
export function practiceSession(mode: PracticeMode, words: readonly ItalianWord[], count = 12, random = Math.random): GrammarExercise[] {
  const pick = shuffle(words, random)
  const repeat = (make: () => GrammarExercise | null) => Array.from({ length: count }, make).filter((e): e is GrammarExercise => !!e)
  switch (mode) {
    case 'palabras':
      return pick.slice(0, count).map((w, i) => (i % 2 ? sayExercise(w, random) : meaningExercise(w, random)))
    case 'escribir':
      return pick.slice(0, count).map((w) => writeExercise(w))
    case 'articulos':
      return pick.filter(hasArticleQuestion).slice(0, count).map((w) => articleExercise(w))
    case 'plurales':
      return pick.filter(hasPluralQuestion).slice(0, count).map((w) => pluralExercise(w, random))
    case 'dobles':
      return repeat(() => {
        const q = doublesQuestion(words, random)
        return q ? asExercise(q) : null
      })
    case 'conjugacion':
      return repeat(() => asExercise(conjugationQuestion(random, tenseCountFor(words))))
    case 'numeros':
      return repeat(() => asExercise(numberQuestion(random)))
    case 'preposiciones':
      return repeat(() => {
        const q = prepositionQuestion(words, random)
        return q ? asExercise(q) : null
      })
    case 'falsos-amigos':
      return words.some((w) => w.level !== 'A1') ? repeat(() => asExercise(falsoAmicoQuestion(random))) : []
    case 'pronombres':
      return fromB1(words) ? repeat(() => asExercise(pronounQuestion(random))) : []
    case 'subjuntivo':
      return fromB1(words) ? repeat(() => asExercise(subjunctiveQuestion(random))) : []
  }
}

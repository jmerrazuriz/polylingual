import type { SpeedQuestion } from '../euro.ts'
import type { GrammarExercise } from '../grammar.ts'
import type { PairItem } from '../../lib/pairs.ts'
import type { ProgressData } from '../../lib/progress/model.ts'
import { shuffle } from '../../lib/random.ts'
import { conditionnel, futur, futurProche, imparfait, passeCompose, persons, plusQueParfait, present, subjonctif, type Forms, type Verb } from './engine/conjugation.ts'
import { numberReason, numberToWords } from './engine/numbers.ts'
import { genderReason } from './explain.ts'
import { agreementQuestion } from './accords.ts'
import { fauxAmiQuestion, homophoneQuestion } from './homophones.ts'
import type { CefrLevel } from './levels.ts'
import { frenchUnlockedIds } from './progress.ts'
import { verbs } from './verbs.ts'
import { type FrenchWord, frenchVocabLessonById, indefiniteFor, withArticle } from './vocab.ts'
import { articleExercise, feminineExercise, hasArticleQuestion, hasFeminine, meaningExercise, sayExercise, writeExercise } from './vocabExercises.ts'

// Juegos y práctica libre del francés: las palabras salen de las lecciones de palabras ya hechas
// (o, si son pocas, de las que ya están abiertas), filtradas por nivel.

type Done = Pick<ProgressData, 'lessons' | 'grammar' | 'records'> & { unlockAll?: boolean }

/** Mínimo de palabras para que valga la pena jugar con las de lecciones terminadas. */
const MIN_DONE = 12

const openLessons = (p: Done, everythingOpen: boolean) =>
  [...frenchUnlockedIds(p, everythingOpen, 'vocab')].map((id) => frenchVocabLessonById.get(id)).filter((l) => !!l)

/** Palabras para jugar y practicar: de lecciones hechas, o de las abiertas si aún son pocas. */
export function frenchWordPool(p: Done, everythingOpen: boolean, levels: readonly CefrLevel[] = []): FrenchWord[] {
  const open = openLessons(p, everythingOpen)
  const byLevel = (l: (typeof open)[number]) => levels.length === 0 || levels.includes(l.level)
  const done = open.filter((l) => p.lessons[l.id] && byLevel(l)).flatMap((l) => l.words)
  if (done.length >= MIN_DONE) return done
  return open.filter(byLevel).flatMap((l) => l.words)
}

/** Niveles que tienen palabras disponibles para jugar. */
export const frenchPoolLevels = (p: Done, everythingOpen: boolean): CefrLevel[] => [...new Set(openLessons(p, everythingOpen).map((l) => l.level))]

/** Parejas palabra (con artículo) ↔ significado. */
export const meaningPairs = (words: readonly FrenchWord[]): PairItem[] =>
  words.map((w) => ({ id: w.id, left: withArticle(w), right: w.meaning, speak: withArticle(w) }))

/** Parejas significado ↔ sonido de la palabra francesa (el lado derecho se escucha). */
export const audioPairs = (words: readonly FrenchWord[]): PairItem[] =>
  words.map((w) => ({ id: w.id, left: w.meaning, right: withArticle(w), speak: withArticle(w) }))

/** Parejas masculino ↔ femenino de los adjetivos y las profesiones («petit» ↔ «petite»). */
export const femininePairs = (words: readonly FrenchWord[]): PairItem[] =>
  words
    .filter((w) => w.feminine && w.feminine !== w.word)
    .map((w) => ({ id: w.id, left: w.word, right: w.feminine!, speak: `${w.word}, ${w.feminine}` }))

/** un / une de un sustantivo al azar del pool. */
export function articleQuestion(words: readonly FrenchWord[], random = Math.random): SpeedQuestion | null {
  const list = words.filter(hasArticleQuestion)
  if (!list.length) return null
  const w = list[Math.floor(random() * list.length)]
  const answer = indefiniteFor(w)
  return { prompt: w.word.replace(/'/g, '’'), hint: w.meaning, options: ['un', 'une'], answer, speak: `${answer} ${w.word}`, keepOrder: true, explanation: genderReason(w) }
}

type Tense = { name: string; forms: (v: Verb) => Forms }
const tenses: Tense[] = [
  { name: 'presente', forms: present },
  { name: 'futur proche', forms: futurProche },
  { name: 'passé composé', forms: passeCompose },
  { name: 'imparfait', forms: imparfait },
  { name: 'futuro simple', forms: futur },
  { name: 'condicional', forms: conditionnel },
  { name: 'subjuntivo', forms: subjonctif },
  { name: 'plus-que-parfait', forms: plusQueParfait },
]

/** Tiempos que entran según el nivel de las palabras: A1 presente y futur proche; A2 cinco; desde B1, los ocho. */
export function tenseCountFor(words: readonly FrenchWord[]): number {
  if (words.some((w) => w.level !== 'A1' && w.level !== 'A2')) return tenses.length
  return words.some((w) => w.level === 'A2') ? 5 : 2
}

/** Conjugación: «nous · parler (presente)» → parlons, entre formas de otras personas y tiempos. */
export function conjugationQuestion(random = Math.random, tenseCount = 2): SpeedQuestion {
  const v = verbs[Math.floor(random() * verbs.length)]
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

/** Un número entre 0 y 100, con más peso en los difíciles (17–19 y 70–99). */
function pickNumber(random: () => number): number {
  const r = random()
  if (r < 0.45) return 70 + Math.floor(random() * 30)
  if (r < 0.6) return 17 + Math.floor(random() * 3)
  if (r < 0.9) return 20 + Math.floor(random() * 50)
  return Math.floor(random() * 17)
}

/** Números: 78 → soixante-dix-huit, entre los números vecinos. */
export function numberQuestion(random = Math.random): SpeedQuestion {
  const n = pickNumber(random)
  const answer = numberToWords(n)
  const near = [n + 1, n - 1, n + 10, n - 10, n + 2, n - 2].filter((x) => x >= 0 && x <= 100)
  const picked = shuffle(near, random).slice(0, 3)
  const options = [answer, ...picked.map((x) => numberToWords(x))]
  const whyWrong = Object.fromEntries(picked.map((x) => [numberToWords(x), `«${numberToWords(x)}» es ${x}.`]))
  return { prompt: String(n), options, answer, speak: answer, explanation: `${n} = ${answer}. ${numberReason(n)}`, whyWrong }
}

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

export type PracticeMode = 'palabras' | 'escribir' | 'genero' | 'femenino' | 'conjugacion' | 'numeros' | 'homofonos' | 'falsos-amigos' | 'concordancias'

/** Una sesión de práctica libre de `count` ejercicios con las palabras del pool. */
export function practiceSession(mode: PracticeMode, words: readonly FrenchWord[], count = 12, random = Math.random): GrammarExercise[] {
  const pick = shuffle(words, random)
  const repeat = (make: () => GrammarExercise) => Array.from({ length: count }, make)
  switch (mode) {
    case 'palabras':
      return pick.slice(0, count).map((w, i) => (i % 2 ? sayExercise(w, random) : meaningExercise(w, random)))
    case 'escribir':
      return pick.slice(0, count).map((w) => writeExercise(w))
    case 'genero':
      return pick.filter(hasArticleQuestion).slice(0, count).map((w) => articleExercise(w))
    case 'femenino':
      return pick.filter(hasFeminine).slice(0, count).map((w) => feminineExercise(w, random))
    case 'conjugacion':
      return repeat(() => asExercise(conjugationQuestion(random, tenseCountFor(words))))
    case 'numeros':
      return repeat(() => asExercise(numberQuestion(random)))
    case 'homofonos':
      return words.some((w) => w.level !== 'A1') ? repeat(() => asExercise(homophoneQuestion(random))) : []
    case 'concordancias': {
      const out: GrammarExercise[] = []
      for (let tries = 0; out.length < count && tries < count * 5; tries++) {
        const q = agreementQuestion(words, random)
        if (q) out.push(asExercise(q))
      }
      return out
    }
    case 'falsos-amigos':
      return words.some((w) => w.level !== 'A1') ? repeat(() => asExercise(fauxAmiQuestion(random))) : []
  }
}

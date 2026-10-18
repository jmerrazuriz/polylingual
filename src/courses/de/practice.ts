import type { SpeedQuestion } from '../euro.ts'
import type { GrammarExercise } from '../grammar.ts'
import type { PairItem } from '../../lib/pairs.ts'
import type { ProgressData } from '../../lib/progress/model.ts'
import { shuffle } from '../../lib/random.ts'
import { adjectiveEndings, adjectiveKind, type Case, caseNames, type Determiner, type Noun, nounPhrase } from './engine/declension.ts'
import { genderReason } from './explain.ts'
import { type Forms, perfekt, persons, praeteritum, present, type Verb } from './engine/conjugation.ts'
import type { CefrLevel } from './levels.ts'
import { germanUnlockedIds } from './progress.ts'
import { verbs } from './verbs.ts'
import { type GermanWord, germanVocabLessonById, withArticle } from './vocab.ts'
import { articleExercise, meaningExercise, pluralExercise, sayExercise, writeExercise } from './vocabExercises.ts'

// Juegos y práctica libre del alemán: las palabras salen de las lecciones de palabras ya hechas
// (o, si son pocas, de las que ya están abiertas), filtradas por nivel.

type Done = Pick<ProgressData, 'lessons' | 'grammar' | 'records'> & { unlockAll?: boolean }

/** Mínimo de palabras para que valga la pena jugar con las de lecciones terminadas. */
const MIN_DONE = 12

/** Palabras para jugar y practicar: de lecciones hechas, o de las abiertas si aún son pocas. */
export function germanWordPool(p: Done, everythingOpen: boolean, levels: readonly CefrLevel[] = []): GermanWord[] {
  const open = [...germanUnlockedIds(p, everythingOpen, 'vocab')].map((id) => germanVocabLessonById.get(id)).filter((l) => !!l)
  const byLevel = (l: (typeof open)[number]) => levels.length === 0 || levels.includes(l.level)
  const done = open.filter((l) => p.lessons[l.id] && byLevel(l)).flatMap((l) => l.words)
  if (done.length >= MIN_DONE) return done
  return open.filter(byLevel).flatMap((l) => l.words)
}

/** Niveles que tienen palabras disponibles para jugar. */
export function germanPoolLevels(p: Done, everythingOpen: boolean): CefrLevel[] {
  const open = [...germanUnlockedIds(p, everythingOpen, 'vocab')].map((id) => germanVocabLessonById.get(id)).filter((l) => !!l)
  return [...new Set(open.map((l) => l.level))]
}

const nouns = (words: readonly GermanWord[]) => words.filter((w) => w.pos === 'noun' && w.gender !== 'pl')

/** Parejas palabra (con artículo) ↔ significado. */
export const meaningPairs = (words: readonly GermanWord[]): PairItem[] =>
  words.map((w) => ({ id: w.id, left: withArticle(w), right: w.meaning, speak: withArticle(w) }))

/** Parejas significado ↔ sonido de la palabra alemana (el lado derecho se escucha). */
export const audioPairs = (words: readonly GermanWord[]): PairItem[] =>
  words.map((w) => ({ id: w.id, left: w.meaning, right: withArticle(w), speak: withArticle(w) }))

/** Parejas singular ↔ plural («der Tisch» ↔ «die Tische»). */
export const pluralPairs = (words: readonly GermanWord[]): PairItem[] =>
  nouns(words)
    .filter((w) => w.plural && w.plural !== w.word)
    .map((w) => ({ id: w.id, left: withArticle(w), right: `die ${w.plural}`, speak: withArticle(w) }))

export type { SpeedQuestion }

/** der / die / das de un sustantivo al azar del pool. */
export function articleQuestion(words: readonly GermanWord[], random = Math.random): SpeedQuestion | null {
  const list = nouns(words)
  if (!list.length) return null
  const w = list[Math.floor(random() * list.length)]
  const answer = withArticle(w).split(' ')[0]
  return { prompt: w.word, hint: w.meaning, options: ['der', 'die', 'das'], answer, speak: withArticle(w), keepOrder: true, explanation: genderReason(w) }
}

type Tense = { name: string; forms: (v: Verb) => Forms }
const tenses: Tense[] = [
  { name: 'presente', forms: present },
  { name: 'Präteritum', forms: praeteritum },
  { name: 'Perfekt', forms: perfekt },
]

/** Conjugación: «ich · gehen (presente)» → gehe, entre formas de otras personas y tiempos. */
export function conjugationQuestion(random = Math.random, tenseCount = 3): SpeedQuestion {
  const v = verbs[Math.floor(random() * verbs.length)]
  const tense = tenses[Math.floor(random() * Math.min(tenseCount, tenses.length))]
  const i = Math.floor(random() * persons.length)
  const forms = tense.forms(v)
  const answer = forms[i]
  // Distractores: la misma persona en otros tiempos y el mismo tiempo en otras personas.
  const candidates = [...tenses.map((t) => t.forms(v)[i]), ...forms]
  const options = [answer, ...shuffle([...new Set(candidates)].filter((f) => f !== answer), random).slice(0, 3)]
  // De qué persona y tiempo es cada forma incorrecta.
  const labels = new Map<string, string>()
  for (const t of tenses) t.forms(v).forEach((f, k) => labels.has(f) || labels.set(f, `${persons[k]}, ${t.name}`))
  const whyWrong = Object.fromEntries(options.filter((o) => o !== answer && labels.has(o)).map((o) => [o, `«${o}» es la forma de ${labels.get(o)}.`]))
  return {
    prompt: `${persons[i]} · ${v.inf}`,
    hint: `${tense.name} · ${v.meaning}`,
    options,
    answer,
    explanation: `${persons[i]} ${answer}: ${tense.name} de «${v.inf}» (${v.meaning}).`,
    whyWrong,
  }
}

const determiners: { d: Determiner; label: string }[] = [
  { d: { kind: 'def' }, label: 'der/die/das' },
  { d: { kind: 'indef' }, label: 'ein/eine' },
  { d: { kind: 'ein-word', stem: 'mein' }, label: 'mein' },
  { d: { kind: 'none' }, label: '' },
]
const practiceCases: Case[] = ['nom', 'akk', 'dat']
/** Adjetivos frecuentes y regulares para declinar. */
const ADJECTIVES = ['neu', 'alt', 'klein', 'groß', 'schön', 'gut', 'rot', 'teuer', 'billig', 'jung']

/** Declinación: «neu + der Tisch, dativo» → dem neuen Tisch. */
export function declensionQuestion(words: readonly GermanWord[], random = Math.random): SpeedQuestion | null {
  const list = nouns(words).filter((w) => w.gender === 'm' || w.gender === 'f' || w.gender === 'n')
  if (!list.length) return null
  const w = list[Math.floor(random() * list.length)]
  const noun: Noun = { word: w.word, gender: w.gender as Noun['gender'], plural: w.plural ?? null, weak: w.weak }
  const det = determiners[Math.floor(random() * determiners.length)]
  // Sin artículo en singular solo suena natural con no contables: se usa en plural. «ein» no tiene plural.
  const num = det.d.kind === 'none' ? 'pl' : det.d.kind === 'indef' ? 'sg' : random() < 0.25 ? 'pl' : 'sg'
  if (num === 'pl' && !noun.plural) return null
  const c = practiceCases[Math.floor(random() * practiceCases.length)]
  const adj = ADJECTIVES[Math.floor(random() * ADJECTIVES.length)]
  const answer = nounPhrase(noun, det.d, c, num, adj)
  const others = practiceCases.filter((x) => x !== c).map((x) => nounPhrase(noun, det.d, x, num, adj))
  const otherDet = determiners.filter((x) => x !== det && !(num === 'pl' && x.d.kind === 'indef')).map((x) => nounPhrase(noun, x.d, c, num, adj))
  const options = [answer, ...shuffle([...new Set([...others, ...otherDet])].filter((o) => o !== answer), random).slice(0, 3)]
  const slot = num === 'pl' ? 'pl' : noun.gender
  const kind = adjectiveKind(det.d, slot)
  const kindName = { weak: 'débil', mixed: 'mixta', strong: 'fuerte' }[kind]
  const whyWrong: Record<string, string> = {}
  practiceCases.forEach((x) => {
    const phrase = nounPhrase(noun, det.d, x, num, adj)
    if (phrase !== answer) whyWrong[phrase] ??= `«${phrase}» es el ${caseNames[x].toLowerCase()}, no el ${caseNames[c].toLowerCase()}.`
  })
  determiners.forEach((x) => {
    if (x === det || (num === 'pl' && x.d.kind === 'indef')) return
    const phrase = nounPhrase(noun, x.d, c, num, adj)
    if (phrase !== answer) whyWrong[phrase] ??= `«${phrase}» es ${x.d.kind === 'none' ? 'sin artículo' : `con ${x.label}`}.`
  })
  return {
    explanation: `${caseNames[c]} ${num === 'pl' ? 'plural' : `(${withArticle(w).split(' ')[0]})`} ${det.d.kind === 'none' ? 'sin artículo' : `con ${det.label}`}: el adjetivo lleva la terminación ${kindName} -${adjectiveEndings[kind][c][slot]}.`,
    whyWrong,
    prompt: `${adj} + ${withArticle(w)}${num === 'pl' ? ' (plural)' : ''}`,
    hint: `${caseNames[c]} · ${det.d.kind === 'none' ? 'sin artículo' : `con ${det.label}`}`,
    options,
    answer,
  }
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

export type PracticeMode = 'palabras' | 'articulos' | 'plurales' | 'escribir' | 'conjugacion' | 'declinacion'

/** Una sesión de práctica libre de `count` ejercicios con las palabras del pool. */
export function practiceSession(mode: PracticeMode, words: readonly GermanWord[], count = 12, random = Math.random): GrammarExercise[] {
  const pick = shuffle(words, random)
  const repeat = (make: () => GrammarExercise | null) => {
    const out: GrammarExercise[] = []
    for (let tries = 0; out.length < count && tries < count * 5; tries++) {
      const e = make()
      if (e) out.push(e)
    }
    return out
  }
  switch (mode) {
    case 'palabras':
      return pick.slice(0, count).map((w, i) => (i % 2 ? sayExercise(w, random) : meaningExercise(w, random)))
    case 'articulos':
      return nouns(pick).slice(0, count).map((w) => articleExercise(w))
    case 'plurales':
      return nouns(pick)
        .filter((w) => w.plural && w.plural !== w.word)
        .slice(0, count)
        .map((w) => pluralExercise(w, random))
    case 'escribir':
      return pick.slice(0, count).map((w) => writeExercise(w))
    case 'conjugacion':
      return repeat(() => asExercise(conjugationQuestion(random)))
    case 'declinacion':
      return repeat(() => {
        const q = declensionQuestion(pick, random)
        return q ? asExercise(q) : null
      })
  }
}

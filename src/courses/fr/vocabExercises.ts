import { looksNumeric, similarOptions } from '../../lib/distractors.ts'
import type { GrammarExercise } from '../grammar.ts'
import { articleWhyWrong, feminineReason, genderReason, whyWrongMeanings, whyWrongWords, wordNote } from './explain.ts'
import { type FrenchWord, frenchVocab, frenchWordCard, frenchWordFromCard, indefiniteFor, withArticle } from './vocab.ts'

// Ejercicios de palabras francesas para las lecciones y el repaso: significado, cómo se dice,
// género (un/une), femenino de los adjetivos, plurales irregulares y escribir la palabra.

const pickDistinct = <T,>(pool: T[], n: number, random: () => number) => {
  const copy = [...pool]
  const out: T[] = []
  while (copy.length && out.length < n) out.push(copy.splice(Math.floor(random() * copy.length), 1)[0])
  return out
}

const groupBy = (key: (w: FrenchWord) => string) => {
  const map = new Map<string, FrenchWord[]>()
  for (const x of frenchVocab) {
    const list = map.get(key(x))
    if (list) list.push(x)
    else map.set(key(x), [x])
  }
  return map
}
const byThemePos = groupBy((x) => `${x.theme}|${x.pos}`)
const byLevelPos = groupBy((x) => `${x.level}|${x.pos}`)
const byPos = groupBy((x) => x.pos)

/** Tres distractores parecidos: del mismo tema y clase de palabra, luego del nivel y de la clase. */
function options(w: FrenchWord, pick: (x: FrenchWord) => string, random: () => number): string[] {
  const answer = pick(w)
  const theme = byThemePos.get(`${w.theme}|${w.pos}`) ?? []
  return similarOptions(answer, {
    tiers: [
      theme.filter((x) => looksNumeric(pick(x)) === looksNumeric(answer)),
      theme,
      byLevelPos.get(`${w.level}|${w.pos}`) ?? [],
      byPos.get(w.pos) ?? [],
    ],
    pick,
    closeness: (x) => Math.abs(pick(x).length - answer.length) / 4,
    random,
  })
}

/** ¿Qué significa «l’école»? */
export function meaningExercise(w: FrenchWord, random = Math.random): GrammarExercise {
  const opts = options(w, (x) => x.meaning, random)
  return { type: 'meaning', text: withArticle(w), options: opts, answer: w.meaning, explanation: wordNote(w), whyWrong: whyWrongMeanings(opts, w.meaning) }
}

/** ¿Cómo se dice «colegio»? → l’école */
export function sayExercise(w: FrenchWord, random = Math.random): GrammarExercise {
  const opts = options(w, withArticle, random)
  return { type: 'choice', prompt: `¿Cómo se dice «${w.meaning}»?`, options: opts, answer: withArticle(w), explanation: wordNote(w), whyWrong: whyWrongWords(opts, withArticle(w)) }
}

/** ＿ école → un / une (el indefinido deja ver el género, aunque el definido se elida). */
export const articleExercise = (w: FrenchWord): GrammarExercise => ({
  type: 'choice',
  prompt: `＿ ${w.word.replace(/'/g, '’')}`,
  hint: w.meaning,
  options: ['un', 'une'],
  answer: indefiniteFor(w),
  explanation: genderReason(w),
  whyWrong: articleWhyWrong(w),
})

/** Femeninos falsos pero creíbles. */
function feminineCandidates(m: string): string[] {
  return [`${m}e`, `${m}ne`, `${m}le`, `${m}te`, m.replace(/x$/, 'se'), m.replace(/f$/, 've'), m.replace(/er$/, 'ère'), m.replace(/e$/, 'esse'), m]
}

/** petit → ＿ (femenino) */
export function feminineExercise(w: FrenchWord, random = Math.random): GrammarExercise {
  const answer = w.feminine!
  const wrong = [...new Set(feminineCandidates(w.word).filter((x) => x !== answer))]
  return {
    type: 'choice',
    prompt: `${w.word} → ＿ (femenino)`,
    hint: w.meaning,
    options: [answer, ...pickDistinct(wrong, 3, random)],
    answer,
    explanation: feminineReason(w),
  }
}

/** le journal → les ＿ (journaux): solo plurales irregulares. */
export function pluralExercise(w: FrenchWord, random = Math.random): GrammarExercise {
  const answer = w.plural!
  const wrong = [...new Set([`${w.word}s`, `${w.word}x`, w.word.replace(/al$/, 'aux'), w.word.replace(/eu$/, 'eus'), w.word])].filter((x) => x !== answer)
  return {
    type: 'choice',
    prompt: `${withArticle(w)} → les ＿`,
    hint: `${w.meaning} (plural)`,
    options: [answer, ...pickDistinct(wrong, 3, random)],
    answer,
    explanation: `${withArticle(w)} → les ${answer}: plural irregular.`,
  }
}

/** Escribir en francés: «colegio» → l’école. Sin acentos cuenta como «casi». */
export function writeExercise(w: FrenchWord): GrammarExercise {
  const open = w.word.replace(/\s*[?…]$/, '').trim()
  return {
    type: 'type',
    prompt: `Escribe en francés: «${w.meaning}»`,
    hint: w.pos === 'noun' ? 'Con el artículo (le, la, l’, les).' : w.pos === 'adj' && w.feminine ? 'En masculino.' : undefined,
    answers: w.pos === 'noun' ? [withArticle(w)] : [...new Set([w.word, open])],
    french: true,
    explanation: wordNote(w),
  }
}

const hasArticleQuestion = (w: FrenchWord) => w.pos === 'noun' && w.gender !== 'pl' && !w.feminine
const hasFeminine = (w: FrenchWord) => w.pos === 'adj' && !!w.feminine && w.feminine !== w.word
const hasIrregularPlural = (w: FrenchWord) => w.pos === 'noun' && w.gender !== 'pl' && !!w.plural && w.plural !== w.word && !w.word.includes(' ') && !w.word.includes('-')

/** Ejercicios de una lección: uno por palabra, géneros, femeninos, plurales irregulares y dos para escribir. */
export function frenchLessonExercises(words: FrenchWord[], random = Math.random): GrammarExercise[] {
  const out: GrammarExercise[] = words.map((w, i) => (i % 2 === 0 ? meaningExercise(w, random) : sayExercise(w, random)))
  for (const w of words.filter(hasArticleQuestion)) out.push(articleExercise(w))
  for (const w of pickDistinct(words.filter(hasFeminine), 2, random)) out.push(feminineExercise(w, random))
  for (const w of pickDistinct(words.filter(hasIrregularPlural), 1, random)) out.push(pluralExercise(w, random))
  for (const w of pickDistinct(words, 2, random)) out.push(writeExercise(w))
  return out
}

/** Repaso de una tarjeta: reconocer (read) o escribir (write). */
export function frenchWordReviewExercise(char: string, skill: 'read' | 'write', random = Math.random): { char: string; skill: 'read' | 'write'; exercise: GrammarExercise } {
  const w = frenchWordFromCard(char)!
  if (skill === 'write') return { char, skill, exercise: writeExercise(w) }
  const kinds = [meaningExercise, sayExercise, ...(hasArticleQuestion(w) ? [articleExercise] : [])]
  return { char, skill, exercise: kinds[Math.floor(random() * kinds.length)](w, random) }
}

export { frenchWordCard, hasArticleQuestion, hasFeminine }

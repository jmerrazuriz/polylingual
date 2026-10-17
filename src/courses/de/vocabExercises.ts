import type { GrammarExercise } from '../grammar.ts'
import { articleFor, type GermanWord, germanVocab, germanWordCard, germanWordFromCard, withArticle } from './vocab.ts'

// Ejercicios de palabras alemanas para las lecciones y el repaso: significado, cómo se dice,
// artículo, plural y escribir la palabra (con su artículo si es sustantivo).

const pickDistinct = <T,>(pool: T[], n: number, random: () => number) => {
  const copy = [...pool]
  const out: T[] = []
  while (copy.length && out.length < n) out.push(copy.splice(Math.floor(random() * copy.length), 1)[0])
  return out
}

/** Tres distractores de la misma clase de palabra, sin repetir el texto de la respuesta. */
function options(w: GermanWord, pick: (x: GermanWord) => string, random: () => number): string[] {
  const answer = pick(w)
  const same = germanVocab.filter((x) => x.pos === w.pos && x.id !== w.id && pick(x) !== answer)
  const unique = [...new Map(same.map((x) => [pick(x), x])).values()]
  return [answer, ...pickDistinct(unique, 3, random).map(pick)]
}

/** ¿Qué significa «der Tisch»? */
export const meaningExercise = (w: GermanWord, random = Math.random): GrammarExercise => ({
  type: 'meaning',
  text: withArticle(w),
  options: options(w, (x) => x.meaning, random),
  answer: w.meaning,
})

/** ¿Cómo se dice «mesa»? → der Tisch */
export const sayExercise = (w: GermanWord, random = Math.random): GrammarExercise => ({
  type: 'choice',
  prompt: `¿Cómo se dice «${w.meaning}»?`,
  options: options(w, withArticle, random),
  answer: withArticle(w),
})

/** ＿ Tisch → der / die / das */
export const articleExercise = (w: GermanWord): GrammarExercise => ({
  type: 'choice',
  prompt: `＿ ${w.word}`,
  hint: w.meaning,
  options: ['der', 'die', 'das'],
  answer: articleFor(w),
})

/** Plurales falsos pero creíbles para elegir el correcto. */
function pluralCandidates(w: GermanWord): string[] {
  const base = w.word
  const umlaut = base.replace(/(au|a|o|u)(?=[^aouäöü]*$)/, (v) => ({ au: 'äu', a: 'ä', o: 'ö', u: 'ü' })[v] ?? v)
  return [`${base}e`, `${base}en`, `${base}n`, `${base}s`, `${base}er`, `${umlaut}e`, `${umlaut}er`, base]
}

/** der Tisch → die ＿ (Tische) */
export function pluralExercise(w: GermanWord, random = Math.random): GrammarExercise {
  const answer = w.plural!
  const wrong = [...new Set(pluralCandidates(w).filter((p) => p !== answer))]
  return {
    type: 'choice',
    prompt: `${withArticle(w)} → die ＿`,
    hint: `${w.meaning} (plural)`,
    options: [answer, ...pickDistinct(wrong, 3, random)],
    answer,
  }
}

/** Escribir en alemán: «mesa» → der Tisch. Se acepta ae/oe/ue y ss. */
export const writeExercise = (w: GermanWord): GrammarExercise => ({
  type: 'type',
  prompt: `Escribe en alemán: «${w.meaning}»`,
  hint: w.pos === 'noun' ? 'Con el artículo (der, die, das).' : undefined,
  answers: [withArticle(w)],
  german: true,
})

const hasArticleQuestion = (w: GermanWord) => w.pos === 'noun' && w.gender !== 'pl'

/** Ejercicios de una lección: uno de reconocimiento por palabra, artículos, plurales y algunas para escribir. */
export function germanLessonExercises(words: GermanWord[], random = Math.random): GrammarExercise[] {
  const out: GrammarExercise[] = words.map((w, i) => (i % 2 === 0 ? meaningExercise(w, random) : sayExercise(w, random)))
  for (const w of words.filter(hasArticleQuestion)) out.push(articleExercise(w))
  const withPlural = words.filter((w) => w.pos === 'noun' && w.plural && w.gender !== 'pl' && w.plural !== w.word)
  for (const w of pickDistinct(withPlural, 2, random)) out.push(pluralExercise(w, random))
  for (const w of pickDistinct(words, 2, random)) out.push(writeExercise(w))
  return out
}

/** Repaso de una tarjeta: reconocer (read) o escribir (write). */
export function germanWordReviewExercise(char: string, skill: 'read' | 'write', random = Math.random): { char: string; skill: 'read' | 'write'; exercise: GrammarExercise } {
  const w = germanWordFromCard(char)!
  if (skill === 'write') return { char, skill, exercise: writeExercise(w) }
  const kinds = [meaningExercise, sayExercise, ...(hasArticleQuestion(w) ? [articleExercise] : [])]
  return { char, skill, exercise: kinds[Math.floor(random() * kinds.length)](w, random) }
}

export { germanWordCard }

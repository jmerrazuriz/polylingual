import { looksNumeric, similarOptions } from '../../lib/distractors.ts'
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

const groupBy = (key: (w: GermanWord) => string) => {
  const map = new Map<string, GermanWord[]>()
  for (const x of germanVocab) map.set(key(x), [...(map.get(key(x)) ?? []), x])
  return map
}
const byThemePos = groupBy((x) => `${x.theme}|${x.pos}`)
const byLevelPos = groupBy((x) => `${x.level}|${x.pos}`)
const byPos = groupBy((x) => x.pos)

/**
 * Tres distractores parecidos: del mismo tema y clase de palabra (herramientas con
 * herramientas, refranes con refranes), luego del mismo nivel y al final de la misma clase.
 */
function options(w: GermanWord, pick: (x: GermanWord) => string, random: () => number): string[] {
  const answer = pick(w)
  const others = (list?: GermanWord[]) => (list ?? []).filter((x) => x.id !== w.id)
  return similarOptions(answer, {
    tiers: [
      // Si la respuesta es un número («el tercio»), primero otros números del tema.
      others(byThemePos.get(`${w.theme}|${w.pos}`)).filter((x) => looksNumeric(pick(x)) === looksNumeric(answer)),
      others(byThemePos.get(`${w.theme}|${w.pos}`)),
      others(byLevelPos.get(`${w.level}|${w.pos}`)),
      others(byPos.get(w.pos)),
    ],
    pick,
    closeness: (x) => Math.abs(pick(x).length - answer.length) / 4,
    random,
  })
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
export function writeExercise(w: GermanWord): GrammarExercise {
  // «warten auf + Akk.» se escribe sin el caso: «warten auf».
  const plain = w.word.replace(/\s*\+\s*(Akk|Dat)\..*$/, '')
  // «Ich bin der Ansicht, dass …» se acepta sin los puntos suspensivos; «O’zapft» también con «'».
  const open = w.word.replace(/\s*…/g, '').replace(/,$/, '').trim()
  const variants = [...new Set([open, open.replace(/’/g, "'")])].filter((v) => v !== w.word)
  return {
    type: 'type',
    prompt: `Escribe en alemán: «${w.meaning}»`,
    hint: w.pos === 'noun' ? 'Con el artículo (der, die, das).' : plain !== w.word ? 'El verbo con su preposición (sin el caso).' : undefined,
    answers: plain !== w.word ? [plain, w.word] : [withArticle(w), ...variants],
    german: true,
  }
}

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

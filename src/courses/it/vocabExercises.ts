import { looksNumeric, similarOptions } from '../../lib/distractors.ts'
import type { GrammarExercise } from '../grammar.ts'
import { definiteArticle } from './engine/articles.ts'
import { startOf } from './engine/phonetics.ts'
import { articleNote, genderReason, pluralNote, whyWrongMeanings, whyWrongWords, wordNote } from './explain.ts'
import { type ItalianWord, indefiniteFor, italianVocab, italianWordCard, italianWordFromCard, nounOf, pluralOf, pluralWithArticle, withArticle } from './vocab.ts'

// Ejercicios de palabras italianas para las lecciones y el repaso: significado, cómo se dice,
// el artículo (il / lo / l’ / la; un / uno / una / un’), el plural con su artículo y escribir.

const pickDistinct = <T,>(pool: T[], n: number, random: () => number) => {
  const copy = [...pool]
  const out: T[] = []
  while (copy.length && out.length < n) out.push(copy.splice(Math.floor(random() * copy.length), 1)[0])
  return out
}

const groupBy = (key: (w: ItalianWord) => string) => {
  const map = new Map<string, ItalianWord[]>()
  for (const x of italianVocab) {
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
function options(w: ItalianWord, pick: (x: ItalianWord) => string, random: () => number): string[] {
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

/** ¿Qué significa «lo zaino»? */
export function meaningExercise(w: ItalianWord, random = Math.random): GrammarExercise {
  const opts = options(w, (x) => x.meaning, random)
  return { type: 'meaning', text: withArticle(w), options: opts, answer: w.meaning, explanation: wordNote(w), whyWrong: whyWrongMeanings(opts, w.meaning) }
}

/** ¿Cómo se dice «mochila»? → lo zaino */
export function sayExercise(w: ItalianWord, random = Math.random): GrammarExercise {
  const opts = options(w, withArticle, random)
  return { type: 'choice', prompt: `¿Cómo se dice «${w.meaning}»?`, options: opts, answer: withArticle(w), explanation: wordNote(w), whyWrong: whyWrongWords(opts, withArticle(w)) }
}

const DEFINITE = ['il', 'lo', "l'", 'la']
const INDEFINITE = ['un', 'uno', 'una', "un'"]
const shown = (a: string) => a.replace(/'/g, '’')

/**
 * ＿ zaino → lo. Con vocal inicial, el definido (l’) no deja ver el género: se pregunta el
 * indefinido (un amico / un’amica).
 */
export function articleExercise(w: ItalianWord): GrammarExercise {
  const vowel = startOf(w.word) === 'vowel'
  const answer = vowel ? indefiniteFor(w) : definiteArticle(nounOf(w))
  const all = vowel ? INDEFINITE : DEFINITE
  const wrongReason = (o: string) => {
    if (o === "l'") return `«l’» solo va ante vocal; «${w.word}» empieza por consonante.`
    if ((o === 'lo' || o === 'uno') && w.gender === 'f') return `«${o}» es masculino; «${w.word}» es femenino, y el femenino no cambia ante s + consonante o z.`
    if (o === 'lo' || o === 'uno') return `«${o}» va ante s + consonante, z, gn, ps, y; «${w.word}» no empieza así.`
    if (o === 'una' && vowel && w.gender === 'f') return `Ante vocal, «una» se reduce a «un’» (un’amica).`
    if (o === 'il') return w.gender === 'f' ? `«il» es masculino; «${w.word}» es femenino.` : `«il» no va ante s + consonante, z, gn, ps ni vocal.`
    if (o === 'la' || o === 'una') return `«${o}» es femenino; «${w.word}» es masculino.`
    if (o === "un'") return w.gender === 'm' ? `«un’» es el femenino ante vocal; el masculino es «un», sin apóstrofo.` : `«un’» solo va ante vocal.`
    return `«${o}» es masculino; «${w.word}» es femenino.`
  }
  return {
    type: 'choice',
    prompt: `＿ ${w.word.replace(/'/g, '’')}`,
    hint: w.meaning,
    options: all.map(shown),
    answer: shown(answer),
    explanation: articleNote(w, answer),
    whyWrong: Object.fromEntries(all.filter((o) => o !== answer).map((o) => [shown(o), wrongReason(o)])),
  }
}

/** Plurales falsos pero creíbles, con el artículo plural correcto o equivocado. */
function pluralCandidates(w: ItalianWord, right: string): string[] {
  const s = w.word
  const stem = s.slice(0, -1)
  const endings = [
    `${stem}i`,
    `${stem}e`,
    s,
    ...(/[cg][oa]$/.test(s) ? [`${stem}hi`, `${stem}he`] : []),
    ...(/[cg]ia$/.test(s) ? [`${s.slice(0, -2)}e`] : []),
    ...(/[cg]hi$/.test(right) ? [`${right.slice(0, -2)}i`] : []),
    ...(s.endsWith('o') ? [`${stem}a`] : []),
  ]
  const art = definiteArticle({ ...nounOf(w), plural: right }, true)
  const otherArts = ['i', 'gli', 'le'].filter((a) => a !== art)
  return [...endings.filter((e) => e !== right).map((e) => `${art} ${e}`), ...otherArts.map((a) => `${a} ${right}`)]
}

/** il parco → i parchi; lo zaino → gli zaini; l’uovo → le uova. */
export function pluralExercise(w: ItalianWord, random = Math.random): GrammarExercise {
  const plural = pluralOf(w)!
  const answer = pluralWithArticle(w)!
  const wrong = [...new Set(pluralCandidates(w, plural).map(shown))].filter((x) => x !== answer)
  const opts = [answer, ...pickDistinct(wrong, 3, random)]
  const art = answer.split(' ')[0]
  return {
    type: 'choice',
    prompt: `${withArticle(w)} → ＿`,
    hint: `${w.meaning} (plural)`,
    options: opts,
    answer,
    explanation: `${withArticle(w)} → ${answer}. ${pluralNote(w)}`,
    whyWrong: Object.fromEntries(
      opts.filter((o) => o !== answer).map((o) => [o, o.endsWith(` ${plural}`) ? `La palabra está bien, pero el artículo plural es «${art}».` : `El plural de «${w.word}» es «${plural}».`]),
    ),
  }
}

/** Escribir en italiano: «mochila» → lo zaino. Sin tildes cuenta como «casi»; las dobles, no. */
export function writeExercise(w: ItalianWord): GrammarExercise {
  const open = w.word.replace(/\s*[?…]$/, '').trim()
  return {
    type: 'type',
    prompt: `Escribe en italiano: «${w.meaning}»`,
    hint: w.pos === 'noun' ? 'Con el artículo (il, lo, l’, la, i, gli, le).' : w.pos === 'adj' && w.feminine ? 'En masculino.' : undefined,
    answers: w.pos === 'noun' ? [withArticle(w)] : [...new Set([w.word, open])],
    italian: true,
    explanation: wordNote(w),
  }
}

/** Sustantivos con un artículo que vale la pena preguntar (no los de persona con femenino ni los «solo plural»). */
export const hasArticleQuestion = (w: ItalianWord) => w.pos === 'noun' && !w.pluralOnly && !w.feminine && !w.word.includes(' ') && /^[a-zàèéìòù]/.test(w.word)
/** Sustantivos con plural que no es el más simple (-o → -i, -a → -e): ahí está la trampa. */
export const hasPluralQuestion = (w: ItalianWord) => {
  if (!hasArticleQuestion(w)) return false
  const p = pluralOf(w)
  if (!p) return false
  const simple = w.word.endsWith('o') ? `${w.word.slice(0, -1)}i` : w.word.endsWith('a') && w.gender === 'f' ? `${w.word.slice(0, -1)}e` : null
  return p !== simple || startOf(w.word) !== 'consonant'
}

/** Ejercicios de una lección: uno por palabra, artículos, un plural y dos para escribir. */
export function italianLessonExercises(words: ItalianWord[], random = Math.random): GrammarExercise[] {
  const out: GrammarExercise[] = words.map((w, i) => (i % 2 === 0 ? meaningExercise(w, random) : sayExercise(w, random)))
  for (const w of pickDistinct(words.filter(hasArticleQuestion), 4, random)) out.push(articleExercise(w))
  for (const w of pickDistinct(words.filter(hasPluralQuestion), 2, random)) out.push(pluralExercise(w, random))
  for (const w of pickDistinct(words, 2, random)) out.push(writeExercise(w))
  return out
}

/** Repaso de una tarjeta: reconocer (read) o escribir (write). */
export function italianWordReviewExercise(char: string, skill: 'read' | 'write', random = Math.random): { char: string; skill: 'read' | 'write'; exercise: GrammarExercise } {
  const w = italianWordFromCard(char)!
  if (skill === 'write') return { char, skill, exercise: writeExercise(w) }
  const kinds = [meaningExercise, sayExercise, ...(hasArticleQuestion(w) ? [articleExercise] : [])]
  return { char, skill, exercise: kinds[Math.floor(random() * kinds.length)](w, random) }
}

export { genderReason, italianWordCard }

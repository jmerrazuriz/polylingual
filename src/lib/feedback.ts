// Corrección explicada de un ejercicio. Al acertar: una línea breve (la regla o la frase
// completa). Al fallar: qué se respondió y por qué no sirve, qué es lo correcto y la parte de
// la lección (o del texto leído) que lo explica.

import type { GrammarExercise } from '../courses/grammar.ts'
import { furiganaToPlain } from './furigana.ts'
import { doublesHint } from './italianInput.ts'

/** Lo que la pantalla sabe de la lección o del texto en que aparece el ejercicio. */
export type FeedbackContext = {
  /** Estructura de la lección («A は B です», «sein + zu + infinitivo»). */
  rule?: string
  /** Párrafos de la explicación de la lección (con **negritas** y furigana). */
  paragraphs?: string[]
  /** Líneas del texto leído, para citar dónde está la respuesta. */
  lines?: { text: string; meaning: string }[]
}

export type Feedback = {
  correct: boolean
  /** Al acertar: una explicación breve. */
  brief?: string
  /** Al fallar: lo que se respondió y por qué no sirve. */
  given?: string
  /** Al fallar: la respuesta correcta (frase completa si es de completar). */
  right?: string
  /** Al fallar: la explicación de la lección o la línea del texto que da la respuesta. */
  why?: string
  /** Cita del texto («En el texto: …»), si el ejercicio es de una lectura. */
  quote?: { text: string; meaning: string }
}

const plain = (s: string) => furiganaToPlain(s).replace(/\*/g, '')
const norm = (s: string) =>
  plain(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.,;:!?¡¿«»"“”()…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** El texto de la respuesta correcta. */
export function correctAnswer(e: GrammarExercise): string {
  return e.type === 'order' ? e.answer.join(' ') : e.type === 'type' ? e.answers[0] : e.answer
}

/** En los ejercicios de completar, la frase con la opción puesta en el hueco. */
export const fillBlank = (prompt: string, option: string) => (prompt.includes('＿') ? prompt.replace('＿', option) : null)

/** ¿Aparece `needle` como palabra o frase dentro de `hay`? (sin tildes ni mayúsculas) */
function mentions(hay: string, needle: string): boolean {
  const n = norm(needle)
  if (n.length < 2) return false
  const h = ` ${norm(hay)} `
  // Para kana y kanji no hay espacios: basta con que esté contenido.
  return /[぀-ヿ一-鿿]/.test(n) ? h.includes(n) : h.includes(` ${n} `) || (n.includes(' ') && h.includes(n))
}

/** El párrafo de la lección que habla de `term` (el primero que lo menciona). */
export function paragraphAbout(paragraphs: readonly string[] | undefined, term: string, exclude?: string): string | undefined {
  return paragraphs?.find((p) => mentions(p, term) && (!exclude || !mentions(p, exclude)))
}

/** La línea del texto que más palabras comparte con la respuesta (para citarla). */
export function bestLine(lines: FeedbackContext['lines'], answer: string): { text: string; meaning: string } | undefined {
  if (!lines?.length) return undefined
  const words = new Set(norm(answer).split(' ').filter((w) => w.length > 3))
  if (!words.size) return undefined
  let best: { line: (typeof lines)[number]; score: number } | undefined
  for (const line of lines) {
    const own = new Set(norm(`${line.meaning} ${line.text}`).split(' '))
    const score = [...words].filter((w) => own.has(w) || [...own].some((o) => o.length > 4 && (o.startsWith(w.slice(0, 5)) || w.startsWith(o.slice(0, 5))))).length
    if (score > 0 && (!best || score > best.score)) best = { line, score }
  }
  return best?.line
}

/** Primera oración de una explicación (para la versión breve al acertar). */
const firstSentence = (s: string) => {
  const m = plain(s).match(/^.+?[.!?](\s|$)/)
  return (m ? m[0] : plain(s)).trim()
}

/** Qué falló al escribir: mayúsculas, tildes o diéresis, el artículo, o desde dónde difiere. */
export function diagnoseTyping(given: string, answers: readonly string[]): string | undefined {
  const g = given.trim()
  const target = answers[0]
  if (!g) return undefined
  const fold = (s: string) =>
    s
      .toLowerCase()
      .replace(/ß/g, 'ss')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[’']/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
  if (answers.some((a) => a.toLowerCase() === g.toLowerCase())) return 'Solo fallan las mayúsculas.'
  if (answers.some((a) => fold(a) === fold(g))) return 'Faltan o sobran tildes o diéresis: fíjate en los signos de cada letra.'
  // Italiano: una doble consonante que falta o sobra (pala / palla).
  const doubles = doublesHint(g, target)
  if (doubles) return doubles
  const articles = ['der', 'die', 'das', 'le', 'la', "l'", 'les', 'un', 'une', 'il', 'lo', 'i', 'gli', 'uno', 'una', "un'"]
  const words = (s: string) => s.replace(/^([lL]|[uU]n)['’]/, (_m, a: string) => `${a.toLowerCase()}' `).split(' ')
  const [ga, ...gr] = words(g)
  const [ta, ...tr] = words(target)
  if (articles.includes(ga.toLowerCase()) && articles.includes(ta.toLowerCase()) && fold(gr.join(' ')) === fold(tr.join(' ')) && ga.toLowerCase() !== ta.toLowerCase()) {
    return `La palabra está bien, pero el artículo es «${ta}», no «${ga}».`
  }
  // Primera diferencia, para orientar.
  const a = fold(g)
  const b = fold(target)
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  if (i > 0 && i < b.length) return `Coincide hasta «${target.slice(0, i)}»; después debía seguir «${target.slice(i)}».`
  return undefined
}

/**
 * La corrección explicada. `given` es la opción elegida, el texto escrito o el orden armado
 * (null si se saltó). Las explicaciones propias del ejercicio (`explanation`, `whyWrong`)
 * tienen prioridad; si no hay, se buscan en la lección o en el texto.
 */
export function buildFeedback(e: GrammarExercise, given: string | null, correct: boolean, ctx: FeedbackContext = {}): Feedback {
  const answer = correctAnswer(e)
  const own = 'explanation' in e ? e.explanation : undefined
  const whyWrong = 'whyWrong' in e ? e.whyWrong : undefined
  const full = e.type === 'choice' ? fillBlank(e.prompt, answer) : null
  const quote = bestLine(ctx.lines, answer)
  const lessonWhy = paragraphAbout(ctx.paragraphs, answer)

  if (correct) {
    // Breve: la explicación propia, o la frase completa con la regla de la lección.
    const brief = own ? firstSentence(own) : quote ? undefined : [full && `«${plain(full)}»`, ctx.rule].filter(Boolean).join(' — ') || undefined
    return { correct, brief, quote }
  }

  let givenText: string | undefined
  if (given !== null && given !== '') {
    if (e.type === 'choice' || e.type === 'meaning') {
      const reason = whyWrong?.[given] ?? autoWhyWrong(e, given, answer, ctx)
      givenText = `Elegiste «${plain(given)}».${reason ? ` ${reason}` : ''}`
    } else if (e.type === 'type') {
      const diagnosis = diagnoseTyping(given, e.answers)
      givenText = `Escribiste «${given}».${diagnosis ? ` ${diagnosis}` : ''}`
    } else {
      givenText = `Tu orden: «${given}».`
    }
  } else if (given === '') {
    givenText = 'No respondiste.'
  }

  return {
    correct,
    given: givenText,
    right: full ?? answer,
    why: own ?? lessonWhy ?? (ctx.rule ? `Regla de la lección: ${ctx.rule}` : undefined),
    quote,
  }
}

/** Por qué no sirve la opción elegida, a partir de la lección (si la menciona en otro contexto). */
function autoWhyWrong(e: GrammarExercise, given: string, answer: string, ctx: FeedbackContext): string | undefined {
  if (e.type === 'choice') {
    const wrongSentence = fillBlank(e.prompt, given)
    const about = paragraphAbout(ctx.paragraphs, given, answer)
    if (about) return `Sobre «${plain(given)}», la lección dice: ${firstSentence(about)}`
    if (wrongSentence) return `«${plain(wrongSentence)}» no es correcto aquí.`
  }
  return undefined
}

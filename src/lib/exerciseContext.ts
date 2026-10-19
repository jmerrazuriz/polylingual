// De qué lección o texto viene cada ejercicio, para que la corrección explique con lo que se
// está viendo aunque el ejercicio aparezca fuera de su lección (nivelación, simulacros, repaso).

import { grammarByCourse } from '../courses/content.ts'
import { germanTexts } from '../courses/de/texts.ts'
import { frenchTexts } from '../courses/fr/texts.ts'
import { italianTexts } from '../courses/it/texts.ts'
import type { GrammarExercise } from '../courses/grammar.ts'
import type { ReadingText } from '../courses/reading.ts'
import type { FeedbackContext } from './feedback.ts'
import { readingTexts } from './readings.ts'

let registry: WeakMap<GrammarExercise, FeedbackContext> | null = null

/** Contexto de un texto: sus líneas (para citar dónde está la respuesta). */
export const textContext = (t: Pick<ReadingText, 'lines'>): FeedbackContext => ({
  lines: t.lines.map((l) => ({ text: l.text, meaning: l.meaning })),
})

function build(): WeakMap<GrammarExercise, FeedbackContext> {
  const map = new WeakMap<GrammarExercise, FeedbackContext>()
  for (const lessons of Object.values(grammarByCourse)) {
    for (const lesson of lessons) {
      const ctx: FeedbackContext = { rule: lesson.pattern, paragraphs: lesson.explanation }
      for (const e of lesson.exercises) map.set(e, ctx)
    }
  }
  for (const t of [...readingTexts, ...germanTexts, ...frenchTexts, ...italianTexts]) {
    const ctx = textContext(t)
    for (const q of t.questions) map.set(q, ctx)
  }
  return map
}

/** La lección o el texto del que salió el ejercicio, si es de los escritos a mano. */
export function contextFor(e: GrammarExercise): FeedbackContext | undefined {
  registry ??= build()
  return registry.get(e)
}

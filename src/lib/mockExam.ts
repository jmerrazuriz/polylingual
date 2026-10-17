// Simulacro del JLPT: cuatro secciones como el examen real (vocabulario, gramática,
// lectura y audición), con tiempo y puntaje en la escala del JLPT.

import { grammarByCourse } from '../courses/content.ts'
import type { GrammarExercise } from '../courses/grammar.ts'
import { vocab } from '../courses/ja/vocab.ts'
import type { ReadingText } from '../courses/reading.ts'
import { shuffle } from './random.ts'
import { readingTexts } from './readings.ts'
import { wordChoiceExercise, wordMeaningExercise } from './vocabExercises.ts'

export type ExamSection = 'vocab' | 'grammar' | 'reading' | 'listening'

export const sectionInfo: Record<ExamSection, { title: string; jp: string }> = {
  vocab: { title: 'Vocabulario', jp: 'もじ・ごい' },
  grammar: { title: 'Gramática', jp: 'ぶんぽう' },
  reading: { title: 'Lectura', jp: 'どっかい' },
  listening: { title: 'Audición', jp: 'ちょうかい' },
}

export type ExamItem = { section: ExamSection; exercise: GrammarExercise; text?: ReadingText }

export const EXAM_MINUTES = 30
const VOCAB_QUESTIONS = 10
const GRAMMAR_QUESTIONS = 10
const TEXTS_PER_SECTION = 2

/** Arma un simulacro N5 al azar con todo el contenido del nivel. */
export function buildMockExam(random = Math.random): ExamItem[] {
  const words = shuffle(vocab, random).slice(0, VOCAB_QUESTIONS)
  const vocabItems = words.map(
    (w, i): ExamItem => ({ section: 'vocab', exercise: i % 2 === 0 ? wordMeaningExercise(w, random) : wordChoiceExercise(w, random) }),
  )

  // Gramática: frases para completar (con ＿) y alguna para ordenar.
  const all = grammarByCourse.ja.flatMap((g) => g.exercises)
  const blanks = shuffle(
    all.filter((e) => e.type === 'choice' && e.prompt.includes('＿')),
    random,
  ).slice(0, GRAMMAR_QUESTIONS - 2)
  const orders = shuffle(
    all.filter((e) => e.type === 'order'),
    random,
  ).slice(0, 2)
  const grammarItems = shuffle([...blanks, ...orders], random).map((exercise): ExamItem => ({ section: 'grammar', exercise }))

  const texts = (kind: ReadingText['kind'], section: ExamSection) =>
    shuffle(
      readingTexts.filter((t) => t.kind === kind),
      random,
    )
      .slice(0, TEXTS_PER_SECTION)
      .flatMap((text) => text.questions.map((exercise): ExamItem => ({ section, exercise, text })))

  return [...vocabItems, ...grammarItems, ...texts('reading', 'reading'), ...texts('dialogue', 'listening')]
}

export type ExamScore = {
  /** Aciertos y total por sección. */
  sections: Record<ExamSection, { correct: number; total: number }>
  /** Conocimientos del idioma + lectura, de 0 a 120 (se aprueba con 38). */
  language: number
  /** Audición, de 0 a 60 (se aprueba con 19). */
  listening: number
  /** Total, de 0 a 180 (se aprueba con 80). */
  total: number
  passed: boolean
}

/** Puntaje con la escala del JLPT N5 (los mínimos por sección son los oficiales). */
export function scoreExam(items: ExamItem[], answers: (boolean | undefined)[]): ExamScore {
  const sections = Object.fromEntries(
    (Object.keys(sectionInfo) as ExamSection[]).map((s) => {
      const indexes = items.flatMap((item, i) => (item.section === s ? [i] : []))
      return [s, { correct: indexes.filter((i) => answers[i] === true).length, total: indexes.length }]
    }),
  ) as ExamScore['sections']
  const ratio = (...keys: ExamSection[]) => {
    const total = keys.reduce((n, k) => n + sections[k].total, 0)
    return total ? keys.reduce((n, k) => n + sections[k].correct, 0) / total : 0
  }
  const language = Math.round(ratio('vocab', 'grammar', 'reading') * 120)
  const listening = Math.round(ratio('listening') * 60)
  const total = language + listening
  return { sections, language, listening, total, passed: total >= 80 && language >= 38 && listening >= 19 }
}

export const EXAM_RECORD_KEY = 'simulacro-n5'

// Simulacros del JLPT (N5 y N4): cuatro secciones como el examen real (vocabulario,
// gramática, lectura y audición), con tiempo y puntaje en la escala del JLPT.

import { grammarByCourse } from '../courses/content.ts'
import type { GrammarExercise } from '../courses/grammar.ts'
import { kanjiList } from '../courses/ja/kanji.ts'
import { kanjiN4 } from '../courses/ja/kanjiN4.ts'
import { vocab } from '../courses/ja/vocab.ts'
import type { ReadingText } from '../courses/reading.ts'
import { shuffle } from './random.ts'
import { readingTexts } from './readings.ts'
import { wordChoiceExercise, wordMeaningExercise } from './vocabExercises.ts'

export type ExamLevel = 'N5' | 'N4'
export type ExamSection = 'vocab' | 'grammar' | 'reading' | 'listening'

export const sectionInfo: Record<ExamSection, { title: string; jp: string }> = {
  vocab: { title: 'Vocabulario y kanji', jp: 'もじ・ごい' },
  grammar: { title: 'Gramática', jp: 'ぶんぽう' },
  reading: { title: 'Lectura', jp: 'どっかい' },
  listening: { title: 'Audición', jp: 'ちょうかい' },
}

/**
 * Datos de cada examen. Los mínimos por sección son los oficiales del JLPT (38/120 en
 * idioma y lectura, 19/60 en audición); el total para aprobar es 80 en N5 y 90 en N4.
 */
export const examInfo: Record<ExamLevel, { minutes: number; passTotal: number; recordKey: string; path: string; lastGrammar: string }> = {
  N5: { minutes: 30, passTotal: 80, recordKey: 'simulacro-n5', path: '/simulacro', lastGrammar: 'no-ga-suki' },
  N4: { minutes: 35, passTotal: 90, recordKey: 'simulacro-n4', path: '/simulacro/n4', lastGrammar: 'keigo-humildad' },
}
export const PASS_LANGUAGE = 38
export const PASS_LISTENING = 19

/** Clave del récord que marca un simulacro aprobado (vale 1). */
export const passedKey = (level: ExamLevel) => `${examInfo[level].recordKey}:aprobado`

export type ExamItem = { section: ExamSection; exercise: GrammarExercise; text?: ReadingText }

const KANJI_QUESTIONS = 4
const WORD_QUESTIONS = 6
const GRAMMAR_QUESTIONS = 10
const TEXTS_PER_SECTION = 2

const n4Chars = new Set(kanjiN4.map((k) => k.char))
const kanjiOf = (level: ExamLevel) => kanjiList.filter((k) => n4Chars.has(k.char) === (level === 'N4'))

/** Lectura de una palabra con kanji, como en la parte 漢字読み del examen. */
function kanjiReadingExercises(level: ExamLevel, random: () => number): GrammarExercise[] {
  const list = kanjiOf(level)
  const allReadings = list.flatMap((k) => k.examples.map((e) => e.reading))
  return shuffle(list, random)
    .slice(0, KANJI_QUESTIONS)
    .map((k): GrammarExercise => {
      const ex = k.examples[Math.floor(random() * k.examples.length)]
      const others = [...new Set(shuffle(allReadings, random))].filter((r) => r !== ex.reading).slice(0, 3)
      return { type: 'choice', prompt: `¿Cómo se lee «${ex.word}»?`, options: [ex.reading, ...others], answer: ex.reading }
    })
}

/** Arma un simulacro al azar con el contenido del nivel. */
export function buildMockExam(level: ExamLevel = 'N5', random = Math.random): ExamItem[] {
  const words = shuffle(
    vocab.filter((v) => v.level === level),
    random,
  ).slice(0, WORD_QUESTIONS)
  const vocabItems = [
    ...kanjiReadingExercises(level, random),
    ...words.map((w, i) => (i % 2 === 0 ? wordMeaningExercise(w, random) : wordChoiceExercise(w, random))),
  ].map((exercise): ExamItem => ({ section: 'vocab', exercise }))

  // Gramática: frases para completar (con ＿) y alguna para ordenar, solo del nivel.
  const all = grammarByCourse.ja.filter((g) => (g.level ?? 'N5') === level).flatMap((g) => g.exercises)
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
      readingTexts.filter((t) => t.kind === kind && t.level === level),
      random,
    )
      .slice(0, TEXTS_PER_SECTION)
      .flatMap((text) => text.questions.map((exercise): ExamItem => ({ section, exercise, text })))

  return [...vocabItems, ...grammarItems, ...texts('reading', 'reading'), ...texts('dialogue', 'listening')]
}

export type ExamScore = {
  /** Aciertos y total por sección. */
  sections: Record<ExamSection, { correct: number; total: number }>
  /** Conocimientos del idioma + lectura, de 0 a 120. */
  language: number
  /** Audición, de 0 a 60. */
  listening: number
  /** Total, de 0 a 180. */
  total: number
  passed: boolean
}

/** Puntaje con la escala del JLPT: total y mínimos por sección. */
export function scoreExam(items: ExamItem[], answers: (boolean | undefined)[], level: ExamLevel = 'N5'): ExamScore {
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
  return {
    sections,
    language,
    listening,
    total,
    passed: total >= examInfo[level].passTotal && language >= PASS_LANGUAGE && listening >= PASS_LISTENING,
  }
}

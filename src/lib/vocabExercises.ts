// Ejercicios de vocabulario: reconocer el significado, elegir la palabra y escribirla
// en kana. Las palabras tienen tarjetas de repaso con el carácter «w-<id>».

import type { GrammarExercise } from '../courses/grammar.ts'
import { groupLabel, posLabel, vocab, type VocabEntry, vocabById, type VocabLesson } from '../courses/ja/vocab.ts'
import { shuffle } from './random.ts'
import type { TaggedExercise } from './studyExercises.ts'

export const WORD_PREFIX = 'w-'
export const wordCardChar = (entry: VocabEntry) => WORD_PREFIX + entry.id
export const wordFromCard = (char: string) => (char.startsWith(WORD_PREFIX) ? vocabById.get(char.slice(WORD_PREFIX.length)) : undefined)

export const wordPosText = (entry: VocabEntry) => (entry.group ? `${posLabel[entry.pos]}, ${groupLabel[entry.group]}` : posLabel[entry.pos])

/** Distractores de la misma clase de palabra (verbos con verbos…), sin repetir el texto. */
function options(entry: VocabEntry, pick: (v: VocabEntry) => string, random: () => number): string[] {
  const answer = pick(entry)
  const same = vocab.filter((v) => v.pos === entry.pos && v.id !== entry.id)
  const pool = same.length >= 8 ? same : vocab.filter((v) => v.id !== entry.id)
  const others = [...new Set(shuffle(pool, random).map(pick))].filter((o) => o !== answer)
  return [answer, ...others.slice(0, 3)]
}

/** ¿Qué significa la palabra? (kana → español) */
export function wordMeaningExercise(entry: VocabEntry, random = Math.random): GrammarExercise {
  return { type: 'meaning', text: entry.kana, options: options(entry, (v) => v.meaning, random), answer: entry.meaning }
}

/** ¿Cómo se dice…? (español → kana, eligiendo) */
export function wordChoiceExercise(entry: VocabEntry, random = Math.random): GrammarExercise {
  return {
    type: 'choice',
    prompt: `¿Cómo se dice «${entry.meaning}»?`,
    hint: wordPosText(entry),
    options: options(entry, (v) => v.kana, random),
    answer: entry.kana,
  }
}

/** Escribir la palabra en kana a partir del significado. */
export function wordTypeExercise(entry: VocabEntry): GrammarExercise {
  return {
    type: 'type',
    prompt: `«${entry.meaning}»`,
    hint: `Escríbelo en japonés (${wordPosText(entry)})`,
    answers: [entry.kana],
    kana: true,
  }
}

/** Ejercicios de una lección de vocabulario: todas las palabras se reconocen; algunas se eligen y se escriben. */
export function vocabLessonExercises(lesson: VocabLesson, random = Math.random): TaggedExercise[] {
  const tag = (entry: VocabEntry, exercise: GrammarExercise, skill: 'read' | 'write'): TaggedExercise => ({
    char: wordCardChar(entry),
    skill,
    exercise,
  })
  const words = shuffle(lesson.words, random)
  const recognize = words.map((w) => tag(w, wordMeaningExercise(w, random), 'read'))
  const choose = words.slice(0, 4).map((w) => tag(w, wordChoiceExercise(w, random), 'read'))
  const write = shuffle(lesson.words, random)
    .slice(0, 4)
    .map((w) => tag(w, wordTypeExercise(w), 'write'))
  return [...shuffle([...recognize, ...choose], random), ...write]
}

/** Repaso de una palabra: leer = reconocer el significado; escribir = escribirla en kana. */
export function wordReviewExercise(char: string, skill: 'read' | 'write', random = Math.random): TaggedExercise {
  const entry = wordFromCard(char)!
  return {
    char,
    skill,
    exercise: skill === 'write' ? wordTypeExercise(entry) : random() < 0.7 ? wordMeaningExercise(entry, random) : wordChoiceExercise(entry, random),
  }
}

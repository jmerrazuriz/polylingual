// Ejercicios de vocabulario: reconocer el significado, elegir la palabra y escribirla
// en kana. Las palabras tienen tarjetas de repaso con el carácter «w-<id>».

import type { GrammarExercise } from '../courses/grammar.ts'
import { groupLabel, posLabel, vocab, type VocabEntry, vocabById, type VocabLesson } from '../courses/ja/vocab.ts'
import { furiganaToPlain } from './furigana.ts'
import { looksNumeric, similarOptions } from './distractors.ts'
import { shuffle } from './random.ts'
import type { TaggedExercise } from './studyExercises.ts'

export const WORD_PREFIX = 'w-'
export const wordCardChar = (entry: VocabEntry) => WORD_PREFIX + entry.id
export const wordFromCard = (char: string) => (char.startsWith(WORD_PREFIX) ? vocabById.get(char.slice(WORD_PREFIX.length)) : undefined)

export const wordPosText = (entry: VocabEntry) => (entry.group ? `${posLabel[entry.pos]}, ${groupLabel[entry.group]}` : posLabel[entry.pos])

const byTheme = new Map<VocabEntry['theme'], VocabEntry[]>()
for (const v of vocab) byTheme.set(v.theme, [...(byTheme.get(v.theme) ?? []), v])

/**
 * Distractores parecidos: primero del mismo tema y clase (un número con otros números, un
 * familiar con otros familiares), luego del mismo tema, luego de la misma clase y nivel.
 */
function options(entry: VocabEntry, pick: (v: VocabEntry) => string, random: () => number): string[] {
  const others = (list: readonly VocabEntry[]) => list.filter((v) => v.id !== entry.id)
  const theme = others(byTheme.get(entry.theme) ?? [])
  const answer = pick(entry)
  // Si la respuesta es un número («nueve»), primero otros números.
  const sameShape = (v: VocabEntry) => looksNumeric(pick(v)) === looksNumeric(answer)
  return similarOptions(answer, {
    tiers: [
      theme.filter((v) => v.pos === entry.pos && sameShape(v)),
      theme.filter((v) => v.pos === entry.pos),
      theme,
      others(vocab).filter((v) => v.pos === entry.pos && v.level === entry.level),
      others(vocab).filter((v) => v.pos === entry.pos),
      others(vocab),
    ],
    pick,
    closeness: (v) => Math.abs(pick(v).length - answer.length) / 3,
    random,
  })
}

// Para explicar las opciones incorrectas: a qué palabra corresponde cada significado o lectura.
const byMeaning = new Map<string, VocabEntry>()
const byKana = new Map<string, VocabEntry>()
for (const v of vocab) {
  if (!byMeaning.has(v.meaning)) byMeaning.set(v.meaning, v)
  if (!byKana.has(v.kana)) byKana.set(v.kana, v)
}
const shown = (v: VocabEntry) => (v.written ? `${furiganaToPlain(v.written)} (${v.kana})` : v.kana)

/** La ficha breve de la palabra: cómo se escribe, cómo se lee y qué significa. */
export const wordNote = (v: VocabEntry) => `${shown(v)} = «${v.meaning}» (${wordPosText(v)}).`

function whyWrong(options: readonly string[], answer: string, explain: (o: string) => string | undefined): Record<string, string> {
  return Object.fromEntries(options.filter((o) => o !== answer).flatMap((o) => {
    const text = explain(o)
    return text ? [[o, text]] : []
  }))
}

/** ¿Qué significa la palabra? (kana, o kanji con furigana → español) */
export function wordMeaningExercise(entry: VocabEntry, random = Math.random): GrammarExercise {
  const opts = options(entry, (v) => v.meaning, random)
  return {
    type: 'meaning',
    text: entry.written ?? entry.kana,
    options: opts,
    answer: entry.meaning,
    explanation: wordNote(entry),
    whyWrong: whyWrong(opts, entry.meaning, (o) => {
      const v = byMeaning.get(o)
      return v ? `«${o}» se dice ${shown(v)}.` : undefined
    }),
  }
}

/** Palabras con forma escrita en kanji, para las preguntas de lectura. */
const writtenWords = vocab.filter((v) => v.written)

/** ¿Cómo se lee la palabra escrita con kanji (sin furigana)? Solo para palabras con `written`. */
export function wordReadingExercise(entry: VocabEntry, random = Math.random): GrammarExercise {
  const answer = entry.kana
  // Distractores: lecturas de otras palabras con kanji del mismo tamaño, para que no sea obvio.
  const similar = writtenWords.filter((v) => v.id !== entry.id && Math.abs(v.kana.length - answer.length) <= 1)
  const pool = similar.length >= 6 ? similar : writtenWords.filter((v) => v.id !== entry.id)
  const others = [...new Set(shuffle(pool, random).map((v) => v.kana))].filter((o) => o !== answer).slice(0, 3)
  return {
    type: 'choice',
    prompt: `¿Cómo se lee «${furiganaToPlain(entry.written!)}»?`,
    hint: entry.meaning,
    options: [answer, ...others],
    answer,
    explanation: wordNote(entry),
    whyWrong: whyWrong([answer, ...others], answer, (o) => {
      const v = byKana.get(o)
      return v?.written ? `${o} es la lectura de ${furiganaToPlain(v.written)} («${v.meaning}»).` : undefined
    }),
  }
}

/** ¿Cómo se dice…? (español → kana, eligiendo) */
export function wordChoiceExercise(entry: VocabEntry, random = Math.random): GrammarExercise {
  return {
    type: 'choice',
    prompt: `¿Cómo se dice «${entry.meaning}»?`,
    hint: wordPosText(entry),
    explanation: wordNote(entry),
    ...(() => {
      const opts = options(entry, (v) => v.kana, random)
      return {
        options: opts,
        whyWrong: whyWrong(opts, entry.kana, (o) => {
          const v = byKana.get(o)
          return v ? `${o} significa «${v.meaning}».` : undefined
        }),
      }
    })(),
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
    explanation: wordNote(entry),
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
  // Palabras con kanji: también leerlas sin furigana.
  const read = words
    .filter((w) => w.written)
    .slice(0, 4)
    .map((w) => tag(w, wordReadingExercise(w, random), 'read'))
  const write = shuffle(lesson.words, random)
    .slice(0, 4)
    .map((w) => tag(w, wordTypeExercise(w), 'write'))
  return [...shuffle([...recognize, ...choose, ...read], random), ...write]
}

/** Repaso de una palabra: leer = reconocer el significado (o leer sus kanji); escribir = escribirla en kana. */
export function wordReviewExercise(char: string, skill: 'read' | 'write', random = Math.random): TaggedExercise {
  const entry = wordFromCard(char)!
  return {
    char,
    skill,
    exercise:
      skill === 'write'
        ? wordTypeExercise(entry)
        : entry.written && random() < 0.5
          ? wordReadingExercise(entry, random)
          : random() < 0.7
            ? wordMeaningExercise(entry, random)
            : wordChoiceExercise(entry, random),
  }
}

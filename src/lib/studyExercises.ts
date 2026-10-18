// Generadores de ejercicios para las lecciones de contadores y de kanji. Producen
// el mismo formato que la gramática (GrammarExercise) para usar la misma pantalla.

import type { GrammarExercise } from '../courses/grammar.ts'
import { bigNumbers, type Counter, counterById, type CounterLesson, counters, numbers } from '../courses/ja/counters.ts'
import { type Kanji, kanjiByChar, type KanjiLesson, kanjiLessons, kanjiList } from '../courses/ja/kanji.ts'
import { similarOptions } from './distractors.ts'
import { shuffle } from './random.ts'
import type { WritingItem } from './writing.ts'

/** La respuesta más hasta `count - 1` distractores distintos entre sí y de la respuesta. */
function withDistractors(answer: string, candidates: readonly string[], count = 4, random = Math.random): string[] {
  const others = [...new Set(candidates)].filter((c) => c !== answer)
  return [answer, ...shuffle(others, random).slice(0, count - 1)]
}

const counterLabel = (c: Counter) => (c.kanji === c.reading ? c.reading : `${c.kanji} (${c.reading})`)

/** Lectura «regular» (sin cambios de sonido), útil como distractor: さん + ほん = さんほん. */
const regularReading = (c: Counter, n: number) => numbers[n - 1].readings[0] + c.reading

function readingExercise(c: Counter, n: number, random: () => number): GrammarExercise {
  const answer = c.readings[n - 1]
  const regular = regularReading(c, n)
  const otherNumbers = c.readings.filter((r) => r !== answer && r !== regular)
  // La forma «regular» (si es incorrecta) va siempre: es el error típico. El resto, otras cantidades.
  const options =
    regular !== answer
      ? [answer, regular, ...withDistractors(answer, otherNumbers, 3, random).slice(1)]
      : withDistractors(answer, otherNumbers, 4, random)
  const whyWrong: Record<string, string> = {}
  for (const o of options) {
    if (o === answer) continue
    const k = c.readings.indexOf(o)
    whyWrong[o] =
      o === regular
        ? `${o} sería la lectura «regular» (número + ${c.reading}), pero con ${n}${c.kanji} el sonido cambia.`
        : k >= 0
          ? `${o} es ${k + 1}${c.kanji}, no ${n}${c.kanji}.`
          : `${o} no es una lectura de ${n}${c.kanji}.`
  }
  return {
    type: 'choice',
    prompt: `¿Cómo se lee ${n}${c.kanji}?`,
    hint: c.use.split(':')[0],
    options,
    answer,
    explanation:
      c.irregular.includes(n) || answer !== regular
        ? `Es una lectura especial: ${n}${c.kanji} se lee ${answer}.`
        : `${n}${c.kanji} se lee ${answer} (${numbers[n - 1].readings[0]} + ${c.reading}).`,
    whyWrong,
  }
}

function whichCounterExercise(c: Counter, random: () => number): GrammarExercise {
  // つ sirve para casi todo y 個 se le parece: no se ofrecen juntos.
  const excluded = c.id === 'tsu' ? ['ko'] : c.id === 'ko' ? ['tsu'] : ['tsu']
  const thing = c.things[Math.floor(random() * c.things.length)]
  const others = counters.filter((o) => o.id !== c.id && !excluded.includes(o.id))
  const options = withDistractors(counterLabel(c), others.map(counterLabel), 4, random)
  const byLabel = new Map(others.map((o) => [counterLabel(o), o]))
  return {
    type: 'choice',
    prompt: `¿Qué contador usas para contar ${thing}?`,
    options,
    answer: counterLabel(c),
    explanation: `${counterLabel(c)} se usa para ${c.use}.`,
    whyWrong: Object.fromEntries(options.filter((o) => byLabel.has(o)).map((o) => [o, `${o} se usa para ${byLabel.get(o)!.use}.`])),
  }
}

const allCounterExamples = counters.flatMap((c) => c.examples)

/** Ejercicios de una lección de contadores (o de números). */
export function counterLessonExercises(lesson: CounterLesson, random = Math.random): GrammarExercise[] {
  if (lesson.id === 'cont-numeros') {
    return shuffle(numbers, random)
      .slice(0, 6)
      .map((n, i): GrammarExercise => {
        const readings = numbers.map((x) => x.readings[0])
        return i % 2 === 0
          ? { type: 'choice', prompt: `¿Cómo se lee ${n.value} (${n.kanji})?`, options: withDistractors(n.readings[0], readings, 4, random), answer: n.readings[0] }
          : {
              type: 'choice',
              prompt: `¿Qué número es «${n.readings[0]}»?`,
              options: withDistractors(String(n.value), numbers.map((x) => String(x.value)), 4, random),
              answer: String(n.value),
            }
      })
  }
  if (lesson.id === 'cont-grandes') {
    const readings = bigNumbers.map((b) => b.reading)
    const wrong: Record<number, string[]> = {
      300: ['さんひゃく', 'さんぴゃく'],
      600: ['ろくひゃく', 'ろくびゃく'],
      800: ['はちひゃく', 'はちびゃく'],
      3000: ['さんせん'],
      8000: ['はちせん'],
    }
    return shuffle(bigNumbers, random)
      .slice(0, 6)
      .map((b): GrammarExercise => ({
        type: 'choice',
        prompt: `¿Cómo se lee ${b.value} (${b.text})?`,
        options: withDistractors(b.reading, [...(wrong[b.value] ?? []), ...readings], 4, random),
        answer: b.reading,
      }))
  }

  const lessonCounters = lesson.counters.map((id) => counterById.get(id)!)
  const exercises = lessonCounters.flatMap((c) => {
    // Dos lecturas: una especial (si hay) y otra cualquiera.
    const special = shuffle(c.irregular, random)[0]
    const any = shuffle([...Array(10).keys()].map((i) => i + 1).filter((n) => n !== special), random)[0]
    const picks = special ? [special, any] : [any, shuffle([...Array(10).keys()].map((i) => i + 1).filter((n) => n !== any), random)[0]]
    const list: GrammarExercise[] = picks.map((n) => readingExercise(c, n, random))
    if (c.things.length > 1 || !['ji', 'fun', 'gatsu', 'nichi', 'sai', 'kai', 'en'].includes(c.id)) list.push(whichCounterExercise(c, random))
    const example = c.examples[0]
    list.push({
      type: 'meaning',
      text: example.text,
      options: withDistractors(example.meaning, allCounterExamples.map((e) => e.meaning), 4, random),
      answer: example.meaning,
    })
    return list
  })
  return shuffle(exercises, random)
}

/** Kanji de la misma lección y luego de la misma unidad: parecidos en tema (números con números). */
const lessonOfKanji = new Map(kanjiLessons.flatMap((l) => l.chars.map((c) => [c, l] as const)))
function kanjiNeighbors(char: string): Kanji[][] {
  const lesson = lessonOfKanji.get(char)
  const near = (l?: KanjiLesson) => (l ? l.chars.filter((c) => c !== char).map((c) => kanjiByChar.get(c)!) : [])
  const unit = lesson ? kanjiLessons.filter((l) => l.unit === lesson.unit && l !== lesson).flatMap((l) => near(l)) : []
  return [near(lesson), unit, kanjiList.filter((k) => k.char !== char)]
}

const kanjiMeaningOptions = (kanji: Kanji, random: () => number) =>
  similarOptions(kanji.meaning, { tiers: kanjiNeighbors(kanji.char), pick: (k) => k.meaning, random })

// Para explicar las opciones incorrectas de kanji: de qué kanji es cada significado y de qué palabra cada lectura.
const kanjiByMeaning = new Map(kanjiList.map((k) => [k.meaning, k]))
const exampleByReading = new Map(kanjiList.flatMap((k) => k.examples.map((e) => [e.reading, e] as const)))

/** La ficha breve de un kanji: significado y lecturas. */
export const kanjiNote = (k: Kanji) =>
  `${k.char} = «${k.meaning}»${k.on.length ? ` · on: ${k.on.join('、')}` : ''}${k.kun.length ? ` · kun: ${k.kun.join('、')}` : ''}.`

function kanjiMeaningExercise(kanji: Kanji, random: () => number): GrammarExercise {
  const options = kanjiMeaningOptions(kanji, random)
  return {
    type: 'meaning',
    text: kanji.char,
    options,
    answer: kanji.meaning,
    explanation: kanjiNote(kanji),
    whyWrong: Object.fromEntries(options.filter((o) => o !== kanji.meaning && kanjiByMeaning.has(o)).map((o) => [o, `«${o}» es el kanji ${kanjiByMeaning.get(o)!.char}.`])),
  }
}

function kanjiReadingExercise(kanji: Kanji, example: Kanji['examples'][number], random: () => number): GrammarExercise {
  const options = kanjiReadingOptions(kanji, example.reading, random)
  return {
    type: 'choice',
    prompt: `¿Cómo se lee «${example.word}» (${example.meaning})?`,
    options,
    answer: example.reading,
    explanation: `${example.word} se lee ${example.reading}. ${kanjiNote(kanji)}`,
    whyWrong: Object.fromEntries(
      options.filter((o) => o !== example.reading && exampleByReading.has(o)).map((o) => {
        const e = exampleByReading.get(o)!
        return [o, `${o} es la lectura de ${e.word} («${e.meaning}»).`]
      }),
    ),
  }
}

export const kanjiReadingOptions = (kanji: Kanji, reading: string, random: () => number) =>
  similarOptions(reading, {
    tiers: kanjiNeighbors(kanji.char).map((tier) => tier.flatMap((k) => k.examples)),
    pick: (e) => e.reading,
    closeness: (e) => Math.abs(e.reading.length - reading.length),
    random,
  })

/** Ejercicios de una lección de kanji: significado y lectura de una palabra de ejemplo. */
export function kanjiLessonExercises(lesson: KanjiLesson, random = Math.random): GrammarExercise[] {
  const exercises = lesson.chars.flatMap((char): GrammarExercise[] => {
    const kanji = kanjiByChar.get(char)!
    const example = kanji.examples[Math.floor(random() * kanji.examples.length)]
    return [kanjiMeaningExercise(kanji, random), kanjiReadingExercise(kanji, example, random)]
  })
  return shuffle(exercises, random)
}

/** Kanji para practicar la escritura al final de la lección (hasta 4). */
export function kanjiWritingItems(lesson: KanjiLesson, random = Math.random): WritingItem[] {
  return shuffle(lesson.chars, random)
    .slice(0, 4)
    .map((char) => {
      const kanji = kanjiByChar.get(char)!
      return { prompt: kanji.meaning, kana: char, parts: [char] }
    })
}

/**
 * Ejercicio con el carácter al que pertenece: al responderlo se reprograma su tarjeta SRS
 * de lectura, o la de escritura si `skill` es 'write' (escribir una palabra en kana).
 */
export type TaggedExercise = { char?: string; skill?: 'read' | 'write'; exercise: GrammarExercise }

/** Repaso de un kanji: su significado o la lectura de una de sus palabras de ejemplo. */
export function kanjiReviewExercise(char: string, random = Math.random): TaggedExercise {
  const kanji = kanjiByChar.get(char)!
  const example = kanji.examples[Math.floor(random() * kanji.examples.length)]
  const exercise: GrammarExercise = random() < 0.5 ? kanjiMeaningExercise(kanji, random) : kanjiReadingExercise(kanji, example, random)
  return { char, exercise }
}

/** Escribir un kanji a partir de su significado. */
export function kanjiWritingItem(char: string): WritingItem {
  return { prompt: kanjiByChar.get(char)!.meaning, kana: char, parts: [char] }
}

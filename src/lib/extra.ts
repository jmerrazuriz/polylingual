import { grammarByCourse } from '../courses/content.ts'
import type { GrammarExercise } from '../courses/grammar.ts'
import { counterLessons } from '../courses/ja/counters.ts'
import { kanaByChar } from '../courses/ja/kana.ts'
import { kanjiLessons } from '../courses/ja/kanji.ts'
import { lessons as kanaLessons } from '../courses/ja/lessons.ts'
import type { ProgressData } from './progress/model.ts'
import { buildReadingSession, type Question, wordsForPool } from './quiz.ts'
import { shuffle } from './random.ts'
import { counterLessonExercises, kanjiLessonExercises } from './studyExercises.ts'
import type { WritingItem } from './writing.ts'

export type ExtraLesson = { reading: Question[]; exercises: GrammarExercise[]; writing: WritingItem[] }

/** Si todavía no se completó nada, la lección extra usa las vocales. */
const STARTER = ['あ', 'い', 'う', 'え', 'お']

/**
 * Lección extra: se arma al azar con todo lo ya aprendido (kana, palabras,
 * gramática, contadores y kanji). Se puede pedir otra sin límite.
 */
export function buildExtraLesson(p: ProgressData, random = Math.random): ExtraLesson {
  const learnedChars = kanaLessons.filter((l) => p.lessons[l.id]).flatMap((l) => l.chars)
  const pool = (learnedChars.length ? learnedChars : STARTER).map((c) => kanaByChar.get(c)!)
  const hasWords = wordsForPool(pool).length > 0
  const reading = buildReadingSession({
    pool,
    types: hasWords ? ['kana-to-romaji', 'type-romaji', 'type-word'] : ['kana-to-romaji', 'type-romaji'],
    count: 6,
    random,
  })

  const grammarDone = (grammarByCourse[p.course] ?? []).filter((g) => p.grammar[g.id])
  const grammar = shuffle(
    grammarDone.flatMap((g) => g.exercises),
    random,
  ).slice(0, 2)

  const counters = shuffle(
    counterLessons.filter((l) => p.lessons[l.id]).flatMap((l) => counterLessonExercises(l, random)),
    random,
  ).slice(0, 2)

  const kanji = shuffle(
    kanjiLessons.filter((l) => p.lessons[l.id]).flatMap((l) => kanjiLessonExercises(l, random)),
    random,
  ).slice(0, 2)

  const writing = shuffle(pool, random)
    .slice(0, 2)
    .map((k): WritingItem => ({ prompt: k.romaji, kana: k.char, parts: k.parts }))

  return { reading, exercises: shuffle([...grammar, ...counters, ...kanji], random), writing }
}

import { allKana, kanaByChar } from '../courses/ja/kana.ts'
import { lessonsByScript } from '../courses/ja/lessons.ts'
import type { Script } from '../courses/ja/types.ts'
import { type Question, romajiOptions } from './quiz.ts'
import { shuffle } from './random.ts'

export type PlacementQuestion = { lessonId: string; question: Question }

/**
 * Test de nivel: 2 caracteres al azar de cada lección básica y 1 de las demás,
 * en el orden de las lecciones (de lo más fácil a lo más difícil).
 */
export function buildPlacement(script: Script, random = Math.random): PlacementQuestion[] {
  return lessonsByScript[script].flatMap((lesson) => {
    const picks = shuffle(lesson.chars, random).slice(0, lesson.group === 'basic' ? 2 : 1)
    return picks.map((char) => {
      const kana = kanaByChar.get(char)!
      const pool = allKana.filter((k) => k.script === script && k.group === kana.group)
      return { lessonId: lesson.id, question: { type: 'kana-to-romaji', kana, options: romajiOptions(kana, pool, 4, random) } }
    })
  })
}

/** Lecciones que se dan por sabidas: todas sus preguntas respondidas bien. */
export function passedLessons(results: { lessonId: string; correct: boolean }[]): string[] {
  const byLesson = new Map<string, boolean>()
  for (const { lessonId, correct } of results) byLesson.set(lessonId, (byLesson.get(lessonId) ?? true) && correct)
  return [...byLesson].filter(([, ok]) => ok).map(([id]) => id)
}

import { allKana, kanaByChar } from '../courses/ja/kana.ts'
import { kanjiList } from '../courses/ja/kanji.ts'
import { learnedThrough, lessonsByScript } from '../courses/ja/lessons.ts'
import type { Kana, KanaGroup, Script } from '../courses/ja/types.ts'
import type { ProgressData } from './progress/model.ts'
import { type Question, romajiOptions } from './quiz.ts'
import { shuffle } from './random.ts'
import { syllables } from './romaji.ts'
import { kanjiReviewExercise, kanjiWritingItem, type TaggedExercise } from './studyExercises.ts'
import { wordCardChar, wordReviewExercise } from './vocabExercises.ts'
import { wordsReadableWith } from './words.ts'
import { vocab } from '../courses/ja/vocab.ts'
import type { WritingItem } from './writing.ts'

/** Unidad: un bloque de lecciones (p. ej. «Hiragana · Básicos») con su repaso al final. */
export type Unit = { id: string; script: Script; group: KanaGroup; title: string; lessonIds: string[]; chars: string[] }

const scriptTitles: Record<Script, string> = { hiragana: 'Hiragana', katakana: 'Katakana' }
const groupTitles: Record<KanaGroup, string> = { basic: 'Básicos', dakuten: 'Dakuten', yoon: 'Combinados', extended: 'Extendidos' }

export const units: Unit[] = (Object.keys(lessonsByScript) as Script[]).flatMap((script) => {
  const lessons = lessonsByScript[script]
  const groups = [...new Set(lessons.map((l) => l.group))]
  return groups.map((group) => {
    const inGroup = lessons.filter((l) => l.group === group)
    return {
      id: `${script}-${group}`,
      script,
      group,
      title: `${scriptTitles[script]} · ${groupTitles[group]}`,
      lessonIds: inGroup.map((l) => l.id),
      chars: inGroup.flatMap((l) => l.chars),
    }
  })
})

/** Aprobar el repaso de una unidad pide 80 % de aciertos. */
export const UNIT_PASS = 0.8

export type SessionPlan = { reading: Question[]; exercises?: TaggedExercise[]; writing: WritingItem[] }

const writingItem = (kana: Kana): WritingItem => ({ prompt: kana.romaji, kana: kana.char, parts: kana.parts })

/** Repaso de unidad: 10 preguntas de lectura (con palabras) y 3 de escritura sobre todo el bloque. */
export function buildUnitReview(unit: Unit, random = Math.random): SessionPlan {
  const pool = unit.chars.map((c) => kanaByChar.get(c)!)
  const learned = learnedThrough(unit.lessonIds.at(-1)!)
  const words = shuffle(
    wordsReadableWith(learned).filter((w) => syllables(w.kana).some((s) => unit.chars.includes(s))),
    random,
  ).slice(0, 3)

  const kanaQuestions = shuffle(pool, random)
    .slice(0, 10 - words.length)
    .map((kana, i): Question =>
      i % 2 === 0 ? { type: 'kana-to-romaji', kana, options: romajiOptions(kana, pool, 4, random) } : { type: 'type-romaji', kana },
    )
  const reading = shuffle([...kanaQuestions, ...words.map((word): Question => ({ type: 'type-word', word }))], random)
  const writing = shuffle(pool, random).slice(0, 3).map(writingItem)
  return { reading, writing }
}

/** Puntos débiles: lo que más falla en lectura y en escritura, en kana y en kanji. */
export function weakItems(p: ProgressData): { read: Kana[]; write: Kana[]; kanjiRead: string[]; kanjiWrite: string[]; words: string[] } {
  const accuracy = (char: string) => {
    const s = p.kana[char]
    return s && s.readTotal > 0 ? s.readOk / s.readTotal : 1
  }
  const lapses = (char: string) => p.cards[`${char}:read`]?.lapses ?? 0
  const weakRead = (chars: string[], limit: number) =>
    chars
      .filter((c) => {
        const s = p.kana[c]
        return (s && s.readTotal >= 2 && accuracy(c) < 0.8) || lapses(c) >= 2
      })
      .sort((a, b) => accuracy(a) - accuracy(b) || lapses(b) - lapses(a))
      .slice(0, limit)

  const writeAvg = (char: string) => {
    const s = p.kana[char]
    return s && s.writeCount > 0 ? s.writeScore / s.writeCount : 5
  }
  const weakWrite = (chars: string[], limit: number) =>
    chars
      .filter((c) => writeAvg(c) < 4)
      .sort((a, b) => writeAvg(a) - writeAvg(b))
      .slice(0, limit)

  const kanaChars = allKana.map((k) => k.char)
  const kanjiChars = kanjiList.map((k) => k.char)
  return {
    read: weakRead(kanaChars, 10).map((c) => kanaByChar.get(c)!),
    write: weakWrite(kanaChars, 4).map((c) => kanaByChar.get(c)!),
    kanjiRead: weakRead(kanjiChars, 6),
    kanjiWrite: weakWrite(kanjiChars, 2),
    words: weakRead(vocab.map(wordCardChar), 6),
  }
}

/**
 * Repaso de puntos débiles: cada kana débil dos veces (reconocerlo y escribir su
 * romaji), los kanji débiles como ejercicios y la escritura floja.
 */
export function buildWeakReview(p: ProgressData, random = Math.random): SessionPlan {
  const { read, write, kanjiRead, kanjiWrite, words } = weakItems(p)
  const reading = shuffle(
    read.flatMap((kana): Question[] => {
      const pool = allKana.filter((k) => k.script === kana.script && k.group === kana.group)
      return [
        { type: 'kana-to-romaji', kana, options: romajiOptions(kana, pool, 4, random) },
        { type: 'type-romaji', kana },
      ]
    }),
    random,
  )
  return {
    reading,
    exercises: [...kanjiRead.map((c) => kanjiReviewExercise(c, random)), ...words.map((c) => wordReviewExercise(c, 'read', random))],
    writing: [...write.map(writingItem), ...kanjiWrite.map(kanjiWritingItem)],
  }
}

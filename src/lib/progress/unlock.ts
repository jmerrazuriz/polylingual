import { lessons as allLessons, lessonsByScript } from '../../courses/ja/lessons.ts'
import { VOCAB_KATA_UNLOCKED_BY, VOCAB_UNLOCKED_BY, vocabLessonsHira, vocabLessonsKata } from '../../courses/ja/vocab.ts'
import { useAccount } from '../account/store.ts'
import type { LessonResult } from './model.ts'
import { useProgress } from './store.ts'

/** El katakana se abre al terminar los básicos del hiragana (la lección «W y N»). */
export const KATAKANA_UNLOCKED_BY = 'w'

/**
 * Lecciones desbloqueadas: en cada silabario, la primera y cada una cuya anterior
 * ya se completó. Con «desbloquear todo» o como invitado (sin memoria) está todo abierto.
 */
export function unlockedLessons(lessons: Record<string, LessonResult>, unlockAll: boolean): Set<string> {
  if (unlockAll) return new Set(allLessons.map((l) => l.id))
  const unlocked = new Set<string>()
  for (const [script, list] of Object.entries(lessonsByScript)) {
    list.forEach((lesson, i) => {
      const first = i === 0 && (script === 'hiragana' || !!lessons[KATAKANA_UNLOCKED_BY])
      if (first || (i > 0 && lessons[list[i - 1].id]) || lessons[lesson.id]) unlocked.add(lesson.id)
    })
  }
  return unlocked
}

export function useUnlockedLessons(): Set<string> {
  const guest = useAccount((s) => s.status !== 'user')
  const lessons = useProgress((s) => s.lessons)
  const unlockAll = useProgress((s) => s.unlockAll)
  return unlockedLessons(lessons, guest || unlockAll)
}

/** La gramática empieza al terminar los básicos del hiragana; cada lección abre la siguiente. */
export function unlockedGrammar(
  ids: readonly string[],
  grammar: Record<string, LessonResult>,
  lessons: Record<string, LessonResult>,
  unlockAll: boolean,
): Set<string> {
  if (unlockAll) return new Set(ids)
  const unlocked = new Set<string>()
  ids.forEach((id, i) => {
    const first = i === 0 && !!lessons[KATAKANA_UNLOCKED_BY]
    if (first || (i > 0 && grammar[ids[i - 1]]) || grammar[id]) unlocked.add(id)
  })
  return unlocked
}

export function useUnlockedGrammar(ids: readonly string[]): Set<string> {
  const guest = useAccount((s) => s.status !== 'user')
  const grammar = useProgress((s) => s.grammar)
  const lessons = useProgress((s) => s.lessons)
  const unlockAll = useProgress((s) => s.unlockAll)
  return unlockedGrammar(ids, grammar, lessons, guest || unlockAll)
}

/** Los contadores se abren al terminar el hiragana (usan dakuten y combinados). */
export const COUNTERS_UNLOCKED_BY = 'yoon-4'
/** Los kanji se abren al terminar los básicos del katakana (las lecturas on van en katakana). */
export const KANJI_UNLOCKED_BY = 'kata-w'

/** Lista de lecciones en orden: la primera se abre con `gate`, las demás al completar la anterior. */
export function unlockedSequence(
  ids: readonly string[],
  lessons: Record<string, LessonResult>,
  gate: string,
  unlockAll: boolean,
): Set<string> {
  if (unlockAll) return new Set(ids)
  const unlocked = new Set<string>()
  ids.forEach((id, i) => {
    if ((i === 0 && lessons[gate]) || (i > 0 && lessons[ids[i - 1]]) || lessons[id]) unlocked.add(id)
  })
  return unlocked
}

export function useUnlockedSequence(ids: readonly string[], gate: string): Set<string> {
  const guest = useAccount((s) => s.status !== 'user')
  const lessons = useProgress((s) => s.lessons)
  const unlockAll = useProgress((s) => s.unlockAll)
  return unlockedSequence(ids, lessons, gate, guest || unlockAll)
}

const vocabHiraIds = vocabLessonsHira.map((l) => l.id)
const vocabKataIds = vocabLessonsKata.map((l) => l.id)

/** Vocabulario: las lecciones en hiragana tras el hiragana; las de katakana tras el katakana. Cada una abre la siguiente. */
export function unlockedVocab(lessons: Record<string, LessonResult>, unlockAll: boolean): Set<string> {
  return new Set([
    ...unlockedSequence(vocabHiraIds, lessons, VOCAB_UNLOCKED_BY, unlockAll),
    ...unlockedSequence(vocabKataIds, lessons, VOCAB_KATA_UNLOCKED_BY, unlockAll),
  ])
}

export function useUnlockedVocab(): Set<string> {
  const guest = useAccount((s) => s.status !== 'user')
  const lessons = useProgress((s) => s.lessons)
  const unlockAll = useProgress((s) => s.unlockAll)
  return unlockedVocab(lessons, guest || unlockAll)
}

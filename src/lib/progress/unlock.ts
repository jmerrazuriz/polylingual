import { germanUnlockedIds } from '../../courses/de/progress.ts'
import { frenchUnlockedIds } from '../../courses/fr/progress.ts'
import { italianUnlockedIds } from '../../courses/it/progress.ts'
import { lessons as allLessons, lessonsByScript } from '../../courses/ja/lessons.ts'
import {
  VOCAB_KATA_UNLOCKED_BY,
  VOCAB_N3_UNLOCKED_BY_GRAMMAR,
  VOCAB_N4_UNLOCKED_BY_GRAMMAR,
  VOCAB_UNLOCKED_BY,
  vocabLessonsHira,
  vocabLessonsKata,
  vocabLessonsN3,
  vocabLessonsN4,
} from '../../courses/ja/vocab.ts'
import { useAccount } from '../account/store.ts'
import { unlockedReadings } from '../readings.ts'
import type { LessonResult } from './model.ts'
import { useProgress } from './store.ts'

/** Desbloqueo por el recorrido de cada curso europeo (se importa aparte para no cargar sus juegos). */
const euroUnlockedIds: Record<string, typeof germanUnlockedIds> = { de: germanUnlockedIds, fr: frenchUnlockedIds, it: italianUnlockedIds }

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
  const records = useProgress((s) => s.records)
  const unlockAll = useProgress((s) => s.unlockAll)
  const course = useProgress((s) => s.course)
  // En los cursos europeos la gramática sigue el recorrido (cada lección abre la siguiente).
  const euro = euroUnlockedIds[course]
  if (euro) return euro({ lessons, grammar, records, unlockAll }, guest, 'grammar')
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
const vocabN4Ids = vocabLessonsN4.map((l) => l.id)
const vocabN3Ids = vocabLessonsN3.map((l) => l.id)

/** Lecciones en orden que se abren con una lección de gramática: la primera con ella, las demás al completar la anterior. */
function unlockedByGrammar(ids: string[], gate: string, lessons: Record<string, LessonResult>, grammar: Record<string, LessonResult>, unlockAll: boolean) {
  const out = new Set<string>()
  ids.forEach((id, i) => {
    if (unlockAll || (i === 0 && grammar[gate]) || (i > 0 && lessons[ids[i - 1]]) || lessons[id]) out.add(id)
  })
  return out
}

/**
 * Vocabulario: las lecciones N5 en hiragana tras el hiragana; las de katakana tras el katakana;
 * las N4 y N3 tras la primera lección de gramática de su nivel. En cada grupo, cada lección abre la siguiente.
 */
export function unlockedVocab(
  lessons: Record<string, LessonResult>,
  unlockAll: boolean,
  grammar: Record<string, LessonResult> = {},
): Set<string> {
  return new Set([
    ...unlockedSequence(vocabHiraIds, lessons, VOCAB_UNLOCKED_BY, unlockAll),
    ...unlockedSequence(vocabKataIds, lessons, VOCAB_KATA_UNLOCKED_BY, unlockAll),
    ...unlockedByGrammar(vocabN4Ids, VOCAB_N4_UNLOCKED_BY_GRAMMAR, lessons, grammar, unlockAll),
    ...unlockedByGrammar(vocabN3Ids, VOCAB_N3_UNLOCKED_BY_GRAMMAR, lessons, grammar, unlockAll),
  ])
}

export function useUnlockedVocab(): Set<string> {
  const guest = useAccount((s) => s.status !== 'user')
  const lessons = useProgress((s) => s.lessons)
  const unlockAll = useProgress((s) => s.unlockAll)
  const grammar = useProgress((s) => s.grammar)
  return unlockedVocab(lessons, guest || unlockAll, grammar)
}

export function useUnlockedReadings(): Set<string> {
  const guest = useAccount((s) => s.status !== 'user')
  const grammar = useProgress((s) => s.grammar)
  const unlockAll = useProgress((s) => s.unlockAll)
  return unlockedReadings(grammar, guest || unlockAll)
}

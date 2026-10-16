import { lessons as allLessons, lessonsByScript } from '../../content/lessons.ts'
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

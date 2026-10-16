import { hiraganaLessons } from '../../content/lessons.ts'
import { useAccount } from '../account/store.ts'
import type { LessonResult } from './model.ts'
import { useProgress } from './store.ts'

/**
 * Lecciones desbloqueadas: la primera, y cada una cuya anterior ya se completó.
 * Con «desbloquear todo» o como invitado (sin memoria) está todo abierto.
 */
export function unlockedLessons(lessons: Record<string, LessonResult>, unlockAll: boolean): Set<string> {
  if (unlockAll) return new Set(hiraganaLessons.map((l) => l.id))
  const unlocked = new Set<string>()
  hiraganaLessons.forEach((lesson, i) => {
    if (i === 0 || lessons[hiraganaLessons[i - 1].id] || lessons[lesson.id]) unlocked.add(lesson.id)
  })
  return unlocked
}

export function useUnlockedLessons(): Set<string> {
  const guest = useAccount((s) => s.status !== 'user')
  const lessons = useProgress((s) => s.lessons)
  const unlockAll = useProgress((s) => s.unlockAll)
  return unlockedLessons(lessons, guest || unlockAll)
}

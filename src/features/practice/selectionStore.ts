import { create } from 'zustand'
import { kanaByChar } from '../../content/kana'
import { hiraganaLessons } from '../../content/lessons'
import type { Kana } from '../../content/types'
import { useLessonProgress } from '../learn/progressStore'

type Selection = {
  /** Lecciones elegidas para practicar y jugar; null = aún no elige (se usa el valor por defecto). */
  lessonIds: string[] | null
  setLessonIds: (ids: string[]) => void
}

// Compartido entre práctica y juegos. Solo en memoria, como el resto del avance por ahora.
export const useSelection = create<Selection>((set) => ({
  lessonIds: null,
  setLessonIds: (lessonIds) => set({ lessonIds }),
}))

const DEFAULT_LESSONS = ['vocales', 'k']

/** Lecciones elegidas: lo que eligió el usuario, o las que ya completó, o las dos primeras. */
export function useSelectedLessons(): string[] {
  const chosen = useSelection((s) => s.lessonIds)
  const results = useLessonProgress((s) => s.results)
  if (chosen) return chosen
  const completed = Object.keys(results)
  return completed.length > 0 ? hiraganaLessons.filter((l) => completed.includes(l.id)).map((l) => l.id) : DEFAULT_LESSONS
}

export function kanaForLessons(lessonIds: readonly string[]): Kana[] {
  return hiraganaLessons.filter((l) => lessonIds.includes(l.id)).flatMap((l) => l.chars.map((c) => kanaByChar.get(c)!))
}

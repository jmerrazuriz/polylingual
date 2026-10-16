import { create } from 'zustand'
import { kanaByChar } from '../../content/kana'
import { hiraganaLessons } from '../../content/lessons'
import type { Kana } from '../../content/types'
import { useAccount } from '../../lib/account/store'
import { useUnlockedLessons } from '../../lib/progress/unlock'

type Selection = {
  /** Lecciones elegidas para practicar y jugar; null = aún no elige (se usa el valor por defecto). */
  lessonIds: string[] | null
  setLessonIds: (ids: string[]) => void
}

// Compartido entre práctica y juegos. No se guarda en la cuenta: es una preferencia de la visita.
export const useSelection = create<Selection>((set) => ({
  lessonIds: null,
  setLessonIds: (lessonIds) => set({ lessonIds }),
}))

const DEFAULT_LESSONS = ['vocales', 'k']

/**
 * Lecciones elegidas (solo entre las desbloqueadas). Por defecto: todo lo
 * desbloqueado con cuenta; como invitado (todo abierto), las dos primeras.
 */
export function useSelectedLessons(): { selected: string[]; unlocked: Set<string> } {
  const chosen = useSelection((s) => s.lessonIds)
  const guest = useAccount((s) => s.status !== 'user')
  const unlocked = useUnlockedLessons()
  const fallback = guest ? DEFAULT_LESSONS : hiraganaLessons.map((l) => l.id)
  return { selected: (chosen ?? fallback).filter((id) => unlocked.has(id)), unlocked }
}

export function kanaForLessons(lessonIds: readonly string[]): Kana[] {
  return hiraganaLessons.filter((l) => lessonIds.includes(l.id)).flatMap((l) => l.chars.map((c) => kanaByChar.get(c)!))
}

import { create } from 'zustand'

type LessonProgress = {
  /** Mejor resultado del repaso final por lección (aciertos / total). */
  results: Record<string, { correct: number; total: number }>
  complete: (lessonId: string, correct: number, total: number) => void
}

// Solo en memoria por ahora: se pierde al recargar. En la fase 5 se guardará en
// Firestore para usuarios con cuenta (los invitados seguirán sin memoria).
export const useLessonProgress = create<LessonProgress>((set) => ({
  results: {},
  complete: (lessonId, correct, total) =>
    set((state) => {
      const prev = state.results[lessonId]
      if (prev && prev.correct / prev.total >= correct / total) return state
      return { results: { ...state.results, [lessonId]: { correct, total } } }
    }),
}))

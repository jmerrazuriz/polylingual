import { create } from 'zustand'

type Records = {
  /** Mejor resultado por juego y selección de grupos. */
  best: Record<string, number>
  /** Guarda el resultado y devuelve true si es un récord nuevo. */
  submit: (key: string, value: number, lowerIsBetter?: boolean) => boolean
}

// Solo en memoria por ahora; se guardará con las cuentas (fase 5).
export const useRecords = create<Records>((set, get) => ({
  best: {},
  submit: (key, value, lowerIsBetter = false) => {
    const prev = get().best[key]
    const isRecord = prev === undefined || (lowerIsBetter ? value < prev : value > prev)
    if (isRecord) set((s) => ({ best: { ...s.best, [key]: value } }))
    return isRecord
  },
}))

export const recordKey = (game: string, lessonIds: readonly string[]) => `${game}:${[...lessonIds].sort().join(',')}`

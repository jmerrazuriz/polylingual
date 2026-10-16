import { create } from 'zustand'

export type Toast = { id: number; icon: string; title: string; text: string }

type Toasts = {
  toasts: Toast[]
  show: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

const VISIBLE_MS = 4500
let nextId = 1

/** Avisos breves (p. ej. «¡Nuevo logro!») que aparecen sobre la barra de navegación. */
export const useToasts = create<Toasts>((set, get) => ({
  toasts: [],
  show: (toast) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => get().dismiss(id), VISIBLE_MS)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

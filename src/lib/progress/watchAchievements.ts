import { now } from '../time.ts'
import { useToasts } from '../toasts.ts'
import { newAchievements } from './achievements.ts'
import { progressSnapshot, useProgress } from './store.ts'

let started = false

/**
 * Revisa los logros cada vez que cambia el progreso y avisa de los nuevos.
 * Al cargar el progreso guardado no hay avisos: esos logros ya vienen marcados.
 */
export function watchAchievements() {
  if (started) return
  started = true
  useProgress.subscribe(() => {
    const t = now()
    const fresh = newAchievements(progressSnapshot(), t)
    if (fresh.length === 0) return
    useProgress.getState().unlockAchievements(
      fresh.map((a) => a.id),
      t,
    )
    for (const a of fresh) useToasts.getState().show({ icon: a.icon, title: '¡Nuevo logro!', text: `${a.title}: ${a.description}` })
  })
}

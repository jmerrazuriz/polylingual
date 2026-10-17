import type { ItemStatus, PathItem } from '../../lib/path.ts'
import type { ProgressData } from '../../lib/progress/model.ts'
import { germanPathItems } from './path.ts'

// Desbloqueo del alemán: lineal por el recorrido. Cada lección se abre al completar la
// anterior. El simulacro de cada nivel es la meta, pero no bloquea el nivel siguiente:
// lo que viene después de un simulacro se abre al terminar la lección anterior a él.

export const goethePassedKey = (level: string) => `goethe-${level.toLowerCase()}:aprobado`

type Done = Pick<ProgressData, 'lessons' | 'grammar' | 'records'>

export function germanItemDone(p: Done, i: PathItem): boolean {
  if (i.kind === 'grammar') return !!p.grammar[i.id]
  if (i.kind === 'exam') return !!p.records[goethePassedKey(i.id)]
  return !!p.lessons[i.id]
}

/** Estado de cada elemento: hecho, abierto (el anterior está hecho) o bloqueado. */
export function germanItemStatus(p: Done & { unlockAll?: boolean }, everythingOpen: boolean): (i: PathItem) => ItemStatus {
  const open = new Set<string>()
  let prev: PathItem | undefined
  for (const item of germanPathItems) {
    if (everythingOpen || p.unlockAll || !prev || germanItemDone(p, prev)) open.add(`${item.kind}:${item.id}`)
    if (item.kind !== 'exam') prev = item
  }
  return (i) => (germanItemDone(p, i) ? 'done' : open.has(`${i.kind}:${i.id}`) ? 'open' : 'locked')
}

/** Ids abiertos (o hechos) de un tipo, para las listas de gramática, palabras y textos. */
export function germanUnlockedIds(p: Done & { unlockAll?: boolean }, everythingOpen: boolean, kind: PathItem['kind']): Set<string> {
  const status = germanItemStatus(p, everythingOpen)
  return new Set(germanPathItems.filter((i) => i.kind === kind && status(i) !== 'locked').map((i) => i.id))
}

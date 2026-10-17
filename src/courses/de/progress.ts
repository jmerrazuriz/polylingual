import type { ItemStatus, PathItem } from '../../lib/path.ts'
import type { ProgressData } from '../../lib/progress/model.ts'
import { germanPathItems } from './path.ts'

// Desbloqueo del alemán: lineal por el recorrido. Cada lección se abre al completar la
// anterior (gramática, palabras, textos y, al final de cada nivel, el simulacro).

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
  germanPathItems.forEach((item, idx) => {
    const prev = germanPathItems[idx - 1]
    if (everythingOpen || p.unlockAll || idx === 0 || germanItemDone(p, prev)) open.add(`${item.kind}:${item.id}`)
  })
  return (i) => (germanItemDone(p, i) ? 'done' : open.has(`${i.kind}:${i.id}`) ? 'open' : 'locked')
}

/** Ids abiertos (o hechos) de un tipo, para las listas de gramática, palabras y textos. */
export function germanUnlockedIds(p: Done & { unlockAll?: boolean }, everythingOpen: boolean, kind: PathItem['kind']): Set<string> {
  const status = germanItemStatus(p, everythingOpen)
  return new Set(germanPathItems.filter((i) => i.kind === kind && status(i) !== 'locked').map((i) => i.id))
}

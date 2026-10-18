import type { ItemStatus, PathItem } from '../../lib/path.ts'
import type { ProgressData } from '../../lib/progress/model.ts'
import { frenchPathItems } from './path.ts'

// Desbloqueo del francés: lineal por el recorrido, como en alemán. Cada lección se abre al
// completar la anterior; el simulacro DELF de cada nivel es la meta, pero no bloquea el siguiente.

export const delfPassedKey = (level: string) => `${level === 'C1' || level === 'C2' || level === 'c1' || level === 'c2' ? 'dalf' : 'delf'}-${level.toLowerCase()}:aprobado`

type Done = Pick<ProgressData, 'lessons' | 'grammar' | 'records'>

export function frenchItemDone(p: Done, i: PathItem): boolean {
  if (i.kind === 'grammar') return !!p.grammar[i.id]
  if (i.kind === 'exam') return !!p.records[delfPassedKey(i.id)]
  return !!p.lessons[i.id]
}

/** Estado de cada elemento: hecho, abierto (el anterior está hecho) o bloqueado. */
export function frenchItemStatus(p: Done & { unlockAll?: boolean }, everythingOpen: boolean): (i: PathItem) => ItemStatus {
  const open = new Set<string>()
  let prev: PathItem | undefined
  for (const item of frenchPathItems) {
    if (everythingOpen || p.unlockAll || !prev || frenchItemDone(p, prev)) open.add(`${item.kind}:${item.id}`)
    if (item.kind !== 'exam') prev = item
  }
  return (i) => (frenchItemDone(p, i) ? 'done' : open.has(`${i.kind}:${i.id}`) ? 'open' : 'locked')
}

/** Ids abiertos (o hechos) de un tipo, para las listas de gramática, palabras y textos. */
export function frenchUnlockedIds(p: Done & { unlockAll?: boolean }, everythingOpen: boolean, kind: PathItem['kind']): Set<string> {
  const status = frenchItemStatus(p, everythingOpen)
  return new Set(frenchPathItems.filter((i) => i.kind === kind && status(i) !== 'locked').map((i) => i.id))
}

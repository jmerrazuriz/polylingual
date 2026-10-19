import type { ItemStatus, PathItem } from '../../lib/path.ts'
import type { ProgressData } from '../../lib/progress/model.ts'
import { cilsPassedKey } from './exams.ts'
import { italianPathItems } from './path.ts'

// Desbloqueo del italiano: lineal por el recorrido, como en alemán y francés. Cada lección se abre
// al completar la anterior; el simulacro CILS de cada nivel es la meta, pero no bloquea el siguiente.

type Done = Pick<ProgressData, 'lessons' | 'grammar' | 'records'>

export function italianItemDone(p: Done, i: PathItem): boolean {
  if (i.kind === 'grammar') return !!p.grammar[i.id]
  if (i.kind === 'exam') return !!p.records[cilsPassedKey(i.id)]
  return !!p.lessons[i.id]
}

/** Estado de cada elemento: hecho, abierto (el anterior está hecho) o bloqueado. */
export function italianItemStatus(p: Done & { unlockAll?: boolean }, everythingOpen: boolean): (i: PathItem) => ItemStatus {
  const open = new Set<string>()
  let prev: PathItem | undefined
  for (const item of italianPathItems) {
    if (everythingOpen || p.unlockAll || !prev || italianItemDone(p, prev)) open.add(`${item.kind}:${item.id}`)
    if (item.kind !== 'exam') prev = item
  }
  return (i) => (italianItemDone(p, i) ? 'done' : open.has(`${i.kind}:${i.id}`) ? 'open' : 'locked')
}

/** Ids abiertos (o hechos) de un tipo, para las listas de gramática, palabras y textos. */
export function italianUnlockedIds(p: Done & { unlockAll?: boolean }, everythingOpen: boolean, kind: PathItem['kind']): Set<string> {
  const status = italianItemStatus(p, everythingOpen)
  return new Set(italianPathItems.filter((i) => i.kind === kind && status(i) !== 'locked').map((i) => i.id))
}

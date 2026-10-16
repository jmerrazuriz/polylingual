import { useAccount } from '../../lib/account/store'
import { useProgress } from '../../lib/progress/store'
import type { Unit } from '../../lib/units'

export type UnitStatus = 'locked' | 'open' | 'passed'

/** Una unidad se abre al completar todas sus lecciones (o con todo desbloqueado / como invitado). */
export function useUnitStatus(unit: Unit): UnitStatus {
  const lessons = useProgress((s) => s.lessons)
  const units = useProgress((s) => s.units)
  const unlockAll = useProgress((s) => s.unlockAll)
  const guest = useAccount((s) => s.status !== 'user')
  if (units[unit.id]) return 'passed'
  return guest || unlockAll || unit.lessonIds.every((id) => lessons[id]) ? 'open' : 'locked'
}

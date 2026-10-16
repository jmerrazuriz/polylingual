import { Link } from 'react-router'
import type { Unit } from '../../lib/units'
import { useProgress } from '../../lib/progress/store'
import { useUnitStatus } from './unitStatus'

/** Tarjeta del repaso de unidad, al final de cada bloque de lecciones. */
export function UnitCard({ unit }: { unit: Unit }) {
  const status = useUnitStatus(unit)
  const result = useProgress((s) => s.units[unit.id])
  const body = (
    <>
      <span className="text-2xl" aria-hidden>
        {status === 'passed' ? '🏅' : status === 'open' ? '🧩' : '🔒'}
      </span>
      <span className="flex-1">
        <span className="block font-extrabold">Repaso de la unidad</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {status === 'passed'
            ? `Aprobada · ${result.correct}/${result.total}`
            : status === 'open'
              ? 'Mezcla todo lo del bloque. Apruébalo con 80 %.'
              : 'Se abre al completar las lecciones de arriba.'}
        </span>
      </span>
    </>
  )
  const className = 'flex items-center gap-3 rounded-2xl border-2 border-dashed p-3 sm:col-span-2'
  return status === 'locked' ? (
    <div className={`${className} border-slate-200 opacity-60 dark:border-slate-800`}>{body}</div>
  ) : (
    <Link to={`/repaso/unidad/${unit.id}`} className={`${className} border-accent/40 hover:border-accent`}>
      {body}
    </Link>
  )
}

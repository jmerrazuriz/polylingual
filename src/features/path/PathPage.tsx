import { useState } from 'react'
import { Link } from 'react-router'
import { useAccount } from '../../lib/account/store'
import { japanesePath, type PathStop, pathStatus, type StopStatus } from '../../lib/path'
import { progressSnapshot, useProgress } from '../../lib/progress/store'
import { LearnTabs } from '../learn/LearnTabs'

/** Desplazamiento horizontal de cada parada: el camino zigzaguea. */
const OFFSETS = [0, 1, 2, 1, 0, -1, -2, -1]

const stopStyle: Record<StopStatus, string> = {
  done: 'bg-emerald-500 text-white border-emerald-600',
  current: 'bg-accent text-white border-red-700 ring-8 ring-accent/20 scale-110',
  open: 'bg-white text-ink border-slate-300 dark:bg-slate-900 dark:text-white dark:border-slate-600',
  locked: 'bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-800 dark:border-slate-700',
}

const kindIcon = { kana: 'あ', grammar: '文', counters: '数', kanji: '字', vocab: '語', unit: '🧩' } as const

export function PathPage() {
  // Se vuelve a calcular cuando cambia cualquier progreso relevante.
  useProgress((s) => s.lessons)
  useProgress((s) => s.grammar)
  useProgress((s) => s.units)
  useProgress((s) => s.unlockAll)
  const guest = useAccount((s) => s.status !== 'user')
  const { stops, current, itemStatus } = pathStatus(progressSnapshot(), guest)
  const [open, setOpen] = useState<string | null>(null)
  const selected = open ?? current?.id ?? null

  const doneStops = [...stops.values()].filter((s) => s === 'done').length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tu recorrido por el japonés, unidad por unidad. Cada parada agrupa unas pocas lecciones. {doneStops}/{stops.size} paradas
          completadas.
        </p>
      </header>

      <LearnTabs current="recorrido" />

      <div className="grid grid-cols-2 gap-2">
        <Link to="/hoy" className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 hover:border-accent dark:border-slate-800 dark:bg-slate-900">
          <span className="text-2xl" aria-hidden>
            ☀️
          </span>
          <span className="text-sm font-bold">Lección de hoy</span>
        </Link>
        <Link to="/extra" className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 hover:border-accent dark:border-slate-800 dark:bg-slate-900">
          <span className="text-2xl" aria-hidden>
            ♾️
          </span>
          <span className="text-sm font-bold">Lección extra (sin límite)</span>
        </Link>
      </div>

      {japanesePath.map((unit, u) => {
        const unitDone = unit.stops.every((s) => stops.get(s.id) === 'done')
        let offsetIndex = u * 3
        return (
          <section key={unit.id} className="flex flex-col items-center gap-4">
            <div
              className={`flex w-full items-center gap-3 rounded-2xl p-4 ${
                unitDone ? 'bg-emerald-500 text-white' : 'bg-ink text-white'
              }`}
            >
              <span lang="ja" className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-white/15 px-1 font-jp text-xl">
                {unit.icon}
              </span>
              <span className="flex-1">
                <span className="block text-xs font-bold uppercase opacity-80">Unidad {u + 1}</span>
                <span className="block text-lg font-extrabold">{unit.title}</span>
              </span>
              <span className="text-sm font-bold">
                {unit.stops.filter((s) => stops.get(s.id) === 'done').length}/{unit.stops.length}
              </span>
            </div>

            <ol className="flex w-full flex-col items-center gap-5 py-2">
              {unit.stops.map((s) => {
                const status = stops.get(s.id)!
                const offset = OFFSETS[offsetIndex++ % OFFSETS.length]
                const isReview = s.items[0].kind === 'unit'
                return (
                  <li key={s.id} className="flex w-full flex-col items-center">
                    <button
                      onClick={() => setOpen(selected === s.id ? '' : s.id)}
                      aria-expanded={selected === s.id}
                      aria-label={`${s.title} (${statusLabel[status]})`}
                      style={{ transform: `translateX(${offset * 2.75}rem)` }}
                      className="flex flex-col items-center gap-1"
                    >
                      <span
                        className={`flex h-16 w-16 items-center justify-center rounded-full border-b-4 font-jp text-2xl font-bold shadow-sm transition ${stopStyle[status]}`}
                      >
                        {status === 'done' ? '✓' : status === 'locked' ? '🔒' : isReview ? '🧩' : kindIcon[s.items[0].kind]}
                      </span>
                      {status === 'current' && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-extrabold text-white">¡Sigue aquí!</span>
                      )}
                    </button>
                    {selected === s.id && <StopPanel stop={s} itemStatus={itemStatus} />}
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}

      <p className="text-center text-sm text-slate-500">¿Terminaste todo? Sigue con la lección extra: se arma sola con lo que ya sabes.</p>
    </div>
  )
}

const statusLabel: Record<StopStatus, string> = { done: 'completada', current: 'actual', open: 'abierta', locked: 'bloqueada' }

/** Las lecciones de una parada, con su estado y botón para empezar o repetir. */
function StopPanel({ stop, itemStatus }: { stop: PathStop; itemStatus: ReturnType<typeof pathStatus>['itemStatus'] }) {
  return (
    <div className="mt-3 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <ul className="flex flex-col gap-2">
        {stop.items.map((i) => {
          const status = itemStatus(i)
          return (
            <li key={i.id} className="flex items-center gap-3">
              <span lang="ja" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-jp dark:bg-slate-800" aria-hidden>
                {status === 'done' ? '✓' : kindIcon[i.kind]}
              </span>
              <span className="flex-1 text-sm font-bold">{i.title}</span>
              {status === 'locked' ? (
                <span className="text-xs text-slate-400">🔒 Bloqueada</span>
              ) : (
                <Link
                  to={i.to}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    status === 'done' ? 'border border-slate-300 dark:border-slate-700' : 'bg-ink text-white'
                  }`}
                >
                  {status === 'done' ? 'Repetir' : 'Empezar'}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

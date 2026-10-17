import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useAccount } from '../../lib/account/store'
import { coursePath } from '../../lib/coursePath'
import { type ItemStatus, type PathItem, type PathStop, type PathUnit, pathStatusFor, type StopStatus } from '../../lib/path'
import { hasNotStarted } from '../../lib/pathPlacement'
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

const kindIcon = { kana: 'あ', grammar: '文', counters: '数', kanji: '字', vocab: '語', reading: '読', exam: '📝', unit: '🧩' } as const
/** En alemán: G de gramática, W de Wörter (palabras), T de textos. */
const germanIcon = { ...kindIcon, grammar: 'G', vocab: 'W', reading: 'T' } as const

export function PathPage() {
  // Se vuelve a calcular cuando cambia cualquier progreso relevante.
  useProgress((s) => s.lessons)
  useProgress((s) => s.grammar)
  useProgress((s) => s.units)
  useProgress((s) => s.records)
  useProgress((s) => s.unlockAll)
  const guest = useAccount((s) => s.status !== 'user')
  const course = useProgress((s) => s.course)
  const cp = coursePath(course)
  const icons = course === 'de' ? germanIcon : kindIcon
  const { stops, current, itemStatus } = pathStatusFor(cp.units, cp.itemStatus(progressSnapshot(), guest))
  const [open, setOpen] = useState<string | null>(null)
  const selected = open ?? current?.id ?? null

  // El nivel de la parada actual se muestra abierto; los demás, plegados (se pueden abrir).
  // Sin parada actual: el primer nivel que aún no tiene lecciones (curso en preparación) o el último.
  const currentLevel = (
    cp.levels.find((l) => l.units.some((unit) => unit.stops.some((s) => s.id === current?.id))) ??
    cp.levels.find((l) => l.units.length === 0) ??
    cp.levels.at(-1)!
  ).level
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([currentLevel]))
  const toggleLevel = (level: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(level)) next.delete(level)
      else next.add(level)
      return next
    })

  // Al abrir el recorrido, ir directo a la parada actual.
  const currentRef = useRef<HTMLLIElement>(null)
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  const doneStops = [...stops.values()].filter((s) => s === 'done').length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {cp.intro} {doneStops}/{stops.size} paradas completadas.
        </p>
      </header>

      <LearnTabs current="recorrido" />

      {cp.hasPlacement && hasNotStarted(progressSnapshot()) && <PlacementOffer firstLessonTo={cp.firstLessonTo} />}

      {cp.dailyLessons && (
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
      )}

      {cp.levels.map((lvl) => {
        const levelStops = lvl.units.flatMap((unit) => unit.stops)
        const levelDone = levelStops.filter((s) => stops.get(s.id) === 'done').length
        const isOpen = expanded.has(lvl.level)
        const isCurrent = lvl.level === currentLevel
        return (
          <section key={lvl.level} className="flex flex-col gap-6">
            <button
              onClick={() => toggleLevel(lvl.level)}
              aria-expanded={isOpen}
              className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left ${
                isCurrent ? 'border-accent bg-accent/5' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <span className="flex h-12 w-14 items-center justify-center rounded-xl bg-ink text-lg font-extrabold text-white">{lvl.level}</span>
              <span className="flex-1">
                <span className="block text-lg font-extrabold">
                  {lvl.title}
                  {isCurrent && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 align-middle text-xs text-white">Estás aquí</span>}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {lvl.units.length} unidades · {levelDone}/{levelStops.length} paradas completadas
                </span>
              </span>
              <span className="text-xl text-slate-400" aria-hidden>
                {isOpen ? '▾' : '▸'}
              </span>
            </button>
            {isOpen && lvl.goal && <p className="-mt-3 px-1 text-sm text-slate-600 dark:text-slate-400">Meta del nivel: {lvl.goal}</p>}
            {isOpen && lvl.units.length === 0 && (
              <p className="rounded-2xl border-2 border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-700">
                Este nivel está en preparación. Sus lecciones aparecerán aquí.
              </p>
            )}
            {isOpen && lvl.units.map((unit, j) => renderUnit(unit, lvl.firstIndex + j))}
          </section>
        )
      })}

      {cp.dailyLessons && (
        <p className="text-center text-sm text-slate-500">¿Terminaste todo? Sigue con la lección extra: se arma sola con lo que ya sabes.</p>
      )}
    </div>
  )

  function renderUnit(unit: PathUnit, u: number) {
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
              <li key={s.id} ref={status === 'current' ? currentRef : undefined} className="flex w-full scroll-mt-24 flex-col items-center">
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
                    {status === 'done' ? '✓' : status === 'locked' ? '🔒' : isReview ? '🧩' : icons[s.items[0].kind]}
                  </span>
                  {status === 'current' && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-extrabold text-white">¡Sigue aquí!</span>
                  )}
                </button>
                {selected === s.id && <StopPanel stop={s} itemStatus={itemStatus} icons={icons} />}
              </li>
            )
          })}
        </ol>
      </section>
    )
  }
}


const statusLabel: Record<StopStatus, string> = { done: 'completada', current: 'actual', open: 'abierta', locked: 'bloqueada' }

/** Las lecciones de una parada, con su estado y botón para empezar o repetir. */
function StopPanel({ stop, itemStatus, icons }: { stop: PathStop; itemStatus: (i: PathItem) => ItemStatus; icons: Record<PathItem['kind'], string> }) {
  return (
    <div className="mt-3 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <ul className="flex flex-col gap-2">
        {stop.items.map((i) => {
          const status = itemStatus(i)
          return (
            <li key={i.id} className="flex items-center gap-3">
              <span lang="ja" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-jp dark:bg-slate-800" aria-hidden>
                {status === 'done' ? '✓' : icons[i.kind]}
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

/** Para quien no empezó el recorrido: hacer el test de nivelación o partir de cero. */
function PlacementOffer({ firstLessonTo }: { firstLessonTo: string | null }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border-2 border-accent/40 bg-accent/5 p-4 sm:flex-row sm:items-center">
      <span className="text-4xl" aria-hidden>
        🧭
      </span>
      <span className="flex-1">
        <span className="block text-lg font-extrabold">¿Ya sabes algo de japonés?</span>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Haz el test de nivelación y desbloquea la parte del recorrido que ya dominas. O empieza desde la primera lección.
        </span>
      </span>
      <span className="flex flex-wrap gap-2">
        <Link to="/nivelacion" className="rounded-full bg-ink px-5 py-2.5 font-bold text-white hover:opacity-90">
          Hacer el test
        </Link>
        {firstLessonTo && (
          <Link to={firstLessonTo} className="rounded-full border border-slate-300 px-5 py-2.5 font-bold dark:border-slate-700">
            Empezar de cero
          </Link>
        )}
      </span>
    </section>
  )
}

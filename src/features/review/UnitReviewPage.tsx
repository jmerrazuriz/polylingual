import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { useProgress } from '../../lib/progress/store'
import { summarize } from '../../lib/sessionSummary'
import { buildUnitReview, UNIT_PASS, type Unit, units } from '../../lib/units'
import { type MixedResult, MixedSession } from '../practice/MixedSession'
import { useUnitStatus } from './unitStatus'
import { ResultStats } from './ResultStats'

export function UnitReviewRoute() {
  const { unitId } = useParams()
  const unit = units.find((u) => u.id === unitId)
  if (!unit) return <ComingSoon title="Unidad no encontrada" />
  return <UnitReview key={unit.id} unit={unit} />
}

function UnitReview({ unit }: { unit: Unit }) {
  const status = useUnitStatus(unit)
  const complete = useProgress((s) => s.completeUnit)
  const [plan, setPlan] = useState<ReturnType<typeof buildUnitReview> | null>(null)
  const [result, setResult] = useState<MixedResult | null>(null)
  const back = unit.script === 'katakana' ? '/aprender?silabario=katakana' : '/aprender?silabario=hiragana'

  if (status === 'locked') {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <span className="text-5xl" aria-hidden>
          🔒
        </span>
        <h1 className="text-2xl font-extrabold">Repaso de {unit.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">Se abre cuando completes todas las lecciones de esta unidad.</p>
        <Link to={back} className="font-semibold text-accent hover:underline">
          Ver lecciones
        </Link>
      </section>
    )
  }

  if (!plan) {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-5 py-8 text-center">
        <span className="text-6xl" aria-hidden>
          🧩
        </span>
        <p className="text-sm font-bold text-slate-500 uppercase">Repaso de unidad</p>
        <h1 className="text-2xl font-extrabold">{unit.title}</h1>
        <p className="font-jp text-3xl tracking-widest">{unit.chars.slice(0, 15).join('')}…</p>
        <p className="text-slate-600 dark:text-slate-400">
          Mezcla todo lo de la unidad: lectura, palabras y escritura de memoria. Con {Math.round(UNIT_PASS * 100)} % de aciertos
          la unidad queda aprobada.
        </p>
        <button onClick={() => setPlan(buildUnitReview(unit))} className="rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
          Empezar
        </button>
      </section>
    )
  }

  if (!result) {
    return (
      <MixedSession
        reading={plan.reading}
        writing={plan.writing}
        labels={{ reading: `${unit.title} · lectura`, writing: `${unit.title} · escritura` }}
        onFinish={(r) => {
          const s = summarize(r)
          const total = r.reading.length + r.writing.length
          const correct = Math.round(s.ratio * total)
          if (s.ratio >= UNIT_PASS) complete(unit.id, correct, total)
          setResult(r)
        }}
      />
    )
  }

  const summary = summarize(result)
  const passed = summary.ratio >= UNIT_PASS
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <span className="text-6xl" aria-hidden>
        {passed ? '🏅' : '💪'}
      </span>
      <h1 className="text-2xl font-extrabold">{passed ? '¡Unidad aprobada!' : 'Casi: repasa un poco más'}</h1>
      <p className="text-slate-600 dark:text-slate-400">
        {Math.round(summary.ratio * 100)} % de aciertos{passed ? '' : ` (se necesita ${Math.round(UNIT_PASS * 100)} %)`}.
      </p>
      <ResultStats summary={summary} />
      <SaveProgressPrompt />
      <div className="flex flex-wrap justify-center gap-3">
        <Link to={back} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
          Lecciones
        </Link>
        <button
          onClick={() => {
            setResult(null)
            setPlan(buildUnitReview(unit))
          }}
          className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90"
        >
          Otra vez
        </button>
      </div>
    </section>
  )
}

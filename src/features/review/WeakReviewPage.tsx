import { useState } from 'react'
import { Link } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { progressSnapshot } from '../../lib/progress/store'
import { summarize } from '../../lib/sessionSummary'
import { buildWeakReview } from '../../lib/units'
import { type MixedResult, MixedSession } from '../practice/MixedSession'
import { ResultStats } from './ResultStats'

/** Repaso de puntos débiles: lo que más se falla en lectura y lo peor escrito. */
export function WeakReviewPage() {
  const [plan, setPlan] = useState(() => buildWeakReview(progressSnapshot()))
  const [result, setResult] = useState<MixedResult | null>(null)

  if (plan.reading.length + (plan.exercises?.length ?? 0) + plan.writing.length === 0) {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <span className="text-6xl" aria-hidden>
          💪
        </span>
        <h1 className="text-2xl font-extrabold">Sin puntos débiles por ahora</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Aquí aparecerán los caracteres que más te cuesta leer o escribir. Sigue practicando y vuelve más tarde.
        </p>
        <Link to="/practicar" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Practicar
        </Link>
      </section>
    )
  }

  if (!result) {
    return (
      <MixedSession
        reading={plan.reading}
        exercises={plan.exercises}
        writing={plan.writing}
        writingHelp="guide"
        labels={{ reading: 'Puntos débiles · lectura', exercises: 'Puntos débiles · kanji', writing: 'Puntos débiles · escritura' }}
        onFinish={setResult}
      />
    )
  }

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <span className="text-6xl" aria-hidden>
        🎯
      </span>
      <h1 className="text-2xl font-extrabold">Repaso de puntos débiles terminado</h1>
      <ResultStats summary={summarize(result)} />
      <SaveProgressPrompt />
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/progreso" className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
          Ver progreso
        </Link>
        <button
          onClick={() => {
            setResult(null)
            setPlan(buildWeakReview(progressSnapshot()))
          }}
          className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90"
        >
          Otra vez
        </button>
      </div>
    </section>
  )
}

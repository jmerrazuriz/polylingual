import { useState } from 'react'
import { Link } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { nextDue } from '../../lib/progress/srs'
import { useProgress } from '../../lib/progress/store'
import { buildReview, describeDue } from '../../lib/review'
import { now } from '../../lib/time'
import { summarize } from '../../lib/sessionSummary'
import { type MixedResult, MixedSession } from '../practice/MixedSession'
import { ResultStats } from './ResultStats'

export function ReviewPage() {
  // El plan se arma una vez al entrar: las respuestas reprograman las tarjetas mientras se repasa.
  const [plan] = useState(() => buildReview(useProgress.getState().cards, now()))
  const [result, setResult] = useState<MixedResult | null>(null)
  const cards = useProgress((s) => s.cards)

  if (plan.reading.length + plan.exercises.length + plan.writing.length === 0) {
    const next = nextDue(cards, now())
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <span className="text-6xl" aria-hidden>
          ☀️
        </span>
        <h1 className="text-2xl font-extrabold">¡Estás al día!</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {next
            ? `No tienes repasos pendientes. El próximo es ${describeDue(next, now())}.`
            : 'Todavía no tienes repasos. Completa una lección y sus caracteres aparecerán aquí.'}
        </p>
        <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Ir a las lecciones
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
        labels={{ reading: 'Repaso de lectura', exercises: 'Repaso de kanji', writing: 'Repaso de escritura' }}
        onFinish={setResult}
      />
    )
  }

  const next = nextDue(cards, now())
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <span className="text-6xl" aria-hidden>
        ✅
      </span>
      <h1 className="text-2xl font-extrabold">Repaso terminado</h1>
      <ResultStats summary={summarize(result)} />
      {next && <p className="text-sm text-slate-500">Tu próximo repaso es {describeDue(next, now())}.</p>}
      <SaveProgressPrompt />
      <Link to="/" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Volver al inicio
      </Link>
    </section>
  )
}

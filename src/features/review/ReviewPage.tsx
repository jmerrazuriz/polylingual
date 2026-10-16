import { useState } from 'react'
import { Link } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { nextDue } from '../../lib/progress/srs'
import { useProgress } from '../../lib/progress/store'
import { buildReview, describeDue } from '../../lib/review'
import { now } from '../../lib/time'
import { type Answer, ReadingSession } from '../practice/ReadingSession'
import { type WritingResult, WritingSession } from '../practice/WritingSession'

type Phase = 'reading' | 'writing' | 'done'

export function ReviewPage() {
  // El plan se arma una vez al entrar: las respuestas reprograman las tarjetas mientras se repasa.
  const [plan] = useState(() => buildReview(useProgress.getState().cards, now()))
  const [phase, setPhase] = useState<Phase>(plan.reading.length ? 'reading' : plan.writing.length ? 'writing' : 'done')
  const [reading, setReading] = useState<Answer[]>([])
  const [writing, setWriting] = useState<WritingResult[]>([])
  const cards = useProgress((s) => s.cards)

  const total = plan.reading.length + plan.writing.length

  if (total === 0) {
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

  if (phase === 'reading') {
    return (
      <div className="flex flex-col gap-3">
        <PhaseTitle text={`Repaso de lectura · ${plan.reading.length}`} />
        <ReadingSession
          questions={plan.reading}
          onFinish={(answers) => {
            setReading(answers)
            setPhase(plan.writing.length ? 'writing' : 'done')
          }}
        />
      </div>
    )
  }

  if (phase === 'writing') {
    return (
      <div className="flex flex-col gap-3">
        <PhaseTitle text={`Repaso de escritura · ${plan.writing.length}`} />
        <WritingSession
          items={plan.writing}
          help="memory"
          onFinish={(results) => {
            setWriting(results)
            setPhase('done')
          }}
        />
      </div>
    )
  }

  const readOk = reading.filter((a) => a.correct).length
  const stars = writing.filter((w) => w.score !== null)
  const avg = stars.length ? stars.reduce((n, w) => n + w.score!, 0) / stars.length : null
  const next = nextDue(cards, now())

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <span className="text-6xl" aria-hidden>
        ✅
      </span>
      <h1 className="text-2xl font-extrabold">Repaso terminado</h1>
      <dl className="grid w-full grid-cols-2 gap-2">
        {reading.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <dt className="text-xs font-bold text-slate-500 uppercase">Lectura</dt>
            <dd className="text-2xl font-extrabold">
              {readOk}/{reading.length}
            </dd>
          </div>
        )}
        {avg !== null && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <dt className="text-xs font-bold text-slate-500 uppercase">Escritura</dt>
            <dd className="text-2xl font-extrabold">{avg.toFixed(1)} ★</dd>
          </div>
        )}
      </dl>
      {next && <p className="text-sm text-slate-500">Tu próximo repaso es {describeDue(next, now())}.</p>}
      <SaveProgressPrompt />
      <Link to="/" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Volver al inicio
      </Link>
    </section>
  )
}

function PhaseTitle({ text }: { text: string }) {
  return <p className="text-center text-sm font-extrabold text-slate-500 uppercase">{text}</p>
}

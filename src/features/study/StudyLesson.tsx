import { type ReactNode, useState } from 'react'
import { Link } from 'react-router'
import { RetryNote } from '../../components/RetryNote'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import type { WritingHelp } from '../../components/WritingCanvas'
import type { GrammarExercise } from '../../courses/grammar'
import { firstTryCorrect, queueDone, useRetryQueue } from '../../lib/retryQueue'
import type { WritingItem } from '../../lib/writing'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'
import { WritingSession } from '../practice/WritingSession'

type Props = {
  kicker: string
  title: string
  /** Páginas de introducción (explicación, tablas, fichas), una a la vez. */
  pages: ReactNode[]
  exercises: GrammarExercise[]
  writing?: { items: WritingItem[]; help: WritingHelp }
  backTo: string
  next?: { to: string; title: string }
  /** Al terminar, con aciertos y total (la escritura cuenta 4–5 ★ como acierto). */
  onComplete: (correct: number, total: number) => void
  /** Dentro de la lección del día: no se muestra el cierre propio. */
  embedded?: boolean
}

/** Lección genérica: introducción → ejercicios → escritura (opcional) → resultado. */
export function StudyLesson({ kicker, title, pages, exercises, writing, backTo, next, onComplete, embedded }: Props) {
  const [step, setStep] = useState(0)
  const quiz = useRetryQueue(exercises.length)
  const [finished, setFinished] = useState<{ correct: number; total: number } | null>(null)

  // Las páginas, luego los ejercicios (las falladas vuelven al final hasta acertarlas) y la escritura.
  const exerciseStart = pages.length
  const writingStep = exerciseStart + (exercises.length ? 1 : 0)
  const total = exercises.length + (writing?.items.length ?? 0)
  const steps = exerciseStart + quiz.state.queue.length + (writing ? 1 : 0)
  const inExercises = step === exerciseStart && !queueDone(quiz.state)
  const correct = firstTryCorrect(quiz.state)
  const progressStep = step < exerciseStart ? step : exerciseStart + quiz.state.pos

  const finish = (score: number) => {
    onComplete(score, total)
    setFinished({ correct: score, total })
  }

  const answer = (ok: boolean) => {
    const next = quiz.answer(ok)
    if (!queueDone(next)) return
    if (writing) setStep(writingStep)
    else finish(firstTryCorrect(next))
  }

  if (finished && embedded) return null

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to={backTo} aria-label="Volver" className="text-xl text-slate-400 hover:text-slate-700">
          ×
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${finished ? 100 : (progressStep / steps) * 100}%` }} />
        </div>
      </div>

      {!finished && step < exerciseStart && (
        <section className="flex flex-col gap-4">
          {step === 0 && (
            <>
              <p className="text-sm font-bold text-slate-500 uppercase">{kicker}</p>
              <h1 className="text-2xl font-extrabold">{title}</h1>
            </>
          )}
          {pages[step]}
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className="rounded-full border border-slate-300 px-5 py-3 font-bold disabled:invisible dark:border-slate-700"
            >
              ← Atrás
            </button>
            <button onClick={() => setStep(step + 1)} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
              {step + 1 === exerciseStart ? 'A practicar →' : 'Siguiente →'}
            </button>
          </div>
        </section>
      )}

      {!finished && inExercises && (
        <>
          {quiz.retry && <RetryNote />}
          <GrammarExerciseView key={quiz.state.pos} exercise={exercises[quiz.current!]} onDone={answer} />
        </>
      )}

      {!finished && writing && step === writingStep && (
        <WritingSession
          items={writing.items}
          help={writing.help}
          onFinish={(results) => finish(correct + results.filter((r) => (r.score ?? 0) >= 4).length)}
        />
      )}

      {finished && (
        <section className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="text-6xl" aria-hidden>
            {finished.correct === finished.total ? '🎉' : '👍'}
          </span>
          <h1 className="text-2xl font-extrabold">¡Lección completada!</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acertaste {finished.correct} de {finished.total}.
          </p>
          <SaveProgressPrompt />
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={backTo} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
              Volver
            </Link>
            {next && (
              <Link to={next.to} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
                Siguiente: {next.title}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

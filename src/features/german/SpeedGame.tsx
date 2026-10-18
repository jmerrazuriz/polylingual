import { useEffect, useRef, useState } from 'react'
import type { SpeedQuestion } from '../../courses/de/practice'
import { useSpeech } from '../../lib/audio/useSpeech'
import { useProgress } from '../../lib/progress/store'
import { shuffle } from '../../lib/random'
import { GameResult } from '../games/GameResult'

type Props = {
  title: string
  instructions: string
  /** Nueva pregunta en cada turno. */
  next: () => SpeedQuestion
  recordKey: string
  onExit: () => void
  seconds?: number
}

const FEEDBACK_MS = 550
/** Al fallar se deja más tiempo para leer la explicación. */
const WRONG_FEEDBACK_MS = 1800
/** Un error descuenta tiempo: así no conviene responder al azar. */
const PENALTY_SECONDS = 3

/** Juego contra el reloj: responder bien la mayor cantidad de preguntas en `seconds` segundos. */
export function SpeedGame(props: Props) {
  const [game, setGame] = useState(0)
  return <SpeedRun key={game} {...props} onRetry={() => setGame((g) => g + 1)} />
}

function SpeedRun({ title, instructions, next, recordKey, onExit, onRetry, seconds = 60 }: Props & { onRetry: () => void }) {
  const [question, setQuestion] = useState(() => withShuffled(next()))
  const [left, setLeft] = useState(seconds)
  const [stats, setStats] = useState({ correct: 0, wrong: 0, streak: 0, best: 0 })
  const [feedback, setFeedback] = useState<{ chosen: string; ok: boolean } | null>(null)
  const [result, setResult] = useState<{ isRecord: boolean } | null>(null)
  const submit = useProgress((s) => s.submitRecord)
  const { speak } = useSpeech()
  const finished = useRef(false)

  useEffect(() => {
    if (result) return
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [result])

  useEffect(() => {
    if (left > 0 || finished.current) return
    finished.current = true
    setResult({ isRecord: submit(recordKey, stats.correct) })
  }, [left, recordKey, stats.correct, submit])

  if (result) {
    return (
      <GameResult
        title="¡Tiempo!"
        isRecord={result.isRecord}
        stats={[
          { label: 'Correctas', value: String(stats.correct) },
          { label: 'Errores', value: String(stats.wrong) },
          { label: 'Mejor racha', value: String(stats.best) },
          { label: 'Precisión', value: stats.correct + stats.wrong ? `${Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)} %` : '—' },
        ]}
        onRetry={onRetry}
        onExit={onExit}
      />
    )
  }

  const answer = (option: string) => {
    if (feedback) return
    const ok = option === question.answer
    setFeedback({ chosen: option, ok })
    if (question.speak) speak(question.speak)
    setStats((s) => {
      const streak = ok ? s.streak + 1 : 0
      return { correct: s.correct + (ok ? 1 : 0), wrong: s.wrong + (ok ? 0 : 1), streak, best: Math.max(s.best, streak) }
    })
    if (!ok) setLeft((s) => Math.max(0, s - PENALTY_SECONDS))
    setTimeout(() => {
      setFeedback(null)
      setQuestion(withShuffled(next()))
    }, ok ? FEEDBACK_MS : WRONG_FEEDBACK_MS)
  }

  const style = (option: string) => {
    if (!feedback) return 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
    if (option === question.answer) return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
    if (option === feedback.chosen) return 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
    return 'border-slate-200 opacity-60 dark:border-slate-800'
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <header className="flex items-center justify-between">
        <button onClick={onExit} aria-label="Salir" className="text-2xl leading-none text-slate-400 hover:text-slate-600">
          ×
        </button>
        <span className="font-extrabold">{title}</span>
        <span className={`rounded-full px-3 py-1 text-sm font-extrabold tabular-nums ${left <= 10 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800'}`}>
          ⏱ {left} s
        </span>
      </header>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">{instructions}</p>
      <div className="flex justify-center gap-4 text-sm font-bold">
        <span>✓ {stats.correct}</span>
        <span>✗ {stats.wrong}</span>
        <span>🔥 {stats.streak}</span>
      </div>
      <section lang="de" className="flex flex-col items-center gap-1 rounded-2xl bg-ink p-6 text-center text-white">
        <span className="text-3xl font-extrabold">{question.prompt}</span>
        {question.hint && <span className="text-sm opacity-80">{question.hint}</span>}
      </section>
      {feedback && !feedback.ok && (
        <p role="status" className="rounded-2xl bg-red-50 p-3 text-sm text-red-900 dark:bg-red-950/50 dark:text-red-200">
          {question.whyWrong?.[feedback.chosen] && <span className="block">{question.whyWrong[feedback.chosen]}</span>}
          <span className="block font-bold">Lo correcto: {question.answer}</span>
          {question.explanation && <span className="block">💡 {question.explanation}</span>}
        </p>
      )}
      <div className={`grid gap-2 ${question.options.length <= 3 ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {question.options.map((o) => (
          <button key={o} lang="de" onClick={() => answer(o)} className={`rounded-2xl border-2 px-4 py-3 text-lg font-bold transition ${style(o)}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Opciones desordenadas, salvo der/die/das, que van siempre en ese orden. */
function withShuffled(q: SpeedQuestion): SpeedQuestion {
  return q.options.join() === 'der,die,das' ? q : { ...q, options: shuffle(q.options) }
}

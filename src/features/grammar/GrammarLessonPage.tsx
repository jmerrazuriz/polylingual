import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { Furigana } from '../../components/Furigana'
import { RetryNote } from '../../components/RetryNote'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { grammarByCourse } from '../../courses/content'
import type { GrammarLesson } from '../../courses/grammar'
import { useSpeech } from '../../lib/audio/useSpeech'
import { useProgress } from '../../lib/progress/store'
import { useUnlockedGrammar } from '../../lib/progress/unlock'
import { firstTryCorrect, queueDone, useRetryQueue } from '../../lib/retryQueue'
import { GrammarExerciseView } from './GrammarExerciseView'
import { RichText } from './RichText'

export function GrammarLessonRoute() {
  const { lessonId } = useParams()
  const course = useProgress((s) => s.course)
  const lessons = grammarByCourse[course] ?? []
  const unlocked = useUnlockedGrammar(lessons.map((l) => l.id))
  const lesson = lessons.find((l) => l.id === lessonId)
  if (!lesson) return <ComingSoon title="Lección no encontrada" />
  if (!unlocked.has(lesson.id)) {
    return (
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl" aria-hidden>
          🔒
        </span>
        <h1 className="text-2xl font-extrabold">Esta lección todavía está bloqueada</h1>
        <Link to="/gramatica" className="font-semibold text-accent hover:underline">
          Ver lecciones de gramática
        </Link>
      </section>
    )
  }
  // En alemán la siguiente lección del recorrido puede ser de palabras: se vuelve al recorrido.
  const next = course !== 'ja' ? undefined : lessons[lessons.indexOf(lesson) + 1]
  return <GrammarLessonView key={lesson.id} lesson={lesson} number={lessons.indexOf(lesson) + 1} next={next} />
}

type Props = {
  lesson: GrammarLesson
  number: number
  next?: GrammarLesson
  /** Si se usa dentro de otra pantalla (lección del día), se llama al terminar en vez de mostrar el cierre. */
  onFinish?: (correct: number, total: number) => void
}

/** Explicación → ejemplos → ejercicios → resultado. */
export function GrammarLessonView({ lesson, number, next, onFinish }: Props) {
  const [step, setStep] = useState(0)
  const quiz = useRetryQueue(lesson.exercises.length)
  const [showReading, setShowReading] = useState(true)
  const complete = useProgress((s) => s.completeGrammar)
  const { available: audio, speak } = useSpeech()
  const lang = useProgress((s) => s.course)
  const font = lang === 'ja' ? 'font-jp' : ''
  const hasReadings = lesson.examples.some((ex) => ex.reading)

  const total = lesson.exercises.length
  // Explicación, ejemplos y los ejercicios (las falladas vuelven al final hasta acertarlas).
  const steps = 2 + quiz.state.queue.length
  const finished = step >= 2 && queueDone(quiz.state)
  const correct = firstTryCorrect(quiz.state)

  const answer = (ok: boolean) => {
    const next = quiz.answer(ok)
    if (queueDone(next)) {
      const score = firstTryCorrect(next)
      complete(lesson.id, score, total)
      onFinish?.(score, total)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        {!onFinish && (
          <Link to="/gramatica" aria-label="Volver a gramática" className="text-xl text-slate-400 hover:text-slate-700">
            ×
          </Link>
        )}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(finished ? steps : step < 2 ? step : 2 + quiz.state.pos) / steps * 100}%` }} />
        </div>
      </div>

      {step === 0 && (
        <section className="flex flex-col gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase">Gramática · Lección {number}</p>
          <h1 className="text-2xl font-extrabold">{lesson.title}</h1>
          <p lang={lang} className={`rounded-2xl bg-ink p-4 text-center text-xl leading-loose text-white ${font}`}>
            <Furigana text={lesson.pattern} />
          </p>
          {lesson.explanation.map((p, i) => (
            <p key={i} className="leading-loose text-slate-700 dark:text-slate-300">
              <RichText text={p} />
            </p>
          ))}
          <button onClick={() => setStep(1)} className="self-center rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
            Ver ejemplos
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold">Ejemplos</h2>
            {hasReadings && (
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={showReading} onChange={(e) => setShowReading(e.target.checked)} className="h-4 w-4 accent-accent" />
                Romaji
              </label>
            )}
          </div>
          <ul className="flex flex-col gap-2">
            {lesson.examples.map((ex) => (
              <li key={ex.text}>
                <button
                  onClick={() => speak(ex.text)}
                  disabled={!audio}
                  className="flex w-full flex-col gap-0.5 rounded-2xl border border-slate-200 bg-white p-3 text-left enabled:hover:border-accent dark:border-slate-800 dark:bg-slate-900"
                >
                  <span lang={lang} className={`text-xl ${font}`}>
                    {audio && <span aria-hidden>🔊 </span>}
                    <Furigana text={ex.text} />
                  </span>
                  {showReading && ex.reading && <span className="text-sm font-bold text-accent">{ex.reading}</span>}
                  <span className="text-sm text-slate-600 dark:text-slate-300">{ex.meaning}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            <button onClick={() => setStep(0)} className="rounded-full border border-slate-300 px-5 py-3 font-bold dark:border-slate-700">
              ← Explicación
            </button>
            <button onClick={() => setStep(2)} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
              A practicar →
            </button>
          </div>
        </section>
      )}

      {step >= 2 && !finished && (
        <>
          {quiz.retry && <RetryNote />}
          <GrammarExerciseView key={quiz.state.pos} exercise={lesson.exercises[quiz.current!]} onDone={answer} />
        </>
      )}

      {finished && !onFinish && (
        <section className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="text-6xl" aria-hidden>
            {correct === total ? '🎉' : '👍'}
          </span>
          <h1 className="text-2xl font-extrabold">¡Lección completada!</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acertaste {correct} de {total} ejercicios.
          </p>
          <SaveProgressPrompt />
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/gramatica" className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
              Gramática
            </Link>
            {next ? (
              <Link to={`/gramatica/${next.id}`} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
                Siguiente: {next.title}
              </Link>
            ) : (
              <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
                Seguir el recorrido
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

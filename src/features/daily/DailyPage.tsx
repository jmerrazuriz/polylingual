import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { grammarByCourse } from '../../courses/content'
import { kanaByChar } from '../../courses/ja/kana'
import { counterLessons } from '../../courses/ja/counters'
import { kanjiLessons } from '../../courses/ja/kanji'
import { vocabLessons } from '../../courses/ja/vocab'
import { readingById } from '../../lib/readings'
import { ReadingTextView } from '../study/ReadingPages'
import { lessons } from '../../courses/ja/lessons'
import { useAccount } from '../../lib/account/store'
import { DAILY_REVIEW_LIMIT, type DailyStep, dailyStepInfo, isDailyComplete, planDaily } from '../../lib/daily'
import { kanaPairItems } from '../../lib/pairs'
import { dayKey, recordKey } from '../../lib/progress/model'
import { progressSnapshot, useProgress } from '../../lib/progress/store'
import { shuffle } from '../../lib/random'
import { buildReview } from '../../lib/review'
import { now } from '../../lib/time'
import { useToasts } from '../../lib/toasts'
import { buildWeakReview } from '../../lib/units'
import { PairsGame } from '../games/PairsGame'
import { GrammarLessonView } from '../grammar/GrammarLessonPage'
import { LessonPage } from '../learn/LessonPage'
import { CounterLessonView } from '../study/CountersPages'
import { KanjiLessonView } from '../study/KanjiPages'
import { VocabLessonView } from '../study/VocabPages'
import { MixedSession } from '../practice/MixedSession'

/** Título de la lección nueva del día, sea de kana, contadores o kanji. */
const lessonTitle = (id?: string) =>
  [...lessons, ...counterLessons, ...kanjiLessons, ...vocabLessons].find((l) => l.id === id)?.title ?? (id ? readingById.get(id)?.title : undefined)

/** Parejas del mini juego diario: 6, al azar entre lo ya aprendido. */
const GAME_PAIRS = 6

export function DailyPage() {
  const day = dayKey(now())
  const record = useProgress((s) => s.daily[day])
  const updateDaily = useProgress((s) => s.updateDaily)
  const guest = useAccount((s) => s.status !== 'user')
  const [active, setActive] = useState<DailyStep | null>(null)

  // La lección se arma una vez por día, la primera vez que se abre.
  useEffect(() => {
    if (!record) updateDaily(day, () => planDaily(progressSnapshot(), now(), guest))
  }, [record, day, guest, updateDaily])

  if (!record) return null

  /** `leave`: volver a la lista. El mini juego se queda en su pantalla de resultado. */
  const markDone = (step: DailyStep, leave = true) => {
    updateDaily(day, (r) => ({ ...r, done: [...new Set([...r.done, step])] }))
    const after = useProgress.getState().daily[day]
    if (isDailyComplete(after)) {
      useToasts.getState().show({ icon: '☀️', title: '¡Lección de hoy completada!', text: 'Vuelve mañana para mantener la racha.' })
    }
    if (leave) setActive(null)
  }

  if (active) return <DailyStepRunner step={active} lessonId={record.lesson} grammarId={record.grammar} onDone={() => markDone(active, active !== 'juego')} onExit={() => setActive(null)} />

  const steps = record.steps as DailyStep[]
  const complete = isDailyComplete(record)
  const nextStep = steps.find((s) => !record.done.includes(s))

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-bold text-slate-500 uppercase">
          {new Date(now()).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-2xl font-extrabold">Lección de hoy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Unos 10 minutos: repasa, aprende algo nuevo y juega. Puedes hacer los pasos en el orden que quieras.
        </p>
      </header>

      {steps.length === 0 ? (
        <p className="rounded-2xl bg-slate-100 p-4 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          No hay nada pendiente para hoy: ¡vas al día con todo! Prueba un juego o la práctica libre.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {steps.map((step, i) => {
            const info = dailyStepInfo[step]
            const done = record.done.includes(step)
            const detail =
              step === 'nuevo'
                ? lessonTitle(record.lesson)
                : step === 'gramatica'
                  ? grammarByCourse.ja.find((g) => g.id === record.grammar)?.title
                  : undefined
            return (
              <li key={step}>
                <button
                  onClick={() => setActive(step)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition hover:-translate-y-0.5 ${
                    done
                      ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                      : step === nextStep
                        ? 'border-accent bg-white dark:bg-slate-900'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800" aria-hidden>
                    {done ? '✓' : info.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block font-extrabold">
                      {i + 1}. {info.title}
                      {done && <span className="sr-only"> (hecho)</span>}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{detail ?? info.text}</span>
                  </span>
                  <span className="text-sm font-bold text-accent">{done ? 'Repetir' : 'Empezar'}</span>
                </button>
              </li>
            )
          })}
        </ol>
      )}

      {complete && (
        <section className="flex flex-col items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
          <span className="text-4xl" aria-hidden>
            ☀️
          </span>
          <p className="font-extrabold">¡Lección de hoy completada!</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Mañana te espera una nueva. Puedes seguir practicando si quieres.</p>
        </section>
      )}
      {complete && <SaveProgressPrompt />}

      <Link to="/" className="self-center text-sm font-semibold text-slate-500 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}

type RunnerProps = { step: DailyStep; lessonId?: string; grammarId?: string; onDone: () => void; onExit: () => void }

/** Ejecuta un paso con las pantallas de siempre, avisando al terminar. */
function DailyStepRunner({ step, lessonId, grammarId, onDone, onExit }: RunnerProps) {
  const [plan] = useState(() => {
    const p = progressSnapshot()
    if (step === 'repasos') {
      const review = buildReview(p.cards, now())
      // Hasta 8 en total: primero kana, luego kanji y al final escritura.
      let left = DAILY_REVIEW_LIMIT
      const take = <T,>(list: T[]) => {
        const part = list.slice(0, left)
        left -= part.length
        return part
      }
      return { reading: take(review.reading), exercises: take(review.exercises), writing: take(review.writing) }
    }
    if (step === 'debiles') return buildWeakReview(p)
    return null
  })
  const [gameItems] = useState(() => {
    const learned = lessons.filter((l) => useProgress.getState().lessons[l.id]).flatMap((l) => l.chars)
    return kanaPairItems(shuffle(learned).slice(0, GAME_PAIRS).map((c) => kanaByChar.get(c)!))
  })

  const back = (
    <button onClick={onExit} className="self-start text-sm font-semibold text-slate-500 hover:underline">
      ← Lección de hoy
    </button>
  )

  if ((step === 'repasos' || step === 'debiles') && plan) {
    if (plan.reading.length + (plan.exercises?.length ?? 0) + plan.writing.length === 0) {
      return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-10 text-center">
          <p className="text-slate-600 dark:text-slate-400">No queda nada pendiente en este paso. ¡Bien!</p>
          <button onClick={onDone} className="rounded-full bg-ink px-6 py-3 font-bold text-white">
            Marcar como hecho
          </button>
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-3">
        {back}
        <MixedSession
          reading={plan.reading}
          exercises={plan.exercises}
          writing={plan.writing}
          onFinish={onDone}
          writingHelp={step === 'debiles' ? 'guide' : 'memory'}
        />
      </div>
    )
  }

  if (step === 'nuevo') {
    const kana = lessons.find((l) => l.id === lessonId)
    const counter = counterLessons.find((l) => l.id === lessonId)
    const kanji = kanjiLessons.find((l) => l.id === lessonId)
    const vocab = vocabLessons.find((l) => l.id === lessonId)
    const reading = lessonId ? readingById.get(lessonId) : undefined
    return (
      <div className="flex flex-col gap-3">
        {back}
        {kana && <LessonPage lesson={kana} onFinish={onDone} />}
        {counter && <CounterLessonView lesson={counter} onFinish={onDone} />}
        {kanji && <KanjiLessonView lesson={kanji} onFinish={onDone} />}
        {vocab && <VocabLessonView lesson={vocab} onFinish={onDone} />}
        {reading && <ReadingTextView text={reading} onFinish={onDone} />}
      </div>
    )
  }

  if (step === 'gramatica') {
    const list = grammarByCourse.ja
    const lesson = list.find((g) => g.id === grammarId)
    if (!lesson) return null
    return (
      <div className="flex flex-col gap-3">
        {back}
        <GrammarLessonView lesson={lesson} number={list.indexOf(lesson) + 1} onFinish={onDone} />
      </div>
    )
  }

  return (
    <PairsGame
      items={gameItems}
      variant="text"
      instructions="Toca un carácter y luego cómo se lee."
      recordKey={recordKey('daily-pairs', [])}
      onComplete={onDone}
      onExit={onExit}
    />
  )
}

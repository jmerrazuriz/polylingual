import { useState } from 'react'
import { GroupPicker } from '../../components/GroupPicker'
import {
  buildConfusableSession,
  buildReadingSession,
  confusablesFor,
  type Question,
  questionPrompt,
  type ReadingType,
  readingTypes,
  wordsForPool,
} from '../../lib/quiz'
import { type Answer, ReadingSession } from './ReadingSession'
import { kanaForLessons, useSelectedLessons, useSelection } from './selectionStore'

type Mode = 'normal' | 'confusables'
type Settings = { mode: Mode; types: ReadingType[]; timed: boolean }

const SECONDS_PER_QUESTION = 10

export function PracticePage() {
  const lessonIds = useSelectedLessons()
  const setLessonIds = useSelection((s) => s.setLessonIds)
  const [settings, setSettings] = useState<Settings>({
    mode: 'normal',
    types: readingTypes.map((t) => t.type),
    timed: false,
  })
  const [session, setSession] = useState<{ id: number; questions: Question[] } | null>(null)
  const [results, setResults] = useState<Answer[] | null>(null)

  const pool = kanaForLessons(lessonIds)
  const canStart = pool.length >= 2 && (settings.mode === 'confusables' || settings.types.length > 0)

  const start = () => {
    const questions =
      settings.mode === 'confusables'
        ? buildConfusableSession({ pool })
        : buildReadingSession({ pool, types: settings.types })
    setResults(null)
    setSession((prev) => ({ id: (prev?.id ?? 0) + 1, questions }))
  }

  if (session && !results) {
    return (
      <ReadingSession
        key={session.id}
        questions={session.questions}
        secondsPerQuestion={settings.timed ? SECONDS_PER_QUESTION : undefined}
        onFinish={setResults}
      />
    )
  }

  if (results) {
    return <Results answers={results} onRetry={start} onSettings={() => {
          setSession(null)
          setResults(null)
        }}
      />
  }

  const toggleType = (type: ReadingType) =>
    setSettings((s) => ({
      ...s,
      types: s.types.includes(type) ? s.types.filter((t) => t !== type) : [...s.types, type],
    }))

  const words = wordsForPool(pool).length
  const confusableGroups = confusablesFor(pool).length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Practicar lectura</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sesiones de 10 preguntas sobre los caracteres que elijas.</p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-extrabold">1. Caracteres</h2>
        <GroupPicker selected={lessonIds} onChange={setLessonIds} />
        <p className="text-sm text-slate-500">
          {pool.length} caracteres · {words} palabras que se pueden leer con ellos
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-extrabold">2. Ejercicios</h2>
        <div role="radiogroup" className="grid grid-cols-2 gap-2">
          {(
            [
              ['normal', 'Variados', 'Mezcla los tipos que elijas'],
              ['confusables', 'Pares confusos', `ぬ/め, る/ろ… (${confusableGroups} grupos)`],
            ] as const
          ).map(([mode, title, text]) => (
            <button
              key={mode}
              role="radio"
              aria-checked={settings.mode === mode}
              onClick={() => setSettings((s) => ({ ...s, mode }))}
              className={`rounded-xl border-2 p-3 text-left ${
                settings.mode === mode ? 'border-accent' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <span className="block font-extrabold">{title}</span>
              <span className="text-xs text-slate-500">{text}</span>
            </button>
          ))}
        </div>

        {settings.mode === 'normal' && (
          <div className="flex flex-wrap gap-1.5">
            {readingTypes.map(({ type, label }) => {
              const on = settings.types.includes(type)
              const disabled = type === 'type-word' && words === 0
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  aria-pressed={on}
                  disabled={disabled}
                  className={`rounded-full border px-3 py-1 text-sm font-semibold disabled:opacity-40 ${
                    on
                      ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                      : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold select-none">
          <input
            type="checkbox"
            checked={settings.timed}
            onChange={(e) => setSettings((s) => ({ ...s, timed: e.target.checked }))}
            className="h-4 w-4 accent-accent"
          />
          Contrarreloj ({SECONDS_PER_QUESTION} segundos por pregunta)
        </label>
      </section>

      <button
        onClick={start}
        disabled={!canStart}
        className="self-center rounded-full bg-ink px-10 py-3 text-lg font-bold text-white hover:opacity-90 disabled:opacity-40"
      >
        Empezar
      </button>
      {!canStart && <p className="-mt-4 text-center text-sm text-slate-500">Elige al menos un grupo y un tipo de ejercicio.</p>}

      <section className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
        <span className="font-extrabold">Practicar escritura</span> · llega en la fase 4: dibujar con el dedo y corrección
        trazo a trazo.
      </section>
    </div>
  )
}

function Results({ answers, onRetry, onSettings }: { answers: Answer[]; onRetry: () => void; onSettings: () => void }) {
  const correct = answers.filter((a) => a.correct).length
  const mistakes = answers.filter((a) => !a.correct)

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
      <span className="text-6xl" aria-hidden>
        {correct === answers.length ? '🎉' : correct >= answers.length * 0.7 ? '👍' : '💪'}
      </span>
      <h1 className="text-2xl font-extrabold">
        {correct} de {answers.length} correctas
      </h1>

      {mistakes.length > 0 && (
        <section className="flex w-full flex-col gap-2 text-left">
          <h2 className="text-sm font-extrabold text-slate-500 uppercase">Para repasar</h2>
          <ul className="flex flex-col gap-1.5">
            {mistakes.map((a, i) => {
              const { kana, answer } = questionPrompt(a.question)
              return (
                <li
                  key={i}
                  className="flex items-baseline gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800"
                >
                  <span className="font-jp text-2xl">{kana}</span>
                  <span className="font-bold text-accent">{answer}</span>
                  <span className="ml-auto text-sm text-slate-500">
                    {a.given === null ? 'sin tiempo' : a.given === '' ? 'no lo sabías' : `respondiste ${a.given}`}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="flex gap-3">
        <button onClick={onSettings} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
          Cambiar ajustes
        </button>
        <button onClick={onRetry} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Otra vez
        </button>
      </div>
    </div>
  )
}

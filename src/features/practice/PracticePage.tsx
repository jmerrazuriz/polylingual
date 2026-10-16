import { type ReactNode, useState } from 'react'
import { useSearchParams } from 'react-router'
import { GroupPicker } from '../../components/GroupPicker'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
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
import { WritingPractice } from './WritingPractice'

type Mode = 'normal' | 'confusables'
type Settings = { mode: Mode; types: ReadingType[]; timed: boolean }

const SECONDS_PER_QUESTION = 10

/** Pestañas Lectura / Escritura; se muestran en la pantalla de ajustes de cada práctica. */
function PracticeTabs({ current, onChange }: { current: 'lectura' | 'escritura'; onChange: (t: 'lectura' | 'escritura') => void }) {
  return (
    <div role="tablist" className="flex self-start rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
      {(['lectura', 'escritura'] as const).map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={current === t}
          onClick={() => onChange(t)}
          className={`rounded-lg px-4 py-1.5 text-sm font-bold capitalize transition ${
            current === t
              ? 'bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

export function PracticePage() {
  const [params, setParams] = useSearchParams()
  const current = params.get('tipo') === 'escritura' ? 'escritura' : 'lectura'
  const tabs = (
    <PracticeTabs current={current} onChange={(t) => setParams(t === 'lectura' ? {} : { tipo: t }, { replace: true })} />
  )
  return current === 'escritura' ? <WritingPractice tabs={tabs} /> : <ReadingPractice tabs={tabs} />
}

function ReadingPractice({ tabs }: { tabs: ReactNode }) {
  const { selected: lessonIds, unlocked } = useSelectedLessons()
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
      {tabs}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Practicar lectura</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sesiones de 10 preguntas sobre los caracteres que elijas.</p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-extrabold">1. Caracteres</h2>
        <GroupPicker selected={lessonIds} onChange={setLessonIds} unlocked={unlocked} />
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

      <SaveProgressPrompt />
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

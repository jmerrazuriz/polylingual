import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { lessons } from '../../courses/ja/lessons'
import type { Script } from '../../courses/ja/types'
import { buildPlacement, type PlacementQuestion, passedLessons } from '../../lib/placement'
import { useProgress } from '../../lib/progress/store'
import { ReadingSession } from '../practice/ReadingSession'

/** Test de nivel: marca como completadas las lecciones que ya domina, para no empezar de cero. */
export function PlacementPage() {
  const [params] = useSearchParams()
  const [script, setScript] = useState<Script>(params.get('silabario') === 'katakana' ? 'katakana' : 'hiragana')
  const [test, setTest] = useState<PlacementQuestion[] | null>(null)
  const [passed, setPassed] = useState<string[] | null>(null)
  const complete = useProgress((s) => s.completeLesson)

  if (passed) {
    const titles = lessons.filter((l) => passed.includes(l.id))
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
        <span className="text-6xl" aria-hidden>
          {titles.length ? '🎓' : '🌱'}
        </span>
        <h1 className="text-2xl font-extrabold">
          {titles.length ? `Ya sabes ${titles.length} ${titles.length === 1 ? 'lección' : 'lecciones'}` : 'Empezamos desde el principio'}
        </h1>
        {titles.length > 0 ? (
          <>
            <p className="text-slate-600 dark:text-slate-400">
              Las marcamos como completadas y sus caracteres entran a tus repasos:
            </p>
            <ul className="flex flex-wrap justify-center gap-1.5">
              {titles.map((l) => (
                <li key={l.id} className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ {l.title}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-slate-600 dark:text-slate-400">No pasa nada: la primera lección es justo para ti.</p>
        )}
        <SaveProgressPrompt />
        <Link
          to={script === 'katakana' ? '/aprender?silabario=katakana' : '/aprender'}
          className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90"
        >
          Ir a las lecciones
        </Link>
      </section>
    )
  }

  if (test) {
    return (
      <ReadingSession
        questions={test.map((q) => q.question)}
        allowSkip
        onFinish={(answers) => {
          const ids = passedLessons(answers.map((a, i) => ({ lessonId: test[i].lessonId, correct: a.correct })))
          for (const id of ids) {
            const lesson = lessons.find((l) => l.id === id)!
            const asked = test.filter((q) => q.lessonId === id).length
            complete(id, asked, asked, lesson.chars)
          }
          setPassed(ids)
        }}
      />
    )
  }

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-5 py-8 text-center">
      <span className="text-6xl" aria-hidden>
        🧭
      </span>
      <h1 className="text-2xl font-extrabold">Test de nivel</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Si ya sabes algo, te ahorras lecciones. Verás uno o dos caracteres de cada lección: elige cómo se lee o toca
        «No lo sé». Cada lección con todo correcto queda completada.
      </p>
      <div role="radiogroup" className="flex rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
        {(['hiragana', 'katakana'] as const).map((s) => (
          <button
            key={s}
            role="radio"
            aria-checked={s === script}
            onClick={() => setScript(s)}
            className={`rounded-lg px-4 py-1.5 text-sm font-bold capitalize ${
              s === script ? 'bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <button onClick={() => setTest(buildPlacement(script))} className="rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
        Empezar el test
      </button>
    </section>
  )
}

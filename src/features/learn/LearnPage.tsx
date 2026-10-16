import { Link } from 'react-router'
import { hiraganaLessons } from '../../content/lessons'
import type { KanaGroup } from '../../content/types'
import { useLessonProgress } from './progressStore'

const groups: { group: KanaGroup; title: string }[] = [
  { group: 'basic', title: 'Básicos' },
  { group: 'dakuten', title: 'Dakuten' },
  { group: 'yoon', title: 'Combinados' },
]

export function LearnPage() {
  const results = useLessonProgress((s) => s.results)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender · Hiragana</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lecciones cortas por grupos: cómo se escribe cada carácter, cómo suena, un truco para recordarlo y
          palabras que ya puedes leer.
        </p>
      </header>

      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        Por ahora tu avance se pierde al recargar la página. Se guardará cuando lleguen las cuentas.
      </p>

      {groups.map(({ group, title }) => (
        <section key={group} className="flex flex-col gap-2">
          <h2 className="text-sm font-extrabold text-slate-500 uppercase">{title}</h2>
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {hiraganaLessons
              .filter((l) => l.group === group)
              .map((lesson) => {
                const result = results[lesson.id]
                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/aprender/${lesson.id}`}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                      <span className="flex-1">
                        <span className="block font-extrabold">{lesson.title}</span>
                        <span className="font-jp text-lg tracking-wider text-slate-500 dark:text-slate-400">
                          {lesson.chars.join('')}
                        </span>
                      </span>
                      {result ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ✓ {result.correct}/{result.total}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600" aria-hidden>
                          →
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
          </ol>
        </section>
      ))}
    </div>
  )
}

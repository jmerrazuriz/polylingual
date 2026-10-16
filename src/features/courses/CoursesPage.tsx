import { useNavigate } from 'react-router'
import { courses } from '../../courses'
import { useProgress } from '../../lib/progress/store'

/** Elegir qué idioma estudiar. Cada curso guarda su propio progreso. */
export function CoursesPage() {
  const current = useProgress((s) => s.course)
  const setCourse = useProgress((s) => s.setCourse)
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Cursos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Elige el idioma que quieres estudiar. Cada curso guarda su propio progreso; la racha es una sola.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {courses.map((c) => {
          const active = c.id === current
          const soon = c.status === 'soon'
          return (
            <li key={c.id}>
              <button
                disabled={soon}
                onClick={() => {
                  setCourse(c.id)
                  navigate('/')
                }}
                aria-current={active ? 'true' : undefined}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-md disabled:opacity-60 dark:bg-slate-900 ${
                  active ? 'border-accent' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="text-4xl" aria-hidden>
                  {c.flag}
                </span>
                <span className="flex-1">
                  <span className="block font-extrabold">
                    {c.name} <span className="font-normal text-slate-500">· {c.native}</span>
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{c.tagline}</span>
                </span>
                {soon ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">
                    Próximamente
                  </span>
                ) : active ? (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-accent dark:bg-slate-800">Actual</span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

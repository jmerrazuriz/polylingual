import { Link } from 'react-router'
import { hiraganaLessons } from '../../content/lessons'
import type { KanaGroup } from '../../content/types'
import { useAccount } from '../../lib/account/store'
import { useProgress } from '../../lib/progress/store'
import { useUnlockedLessons } from '../../lib/progress/unlock'

const groups: { group: KanaGroup; title: string }[] = [
  { group: 'basic', title: 'Básicos' },
  { group: 'dakuten', title: 'Dakuten' },
  { group: 'yoon', title: 'Combinados' },
]

const cardClass =
  'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900'

export function LearnPage() {
  const results = useProgress((s) => s.lessons)
  const unlockAll = useProgress((s) => s.unlockAll)
  const setUnlockAll = useProgress((s) => s.setUnlockAll)
  const isUser = useAccount((s) => s.status === 'user')
  const unlocked = useUnlockedLessons()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender · Hiragana</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lecciones cortas por grupos: cómo se escribe cada carácter, cómo suena, un truco para recordarlo y
          palabras que ya puedes leer. Al completar una lección se abre la siguiente.
        </p>
      </header>

      {groups.map(({ group, title }) => (
        <section key={group} className="flex flex-col gap-2">
          <h2 className="text-sm font-extrabold text-slate-500 uppercase">{title}</h2>
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {hiraganaLessons
              .filter((l) => l.group === group)
              .map((lesson) => {
                const result = results[lesson.id]
                const content = (
                  <>
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
                    ) : unlocked.has(lesson.id) ? (
                      <span className="text-slate-300 dark:text-slate-600" aria-hidden>
                        →
                      </span>
                    ) : (
                      <span aria-label="Bloqueada">🔒</span>
                    )}
                  </>
                )
                return (
                  <li key={lesson.id}>
                    {unlocked.has(lesson.id) ? (
                      <Link to={`/aprender/${lesson.id}`} className={`${cardClass} transition hover:-translate-y-0.5 hover:shadow-md`}>
                        {content}
                      </Link>
                    ) : (
                      <div className={`${cardClass} opacity-50`} title="Completa la lección anterior para abrirla">
                        {content}
                      </div>
                    )}
                  </li>
                )
              })}
          </ol>
        </section>
      ))}

      {isUser ? (
        <label className="flex cursor-pointer items-center gap-2 self-start text-sm font-semibold text-slate-600 select-none dark:text-slate-400">
          <input
            type="checkbox"
            checked={unlockAll}
            onChange={(e) => setUnlockAll(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          Desbloquear todas las lecciones (si ya sabes algo de hiragana)
        </label>
      ) : (
        <p className="text-sm text-slate-500">Como invitado tienes todas las lecciones abiertas.</p>
      )}
    </div>
  )
}

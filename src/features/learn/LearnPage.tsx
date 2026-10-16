import { Link, useSearchParams } from 'react-router'
import { lessonsByScript } from '../../courses/ja/lessons'
import type { KanaGroup, Script } from '../../courses/ja/types'
import { useAccount } from '../../lib/account/store'
import { useProgress } from '../../lib/progress/store'
import { useUnlockedLessons } from '../../lib/progress/unlock'
import { units } from '../../lib/units'
import { UnitCard } from '../review/UnitCard'
import { LearnTabs } from './LearnTabs'

const groups: { group: KanaGroup; title: string }[] = [
  { group: 'basic', title: 'Básicos' },
  { group: 'dakuten', title: 'Dakuten' },
  { group: 'yoon', title: 'Combinados' },
  { group: 'extended', title: 'Extendidos' },
]

const cardClass =
  'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900'

export function LearnPage() {
  const results = useProgress((s) => s.lessons)
  const unlockAll = useProgress((s) => s.unlockAll)
  const setUnlockAll = useProgress((s) => s.setUnlockAll)
  const isUser = useAccount((s) => s.status === 'user')
  const unlocked = useUnlockedLessons()
  const [params] = useSearchParams()
  const script: Script = params.get('silabario') === 'katakana' ? 'katakana' : 'hiragana'
  const list = lessonsByScript[script]
  const katakanaLocked = !lessonsByScript.katakana.some((l) => unlocked.has(l.id))

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lecciones cortas por grupos: cómo se escribe cada carácter, cómo suena, un truco para recordarlo y
          palabras que ya puedes leer. Al completar una lección se abre la siguiente.
        </p>
      </header>

      <LearnTabs current={script} />

      <Link
        to={`/test-de-nivel${script === 'katakana' ? '?silabario=katakana' : ''}`}
        className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-3 text-sm hover:border-accent dark:border-slate-700"
      >
        <span className="text-2xl" aria-hidden>
          🧭
        </span>
        <span>
          <span className="block font-bold">¿Ya sabes algo de {script}?</span>
          <span className="text-slate-500">Haz el test de nivel y sáltate lo que ya dominas.</span>
        </span>
      </Link>

      {script === 'katakana' && katakanaLocked && (
        <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          🔒 El katakana se abre al completar los básicos del hiragana (hasta la lección «W y N»).
        </p>
      )}

      {groups.filter(({ group }) => list.some((l) => l.group === group)).map(({ group, title }) => (
        <section key={group} className="flex flex-col gap-2">
          <h2 className="text-sm font-extrabold text-slate-500 uppercase">{title}</h2>
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {list
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
            {units
              .filter((u) => u.script === script && u.group === group)
              .map((u) => (
                <li key={u.id} className="sm:col-span-2">
                  <UnitCard unit={u} />
                </li>
              ))}
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
          Desbloquear todas las lecciones (si ya sabes algo de japonés)
        </label>
      ) : (
        <p className="text-sm text-slate-500">Como invitado tienes todas las lecciones abiertas.</p>
      )}
    </div>
  )
}

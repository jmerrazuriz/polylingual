import { lessonsByScript } from '../courses/ja/lessons'
import type { KanaGroup, Script } from '../courses/ja/types'

const groupTitles: Record<KanaGroup, string> = {
  basic: 'Básicos',
  dakuten: 'Dakuten',
  yoon: 'Combinados',
  extended: 'Extendidos',
}

const scripts: { script: Script; title: string }[] = [
  { script: 'hiragana', title: 'Hiragana' },
  { script: 'katakana', title: 'Katakana' },
]

type Props = {
  selected: string[]
  onChange: (lessonIds: string[]) => void
  /** Lecciones que se pueden elegir; las demás se ven bloqueadas. */
  unlocked: Set<string>
}

/** Elige qué lecciones (grupos de caracteres) entran en una práctica o juego. */
export function GroupPicker({ selected, onChange, unlocked }: Props) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  const setMany = (ids: string[]) => {
    const allIn = ids.every((id) => selected.includes(id))
    onChange(allIn ? selected.filter((s) => !ids.includes(s)) : [...new Set([...selected, ...ids])])
  }

  return (
    <div className="flex flex-col gap-4">
      {scripts.map(({ script, title }) => {
        const list = lessonsByScript[script]
        if (!list.some((l) => unlocked.has(l.id)) && script === 'katakana') {
          return (
            <p key={script} className="text-sm text-slate-500">
              🔒 <span className="font-bold">Katakana</span> se abre al completar los básicos del hiragana.
            </p>
          )
        }
        const groups = [...new Set(list.map((l) => l.group))]
        return (
          <section key={script} className="flex flex-col gap-2">
            <h3 className="font-extrabold">{title}</h3>
            {groups.map((group) => {
              const lessons = list.filter((l) => l.group === group)
              return (
                <div key={group} className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setMany(lessons.filter((l) => unlocked.has(l.id)).map((l) => l.id))}
                    className="self-start text-xs font-extrabold text-slate-500 uppercase hover:text-accent"
                  >
                    {groupTitles[group]} · todos
                  </button>
                  <div className="flex flex-wrap gap-1.5">
                    {lessons.map((lesson) => {
                      const on = selected.includes(lesson.id)
                      const locked = !unlocked.has(lesson.id)
                      // Los combinados y extendidos son largos: se muestra uno de cada fila.
                      const label =
                        group === 'yoon' || group === 'extended'
                          ? lesson.chars.filter((_, i) => i % 3 === 0).join('')
                          : lesson.chars.join('')
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => toggle(lesson.id)}
                          aria-pressed={on}
                          disabled={locked}
                          title={locked ? `${lesson.title}: completa las lecciones anteriores` : lesson.title}
                          className={`rounded-full border px-3 py-1 font-jp text-sm transition disabled:opacity-35 ${
                            on
                              ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                              : 'border-slate-300 bg-white text-slate-600 hover:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}

import { hiraganaLessons } from '../content/lessons'
import type { KanaGroup } from '../content/types'

const groups: { group: KanaGroup; title: string }[] = [
  { group: 'basic', title: 'Básicos' },
  { group: 'dakuten', title: 'Dakuten' },
  { group: 'yoon', title: 'Combinados' },
]

type Props = {
  selected: string[]
  onChange: (lessonIds: string[]) => void
}

/** Elige qué lecciones (grupos de caracteres) entran en una práctica o juego. */
export function GroupPicker({ selected, onChange }: Props) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  const setGroup = (group: KanaGroup) => {
    const ids = hiraganaLessons.filter((l) => l.group === group).map((l) => l.id)
    const allIn = ids.every((id) => selected.includes(id))
    onChange(allIn ? selected.filter((s) => !ids.includes(s)) : [...new Set([...selected, ...ids])])
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map(({ group, title }) => (
        <div key={group} className="flex flex-col gap-1.5">
          <button
            onClick={() => setGroup(group)}
            className="self-start text-xs font-extrabold text-slate-500 uppercase hover:text-accent"
          >
            {title} · todos
          </button>
          <div className="flex flex-wrap gap-1.5">
            {hiraganaLessons
              .filter((l) => l.group === group)
              .map((lesson) => {
                const on = selected.includes(lesson.id)
                return (
                  <button
                    key={lesson.id}
                    onClick={() => toggle(lesson.id)}
                    aria-pressed={on}
                    title={lesson.title}
                    className={`rounded-full border px-3 py-1 font-jp text-sm transition ${
                      on
                        ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {group === 'yoon' ? lesson.chars.filter((_, i) => i % 3 === 0).join('') : lesson.chars.join('')}
                  </button>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

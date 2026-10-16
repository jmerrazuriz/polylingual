import { Link } from 'react-router'
import type { LessonResult } from '../../lib/progress/model'

export type ListLesson = { id: string; title: string; summary: string; to: string }

const cardClass =
  'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900'

/** Lista numerada de lecciones con su estado (completada, abierta o bloqueada). */
export function LessonList({
  lessons,
  results,
  unlocked,
  start = 1,
}: {
  lessons: ListLesson[]
  results: Record<string, LessonResult>
  unlocked: Set<string>
  start?: number
}) {
  return (
    <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {lessons.map((lesson, i) => {
        const result = results[lesson.id]
        const open = unlocked.has(lesson.id)
        const content = (
          <>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-extrabold dark:bg-slate-800">
              {start + i}
            </span>
            <span className="flex-1">
              <span className="block font-extrabold">{lesson.title}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{lesson.summary}</span>
            </span>
            {result ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ✓ {result.correct}/{result.total}
              </span>
            ) : open ? (
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
            {open ? (
              <Link to={lesson.to} className={`${cardClass} transition hover:-translate-y-0.5 hover:shadow-md`}>
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
  )
}

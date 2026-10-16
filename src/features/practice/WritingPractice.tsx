import { type ReactNode, useState } from 'react'
import { GroupPicker } from '../../components/GroupPicker'
import type { WritingHelp } from '../../components/WritingCanvas'
import { wordsForPool } from '../../lib/quiz'
import { buildWritingItems, type WritingContent, type WritingItem } from '../../lib/writing'
import { kanaForLessons, useSelectedLessons, useSelection } from './selectionStore'
import { type WritingResult, WritingSession } from './WritingSession'

const helps: { help: WritingHelp; title: string; text: string }[] = [
  { help: 'trace', title: 'Calcar', text: 'Se ve todo el carácter' },
  { help: 'guide', title: 'Guía', text: 'Solo el siguiente trazo' },
  { help: 'memory', title: 'De memoria', text: 'Sin ayudas' },
  { help: 'free', title: 'Libre', text: 'Sin corrección' },
]

export function WritingPractice({ tabs }: { tabs: ReactNode }) {
  const lessonIds = useSelectedLessons()
  const setLessonIds = useSelection((s) => s.setLessonIds)
  const [content, setContent] = useState<WritingContent>('kana')
  const [help, setHelp] = useState<WritingHelp>('trace')
  const [session, setSession] = useState<{ id: number; items: WritingItem[] } | null>(null)
  const [results, setResults] = useState<WritingResult[] | null>(null)

  const pool = kanaForLessons(lessonIds)
  const words = wordsForPool(pool).length
  const canStart = pool.length > 0 && (content === 'kana' || words > 0)

  const start = () => {
    setResults(null)
    setSession((prev) => ({ id: (prev?.id ?? 0) + 1, items: buildWritingItems(pool, content) }))
  }

  if (session && !results) {
    return <WritingSession key={session.id} items={session.items} help={help} onFinish={setResults} />
  }

  if (results) {
    const scored = results.filter((r) => r.score !== null)
    const average = scored.length ? scored.reduce((n, r) => n + r.score!, 0) / scored.length : null
    const toReview = scored.filter((r) => r.score! < 4)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
        <span className="text-6xl" aria-hidden>
          ✍️
        </span>
        <h1 className="text-2xl font-extrabold">
          {average === null ? '¡Práctica terminada!' : `Promedio: ${average.toFixed(1)} de 5 ★`}
        </h1>
        {toReview.length > 0 && (
          <section className="flex w-full flex-col gap-2 text-left">
            <h2 className="text-sm font-extrabold text-slate-500 uppercase">Para repasar</h2>
            <ul className="flex flex-wrap gap-2">
              {toReview.map((r, i) => (
                <li key={i} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
                  <span className="font-jp text-2xl">{r.item.kana}</span>{' '}
                  <span className="text-sm font-bold text-accent">{r.item.prompt}</span>{' '}
                  <span className="text-sm text-amber-500">{'★'.repeat(r.score!)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSession(null)
              setResults(null)
            }}
            className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700"
          >
            Cambiar ajustes
          </button>
          <button onClick={start} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
            Otra vez
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {tabs}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Practicar escritura</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Dibuja con el dedo, el lápiz o el mouse. Cada trazo se corrige al soltarlo: forma, dirección y orden.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-extrabold">1. Caracteres</h2>
        <GroupPicker selected={lessonIds} onChange={setLessonIds} />
        <p className="text-sm text-slate-500">
          {pool.length} caracteres · {words} palabras que se pueden escribir con ellos
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-extrabold">2. Qué escribir</h2>
        <div role="radiogroup" className="grid grid-cols-2 gap-2">
          {(
            [
              ['kana', 'Caracteres', '10 caracteres sueltos'],
              ['words', 'Palabras', '5 palabras completas'],
            ] as const
          ).map(([value, title, text]) => (
            <button
              key={value}
              role="radio"
              aria-checked={content === value}
              disabled={value === 'words' && words === 0}
              onClick={() => setContent(value)}
              className={`rounded-xl border-2 p-3 text-left disabled:opacity-40 ${
                content === value ? 'border-accent' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <span className="block font-extrabold">{title}</span>
              <span className="text-xs text-slate-500">{text}</span>
            </button>
          ))}
        </div>

        <h2 className="mt-2 font-extrabold">3. Ayuda</h2>
        <div role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {helps.map((h) => (
            <button
              key={h.help}
              role="radio"
              aria-checked={help === h.help}
              onClick={() => setHelp(h.help)}
              className={`rounded-xl border-2 p-3 text-left ${
                help === h.help ? 'border-accent' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <span className="block font-extrabold">{h.title}</span>
              <span className="text-xs text-slate-500">{h.text}</span>
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={start}
        disabled={!canStart}
        className="self-center rounded-full bg-ink px-10 py-3 text-lg font-bold text-white hover:opacity-90 disabled:opacity-40"
      >
        Empezar
      </button>
    </div>
  )
}

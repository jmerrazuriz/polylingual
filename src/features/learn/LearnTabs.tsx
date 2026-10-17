import { Link } from 'react-router'
import { useProgress } from '../../lib/progress/store'

export type LearnTab = 'recorrido' | 'hiragana' | 'katakana' | 'vocabulario' | 'gramatica' | 'conjugacion' | 'lectura' | 'contadores' | 'kanji'

/** Pestañas de cada curso: el recorrido es común; las demás son del japonés por ahora. */
const tabs: { tab: LearnTab; label: string; to: string; course?: string }[] = [
  { tab: 'recorrido', label: 'Recorrido', to: '/aprender' },
  { tab: 'hiragana', label: 'Hiragana', to: '/aprender?silabario=hiragana', course: 'ja' },
  { tab: 'katakana', label: 'Katakana', to: '/aprender?silabario=katakana', course: 'ja' },
  { tab: 'vocabulario', label: 'Vocabulario', to: '/vocabulario', course: 'ja' },
  { tab: 'gramatica', label: 'Gramática', to: '/gramatica', course: 'ja' },
  { tab: 'conjugacion', label: 'Conjugación', to: '/conjugacion', course: 'ja' },
  { tab: 'lectura', label: 'Lectura y audio', to: '/lectura', course: 'ja' },
  { tab: 'contadores', label: 'Contadores', to: '/contadores', course: 'ja' },
  { tab: 'kanji', label: 'Kanji', to: '/kanji', course: 'ja' },
]

/** Pestañas de la sección Aprender. En pantallas chicas se desplazan de lado. */
export function LearnTabs({ current }: { current: LearnTab }) {
  const course = useProgress((s) => s.course)
  const visible = tabs.filter((t) => !t.course || t.course === course)
  if (visible.length < 2) return null
  return (
    <nav aria-label="Aprender" className="-mx-4 overflow-x-auto px-4">
      <div className="flex w-max rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
        {visible.map((t) => (
          <Link
            key={t.tab}
            to={t.to}
            replace
            aria-current={t.tab === current ? 'page' : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold whitespace-nowrap transition ${
              t.tab === current
                ? 'bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

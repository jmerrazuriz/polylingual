import { Link } from 'react-router'

export type LearnTab = 'hiragana' | 'katakana' | 'gramatica'

const tabs: { tab: LearnTab; label: string; to: string }[] = [
  { tab: 'hiragana', label: 'Hiragana', to: '/aprender' },
  { tab: 'katakana', label: 'Katakana', to: '/aprender?silabario=katakana' },
  { tab: 'gramatica', label: 'Gramática', to: '/gramatica' },
]

/** Pestañas de la sección Aprender: los silabarios y la gramática. */
export function LearnTabs({ current }: { current: LearnTab }) {
  return (
    <nav aria-label="Aprender" className="flex self-start rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
      {tabs.map((t) => (
        <Link
          key={t.tab}
          to={t.to}
          replace
          aria-current={t.tab === current ? 'page' : undefined}
          className={`rounded-lg px-3 py-1.5 text-sm font-bold transition sm:px-4 ${
            t.tab === current
              ? 'bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}

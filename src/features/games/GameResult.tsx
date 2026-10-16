import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'

type Stat = { label: string; value: string }

type Props = {
  title: string
  stats: Stat[]
  isRecord: boolean
  onRetry: () => void
  onExit: () => void
}

export function GameResult({ title, stats, isRecord, onRetry, onExit }: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-6 text-center">
      <span className="text-6xl" aria-hidden>
        {isRecord ? '🏆' : '🎉'}
      </span>
      <h1 className="text-2xl font-extrabold">{title}</h1>
      {isRecord && <p className="font-bold text-accent">¡Nuevo récord!</p>}
      <dl className="grid w-full grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <dt className="text-xs font-bold text-slate-500 uppercase">{s.label}</dt>
            <dd className="text-2xl font-extrabold">{s.value}</dd>
          </div>
        ))}
      </dl>
      <SaveProgressPrompt />
      <div className="flex gap-3">
        <button onClick={onExit} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
          Volver
        </button>
        <button onClick={onRetry} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Otra vez
        </button>
      </div>
    </div>
  )
}

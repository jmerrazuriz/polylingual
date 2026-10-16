import type { summarize } from '../../lib/sessionSummary'

/** Tarjetas con los aciertos de lectura y el promedio de escritura. */
export function ResultStats({ summary }: { summary: ReturnType<typeof summarize> }) {
  return (
    <dl className="grid w-full grid-cols-2 gap-2">
      {summary.readTotal > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <dt className="text-xs font-bold text-slate-500 uppercase">Lectura</dt>
          <dd className="text-2xl font-extrabold">
            {summary.readOk}/{summary.readTotal}
          </dd>
        </div>
      )}
      {summary.writeAvg !== null && (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <dt className="text-xs font-bold text-slate-500 uppercase">Escritura</dt>
          <dd className="text-2xl font-extrabold">{summary.writeAvg.toFixed(1)} ★</dd>
        </div>
      )}
    </dl>
  )
}

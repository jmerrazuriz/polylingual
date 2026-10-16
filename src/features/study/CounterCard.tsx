import { bigNumbers, type Counter, numbers } from '../../courses/ja/counters'
import { useSpeech } from '../../lib/audio/useSpeech'
import { toRomaji } from '../../lib/romaji'

const safeRomaji = (kana: string) => {
  try {
    return toRomaji(kana.replace(/[〜\s]/g, ''))
  } catch {
    return ''
  }
}

/** Ficha de un contador: para qué sirve y cómo se lee del 1 al 10 (las especiales, resaltadas). */
export function CounterCard({ counter }: { counter: Counter }) {
  const { available: audio, speak } = useSpeech()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span lang="ja" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-ink font-jp text-5xl text-white">
          {counter.kanji}
        </span>
        <div>
          <p lang="ja" className="font-jp text-xl font-bold">
            {counter.reading} <span className="text-base font-normal text-accent">{safeRomaji(counter.reading)}</span>
          </p>
          <p className="text-slate-600 dark:text-slate-300">{counter.use}</p>
        </div>
      </div>

      <section className="flex flex-col gap-1.5">
        <h3 className="text-xs font-bold text-slate-500 uppercase">Del 1 al 10 · en rojo, las lecturas especiales</h3>
        <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {counter.readings.map((r, i) => {
            const n = i + 1
            const special = counter.irregular.includes(n)
            return (
              <li key={n}>
                <button
                  onClick={() => speak(r)}
                  disabled={!audio}
                  className={`flex w-full items-baseline gap-2 rounded-xl border px-2 py-1.5 text-left sm:flex-col sm:items-center sm:gap-0 ${
                    special ? 'border-accent bg-red-50 dark:bg-red-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <span className="w-5 text-xs font-bold text-slate-400 sm:w-auto">{n}</span>
                  <span lang="ja" className={`font-jp whitespace-nowrap ${special ? 'font-bold text-accent' : ''}`}>
                    {r}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <p className="text-sm">
        ¿Cuántos? <span lang="ja" className="font-jp font-bold">{counter.question}</span>
        {counter.extra?.map((e) => (
          <span key={e.label} className="ml-3 inline-block">
            {e.label}: <span lang="ja" className="font-jp font-bold">{e.reading}</span>
          </span>
        ))}
      </p>

      <ul className="flex flex-col gap-2">
        {counter.examples.map((ex) => (
          <li key={ex.text}>
            <button
              onClick={() => speak(ex.text)}
              disabled={!audio}
              className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-3 text-left dark:border-slate-800 dark:bg-slate-900"
            >
              <span lang="ja" className="font-jp text-lg">
                {audio && <span aria-hidden>🔊 </span>}
                {ex.text}
              </span>
              <span className="text-sm font-bold text-accent">{ex.reading}</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{ex.meaning}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Tabla de los números del 1 al 10 o de los números grandes. */
export function NumbersTable({ big }: { big?: boolean }) {
  const { available: audio, speak } = useSpeech()
  const rows = big
    ? bigNumbers.map((b) => ({ key: b.value, label: `${b.value.toLocaleString('es')} · ${b.text}`, reading: b.reading, special: !!b.irregular }))
    : numbers.map((n) => ({ key: n.value, label: `${n.value} · ${n.kanji}`, reading: n.readings.join(' / '), special: n.readings.length > 1 }))
  return (
    <ul className="grid grid-cols-2 gap-2">
      {rows.map((r) => (
        <li key={r.key}>
          <button
            onClick={() => speak(r.reading.split(' / ')[0])}
            disabled={!audio}
            className={`flex w-full flex-col rounded-xl border p-2 text-left ${
              r.special ? 'border-accent bg-red-50 dark:bg-red-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <span lang="ja" className="font-jp text-sm text-slate-500">
              {r.label}
            </span>
            <span lang="ja" className="font-jp text-lg font-bold">
              {r.reading}
            </span>
            <span className="text-xs text-accent">{r.reading.split(' / ').map(safeRomaji).join(' / ')}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

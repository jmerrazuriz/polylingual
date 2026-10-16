import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { charts, counterpart, kanaByChar } from '../../content/kana'
import type { Kana } from '../../content/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { type Mastery, readingMastery } from '../../lib/progress/model'
import { useProgress } from '../../lib/progress/store'
import { KanaDetailDialog } from './KanaDetailDialog'

const masteryStyle: Record<Mastery, string> = {
  new: 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
  learning: 'border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40',
  mastered: 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40',
}

type View = 'hiragana' | 'katakana' | 'ambos'

const views: { view: View; label: string }[] = [
  { view: 'hiragana', label: 'Hiragana' },
  { view: 'katakana', label: 'Katakana' },
  { view: 'ambos', label: 'Ambos' },
]

const tabClass = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-bold transition ${
    active
      ? 'bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white'
      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
  }`

export function ChartPage() {
  const [params, setParams] = useSearchParams()
  const view: View = (['katakana', 'ambos'] as const).find((v) => v === params.get('silabario')) ?? 'hiragana'
  // «Ambos» usa la tabla del hiragana y muestra el katakana al lado (los extendidos solo existen en katakana).
  const sections = charts[view === 'katakana' ? 'katakana' : 'hiragana']
  const section = sections.find((s) => s.group === params.get('grupo')) ?? sections[0]
  const go = (next: { view?: View; group?: string }) => {
    const v = next.view ?? view
    const g = next.group ?? section.group
    const query: Record<string, string> = {}
    if (v !== 'hiragana') query.silabario = v
    if (g !== 'basic' && charts[v === 'katakana' ? 'katakana' : 'hiragana'].some((s) => s.group === g)) query.grupo = g
    setParams(query, { replace: true })
  }
  const [hideRomaji, setHideRomaji] = useState(false)
  const [selected, setSelected] = useState<Kana | null>(null)
  const { speak } = useSpeech()
  const stats = useProgress((s) => s.kana)
  const hasStats = Object.keys(stats).length > 0

  const sectionKana = section.rows.flatMap((r) => r.cells).flatMap((c) => (c ? [kanaByChar.get(c)!] : []))

  const open = (kana: Kana) => {
    setSelected(kana)
    speak(kana.char)
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold">
            Tabla rápida<span className="hidden print:inline"> · {views.find((v) => v.view === view)!.label} · Polylingual</span>
          </h1>
          <p className="text-sm text-slate-500 print:hidden dark:text-slate-400">
            Toca un carácter para escucharlo y ver cómo se escribe.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="shrink-0 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-bold hover:bg-slate-100 print:hidden dark:border-slate-700 dark:hover:bg-slate-800"
        >
          🖨️ Imprimir
        </button>
      </header>

      <div role="tablist" aria-label="Silabario" className="flex self-start print:hidden rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
        {views.map((v) => (
          <button key={v.view} role="tab" aria-selected={v.view === view} onClick={() => go({ view: v.view })} className={tabClass(v.view === view)}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div role="tablist" aria-label="Grupo" className="flex flex-wrap rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
          {sections.map((s) => (
            <button key={s.group} role="tab" aria-selected={s === section} onClick={() => go({ group: s.group })} className={tabClass(s === section)}>
              {s.title}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold select-none">
          <input
            type="checkbox"
            checked={hideRomaji}
            onChange={(e) => setHideRomaji(e.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5 dark:bg-slate-700" />
          Ocultar romaji
        </label>
      </div>

      <p className="text-sm text-slate-600 print:hidden dark:text-slate-400">{section.description}</p>

      {hasStats && (
        <ul className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500 print:hidden" aria-label="Leyenda">
          <li className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-slate-300 bg-white dark:bg-slate-900" /> Sin practicar
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-amber-400 bg-amber-50" /> Aprendiendo
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-emerald-400 bg-emerald-50" /> Dominado (80 % de aciertos)
          </li>
        </ul>
      )}

      {sections.map((sec) => (
        <section key={sec.group} className={sec === section ? 'print:break-inside-avoid' : 'hidden print:block print:break-inside-avoid'}>
          <h2 className="mb-1 hidden text-sm font-extrabold uppercase print:block">{sec.title}</h2>
          <div
            className="grid gap-1.5 sm:gap-2 print:gap-1"
            style={{ gridTemplateColumns: `1.75rem repeat(${sec.columns.length}, minmax(0, 1fr))` }}
          >
            <span />
            {sec.columns.map((col) => (
              <span key={col} className="text-center text-xs font-bold text-slate-400 uppercase">
                {col}
              </span>
            ))}

            {sec.rows.map((row, r) => (
              <div key={r} className="contents">
                <span className="flex items-center justify-center text-xs font-bold text-slate-400 uppercase">
                  {row.label || '·'}
                </span>
                {row.cells.map((char, c) => {
                  const kana = char ? kanaByChar.get(char) : undefined
                  if (!kana) return <span key={c} />
                  const pair = view === 'ambos' ? counterpart(kana) : undefined
                  return (
                    <button
                      key={c}
                      onClick={() => open(kana)}
                      className={`print-cell flex aspect-square flex-col items-center justify-center rounded-xl border transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none sm:aspect-[4/3] print:aspect-auto print:py-1 ${masteryStyle[readingMastery(stats[kana.char])]}`}
                      aria-label={`${kana.char}${pair ? ` ${pair.char}` : ''}${hideRomaji ? '' : `, ${kana.romaji}`}`}
                    >
                      <span
                        lang="ja"
                        className={`font-jp leading-none ${kana.parts.length > 1 || pair ? 'text-xl sm:text-3xl print:text-xl' : 'text-3xl sm:text-4xl print:text-2xl'}`}
                      >
                        {kana.char}
                        {pair && <span className="ml-0.5 text-accent">{pair.char}</span>}
                      </span>
                      <span className="mt-1 h-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                        {hideRomaji ? '' : kana.romaji}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-slate-400">
        Trazos:{' '}
        <a href="https://kanjivg.tagaini.net" target="_blank" rel="noreferrer" className="underline">
          KanjiVG
        </a>{' '}
        © Ulrich Apel, licencia CC BY-SA 3.0.
      </p>

      <KanaDetailDialog
        kana={selected}
        list={sectionKana}
        hideRomaji={hideRomaji}
        onSelect={open}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

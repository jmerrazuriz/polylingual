import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { hiraganaChart } from '../../content/hiragana'
import { kanaByChar } from '../../content/kana'
import type { Kana } from '../../content/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { KanaDetailDialog } from './KanaDetailDialog'

export function ChartPage() {
  const [params, setParams] = useSearchParams()
  const section = hiraganaChart.find((s) => s.group === params.get('grupo')) ?? hiraganaChart[0]
  const [hideRomaji, setHideRomaji] = useState(false)
  const [selected, setSelected] = useState<Kana | null>(null)
  const { speak } = useSpeech()

  const sectionKana = section.rows.flatMap((r) => r.cells).flatMap((c) => (c ? [kanaByChar.get(c)!] : []))

  const open = (kana: Kana) => {
    setSelected(kana)
    speak(kana.char)
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Tabla rápida · Hiragana</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Toca un carácter para escucharlo y ver cómo se escribe.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="flex rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
          {hiraganaChart.map((s) => (
            <button
              key={s.group}
              role="tab"
              aria-selected={s === section}
              onClick={() => setParams(s === hiraganaChart[0] ? {} : { grupo: s.group }, { replace: true })}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                s === section
                  ? 'bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
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

      <p className="text-sm text-slate-600 dark:text-slate-400">{section.description}</p>

      <div
        className="grid gap-1.5 sm:gap-2"
        style={{ gridTemplateColumns: `1.75rem repeat(${section.columns.length}, minmax(0, 1fr))` }}
      >
        <span />
        {section.columns.map((col) => (
          <span key={col} className="text-center text-xs font-bold text-slate-400 uppercase">
            {col}
          </span>
        ))}

        {section.rows.map((row, r) => (
          <div key={r} className="contents">
            <span className="flex items-center justify-center text-xs font-bold text-slate-400 uppercase">
              {row.label || '·'}
            </span>
            {row.cells.map((char, c) => {
              const kana = char ? kanaByChar.get(char) : undefined
              if (!kana) return <span key={c} />
              return (
                <button
                  key={c}
                  onClick={() => open(kana)}
                  className="flex aspect-square flex-col items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none sm:aspect-[4/3] dark:border-slate-800 dark:bg-slate-900"
                  aria-label={hideRomaji ? kana.char : `${kana.char}, ${kana.romaji}`}
                >
                  <span className={`font-jp leading-none ${kana.parts.length > 1 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
                    {kana.char}
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

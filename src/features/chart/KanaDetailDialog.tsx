import { useEffect, useRef, useState } from 'react'
import { StrokeAnimation } from '../../components/StrokeAnimation'
import { getStrokes } from '../../content/kana'
import type { Kana } from '../../content/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { wordRomaji, wordsContaining } from '../../lib/words'

type Props = {
  kana: Kana | null
  /** Caracteres de la sección actual, para ir al anterior / siguiente. */
  list: Kana[]
  hideRomaji: boolean
  onSelect: (kana: Kana) => void
  onClose: () => void
}

export function KanaDetailDialog({ kana, list, hideRomaji, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [replay, setReplay] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const { available: audio, speak } = useSpeech()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (kana && !dialog.open) dialog.showModal()
    if (!kana && dialog.open) dialog.close()
    setRevealed(false)
  }, [kana])

  if (!kana) return <dialog ref={ref} onClose={onClose} />

  const index = list.indexOf(kana)
  const prev = list[index - 1]
  const next = list[index + 1]
  const strokeCount = kana.parts.reduce((n, p) => n + (getStrokes(p)?.strokes.length ?? 0), 0)
  const words = wordsContaining(kana.char)
  const showAnswer = !hideRomaji || revealed

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      className="m-auto mb-0 w-full max-w-md rounded-t-3xl bg-white p-0 text-slate-800 backdrop:bg-slate-950/50 sm:mb-auto sm:rounded-3xl dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="flex max-h-[90dvh] flex-col gap-4 overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => prev && onSelect(prev)}
            disabled={!prev}
            className="rounded-full px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:invisible dark:hover:bg-slate-800"
          >
            ← {prev?.char}
          </button>
          <button
            onClick={() => ref.current?.close()}
            aria-label="Cerrar"
            className="h-9 w-9 rounded-full text-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ×
          </button>
          <button
            onClick={() => next && onSelect(next)}
            disabled={!next}
            className="rounded-full px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:invisible dark:hover:bg-slate-800"
          >
            {next?.char} →
          </button>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-950">
          <StrokeAnimation key={`${kana.char}-${replay}`} parts={kana.parts} size={kana.parts.length > 1 ? 140 : 190} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-jp text-5xl font-bold">{kana.char}</span>
              {showAnswer ? (
                <span className="text-3xl font-extrabold text-accent">{kana.romaji}</span>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="rounded-lg border border-dashed border-slate-400 px-3 py-1 text-sm font-bold text-slate-500"
                >
                  Ver romaji
                </button>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {strokeCount} {strokeCount === 1 ? 'trazo' : 'trazos'}
              {showAnswer && kana.variants && ` · también se escribe ${kana.variants.join(', ')}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReplay((n) => n + 1)}
              aria-label="Repetir trazos"
              title="Repetir trazos"
              className="h-11 w-11 rounded-full bg-slate-100 text-lg hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              ↻
            </button>
            {audio && (
              <button
                onClick={() => speak(kana.char)}
                aria-label="Escuchar"
                title="Escuchar"
                className="h-11 w-11 rounded-full bg-ink text-lg text-white hover:opacity-90"
              >
                🔊
              </button>
            )}
          </div>
        </div>

        {kana.note && showAnswer && (
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            {kana.note}
          </p>
        )}

        {words.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-extrabold text-slate-500 uppercase">Palabras</h2>
            <ul className="flex flex-col gap-1.5">
              {words.map((w) => (
                <li key={w.kana}>
                  <button
                    onClick={() => speak(w.kana)}
                    disabled={!audio}
                    className="flex w-full items-baseline gap-3 rounded-xl border border-slate-200 px-3 py-2 text-left enabled:hover:bg-slate-50 dark:border-slate-800 dark:enabled:hover:bg-slate-800"
                  >
                    <span className="font-jp text-xl">{w.kana}</span>
                    {showAnswer && <span className="text-sm font-bold text-slate-500">{wordRomaji(w)}</span>}
                    <span className="ml-auto text-right text-sm text-slate-600 dark:text-slate-300">{w.meaning}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </dialog>
  )
}

import { useState } from 'react'
import { getStrokes } from '../content/kana'
import type { Kana, Word } from '../content/types'
import { useSpeech } from '../lib/audio/useSpeech'
import { wordRomaji } from '../lib/words'
import { StrokeAnimation } from './StrokeAnimation'

type Props = {
  kana: Kana
  words: Word[]
  /** false oculta el romaji y las pistas hasta que se toque "Ver romaji". */
  showAnswer?: boolean
  onReveal?: () => void
}

/** Ficha completa de un carácter: trazos, romaji, audio, ayudas y palabras. */
export function KanaCard({ kana, words, showAnswer = true, onReveal }: Props) {
  const [replay, setReplay] = useState(0)
  const { available: audio, speak } = useSpeech()
  const strokeCount = kana.parts.reduce((n, p) => n + (getStrokes(p)?.strokes.length ?? 0), 0)

  return (
    <div className="flex flex-col gap-4">
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
                onClick={onReveal}
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

      {kana.mnemonic && showAnswer && (
        <p className="flex gap-2 rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
          <span aria-hidden>💡</span>
          <span>{kana.mnemonic}</span>
        </p>
      )}

      {kana.note && showAnswer && (
        <p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <span aria-hidden>🗣️</span>
          <span>{kana.note}</span>
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
  )
}

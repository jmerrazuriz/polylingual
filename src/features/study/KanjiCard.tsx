import { useState } from 'react'
import { StrokeAnimation } from '../../components/StrokeAnimation'
import { getStrokes } from '../../courses/ja/kana'
import type { Kanji } from '../../courses/ja/kanji'
import { useSpeech } from '../../lib/audio/useSpeech'
import { toRomaji } from '../../lib/romaji'
import { useStrokesReady } from '../../lib/strokes/useStrokes'

/** «た(べる)» → «tabe(ru)» para mostrar el romaji sin perder el okurigana. */
const readingRomaji = (reading: string) =>
  reading.replace(/[^()]+/g, (part) => {
    try {
      return toRomaji(part)
    } catch {
      return part
    }
  })

/** Ficha de un kanji: orden de trazos, significado, lecturas y palabras de ejemplo. */
export function KanjiCard({ kanji }: { kanji: Kanji }) {
  const [replay, setReplay] = useState(0)
  const { available: audio, speak } = useSpeech()
  // Se vuelve a dibujar cuando llegan los trazos (para mostrar cuántos son).
  useStrokesReady([kanji.char])
  const strokes = getStrokes(kanji.char)?.strokes.length ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-slate-100 p-2 dark:bg-slate-950">
          <StrokeAnimation key={`${kanji.char}-${replay}`} parts={[kanji.char]} size={150} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-extrabold">{kanji.meaning}</span>
          <span className="text-sm text-slate-500">
            {strokes ? `${strokes} ${strokes === 1 ? 'trazo' : 'trazos'}` : '…'}
          </span>
          <button onClick={() => setReplay(replay + 1)} className="self-start rounded-full bg-slate-100 px-3 py-1 text-sm font-bold dark:bg-slate-800">
            ↻ Repetir trazos
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
          <dt className="text-xs font-bold text-slate-500 uppercase">On (lectura china)</dt>
          <dd lang="ja" className="font-jp">
            {kanji.on.length ? kanji.on.map((r) => `${r} · ${readingRomaji(r)}`).join('、 ') : '—'}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
          <dt className="text-xs font-bold text-slate-500 uppercase">Kun (lectura japonesa)</dt>
          <dd lang="ja" className="font-jp">
            {kanji.kun.length ? kanji.kun.map((r) => `${r} · ${readingRomaji(r)}`).join('、 ') : '—'}
          </dd>
        </div>
      </dl>

      <ul className="flex flex-col gap-2">
        {kanji.examples.map((ex) => (
          <li key={ex.word}>
            <button
              onClick={() => speak(ex.reading)}
              disabled={!audio}
              className="flex w-full items-baseline gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left dark:border-slate-800 dark:bg-slate-900"
            >
              <span lang="ja" className="font-jp text-2xl">
                {ex.word}
              </span>
              <span>
                <span lang="ja" className="block font-jp text-sm">
                  {ex.reading} <span className="text-accent">{readingRomaji(ex.reading)}</span>
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{ex.meaning}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

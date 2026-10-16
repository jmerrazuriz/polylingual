import { useState } from 'react'
import { type WritingHelp, WritingCanvas } from '../../components/WritingCanvas'
import { useSpeech } from '../../lib/audio/useSpeech'
import { scoreFromMistakes } from '../../lib/strokes/evaluate'
import type { WritingItem } from '../../lib/writing'

export type WritingResult = { item: WritingItem; score: number | null }

type Props = {
  items: WritingItem[]
  help: WritingHelp
  onFinish: (results: WritingResult[]) => void
}

/** Escribe cada ítem parte por parte; al terminar uno se muestra el resultado antes de seguir. */
export function WritingSession({ items, help, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [part, setPart] = useState(0)
  const [mistakes, setMistakes] = useState<number[]>([])
  const [results, setResults] = useState<WritingResult[]>([])
  const { available: audio, speak } = useSpeech()

  const item = items[index]
  const free = help === 'free'
  const itemDone = !free && mistakes.length === item.parts.length
  const score = itemDone ? scoreFromMistakes(mistakes.reduce((a, b) => a + b, 0)) : null

  const completePart = (m: number) => {
    setMistakes((prev) => [...prev, m])
    if (part + 1 < item.parts.length) setPart(part + 1)
    else speak(item.kana)
  }

  const next = () => {
    const all = [...results, { item, score: free ? null : score }]
    if (index + 1 === items.length) {
      onFinish(all)
      return
    }
    setResults(all)
    setIndex(index + 1)
    setPart(0)
    setMistakes([])
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
      <div className="flex w-full items-center gap-3">
        <span className="text-sm font-bold text-slate-500">
          {index + 1}/{items.length}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(index / items.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-center">
          <span className="text-slate-500">Escribe </span>
          <span className="text-3xl font-extrabold text-accent">{item.prompt}</span>
          {item.meaning && <span className="block text-sm text-slate-500">«{item.meaning}»</span>}
        </p>
        {audio && (
          <button
            onClick={() => speak(item.kana)}
            aria-label="Escuchar"
            className="h-10 w-10 shrink-0 rounded-full bg-ink text-white hover:opacity-90"
          >
            🔊
          </button>
        )}
      </div>

      {item.parts.length > 1 && (
        <div className="flex gap-1.5" aria-label="Avance de la palabra">
          {item.parts.map((c, i) => (
            <span
              key={i}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 font-jp text-2xl ${
                i < mistakes.length
                  ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : i === part
                    ? 'border-accent'
                    : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {i < mistakes.length || (free && i < part) ? c : ''}
            </span>
          ))}
        </div>
      )}

      {itemDone ? (
        <section className="flex flex-col items-center gap-3 py-4">
          <span className="font-jp text-7xl font-bold text-emerald-600">{item.kana}</span>
          <p className="text-2xl text-amber-400" aria-label={`${score} de 5`}>
            {'★'.repeat(score!)}
            <span className="text-slate-300 dark:text-slate-700">{'★'.repeat(5 - score!)}</span>
          </p>
          <p className="text-sm text-slate-500">
            {score === 5 ? '¡Perfecto, sin errores!' : `${mistakes.reduce((a, b) => a + b, 0)} errores o pistas`}
          </p>
        </section>
      ) : (
        <WritingCanvas key={`${index}-${part}`} char={item.parts[part]} help={help} onComplete={completePart} />
      )}

      {(itemDone || free) && (
        <div className="flex gap-3">
          {free && part + 1 < item.parts.length && (
            <button onClick={() => setPart(part + 1)} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
              Siguiente carácter
            </button>
          )}
          {(itemDone || part + 1 === item.parts.length) && (
            <button onClick={next} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
              {index + 1 === items.length ? 'Ver resultados' : 'Siguiente'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

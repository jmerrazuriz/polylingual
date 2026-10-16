import { useEffect, useRef, useState } from 'react'
import type { Kana } from '../../content/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { buildMemoryCards } from '../../lib/pairs'
import { formatSeconds, now, secondsSince } from '../../lib/time'
import { GameResult } from './GameResult'
import { useRecords } from './recordsStore'

type Props = {
  pool: Kana[]
  recordKey: string
  onExit: () => void
}

const FLIP_BACK_MS = 900

export function MemoryGame(props: Props) {
  const [game, setGame] = useState(0)
  return <MemoryRun key={game} {...props} onRetry={() => setGame((g) => g + 1)} />
}

function MemoryRun({ pool, recordKey, onExit, onRetry }: Props & { onRetry: () => void }) {
  const [cards] = useState(() => buildMemoryCards(pool))
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [result, setResult] = useState<{ seconds: number; isRecord: boolean } | null>(null)
  const startedAt = useRef(0)
  const submit = useRecords((s) => s.submit)
  const { speak } = useSpeech()

  useEffect(() => {
    startedAt.current = now()
  }, [])

  // Dos cartas abiertas que no son pareja se vuelven a tapar.
  useEffect(() => {
    if (open.length < 2) return
    const timer = setTimeout(() => setOpen([]), FLIP_BACK_MS)
    return () => clearTimeout(timer)
  }, [open])

  const pairs = cards.length / 2

  const flip = (index: number) => {
    const card = cards[index]
    if (open.length >= 2 || open.includes(index) || matched.has(card.kana.char)) return
    speak(card.kana.char)

    if (open.length === 0) {
      setOpen([index])
      return
    }
    const first = cards[open[0]]
    setMoves(moves + 1)
    if (first.kana.char === card.kana.char) {
      const next = new Set(matched).add(card.kana.char)
      setMatched(next)
      setOpen([])
      if (next.size === pairs) {
        // Menos intentos es mejor.
        setResult({ seconds: secondsSince(startedAt.current), isRecord: submit(recordKey, moves + 1, true) })
      }
    } else {
      setOpen([open[0], index])
    }
  }

  if (result) {
    return (
      <GameResult
        title="¡Memoria completa!"
        isRecord={result.isRecord}
        stats={[
          { label: 'Intentos', value: String(moves) },
          { label: 'Tiempo', value: formatSeconds(result.seconds) },
        ]}
        onRetry={onRetry}
        onExit={onExit}
      />
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold">
        <button onClick={onExit} aria-label="Salir del juego" className="text-xl text-slate-400 hover:text-slate-700">
          ×
        </button>
        <span className="text-slate-500">
          {matched.size}/{pairs} parejas
        </span>
        <span>{moves} intentos</span>
      </div>
      <p className="text-center text-sm text-slate-500">Encuentra cada carácter con su romaji.</p>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {cards.map((card, i) => {
          const isMatched = matched.has(card.kana.char)
          const faceUp = isMatched || open.includes(i)
          const isWrong = open.length === 2 && open.includes(i)
          return (
            <button
              key={card.id}
              onClick={() => flip(i)}
              aria-label={faceUp ? (card.face === 'kana' ? card.kana.char : card.kana.romaji) : `Carta ${i + 1}`}
              className={`flex aspect-square items-center justify-center rounded-2xl border-2 transition ${
                isMatched
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                  : isWrong
                    ? 'border-red-500 bg-red-50 dark:bg-red-950'
                    : faceUp
                      ? 'border-accent bg-white dark:bg-slate-900'
                      : 'border-ink bg-ink text-white hover:opacity-90 dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              {faceUp ? (
                <span className={card.face === 'kana' ? 'font-jp text-4xl' : 'text-2xl font-extrabold'}>
                  {card.face === 'kana' ? card.kana.char : card.kana.romaji}
                </span>
              ) : (
                <span className="font-jp text-2xl opacity-40">?</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

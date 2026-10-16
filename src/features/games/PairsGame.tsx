import { useEffect, useRef, useState } from 'react'
import type { Kana } from '../../content/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { buildPairsRounds, PENALTY, pointsForMatch } from '../../lib/pairs'
import { formatSeconds, now, secondsSince } from '../../lib/time'
import { GameResult } from './GameResult'
import { useRecords } from './recordsStore'

type Props = {
  pool: Kana[]
  /** romaji: se une kana con romaji. audio: se une kana con su sonido. */
  variant: 'romaji' | 'audio'
  recordKey: string
  onExit: () => void
}

type Result = { score: number; seconds: number; errors: number; maxCombo: number; isRecord: boolean }

const WRONG_MS = 650
const NEXT_ROUND_MS = 450

export function PairsGame(props: Props) {
  const [game, setGame] = useState(0)
  return <PairsRun key={game} {...props} onRetry={() => setGame((g) => g + 1)} />
}

function PairsRun({ pool, variant, recordKey, onExit, onRetry }: Props & { onRetry: () => void }) {
  const [rounds] = useState(() => buildPairsRounds(pool))
  const [roundIndex, setRoundIndex] = useState(0)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [left, setLeft] = useState<string | null>(null)
  const [right, setRight] = useState<string | null>(null)
  const [wrong, setWrong] = useState<[string, string] | null>(null)
  const [stats, setStats] = useState({ score: 0, errors: 0, combo: 0, maxCombo: 0 })
  const [result, setResult] = useState<Result | null>(null)
  const startedAt = useRef(0)
  const submit = useRecords((s) => s.submit)
  const { speak } = useSpeech()

  useEffect(() => {
    startedAt.current = now()
  }, [])

  const round = rounds[roundIndex]
  const total = rounds.reduce((n, r) => n + r.left.length, 0)
  const done = rounds.slice(0, roundIndex).reduce((n, r) => n + r.left.length, 0) + matched.size

  // Pasa de ronda (o termina) cuando se unieron todas las parejas.
  useEffect(() => {
    if (matched.size < round.left.length) return
    const timer = setTimeout(() => {
      if (roundIndex + 1 < rounds.length) {
        setRoundIndex(roundIndex + 1)
        setMatched(new Set())
        return
      }
      const seconds = secondsSince(startedAt.current)
      setResult({ ...stats, seconds, isRecord: submit(recordKey, stats.score) })
    }, NEXT_ROUND_MS)
    return () => clearTimeout(timer)
  }, [matched, round, roundIndex, rounds.length, stats, recordKey, submit])

  const tryPair = (l: string | null, r: string | null) => {
    setLeft(l)
    setRight(r)
    if (!l || !r) return
    if (l === r) {
      const combo = stats.combo + 1
      setStats((s) => ({ ...s, score: s.score + pointsForMatch(combo), combo, maxCombo: Math.max(s.maxCombo, combo) }))
      setMatched(new Set(matched).add(l))
      if (variant === 'romaji') speak(l)
    } else {
      setStats((s) => ({ ...s, score: Math.max(0, s.score - PENALTY), errors: s.errors + 1, combo: 0 }))
      setWrong([l, r])
      setTimeout(() => setWrong(null), WRONG_MS)
    }
    setLeft(null)
    setRight(null)
  }

  if (result) {
    return (
      <GameResult
        title="¡Todas las parejas unidas!"
        isRecord={result.isRecord}
        stats={[
          { label: 'Puntos', value: String(result.score) },
          { label: 'Tiempo', value: formatSeconds(result.seconds) },
          { label: 'Errores', value: String(result.errors) },
          { label: 'Mejor combo', value: `×${result.maxCombo}` },
        ]}
        onRetry={onRetry}
        onExit={onExit}
      />
    )
  }

  const cellClass = (char: string, selected: boolean) => {
    if (matched.has(char)) return 'border-emerald-500 bg-emerald-50 text-emerald-800 opacity-30 dark:bg-emerald-950 dark:text-emerald-200'
    if (wrong && (wrong[0] === char || wrong[1] === char)) return 'shake border-red-500 bg-red-50 dark:bg-red-950'
    if (selected) return 'border-accent bg-red-50/50 ring-2 ring-accent/40 dark:bg-slate-800'
    return 'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900'
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between text-sm font-bold">
        <button onClick={onExit} aria-label="Salir del juego" className="text-xl text-slate-400 hover:text-slate-700">
          ×
        </button>
        <span className="text-slate-500">
          {done}/{total} parejas
        </span>
        <span>
          {stats.combo > 1 && <span className="mr-2 text-accent">combo ×{stats.combo}</span>}
          {stats.score} pts
        </span>
      </div>

      <p className="text-center text-sm text-slate-500">
        {variant === 'romaji'
          ? 'Toca un carácter y luego cómo se lee.'
          : 'Toca un carácter y luego el sonido que le corresponde (🔊 lo reproduce).'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {round.left.map((k) => (
            <button
              key={k.char}
              onClick={() => tryPair(left === k.char ? null : k.char, right)}
              disabled={matched.has(k.char)}
              className={`h-16 rounded-2xl border-2 font-jp text-3xl transition ${cellClass(k.char, left === k.char)}`}
            >
              {k.char}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {round.right.map((k, i) => (
            <button
              key={k.char}
              onClick={() => {
                if (variant === 'audio') speak(k.char)
                tryPair(left, right === k.char ? null : k.char)
              }}
              disabled={matched.has(k.char)}
              aria-label={variant === 'audio' ? `Sonido ${i + 1}` : k.romaji}
              className={`h-16 rounded-2xl border-2 text-2xl font-extrabold transition ${cellClass(k.char, right === k.char)}`}
            >
              {variant === 'romaji' || matched.has(k.char) ? k.romaji : `🔊 ${i + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

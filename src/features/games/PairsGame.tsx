import { useEffect, useRef, useState } from 'react'
import { useSpeech } from '../../lib/audio/useSpeech'
import { buildPairsRounds, type PairItem, PENALTY, pointsForMatch } from '../../lib/pairs'
import { formatSeconds, now, secondsSince } from '../../lib/time'
import { GameResult } from './GameResult'
import { useProgress } from '../../lib/progress/store'

type Props = {
  items: PairItem[]
  /** text: se ve el lado derecho. audio: el lado derecho es un sonido (🔊). */
  variant: 'text' | 'audio'
  instructions: string
  /** Se llama al unir todas las parejas (antes de mostrar el resultado). */
  onComplete?: () => void
  recordKey: string
  onExit: () => void
}

type Result = { score: number; seconds: number; errors: number; maxCombo: number; isRecord: boolean }

const WRONG_MS = 650
const NEXT_ROUND_MS = 450
/** Hiragana o katakana: el lado derecho se muestra con la fuente japonesa. */
const KANA = /[぀-ヿ]/
/** Los juegos cuentan la mitad que un ejercicio para el dominio de cada carácter. */
const GAME_WEIGHT = 0.5

export function PairsGame(props: Props) {
  const [game, setGame] = useState(0)
  return <PairsRun key={game} {...props} onRetry={() => setGame((g) => g + 1)} />
}

function PairsRun({ items, variant, instructions, recordKey, onExit, onRetry, onComplete }: Props & { onRetry: () => void }) {
  const [rounds] = useState(() => buildPairsRounds(items))
  const [roundIndex, setRoundIndex] = useState(0)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [left, setLeft] = useState<string | null>(null)
  const [right, setRight] = useState<string | null>(null)
  const [wrong, setWrong] = useState<[string, string] | null>(null)
  const [stats, setStats] = useState({ score: 0, errors: 0, combo: 0, maxCombo: 0 })
  const [result, setResult] = useState<Result | null>(null)
  const startedAt = useRef(0)
  // En un ref para que un callback nuevo del padre no reinicie el temporizador de fin de ronda.
  const completeRef = useRef(onComplete)
  useEffect(() => {
    completeRef.current = onComplete
  })
  const submit = useProgress((s) => s.submitRecord)
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
      completeRef.current?.()
    }, NEXT_ROUND_MS)
    return () => clearTimeout(timer)
  }, [matched, round, roundIndex, rounds.length, stats, recordKey, submit])

  const byId = new Map(round.left.map((item) => [item.id, item]))

  const tryPair = (l: string | null, r: string | null) => {
    setLeft(l)
    setRight(r)
    if (!l || !r) return
    const item = byId.get(l)!
    if (l === r) {
      const combo = stats.combo + 1
      setStats((s) => ({ ...s, score: s.score + pointsForMatch(combo), combo, maxCombo: Math.max(s.maxCombo, combo) }))
      setMatched(new Set(matched).add(l))
      if (item.kana) useProgress.getState().recordReading(item.kana, true, GAME_WEIGHT)
      if (variant === 'text') speak(item.speak)
    } else {
      setStats((s) => ({ ...s, score: Math.max(0, s.score - PENALTY), errors: s.errors + 1, combo: 0 }))
      setWrong([l, r])
      if (item.kana) useProgress.getState().recordReading(item.kana, false, GAME_WEIGHT)
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
        {instructions}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {round.left.map((item) => (
            <button
              key={item.id}
              onClick={() => tryPair(left === item.id ? null : item.id, right)}
              disabled={matched.has(item.id)}
              className={`min-h-16 rounded-2xl border-2 px-2 font-jp transition ${[...item.left].length > 2 ? 'text-2xl' : 'text-3xl'} ${cellClass(item.id, left === item.id)}`}
            >
              {item.left}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {round.right.map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                if (variant === 'audio') speak(item.speak)
                tryPair(left, right === item.id ? null : item.id)
              }}
              disabled={matched.has(item.id)}
              aria-label={variant === 'audio' ? `Sonido ${i + 1}` : item.right}
              className={`min-h-16 rounded-2xl border-2 px-2 font-extrabold leading-tight transition ${
                KANA.test(item.right) ? 'font-jp text-3xl font-normal' : item.right.length > 8 ? 'text-sm' : 'text-2xl'
              } ${cellClass(item.id, right === item.id)}`}
            >
              {variant === 'text' || matched.has(item.id) ? item.right : `🔊 ${i + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

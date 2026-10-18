import { useState } from 'react'
import type { EuroGame, EuroLevel, EuroWord, SpeedQuestion } from '../../courses/euro'
import { euroLevels } from '../../courses/euro'
import { useAccount } from '../../lib/account/store'
import { useSpeech } from '../../lib/audio/useSpeech'
import { type PairItem, uniquePairs } from '../../lib/pairs'
import { recordKey } from '../../lib/progress/model'
import { progressSnapshot, useProgress } from '../../lib/progress/store'
import { shuffle } from '../../lib/random'
import { PairsGame } from '../games/PairsGame'
import { SpeedGame } from './SpeedGame'
import { useEuroCourse } from './useEuroCourse'

/** Parejas por partida: dos rondas de 6. */
const PAIRS_PER_GAME = 12

/** Una pregunta que sí se pueda armar (algunas combinaciones al azar no sirven y se reintenta). */
function nextQuestion(game: EuroGame, words: EuroWord[]): SpeedQuestion | null {
  for (let i = 0; i < 20; i++) {
    const q = game.question!(words)
    if (q) return q
  }
  return null
}

/** Juegos del curso europeo activo: parejas, sonidos y desafíos contra el reloj con las palabras de tus lecciones. */
export function EuroGamesPage() {
  const course = useEuroCourse()
  const guest = useAccount((s) => s.status !== 'user')
  useProgress((s) => s.lessons)
  const best = useProgress((s) => s.records)
  const { available: audio } = useSpeech()
  const available = course.poolLevels(progressSnapshot(), guest)
  const [levels, setLevels] = useState<EuroLevel[]>([])
  const [playing, setPlaying] = useState<{ game: EuroGame; items: PairItem[]; words: EuroWord[] } | null>(null)
  const words = course.wordPool(progressSnapshot(), guest, levels)
  const key = (g: EuroGame) => recordKey(g.id, levels.length ? levels : ['todo'])

  if (playing) {
    const { game, items } = playing
    const common = { recordKey: key(game), onExit: () => setPlaying(null) }
    if (game.kind === 'speed') {
      return <SpeedGame title={game.title} instructions={game.instructions} lang={course.lang} next={() => nextQuestion(game, playing.words)!} {...common} />
    }
    return <PairsGame items={items} variant={game.kind === 'audio' ? 'audio' : 'text'} instructions={game.instructions} {...common} />
  }

  const playable = (g: EuroGame) => (g.pairs ? uniquePairs(g.pairs(words)).length >= 4 : nextQuestion(g, words) !== null)
  const start = (g: EuroGame) => {
    const chosen = shuffle(words)
    setPlaying({ game: g, items: g.pairs ? uniquePairs(g.pairs(chosen)).slice(0, PAIRS_PER_GAME) : [], words })
  }
  const toggle = (l: EuroLevel) => setLevels((ls) => (ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l]))

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Juegos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Juega con las palabras de tus lecciones: parejas, sonidos, géneros y desafíos contra el reloj.
        </p>
      </header>

      <LevelPicker available={available} selected={levels} onToggle={toggle} count={words.length} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {course.games.map((g) => {
          const needsAudio = g.kind === 'audio' && !audio
          const ok = playable(g)
          const record = best[key(g)]
          return (
            <button
              key={g.id}
              onClick={() => start(g)}
              disabled={!ok || needsAudio}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-md disabled:opacity-50 sm:flex-col sm:items-start dark:border-slate-800 dark:bg-slate-900"
            >
              <span lang={course.lang} className="flex h-14 min-w-14 shrink-0 items-center justify-center rounded-xl bg-ink px-2 text-sm font-bold text-white">
                {g.glyph}
              </span>
              <span>
                <span className="block font-extrabold">{g.title}</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  {needsAudio ? `Tu navegador no tiene una voz en ${course.name}.` : !ok ? 'Completa más lecciones de palabras para jugar.' : g.text}
                </span>
                {record !== undefined && <span className="text-xs font-bold text-accent">Récord: {g.record(record)}</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Elegir de qué niveles salen las palabras (ninguno marcado = todos). */
export function LevelPicker({ available, selected, onToggle, count }: { available: EuroLevel[]; selected: EuroLevel[]; onToggle: (l: EuroLevel) => void; count: number }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-extrabold">Palabras en juego</h2>
      <div className="flex flex-wrap gap-2">
        {euroLevels.map((l) => {
          const on = selected.includes(l)
          return (
            <button
              key={l}
              onClick={() => onToggle(l)}
              disabled={!available.includes(l)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-1.5 text-sm font-bold disabled:opacity-40 ${on ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink' : 'border-slate-300 dark:border-slate-700'}`}
            >
              {l}
            </button>
          )
        })}
      </div>
      <p className="text-sm text-slate-500">
        {count} palabras {selected.length ? `de ${selected.join(', ')}` : 'de todos tus niveles'} · salen de las lecciones de palabras que ya hiciste (o de las abiertas, si aún son pocas).
      </p>
    </section>
  )
}

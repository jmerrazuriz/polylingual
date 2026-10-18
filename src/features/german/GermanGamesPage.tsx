import { useState } from 'react'
import { type CefrLevel, cefrLevels } from '../../courses/de/levels'
import {
  articleQuestion,
  audioPairs,
  conjugationQuestion,
  declensionQuestion,
  germanPoolLevels,
  germanWordPool,
  meaningPairs,
  pluralPairs,
  type SpeedQuestion,
} from '../../courses/de/practice'
import type { GermanWord } from '../../courses/de/vocab'
import { useAccount } from '../../lib/account/store'
import { useSpeech } from '../../lib/audio/useSpeech'
import { type PairItem, uniquePairs } from '../../lib/pairs'
import { recordKey } from '../../lib/progress/model'
import { progressSnapshot, useProgress } from '../../lib/progress/store'
import { shuffle } from '../../lib/random'
import { PairsGame } from '../games/PairsGame'
import { SpeedGame } from './SpeedGame'

/** Parejas por partida: dos rondas de 6. */
const PAIRS_PER_GAME = 12

type Game = {
  id: string
  glyph: string
  title: string
  text: string
  instructions: string
  kind: 'pairs' | 'audio' | 'speed'
  record: (n: number) => string
  pairs?: (words: GermanWord[]) => PairItem[]
  /** Juego rápido: devuelve una pregunta nueva (null si con estas palabras no se puede). */
  question?: (words: GermanWord[]) => SpeedQuestion | null
}

const games: Game[] = [
  {
    id: 'de-pairs-meaning',
    glyph: 'Tisch↔mesa',
    title: 'Parejas',
    text: 'Une cada palabra con su significado.',
    instructions: 'Toca una palabra y luego su significado.',
    kind: 'pairs',
    record: (n) => `${n} pts`,
    pairs: meaningPairs,
  },
  {
    id: 'de-pairs-audio',
    glyph: 'mesa↔🔊',
    title: 'Escucha y une',
    text: 'Une cada significado con la palabra que oyes.',
    instructions: 'Toca un significado y luego el sonido que le corresponde (🔊 lo reproduce).',
    kind: 'audio',
    record: (n) => `${n} pts`,
    pairs: audioPairs,
  },
  {
    id: 'de-pairs-plural',
    glyph: 'Tisch↔Tische',
    title: 'Singular y plural',
    text: 'Une cada sustantivo con su plural.',
    instructions: 'Toca un sustantivo y luego su plural.',
    kind: 'pairs',
    record: (n) => `${n} pts`,
    pairs: pluralPairs,
  },
  {
    id: 'de-speed-article',
    glyph: 'der·die·das',
    title: 'Der, die, das',
    text: '60 segundos para acertar la mayor cantidad de artículos.',
    instructions: 'Elige el artículo correcto. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (words) => articleQuestion(words),
  },
  {
    id: 'de-speed-conjugation',
    glyph: 'ich gehe',
    title: 'Conjugación rápida',
    text: 'Elige la forma correcta del verbo contra el reloj.',
    instructions: 'Persona, verbo y tiempo: elige la forma correcta. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: () => conjugationQuestion(),
  },
  {
    id: 'de-speed-declension',
    glyph: 'dem neuen',
    title: 'Terminaciones',
    text: 'Artículo, adjetivo y sustantivo en el caso correcto.',
    instructions: 'Elige la frase bien declinada. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (words) => declensionQuestion(words),
  },
]

/** Una pregunta que sí se pueda armar (algunas combinaciones al azar no sirven y se reintenta). */
function nextQuestion(game: Game, words: GermanWord[]): SpeedQuestion | null {
  for (let i = 0; i < 20; i++) {
    const q = game.question!(words)
    if (q) return q
  }
  return null
}

export function GermanGamesPage() {
  const guest = useAccount((s) => s.status !== 'user')
  useProgress((s) => s.lessons)
  const best = useProgress((s) => s.records)
  const { available: audio } = useSpeech()
  const available = germanPoolLevels(progressSnapshot(), guest)
  const [levels, setLevels] = useState<CefrLevel[]>([])
  const [playing, setPlaying] = useState<{ game: Game; items: PairItem[]; words: GermanWord[] } | null>(null)
  const words = germanWordPool(progressSnapshot(), guest, levels)
  const key = (g: Game) => recordKey(g.id, levels.length ? levels : ['todo'])

  if (playing) {
    const { game, items } = playing
    const common = { recordKey: key(game), onExit: () => setPlaying(null) }
    if (game.kind === 'speed') {
      return <SpeedGame title={game.title} instructions={game.instructions} next={() => nextQuestion(game, playing.words)!} {...common} />
    }
    return <PairsGame items={items} variant={game.kind === 'audio' ? 'audio' : 'text'} instructions={game.instructions} {...common} />
  }

  const playable = (g: Game) => (g.pairs ? uniquePairs(g.pairs(words)).length >= 4 : nextQuestion(g, words) !== null)
  const start = (g: Game) => {
    const chosen = shuffle(words)
    setPlaying({ game: g, items: g.pairs ? uniquePairs(g.pairs(chosen)).slice(0, PAIRS_PER_GAME) : [], words })
  }
  const toggle = (l: CefrLevel) => setLevels((ls) => (ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l]))

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Juegos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Juega con las palabras de tus lecciones: parejas, sonidos, artículos, plurales y conjugación contra el reloj.
        </p>
      </header>

      <LevelPicker available={available} selected={levels} onToggle={toggle} count={words.length} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {games.map((g) => {
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
              <span lang="de" className="flex h-14 min-w-14 shrink-0 items-center justify-center rounded-xl bg-ink px-2 text-sm font-bold text-white">
                {g.glyph}
              </span>
              <span>
                <span className="block font-extrabold">{g.title}</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  {needsAudio ? 'Tu navegador no tiene una voz alemana.' : !ok ? 'Completa más lecciones de palabras para jugar.' : g.text}
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
export function LevelPicker({ available, selected, onToggle, count }: { available: CefrLevel[]; selected: CefrLevel[]; onToggle: (l: CefrLevel) => void; count: number }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-extrabold">Palabras en juego</h2>
      <div className="flex flex-wrap gap-2">
        {cefrLevels.map((l) => {
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

import { useState } from 'react'
import { GroupPicker } from '../../components/GroupPicker'
import type { Kana, Word } from '../../content/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { kanaPairItems, type PairItem, uniqueByRomaji, uniquePairs, wordPairItems } from '../../lib/pairs'
import { recordKey } from '../../lib/progress/model'
import { useProgress } from '../../lib/progress/store'
import { wordsForPool } from '../../lib/quiz'
import { shuffle } from '../../lib/random'
import { kanaForLessons, useSelectedLessons, useSelection } from '../practice/selectionStore'
import { MemoryGame } from './MemoryGame'
import { PairsGame } from './PairsGame'

type GameId = 'pairs-romaji' | 'pairs-audio' | 'memory' | 'words-romaji' | 'words-meaning'

/** Palabras por partida: dos rondas de 6. */
const WORDS_PER_GAME = 12

type Game = {
  id: GameId
  glyph: string
  title: string
  text: string
  instructions: string
  record: (n: number) => string
  /** Parejas del juego (no aplica a memoria). */
  items?: (pool: Kana[], words: Word[]) => PairItem[]
}

const kanaGames: Game[] = [
  {
    id: 'pairs-romaji',
    glyph: 'あ↔a',
    title: 'Parejas',
    text: 'Une cada carácter con cómo se lee.',
    instructions: 'Toca un carácter y luego cómo se lee.',
    record: (n) => `${n} pts`,
    items: (pool) => kanaPairItems(pool),
  },
  {
    id: 'pairs-audio',
    glyph: 'あ↔🔊',
    title: 'Escucha y une',
    text: 'Une cada carácter con su sonido.',
    instructions: 'Toca un carácter y luego el sonido que le corresponde (🔊 lo reproduce).',
    record: (n) => `${n} pts`,
    items: (pool) => kanaPairItems(pool),
  },
  {
    id: 'memory',
    glyph: '🂠',
    title: 'Memoria',
    text: 'Voltea cartas y encuentra las parejas.',
    instructions: '',
    record: (n) => `${n} intentos`,
  },
]

const wordGames: Game[] = [
  {
    id: 'words-romaji',
    glyph: 'ねこ↔neko',
    title: 'Palabras y lectura',
    text: 'Une cada palabra con cómo se lee.',
    instructions: 'Toca una palabra y luego cómo se lee.',
    record: (n) => `${n} pts`,
    items: (_, words) => wordPairItems(words, 'romaji'),
  },
  {
    id: 'words-meaning',
    glyph: 'ねこ↔🐱',
    title: 'Palabras y significado',
    text: 'Une cada palabra con lo que significa.',
    instructions: 'Toca una palabra y luego su significado.',
    record: (n) => `${n} pts`,
    items: (_, words) => wordPairItems(words, 'meaning'),
  },
]

export function GamesPage() {
  const { selected: lessonIds, unlocked } = useSelectedLessons()
  const setLessonIds = useSelection((s) => s.setLessonIds)
  const best = useProgress((s) => s.records)
  const { available: audio } = useSpeech()
  const [playing, setPlaying] = useState<{ game: Game; items: PairItem[] } | null>(null)

  const pool = kanaForLessons(lessonIds)
  const words = wordsForPool(pool)

  if (playing) {
    const { game, items } = playing
    const common = { recordKey: recordKey(game.id, lessonIds), onExit: () => setPlaying(null) }
    if (game.id === 'memory') return <MemoryGame pool={pool} {...common} />
    return (
      <PairsGame
        items={items}
        variant={game.id === 'pairs-audio' ? 'audio' : 'text'}
        instructions={game.instructions}
        {...common}
      />
    )
  }

  const start = (game: Game) => {
    // Las palabras se eligen al azar en cada partida para no repetir siempre las mismas.
    const chosen = shuffle(words).slice(0, WORDS_PER_GAME)
    setPlaying({ game, items: game.items?.(pool, chosen) ?? [] })
  }

  const card = (g: Game) => {
    const needsAudio = g.id === 'pairs-audio' && !audio
    const playable = g.items ? uniquePairs(g.items(pool, words)).length >= 2 : uniqueByRomaji(pool).length >= 2
    const record = best[recordKey(g.id, lessonIds)]
    return (
      <button
        key={g.id}
        onClick={() => start(g)}
        disabled={!playable || needsAudio}
        className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-md disabled:opacity-50 sm:flex-col sm:items-start dark:border-slate-800 dark:bg-slate-900"
      >
        <span className="flex h-14 min-w-14 shrink-0 items-center justify-center rounded-xl bg-ink px-2 font-jp text-lg text-white">
          {g.glyph}
        </span>
        <span>
          <span className="block font-extrabold">{g.title}</span>
          <span className="block text-sm text-slate-500 dark:text-slate-400">
            {needsAudio ? 'Tu navegador no tiene voz japonesa.' : !playable ? 'Elige más caracteres para jugar.' : g.text}
          </span>
          {record !== undefined && <span className="text-xs font-bold text-accent">Récord: {g.record(record)}</span>}
        </span>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Juegos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Une parejas de caracteres, sonidos y palabras contra el reloj.</p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-extrabold">Caracteres en juego</h2>
        <GroupPicker selected={lessonIds} onChange={setLessonIds} unlocked={unlocked} />
        <p className="text-sm text-slate-500">
          {pool.length} caracteres · {words.length} palabras que se pueden leer con ellos
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Caracteres</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{kanaGames.map(card)}</div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Palabras</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{wordGames.map(card)}</div>
      </section>
    </div>
  )
}

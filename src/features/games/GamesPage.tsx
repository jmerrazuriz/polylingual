import { useState } from 'react'
import { GroupPicker } from '../../components/GroupPicker'
import { useSpeech } from '../../lib/audio/useSpeech'
import { uniqueByRomaji } from '../../lib/pairs'
import { kanaForLessons, useSelectedLessons, useSelection } from '../practice/selectionStore'
import { MemoryGame } from './MemoryGame'
import { PairsGame } from './PairsGame'
import { recordKey, useRecords } from './recordsStore'

type GameId = 'pairs-romaji' | 'pairs-audio' | 'memory'

const games: { id: GameId; glyph: string; title: string; text: string; record: (n: number) => string }[] = [
  { id: 'pairs-romaji', glyph: 'あ↔a', title: 'Parejas', text: 'Une cada carácter con cómo se lee.', record: (n) => `${n} pts` },
  { id: 'pairs-audio', glyph: 'あ↔🔊', title: 'Escucha y une', text: 'Une cada carácter con su sonido.', record: (n) => `${n} pts` },
  { id: 'memory', glyph: '🂠', title: 'Memoria', text: 'Voltea cartas y encuentra las parejas.', record: (n) => `${n} intentos` },
]

export function GamesPage() {
  const lessonIds = useSelectedLessons()
  const setLessonIds = useSelection((s) => s.setLessonIds)
  const best = useRecords((s) => s.best)
  const { available: audio } = useSpeech()
  const [playing, setPlaying] = useState<GameId | null>(null)

  const pool = kanaForLessons(lessonIds)
  const playable = uniqueByRomaji(pool).length >= 2

  if (playing) {
    const props = { pool, recordKey: recordKey(playing, lessonIds), onExit: () => setPlaying(null) }
    if (playing === 'memory') return <MemoryGame {...props} />
    return <PairsGame {...props} variant={playing === 'pairs-audio' ? 'audio' : 'romaji'} />
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Juegos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Une parejas de caracteres y sonidos contra el reloj.</p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-extrabold">Caracteres en juego</h2>
        <GroupPicker selected={lessonIds} onChange={setLessonIds} />
        <p className="text-sm text-slate-500">{pool.length} caracteres</p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {games.map((g) => {
          const needsAudio = g.id === 'pairs-audio' && !audio
          const record = best[recordKey(g.id, lessonIds)]
          return (
            <button
              key={g.id}
              onClick={() => setPlaying(g.id)}
              disabled={!playable || needsAudio}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-md disabled:opacity-50 sm:flex-col sm:items-start dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex h-14 min-w-14 shrink-0 items-center justify-center rounded-xl bg-ink px-2 font-jp text-xl text-white">
                {g.glyph}
              </span>
              <span>
                <span className="block font-extrabold">{g.title}</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  {needsAudio ? 'Tu navegador no tiene voz japonesa.' : g.text}
                </span>
                {record !== undefined && <span className="text-xs font-bold text-accent">Récord: {g.record(record)}</span>}
              </span>
            </button>
          )
        })}
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
        <span className="font-extrabold">Parejas de palabras</span> · llega en la fase 6.
      </section>
    </div>
  )
}

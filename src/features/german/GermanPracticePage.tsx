import { useState } from 'react'
import { Link } from 'react-router'
import { type CefrLevel } from '../../courses/de/levels'
import { germanPoolLevels, germanWordPool, type PracticeMode, practiceSession } from '../../courses/de/practice'
import type { GrammarExercise } from '../../courses/grammar'
import { useAccount } from '../../lib/account/store'
import { progressSnapshot, useProgress } from '../../lib/progress/store'
import { summarize } from '../../lib/sessionSummary'
import { type MixedResult, MixedSession } from '../practice/MixedSession'
import { ResultStats } from '../review/ResultStats'
import { LevelPicker } from './GermanGamesPage'

const modes: { mode: PracticeMode; glyph: string; title: string; text: string }[] = [
  { mode: 'palabras', glyph: '📖', title: 'Palabras', text: 'Significado y cómo se dice, con las palabras de tus lecciones.' },
  { mode: 'escribir', glyph: '⌨️', title: 'Escribir', text: 'Escribe la palabra en alemán, con su artículo.' },
  { mode: 'articulos', glyph: 'der', title: 'Artículos', text: 'der, die o das: el género de cada sustantivo.' },
  { mode: 'plurales', glyph: '-e -en', title: 'Plurales', text: 'Elige el plural correcto de cada sustantivo.' },
  { mode: 'conjugacion', glyph: 'ich bin', title: 'Conjugación', text: 'Presente, Präteritum y Perfekt de los verbos del curso.' },
  { mode: 'declinacion', glyph: 'dem', title: 'Declinación', text: 'Artículo, adjetivo y sustantivo en nominativo, acusativo y dativo.' },
]

/** Práctica libre del alemán: sesiones de 12 ejercicios por tema, sin afectar el recorrido. */
export function GermanPracticePage() {
  const guest = useAccount((s) => s.status !== 'user')
  useProgress((s) => s.lessons)
  const [levels, setLevels] = useState<CefrLevel[]>([])
  const [session, setSession] = useState<{ mode: PracticeMode; exercises: GrammarExercise[] } | null>(null)
  const [result, setResult] = useState<MixedResult | null>(null)
  const available = germanPoolLevels(progressSnapshot(), guest)
  const words = germanWordPool(progressSnapshot(), guest, levels)
  const toggle = (l: CefrLevel) => setLevels((ls) => (ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l]))

  if (session && result) {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
        <span className="text-6xl" aria-hidden>
          ✅
        </span>
        <h1 className="text-2xl font-extrabold">Práctica terminada</h1>
        <ResultStats summary={summarize(result)} />
        <div className="flex gap-3">
          <button onClick={() => { setSession(null); setResult(null) }} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
            Volver
          </button>
          <button
            onClick={() => {
              setResult(null)
              setSession({ mode: session.mode, exercises: practiceSession(session.mode, words) })
            }}
            className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90"
          >
            Otra vez
          </button>
        </div>
      </section>
    )
  }

  if (session) {
    const title = modes.find((m) => m.mode === session.mode)!.title
    return (
      <MixedSession
        reading={[]}
        exercises={session.exercises.map((exercise) => ({ exercise }))}
        writing={[]}
        labels={{ reading: '', exercises: `Práctica · ${title}`, writing: '' }}
        onFinish={setResult}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Practicar</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sesiones cortas de 12 ejercicios para reforzar lo que más cuesta en alemán. No cambian tu recorrido.
        </p>
      </header>

      <LevelPicker available={available} selected={levels} onToggle={toggle} count={words.length} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {modes.map((m) => {
          const exercises = practiceSession(m.mode, words, 4)
          const ok = exercises.length >= 4
          return (
            <button
              key={m.mode}
              disabled={!ok}
              onClick={() => setSession({ mode: m.mode, exercises: practiceSession(m.mode, words) })}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-md disabled:opacity-50 sm:flex-col sm:items-start dark:border-slate-800 dark:bg-slate-900"
            >
              <span lang="de" className="flex h-14 min-w-14 shrink-0 items-center justify-center rounded-xl bg-ink px-2 text-sm font-bold text-white">
                {m.glyph}
              </span>
              <span>
                <span className="block font-extrabold">{m.title}</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">{ok ? m.text : 'Completa más lecciones de palabras para practicar esto.'}</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="text-sm text-slate-500">
        ¿Prefieres las tablas? En <Link to="/tabla" className="font-bold text-accent hover:underline">Tabla</Link> está el conjugador con práctica, y los repasos
        pendientes están en <Link to="/repasar" className="font-bold text-accent hover:underline">Repasar</Link>.
      </p>
    </div>
  )
}

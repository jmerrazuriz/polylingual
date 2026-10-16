import { useState } from 'react'
import type { GrammarExercise } from '../../courses/grammar'
import { vocabLessons } from '../../courses/ja/vocab'
import { type AdjForm, type VerbForm, verbFormInfo } from '../../lib/conjugation'
import { adjFormInfo, buildDrill, DRILL_ADJ_FORMS, N4_VERB_FORMS, N5_VERB_FORMS } from '../../lib/conjugationDrill'
import { useProgress } from '../../lib/progress/store'
import { LearnTabs } from '../learn/LearnTabs'
import { GrammarExerciseView } from './GrammarExerciseView'

const chip = (on: boolean) =>
  `rounded-full border-2 px-3 py-1.5 text-sm font-bold transition ${
    on ? 'border-accent bg-accent/10 text-ink dark:text-white' : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400'
  }`

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])

/** Práctica de conjugación: se eligen las formas y se escribe cada una en kana. */
export function ConjugationPage() {
  const lessons = useProgress((s) => s.lessons)
  const [verbForms, setVerbForms] = useState<VerbForm[]>(['masu', 'masen', 'mashita', 'nai', 'ta', 'te'])
  const [adjForms, setAdjForms] = useState<AdjForm[]>(['negative', 'past'])
  const [onlyKnown, setOnlyKnown] = useState(true)
  const [drill, setDrill] = useState<GrammarExercise[] | null>(null)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])

  const known = new Set(vocabLessons.filter((l) => lessons[l.id]).flatMap((l) => l.words.map((w) => w.id)))

  const start = () => {
    setDrill(buildDrill({ verbForms, adjForms, known: onlyKnown ? known : undefined }))
    setIndex(0)
    setResults([])
  }

  if (drill && index < drill.length) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setDrill(null)} aria-label="Salir" className="text-xl text-slate-400 hover:text-slate-700">
            ×
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(index / drill.length) * 100}%` }} />
          </div>
          <span className="text-sm font-bold text-slate-500">
            {index + 1}/{drill.length}
          </span>
        </div>
        <GrammarExerciseView
          key={index}
          exercise={drill[index]}
          onDone={(ok) => {
            setResults([...results, ok])
            setIndex(index + 1)
          }}
        />
      </div>
    )
  }

  if (drill) {
    const correct = results.filter(Boolean).length
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-6 text-center">
        <span className="text-6xl" aria-hidden>
          {correct === drill.length ? '🎉' : '💪'}
        </span>
        <h1 className="text-2xl font-extrabold">
          {correct} de {drill.length} correctas
        </h1>
        <div className="flex gap-3">
          <button onClick={() => setDrill(null)} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
            Cambiar formas
          </button>
          <button onClick={start} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
            Otra ronda
          </button>
        </div>
      </section>
    )
  }

  const formChips = (forms: VerbForm[]) =>
    forms.map((f) => (
      <button key={f} onClick={() => setVerbForms(toggle(verbForms, f))} aria-pressed={verbForms.includes(f)} className={chip(verbForms.includes(f))}>
        <span lang="ja" className="font-jp">
          {verbFormInfo[f].example}
        </span>{' '}
        <span className="font-normal">{verbFormInfo[f].label.replace(/^\S+ \((.*)\)$/, '$1')}</span>
      </button>
    ))

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Practica la conjugación de verbos y adjetivos: te damos la palabra y la forma, tú la escribes en kana.
        </p>
      </header>
      <LearnTabs current="conjugacion" />

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Verbos · N5</h2>
        <div className="flex flex-wrap gap-2">{formChips(N5_VERB_FORMS)}</div>
        <h2 className="mt-2 text-sm font-extrabold text-slate-500 uppercase">Verbos · N4 (para más adelante)</h2>
        <div className="flex flex-wrap gap-2">{formChips(N4_VERB_FORMS)}</div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Adjetivos い y な</h2>
        <div className="flex flex-wrap gap-2">
          {DRILL_ADJ_FORMS.map((f) => (
            <button key={f} onClick={() => setAdjForms(toggle(adjForms, f))} aria-pressed={adjForms.includes(f)} className={chip(adjForms.includes(f))}>
              {adjFormInfo[f]}
            </button>
          ))}
        </div>
      </section>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={onlyKnown} onChange={(e) => setOnlyKnown(e.target.checked)} className="h-4 w-4" />
        Solo palabras de mis lecciones de vocabulario ({known.size}; si son muy pocas se usan todas)
      </label>

      <button
        onClick={start}
        disabled={verbForms.length + adjForms.length === 0}
        className="self-start rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90 disabled:opacity-40"
      >
        Empezar (10 preguntas)
      </button>
    </div>
  )
}

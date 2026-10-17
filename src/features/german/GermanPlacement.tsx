import { useState } from 'react'
import { Link } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { germanGrammar } from '../../courses/de/grammar'
import { germanPath } from '../../courses/de/path'
import { germanItemDone } from '../../courses/de/progress'
import { germanVocabLessonById, germanWordCard } from '../../courses/de/vocab'
import { meaningExercise, sayExercise } from '../../courses/de/vocabExercises'
import type { GrammarExercise } from '../../courses/grammar'
import type { PathItem, PathUnit } from '../../lib/path'
import { progressSnapshot, useProgress } from '../../lib/progress/store'
import { shuffle } from '../../lib/random'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'

// Test de nivelación del alemán: bloques de dos unidades del recorrido, de lo más fácil a lo
// más difícil. Cada bloque aprobado (80 %) completa sus lecciones y sus palabras entran al repaso.

const QUESTIONS = 8
const PASS = 0.8

type Block = { title: string; units: PathUnit[] }

const blocks: Block[] = (() => {
  const units = germanPath.filter((u) => !u.id.startsWith('examen-'))
  const out: Block[] = []
  for (let i = 0; i < units.length; i += 2) {
    const pair = units.slice(i, i + 2)
    out.push({ title: pair.map((u) => u.title.replace(/^[ABC][12] · /, '')).join(' y '), units: pair })
  }
  return out
})()

const itemsOf = (b: Block): PathItem[] => b.units.flatMap((u) => u.stops.flatMap((s) => s.items))

function buildQuestions(b: Block): GrammarExercise[] {
  const items = itemsOf(b)
  const grammar = items
    .filter((i) => i.kind === 'grammar')
    .flatMap((i) => germanGrammar.find((g) => g.id === i.id)!.exercises.filter((e) => e.type === 'choice' || e.type === 'type'))
  const words = items.filter((i) => i.kind === 'vocab').flatMap((i) => germanVocabLessonById.get(i.id)!.words)
  const vocab = shuffle(words)
    .slice(0, 3)
    .map((w, k) => (k % 2 ? meaningExercise(w) : sayExercise(w)))
  return shuffle([...shuffle(grammar).slice(0, QUESTIONS - vocab.length), ...vocab])
}

type Phase =
  | { kind: 'intro' }
  | { kind: 'block'; index: number; questions: GrammarExercise[]; step: number; correct: number }
  | { kind: 'done'; passed: number; last?: { correct: number; total: number } }

export function GermanPlacement() {
  const apply = useProgress((s) => s.applyPlacement)
  const [start] = useState(() => {
    const p = progressSnapshot()
    const i = blocks.findIndex((b) => !itemsOf(b).every((item) => germanItemDone(p, item)))
    return i === -1 ? blocks.length : i
  })
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' })

  const startBlock = (index: number) => setPhase({ kind: 'block', index, questions: buildQuestions(blocks[index]), step: 0, correct: 0 })

  const finish = (passed: number, last?: { correct: number; total: number }) => {
    if (passed > start) {
      const items = blocks.slice(0, passed).flatMap(itemsOf)
      apply({
        lessons: items
          .filter((i) => i.kind === 'vocab' || i.kind === 'reading')
          .map((i) => ({ id: i.id, chars: i.kind === 'vocab' ? germanVocabLessonById.get(i.id)!.words.map(germanWordCard) : [] })),
        grammar: items.filter((i) => i.kind === 'grammar').map((i) => i.id),
        units: [],
      })
    }
    setPhase({ kind: 'done', passed, last })
  }

  if (phase.kind === 'intro') {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-5 py-8 text-center">
        <span className="text-6xl" aria-hidden>
          🧭
        </span>
        <h1 className="text-2xl font-extrabold">Test de nivelación de alemán</h1>
        <p className="text-slate-600 dark:text-slate-400">
          ¿Ya sabes algo de alemán? Responde bloques de {QUESTIONS} preguntas, de lo más fácil (A1) a lo más difícil (B1). Cada bloque que apruebes con
          80 % completa esa parte del recorrido, y sus palabras entran a tus repasos. Puedes parar cuando quieras.
        </p>
        {start >= blocks.length ? (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">Ya completaste todo lo que cubre el test.</p>
        ) : (
          <button onClick={() => startBlock(start)} className="rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
            Empezar en el bloque {start + 1}
          </button>
        )}
        <ol className="flex w-full flex-col gap-1 text-left text-sm text-slate-500">
          {blocks.map((b, i) => (
            <li key={b.title}>
              {i < start ? '✓' : `${i + 1}.`} {b.title}
            </li>
          ))}
        </ol>
      </section>
    )
  }

  if (phase.kind === 'block') {
    const { index, questions, step, correct } = phase
    const answer = (ok: boolean) => {
      const score = correct + (ok ? 1 : 0)
      if (step + 1 < questions.length) return setPhase({ ...phase, step: step + 1, correct: score })
      if (score / questions.length >= PASS) {
        if (index + 1 < blocks.length) startBlock(index + 1)
        else finish(index + 1)
      } else finish(index, { correct: score, total: questions.length })
    }
    return (
      <div className="mx-auto flex max-w-md flex-col gap-5">
        <p className="text-sm font-bold text-slate-500 uppercase">
          Bloque {index + 1} de {blocks.length} · {blocks[index].title} · {step + 1}/{questions.length}
        </p>
        <GrammarExerciseView key={`${index}-${step}`} exercise={questions[step]} onDone={answer} onSkip={() => answer(false)} />
        <button onClick={() => finish(index)} className="self-center text-sm text-slate-500 underline">
          Parar aquí
        </button>
      </div>
    )
  }

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <span className="text-6xl" aria-hidden>
        {phase.passed > start ? '🎉' : '🧭'}
      </span>
      <h1 className="text-2xl font-extrabold">
        {phase.passed > start ? `Completaste ${phase.passed - start} ${phase.passed - start === 1 ? 'bloque' : 'bloques'}` : 'Empieza desde aquí'}
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        {phase.last ? `En el último bloque acertaste ${phase.last.correct} de ${phase.last.total}. ` : ''}
        Tu recorrido sigue desde {phase.passed < blocks.length ? `«${blocks[phase.passed].title}»` : 'el simulacro Goethe A1'}.
      </p>
      <SaveProgressPrompt />
      <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Ir al recorrido
      </Link>
    </section>
  )
}

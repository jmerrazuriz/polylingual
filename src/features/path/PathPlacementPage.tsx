import { useState } from 'react'
import { Link } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import type { GrammarExercise } from '../../courses/grammar'
import { isEuroCourse } from '../../courses/euroCourses'
import { coursePath } from '../../lib/coursePath'
import { EuroPlacement } from '../euro/EuroPlacement'
import { japanesePath } from '../../lib/path'
import {
  buildBlock,
  firstPendingBlock,
  passMark,
  type PlacementBlock,
  placementBlocks,
  placementResult,
  QUESTIONS_PER_BLOCK,
} from '../../lib/pathPlacement'
import { progressSnapshot, useProgress } from '../../lib/progress/store'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'

type Phase =
  | { kind: 'intro' }
  | { kind: 'block'; index: number; questions: GrammarExercise[]; step: number; correct: number }
  | { kind: 'passed'; index: number; correct: number; total: number }
  | { kind: 'done'; passed: number; lastScore?: { correct: number; total: number } }

const unitTitles = (blocks: PlacementBlock[]) =>
  blocks.flatMap((b) => b.unitIds).map((id) => japanesePath.find((u) => u.id === id)!.title)

/** El test de nivelación del curso activo (por ahora solo el japonés tiene). */
export function PathPlacementPage() {
  const course = useProgress((s) => s.course)
  if (isEuroCourse(course)) return <EuroPlacement />
  if (!coursePath(course).hasPlacement) {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
        <span className="text-6xl" aria-hidden>
          🧭
        </span>
        <h1 className="text-2xl font-extrabold">Test de nivelación</h1>
        <p className="text-slate-600 dark:text-slate-400">Este curso todavía no tiene test de nivelación. Llegará junto con su primer nivel.</p>
        <Link to="/aprender" className="rounded-full bg-ink px-5 py-2.5 font-bold text-white hover:opacity-90">
          Volver al recorrido
        </Link>
      </section>
    )
  }
  return <JapanesePlacement />
}

/**
 * Test de nivelación del recorrido: bloques de 8 preguntas de dificultad creciente.
 * Cada bloque aprobado (80 %) completa sus unidades; se puede parar entre bloques.
 */
function JapanesePlacement() {
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' })
  const apply = useProgress((s) => s.applyPlacement)
  // Quien vuelve con progreso empieza en el primer bloque que le falta.
  const [start] = useState(() => firstPendingBlock(progressSnapshot()))

  const startBlock = (index: number) => setPhase({ kind: 'block', index, questions: buildBlock(placementBlocks[index]), step: 0, correct: 0 })

  const finish = (passed: number, lastScore?: { correct: number; total: number }) => {
    if (passed > start) apply(placementResult(placementBlocks.slice(0, passed)))
    setPhase({ kind: 'done', passed, lastScore })
  }

  if (phase.kind === 'intro') {
    const allDone = start === placementBlocks.length
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-5 py-8 text-center">
        <span className="text-6xl" aria-hidden>
          🧭
        </span>
        <h1 className="text-2xl font-extrabold">Test de nivelación</h1>
        <p className="text-slate-600 dark:text-slate-400">
          ¿Ya sabes algo de japonés, o vuelves después de estudiar por tu cuenta? Responde bloques de {QUESTIONS_PER_BLOCK}{' '}
          preguntas, de lo más fácil (hiragana) a lo más difícil (el final del N5). Cada bloque que apruebes con 80 % desbloquea su
          parte del recorrido, y lo que ya sabes entra a tus repasos.
        </p>
        {start > 0 && !allDone && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            {start === 1 ? 'El primer bloque ya lo tienes completo' : `Los primeros ${start} bloques ya los tienes completos`}: empiezas
            en el bloque {start + 1}. El test solo agrega progreso, nunca borra lo que ya hiciste.
          </p>
        )}
        <ol className="flex w-full flex-col gap-1 text-left text-sm">
          {placementBlocks.map((b, i) => (
            <li
              key={b.id}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                i < start ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <span className="font-extrabold text-slate-400">{i < start ? '✓' : i + 1}</span>
              {b.title}
            </li>
          ))}
        </ol>
        {allDone ? (
          <>
            <p className="font-bold">¡Ya completaste todo el recorrido! No hay nada que nivelar.</p>
            <Link to="/aprender" className="rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
              Ir al recorrido
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500">
              Si no sabes una respuesta, toca «No lo sé»: adivinar solo te adelanta a lecciones difíciles.
            </p>
            <button onClick={() => startBlock(start)} className="rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
              Empezar el test
            </button>
            <Link to="/aprender" className="text-sm font-bold text-slate-500 underline">
              {start > 0 ? 'Mejor sigo donde iba' : 'Mejor empiezo desde cero'}
            </Link>
          </>
        )}
      </section>
    )
  }

  if (phase.kind === 'block') {
    const { index, questions, step, correct } = phase
    const block = placementBlocks[index]
    const answer = (ok: boolean) => {
      const score = correct + (ok ? 1 : 0)
      if (step + 1 < questions.length) {
        setPhase({ ...phase, step: step + 1, correct: score })
        return
      }
      const total = questions.length
      if (score < passMark(total)) finish(index, { correct: score, total })
      else if (index + 1 === placementBlocks.length) finish(index + 1)
      else setPhase({ kind: 'passed', index, correct: score, total })
    }
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => finish(index)} aria-label="Terminar el test" className="text-xl text-slate-400 hover:text-slate-700">
            ×
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(step / questions.length) * 100}%` }} />
          </div>
          <span className="text-sm font-bold text-slate-500">
            {step + 1}/{questions.length}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-500">
          Bloque {index + 1} de {placementBlocks.length} · {block.title}
        </p>
        <GrammarExerciseView key={`${index}-${step}`} exercise={questions[step]} onDone={answer} onSkip={() => answer(false)} />
      </div>
    )
  }

  if (phase.kind === 'passed') {
    const { index, correct, total } = phase
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
        <span className="text-6xl" aria-hidden>
          ✅
        </span>
        <h1 className="text-2xl font-extrabold">¡Bloque {index + 1} aprobado!</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {correct} de {total} correctas en «{placementBlocks[index].title}». ¿Seguimos con «{placementBlocks[index + 1].title}»?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => finish(index + 1)} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
            Terminar aquí
          </button>
          <button onClick={() => startBlock(index + 1)} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
            Siguiente bloque →
          </button>
        </div>
      </section>
    )
  }

  const titles = unitTitles(placementBlocks.slice(start, phase.passed))
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <span className="text-6xl" aria-hidden>
        {titles.length ? '🎓' : '🌱'}
      </span>
      <h1 className="text-2xl font-extrabold">
        {phase.passed === placementBlocks.length
          ? '¡Ya dominas todo el N5 del curso!'
          : titles.length
            ? `Desbloqueaste ${titles.length} ${titles.length === 1 ? 'unidad' : 'unidades'}`
            : start > 0
              ? 'Sigues donde ibas'
              : 'Empezamos desde el principio'}
      </h1>
      {phase.lastScore && (
        <p className="text-slate-600 dark:text-slate-400">
          En «{placementBlocks[phase.passed].title}» acertaste {phase.lastScore.correct} de {phase.lastScore.total}: desde ahí
          sigue tu recorrido.
        </p>
      )}
      {titles.length > 0 ? (
        <>
          <p className="text-slate-600 dark:text-slate-400">Las marcamos como completadas y lo que ya sabes entra a tus repasos:</p>
          <ul className="flex flex-wrap justify-center gap-1.5">
            {titles.map((t) => (
              <li key={t} className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ✓ {t}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          {start > 0 ? 'No pasa nada: tu recorrido sigue igual que antes.' : 'No pasa nada: la primera lección es justo para ti.'}
        </p>
      )}
      <SaveProgressPrompt />
      <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Ir al recorrido
      </Link>
    </section>
  )
}

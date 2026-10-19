import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { italianCourse } from '../../courses/it/course'
import { cilsExams, type CilsModule, cilsPassedKey, moduleNames, scoreCils } from '../../courses/it/exams'
import { cilsTasks } from '../../courses/it/examTasks'
import type { CefrLevel } from '../../courses/it/levels'
import { italianTexts } from '../../courses/it/texts'
import type { ReadingText } from '../../courses/reading'
import { useProgress } from '../../lib/progress/store'
import { shuffle } from '../../lib/random'
import { ChecklistModule, ExercisesModule, QuestionsModule, type Result, WritingModule } from './ExamModules'

// Simulacro estilo CILS (Università per Stranieri di Siena): escuchar, leer, estructuras de
// comunicación, escribir y hablar. Cada prueba tiene su mínimo y se aprueba solo si se pasan
// todas. Escuchar, leer y estructuras se corrigen solos y deciden el aprobado orientativo;
// escribir combina una ficha corregida con una autoevaluación, y hablar es autoevaluación guiada
// (sin IA). Ver PLAN_ITALIANO.md.

function pickTexts(level: CefrLevel, kind: 'reading' | 'dialogue', n: number): ReadingText[] {
  return shuffle(italianTexts.filter((t) => t.level === level && t.kind === kind)).slice(0, n)
}

export function CilsExamPage() {
  const { level: param } = useParams()
  const level = param?.toUpperCase() as CefrLevel
  const exam = cilsExams[level]
  const hasTexts = italianTexts.some((t) => t.level === level)
  if (!exam || !hasTexts || !cilsTasks[level]) return <ComingSoon title="Este simulacro llegará con su nivel" />
  return <CilsExam key={level} level={level} />
}

type Phase = 'intro' | CilsModule | 'result'

function CilsExam({ level }: { level: CefrLevel }) {
  const exam = cilsExams[level]
  const t = cilsTasks[level]!
  const [phase, setPhase] = useState<Phase>('intro')
  const [results, setResults] = useState<Partial<Record<CilsModule, Result>>>({})
  const [ascolto] = useState(() => pickTexts(level, 'dialogue', 2))
  const [lettura] = useState(() => pickTexts(level, 'reading', 2))
  const [structures] = useState(() => shuffle(t.structures))
  const submitRecord = useProgress((s) => s.submitRecord)
  const order = exam.modules

  const finishModule = (m: CilsModule, r: Result) => {
    const next = { ...results, [m]: r }
    setResults(next)
    const i = order.indexOf(m)
    if (i + 1 < order.length) setPhase(order[i + 1])
    else {
      if (scoreCils(level, next).passedAuto) submitRecord(cilsPassedKey(level), 1)
      setPhase('result')
    }
  }

  if (phase === 'intro') {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4 py-6">
        <span className="text-6xl" aria-hidden>
          📝
        </span>
        <h1 className="text-2xl font-extrabold">Simulacro {exam.name}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Cinco pruebas de {exam.max} puntos, como el examen real, y hay que aprobar <strong>cada una</strong> con al menos {exam.minimum}/{exam.max}.{' '}
          <strong>Escuchar</strong>, <strong>leer</strong> y <strong>estructuras</strong> (gramática y léxico) se corrigen solos y deciden si apruebas.{' '}
          <strong>Escribir</strong> combina una parte que se corrige sola con una autoevaluación, y <strong>hablar</strong> es una autoevaluación guiada:
          practícalo en voz alta, idealmente con alguien.
        </p>
        <ul className="flex flex-col gap-1 text-sm">
          {order.map((m) => (
            <li key={m}>
              {moduleNames[m]} · ~{exam.minutes[m]} min {m === 'scrittura' ? '(en parte autoevaluado)' : exam.autoScored.includes(m) ? '' : '(autoevaluado)'}
            </li>
          ))}
        </ul>
        <button onClick={() => setPhase(order[0])} className="self-start rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Empezar
        </button>
      </section>
    )
  }

  if (phase === 'ascolto') return <QuestionsModule key="ascolto" title={moduleNames.ascolto} texts={ascolto} listen lang="it" onDone={(r) => finishModule('ascolto', r)} />
  if (phase === 'lettura') return <QuestionsModule key="lettura" title={moduleNames.lettura} texts={lettura} listen={false} lang="it" onDone={(r) => finishModule('lettura', r)} />
  if (phase === 'strutture') return <ExercisesModule title={moduleNames.strutture} exercises={structures} onDone={(r) => finishModule('strutture', r)} />
  if (phase === 'scrittura') return <WritingModule title={moduleNames.scrittura} formTask={t.form} messageTask={t.message} lang="it" check={italianCourse.check} onDone={(r) => finishModule('scrittura', r)} />
  if (phase === 'orale') return <ChecklistModule title={moduleNames.orale} checks={t.speaking} onDone={(r) => finishModule('orale', r)} />

  const score = scoreCils(level, results)
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-6 text-center">
      <span className="text-6xl" aria-hidden>
        {score.passedAuto ? '🎉' : '💪'}
      </span>
      <h1 className="text-2xl font-extrabold">{score.passedAuto ? '¡Aprobaste el simulacro!' : 'Todavía no: sigue practicando'}</h1>
      <p className="text-3xl font-extrabold">
        {score.total}/{score.outOf}
      </p>
      <dl className="grid w-full grid-cols-2 gap-2 text-left">
        {order.map((m) => (
          <div key={m} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <dt className="text-xs font-bold text-slate-500 uppercase">
              {moduleNames[m]} {m === 'scrittura' ? '· en parte autoevaluado' : exam.autoScored.includes(m) ? '' : '· autoevaluado'}
            </dt>
            <dd className={`text-2xl font-extrabold ${score.failed.includes(m) ? 'text-red-600' : ''}`}>
              {score.points[m] ?? 0}/{exam.max}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-slate-500">
        En el CILS se aprueba solo con al menos {exam.minimum}/{exam.max} en cada prueba. Aquí el aprobado depende de escuchar, leer y estructuras; escribir y
        hablar son de práctica, porque no hay corrección automática de textos libres.
        {score.passed !== null && (score.passed ? ' Con tu autoevaluación, también aprobarías las cinco pruebas.' : ' Con tu autoevaluación, todavía falta alguna prueba.')}
      </p>
      <SaveProgressPrompt />
      <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Volver al recorrido
      </Link>
    </section>
  )
}

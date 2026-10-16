import { useState } from 'react'
import { Link } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { buildExtraLesson } from '../../lib/extra'
import { progressSnapshot } from '../../lib/progress/store'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'
import { type Answer, ReadingSession } from '../practice/ReadingSession'
import { type WritingResult, WritingSession } from '../practice/WritingSession'

type Phase = 'reading' | 'exercises' | 'writing' | 'done'

/** Lección extra sin límite: lectura → ejercicios variados → escritura, y se puede pedir otra. */
export function ExtraLessonPage() {
  const [round, setRound] = useState(1)
  return <ExtraRound key={round} round={round} onAnother={() => setRound(round + 1)} />
}

function ExtraRound({ round, onAnother }: { round: number; onAnother: () => void }) {
  const [lesson] = useState(() => buildExtraLesson(progressSnapshot()))
  const [phase, setPhase] = useState<Phase>('reading')
  const [reading, setReading] = useState<Answer[]>([])
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [exerciseOk, setExerciseOk] = useState(0)
  const [writing, setWriting] = useState<WritingResult[]>([])

  const afterExercises = () => setPhase(lesson.writing.length ? 'writing' : 'done')

  const header = (
    <p className="text-center text-sm font-extrabold text-slate-500 uppercase">
      ♾️ Lección extra #{round}
    </p>
  )

  if (phase === 'reading') {
    return (
      <div className="flex flex-col gap-3">
        {header}
        <ReadingSession
          questions={lesson.reading}
          onFinish={(answers) => {
            setReading(answers)
            if (lesson.exercises.length) setPhase('exercises')
            else afterExercises()
          }}
        />
      </div>
    )
  }

  if (phase === 'exercises') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-3">
        {header}
        <GrammarExerciseView
          key={exerciseIndex}
          exercise={lesson.exercises[exerciseIndex]}
          onDone={(ok) => {
            setExerciseOk(exerciseOk + (ok ? 1 : 0))
            if (exerciseIndex + 1 < lesson.exercises.length) setExerciseIndex(exerciseIndex + 1)
            else afterExercises()
          }}
        />
      </div>
    )
  }

  if (phase === 'writing') {
    return (
      <div className="flex flex-col gap-3">
        {header}
        <WritingSession
          items={lesson.writing}
          help="guide"
          onFinish={(results) => {
            setWriting(results)
            setPhase('done')
          }}
        />
      </div>
    )
  }

  const readOk = reading.filter((a) => a.correct).length
  const writeOk = writing.filter((w) => (w.score ?? 0) >= 4).length
  const total = reading.length + lesson.exercises.length + writing.length
  const correct = readOk + exerciseOk + writeOk

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <span className="text-6xl" aria-hidden>
        ♾️
      </span>
      <h1 className="text-2xl font-extrabold">Lección extra completada</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Acertaste {correct} de {total}. Cada lección extra se arma al azar con lo que ya aprendiste: haz todas las que quieras.
      </p>
      <SaveProgressPrompt />
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/aprender" className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
          Recorrido
        </Link>
        <button onClick={onAnother} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Otra lección extra
        </button>
      </div>
    </section>
  )
}

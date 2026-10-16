import { useState } from 'react'
import type { WritingHelp } from '../../components/WritingCanvas'
import { useProgress } from '../../lib/progress/store'
import type { Question } from '../../lib/quiz'
import type { TaggedExercise } from '../../lib/studyExercises'
import type { WritingItem } from '../../lib/writing'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'
import { type Answer, ReadingSession } from './ReadingSession'
import { type WritingResult, WritingSession } from './WritingSession'

export type MixedResult = { reading: Answer[]; exercises: boolean[]; writing: WritingResult[] }

type Props = {
  reading: Question[]
  /** Ejercicios de opción (p. ej. kanji); si traen `char`, reprograman su tarjeta. */
  exercises?: TaggedExercise[]
  writing: WritingItem[]
  writingHelp?: WritingHelp
  /** Títulos de cada parte (p. ej. «Repaso de lectura»). */
  labels?: { reading: string; exercises?: string; writing: string }
  onFinish: (result: MixedResult) => void
}

type Phase = 'reading' | 'exercises' | 'writing'

/** Lectura → ejercicios → escritura; se saltan las partes vacías. */
export function MixedSession({ reading, exercises = [], writing, writingHelp = 'memory', labels, onFinish }: Props) {
  const phases = (['reading', 'exercises', 'writing'] as const).filter(
    (p) => (p === 'reading' ? reading : p === 'exercises' ? exercises : writing).length > 0,
  )
  const [phase, setPhase] = useState<Phase>(phases[0] ?? 'writing')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([])

  /** Pasa a la fase siguiente o termina con lo acumulado. */
  const advance = (from: Phase, result: { reading?: Answer[]; exercises?: boolean[] }) => {
    const nextPhase = phases[phases.indexOf(from) + 1]
    const readingDone = result.reading ?? answers
    const exercisesDone = result.exercises ?? exerciseResults
    if (nextPhase) {
      setAnswers(readingDone)
      setExerciseResults(exercisesDone)
      setPhase(nextPhase)
    } else {
      onFinish({ reading: readingDone, exercises: exercisesDone, writing: [] })
    }
  }

  if (phase === 'reading') {
    return (
      <div className="flex flex-col gap-3">
        {labels && <PhaseTitle text={`${labels.reading} · ${reading.length}`} />}
        <ReadingSession questions={reading} onFinish={(result) => advance('reading', { reading: result })} />
      </div>
    )
  }

  if (phase === 'exercises') {
    const current = exercises[exerciseIndex]
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-3">
        {labels && (
          <PhaseTitle text={`${labels.exercises ?? labels.reading} · ${exerciseIndex + 1}/${exercises.length}`} />
        )}
        <GrammarExerciseView
          key={exerciseIndex}
          exercise={current.exercise}
          onDone={(ok) => {
            if (current.char) useProgress.getState().recordReading(current.char, ok)
            const results = [...exerciseResults, ok]
            if (exerciseIndex + 1 < exercises.length) {
              setExerciseResults(results)
              setExerciseIndex(exerciseIndex + 1)
            } else {
              advance('exercises', { exercises: results })
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {labels && <PhaseTitle text={`${labels.writing} · ${writing.length}`} />}
      <WritingSession
        items={writing}
        help={writingHelp}
        onFinish={(results) => onFinish({ reading: answers, exercises: exerciseResults, writing: results })}
      />
    </div>
  )
}

function PhaseTitle({ text }: { text: string }) {
  return <p className="text-center text-sm font-extrabold text-slate-500 uppercase">{text}</p>
}

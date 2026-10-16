import { useState } from 'react'
import type { WritingHelp } from '../../components/WritingCanvas'
import type { Question } from '../../lib/quiz'
import type { WritingItem } from '../../lib/writing'
import { type Answer, ReadingSession } from './ReadingSession'
import { type WritingResult, WritingSession } from './WritingSession'

export type MixedResult = { reading: Answer[]; writing: WritingResult[] }

type Props = {
  reading: Question[]
  writing: WritingItem[]
  writingHelp?: WritingHelp
  /** Títulos de cada parte (p. ej. «Repaso de lectura»). */
  labels?: { reading: string; writing: string }
  onFinish: (result: MixedResult) => void
}

/** Primero las preguntas de lectura y después la escritura; se saltan las partes vacías. */
export function MixedSession({ reading, writing, writingHelp = 'memory', labels, onFinish }: Props) {
  const [phase, setPhase] = useState<'reading' | 'writing'>(reading.length ? 'reading' : 'writing')
  const [answers, setAnswers] = useState<Answer[]>([])

  if (phase === 'reading') {
    return (
      <div className="flex flex-col gap-3">
        {labels && <PhaseTitle text={`${labels.reading} · ${reading.length}`} />}
        <ReadingSession
          questions={reading}
          onFinish={(result) => {
            if (writing.length) {
              setAnswers(result)
              setPhase('writing')
            } else {
              onFinish({ reading: result, writing: [] })
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {labels && <PhaseTitle text={`${labels.writing} · ${writing.length}`} />}
      <WritingSession items={writing} help={writingHelp} onFinish={(results) => onFinish({ reading: answers, writing: results })} />
    </div>
  )
}

function PhaseTitle({ text }: { text: string }) {
  return <p className="text-center text-sm font-extrabold text-slate-500 uppercase">{text}</p>
}

import { useEffect, useState } from 'react'
import type { Kana } from '../../content/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { romajiOptions } from '../../lib/quiz'
import { shuffle } from '../../lib/random'

type Props = {
  /** Caracteres que se preguntan. */
  items: Kana[]
  /** Caracteres de los que salen las opciones incorrectas. */
  pool: Kana[]
  onDone: (correct: number, total: number) => void
}

const AUTO_ADVANCE_MS = 700

/** Repaso corto: se muestra un carácter y se elige su romaji. */
export function LessonQuiz({ items, pool, onDone }: Props) {
  const [questions] = useState(() => shuffle(items).map((kana) => ({ kana, options: romajiOptions(kana, pool) })))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const { speak } = useSpeech()

  const question = questions[index]
  const isRight = picked === question.kana.romaji

  const next = () => {
    if (index + 1 === questions.length) {
      onDone(correct, questions.length)
    } else {
      setIndex(index + 1)
      setPicked(null)
    }
  }

  useEffect(() => {
    if (!isRight) return
    const timer = setTimeout(next, AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  })

  const pick = (option: string) => {
    if (picked) return
    setPicked(option)
    if (option === question.kana.romaji) setCorrect((n) => n + 1)
    speak(question.kana.char)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-bold text-slate-500">
        Repaso · {index + 1} de {questions.length}
      </p>
      <span className="font-jp text-8xl font-bold">{question.kana.char}</span>
      <p className="text-slate-600 dark:text-slate-400">¿Cómo se lee?</p>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {question.options.map((option) => {
          const isAnswer = option === question.kana.romaji
          let style = 'border-slate-200 bg-white hover:border-accent dark:border-slate-800 dark:bg-slate-900'
          if (picked && isAnswer) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
          else if (picked === option) style = 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200'
          else if (picked) style = 'border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-900'
          return (
            <button
              key={option}
              onClick={() => pick(option)}
              disabled={picked !== null}
              className={`rounded-2xl border-2 py-4 text-2xl font-extrabold transition ${style}`}
            >
              {picked && isAnswer && '✓ '}
              {picked === option && !isAnswer && '✗ '}
              {option}
            </button>
          )
        })}
      </div>

      <div className="h-12">
        {picked && !isRight && (
          <button onClick={next} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
            Siguiente
          </button>
        )}
      </div>
    </div>
  )
}

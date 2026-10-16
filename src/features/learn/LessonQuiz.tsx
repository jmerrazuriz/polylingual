import { useState } from 'react'
import type { Kana } from '../../courses/ja/types'
import { type Question, romajiOptions } from '../../lib/quiz'
import { shuffle } from '../../lib/random'
import { ReadingSession } from '../practice/ReadingSession'

type Props = {
  /** Caracteres que se preguntan. */
  items: Kana[]
  /** Caracteres de los que salen las opciones incorrectas. */
  pool: Kana[]
  onDone: (correct: number, total: number) => void
}

/** Repaso corto al final de una lección: se muestra un carácter y se elige su romaji. */
export function LessonQuiz({ items, pool, onDone }: Props) {
  const [questions] = useState<Question[]>(() =>
    shuffle(items).map((kana) => ({ type: 'kana-to-romaji', kana, options: romajiOptions(kana, pool) })),
  )
  return (
    <ReadingSession
      questions={questions}
      onFinish={(answers) => onDone(answers.filter((a) => a.correct).length, answers.length)}
    />
  )
}

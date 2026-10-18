import { type ReactNode, useEffect, useRef, useState } from 'react'
import { allKana, kanaByChar } from '../../courses/ja/kana'
import type { Kana } from '../../courses/ja/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { type Question, questionPrompt } from '../../lib/quiz'
import { matchesReading, romajiReadings } from '../../lib/romaji'
import { useProgress } from '../../lib/progress/store'
import { wordReadings } from '../../lib/words'

export type Answer = { question: Question; correct: boolean; given: string | null }

type Props = {
  questions: Question[]
  /** Segundos por pregunta; sin valor no hay contrarreloj. */
  secondsPerQuestion?: number
  /** Muestra «No lo sé» también en las preguntas de opción múltiple (test de nivel). */
  allowSkip?: boolean
  onFinish: (answers: Answer[]) => void
}

const AUTO_ADVANCE_MS = 700

/** Corre una lista de preguntas de lectura y devuelve las respuestas al terminar. */
export function ReadingSession({ questions, secondsPerQuestion, allowSkip, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const { speak } = useSpeech()

  const question = questions[index]
  const current = answers[index]

  const answer = (correct: boolean, given: string | null) => {
    if (current) return
    setAnswers([...answers, { question, correct, given }])
    if (question.type !== 'type-word') useProgress.getState().recordReading(question.kana.char, correct)
    speak(questionPrompt(question).kana)
  }

  const next = () => {
    if (index + 1 === questions.length) onFinish(answers)
    else setIndex(index + 1)
  }

  // Avanza solo tras un acierto; tras un error espera a que se toque "Siguiente".
  useEffect(() => {
    if (!current?.correct) return
    const timer = setTimeout(next, AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  })

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5">
      <div className="flex w-full items-center gap-3">
        <span className="text-sm font-bold text-slate-500">
          {index + 1}/{questions.length}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>
      </div>

      {secondsPerQuestion && !current && (
        <Countdown key={`timer-${index}`} seconds={secondsPerQuestion} onTimeout={() => answer(false, null)} />
      )}

      {question.type === 'kana-to-romaji' && (
        <Choice
          prompt={
            <span lang="ja" className="font-jp text-8xl font-bold">
              {question.kana.char}
            </span>
          }
          hint="¿Cómo se lee?"
          options={question.options.map((o) => ({ key: o, label: o, isAnswer: o === question.kana.romaji }))}
          picked={current?.given ?? null}
          done={!!current}
          onPick={(o) => answer(o === question.kana.romaji, o)}
        />
      )}

      {question.type === 'romaji-to-kana' && (
        <Choice
          prompt={<span className="text-6xl font-extrabold text-accent">{question.kana.romaji}</span>}
          hint="¿Cuál es?"
          options={question.options.map((k: Kana) => ({ key: k.char, label: k.char, isAnswer: k.char === question.kana.char, jp: true }))}
          picked={current?.given ?? null}
          done={!!current}
          onPick={(c) => answer(c === question.kana.char, c)}
        />
      )}

      {question.type === 'type-romaji' && (
        <TypeAnswer
          key={index}
          prompt={question.kana.char}
          hint="Escribe cómo se lee"
          done={!!current}
          onSubmit={(text) => answer(matchesReading(text, romajiReadings(question.kana.char)), text)}
        />
      )}

      {question.type === 'type-word' && (
        <TypeAnswer
          key={index}
          prompt={question.word.kana}
          hint="Escribe la palabra en romaji"
          done={!!current}
          onSubmit={(text) => answer(matchesReading(text, wordReadings(question.word)), text)}
        />
      )}

      {allowSkip && !current && (question.type === 'kana-to-romaji' || question.type === 'romaji-to-kana') && (
        <button onClick={() => answer(false, '')} className="text-sm font-semibold text-slate-500 hover:underline">
          No lo sé
        </button>
      )}

      {current && <Feedback answer={current} />}

      <div className="h-12">
        {current && !current.correct && (
          <button onClick={next} autoFocus className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
            {index + 1 === questions.length ? 'Ver resultados' : 'Siguiente'}
          </button>
        )}
      </div>
    </div>
  )
}

type Option = { key: string; label: string; isAnswer: boolean; jp?: boolean }

function Choice(props: {
  prompt: ReactNode
  hint: string
  options: Option[]
  picked: string | null
  done: boolean
  onPick: (key: string) => void
}) {
  const { prompt, hint, options, picked, done, onPick } = props
  return (
    <>
      {prompt}
      <p className="text-slate-600 dark:text-slate-400">{hint}</p>
      <div className={`grid w-full gap-3 ${options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((o) => {
          let style = 'border-slate-200 bg-white hover:border-accent dark:border-slate-800 dark:bg-slate-900'
          if (done && o.isAnswer) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
          else if (done && picked === o.key) style = 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200'
          else if (done) style = 'border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-900'
          return (
            <button
              key={o.key}
              onClick={() => onPick(o.key)}
              disabled={done}
              className={`rounded-2xl border-2 py-4 font-extrabold transition ${o.jp ? 'font-jp text-4xl' : 'text-2xl'} ${style}`}
            >
              {done && o.isAnswer && '✓ '}
              {done && picked === o.key && !o.isAnswer && '✗ '}
              {o.label}
            </button>
          )
        })}
      </div>
    </>
  )
}

function TypeAnswer(props: { prompt: string; hint: string; done: boolean; onSubmit: (text: string) => void }) {
  const { prompt, hint, done, onSubmit } = props
  const [text, setText] = useState('')
  return (
    <>
      <span lang="ja" className={`font-jp font-bold ${[...prompt].length > 2 ? 'text-6xl' : 'text-8xl'}`}>
        {prompt}
      </span>
      <p className="text-slate-600 dark:text-slate-400">{hint}</p>
      <form
        className="flex w-full gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (text.trim()) onSubmit(text)
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={done}
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          placeholder="romaji"
          aria-label="Respuesta en romaji"
          className="min-w-0 flex-1 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-xl font-bold outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900"
        />
        <button
          type="submit"
          disabled={done || !text.trim()}
          className="rounded-2xl bg-ink px-5 font-bold text-white disabled:opacity-40"
        >
          Comprobar
        </button>
      </form>
      {!done && (
        <button onClick={() => onSubmit('')} className="text-sm font-semibold text-slate-500 hover:underline">
          No lo sé
        </button>
      )}
    </>
  )
}

function Feedback({ answer }: { answer: Answer }) {
  const { question, correct } = answer
  const tip = 'tip' in question ? question.tip : undefined
  const word = question.type === 'type-word' ? question.word : undefined
  const { answer: expected } = questionPrompt(question)

  return (
    <div
      role="status"
      className={`flex w-full flex-col gap-1 rounded-2xl p-3 text-sm ${
        correct
          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
          : 'bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200'
      }`}
    >
      <p className="font-extrabold">
        {correct ? '✓ ¡Correcto!' : answer.given === null ? '⏱ Se acabó el tiempo' : '✗ No es correcto'}
        {(!correct || word) && (
          <>
            {' '}
            · se lee <span className="text-base">{expected}</span>
          </>
        )}
      </p>
      {word && <p>Significa «{word.meaning}».</p>}
      {!correct && <WrongPick answer={answer} />}
      {tip && !correct && <p>💡 {tip}</p>}
    </div>
  )
}

function Countdown({ seconds, onTimeout }: { seconds: number; onTimeout: () => void }) {
  const callback = useRef(onTimeout)
  useEffect(() => {
    callback.current = onTimeout
  })
  useEffect(() => {
    const timer = setTimeout(() => callback.current(), seconds * 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-hidden>
      <div className="countdown h-full rounded-full bg-amber-500" style={{ animationDuration: `${seconds}s` }} />
    </div>
  )
}

/** Qué es lo que se eligió por error: «o» es お; ぬ se lee «nu». */
function WrongPick({ answer }: { answer: Answer }) {
  const { question, given } = answer
  if (!given || question.type === 'type-word') return null
  const script = question.kana.script
  if (question.type === 'romaji-to-kana') {
    const picked = kanaByChar.get(given)
    return picked ? <p>Elegiste <span className="font-jp text-base">{picked.char}</span>, que se lee «{picked.romaji}».</p> : null
  }
  const same = allKana.find((k) => k.script === script && k.romaji === given.trim().toLowerCase())
  return same ? (
    <p>
      «{given}» es <span className="font-jp text-base">{same.char}</span>; <span className="font-jp text-base">{question.kana.char}</span> se lee «{question.kana.romaji}».
    </p>
  ) : (
    <p>Respondiste «{given}».</p>
  )
}

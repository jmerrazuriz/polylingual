import { useState } from 'react'
import { Furigana } from '../../components/Furigana'
import { KanaInput } from '../../components/KanaInput'
import type { GrammarExercise } from '../../courses/grammar'
import { finishKana, matchesKana } from '../../lib/kanaInput'
import { useSpeech } from '../../lib/audio/useSpeech'
import { shuffle } from '../../lib/random'

const KANA = /[぀-ヿ]/

/**
 * Qué leer en voz alta al responder una pregunta de opción: la frase completa si es
 * de completar; si no, la respuesta cuando está en japonés (¿Cómo se dice «comer»? → たべる).
 */
function choiceSpeech(exercise: Extract<GrammarExercise, { type: 'choice' }>): string {
  if (exercise.prompt.includes('＿')) return exercise.prompt.replace('＿', exercise.answer)
  return KANA.test(exercise.answer) ? exercise.answer : exercise.prompt
}
const jpClass = (text: string) => (KANA.test(text) ? 'font-jp' : '')

type Props = {
  exercise: GrammarExercise
  onDone: (correct: boolean) => void
  /** Muestra «No lo sé» mientras no se responde; cuenta como incorrecta. */
  onSkip?: () => void
}

/** Un ejercicio de gramática con su corrección. Se avanza con «Siguiente». */
export function GrammarExerciseView({ exercise, onDone, onSkip }: Props) {
  const [result, setResult] = useState<boolean | null>(null)
  const { speak } = useSpeech()

  const check = (correct: boolean, spoken: string) => {
    setResult(correct)
    speak(spoken)
  }

  return (
    <div className="flex flex-col gap-5">
      {exercise.type === 'choice' && <Choice exercise={exercise} result={result} onAnswer={(ok) => check(ok, choiceSpeech(exercise))} />}
      {exercise.type === 'meaning' && <Meaning exercise={exercise} result={result} onAnswer={(ok) => check(ok, exercise.text)} />}
      {exercise.type === 'order' && <Order exercise={exercise} result={result} onAnswer={(ok) => check(ok, exercise.answer.join(' '))} />}
      {exercise.type === 'type' && <Type exercise={exercise} result={result} onAnswer={(ok) => check(ok, exercise.answers[0])} />}

      {result !== null && (
        <div
          role="status"
          className={`flex flex-col gap-1 rounded-2xl p-3 text-sm ${
            result
              ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
              : 'bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200'
          }`}
        >
          <p className="font-extrabold">{result ? '✓ ¡Correcto!' : '✗ No es correcto'}</p>
          {!result && <p>La respuesta es: <Answer exercise={exercise} /></p>}
          {(exercise.type === 'choice' || exercise.type === 'type') && exercise.explanation && <p>💡 {exercise.explanation}</p>}
        </div>
      )}

      {result === null && onSkip && (
        <button onClick={onSkip} className="self-center text-sm font-bold text-slate-500 underline hover:text-slate-800 dark:hover:text-white">
          No lo sé
        </button>
      )}

      {result !== null && (
        <button onClick={() => onDone(result)} autoFocus className="self-center rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
          Siguiente
        </button>
      )}
    </div>
  )
}

function Answer({ exercise }: { exercise: GrammarExercise }) {
  const text = exercise.type === 'order' ? exercise.answer.join(' ') : exercise.type === 'type' ? exercise.answers[0] : exercise.answer
  return (
    <span className={`font-bold ${jpClass(text)}`}>
      <Furigana text={text} />
    </span>
  )
}

const optionClass = (state: 'idle' | 'right' | 'wrong' | 'faded') =>
  `rounded-2xl border-2 px-3 py-3 text-lg font-bold transition ${
    state === 'right'
      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
      : state === 'wrong'
        ? 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200'
        : state === 'faded'
          ? 'border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-900'
          : 'border-slate-200 bg-white hover:border-accent dark:border-slate-800 dark:bg-slate-900'
  }`

function Options(props: { options: string[]; answer: string; result: boolean | null; onAnswer: (ok: boolean) => void }) {
  const { answer, result, onAnswer } = props
  const [options] = useState(() => shuffle(props.options))
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const state = result === null ? 'idle' : o === answer ? 'right' : o === picked ? 'wrong' : 'faded'
        return (
          <button
            key={o}
            disabled={result !== null}
            onClick={() => {
              setPicked(o)
              onAnswer(o === answer)
            }}
            className={`${optionClass(state)} ${jpClass(o)}`}
          >
            {state === 'right' && '✓ '}
            {state === 'wrong' && '✗ '}
            <Furigana text={o} />
          </button>
        )
      })}
    </div>
  )
}

function Choice({ exercise, result, onAnswer }: { exercise: Extract<GrammarExercise, { type: 'choice' }>; result: boolean | null; onAnswer: (ok: boolean) => void }) {
  const [before, after] = exercise.prompt.split('＿')
  const isBlank = after !== undefined
  return (
    <>
      <p className="text-sm font-bold text-slate-500 uppercase">
        {exercise.format === 'paraphrase'
          ? 'Elige la frase que significa lo mismo'
          : exercise.format === 'usage'
            ? 'Elige la frase que lo usa bien'
            : isBlank
              ? 'Completa la frase'
              : 'Elige la respuesta'}
      </p>
      <p className={`text-2xl font-bold ${jpClass(exercise.prompt)}`}>
        {isBlank ? (
          <>
            <Furigana text={before} />
            <span className="mx-1 inline-block min-w-12 border-b-4 border-accent text-center text-accent">
              {result !== null ? exercise.answer : ' '}
            </span>
            <Furigana text={after} />
          </>
        ) : (
          <Furigana text={exercise.prompt} />
        )}
      </p>
      {exercise.hint && <p className="text-slate-500">«{exercise.hint}»</p>}
      <Options options={exercise.options} answer={exercise.answer} result={result} onAnswer={onAnswer} />
    </>
  )
}

function Meaning({ exercise, result, onAnswer }: { exercise: Extract<GrammarExercise, { type: 'meaning' }>; result: boolean | null; onAnswer: (ok: boolean) => void }) {
  return (
    <>
      <p className="text-sm font-bold text-slate-500 uppercase">¿Qué significa?</p>
      <p lang="ja" className="font-jp text-2xl leading-loose font-bold">
        <Furigana text={exercise.text} />
      </p>
      <Options options={exercise.options} answer={exercise.answer} result={result} onAnswer={onAnswer} />
    </>
  )
}

/** Ordenar palabras: se tocan en la bolsa para agregarlas y en la frase para quitarlas. */
function Order({ exercise, result, onAnswer }: { exercise: Extract<GrammarExercise, { type: 'order' }>; result: boolean | null; onAnswer: (ok: boolean) => void }) {
  const [bank] = useState(() => {
    // Desordenadas, pero nunca ya en el orden correcto.
    let tiles = shuffle(exercise.answer.map((word, i) => ({ word, i })))
    if (tiles.every((t, k) => t.i === k) && tiles.length > 1) tiles = [...tiles.slice(1), tiles[0]]
    return tiles
  })
  const [chosen, setChosen] = useState<number[]>([])
  const done = result !== null

  return (
    <>
      <p className="text-sm font-bold text-slate-500 uppercase">Ordena las palabras</p>
      <p className="text-lg">«{exercise.meaning}»</p>
      <div
        aria-label="Tu frase"
        className={`flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3 ${
          done ? (result ? 'border-emerald-500' : 'border-red-500') : 'border-slate-300 dark:border-slate-700'
        }`}
      >
        {chosen.length === 0 && <span className="text-sm text-slate-400">Toca las palabras en orden…</span>}
        {chosen.map((tileIndex) => (
          <button
            key={tileIndex}
            disabled={done}
            onClick={() => setChosen(chosen.filter((c) => c !== tileIndex))}
            className="rounded-xl bg-ink px-3 py-2 font-jp text-lg text-white"
          >
            <Furigana text={bank[tileIndex].word} />
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {bank.map((tile, tileIndex) =>
          chosen.includes(tileIndex) ? (
            <span key={tileIndex} className="rounded-xl border-2 border-dashed border-slate-200 px-3 py-2 font-jp text-lg text-transparent dark:border-slate-800">
              <Furigana text={tile.word} />
            </span>
          ) : (
            <button
              key={tileIndex}
              disabled={done}
              onClick={() => setChosen([...chosen, tileIndex])}
              className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-jp text-lg hover:border-accent dark:border-slate-800 dark:bg-slate-900"
            >
              <Furigana text={tile.word} />
            </button>
          ),
        )}
      </div>
      {!done && (
        <button
          disabled={chosen.length !== bank.length}
          onClick={() => onAnswer(chosen.map((c) => bank[c].word).join(' ') === exercise.answer.join(' '))}
          className="self-center rounded-full bg-ink px-8 py-3 font-bold text-white disabled:opacity-40"
        >
          Comprobar
        </button>
      )}
    </>
  )
}

const normalizeText = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ')

/** Escribir la respuesta (en kana: el romaji se convierte al escribir). */
function Type({ exercise, result, onAnswer }: { exercise: Extract<GrammarExercise, { type: 'type' }>; result: boolean | null; onAnswer: (ok: boolean) => void }) {
  const [value, setValue] = useState('')
  const done = result !== null
  const submit = () => {
    if (!value.trim() || done) return
    // La «n» final que quedó en romaji se muestra como ん al corregir.
    if (exercise.kana) setValue(finishKana(value))
    onAnswer(
      exercise.kana ? matchesKana(value, exercise.answers) : exercise.answers.some((a) => normalizeText(a) === normalizeText(value)),
    )
  }
  return (
    <>
      <p className="text-sm font-bold text-slate-500 uppercase">Escribe la respuesta</p>
      <p className={`text-2xl font-bold ${jpClass(exercise.prompt)}`}>{exercise.prompt}</p>
      {exercise.hint && <p className="text-slate-500">{exercise.hint}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="flex flex-col gap-3"
      >
        {exercise.kana ? (
          <KanaInput value={value} onChange={setValue} disabled={done} state={done ? (result ? 'right' : 'wrong') : 'idle'} />
        ) : (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={done}
            autoFocus
            autoComplete="off"
            className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-xl dark:border-slate-800 dark:bg-slate-900"
          />
        )}
        {!done && (
          <button type="submit" disabled={!value.trim()} className="self-center rounded-full bg-ink px-8 py-3 font-bold text-white disabled:opacity-40">
            Comprobar
          </button>
        )}
      </form>
    </>
  )
}

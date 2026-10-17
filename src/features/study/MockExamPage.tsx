import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import type { ReadingText } from '../../courses/reading'
import { useSpeech } from '../../lib/audio/useSpeech'
import { buildMockExam, EXAM_MINUTES, EXAM_RECORD_KEY, type ExamItem, type ExamScore, type ExamSection, scoreExam, sectionInfo } from '../../lib/mockExam'
import { useProgress } from '../../lib/progress/store'
import { now } from '../../lib/time'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'
import { TextBody } from './ReadingPages'

/** Cada diálogo se puede escuchar como máximo esta cantidad de veces (en el examen real, una). */
const MAX_PLAYS = 2

const clock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Simulacro del JLPT N5: 4 secciones seguidas con 30 minutos en total. */
export function MockExamPage() {
  const [exam, setExam] = useState<{ items: ExamItem[]; endsAt: number } | null>(null)
  const [answers, setAnswers] = useState<(boolean | undefined)[]>([])
  const [score, setScore] = useState<ExamScore | null>(null)
  const best = useProgress((s) => s.records[EXAM_RECORD_KEY])
  const submitRecord = useProgress((s) => s.submitRecord)
  const [isRecord, setIsRecord] = useState(false)

  const finish = (items: ExamItem[], final: (boolean | undefined)[]) => {
    const result = scoreExam(items, final)
    setIsRecord(submitRecord(EXAM_RECORD_KEY, result.total))
    setScore(result)
  }

  if (score && exam) return <ExamResult score={score} best={best} isRecord={isRecord} onRetry={() => {
          setExam(null)
          setScore(null)
        }} />

  if (!exam) {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-5 py-8 text-center">
        <span className="text-6xl" aria-hidden>
          📝
        </span>
        <h1 className="text-2xl font-extrabold">Simulacro del JLPT N5</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Como el examen real, en cuatro partes y con tiempo: {EXAM_MINUTES} minutos para todo. Los diálogos se escuchan sin el
          texto, como máximo {MAX_PLAYS} veces.
        </p>
        <ol className="flex w-full flex-col gap-1 text-left text-sm">
          {(Object.keys(sectionInfo) as ExamSection[]).map((s, i) => (
            <li key={s} className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
              <span className="font-extrabold text-slate-400">{i + 1}</span>
              {sectionInfo[s].title}
              <span lang="ja" className="ml-auto font-jp text-slate-500">
                {sectionInfo[s].jp}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-slate-500">
          Se aprueba como el JLPT: 80 de 180 puntos, con al menos 38 de 120 en idioma y lectura, y 19 de 60 en audición.
          {best !== undefined && ` Tu mejor puntaje: ${best}/180.`}
        </p>
        <button
          onClick={() => {
            const items = buildMockExam()
            setAnswers([])
            setExam({ items, endsAt: now() + EXAM_MINUTES * 60_000 })
          }}
          className="rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90"
        >
          Empezar el simulacro
        </button>
      </section>
    )
  }

  return <ExamRunner exam={exam} answers={answers} setAnswers={setAnswers} onFinish={(final) => finish(exam.items, final)} />
}

function ExamRunner({
  exam,
  answers,
  setAnswers,
  onFinish,
}: {
  exam: { items: ExamItem[]; endsAt: number }
  answers: (boolean | undefined)[]
  setAnswers: (a: (boolean | undefined)[]) => void
  onFinish: (answers: (boolean | undefined)[]) => void
}) {
  const index = answers.length
  const item = exam.items[index]
  const [left, setLeft] = useState(() => exam.endsAt - now())
  const [plays, setPlays] = useState<Record<string, number>>({})
  const { stop } = useSpeech()

  useEffect(() => {
    const id = setInterval(() => {
      const ms = exam.endsAt - now()
      setLeft(ms)
      if (ms <= 0) {
        clearInterval(id)
        stop()
        onFinish(answers)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [exam.endsAt, answers, onFinish, stop])

  const firstOfText = item.text && exam.items.findIndex((i) => i.text === item.text) === index
  const sectionStart = exam.items.findIndex((i) => i.section === item.section) === index

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(index / exam.items.length) * 100}%` }} />
        </div>
        <span className={`font-mono text-sm font-bold ${left < 120_000 ? 'text-red-600' : 'text-slate-500'}`} aria-label="Tiempo restante">
          ⏱ {clock(left)}
        </span>
      </div>
      <p className="text-sm font-bold text-slate-500">
        {sectionInfo[item.section].title}{' '}
        <span lang="ja" className="font-jp">
          {sectionInfo[item.section].jp}
        </span>{' '}
        · {index + 1}/{exam.items.length}
      </p>
      {sectionStart && item.section === 'listening' && (
        <p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
          🎧 Escucha cada diálogo y responde. El texto no se muestra.
        </p>
      )}
      {item.text && item.section === 'reading' && (
        <details open={firstOfText} className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <summary className="cursor-pointer text-sm font-bold">📖 {item.text.title}</summary>
          <div className="mt-2">
            <TextBody text={item.text} showMeaning={false} />
          </div>
        </details>
      )}
      {item.text && item.section === 'listening' && (
        <ListeningPlayer
          text={item.text}
          plays={plays[item.text.id] ?? 0}
          onPlay={() => setPlays({ ...plays, [item.text!.id]: (plays[item.text!.id] ?? 0) + 1 })}
        />
      )}
      <GrammarExerciseView
        key={index}
        exercise={item.exercise}
        onDone={(ok) => {
          const next = [...answers, ok]
          if (next.length === exam.items.length) {
            stop()
            onFinish(next)
          } else setAnswers(next)
        }}
      />
    </div>
  )
}

/** Reproductor del diálogo: limitado a MAX_PLAYS veces por diálogo; sin voz, se muestra el texto. */
function ListeningPlayer({ text, plays, onPlay }: { text: ReadingText; plays: number; onPlay: () => void }) {
  const { available, speakLines } = useSpeech()
  const [playing, setPlaying] = useState(false)
  if (!available) return <TextBody text={text} showMeaning={false} />
  return (
    <button
      disabled={playing || plays >= MAX_PLAYS}
      onClick={() => {
        onPlay()
        setPlaying(true)
        speakLines(text.lines, () => setPlaying(false))
      }}
      className="self-start rounded-full border-2 border-accent px-5 py-2.5 font-bold disabled:opacity-40"
    >
      {playing ? '🔊 Escuchando…' : plays >= MAX_PLAYS ? 'Ya lo escuchaste 2 veces' : `▶ Escuchar (${MAX_PLAYS - plays} ${MAX_PLAYS - plays === 1 ? 'vez' : 'veces'})`}
    </button>
  )
}

function ExamResult({ score, best, isRecord, onRetry }: { score: ExamScore; best?: number; isRecord: boolean; onRetry: () => void }) {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-6 text-center">
      <span className="text-6xl" aria-hidden>
        {score.passed ? '🎓' : '📚'}
      </span>
      <h1 className="text-2xl font-extrabold">{score.passed ? '¡Aprobarías el N5!' : 'Todavía no alcanza'}</h1>
      <p className="text-4xl font-extrabold">
        {score.total}
        <span className="text-lg text-slate-500">/180</span>
      </p>
      {isRecord && <p className="font-bold text-emerald-600">¡Nuevo récord!</p>}
      {!isRecord && best !== undefined && <p className="text-sm text-slate-500">Tu mejor puntaje: {best}/180</p>}
      <dl className="grid w-full grid-cols-2 gap-2 text-left">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <dt className="text-xs font-bold text-slate-500 uppercase">Idioma y lectura</dt>
          <dd className={`text-2xl font-extrabold ${score.language < 38 ? 'text-red-600' : ''}`}>{score.language}/120</dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <dt className="text-xs font-bold text-slate-500 uppercase">Audición</dt>
          <dd className={`text-2xl font-extrabold ${score.listening < 19 ? 'text-red-600' : ''}`}>{score.listening}/60</dd>
        </div>
      </dl>
      <ul className="flex w-full flex-col gap-1 text-left text-sm">
        {(Object.keys(sectionInfo) as ExamSection[]).map((s) => (
          <li key={s} className="flex justify-between rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
            <span>{sectionInfo[s].title}</span>
            <span className="font-bold">
              {score.sections[s].correct}/{score.sections[s].total}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-slate-500">Para aprobar: 80 de 180, con al menos 38 en idioma y lectura y 19 en audición.</p>
      <SaveProgressPrompt />
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/lectura" className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
          Volver
        </Link>
        <button onClick={onRetry} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Otro simulacro
        </button>
      </div>
    </section>
  )
}

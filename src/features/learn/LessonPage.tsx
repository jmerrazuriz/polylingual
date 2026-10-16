import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { KanaCard } from '../../components/KanaCard'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { kanaByChar } from '../../content/kana'
import { learnedThrough, type Lesson, lessons, lessonsByScript } from '../../content/lessons'
import type { Kana, Word } from '../../content/types'
import { useSpeech } from '../../lib/audio/useSpeech'
import { syllables } from '../../lib/romaji'
import { wordRomaji, wordsReadableWith } from '../../lib/words'
import { LessonQuiz } from './LessonQuiz'
import { useProgress } from '../../lib/progress/store'
import { useUnlockedLessons } from '../../lib/progress/unlock'

type Step =
  | { kind: 'intro' }
  | { kind: 'kana'; kana: Kana }
  | { kind: 'words'; words: Word[] }
  | { kind: 'quiz' }
  | { kind: 'done'; correct: number; total: number }

export function LessonRoute() {
  const { lessonId } = useParams()
  const lesson = lessons.find((l) => l.id === lessonId)
  const unlocked = useUnlockedLessons()
  if (!lesson) return <ComingSoon title="Lección no encontrada" />
  if (!unlocked.has(lesson.id)) {
    return (
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl" aria-hidden>
          🔒
        </span>
        <h1 className="text-2xl font-extrabold">{lesson.title} todavía está bloqueada</h1>
        <p className="text-slate-500">Completa la lección anterior para abrirla.</p>
        <Link to="/aprender" className="font-semibold text-accent hover:underline">
          Ver lecciones
        </Link>
      </section>
    )
  }
  // La key reinicia el estado al pasar a otra lección.
  return <LessonPage key={lesson.id} lesson={lesson} />
}

function LessonPage({ lesson }: { lesson: Lesson }) {
  const index = lessonsByScript[lesson.script].indexOf(lesson)
  // Después de la última lección de hiragana sigue la primera de katakana.
  const nextLesson = lessons[lessons.indexOf(lesson) + 1]
  const back = lesson.script === 'katakana' ? '/aprender?silabario=katakana' : '/aprender'
  const learned = learnedThrough(lesson.id)
  const lessonKana = lesson.chars.map((c) => kanaByChar.get(c)!)
  const pool = [...learned].flatMap((c) => kanaByChar.get(c) ?? [])
  // Palabras nuevas: legibles con lo aprendido y con al menos un carácter de esta lección.
  const newWords = wordsReadableWith(learned).filter((w) => syllables(w.kana).some((s) => lesson.chars.includes(s)))

  const steps: Step[] = [
    { kind: 'intro' },
    ...lessonKana.map((kana) => ({ kind: 'kana' as const, kana })),
    ...(newWords.length > 0 ? [{ kind: 'words' as const, words: newWords.slice(0, 8) }] : []),
    { kind: 'quiz' },
  ]

  const [position, setPosition] = useState(0)
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null)
  const complete = useProgress((s) => s.completeLesson)

  const step: Step = result ? { kind: 'done', ...result } : steps[position]
  const go = (delta: number) => setPosition((p) => Math.min(Math.max(p + delta, 0), steps.length - 1))

  const finishQuiz = (correct: number, total: number) => {
    complete(lesson.id, correct, total, lesson.chars)
    setResult({ correct, total })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to={back} aria-label="Volver a las lecciones" className="text-xl text-slate-400 hover:text-slate-700">
          ×
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${result ? 100 : (position / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {step.kind === 'intro' && (
        <section className="flex flex-col items-center gap-5 py-6 text-center">
          <p className="text-sm font-bold text-slate-500 uppercase">
            {lesson.script} · Lección {index + 1}
          </p>
          <h1 className="text-3xl font-extrabold">{lesson.title}</h1>
          <p className="font-jp text-5xl tracking-widest">{lesson.chars.join(' ')}</p>
          <p className="text-slate-600 dark:text-slate-400">{lesson.description}</p>
          <button onClick={() => go(1)} className="rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
            Empezar
          </button>
        </section>
      )}

      {step.kind === 'kana' && (
        <>
          <KanaCard kana={step.kana} words={wordsReadableWith(learned, { containing: step.kana.char, limit: 3 })} />
          <StepNav onBack={() => go(-1)} onNext={() => go(1)} />
        </>
      )}

      {step.kind === 'words' && (
        <>
          <WordsStep words={step.words} />
          <StepNav onBack={() => go(-1)} onNext={() => go(1)} nextLabel="Al repaso" />
        </>
      )}

      {step.kind === 'quiz' && <LessonQuiz items={lessonKana} pool={pool} onDone={finishQuiz} />}

      {step.kind === 'done' && (
        <section className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="text-6xl" aria-hidden>
            {step.correct === step.total ? '🎉' : '👍'}
          </span>
          <h1 className="text-2xl font-extrabold">¡Lección completada!</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acertaste {step.correct} de {step.total} en el repaso.
          </p>
          <SaveProgressPrompt />
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={back} className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
              Lecciones
            </Link>
            {nextLesson && (
              <Link to={`/aprender/${nextLesson.id}`} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
                Siguiente: {nextLesson.title}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

function StepNav({ onBack, onNext, nextLabel = 'Siguiente' }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <button onClick={onBack} className="rounded-full border border-slate-300 px-5 py-3 font-bold dark:border-slate-700">
        ← Atrás
      </button>
      <button onClick={onNext} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        {nextLabel} →
      </button>
    </div>
  )
}

/** Palabras que ya se pueden leer: se toca cada una para ver la respuesta. */
function WordsStep({ words }: { words: Word[] }) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const { speak } = useSpeech()

  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-2xl font-extrabold">Ya puedes leer…</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Intenta leer cada palabra y tócala para comprobar.</p>
      <ul className="grid grid-cols-2 gap-2">
        {words.map((w) => {
          const open = revealed.has(w.kana)
          return (
            <li key={w.kana}>
              <button
                onClick={() => {
                  setRevealed(new Set(revealed).add(w.kana))
                  speak(w.kana)
                }}
                className="flex h-full w-full flex-col items-center gap-1 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="font-jp text-2xl">{w.kana}</span>
                <span className={`text-sm font-bold ${open ? 'text-accent' : 'text-transparent'}`}>{wordRomaji(w)}</span>
                <span className={`text-xs ${open ? 'text-slate-500 dark:text-slate-400' : 'text-transparent'}`}>
                  {w.meaning}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { RetryNote } from '../../components/RetryNote'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import type { EuroCourse, EuroWord } from '../../courses/euro'
import type { ReadingText } from '../../courses/reading'
import { useAccount } from '../../lib/account/store'
import { useSpeech } from '../../lib/audio/useSpeech'
import { useProgress } from '../../lib/progress/store'
import { firstTryCorrect, queueDone, useRetryQueue } from '../../lib/retryQueue'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'
import { LearnTabs } from '../learn/LearnTabs'
import { useEuroCourse } from './useEuroCourse'

/** Lecciones abiertas de un tipo (sigue el recorrido del curso). */
function useUnlocked(course: EuroCourse, kind: 'vocab' | 'reading') {
  const guest = useAccount((s) => s.status !== 'user')
  const lessons = useProgress((s) => s.lessons)
  const grammar = useProgress((s) => s.grammar)
  const records = useProgress((s) => s.records)
  const unlockAll = useProgress((s) => s.unlockAll)
  return useMemo(() => course.unlockedIds({ lessons, grammar, records, unlockAll }, guest, kind), [course, lessons, grammar, records, unlockAll, guest, kind])
}

function Locked({ back, label }: { back: string; label: string }) {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="text-5xl" aria-hidden>
        🔒
      </span>
      <h1 className="text-2xl font-extrabold">Esta lección todavía está bloqueada</h1>
      <p className="text-slate-600 dark:text-slate-400">Se abre al completar la lección anterior del recorrido.</p>
      <Link to={back} className="font-semibold text-accent hover:underline">
        {label}
      </Link>
    </section>
  )
}

/* ─────────────── Palabras ─────────────── */

export function EuroVocabPage() {
  const course = useEuroCourse()
  const unlocked = useUnlocked(course, 'vocab')
  const done = useProgress((s) => s.lessons)
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{course.vocabIntro}</p>
      </header>
      <LearnTabs current="palabras" />
      {course.themes.map((theme) => (
        <section key={theme.id} className="flex flex-col gap-2">
          <h2 className="text-sm font-extrabold text-slate-500 uppercase">
            {theme.level} · {theme.title}
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {course.vocabLessons
              .filter((l) => l.theme === theme.id)
              .map((l) => {
                const open = unlocked.has(l.id)
                const result = done[l.id]
                const body = (
                  <>
                    <span className="flex-1">
                      <span className="block font-extrabold">{l.title}</span>
                      <span lang={course.lang} className="text-sm text-slate-500 dark:text-slate-400">
                        {l.words.slice(0, 4).map((w) => course.withArticle(w)).join(' · ')}…
                      </span>
                    </span>
                    {result ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ {result.correct}/{result.total}
                      </span>
                    ) : open ? (
                      <span aria-hidden className="text-slate-300">
                        →
                      </span>
                    ) : (
                      <span aria-label="Bloqueada">🔒</span>
                    )}
                  </>
                )
                return (
                  <li key={l.id}>
                    {open ? (
                      <Link to={`/palabras/${l.id}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:border-accent dark:border-slate-800 dark:bg-slate-900">
                        {body}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 opacity-60 dark:border-slate-800 dark:bg-slate-900">{body}</div>
                    )}
                  </li>
                )
              })}
          </ul>
        </section>
      ))}
    </div>
  )
}

export function EuroVocabLessonRoute() {
  const { lessonId } = useParams()
  const course = useEuroCourse()
  const unlocked = useUnlocked(course, 'vocab')
  const lesson = lessonId ? course.vocabLessonById.get(lessonId) : undefined
  if (!lesson) return <ComingSoon title="Lección no encontrada" />
  if (!unlocked.has(lesson.id)) return <Locked back="/palabras" label="Ver las lecciones de palabras" />
  return <VocabLesson key={lesson.id} course={course} lessonId={lesson.id} />
}

function WordCard({ course, w }: { course: EuroCourse; w: EuroWord }) {
  const { available, speak } = useSpeech()
  return (
    <li>
      <button
        onClick={() => speak(course.speakWord(w))}
        disabled={!available}
        className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left enabled:hover:border-accent dark:border-slate-800 dark:bg-slate-900"
      >
        {available && <span aria-hidden>🔊</span>}
        <span className="flex-1">
          <span lang={course.lang} className={`block text-lg font-bold ${course.genderClass(w)}`}>
            {course.nounLine(w)}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-300">{w.meaning}</span>
        </span>
      </button>
    </li>
  )
}

function VocabLesson({ course, lessonId }: { course: EuroCourse; lessonId: string }) {
  const lesson = course.vocabLessonById.get(lessonId)!
  const [exercises] = useState(() => course.lessonExercises(lesson.words))
  const [step, setStep] = useState(-1)
  const quiz = useRetryQueue(exercises.length)
  const complete = useProgress((s) => s.completeLesson)
  const total = exercises.length
  // Las falladas vuelven al final de la cola: la lección termina cuando se aciertan todas.
  const finished = step >= 0 && queueDone(quiz.state)
  const correct = firstTryCorrect(quiz.state)
  const shown = quiz.state.queue.length
  const hasNouns = lesson.words.some((w) => w.pos === 'noun')

  const answer = (ok: boolean) => {
    const next = quiz.answer(ok)
    if (queueDone(next)) complete(lesson.id, firstTryCorrect(next), total, lesson.words.map((w) => course.wordCard(w)))
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/aprender" aria-label="Volver al recorrido" className="text-xl text-slate-400 hover:text-slate-700">
          ×
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((step < 0 ? 0 : finished ? shown + 1 : quiz.state.pos + 1) / (shown + 1)) * 100}%` }} />
        </div>
      </div>

      {step === -1 && (
        <section className="flex flex-col gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase">Palabras · {lesson.level}</p>
          <h1 className="text-2xl font-extrabold">{lesson.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {course.lessonIntro(lesson.words)}
            {hasNouns && (
              <>
                {' '}
                Colores:{' '}
                {course.genders.map((g, i) => (
                  <span key={g.gender}>
                    {i > 0 && ', '}
                    <span lang={course.lang} className={g.className}>
                      {g.article}
                    </span>
                  </span>
                ))}
                .
              </>
            )}
          </p>
          <ul className="flex flex-col gap-2">
            {lesson.words.map((w) => (
              <WordCard key={w.id} course={course} w={w} />
            ))}
          </ul>
          <button onClick={() => setStep(0)} className="self-center rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
            A practicar →
          </button>
        </section>
      )}

      {step >= 0 && !finished && (
        <>
          {quiz.retry && <RetryNote />}
          <GrammarExerciseView key={quiz.state.pos} exercise={exercises[quiz.current!]} onDone={answer} />
        </>
      )}

      {finished && (
        <section className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="text-6xl" aria-hidden>
            {correct === total ? '🎉' : '👍'}
          </span>
          <h1 className="text-2xl font-extrabold">¡Lección completada!</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acertaste {correct} de {total}. Las {lesson.words.length} palabras entraron a tus repasos.
          </p>
          <SaveProgressPrompt />
          <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
            Seguir el recorrido
          </Link>
        </section>
      )}
    </div>
  )
}

/* ─────────────── Lecturas y diálogos ─────────────── */

export function EuroReadingsPage() {
  const course = useEuroCourse()
  const unlocked = useUnlocked(course, 'reading')
  const done = useProgress((s) => s.lessons)
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{course.textsIntro}</p>
      </header>
      <LearnTabs current="textos" />
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {course.texts.map((t) => {
          const open = unlocked.has(t.id)
          const result = done[t.id]
          const body = (
            <>
              <span className="text-2xl" aria-hidden>
                {t.kind === 'reading' ? '📖' : '🎧'}
              </span>
              <span className="flex-1">
                <span className="block font-extrabold">{t.title}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {t.level} · {t.kind === 'reading' ? 'Lectura' : 'Diálogo'}
                </span>
              </span>
              {result ? (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ {result.correct}/{result.total}
                </span>
              ) : !open ? (
                <span aria-label="Bloqueada">🔒</span>
              ) : null}
            </>
          )
          return (
            <li key={t.id}>
              {open ? (
                <Link to={`/textos/${t.id}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:border-accent dark:border-slate-800 dark:bg-slate-900">
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 opacity-60 dark:border-slate-800 dark:bg-slate-900">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function EuroReadingRoute() {
  const { textId } = useParams()
  const course = useEuroCourse()
  const unlocked = useUnlocked(course, 'reading')
  const text = textId ? course.texts.find((t) => t.id === textId) : undefined
  if (!text) return <ComingSoon title="Texto no encontrado" />
  if (!unlocked.has(text.id)) return <Locked back="/textos" label="Ver los textos" />
  return <ReadingView key={text.id} course={course} text={text} />
}

function ReadingView({ course, text }: { course: EuroCourse; text: ReadingText }) {
  const [step, setStep] = useState<'text' | 'questions' | 'done'>('text')
  const quiz = useRetryQueue(text.questions.length)
  const correct = firstTryCorrect(quiz.state)
  const [showText, setShowText] = useState(text.kind === 'reading')
  const [showMeaning, setShowMeaning] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [word, setWord] = useState<{ token: string; info?: ReturnType<EuroCourse['lookup']> } | null>(null)
  const complete = useProgress((s) => s.completeLesson)
  const { available, voiceFound, speak, speakLines, stop } = useSpeech()
  const total = text.questions.length

  const toggleAudio = () => {
    if (playing) {
      stop()
      setPlaying(false)
      return
    }
    setPlaying(true)
    speakLines(text.lines, () => setPlaying(false))
  }

  // Las preguntas falladas vuelven al final hasta acertarlas; la nota cuenta el primer intento.
  const answer = (ok: boolean) => {
    const next = quiz.answer(ok)
    if (queueDone(next)) {
      complete(text.id, firstTryCorrect(next), total)
      setStep('done')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/aprender" aria-label="Volver" onClick={stop} className="text-xl text-slate-400 hover:text-slate-700">
          ×
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${step === 'text' ? 5 : step === 'done' ? 100 : ((quiz.state.pos + 1) / (quiz.state.queue.length + 1)) * 100}%` }} />
        </div>
      </div>

      {step === 'text' && (
        <section className="flex flex-col gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase">
            {text.kind === 'reading' ? '📖 Lectura' : '🎧 Diálogo'} · {course.story}
          </p>
          <h1 className="text-2xl font-extrabold">{text.title}</h1>
          {text.context && <p className="text-slate-600 dark:text-slate-400">{text.context}</p>}
          {available ? (
            <button onClick={toggleAudio} className="self-start rounded-full border-2 border-accent px-5 py-2.5 font-bold">
              {playing ? '⏹ Detener' : text.kind === 'dialogue' ? '▶ Escuchar el diálogo' : '▶ Escuchar el texto'}
            </button>
          ) : (
            text.kind === 'dialogue' && (
              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                {voiceFound ? 'El audio está apagado en los ajustes: puedes leer el diálogo.' : `Tu navegador no tiene voz en ${course.name}: puedes leer el diálogo.`}
              </p>
            )
          )}
          {showText || !available ? (
            <>
              <ul className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                {text.lines.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    {available && (
                      <button onClick={() => speak(line.text)} aria-label="Escuchar la frase" className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm dark:bg-slate-800">
                        🔊
                      </button>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <p lang={course.lang} className="text-lg leading-relaxed">
                        {line.speaker && <span className="mr-2 text-sm font-bold text-accent">{line.speaker}:</span>}
                        {line.text.split(/\s+/).map((token, k) => (
                          <span key={k}>
                            <button onClick={() => setWord({ token, info: course.lookup(token) })} className="rounded hover:bg-accent/10">
                              {token}
                            </button>{' '}
                          </span>
                        ))}
                      </p>
                      {showMeaning && <p className="text-sm text-slate-500 dark:text-slate-400">{line.meaning}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              {word && (
                <p role="status" className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
                  <span lang={course.lang} className="font-bold">
                    {word.token.replace(/[.,!?;:«»]/g, '')}
                  </span>
                  {word.info ? (
                    <>
                      {' '}
                      → <strong>{word.info.word.meaning}</strong> (<span lang={course.lang}>{course.nounLine(word.info.word)}</span>
                      {word.info.form && `, ${word.info.form}`})
                    </>
                  ) : (
                    ' → no está en el vocabulario del curso (puede ser un nombre o una forma de otra palabra).'
                  )}
                </p>
              )}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showMeaning} onChange={(e) => setShowMeaning(e.target.checked)} className="h-4 w-4" />
                Mostrar la traducción
              </label>
            </>
          ) : (
            <button onClick={() => setShowText(true)} className="self-start text-sm font-bold text-slate-500 underline">
              Mostrar el texto (mejor primero escucha sin leer)
            </button>
          )}
          <button
            onClick={() => {
              stop()
              setPlaying(false)
              setShowMeaning(false)
              setStep('questions')
            }}
            className="self-end rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90"
          >
            Responder preguntas →
          </button>
        </section>
      )}

      {step === 'questions' && (
        <>
          {quiz.retry && <RetryNote />}
          <GrammarExerciseView key={quiz.state.pos} exercise={text.questions[quiz.current!]} onDone={answer} />
        </>
      )}

      {step === 'done' && (
        <section className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="text-6xl" aria-hidden>
            {correct === total ? '🎉' : '👍'}
          </span>
          <h1 className="text-2xl font-extrabold">¡Texto completado!</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acertaste {correct} de {total} preguntas.
          </p>
          <SaveProgressPrompt />
          <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
            Seguir el recorrido
          </Link>
        </section>
      )}
    </div>
  )
}

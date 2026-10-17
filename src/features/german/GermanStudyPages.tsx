import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { germanUnlockedIds } from '../../courses/de/progress'
import { lookupGerman } from '../../courses/de/glossary'
import { germanTexts } from '../../courses/de/texts'
import { type GermanWord, germanThemesA1, germanThemesA2, germanThemesB1, germanThemesB2, germanThemesC1, germanThemesC2, germanVocabLessonById, germanVocabLessons, germanWordCard, nounLine, withArticle } from '../../courses/de/vocab'
import { germanLessonExercises } from '../../courses/de/vocabExercises'
import type { ReadingText } from '../../courses/reading'
import { useAccount } from '../../lib/account/store'
import { useSpeech } from '../../lib/audio/useSpeech'
import { useProgress } from '../../lib/progress/store'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'
import { LearnTabs } from '../learn/LearnTabs'

const textById = new Map(germanTexts.map((t) => [t.id, t]))

/** Lecciones abiertas del alemán de un tipo (sigue el recorrido). */
function useGermanUnlocked(kind: 'vocab' | 'reading') {
  const guest = useAccount((s) => s.status !== 'user')
  const lessons = useProgress((s) => s.lessons)
  const grammar = useProgress((s) => s.grammar)
  const records = useProgress((s) => s.records)
  const unlockAll = useProgress((s) => s.unlockAll)
  return useMemo(() => germanUnlockedIds({ lessons, grammar, records, unlockAll }, guest, kind), [lessons, grammar, records, unlockAll, guest, kind])
}

const genderColor: Record<string, string> = {
  m: 'text-sky-700 dark:text-sky-300',
  f: 'text-rose-700 dark:text-rose-300',
  n: 'text-emerald-700 dark:text-emerald-300',
  pl: 'text-amber-700 dark:text-amber-300',
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

export function GermanVocabPage() {
  const unlocked = useGermanUnlocked('vocab')
  const done = useProgress((s) => s.lessons)
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Palabras por tema, siempre con su artículo y su plural. Lo que aprendes entra a tus repasos.
        </p>
      </header>
      <LearnTabs current="palabras" />
      {[...germanThemesA1.map((t) => ({ ...t, level: 'A1' })), ...germanThemesA2.map((t) => ({ ...t, level: 'A2' })), ...germanThemesB1.map((t) => ({ ...t, level: 'B1' })), ...germanThemesB2.map((t) => ({ ...t, level: 'B2' })), ...germanThemesC1.map((t) => ({ ...t, level: 'C1' })), ...germanThemesC2.map((t) => ({ ...t, level: 'C2' }))].map((theme) => (
        <section key={theme.id} className="flex flex-col gap-2">
          <h2 className="text-sm font-extrabold text-slate-500 uppercase">
            {theme.level} · {theme.title}
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {germanVocabLessons
              .filter((l) => l.theme === theme.id)
              .map((l) => {
                const open = unlocked.has(l.id)
                const result = done[l.id]
                const body = (
                  <>
                    <span className="flex-1">
                      <span className="block font-extrabold">{l.title}</span>
                      <span lang="de" className="text-sm text-slate-500 dark:text-slate-400">
                        {l.words.slice(0, 4).map(withArticle).join(' · ')}…
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

export function GermanVocabLessonRoute() {
  const { lessonId } = useParams()
  const unlocked = useGermanUnlocked('vocab')
  const lesson = lessonId ? germanVocabLessonById.get(lessonId) : undefined
  if (!lesson) return <ComingSoon title="Lección no encontrada" />
  if (!unlocked.has(lesson.id)) return <Locked back="/palabras" label="Ver las lecciones de palabras" />
  return <GermanVocabLesson key={lesson.id} lessonId={lesson.id} />
}

function WordCard({ w }: { w: GermanWord }) {
  const { available, speak } = useSpeech()
  return (
    <li>
      <button
        onClick={() => speak(w.pos === 'noun' && w.plural && w.gender !== 'pl' ? `${withArticle(w)}. die ${w.plural}` : withArticle(w))}
        disabled={!available}
        className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left enabled:hover:border-accent dark:border-slate-800 dark:bg-slate-900"
      >
        {available && <span aria-hidden>🔊</span>}
        <span className="flex-1">
          <span lang="de" className={`block text-lg font-bold ${w.gender ? genderColor[w.gender] : ''}`}>
            {nounLine(w)}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-300">{w.meaning}</span>
        </span>
      </button>
    </li>
  )
}

function GermanVocabLesson({ lessonId }: { lessonId: string }) {
  const lesson = germanVocabLessonById.get(lessonId)!
  const [exercises] = useState(() => germanLessonExercises(lesson.words))
  const [step, setStep] = useState(-1)
  const [correct, setCorrect] = useState(0)
  const complete = useProgress((s) => s.completeLesson)
  const total = exercises.length
  const finished = step >= total

  const answer = (ok: boolean) => {
    const score = correct + (ok ? 1 : 0)
    setCorrect(score)
    if (step + 1 === total) complete(lesson.id, score, total, lesson.words.map(germanWordCard))
    setStep(step + 1)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/aprender" aria-label="Volver al recorrido" className="text-xl text-slate-400 hover:text-slate-700">
          ×
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(Math.max(0, Math.min(step + 1, total + 1)) / (total + 1)) * 100}%` }} />
        </div>
      </div>

      {step === -1 && (
        <section className="flex flex-col gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase">Palabras · {lesson.level}</p>
          <h1 className="text-2xl font-extrabold">{lesson.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lesson.words.some((w) => w.pos === 'noun') ? (
              <>
            Aprende cada sustantivo con su artículo (color: <span className={genderColor.m}>der</span>,{' '}
            <span className={genderColor.f}>die</span>, <span className={genderColor.n}>das</span>) y su plural. Toca una palabra para oírla.
              </>
            ) : (
              lesson.words.some((w) => /\+ (Akk|Dat)\./.test(w.word))
                ? 'Aprende cada expresión completa (con su preposición y su caso). Toca una para oírla.'
                : 'Aprende cada palabra o expresión completa, tal como se usa. Toca una para oírla.'
            )}
          </p>
          <ul className="flex flex-col gap-2">
            {lesson.words.map((w) => (
              <WordCard key={w.id} w={w} />
            ))}
          </ul>
          <button onClick={() => setStep(0)} className="self-center rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
            A practicar →
          </button>
        </section>
      )}

      {step >= 0 && !finished && <GrammarExerciseView key={step} exercise={exercises[step]} onDone={answer} />}

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

export function GermanReadingsPage() {
  const unlocked = useGermanUnlocked('reading')
  const done = useProgress((s) => s.lessons)
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ottos Weg: lecturas y diálogos con audio, como en el examen Goethe. Toca una palabra para ver qué significa.
        </p>
      </header>
      <LearnTabs current="textos" />
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {germanTexts.map((t) => {
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

export function GermanReadingRoute() {
  const { textId } = useParams()
  const unlocked = useGermanUnlocked('reading')
  const text = textId ? textById.get(textId) : undefined
  if (!text) return <ComingSoon title="Texto no encontrado" />
  if (!unlocked.has(text.id)) return <Locked back="/textos" label="Ver los textos" />
  return <GermanReadingView key={text.id} text={text} />
}

function GermanReadingView({ text }: { text: ReadingText }) {
  const [step, setStep] = useState<'text' | 'questions' | 'done'>('text')
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [showText, setShowText] = useState(text.kind === 'reading')
  const [showMeaning, setShowMeaning] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [word, setWord] = useState<{ token: string; info?: ReturnType<typeof lookupGerman> } | null>(null)
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

  const answer = (ok: boolean) => {
    const score = correct + (ok ? 1 : 0)
    setCorrect(score)
    if (index + 1 === total) {
      complete(text.id, score, total)
      setStep('done')
    } else setIndex(index + 1)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/aprender" aria-label="Volver" onClick={stop} className="text-xl text-slate-400 hover:text-slate-700">
          ×
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${step === 'text' ? 5 : step === 'done' ? 100 : ((index + 1) / (total + 1)) * 100}%` }} />
        </div>
      </div>

      {step === 'text' && (
        <section className="flex flex-col gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase">{text.kind === 'reading' ? '📖 Lectura' : '🎧 Diálogo'} · Ottos Weg</p>
          <h1 className="text-2xl font-extrabold">{text.title}</h1>
          {text.context && <p className="text-slate-600 dark:text-slate-400">{text.context}</p>}
          {available ? (
            <button onClick={toggleAudio} className="self-start rounded-full border-2 border-accent px-5 py-2.5 font-bold">
              {playing ? '⏹ Detener' : text.kind === 'dialogue' ? '▶ Escuchar el diálogo' : '▶ Escuchar el texto'}
            </button>
          ) : (
            text.kind === 'dialogue' && (
              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                {voiceFound ? 'El audio está apagado en los ajustes: puedes leer el diálogo.' : 'Tu navegador no tiene voz alemana: puedes leer el diálogo.'}
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
                      <p lang="de" className="text-lg leading-relaxed">
                        {line.speaker && <span className="mr-2 text-sm font-bold text-accent">{line.speaker}:</span>}
                        {line.text.split(/\s+/).map((token, k) => (
                          <span key={k}>
                            <button onClick={() => setWord({ token, info: lookupGerman(token) })} className="rounded hover:bg-accent/10">
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
                  <span lang="de" className="font-bold">
                    {word.token.replace(/[.,!?;:]/g, '')}
                  </span>
                  {word.info ? (
                    <>
                      {' '}
                      → <strong>{word.info.word.meaning}</strong> (<span lang="de">{nounLine(word.info.word)}</span>
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

      {step === 'questions' && <GrammarExerciseView key={index} exercise={text.questions[index]} onDone={answer} />}

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

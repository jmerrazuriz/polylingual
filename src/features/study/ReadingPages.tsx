import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { Furigana } from '../../components/Furigana'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { grammarByCourse } from '../../courses/content'
import type { ReadingText, TextLine } from '../../courses/reading'
import { useSpeech } from '../../lib/audio/useSpeech'
import { posLabel } from '../../courses/ja/vocab'
import { useProgress } from '../../lib/progress/store'
import { furiganaToPlain, hasFurigana } from '../../lib/furigana'
import { glossary, type GlossaryEntry, lineTokens, readingById, readingTexts } from '../../lib/readings'
import { useUnlockedReadings } from '../../lib/progress/unlock'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'
import { LearnTabs } from '../learn/LearnTabs'
import { LessonList } from './LessonList'

const grammarTitle = (id: string) => grammarByCourse.ja.find((g) => g.id === id)?.title ?? id

export function ReadingsPage() {
  const results = useProgress((s) => s.lessons)
  const unlocked = useUnlockedReadings()
  const list = (kind: ReadingText['kind'], level: ReadingText['level']) =>
    readingTexts
      .filter((t) => t.kind === kind && t.level === level)
      .map((t) => ({
        id: t.id,
        title: t.title,
        summary: unlocked.has(t.id) ? t.lines[0].text : `Se abre con «${grammarTitle(t.requires)}»`,
        to: `/lectura/${t.id}`,
      }))
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Textos cortos para leer y diálogos para escuchar, con preguntas de comprensión. Toca una palabra para ver qué significa.
        </p>
      </header>
      <LearnTabs current="lectura" />
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">📖 Lecturas · N5</h2>
        <LessonList lessons={list('reading', 'N5')} results={results} unlocked={unlocked} />
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">🎧 Diálogos · N5</h2>
        <LessonList lessons={list('dialogue', 'N5')} results={results} unlocked={unlocked} />
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">📖 Lecturas · N4 (con kanji)</h2>
        <LessonList lessons={list('reading', 'N4')} results={results} unlocked={unlocked} />
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">🎧 Diálogos · N4 (con kanji)</h2>
        <LessonList lessons={list('dialogue', 'N4')} results={results} unlocked={unlocked} />
      </section>
      {(['N5', 'N4'] as const).map((level) => (
        <Link
          key={level}
          to={level === 'N5' ? '/simulacro' : '/simulacro/n4'}
          className="flex items-center gap-3 rounded-2xl bg-ink p-4 text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="text-3xl" aria-hidden>
            📝
          </span>
          <span className="flex-1">
            <span className="block font-extrabold">Simulacro del JLPT {level}</span>
            <span className="text-sm opacity-80">Vocabulario y kanji, gramática, lectura y audición, con tiempo.</span>
          </span>
          <span aria-hidden>→</span>
        </Link>
      ))}
    </div>
  )
}

export function ReadingRoute() {
  const { textId } = useParams()
  const unlocked = useUnlockedReadings()
  const text = textId ? readingById.get(textId) : undefined
  if (!text) return <ComingSoon title="Texto no encontrado" />
  if (!unlocked.has(text.id)) return <ComingSoon title={`Se abre al completar «${grammarTitle(text.requires)}»`} />
  return <ReadingTextView key={text.id} text={text} />
}

/** Una frase con sus palabras tocables, su audio y (si se pide) la traducción. */
type View = { showMeaning: boolean; furigana?: boolean; spaced?: boolean }

function Line({ line, showMeaning, furigana = true, spaced = true, onWord }: View & { line: TextLine; onWord: (token: string) => void }) {
  const { available, speak } = useSpeech()
  return (
    <li className="flex gap-2">
      {available && (
        <button
          onClick={() => speak(line.text)}
          aria-label="Escuchar la frase"
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm hover:bg-slate-200 dark:bg-slate-800"
        >
          🔊
        </button>
      )}
      <div className="flex flex-col gap-0.5">
        <p lang="ja" className="font-jp text-xl leading-loose">
          {line.speaker && <span className="mr-2 text-sm font-bold text-accent">{line.speaker}:</span>}
          {line.text.split(/\s+/).map((token, i) => (
            <button
              key={i}
              onClick={() => onWord(token)}
              className={`${spaced ? 'mr-1.5 px-0.5' : ''} rounded hover:bg-accent/10 focus-visible:bg-accent/10`}
            >
              <Furigana text={token} show={furigana} />
            </button>
          ))}
        </p>
        {showMeaning && <p className="text-sm text-slate-500 dark:text-slate-400">{line.meaning}</p>}
      </div>
    </li>
  )
}

/** El texto completo, con glosario al tocar una palabra. */
export function TextBody({ text, ...view }: View & { text: ReadingText }) {
  const [word, setWord] = useState<{ token: string; info?: GlossaryEntry } | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {text.lines.map((line, i) => (
          <Line
            key={i}
            line={line}
            {...view}
            onWord={(raw) => {
              const kana = lineTokens(raw)[0] ?? raw
              const written = lineTokens(furiganaToPlain(raw))[0] ?? kana
              setWord({ token: written === kana ? kana : `${written}（${kana}）`, info: glossary(kana) })
            }}
          />
        ))}
      </ul>
      {word && (
        <p role="status" className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
          <span lang="ja" className="font-jp text-lg font-bold">
            {word.token}
          </span>
          {word.info ? (
            <>
              {' '}
              → <strong>{word.info.entry.meaning}</strong> ({posLabel[word.info.entry.pos]}
              {word.info.form && (
                <>
                  , de{' '}
                  <span lang="ja" className="font-jp">
                    {word.info.entry.kana}
                  </span>
                  : {word.info.form}
                </>
              )}
              )
            </>
          ) : (
            ' → no está en el vocabulario del curso (puede ser una partícula, un nombre o una forma de otra palabra).'
          )}
        </p>
      )}
    </div>
  )
}

type Step = 'text' | 'questions' | 'done'

/**
 * Lectura: texto → preguntas → resultado con la traducción.
 * Diálogo: primero se escucha (el texto se puede mostrar), luego preguntas y resultado.
 */
export function ReadingTextView({ text, onFinish }: { text: ReadingText; onFinish?: () => void }) {
  const [step, setStep] = useState<Step>('text')
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [showText, setShowText] = useState(text.kind === 'reading')
  const [showMeaning, setShowMeaning] = useState(false)
  const withKanji = text.lines.some((l) => hasFurigana(l.text))
  const [furigana, setFurigana] = useState(true)
  const [spaced, setSpaced] = useState(true)
  const [playing, setPlaying] = useState(false)
  const complete = useProgress((s) => s.completeLesson)
  const { available, voiceFound, speakLines, stop } = useSpeech()
  const listen = () => {
    setPlaying(true)
    speakLines(text.lines, () => setPlaying(false))
  }
  const toggleAudio = () => {
    if (!playing) return listen()
    stop()
    setPlaying(false)
  }
  const next = readingTexts[readingTexts.indexOf(text) + 1]

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <div className="flex items-center gap-3">
        {!onFinish && (
          <Link to="/lectura" aria-label="Volver" onClick={stop} className="text-xl text-slate-400 hover:text-slate-700">
            ×
          </Link>
        )}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${step === 'text' ? 5 : step === 'done' ? 100 : ((index + 1) / (text.questions.length + 1)) * 100}%` }}
          />
        </div>
      </div>

      {step === 'text' && (
        <section className="flex flex-col gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase">{text.kind === 'reading' ? '📖 Lectura' : '🎧 Diálogo'}</p>
          <h1 className="text-2xl font-extrabold">{text.title}</h1>
          {text.context && <p className="text-slate-600 dark:text-slate-400">{text.context}</p>}

          {available ? (
            <button
              onClick={toggleAudio}
              className="flex items-center justify-center gap-2 self-start rounded-full border-2 border-accent px-5 py-2.5 font-bold"
            >
              {playing ? '⏹ Detener' : text.kind === 'dialogue' ? '▶ Escuchar el diálogo' : '▶ Escuchar el texto'}
            </button>
          ) : (
            text.kind === 'dialogue' && (
              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                {voiceFound
                  ? 'El audio está apagado en los ajustes: puedes leer el diálogo.'
                  : 'Tu navegador no tiene voz japonesa: puedes leer el diálogo.'}
              </p>
            )
          )}

          {showText || !available ? (
            <>
              <TextBody text={text} showMeaning={showMeaning} furigana={furigana} spaced={spaced} />
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={showMeaning} onChange={(e) => setShowMeaning(e.target.checked)} className="h-4 w-4" />
                  Mostrar la traducción
                </label>
                {withKanji && (
                  <>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={furigana} onChange={(e) => setFurigana(e.target.checked)} className="h-4 w-4" />
                      Furigana (lectura sobre los kanji)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={spaced} onChange={(e) => setSpaced(e.target.checked)} className="h-4 w-4" />
                      Espacios entre palabras
                    </label>
                  </>
                )}
              </div>
            </>
          ) : (
            <button onClick={() => setShowText(true)} className="self-start text-sm font-bold text-slate-500 underline">
              Mostrar el texto (mejor primero escucha sin leer)
            </button>
          )}

          <button
            onClick={() => {
              stop()
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
        <section className="flex flex-col gap-3">
          <p className="text-sm font-bold text-slate-500">
            Pregunta {index + 1} de {text.questions.length} · {text.title}
          </p>
          {available && text.kind === 'dialogue' && (
            <button onClick={listen} className="self-start text-sm font-bold text-accent underline">
              ▶ Escuchar otra vez
            </button>
          )}
          {text.kind === 'reading' && (
            <details className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
              <summary className="cursor-pointer font-bold">Ver el texto</summary>
              <div className="mt-2">
                <TextBody text={text} showMeaning={false} furigana={furigana} spaced={spaced} />
              </div>
            </details>
          )}
          <GrammarExerciseView
            key={index}
            exercise={text.questions[index]}
            onDone={(ok) => {
              const score = correct + (ok ? 1 : 0)
              setCorrect(score)
              if (index + 1 < text.questions.length) setIndex(index + 1)
              else {
                stop()
                complete(text.id, score, text.questions.length)
                setStep('done')
                onFinish?.()
              }
            }}
          />
        </section>
      )}

      {step === 'done' && !onFinish && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-5xl" aria-hidden>
              {correct === text.questions.length ? '🎉' : '👍'}
            </span>
            <h1 className="text-2xl font-extrabold">
              {correct} de {text.questions.length} correctas
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Repasa el texto con su traducción:</p>
          </div>
          <TextBody text={text} showMeaning furigana={furigana} spaced={spaced} />
          <SaveProgressPrompt />
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/lectura" className="rounded-full border border-slate-300 px-6 py-3 font-bold dark:border-slate-700">
              Volver
            </Link>
            {next && (
              <Link to={`/lectura/${next.id}`} className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
                Siguiente: {next.title}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { type VocabEntry, type VocabLesson, vocabLessons, vocabLessonsHira, vocabLessonsKata, vocabLessonsN4 } from '../../courses/ja/vocab'
import { useSpeech } from '../../lib/audio/useSpeech'
import { conjugateVerb } from '../../lib/conjugation'
import { useProgress } from '../../lib/progress/store'
import { useUnlockedVocab } from '../../lib/progress/unlock'
import { romajiReadings } from '../../lib/romaji'
import { vocabLessonExercises, wordCardChar, wordPosText } from '../../lib/vocabExercises'
import { LearnTabs } from '../learn/LearnTabs'
import { LessonList } from './LessonList'
import { StudyLesson } from './StudyLesson'

const summary = (l: VocabLesson) => l.words.slice(0, 4).map((w) => w.kana).join('・') + (l.words.length > 4 ? '…' : '')

export function VocabPage() {
  const results = useProgress((s) => s.lessons)
  const unlocked = useUnlockedVocab()
  const done = vocabLessons.filter((l) => results[l.id]).reduce((n, l) => n + l.words.length, 0)
  const total = vocabLessons.reduce((n, l) => n + l.words.length, 0)
  const list = (lessons: VocabLesson[]) => lessons.map((l) => ({ id: l.id, title: l.title, summary: summary(l), to: `/vocabulario/${l.id}` }))
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          El vocabulario de los niveles N5 y N4, por temas: verbos, adjetivos, la casa, el trabajo… Llevas {done} de {total} palabras.
        </p>
      </header>
      <LearnTabs current="vocabulario" />
      <p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
        💡 Las palabras de cada lección entran a tus repasos: un día te pedimos reconocerlas y otro escribirlas en kana con el
        teclado (escribe en romaji y se convierte solo).
      </p>
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Palabras en hiragana</h2>
        {!unlocked.has(vocabLessonsHira[0].id) && (
          <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            🔒 Se abren al completar el hiragana (incluidos los combinados).
          </p>
        )}
        <LessonList lessons={list(vocabLessonsHira)} results={results} unlocked={unlocked} />
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Palabras en katakana</h2>
        {!unlocked.has(vocabLessonsKata[0].id) && (
          <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            🔒 Se abren al completar el katakana (incluidos los extendidos).
          </p>
        )}
        <LessonList lessons={list(vocabLessonsKata)} results={results} unlocked={unlocked} start={vocabLessonsHira.length + 1} />
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Nivel N4</h2>
        {!unlocked.has(vocabLessonsN4[0].id) && (
          <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            🔒 Se abren con la primera lección de gramática N4 («Forma potencial»).
          </p>
        )}
        <LessonList
          lessons={list(vocabLessonsN4)}
          results={results}
          unlocked={unlocked}
          start={vocabLessonsHira.length + vocabLessonsKata.length + 1}
        />
      </section>
    </div>
  )
}

export function VocabLessonRoute() {
  const { lessonId } = useParams()
  const unlocked = useUnlockedVocab()
  const lesson = vocabLessons.find((l) => l.id === lessonId)
  if (!lesson) return <ComingSoon title="Lección no encontrada" />
  if (!unlocked.has(lesson.id)) return <ComingSoon title="Esta lección todavía está bloqueada" />
  return <VocabLessonView key={lesson.id} lesson={lesson} />
}

/** Fila de una palabra: kana, romaji, significado, clase y (en verbos) la forma ます. */
export function WordRow({ word }: { word: VocabEntry }) {
  const { speak } = useSpeech()
  const romaji = word.romaji ?? romajiReadings(word.kana)[0]
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <button
        onClick={() => speak(word.kana)}
        aria-label={`Escuchar ${word.kana}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
      >
        🔊
      </button>
      <span className="flex min-w-0 flex-1 flex-col">
        <span lang="ja" className="font-jp text-2xl font-bold">
          {word.kana}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{romaji}</span>
      </span>
      <span className="flex flex-col items-end text-right">
        <span className="font-bold">{word.meaning}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {wordPosText(word)}
          {word.group && (
            <>
              {' · '}
              <span lang="ja" className="font-jp">
                {conjugateVerb(word.kana, word.group, 'masu')}
              </span>
            </>
          )}
        </span>
      </span>
    </li>
  )
}

const PER_PAGE = 5

/** Lección de vocabulario: las palabras de a 5, ejercicios (reconocer, elegir, escribir en kana) y a los repasos. */
export function VocabLessonView({ lesson, onFinish }: { lesson: VocabLesson; onFinish?: () => void }) {
  const [exercises] = useState(() => vocabLessonExercises(lesson).map((t) => t.exercise))
  const complete = useProgress((s) => s.completeLesson)
  const index = vocabLessons.indexOf(lesson)
  const next = vocabLessons[index + 1]
  const pages = Array.from({ length: Math.ceil(lesson.words.length / PER_PAGE) }, (_, i) => (
    <ul key={i} className="flex flex-col gap-2">
      {lesson.words.slice(i * PER_PAGE, (i + 1) * PER_PAGE).map((w) => (
        <WordRow key={w.id} word={w} />
      ))}
    </ul>
  ))

  return (
    <StudyLesson
      kicker="Vocabulario"
      title={lesson.title}
      pages={pages}
      exercises={exercises}
      backTo="/vocabulario"
      next={next && !onFinish && next.track === lesson.track ? { to: `/vocabulario/${next.id}`, title: next.title } : undefined}
      embedded={!!onFinish}
      onComplete={(correct, total) => {
        complete(lesson.id, correct, total, lesson.words.map(wordCardChar))
        onFinish?.()
      }}
    />
  )
}

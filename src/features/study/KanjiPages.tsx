import { useState } from 'react'
import { useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { kanjiByChar, type KanjiLesson, kanjiLessons } from '../../courses/ja/kanji'
import { useProgress } from '../../lib/progress/store'
import { KANJI_UNLOCKED_BY, useUnlockedSequence } from '../../lib/progress/unlock'
import { kanjiLessonExercises, kanjiWritingItems } from '../../lib/studyExercises'
import { LearnTabs } from '../learn/LearnTabs'
import { KanjiCard } from './KanjiCard'
import { LessonList } from './LessonList'
import { StudyLesson } from './StudyLesson'

const ids = kanjiLessons.map((l) => l.id)
const kanjiUnits = [...new Set(kanjiLessons.map((l) => l.unit))]

export function KanjiPage() {
  const results = useProgress((s) => s.lessons)
  const unlocked = useUnlockedSequence(ids, KANJI_UNLOCKED_BY)
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Kanji de los niveles N5, N4 y N3: significado, lecturas, orden de trazos, palabras de ejemplo y práctica de escritura.
        </p>
      </header>
      <LearnTabs current="kanji" />
      <p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
        💡 Cada kanji tiene lecturas <strong>on</strong> (de origen chino, en katakana) y <strong>kun</strong> (japonesas, en
        hiragana). Cuál se usa depende de la palabra: no hace falta memorizarlas sueltas, sino con sus ejemplos.
      </p>
      {!unlocked.has(ids[0]) && (
        <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          🔒 Los kanji se abren al completar los básicos del katakana, porque las lecturas on se escriben en katakana.
        </p>
      )}
      {kanjiUnits.map((unit) => {
        const list = kanjiLessons.filter((l) => l.unit === unit)
        return (
          <section key={unit} className="flex flex-col gap-2">
            <h2 className="text-sm font-extrabold text-slate-500 uppercase">{unit}</h2>
            <LessonList
              lessons={list.map((l) => ({ id: l.id, title: l.title, summary: l.chars.join(' '), to: `/kanji/${l.id}` }))}
              results={results}
              unlocked={unlocked}
              start={kanjiLessons.indexOf(list[0]) + 1}
            />
          </section>
        )
      })}
    </div>
  )
}

export function KanjiLessonRoute() {
  const { lessonId } = useParams()
  const unlocked = useUnlockedSequence(ids, KANJI_UNLOCKED_BY)
  const lesson = kanjiLessons.find((l) => l.id === lessonId)
  if (!lesson) return <ComingSoon title="Lección no encontrada" />
  if (!unlocked.has(lesson.id)) return <ComingSoon title="Esta lección todavía está bloqueada" />
  return <KanjiLessonView key={lesson.id} lesson={lesson} />
}

/** Lección de kanji: una ficha por kanji, ejercicios de significado y lectura, y escritura calcando. */
export function KanjiLessonView({ lesson, onFinish }: { lesson: KanjiLesson; onFinish?: () => void }) {
  const [exercises] = useState(() => kanjiLessonExercises(lesson))
  const [writing] = useState(() => kanjiWritingItems(lesson))
  const complete = useProgress((s) => s.completeLesson)
  const index = kanjiLessons.indexOf(lesson)
  const next = kanjiLessons[index + 1]

  return (
    <StudyLesson
      kicker={`Kanji · ${lesson.unit}`}
      title={lesson.title}
      pages={lesson.chars.map((c) => (
        <KanjiCard key={c} kanji={kanjiByChar.get(c)!} />
      ))}
      exercises={exercises}
      writing={{ items: writing, help: 'trace' }}
      backTo="/kanji"
      next={next && !onFinish ? { to: `/kanji/${next.id}`, title: next.title } : undefined}
      embedded={!!onFinish}
      onComplete={(correct, total) => {
        // Los kanji de la lección entran a los repasos (tarjetas de lectura y escritura).
        complete(lesson.id, correct, total, lesson.chars)
        onFinish?.()
      }}
    />
  )
}

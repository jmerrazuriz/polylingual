import { useState } from 'react'
import { useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { counterById, type CounterLesson, counterLessons } from '../../courses/ja/counters'
import { useProgress } from '../../lib/progress/store'
import { COUNTERS_UNLOCKED_BY, useUnlockedSequence } from '../../lib/progress/unlock'
import { counterLessonExercises } from '../../lib/studyExercises'
import { RichText } from '../grammar/RichText'
import { LearnTabs } from '../learn/LearnTabs'
import { CounterCard, NumbersTable } from './CounterCard'
import { LessonList } from './LessonList'
import { StudyLesson } from './StudyLesson'

const ids = counterLessons.map((l) => l.id)

export function CountersPage() {
  const results = useProgress((s) => s.lessons)
  const unlocked = useUnlockedSequence(ids, COUNTERS_UNLOCKED_BY)
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Números y contadores: en japonés, para contar se agrega una palabra según el tipo de cosa (personas, objetos
          largos, animales…). Aquí aprendes cuál usar y cómo se lee cada uno.
        </p>
      </header>
      <LearnTabs current="contadores" />
      {!unlocked.has(ids[0]) && (
        <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          🔒 Los contadores se abren al completar el hiragana (incluidos dakuten y combinados), porque sus lecturas los usan.
        </p>
      )}
      <LessonList
        lessons={counterLessons.map((l) => ({ id: l.id, title: l.title, summary: l.summary, to: `/contadores/${l.id}` }))}
        results={results}
        unlocked={unlocked}
      />
    </div>
  )
}

export function CounterLessonRoute() {
  const { lessonId } = useParams()
  const unlocked = useUnlockedSequence(ids, COUNTERS_UNLOCKED_BY)
  const lesson = counterLessons.find((l) => l.id === lessonId)
  if (!lesson) return <ComingSoon title="Lección no encontrada" />
  if (!unlocked.has(lesson.id)) return <ComingSoon title="Esta lección todavía está bloqueada" />
  return <CounterLessonView key={lesson.id} lesson={lesson} />
}

/** Lección de contadores: explicación, ficha de cada contador y ejercicios. */
export function CounterLessonView({ lesson, onFinish }: { lesson: CounterLesson; onFinish?: () => void }) {
  const [exercises] = useState(() => counterLessonExercises(lesson))
  const complete = useProgress((s) => s.completeLesson)
  const index = counterLessons.indexOf(lesson)
  const next = counterLessons[index + 1]

  const pages = [
    <div key="intro" className="flex flex-col gap-3">
      {lesson.explanation.map((p, i) => (
        <p key={i} className="leading-relaxed text-slate-700 dark:text-slate-300">
          <RichText text={p} />
        </p>
      ))}
      {lesson.id === 'cont-numeros' && <NumbersTable />}
      {lesson.id === 'cont-grandes' && <NumbersTable big />}
    </div>,
    ...lesson.counters.map((id) => <CounterCard key={id} counter={counterById.get(id)!} />),
  ]

  return (
    <StudyLesson
      kicker={`Contadores · Lección ${index + 1}`}
      title={lesson.title}
      pages={pages}
      exercises={exercises}
      backTo="/contadores"
      next={next && !onFinish ? { to: `/contadores/${next.id}`, title: next.title } : undefined}
      embedded={!!onFinish}
      onComplete={(correct, total) => {
        complete(lesson.id, correct, total)
        onFinish?.()
      }}
    />
  )
}

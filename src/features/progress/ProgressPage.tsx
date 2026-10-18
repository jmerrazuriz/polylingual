import { Link } from 'react-router'
import { allKana, hiragana, katakana } from '../../courses/ja/kana'
import { kanjiLessons, kanjiList } from '../../courses/ja/kanji'
import { lessonsByScript } from '../../courses/ja/lessons'
import type { Kana } from '../../courses/ja/types'
import { achievementsOf } from '../../lib/progress/achievements'
import { EuroProgress } from '../euro/EuroProgress'
import { currentStreak, dayKey, daysBefore, longestStreak, readingMastery } from '../../lib/progress/model'
import { useProgress } from '../../lib/progress/store'
import { now } from '../../lib/time'

const WEEKS = 12
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function ProgressPage() {
  const progress = useProgress()
  const t = now()
  const today = progress.activity[dayKey(t)] ?? 0
  const goal = progress.settings.dailyGoal
  const streak = currentStreak(progress.activity, t)
  const achievements = achievementsOf(progress.course)
  const japanese = progress.course === 'ja'

  const scripts: { title: string; list: Kana[]; script: 'hiragana' | 'katakana' }[] = [
    { title: 'Hiragana', list: hiragana, script: 'hiragana' },
    { title: 'Katakana', list: katakana, script: 'katakana' },
  ]

  // Los que más cuestan: al menos 3 respuestas, ordenados por porcentaje de aciertos.
  const hardest = [
    ...allKana.map((k) => ({ char: k.char, label: k.romaji })),
    ...kanjiList.map((k) => ({ char: k.char, label: k.meaning })),
  ]
    .map((item) => ({ ...item, stat: progress.kana[item.char] }))
    .filter(({ stat }) => stat && stat.readTotal >= 3 && stat.readOk / stat.readTotal < 0.8)
    .sort((a, b) => a.stat!.readOk / a.stat!.readTotal - b.stat!.readOk / b.stat!.readTotal)
    .slice(0, 10)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-extrabold">Tu progreso</h1>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold text-slate-500 uppercase">Racha</p>
          <p className="text-2xl font-extrabold whitespace-nowrap sm:text-3xl">
            🔥 {streak} {streak === 1 ? 'día' : 'días'}
          </p>
          <p className="text-sm text-slate-500">Mejor racha: {longestStreak(progress.activity)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold text-slate-500 uppercase">Objetivo de hoy</p>
          <p className="text-2xl font-extrabold sm:text-3xl">
            {Math.floor(today)}/{goal}
          </p>
          <GoalBar value={today} goal={goal} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Últimas {WEEKS} semanas</h2>
        <Calendar activity={progress.activity} goal={goal} now={t} />
      </section>

      {!japanese && <EuroProgress />}

      {japanese && scripts.map(({ title, list, script }) => {
        const lessons = lessonsByScript[script]
        const mastered = list.filter((k) => readingMastery(progress.kana[k.char]) === 'mastered').length
        const writing = list.reduce(
          (acc, k) => {
            const s = progress.kana[k.char]
            return s ? { score: acc.score + s.writeScore, count: acc.count + s.writeCount } : acc
          },
          { score: 0, count: 0 },
        )
        return (
          <section key={script} className="flex flex-col gap-2">
            <h2 className="text-sm font-extrabold text-slate-500 uppercase">{title}</h2>
            <dl className="grid grid-cols-3 gap-2">
              <Stat label="Lecciones" value={`${lessons.filter((l) => progress.lessons[l.id]).length}/${lessons.length}`} />
              <Stat label="Lectura dominada" value={`${mastered}/${list.length}`} />
              <Stat label="Escritura" value={writing.count ? `${(writing.score / writing.count).toFixed(1)} ★` : '—'} />
            </dl>
          </section>
        )
      })}

      {japanese && (
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Kanji</h2>
        <dl className="grid grid-cols-3 gap-2">
          <Stat label="Lecciones" value={`${kanjiLessons.filter((l) => progress.lessons[l.id]).length}/${kanjiLessons.length}`} />
          <Stat label="Lectura dominada" value={`${kanjiList.filter((k) => readingMastery(progress.kana[k.char]) === 'mastered').length}/${kanjiList.length}`} />
          <Stat
            label="En repaso"
            value={String(kanjiList.filter((k) => progress.cards[`${k.char}:read`]).length)}
          />
        </dl>
      </section>
      )}

      {japanese && (
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">Los que más te cuestan</h2>
        {hardest.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay suficientes respuestas. ¡Sigue practicando!</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {hardest.map(({ char, label, stat }) => (
              <li
                key={char}
                className="flex items-baseline gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 dark:border-amber-800 dark:bg-amber-950/40"
              >
                <span lang="ja" className="font-jp text-2xl">
                  {char}
                </span>
                <span className="text-sm font-bold">{label}</span>
                <span className="text-xs text-slate-500">{Math.round((stat!.readOk / stat!.readTotal) * 100)} %</span>
              </li>
            ))}
          </ul>
        )}
        {hardest.length > 0 && (
          <Link to="/repaso/debiles" className="self-start rounded-full bg-ink px-5 py-2 text-sm font-bold text-white hover:opacity-90">
            Repasar mis puntos débiles →
          </Link>
        )}
      </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold text-slate-500 uppercase">
          Logros · {achievements.filter((a) => a.id in progress.achievements).length}/{achievements.length}
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {achievements.map((a) => {
            const got = a.id in progress.achievements
            return (
              <li
                key={a.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  got
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                    : 'border-slate-200 bg-white opacity-60 grayscale dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <span className={`text-3xl ${a.course === 'ja' ? 'font-jp' : ''}`} aria-hidden>
                  {a.icon}
                </span>
                <span>
                  <span className="block text-sm font-extrabold">
                    {a.title}
                    <span className="sr-only">{got ? ' (obtenido)' : ' (pendiente)'}</span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{a.description}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-bold text-slate-500 uppercase">{label}</dt>
      <dd className="text-xl font-extrabold">{value}</dd>
    </div>
  )
}

export function GoalBar({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(100, (value / goal) * 100)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-valuenow={Math.floor(value)}
      aria-label="Objetivo diario"
      className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
    >
      <div className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-accent'}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

/** Calendario tipo mapa de calor: una columna por semana, de lunes a domingo. */
function Calendar({ activity, goal, now: t }: { activity: Record<string, number>; goal: number; now: number }) {
  // Lunes de la semana actual, y desde ahí hacia atrás.
  const weekday = (new Date(t).getDay() + 6) % 7
  const start = daysBefore(t, weekday + (WEEKS - 1) * 7)
  const today = dayKey(t)

  return (
    <div className="flex gap-1 overflow-x-auto">
      <div className="flex flex-col gap-1 pr-1 text-[10px] font-bold text-slate-400">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="flex h-4 items-center">
            {d}
          </span>
        ))}
      </div>
      {Array.from({ length: WEEKS }, (_, w) => (
        <div key={w} className="flex flex-col gap-1">
          {Array.from({ length: 7 }, (_, d) => {
            const time = daysBefore(start, -(w * 7 + d))
            const key = dayKey(time)
            const n = activity[key] ?? 0
            const future = key > today
            const color = future
              ? 'bg-transparent'
              : n === 0
                ? 'bg-slate-200 dark:bg-slate-800'
                : n >= goal
                  ? 'bg-emerald-500'
                  : 'bg-emerald-200 dark:bg-emerald-900'
            return (
              <span
                key={d}
                title={future ? undefined : `${key}: ${Math.floor(n)} respuestas`}
                className={`h-4 w-4 rounded ${color} ${key === today ? 'ring-2 ring-accent' : ''}`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

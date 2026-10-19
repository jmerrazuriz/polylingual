import { Link } from 'react-router'
import { courseById } from '../../courses'
import { characters as germanCharacters } from '../../courses/de/levels'
import type { EuroCourse } from '../../courses/euro'
import { euroCourses } from '../../courses/euroCourses'
import { characters as frenchCharacters } from '../../courses/fr/levels'
import { characters as italianCharacters } from '../../courses/it/levels'
import { useAccount } from '../../lib/account/store'
import { isDailyComplete } from '../../lib/daily'
import { lessons as allLessons } from '../../courses/ja/lessons'
import { nextDue } from '../../lib/progress/srs'
import { progressSnapshot, useProgress } from '../../lib/progress/store'
import { useUnlockedLessons } from '../../lib/progress/unlock'
import { currentStreak, dayKey } from '../../lib/progress/model'
import { GoalBar } from '../progress/ProgressPage'
import { cardsOfCourse, describeDue, dueNowCount } from '../../lib/review'
import { now } from '../../lib/time'

const features = [
  { to: '/tabla', glyph: 'あ', title: 'Tabla rápida', text: 'Todos los caracteres de un vistazo.' },
  { to: '/aprender', glyph: '学', title: 'Recorrido', text: 'Avanza unidad por unidad, parada por parada.' },
  { to: '/extra', glyph: '∞', title: 'Lección extra', text: 'Sin límite: se arma con lo que ya sabes.' },
  { to: '/contadores', glyph: '数', title: 'Contadores', text: 'Cómo contar personas, cosas, horas y fechas.' },
  { to: '/kanji', glyph: '字', title: 'Kanji', text: 'Los kanji del nivel N5 con trazos y ejemplos.' },
  { to: '/gramatica', glyph: '文', title: 'Gramática', text: 'Partículas y frases básicas con ejercicios.' },
  { to: '/practicar', glyph: '書', title: 'Practicar', text: 'Lee y escribe con el dedo, con corrección.' },
  { to: '/juegos', glyph: '遊', title: 'Juegos', text: 'Une parejas de caracteres y palabras.' },
]

export function HomePage() {
  const course = courseById(useProgress((s) => s.course))
  if (euroCourses[course.id]) return <EuroHome course={euroCourses[course.id]} />
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-4 pt-6 text-center">
        <div className="flex gap-3 font-jp text-7xl font-bold md:text-8xl">
          <span className="text-ink dark:text-white">あ</span>
          <span className="text-accent">ア</span>
        </div>
        <h1 className="text-3xl font-extrabold md:text-4xl">
          {course.flag} {course.name}
        </h1>
        <p className="max-w-md text-slate-600 dark:text-slate-400">
          {course.tagline} Tu progreso te acompaña en cualquier dispositivo.
        </p>
      </section>

      <DailyCard />
      <DailyStrip />
      <TodayCard />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink font-jp text-3xl text-white">
              {f.glyph}
            </span>
            <span>
              <span className="block font-extrabold">{f.title}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{f.text}</span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}

/** Repasos de hoy, o qué hacer si no hay. */
function TodayCard() {
  const cards = cardsOfCourse(useProgress((s) => s.cards), 'ja')
  const lessons = useProgress((s) => s.lessons)
  const t = now()
  const due = dueNowCount(cards, t)
  const next = nextDue(cards, t)
  const unlocked = useUnlockedLessons()
  const nextLesson = allLessons.find((l) => unlocked.has(l.id) && !lessons[l.id])

  if (due > 0) {
    return (
      <Link
        to="/repasar"
        className="flex items-center gap-4 rounded-2xl bg-ink p-5 text-white transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <span className="text-4xl font-extrabold">{due}</span>
        <span className="flex-1">
          <span className="block text-lg font-extrabold">{due === 1 ? 'repaso pendiente' : 'repasos pendientes'}</span>
          <span className="text-sm opacity-80">Lo justo para no olvidar lo que ya aprendiste.</span>
        </span>
        <span className="rounded-full bg-white px-4 py-2 font-bold text-ink">Repasar</span>
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
      <span className="flex-1">
        <span className="block font-extrabold">{next ? '¡Al día con los repasos!' : 'Empieza por la primera lección'}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {next
            ? `El próximo repaso es ${describeDue(next, t)}.`
            : 'Cada lección que completes agrega sus caracteres a tus repasos diarios.'}
        </span>
      </span>
      {nextLesson && (
        <Link
          to={`/aprender/${nextLesson.id}`}
          className="self-start rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:opacity-90 sm:self-auto"
        >
          Lección: {nextLesson.title}
        </Link>
      )}
    </div>
  )
}

/** Racha y objetivo de hoy, con enlace al panel de progreso. */
function DailyStrip() {
  const activity = useProgress((s) => s.activity)
  const goal = useProgress((s) => s.settings.dailyGoal)
  const t = now()
  const today = activity[dayKey(t)] ?? 0
  const streak = currentStreak(activity, t)

  return (
    <Link
      to="/progreso"
      className="-mb-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <span className="text-lg font-extrabold whitespace-nowrap">
        🔥 {streak} {streak === 1 ? 'día' : 'días'}
      </span>
      <span className="flex-1">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Hoy: {Math.floor(today)}/{goal} respuestas{today >= goal ? ' · ¡objetivo cumplido!' : ''}
        </span>
        <GoalBar value={today} goal={goal} />
      </span>
      <span className="text-slate-400" aria-hidden>
        →
      </span>
    </Link>
  )
}

/** Lección del día: el punto de partida de cada visita. */
function DailyCard() {
  const record = useProgress((s) => s.daily[dayKey(now())])
  const done = isDailyComplete(record)
  const progress = record && record.steps.length ? `${record.done.filter((d) => record.steps.includes(d)).length}/${record.steps.length} pasos` : null

  return (
    <Link
      to="/hoy"
      className={`-mb-6 flex items-center gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
        done ? 'border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'bg-accent text-white'
      }`}
    >
      <span className="text-4xl" aria-hidden>
        {done ? '✅' : '☀️'}
      </span>
      <span className="flex-1">
        <span className="block text-lg font-extrabold">{done ? 'Lección de hoy completada' : 'Lección de hoy'}</span>
        <span className={`text-sm ${done ? 'text-slate-600 dark:text-slate-300' : 'opacity-90'}`}>
          {done ? 'Vuelve mañana por una nueva.' : progress ? `Vas en ${progress}.` : 'Repasos, algo nuevo y un juego: unos 10 minutos.'}
        </span>
      </span>
      {!done && <span className="rounded-full bg-white px-4 py-2 font-bold text-accent">{progress ? 'Seguir' : 'Empezar'}</span>}
    </Link>
  )
}

/** Lo que cambia en el inicio de cada curso europeo. */
const euroHome: Record<string, { hero: [string, string]; title: string; text: string; characters: { name: string; description: string }[]; words: string; texts: string; tables: [string, string]; practice: string }> = {
  de: {
    hero: ['Ä', 'ß'],
    title: '🇩🇪 Alemán · Ottos Weg',
    text: 'Del A1 al C2, con alemán para vivir y trabajar en Alemania.',
    characters: Object.values(germanCharacters),
    words: 'Con artículo y plural, y repaso espaciado.',
    texts: 'Las historias de Otto y Hans, como en el examen.',
    tables: ['der', 'Artículos, casos, terminaciones y un conjugador.'],
    practice: 'Artículos, plurales, conjugación y declinación en sesiones cortas.',
  },
  fr: {
    hero: ['É', 'ç'],
    title: '🇫🇷 Francés · Le chemin de Camila',
    text: 'Del A1 al C2, con francés para vivir, estudiar y trabajar en Francia.',
    characters: Object.values(frenchCharacters),
    words: 'Con artículo y género, y repaso espaciado.',
    texts: 'Las historias de Camila y Julien, como en el examen.',
    tables: ['l’', 'Artículos, pronombres, un conjugador y los números.'],
    practice: 'Género, femeninos, conjugación y números en sesiones cortas.',
  },
  it: {
    hero: ['È', 'gli'],
    title: '🇮🇹 Italiano · La strada di Lucca',
    text: 'Del A1 al C2, con italiano para vivir en Italia y obtener la nacionalidad.',
    characters: Object.values(italianCharacters),
    words: 'Con artículo y plural, y repaso espaciado.',
    texts: 'Las historias de Lucca y Bruno, como en el examen.',
    tables: ['lo', 'Artículos, preposiciones articuladas, plurales, pronombres, un conjugador y los números.'],
    practice: 'Artículos, plurales, dobles consonantes, conjugación y números en sesiones cortas.',
  },
}

/** Inicio de un curso europeo: seguir el recorrido, repasar y las secciones. */
function EuroHome({ course }: { course: EuroCourse }) {
  const guest = useAccount((s) => s.status !== 'user')
  const cards = useProgress((s) => s.cards)
  useProgress((s) => s.lessons)
  useProgress((s) => s.grammar)
  useProgress((s) => s.records)
  const home = euroHome[course.id]
  const items = course.path.flatMap((u) => u.stops.flatMap((s) => s.items))
  const status = course.itemStatus(progressSnapshot(), guest)
  const next = items.find((i) => status(i) === 'open' && i.kind !== 'exam') ?? items.find((i) => status(i) === 'open')
  const exam = items.find((i) => i.kind === 'exam' && status(i) !== 'done') ?? items.filter((i) => i.kind === 'exam').at(-1)
  const done = items.filter((i) => status(i) === 'done').length
  const due = dueNowCount(cardsOfCourse(cards, course.id), now())
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center gap-4 pt-6 text-center">
        <div lang={course.lang} className="flex gap-3 text-6xl font-extrabold md:text-7xl">
          <span className="text-ink dark:text-white">{home.hero[0]}</span>
          <span className="text-accent">{home.hero[1]}</span>
        </div>
        <h1 className="text-3xl font-extrabold md:text-4xl">{home.title}</h1>
        <p className="max-w-md text-slate-600 dark:text-slate-400">
          {home.text} {done}/{items.length} lecciones del recorrido completadas.
        </p>
      </section>

      <DailyCard />
      <DailyStrip />

      {next && (
        <Link to={next.to} className="flex items-center gap-4 rounded-2xl bg-accent p-5 text-white shadow-md hover:opacity-95">
          <span className="text-4xl" aria-hidden>
            ▶
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold uppercase opacity-90">{done === 0 ? 'Empieza aquí' : 'Continuar'}</span>
            <span className="block text-lg font-extrabold">{next.title}</span>
          </span>
        </Link>
      )}

      {due > 0 && (
        <Link to="/repasar" className="flex items-center gap-3 rounded-2xl border-2 border-accent/40 bg-white p-4 font-bold dark:bg-slate-900">
          <span className="text-2xl" aria-hidden>
            🔁
          </span>
          Tienes {due} {due === 1 ? 'palabra' : 'palabras'} para repasar
        </Link>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {home.characters.map((c) => (
          <div key={c.name} className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-lg font-extrabold">{c.name}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{c.description}</span>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { to: '/aprender', glyph: 'A1', title: 'Recorrido', text: 'Unidad por unidad, del A1 al C2.' },
          { to: '/gramatica', glyph: 'G', title: 'Gramática', text: 'Explicaciones cortas, ejemplos con audio y ejercicios.' },
          { to: '/palabras', glyph: 'W', title: 'Palabras', text: home.words },
          { to: '/textos', glyph: 'T', title: 'Lectura y audio', text: home.texts },
          { to: '/tabla', glyph: home.tables[0], title: 'Tablas', text: home.tables[1] },
          { to: '/practicar', glyph: '✍️', title: 'Practicar', text: home.practice },
          { to: '/juegos', glyph: '🎮', title: 'Juegos', text: 'Parejas, sonidos y desafíos contra el reloj.' },
          ...(exam ? [{ to: exam.to, glyph: '📝', title: `Simulacro ${course.examName(exam.id as 'A1')}`, text: 'La meta del nivel: escuchar, leer, escribir y hablar.' }] : []),
        ].map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <span lang={course.lang} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink text-xl font-extrabold text-white">
              {f.glyph}
            </span>
            <span>
              <span className="block font-extrabold">{f.title}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{f.text}</span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}


import { Link } from 'react-router'
import { hiraganaLessons } from '../../content/lessons'
import { nextDue } from '../../lib/progress/srs'
import { useProgress } from '../../lib/progress/store'
import { describeDue, dueNowCount } from '../../lib/review'
import { now } from '../../lib/time'

const features = [
  { to: '/tabla', glyph: 'あ', title: 'Tabla rápida', text: 'Todos los caracteres de un vistazo.' },
  { to: '/aprender', glyph: '学', title: 'Aprender', text: 'Lecciones con orden de trazos y palabras.' },
  { to: '/practicar', glyph: '書', title: 'Practicar', text: 'Lee y escribe con el dedo, con corrección.' },
  { to: '/juegos', glyph: '遊', title: 'Juegos', text: 'Une parejas de caracteres y palabras.' },
]

export function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-4 pt-6 text-center">
        <div className="flex gap-3 font-jp text-7xl font-bold md:text-8xl">
          <span className="text-ink dark:text-white">あ</span>
          <span className="text-accent">ア</span>
        </div>
        <h1 className="text-3xl font-extrabold md:text-4xl">Aprende hiragana y katakana</h1>
        <p className="max-w-md text-slate-600 dark:text-slate-400">
          Lee, escribe y juega con los silabarios japoneses. Tu progreso te acompaña en cualquier
          dispositivo.
        </p>
      </section>

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
  const cards = useProgress((s) => s.cards)
  const lessons = useProgress((s) => s.lessons)
  const t = now()
  const due = dueNowCount(cards, t)
  const next = nextDue(cards, t)
  const nextLesson = hiraganaLessons.find((l) => !lessons[l.id])

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

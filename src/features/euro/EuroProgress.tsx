import { euroLevels } from '../../courses/euro'
import { useProgress } from '../../lib/progress/store'
import { useEuroCourse } from './useEuroCourse'

/** Progreso del curso europeo activo por nivel: gramática, palabras, textos y simulacro. */
export function EuroProgress() {
  const course = useEuroCourse()
  const grammar = useProgress((s) => s.grammar)
  const lessons = useProgress((s) => s.lessons)
  const records = useProgress((s) => s.records)
  const cards = useProgress((s) => s.cards)
  const inReview = new Set(Object.keys(cards).filter((id) => id.startsWith(course.wordCardPrefix)).map((id) => id.split(':')[0])).size

  const levels = euroLevels
    .map((level) => {
      const g = course.grammar.filter((l) => l.level === level)
      const v = course.vocabLessons.filter((l) => l.level === level)
      const t = course.texts.filter((x) => x.level === level)
      return {
        level,
        grammar: `${g.filter((l) => grammar[l.id]).length}/${g.length}`,
        words: `${v.filter((l) => lessons[l.id]).length}/${v.length}`,
        texts: `${t.filter((x) => lessons[x.id]).length}/${t.length}`,
        exam: course.itemDone({ lessons, grammar, records }, { kind: 'exam', id: level, title: '', to: '' }),
        empty: g.length + v.length + t.length === 0,
      }
    })
    .filter((l) => !l.empty)

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-extrabold text-slate-500 uppercase">{course.name[0].toUpperCase() + course.name.slice(1)} · {inReview} palabras en repaso</h2>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase">
            <tr>
              <th className="p-3 text-left">Nivel</th>
              <th className="p-3 text-right">Gramática</th>
              <th className="p-3 text-right">Palabras</th>
              <th className="p-3 text-right">Textos</th>
              <th className="p-3 text-right">{course.examName('A1').split(' ')[0].replace('-Zertifikat', '')}</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l) => (
              <tr key={l.level} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-3 font-extrabold">{l.level}</td>
                <td className="p-3 text-right">{l.grammar}</td>
                <td className="p-3 text-right">{l.words}</td>
                <td className="p-3 text-right">{l.texts}</td>
                <td className="p-3 text-right">{l.exam ? '✓' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

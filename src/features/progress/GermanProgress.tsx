import { germanGrammar } from '../../courses/de/grammar'
import { cefrLevels } from '../../courses/de/levels'
import { goethePassedKey } from '../../courses/de/progress'
import { germanTexts } from '../../courses/de/texts'
import { germanVocabLessons } from '../../courses/de/vocab'
import { useProgress } from '../../lib/progress/store'

/** Progreso del alemán por nivel: gramática, palabras, textos y simulacro Goethe. */
export function GermanProgress() {
  const grammar = useProgress((s) => s.grammar)
  const lessons = useProgress((s) => s.lessons)
  const records = useProgress((s) => s.records)
  const cards = useProgress((s) => s.cards)
  const inReview = new Set(Object.keys(cards).filter((id) => id.startsWith('dw-')).map((id) => id.split(':')[0])).size

  const levels = cefrLevels
    .map((level) => {
      const g = germanGrammar.filter((l) => l.level === level)
      const v = germanVocabLessons.filter((l) => l.level === level)
      const t = germanTexts.filter((x) => x.level === level)
      return {
        level,
        grammar: `${g.filter((l) => grammar[l.id]).length}/${g.length}`,
        words: `${v.filter((l) => lessons[l.id]).length}/${v.length}`,
        texts: `${t.filter((x) => lessons[x.id]).length}/${t.length}`,
        goethe: !!records[goethePassedKey(level)],
        empty: g.length + v.length + t.length === 0,
      }
    })
    .filter((l) => !l.empty)

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-extrabold text-slate-500 uppercase">Alemán · {inReview} palabras en repaso</h2>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase">
            <tr>
              <th className="p-3 text-left">Nivel</th>
              <th className="p-3 text-right">Gramática</th>
              <th className="p-3 text-right">Palabras</th>
              <th className="p-3 text-right">Textos</th>
              <th className="p-3 text-right">Goethe</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l) => (
              <tr key={l.level} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-3 font-extrabold">{l.level}</td>
                <td className="p-3 text-right">{l.grammar}</td>
                <td className="p-3 text-right">{l.words}</td>
                <td className="p-3 text-right">{l.texts}</td>
                <td className="p-3 text-right">{l.goethe ? '✓' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

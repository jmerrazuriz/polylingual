import { Link } from 'react-router'
import { firstPendingBlock, placementBlocks } from '../../lib/pathPlacement'
import { useProgress } from '../../lib/progress/store'

/** Acceso al test de nivelación desde el perfil, para quien vuelve después de un tiempo. */
export function PlacementCard() {
  const lessons = useProgress((s) => s.lessons)
  const grammar = useProgress((s) => s.grammar)
  const units = useProgress((s) => s.units)
  // Los bloques de esta tarjeta son los del japonés; otros cursos tienen su propio test en /nivelacion.
  const japanese = useProgress((s) => s.course) === 'ja'
  const start = japanese ? firstPendingBlock({ lessons, grammar, units }) : 0
  if (japanese && start === placementBlocks.length) return null

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          🧭
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-extrabold">Test de nivelación</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ¿Volviste después de un tiempo o estudiaste por tu cuenta? Demuestra lo que sabes y desbloquea esa parte del recorrido.
            {japanese && start > 0 && ` Empiezas en el bloque ${start + 1} de ${placementBlocks.length}, «${placementBlocks[start].title}».`} Solo
            agrega progreso: nunca borra lo que ya hiciste.
          </p>
        </div>
      </div>
      <Link to="/nivelacion" className="self-start rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
        Hacer el test
      </Link>
    </section>
  )
}

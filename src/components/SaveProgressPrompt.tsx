import { Link, useLocation } from 'react-router'
import { useAccount } from '../lib/account/store'

/** Al terminar una actividad, invita a los invitados a crear una cuenta sin perder lo recién hecho. */
export function SaveProgressPrompt() {
  const status = useAccount((s) => s.status)
  const { pathname, search } = useLocation()
  if (status !== 'guest') return null

  const back = encodeURIComponent(pathname + search)
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 p-4 text-center text-sm dark:border-slate-700">
      <p className="text-slate-600 dark:text-slate-400">Estás como invitado: este progreso se perderá al cerrar la página.</p>
      <Link to={`/entrar?modo=crear&volver=${back}`} className="font-bold text-accent hover:underline">
        Crear cuenta y guardar esta sesión
      </Link>
    </div>
  )
}

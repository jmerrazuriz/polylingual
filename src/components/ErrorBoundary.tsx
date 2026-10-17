import { Component, type ReactNode } from 'react'
import { isChunkError, reloadOnce } from '../lib/reloadOnce'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * Si una página falla al cargar o al dibujarse, muestra un aviso con la opción de
 * recargar en vez de dejar la pantalla en blanco. Si el fallo es porque se publicó una
 * versión nueva, recarga sola una vez. Para reiniciarlo al cambiar de página, se le da
 * una `key` distinta por ruta.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('Error en la página', error)
    if (isChunkError(error)) reloadOnce()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    const newVersion = isChunkError(error)
    return (
      <section role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <span className="text-5xl" aria-hidden>
          {newVersion ? '🔄' : '😵'}
        </span>
        <h1 className="text-2xl font-extrabold">{newVersion ? 'Hay una versión nueva' : 'Algo salió mal'}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {newVersion
            ? 'La app se actualizó mientras la tenías abierta. Recarga para seguir con la versión nueva; tu progreso no se pierde.'
            : 'Esta página tuvo un problema. Recarga para intentarlo de nuevo; tu progreso no se pierde.'}
        </p>
        <button onClick={() => window.location.reload()} className="rounded-full bg-ink px-8 py-3 font-bold text-white hover:opacity-90">
          Recargar
        </button>
        <a href="/" className="text-sm font-bold text-slate-500 underline">
          Volver al inicio
        </a>
        {!newVersion && (
          <details className="w-full text-left text-xs text-slate-500">
            <summary className="cursor-pointer">Detalle del error</summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-100 p-2 whitespace-pre-wrap dark:bg-slate-800">{error.message}</pre>
          </details>
        )}
      </section>
    )
  }
}

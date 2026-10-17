// Cuando se publica una versión nueva, los archivos de cada página cambian de nombre.
// Si alguien tenía abierta la versión anterior, al abrir una página se pide un archivo
// que ya no existe. La solución es recargar para traer la versión nueva, pero una sola
// vez: si vuelve a fallar enseguida, se muestra el error en vez de recargar sin fin.

const KEY = 'polylingual:recarga'
/** Si la última recarga automática fue hace menos de esto, no se vuelve a recargar. */
const WINDOW_MS = 30_000

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>

/** ¿Hay que recargar? Guarda la hora de la recarga para no repetirla en bucle. */
export function shouldReload(storage: Storage | undefined, now: number): boolean {
  try {
    const last = Number(storage?.getItem(KEY) ?? 0)
    if (last && now - last < WINDOW_MS) return false
    storage?.setItem(KEY, String(now))
    return true
  } catch {
    // Sin almacenamiento (modo privado estricto): mejor no arriesgar un bucle.
    return false
  }
}

const session = () => {
  try {
    return window.sessionStorage
  } catch {
    return undefined
  }
}

/** Recarga la página una sola vez (por si la versión cambió). Devuelve true si recargó. */
export function reloadOnce(): boolean {
  if (!shouldReload(session(), Date.now())) return false
  window.location.reload()
  return true
}

/** ¿El error es de un archivo de la app que no se pudo bajar (versión vieja o sin conexión)? */
export const isChunkError = (error: unknown) =>
  error instanceof Error &&
  /dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically|ChunkLoadError|not a valid JavaScript MIME type/i.test(
    `${error.name} ${error.message}`,
  )

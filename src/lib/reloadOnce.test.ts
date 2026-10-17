import { describe, expect, it } from 'vitest'
import { isChunkError, shouldReload } from './reloadOnce'

const memory = () => {
  const data = new Map<string, string>()
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
}

describe('recarga cuando cambia la versión', () => {
  it('recarga una sola vez seguida, para no quedar en un bucle', () => {
    const storage = memory()
    expect(shouldReload(storage, 1_000)).toBe(true)
    expect(shouldReload(storage, 5_000)).toBe(false)
    // Pasado un rato, una nueva publicación puede volver a recargar.
    expect(shouldReload(storage, 60_000)).toBe(true)
  })

  it('sin almacenamiento no recarga', () => {
    const broken = {
      getItem: () => {
        throw new Error('bloqueado')
      },
      setItem: () => {},
    }
    expect(shouldReload(broken, 1_000)).toBe(false)
  })

  it('reconoce los errores de archivos que no se pudieron bajar', () => {
    expect(isChunkError(new TypeError('Failed to fetch dynamically imported module: https://x/assets/LessonPage-abc.js'))).toBe(true)
    expect(isChunkError(new TypeError("'text/html' is not a valid JavaScript MIME type."))).toBe(true)
    expect(isChunkError(new Error('Cannot read properties of undefined'))).toBe(false)
  })
})

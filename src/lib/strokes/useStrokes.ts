import { useEffect, useSyncExternalStore } from 'react'
import { loadKanjiStrokes, strokesReady, subscribeStrokes } from '../../courses/ja/kana'

/**
 * ¿Están los trazos de estos caracteres? Si falta alguno (kanji), los empieza a
 * cargar y el componente se vuelve a dibujar cuando llegan.
 */
export function useStrokesReady(chars: readonly string[]): boolean {
  const ready = useSyncExternalStore(subscribeStrokes, () => strokesReady(chars))
  useEffect(() => {
    if (!ready) void loadKanjiStrokes()
  }, [ready])
  return ready
}

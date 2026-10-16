import { kanjiLessons } from '../../courses/ja/kanji.ts'
import { now } from '../time.ts'
import { cardId, newCard } from './srs.ts'
import { useProgress } from './store.ts'

let started = false

/**
 * Antes los kanji no tenían tarjetas de repaso. Si hay lecciones de kanji
 * completadas sin tarjetas (progreso guardado antes del cambio), se crean.
 * Se revisa cada vez que cambia el progreso (p. ej. al cargarlo desde la cuenta).
 */
export function watchKanjiCards() {
  if (started) return
  started = true
  const check = () => {
    const { lessons, cards } = useProgress.getState()
    const missing = kanjiLessons
      .filter((l) => lessons[l.id])
      .flatMap((l) => l.chars)
      .filter((c) => !cards[cardId(c, 'read')] || !cards[cardId(c, 'write')])
    if (missing.length === 0) return
    const t = now()
    useProgress.setState((s) => {
      const next = { ...s.cards }
      for (const c of missing) for (const skill of ['read', 'write'] as const) next[cardId(c, skill)] ??= newCard(t)
      return { cards: next }
    })
  }
  check()
  useProgress.subscribe(check)
}

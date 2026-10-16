import { type Card, createEmptyCard, fsrs, generatorParameters, type Grade, Rating } from 'ts-fsrs'

// Repetición espaciada con FSRS (el algoritmo de Anki). Cada carácter tiene dos
// tarjetas independientes: lectura y escritura.

export type SrsSkill = 'read' | 'write'

/** Tarjeta FSRS guardable en Firestore (fechas en milisegundos). */
export type SrsCard = {
  due: number
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  state: number
  last_review: number | null
}

const scheduler = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.9 }))

export const cardId = (char: string, skill: SrsSkill) => `${char}:${skill}`

export function parseCardId(id: string): { char: string; skill: SrsSkill } | null {
  const [char, skill] = id.split(':')
  return char && (skill === 'read' || skill === 'write') ? { char, skill } : null
}

const toStored = (card: Card): SrsCard => ({
  due: card.due.getTime(),
  stability: card.stability,
  difficulty: card.difficulty,
  elapsed_days: card.elapsed_days,
  scheduled_days: card.scheduled_days,
  learning_steps: card.learning_steps,
  reps: card.reps,
  lapses: card.lapses,
  state: card.state,
  last_review: card.last_review ? card.last_review.getTime() : null,
})

const fromStored = (card: SrsCard): Card => ({
  ...card,
  due: new Date(card.due),
  last_review: card.last_review === null ? undefined : new Date(card.last_review),
})

/** Tarjeta nueva, para repasar desde ya. */
export const newCard = (now: number): SrsCard => toStored(createEmptyCard(now))

/** Aplica una respuesta a la tarjeta (o a una nueva si aún no existe) y devuelve la tarjeta reprogramada. */
export function review(card: SrsCard | undefined, grade: Grade, now: number): SrsCard {
  return toStored(scheduler.next(fromStored(card ?? newCard(now)), now, grade).card)
}

export const gradeForReading = (correct: boolean): Grade => (correct ? Rating.Good : Rating.Again)

/** Puntaje de escritura (1–5) a calificación FSRS. */
export function gradeForWriting(score: number): Grade {
  if (score >= 4) return Rating.Good
  if (score === 3) return Rating.Hard
  return Rating.Again
}

/** Fin del día local: los repasos de "hoy" son los que vencen antes de esa hora. */
export function endOfDay(now: number): number {
  const d = new Date(now)
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

export type DueCard = { id: string; char: string; skill: SrsSkill; card: SrsCard }

/** Tarjetas que vencen hasta `until`, las más atrasadas primero. */
export function dueCards(cards: Record<string, SrsCard>, until: number): DueCard[] {
  return Object.entries(cards)
    .filter(([, card]) => card.due <= until)
    .flatMap(([id, card]) => {
      const parsed = parseCardId(id)
      return parsed ? [{ id, ...parsed, card }] : []
    })
    .sort((a, b) => a.card.due - b.card.due)
}

/** Próximo vencimiento después de `after`, o null si no hay tarjetas. */
export function nextDue(cards: Record<string, SrsCard>, after: number): number | null {
  const future = Object.values(cards)
    .map((c) => c.due)
    .filter((d) => d > after)
  return future.length ? Math.min(...future) : null
}

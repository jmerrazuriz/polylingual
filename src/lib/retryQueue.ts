import { useState } from 'react'

// Cola de preguntas de una lección del recorrido: la pregunta fallada vuelve al final de la cola
// y la lección no termina hasta acertarlas todas. Las falladas vuelven en el orden en que se
// fallaron. La nota cuenta solo el primer intento de cada pregunta.

export type RetryQueue = {
  /** Índices de las preguntas, en el orden en que se muestran (con las repeticiones al final). */
  queue: number[]
  /** Posición actual en la cola. */
  pos: number
  /** Resultado del primer intento de cada pregunta. */
  firstTry: (boolean | undefined)[]
}

export const startQueue = (total: number): RetryQueue => ({ queue: Array.from({ length: total }, (_, i) => i), pos: 0, firstTry: [] })

/** Registra la respuesta a la pregunta actual y avanza; si falló, la pregunta vuelve al final. */
export function answerQueue(q: RetryQueue, ok: boolean): RetryQueue {
  const current = q.queue[q.pos]
  const firstTry = [...q.firstTry]
  if (firstTry[current] === undefined) firstTry[current] = ok
  return { queue: ok ? q.queue : [...q.queue, current], pos: q.pos + 1, firstTry }
}

export const queueDone = (q: RetryQueue) => q.pos >= q.queue.length
/** La pregunta actual ya se había mostrado antes (es una repetición). */
export const isRetry = (q: RetryQueue) => q.queue.indexOf(q.queue[q.pos]) < q.pos
export const firstTryCorrect = (q: RetryQueue) => q.firstTry.filter(Boolean).length

/** Estado de la cola en un componente: `answer` devuelve el estado nuevo para decidir si terminó. */
export function useRetryQueue(total: number) {
  const [state, setState] = useState(() => startQueue(total))
  const answer = (ok: boolean) => {
    const next = answerQueue(state, ok)
    setState(next)
    return next
  }
  return {
    state,
    /** Índice de la pregunta actual (undefined si terminó). */
    current: state.queue[state.pos] as number | undefined,
    retry: isRetry(state),
    answer,
  }
}

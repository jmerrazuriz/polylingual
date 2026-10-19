import { describe, expect, it } from 'vitest'
import { answerQueue, firstTryCorrect, isRetry, queueDone, type RetryQueue, startQueue } from './retryQueue'

const run = (total: number, answers: boolean[]) => answers.reduce<RetryQueue>((q, ok) => answerQueue(q, ok), startQueue(total))

describe('cola de repetición de las lecciones', () => {
  it('sin errores termina tras una pasada', () => {
    const q = run(3, [true, true, true])
    expect(queueDone(q)).toBe(true)
    expect(firstTryCorrect(q)).toBe(3)
  })

  it('las falladas vuelven al final, en el mismo orden, hasta acertarlas', () => {
    // Falla la 1 y la 3 (índices 0 y 2), luego otra vez la 1.
    let q = run(4, [false, true, false, true])
    expect(q.queue).toEqual([0, 1, 2, 3, 0, 2])
    expect(queueDone(q)).toBe(false)
    expect(isRetry(q)).toBe(true)
    q = answerQueue(q, false) // vuelve a fallar la 0
    expect(q.queue).toEqual([0, 1, 2, 3, 0, 2, 0])
    q = answerQueue(q, true) // acierta la 2
    expect(queueDone(q)).toBe(false)
    q = answerQueue(q, true) // acierta la 0
    expect(queueDone(q)).toBe(true)
  })

  it('la nota cuenta solo el primer intento', () => {
    const q = run(3, [false, true, true, true])
    expect(queueDone(q)).toBe(true)
    expect(firstTryCorrect(q)).toBe(2)
  })

  it('una lección sin preguntas está terminada', () => {
    expect(queueDone(startQueue(0))).toBe(true)
  })
})

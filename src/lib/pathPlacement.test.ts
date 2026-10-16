import { beforeEach, describe, expect, it } from 'vitest'
import { japanesePath, pathStatus } from './path'
import { blockItems, buildBlock, firstPendingBlock, hasNotStarted, passMark, placementBlocks, placementResult, QUESTIONS_PER_BLOCK } from './pathPlacement'
import { emptyProgress } from './progress/model'
import { progressSnapshot, useProgress } from './progress/store'

describe('test de nivelación del recorrido', () => {
  beforeEach(() => useProgress.getState().reset())

  it('los bloques cubren todas las unidades del recorrido, en orden y una sola vez', () => {
    expect(placementBlocks.flatMap((b) => b.unitIds)).toEqual(japanesePath.map((u) => u.id))
  })

  it('cada bloque tiene 8 preguntas con la respuesta entre las opciones', () => {
    for (const block of placementBlocks) {
      for (let run = 0; run < 5; run++) {
        const questions = buildBlock(block)
        expect(questions, block.id).toHaveLength(QUESTIONS_PER_BLOCK)
        for (const q of questions) {
          expect(q.type, block.id).not.toBe('type')
          if (q.type === 'choice' || q.type === 'meaning') expect(q.options, block.id).toContain(q.answer)
        }
      }
    }
  })

  it('el bloque mezcla los tipos de lección que tiene', () => {
    const block = placementBlocks.find((b) => b.id === 'kanji-1')!
    const kinds = new Set(blockItems(block).filter((i) => i.kind !== 'unit').map((i) => i.kind))
    expect(kinds.size).toBeGreaterThanOrEqual(4)
  })

  it('se aprueba con 80 %', () => {
    expect(passMark(8)).toBe(7)
  })

  it('aprobar el primer bloque completa el hiragana básico y lleva a la parada siguiente', () => {
    expect(hasNotStarted(emptyProgress())).toBe(true)
    useProgress.getState().applyPlacement(placementResult(placementBlocks.slice(0, 1)))
    const p = progressSnapshot()
    expect(hasNotStarted(p)).toBe(false)
    expect(p.lessons.vocales).toBeDefined()
    expect(p.lessons.w).toBeDefined()
    expect(p.units['hiragana-basic']).toBeDefined()
    expect(p.lessons.g).toBeUndefined()
    // Las tarjetas entran como sabidas: ninguna vence hoy mismo.
    const now = Date.now()
    expect(Object.values(p.cards).length).toBeGreaterThan(0)
    for (const card of Object.values(p.cards)) expect(card.due).toBeGreaterThan(now + 3600_000)
    const { current } = pathStatus(p, false)
    expect(current?.items[0].id).toBe('desu')
  })

  it('aprobar todo completa el recorrido entero', () => {
    useProgress.getState().applyPlacement(placementResult(placementBlocks))
    const { stops, current } = pathStatus(progressSnapshot(), false)
    expect(current).toBeNull()
    expect([...stops.values()].every((s) => s === 'done')).toBe(true)
  })

  it('no empeora resultados que ya existían', () => {
    useProgress.getState().completeLesson('vocales', 3, 5, [])
    useProgress.getState().applyPlacement(placementResult(placementBlocks.slice(0, 1)))
    expect(progressSnapshot().lessons.vocales).toEqual({ correct: 3, total: 5 })
  })

  it('quien vuelve empieza en el primer bloque que le falta', () => {
    expect(firstPendingBlock(emptyProgress())).toBe(0)
    useProgress.getState().applyPlacement(placementResult(placementBlocks.slice(0, 3)))
    expect(firstPendingBlock(progressSnapshot())).toBe(3)
    // Con una lección suelta del bloque 4 hecha, el bloque 4 sigue pendiente.
    useProgress.getState().completeLesson('kata-vocales', 5, 5, [])
    expect(firstPendingBlock(progressSnapshot())).toBe(3)
    useProgress.getState().applyPlacement(placementResult(placementBlocks))
    expect(firstPendingBlock(progressSnapshot())).toBe(placementBlocks.length)
  })
})

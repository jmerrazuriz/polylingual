import { beforeEach, describe, expect, it } from 'vitest'
import { emptyProgress, mergeProgress, parseProgress, readingMastery, recordKey, stableStringify } from './model'
import { progressSnapshot, useProgress } from './store'

describe('mergeProgress (invitado + cuenta)', () => {
  it('se queda con el mejor resultado de cada lección', () => {
    const a = { ...emptyProgress(), lessons: { vocales: { correct: 3, total: 5 }, k: { correct: 5, total: 5 } } }
    const b = { ...emptyProgress(), lessons: { vocales: { correct: 5, total: 5 }, s: { correct: 4, total: 5 } } }
    expect(mergeProgress(a, b).lessons).toEqual({
      vocales: { correct: 5, total: 5 },
      k: { correct: 5, total: 5 },
      s: { correct: 4, total: 5 },
    })
  })

  it('respeta qué récords son mejores con menos (memoria) o con más (parejas)', () => {
    const pairs = recordKey('pairs-romaji', ['k', 'vocales'])
    const memory = recordKey('memory', ['vocales'])
    const a = { ...emptyProgress(), records: { [pairs]: 900, [memory]: 12 } }
    const b = { ...emptyProgress(), records: { [pairs]: 1200, [memory]: 15 } }
    expect(mergeProgress(a, b).records).toEqual({ [pairs]: 1200, [memory]: 12 })
  })

  it('suma las estadísticas de cada carácter', () => {
    const a = { ...emptyProgress(), kana: { あ: { readOk: 3, readTotal: 4, writeScore: 5, writeCount: 1 } } }
    const b = { ...emptyProgress(), kana: { あ: { readOk: 1, readTotal: 1, writeScore: 0, writeCount: 0 } } }
    expect(mergeProgress(a, b).kana.あ).toEqual({ readOk: 4, readTotal: 5, writeScore: 5, writeCount: 1 })
  })
})

describe('parseProgress', () => {
  it('tolera documentos vacíos o con datos inválidos', () => {
    expect(parseProgress(undefined)).toEqual(emptyProgress())
    const parsed = parseProgress({ lessons: { k: { correct: 'x', total: 5 }, bad: {} }, records: { r: 'no' }, kana: { あ: {} } })
    expect(parsed.lessons).toEqual({ k: { correct: 0, total: 5 } })
    expect(parsed.records).toEqual({})
    expect(parsed.kana.あ).toEqual({ readOk: 0, readTotal: 0, writeScore: 0, writeCount: 0 })
  })
})

describe('stableStringify', () => {
  it('no depende del orden de las claves', () => {
    expect(stableStringify({ b: 1, a: { d: 2, c: [3, { f: 1, e: 0 }] } })).toBe(
      stableStringify({ a: { c: [3, { e: 0, f: 1 }], d: 2 }, b: 1 }),
    )
  })
})

describe('dominio de lectura', () => {
  it('pasa de nuevo a aprendiendo y a dominado', () => {
    expect(readingMastery(undefined)).toBe('new')
    expect(readingMastery({ readOk: 4, readTotal: 4, writeScore: 0, writeCount: 0 })).toBe('learning')
    expect(readingMastery({ readOk: 4, readTotal: 5, writeScore: 0, writeCount: 0 })).toBe('mastered')
    expect(readingMastery({ readOk: 5, readTotal: 10, writeScore: 0, writeCount: 0 })).toBe('learning')
  })
})

describe('store de progreso', () => {
  beforeEach(() => useProgress.getState().reset())

  it('registra lecturas, escrituras y récords', () => {
    const { recordReading, recordWriting, submitRecord, completeLesson } = useProgress.getState()
    recordReading('か', true)
    recordReading('か', false, 0.5)
    recordWriting('か', 4)
    completeLesson('k', 4, 5)
    completeLesson('k', 3, 5)
    expect(submitRecord('pairs-romaji:k', 500)).toBe(true)
    expect(submitRecord('pairs-romaji:k', 400)).toBe(false)

    expect(progressSnapshot()).toEqual({
      lessons: { k: { correct: 4, total: 5 } },
      records: { 'pairs-romaji:k': 500 },
      kana: { か: { readOk: 1, readTotal: 1.5, writeScore: 4, writeCount: 1 } },
    })
  })

  it('reset vuelve a cero (al cerrar sesión se es invitado sin memoria)', () => {
    useProgress.getState().recordReading('あ', true)
    useProgress.getState().reset()
    expect(progressSnapshot()).toEqual(emptyProgress())
  })
})

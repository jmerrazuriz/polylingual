import { describe, expect, it } from 'vitest'
import { vocab } from '../../courses/ja/vocab'
import { wordCardChar } from '../vocabExercises'
import { emptyCourse, emptyProgress, parseProgress, type ProgressData, stableStringify, toStored } from './model'
import { cardId, knownCard, newCard, review } from './srs'
import { decodeCard, encodeCard, joinProgress, normalizeProgress, SHARDS, shardOf, splitProgress } from './storage'

const t0 = new Date(2026, 9, 16, 18, 0).getTime()

function sampleProgress(): ProgressData {
  const p = emptyProgress()
  p.lessons = { vocales: { correct: 5, total: 5 } }
  p.cards = {
    [cardId('あ', 'read')]: review(newCard(t0), 3, t0),
    [cardId('あ', 'write')]: newCard(t0),
    [cardId('山', 'read')]: knownCard(t0),
    [cardId('w-かえる·v1', 'read')]: review(newCard(t0), 1, t0),
  }
  p.kana = { あ: { readOk: 3.5, readTotal: 4, writeScore: 9, writeCount: 2 }, 'w-たべる': { readOk: 1, readTotal: 1, writeScore: 0, writeCount: 0 } }
  p.otherCourses = { it: { ...emptyCourse(), cards: { [cardId('ciao', 'read')]: newCard(t0) } } }
  return p
}

describe('almacenamiento del progreso (versión 3)', () => {
  it('una tarjeta se guarda en texto compacto sin perder lo que importa', () => {
    const card = review(review(newCard(t0), 3, t0), 3, t0 + 3 * 86_400_000)
    const back = decodeCard(encodeCard(card))!
    expect(back.due).toBe(card.due)
    expect(back.last_review).toBe(card.last_review)
    expect(back.reps).toBe(card.reps)
    expect(back.state).toBe(card.state)
    expect(back.stability).toBeCloseTo(card.stability, 3)
    expect(back.difficulty).toBeCloseTo(card.difficulty, 3)
    expect(decodeCard('basura')).toBeNull()
  })

  it('separa tarjetas y estadísticas del documento principal y las vuelve a unir', () => {
    const p = sampleProgress()
    const { main, shards } = splitProgress(p)
    expect(main.courses.ja.cards).toEqual({})
    expect(main.courses.ja.kana).toEqual({})
    expect(main.courses.ja.lessons).toEqual(p.lessons)
    // 16 documentos por curso, también los vacíos.
    expect(Object.keys(shards)).toHaveLength(SHARDS * 2)
    const back = joinProgress(main, Object.values(shards))
    expect(Object.keys(back.cards).sort()).toEqual(Object.keys(p.cards).sort())
    expect(back.kana).toEqual(p.kana)
    expect(back.lessons).toEqual(p.lessons)
    expect(Object.keys(back.otherCourses.it.cards)).toEqual([cardId('ciao', 'read')])
    // Guardar y leer dos veces da lo mismo (el redondeo es estable).
    expect(stableStringify(normalizeProgress(back))).toBe(stableStringify(back))
  })

  it('cada carácter cae siempre en el mismo documento, con sus dos tarjetas', () => {
    const { shards } = splitProgress(sampleProgress())
    const holder = Object.entries(shards).filter(([, s]) => cardId('あ', 'read') in s.cards)
    expect(holder).toHaveLength(1)
    expect(holder[0][0]).toBe(`ja-${shardOf('あ')}`)
    expect(cardId('あ', 'write') in holder[0][1].cards).toBe(true)
    expect('あ' in holder[0][1].stats).toBe(true)
  })

  it('lee el formato anterior (todo en el documento principal) y lo une con el nuevo', () => {
    const legacy = toStored(sampleProgress())
    // Solo el documento principal, como lo guardaba la versión 2.
    const fromLegacy = joinProgress(legacy, [])
    expect(Object.keys(fromLegacy.cards).sort()).toEqual(Object.keys(sampleProgress().cards).sort())
    expect(fromLegacy.kana.あ.readTotal).toBe(4)

    // Una tarjeta repasada después en el formato nuevo gana a la del anterior.
    const later = review(newCard(t0), 3, t0 + 5 * 86_400_000)
    const shard = { course: 'ja', cards: { [cardId('あ', 'read')]: encodeCard(later) }, stats: {} }
    expect(joinProgress(legacy, [shard]).cards[cardId('あ', 'read')].last_review).toBe(later.last_review)

    // El formato aún más antiguo (sin cursos) también se sigue leyendo.
    expect(parseProgress({ lessons: { vocales: { correct: 1, total: 1 } } }).lessons.vocales).toBeDefined()
  })

  it('ignora documentos de tarjetas dañados', () => {
    const p = joinProgress(toStored(emptyProgress()), [null, 'x', { course: 5 }, { course: 'ja', cards: { 'sin-skill': '1,2' }, stats: { a: 'x' } }])
    expect(p.cards).toEqual({})
    expect(p.kana).toEqual({})
  })

  it('aguanta el N3: 10.000 tarjetas caben con holgura (< 100 KB por documento)', () => {
    const p = emptyProgress()
    // ~4.000 palabras y kanji con lectura y escritura, ya repasadas.
    const chars = [...vocab.map(wordCardChar), ...Array.from({ length: 4100 }, (_, i) => `w-extra${i}`)]
    for (const char of chars.slice(0, 5000)) {
      for (const skill of ['read', 'write'] as const) p.cards[cardId(char, skill)] = review(knownCard(t0), 3, t0 + 9 * 86_400_000)
      p.kana[char] = { readOk: 12, readTotal: 15, writeScore: 33, writeCount: 8 }
    }
    const { main, shards } = splitProgress(p)
    const bytes = (v: unknown) => new TextEncoder().encode(JSON.stringify(v)).length
    const sizes = Object.values(shards).map(bytes)
    expect(Object.keys(p.cards)).toHaveLength(10_000)
    expect(Math.max(...sizes)).toBeLessThan(100_000)
    expect(bytes(main)).toBeLessThan(10_000)
    // Antes, todo junto en un documento: con estas tarjetas ya pasaba el máximo de Firestore (1 MB).
    expect(bytes(toStored(p))).toBeGreaterThan(1_000_000)
  })
})

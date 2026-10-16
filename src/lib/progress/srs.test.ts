import { describe, expect, it } from 'vitest'
import { learnedThrough } from '../../courses/ja/lessons'
import { buildReview, describeDue, dueNowCount } from '../review'
import { emptyProgress, mergeProgress, parseProgress } from './model'
import { cardId, dueCards, endOfDay, gradeForReading, gradeForWriting, newCard, nextDue, review } from './srs'
import { unlockedLessons } from './unlock'

const DAY = 86_400_000
const t0 = new Date(2026, 9, 16, 10, 0).getTime()

describe('FSRS', () => {
  it('una tarjeta nueva vence ya', () => {
    expect(newCard(t0).due).toBeLessThanOrEqual(t0)
  })

  it('acertar aleja el repaso y fallar lo acerca', () => {
    let card = review(undefined, gradeForReading(true), t0)
    for (let i = 1; i <= 3; i++) card = review(card, gradeForReading(true), card.due)
    const good = review(card, gradeForReading(true), card.due)
    const again = review(card, gradeForReading(false), card.due)
    expect(good.due - card.due).toBeGreaterThan(DAY)
    expect(again.due - card.due).toBeLessThan(DAY)
    expect(again.lapses).toBe(card.lapses + 1)
  })

  it('el puntaje de escritura se traduce a calificación', () => {
    expect([5, 4, 3, 2, 1].map(gradeForWriting)).toEqual([3, 3, 2, 1, 1])
  })

  it('lista lo que vence hoy, lo más atrasado primero', () => {
    const cards = {
      [cardId('あ', 'read')]: { ...newCard(t0), due: t0 - DAY },
      [cardId('い', 'write')]: { ...newCard(t0), due: t0 + 3600_000 },
      [cardId('う', 'read')]: { ...newCard(t0), due: t0 + 3 * DAY },
    }
    expect(dueCards(cards, endOfDay(t0)).map((c) => c.id)).toEqual(['あ:read', 'い:write'])
    expect(nextDue(cards, endOfDay(t0))).toBe(t0 + 3 * DAY)
    expect(dueNowCount(cards, t0)).toBe(1)
    expect(buildReview(cards, t0).reading.map((q) => ('kana' in q ? q.kana.char : ''))).toEqual(['あ'])
    expect(describeDue(t0 + 3 * DAY, t0)).toBe('en 3 días')
    expect(describeDue(t0 + DAY, t0)).toBe('mañana')
  })
})

describe('repaso de hoy', () => {
  it('separa lectura y escritura y usa los caracteres repasados', () => {
    const cards = Object.fromEntries(
      [...learnedThrough('vocales')].flatMap((c) => [
        [cardId(c, 'read'), newCard(t0)],
        [cardId(c, 'write'), newCard(t0)],
      ]),
    )
    const plan = buildReview(cards, t0)
    expect(plan.reading).toHaveLength(5)
    expect(plan.writing.map((w) => w.kana).sort()).toEqual(['あ', 'い', 'う', 'え', 'お'])
  })

  it('no pasa de 20 tarjetas', () => {
    const cards = Object.fromEntries([...learnedThrough('t')].map((c) => [cardId(c, 'read'), newCard(t0)]))
    const plan = buildReview(cards, t0)
    expect(plan.reading.length + plan.writing.length).toBe(20)
  })
})

describe('tarjetas en el progreso guardado', () => {
  it('se leen y se unen quedándose con la repasada más recientemente', () => {
    const old = review(undefined, gradeForReading(true), t0)
    const recent = review(old, gradeForReading(false), t0 + DAY)
    const a = { ...emptyProgress(), cards: { 'あ:read': old } }
    const b = { ...emptyProgress(), cards: { 'あ:read': recent }, unlockAll: true }
    const merged = mergeProgress(a, b)
    expect(merged.cards['あ:read']).toEqual(recent)
    expect(merged.unlockAll).toBe(true)
    expect(parseProgress(JSON.parse(JSON.stringify(merged)))).toEqual(merged)
  })
})

describe('desbloqueo progresivo', () => {
  it('abre la primera y la siguiente a cada completada', () => {
    expect([...unlockedLessons({}, false)]).toEqual(['vocales'])
    const done = { vocales: { correct: 5, total: 5 }, k: { correct: 4, total: 5 } }
    expect([...unlockedLessons(done, false)]).toEqual(['vocales', 'k', 's'])
  })

  it('con «desbloquear todo» abre las 41 (19 de hiragana y 22 de katakana)', () => {
    expect(unlockedLessons({}, true).size).toBe(41)
  })
})

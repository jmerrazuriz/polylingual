import { beforeEach, describe, expect, it } from 'vitest'
import { kanjiLessons } from '../courses/ja/kanji'
import { watchKanjiCards } from './progress/backfillCards'
import { emptyProgress } from './progress/model'
import { cardId, newCard } from './progress/srs'
import { progressSnapshot, useProgress } from './progress/store'
import { buildReview, dueNowCount } from './review'
import { buildWeakReview, weakItems } from './units'

const t0 = Date.now()

describe('repasos SRS de kanji', () => {
  beforeEach(() => useProgress.getState().reset())

  it('completar una lección de kanji crea sus tarjetas de lectura y escritura', () => {
    const lesson = kanjiLessons[0]
    useProgress.getState().completeLesson(lesson.id, 5, 5, lesson.chars)
    const cards = progressSnapshot().cards
    for (const c of lesson.chars) {
      expect(cards[cardId(c, 'read')], c).toBeDefined()
      expect(cards[cardId(c, 'write')], c).toBeDefined()
    }
  })

  it('los kanji vencidos aparecen como ejercicios y escritura en el repaso', () => {
    const cards = {
      [cardId('山', 'read')]: newCard(t0),
      [cardId('山', 'write')]: newCard(t0),
      [cardId('あ', 'read')]: newCard(t0),
    }
    const plan = buildReview(cards, t0 + 1000)
    expect(plan.reading).toHaveLength(1)
    expect(plan.exercises).toHaveLength(1)
    expect(plan.exercises[0].char).toBe('山')
    const ex = plan.exercises[0].exercise
    if (ex.type === 'order' || ex.type === 'type') throw new Error('tipo inesperado')
    expect(ex.options).toContain(ex.answer)
    expect(plan.writing).toEqual([{ prompt: 'montaña', kana: '山', parts: ['山'] }])
    expect(dueNowCount(cards, t0 + 1000)).toBe(3)
  })

  it('responder un ejercicio de kanji reprograma su tarjeta', () => {
    useProgress.getState().recordReading('山', true)
    const card = progressSnapshot().cards[cardId('山', 'read')]
    expect(card.reps).toBe(1)
    expect(card.due).toBeGreaterThan(t0)
  })

  it('los kanji débiles entran al repaso de puntos débiles', () => {
    const p = {
      ...emptyProgress(),
      kana: {
        山: { readOk: 0, readTotal: 3, writeScore: 2, writeCount: 1 },
        川: { readOk: 3, readTotal: 3, writeScore: 0, writeCount: 0 },
      },
    }
    expect(weakItems(p).kanjiRead).toEqual(['山'])
    expect(weakItems(p).kanjiWrite).toEqual(['山'])
    const plan = buildWeakReview(p)
    expect(plan.exercises?.map((e) => e.char)).toEqual(['山'])
    expect(plan.writing.map((w) => w.kana)).toEqual(['山'])
  })

  it('crea las tarjetas que faltan para lecciones de kanji completadas antes del cambio', () => {
    const lesson = kanjiLessons[1]
    useProgress.setState({ lessons: { [lesson.id]: { correct: 5, total: 5 } }, cards: {} })
    watchKanjiCards()
    const cards = progressSnapshot().cards
    expect(Object.keys(cards)).toHaveLength(lesson.chars.length * 2)
  })
})

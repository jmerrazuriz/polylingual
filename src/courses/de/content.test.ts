import { describe, expect, it } from 'vitest'
import { emptyProgress } from '../../lib/progress/model'
import { buildReview, isReviewable } from '../../lib/review'
import { lookupGerman } from './glossary'
import { germanGrammar } from './grammar'
import { germanPath, germanPathItems } from './path'
import { germanItemStatus } from './progress'
import { readingsA1 } from './readingsA1'
import { germanVocab, germanVocabLessons, germanWordCard, germanWordFromCard } from './vocab'
import { germanLessonExercises, germanWordReviewExercise, pluralExercise } from './vocabExercises'

describe('gramática A1', () => {
  it('30 lecciones con ejercicios bien armados', () => {
    expect(germanGrammar.filter((g) => g.level === 'A1')).toHaveLength(30)
    expect(new Set(germanGrammar.map((g) => g.id)).size).toBe(germanGrammar.length)
    for (const g of germanGrammar) {
      expect(g.examples.length, g.id).toBeGreaterThanOrEqual(3)
      expect(g.exercises.length, g.id).toBeGreaterThanOrEqual(4)
      for (const e of g.exercises) {
        if (e.type === 'choice' || e.type === 'meaning') {
          expect(e.options, g.id).toContain(e.answer)
          expect(new Set(e.options).size, g.id).toBe(e.options.length)
        }
        if (e.type === 'order') for (const w of e.answer) expect(w, g.id).not.toMatch(/^[.?,!]$/)
        if (e.type === 'type') expect(e.german, g.id).toBe(true)
      }
    }
  })
})

describe('vocabulario A1', () => {
  it('unas 600 palabras; los sustantivos con género y plural, sin ids repetidos', () => {
    expect(germanVocab.length).toBeGreaterThanOrEqual(600)
    expect(new Set(germanVocab.map((w) => w.id)).size).toBe(germanVocab.length)
    for (const w of germanVocab) {
      if (w.pos === 'noun') {
        expect(w.gender, w.word).toBeTruthy()
        expect(w.word[0], w.word).toBe(w.word[0].toUpperCase())
      } else expect(w.gender, w.word).toBeUndefined()
    }
  })

  it('lecciones de 6 a 14 palabras', () => {
    for (const l of germanVocabLessons) {
      expect(l.words.length, l.id).toBeGreaterThanOrEqual(6)
      expect(l.words.length, l.id).toBeLessThanOrEqual(14)
    }
  })

  it('los ejercicios tienen la respuesta entre opciones distintas', () => {
    for (const l of germanVocabLessons) {
      for (const e of germanLessonExercises(l.words)) {
        if (e.type === 'choice' || e.type === 'meaning') {
          expect(e.options).toContain(e.answer)
          expect(new Set(e.options).size).toBe(e.options.length)
        }
      }
    }
    const tisch = germanVocab.find((w) => w.word === 'Tisch')!
    const ex = pluralExercise(tisch)
    expect(ex.type === 'choice' && ex.answer).toBe('Tische')
  })

  it('las tarjetas «dw-…» se repasan', () => {
    const w = germanVocab.find((x) => x.word === 'Wohnung')!
    const card = germanWordCard(w)
    expect(germanWordFromCard(card)).toBe(w)
    expect(isReviewable(card)).toBe(true)
    expect(germanWordReviewExercise(card, 'write').exercise.type).toBe('type')
    const plan = buildReview({ [`${card}:read`]: { due: 0, stability: 1, difficulty: 5, reps: 1, lapses: 0, state: 2, last: 0 } as never }, 1)
    expect(plan.exercises).toHaveLength(1)
  })

  it('el glosario reconoce plurales y verbos conjugados', () => {
    expect(lookupGerman('Tische.')?.word.word).toBe('Tisch')
    expect(lookupGerman('wohnt')?.word.word).toBe('wohnen')
    expect(lookupGerman('Hallo!')?.word.word).toBe('Hallo')
  })
})

describe('lecturas A1', () => {
  it('16 textos (8 lecturas y 8 diálogos) con preguntas bien armadas', () => {
    expect(readingsA1.filter((t) => t.kind === 'reading')).toHaveLength(8)
    expect(readingsA1.filter((t) => t.kind === 'dialogue')).toHaveLength(8)
    for (const t of readingsA1) for (const q of t.questions) if (q.type === 'choice') expect(q.options).toContain(q.answer)
  })
})

describe('recorrido A1', () => {
  it('incluye cada lección una sola vez y termina en el simulacro', () => {
    const keys = germanPathItems.map((i) => `${i.kind}:${i.id}`)
    expect(new Set(keys).size).toBe(keys.length)
    const expected = [
      ...germanGrammar.map((g) => `grammar:${g.id}`),
      ...germanVocabLessons.map((l) => `vocab:${l.id}`),
      ...readingsA1.map((t) => `reading:${t.id}`),
      'exam:A1',
    ]
    expect(new Set(keys)).toEqual(new Set(expected))
    expect(germanPath.at(-1)!.id).toBe('examen-a1')
    for (const u of germanPath) for (const s of u.stops) expect(s.items.length).toBeLessThanOrEqual(3)
  })

  it('desbloqueo lineal: cada lección abre la siguiente', () => {
    const p = emptyProgress()
    const [first, second] = germanPathItems
    expect(germanItemStatus(p, false)(first)).toBe('open')
    expect(germanItemStatus(p, false)(second)).toBe('locked')
    p.grammar[first.id] = { correct: 5, total: 5 }
    expect(germanItemStatus(p, false)(first)).toBe('done')
    expect(germanItemStatus(p, false)(second)).toBe('open')
    expect(germanItemStatus(p, true)(germanPathItems.at(-1)!)).toBe('open')
  })
})

import { describe, expect, it } from 'vitest'
import { germanVocab, withArticle } from '../courses/de/vocab'
import { meaningExercise, sayExercise } from '../courses/de/vocabExercises'
import { vocab } from '../courses/ja/vocab'
import { similarOptions } from './distractors'
import { wordChoiceExercise, wordMeaningExercise } from './vocabExercises'

describe('distractores parecidos', () => {
  it('toma primero del nivel más parecido y solo después del siguiente', () => {
    const options = similarOptions('tres', { tiers: [['cuatro', 'cinco'], ['perro', 'casa', 'mesa']], pick: (x) => x, random: () => 0.5 })
    expect(options).toHaveLength(4)
    expect(options.slice(0, 3)).toEqual(expect.arrayContaining(['tres', 'cuatro', 'cinco']))
  })

  it('japonés: un número se pregunta con otros números como alternativas', () => {
    const numbers = vocab.filter((v) => v.theme === 'numeros')
    const meanings = new Set(numbers.map((v) => v.meaning))
    const kana = new Set(numbers.map((v) => v.kana))
    for (const w of numbers.slice(0, 10)) {
      const m = wordMeaningExercise(w)
      if (m.type === 'meaning') for (const o of m.options) expect(meanings.has(o), o).toBe(true)
      const c = wordChoiceExercise(w)
      if (c.type === 'choice') for (const o of c.options) expect(kana.has(o), o).toBe(true)
    }
  })

  it('alemán: las alternativas salen del mismo tema y clase de palabra', () => {
    for (const theme of ['werkzeug', 'sprichwoerter', 'zahlen-a2x']) {
      const words = germanVocab.filter((w) => w.theme === theme)
      for (const w of words.slice(0, 6)) {
        const same = words.filter((x) => x.pos === w.pos)
        if (same.length < 4) continue
        const m = meaningExercise(w)
        if (m.type === 'meaning') for (const o of m.options) expect(same.map((x) => x.meaning), o).toContain(o)
        const s = sayExercise(w)
        if (s.type === 'choice') for (const o of s.options) expect(same.map(withArticle), o).toContain(o)
      }
    }
  })
})

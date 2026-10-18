import { describe, expect, it } from 'vitest'
import { emptyProgress } from '../../lib/progress/model'
import {
  articleQuestion,
  conjugationQuestion,
  declensionQuestion,
  germanPoolLevels,
  germanWordPool,
  meaningPairs,
  type PracticeMode,
  practiceSession,
  pluralPairs,
} from './practice'
import { germanVocab, germanVocabLessons } from './vocab'

const fresh = () => ({ ...emptyProgress() })

describe('juegos y práctica del alemán', () => {
  it('el pool sale de las lecciones hechas, o de las abiertas si son pocas', () => {
    const p = fresh()
    // Sin nada hecho, casi nada está abierto (el recorrido empieza por la pronunciación).
    const start = germanWordPool(p, false)
    // Todo abierto (invitado): todas las palabras, y se puede filtrar por nivel.
    const all = germanWordPool(p, true)
    expect(start.length).toBeLessThan(all.length)
    expect(all.length).toBe(germanVocab.length)
    const b2 = germanWordPool(p, true, ['B2'])
    expect(b2.every((w) => w.level === 'B2')).toBe(true)
    expect(germanPoolLevels(p, true)).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    // Con lecciones hechas, se usan solo esas.
    const done = germanVocabLessons.slice(0, 3)
    const p2 = { ...p, lessons: Object.fromEntries(done.map((l) => [l.id, { correct: 1, total: 1, completedAt: 0 }])) } as never
    expect(new Set(germanWordPool(p2, true).map((w) => w.id))).toEqual(new Set(done.flatMap((l) => l.words.map((w) => w.id))))
  })

  it('las parejas y preguntas rápidas están bien armadas', () => {
    const words = germanWordPool(fresh(), true, ['A1'])
    expect(meaningPairs(words).length).toBe(words.length)
    expect(pluralPairs(words).every((p) => p.right.startsWith('die '))).toBe(true)
    for (let i = 0; i < 200; i++) {
      const a = articleQuestion(words)!
      expect(['der', 'die', 'das']).toContain(a.answer)
      const c = conjugationQuestion()
      expect(c.options).toContain(c.answer)
      expect(new Set(c.options).size).toBe(c.options.length)
      const d = declensionQuestion(words)
      if (d) {
        expect(d.options).toContain(d.answer)
        expect(new Set(d.options).size).toBe(d.options.length)
      }
    }
  })

  it('cada modo de práctica da ejercicios con la respuesta entre las opciones', () => {
    const words = germanWordPool(fresh(), true, ['A1', 'A2'])
    for (const mode of ['palabras', 'articulos', 'plurales', 'escribir', 'conjugacion', 'declinacion'] as PracticeMode[]) {
      const session = practiceSession(mode, words)
      expect(session.length, mode).toBe(12)
      for (const e of session) if (e.type === 'choice' || e.type === 'meaning') expect(e.options, mode).toContain(e.answer)
    }
  })

  it('la declinación produce frases correctas', () => {
    const words = germanVocab.filter((w) => w.word === 'Tisch')
    let found = false
    for (let i = 0; i < 5000 && !found; i++) {
      const q = declensionQuestion(words)
      if (q && q.hint?.startsWith('Dativo') && q.hint.includes('der/die/das') && q.prompt.startsWith('neu ') && !q.prompt.includes('plural')) {
        expect(q.answer).toBe('dem neuen Tisch')
        found = true
      }
    }
    expect(found).toBe(true)
  })
})

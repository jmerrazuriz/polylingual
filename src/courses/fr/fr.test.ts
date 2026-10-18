import { describe, expect, it } from 'vitest'
import { coursePath } from '../../lib/coursePath'
import { delfExams, scoreDelf } from './exams'

describe('simulacros DELF y DALF', () => {
  it('cuatro pruebas de 25 hasta C1 y dos de 50 en C2', () => {
    expect(delfExams.A1.modules).toHaveLength(4)
    expect(delfExams.C1.diploma).toBe('DALF')
    expect(delfExams.C2.modules).toEqual(['oral', 'ecrit'])
  })

  it('aprueba con 50/100 y elimina con menos de 5/25 en una prueba', () => {
    const ok = scoreDelf('B1', { co: { correct: 6, total: 10 }, ce: { correct: 5, total: 10 }, pe: { correct: 5, total: 10 }, po: { correct: 5, total: 10 } })
    expect(ok.points.co).toBe(15)
    expect(ok.points.ce).toBe(12.5)
    expect(ok.passed).toBe(true)
    const out = scoreDelf('B1', { co: { correct: 10, total: 10 }, ce: { correct: 1, total: 10 }, pe: { correct: 10, total: 10 }, po: { correct: 10, total: 10 } })
    expect(out.eliminated).toEqual(['ce'])
    expect(out.passed).toBe(false)
    expect(out.passedAuto).toBe(false)
    const partial = scoreDelf('A1', { co: { correct: 7, total: 10 }, ce: { correct: 6, total: 10 } })
    expect(partial.passedAuto).toBe(true)
    expect(partial.passed).toBeNull()
  })

  it('el C2 pide 10/50 en cada prueba', () => {
    const s = scoreDelf('C2', { oral: { correct: 3, total: 20 }, ecrit: { correct: 20, total: 20 } })
    expect(s.points).toEqual({ oral: 7.5, ecrit: 50 })
    expect(s.eliminated).toEqual(['oral'])
    expect(s.passed).toBe(false)
  })
})

describe('curso de francés', () => {
  it('tiene su recorrido propio, vacío y con los seis niveles', () => {
    const cp = coursePath('fr')
    expect(cp.units).toEqual([])
    expect(cp.levels.map((l) => l.level)).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    expect(cp.hasPlacement).toBe(false)
  })
})

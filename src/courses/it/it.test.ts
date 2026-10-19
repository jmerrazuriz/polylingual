import { describe, expect, it } from 'vitest'
import { courseById, isCourseOpen } from '..'
import { coursePath } from '../../lib/coursePath'
import { agreementVariants } from './engine/conjugation'
import { cilsExams, cilsPassedKey, scoreCils } from './exams'
import { cilsTasks } from './examTasks'

describe('simulacros CILS', () => {
  it('cinco pruebas en todos los niveles: 12 puntos (mínimo 7) en A1–A2 y 20 (mínimo 11) desde B1', () => {
    expect(cilsExams.A1.modules).toEqual(['ascolto', 'lettura', 'strutture', 'scrittura', 'orale'])
    expect(cilsExams.A2.max).toBe(12)
    expect(cilsExams.A2.minimum).toBe(7)
    expect(cilsExams.B1.max).toBe(20)
    expect(cilsExams.B1.minimum).toBe(11)
    expect(cilsExams.B1.name).toBe('CILS UNO-B1')
    expect(cilsExams.C2.name).toBe('CILS QUATTRO-C2')
    expect(cilsPassedKey('B1')).toBe('cils-b1:aprobado')
  })

  it('se aprueba solo si se pasa cada prueba', () => {
    const all = (correct: number) => ({ correct, total: 10 })
    const ok = scoreCils('B1', { ascolto: all(6), lettura: all(6), strutture: all(6), scrittura: all(6), orale: all(6) })
    expect(ok.points.ascolto).toBe(12)
    expect(ok.failed).toEqual([])
    expect(ok.passed).toBe(true)
    expect(ok.total).toBe(60)
    expect(ok.outOf).toBe(100)
    // Mucho en todo, pero bajo el mínimo en una prueba: no aprueba.
    const one = scoreCils('B1', { ascolto: all(10), lettura: all(10), strutture: all(5), scrittura: all(10), orale: all(10) })
    expect(one.failed).toEqual(['strutture'])
    expect(one.passed).toBe(false)
    expect(one.passedAuto).toBe(false)
    const partial = scoreCils('A1', { ascolto: all(6), lettura: all(7), strutture: all(6) })
    expect(partial.points).toEqual({ ascolto: 7, lettura: 8, strutture: 7 })
    expect(partial.passedAuto).toBe(true)
    expect(partial.passed).toBeNull()
  })

  it('las tareas del A1: estructuras con su explicación, ficha, mensaje y oral', () => {
    const t = cilsTasks.A1!
    expect(t.structures.length).toBeGreaterThanOrEqual(10)
    for (const e of t.structures) {
      expect(e.explanation).toBeTruthy()
      if (e.type === 'choice') {
        expect(e.options).toContain(e.answer)
        for (const k of Object.keys(e.whyWrong ?? {})) expect(e.options).toContain(k)
      }
    }
    expect(t.form.fields.length).toBe(5)
    expect(t.speaking.length).toBeGreaterThanOrEqual(5)
  })
})

describe('curso de italiano', () => {
  it('está disponible, con su recorrido de seis niveles y test de nivelación', () => {
    const cp = coursePath('it')
    expect(cp.levels.map((l) => l.level)).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    expect(cp.units.length).toBeGreaterThan(0)
    expect(cp.hasPlacement).toBe(true)
    expect(cp.intro).toMatch(/Lucca/)
    expect(courseById('it').status).toBe('available')
    expect(isCourseOpen(courseById('it'))).toBe(true)
  })

  it('al escribir se acepta el participio en masculino o femenino', () => {
    expect(agreementVariants('sono andato/a')).toEqual(['sono andato', 'sono andata'])
    expect(agreementVariants('siamo andati/e')).toEqual(['siamo andati', 'siamo andate'])
    expect(agreementVariants('ho parlato')).toEqual(['ho parlato'])
  })
})

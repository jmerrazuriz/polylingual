import { describe, expect, it } from 'vitest'
import { checkGerman, foldGerman } from '../../lib/germanInput'
import { coursePath } from '../../lib/coursePath'
import { goetheExams, scoreGoethe } from './exams'
import { cefrLevels } from './levels'

describe('entrada en alemán', () => {
  it('acepta umlauts como ae/oe/ue y ß como ss', () => {
    expect(foldGerman('Mädchen Straße Übung')).toBe('Maedchen Strasse Uebung')
    expect(checkGerman('Maedchen', 'Mädchen')).toBe('ok')
    expect(checkGerman('  die Strasse. ', 'die Straße')).toBe('ok')
    expect(checkGerman('neue', 'neue')).toBe('ok')
  })

  it('las mayúsculas cuentan, pero se avisa como «casi»', () => {
    expect(checkGerman('tisch', 'Tisch')).toBe('case')
    expect(checkGerman('Stuhl', 'Tisch')).toBe('wrong')
    expect(checkGerman('fährt', ['fährt', 'faehrt'])).toBe('ok')
  })
})

describe('simulacros Goethe', () => {
  it('hay uno por nivel, de A1 a C2', () => {
    expect(Object.keys(goetheExams)).toEqual(cefrLevels)
  })

  it('A1 y A2 se aprueban por el total; de B1 a C2 cada módulo por separado', () => {
    const r = { lesen: { correct: 9, total: 10 }, hoeren: { correct: 4, total: 10 } }
    expect(scoreGoethe('A2', r).passedAuto).toBe(true)
    expect(scoreGoethe('B1', r).passedAuto).toBe(false)
    expect(scoreGoethe('B1', r).points).toEqual({ lesen: 90, hoeren: 40 })
    expect(scoreGoethe('B1', { lesen: { correct: 6, total: 10 }, hoeren: { correct: 6, total: 10 } }).passedAuto).toBe(true)
  })
})

describe('recorrido del alemán', () => {
  it('tiene los seis niveles A1–C2, con su meta, y no toca el del japonés', () => {
    const de = coursePath('de')
    expect(de.levels.map((l) => l.level)).toEqual(cefrLevels)
    for (const l of de.levels) expect(l.goal).toBeTruthy()
    expect(de.intro).toContain('Ottos Weg')
    expect(coursePath('ja').levels.map((l) => l.level)).toEqual(['N5', 'N4', 'N3'])
  })
})

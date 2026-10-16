import { describe, expect, it } from 'vitest'
import { toRomaji } from '../../lib/romaji'
import { hiraganaChart, hiraganaInfo } from './hiragana'
import { getStrokes, hiragana } from './kana'
import { hiraganaWords } from './words'

describe('hiragana', () => {
  it('tiene 46 básicos, 25 con dakuten y 33 combinados', () => {
    const count = (group: string) => hiragana.filter((k) => k.group === group).length
    expect(count('basic')).toBe(46)
    expect(count('dakuten')).toBe(25)
    expect(count('yoon')).toBe(33)
  })

  it('todas las celdas de la tabla tienen datos y no se repiten', () => {
    const cells = hiraganaChart.flatMap((s) => s.rows.flatMap((r) => r.cells)).filter((c) => c !== null)
    expect(new Set(cells).size).toBe(cells.length)
    for (const char of cells) expect(hiraganaInfo[char], char).toBeDefined()
    expect(cells.length).toBe(Object.keys(hiraganaInfo).length)
  })

  it('cada fila tiene tantas celdas como columnas', () => {
    for (const section of hiraganaChart) {
      for (const row of section.rows) expect(row.cells.length).toBe(section.columns.length)
    }
  })

  it('los ids son únicos', () => {
    const ids = hiragana.map((k) => k.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cada parte dibujable tiene trazos con su número', () => {
    for (const kana of hiragana) {
      for (const part of kana.parts) {
        const data = getStrokes(part)
        expect(data, part).toBeDefined()
        expect(data!.strokes.length).toBeGreaterThan(0)
        expect(data!.numbers.length).toBe(data!.strokes.length)
      }
    }
  })

  it('las cantidades de trazos coinciden con las estándar', () => {
    const expected: Record<string, number> = { あ: 3, い: 2, き: 4, さ: 3, し: 1, ふ: 4, ま: 3, を: 3, ん: 1, ぱ: 4 }
    for (const [char, n] of Object.entries(expected)) expect(getStrokes(char)!.strokes.length, char).toBe(n)
  })
})

describe('palabras', () => {
  it('no se repiten', () => {
    const kana = hiraganaWords.map((w) => w.kana)
    expect(new Set(kana).size).toBe(kana.length)
  })

  it('solo usan hiragana conocido (el romaji se puede calcular)', () => {
    for (const word of hiraganaWords) expect(() => toRomaji(word.kana), word.kana).not.toThrow()
  })

  it('el romaji escrito a mano solo existe cuando difiere del calculado', () => {
    for (const word of hiraganaWords.filter((w) => w.romaji)) {
      expect(word.romaji, word.kana).not.toBe(toRomaji(word.kana))
    }
  })
})

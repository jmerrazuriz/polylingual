import { describe, expect, it } from 'vitest'
import { allKana } from '../../courses/ja/kana'
import { checkStroke, expectedStrokes, matchStroke, scoreFromMistakes } from './evaluate'
import { length, pathToPoints, type Point, resample } from './geometry'

/** Generador pseudoaleatorio reproducible. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32
    return seed / 2 ** 32
  }
}

/** Imita un trazo humano: temblor, un poco corrido y de otro tamaño. */
function humanize(points: Point[], random: () => number, { jitter = 1.5, offset = 3, scale = 0.94 } = {}): Point[] {
  const dx = (random() - 0.5) * 2 * offset
  const dy = (random() - 0.5) * 2 * offset
  return resample(points, 40).map((p) => ({
    x: 54.5 + (p.x - 54.5) * scale + dx + (random() - 0.5) * 2 * jitter,
    y: 54.5 + (p.y - 54.5) * scale + dy + (random() - 0.5) * 2 * jitter,
  }))
}

/** Escribe todo el carácter en orden y devuelve los errores cometidos. */
function write(char: string, draw: (strokes: Point[][]) => Point[][]): number {
  const strokes = expectedStrokes(char)
  let next = 0
  let mistakes = 0
  for (const stroke of draw(strokes)) {
    const result = checkStroke(stroke, strokes, next)
    if (result.ok) next += result.consumed
    else mistakes++
  }
  expect(next, `${char}: trazos aceptados`).toBe(strokes.length)
  return mistakes
}

describe('geometría', () => {
  it('lee los paths relativos de KanjiVG', () => {
    const points = pathToPoints('M10,10c0,10,0,20,0,30')
    expect(points[0]).toEqual({ x: 10, y: 10 })
    expect(points.at(-1)).toEqual({ x: 10, y: 40 })
  })

  it('remuestrea con espaciado uniforme', () => {
    const r = resample([{ x: 0, y: 0 }, { x: 0, y: 100 }], 11)
    expect(r).toHaveLength(11)
    expect(r[5].y).toBeCloseTo(50)
    expect(length(r)).toBeCloseTo(100)
  })
})

describe('evaluación de trazos', () => {
  it.each(['あ', 'き', 'さ', 'ふ'])('acepta %s escrito a mano en orden', (char) => {
    const random = seeded(char.codePointAt(0)!)
    expect(write(char, (strokes) => strokes.map((s) => humanize(s, random)))).toBe(0)
  })

  it('acepta todos los kana (hiragana y katakana) escritos con cuidado', () => {
    const random = seeded(42)
    const chars = new Set([...allKana.flatMap((k) => k.parts), 'ー'])
    for (const char of chars) {
      expect(write(char, (strokes) => strokes.map((s) => humanize(s, random, { jitter: 1, offset: 2, scale: 0.97 }))), char).toBe(0)
    }
  })

  it('acepta dos trazos seguidos unidos en uno', () => {
    const strokes = expectedStrokes('き')
    const joined = [...strokes[2], ...strokes[3]]
    expect(checkStroke(joined, strokes, 2)).toEqual({ ok: true, consumed: 2 })
  })

  it('detecta un trazo al revés', () => {
    const strokes = expectedStrokes('か')
    expect(checkStroke([...strokes[1]].reverse(), strokes, 1)).toEqual({ ok: false, reason: 'direction' })
  })

  it('detecta el orden incorrecto', () => {
    const strokes = expectedStrokes('あ')
    expect(checkStroke(strokes[1], strokes, 0)).toEqual({ ok: false, reason: 'order' })
  })

  it('rechaza un trazo que no se parece', () => {
    const shi = expectedStrokes('し')[0]
    const a = expectedStrokes('あ')
    expect(checkStroke(shi, a, 0)).toEqual({ ok: false, reason: 'shape' })
  })

  it('distingue el circulito (゜) de las rayitas (゛)', () => {
    const circle = expectedStrokes('ぱ')[3]
    const ba = expectedStrokes('ば')
    expect(matchStroke(circle, ba[3])).toBe('no')
    expect(matchStroke(circle, ba[4])).toBe('no')
  })

  it.each([
    ['ぬ', 'め'],
    ['め', 'ぬ'],
    ['る', 'ろ'],
    ['ろ', 'る'],
    ['ね', 'れ'],
    ['わ', 'れ'],
    ['こ', 'に'],
  ])('no acepta %s cuando se pide %s', (drawn, target) => {
    const t = expectedStrokes(target)
    let next = 0
    for (const s of expectedStrokes(drawn)) {
      if (next >= t.length) break
      const r = checkStroke(s, t, next)
      if (r.ok) next += r.consumed
    }
    expect(next).toBeLessThan(t.length)
  })

  it('rechaza un trazo en otro lugar del cuadro', () => {
    const stroke = expectedStrokes('こ')[0]
    const moved = stroke.map((p) => ({ x: p.x, y: p.y + 40 }))
    expect(matchStroke(moved, stroke)).toBe('no')
  })

  it('rechaza un trazo demasiado corto', () => {
    const stroke = expectedStrokes('し')[0]
    expect(matchStroke(stroke.slice(0, 3), stroke)).toBe('no')
  })

  it('puntúa de 5 a 1 según los errores', () => {
    expect([0, 1, 2, 3, 4, 6].map(scoreFromMistakes)).toEqual([5, 4, 3, 3, 2, 1])
  })
})

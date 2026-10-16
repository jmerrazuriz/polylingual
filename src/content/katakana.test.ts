import { describe, expect, it } from 'vitest'
import { matchesReading, romajiReadings, toRomaji } from '../lib/romaji'
import { scriptPairItems } from '../lib/pairs'
import { buildConfusableSession, wordsForPool } from '../lib/quiz'
import { unlockedLessons } from '../lib/progress/unlock'
import { wordsReadableWith } from '../lib/words'
import { allKana, counterpart, getStrokes, kanaByChar, katakana } from './kana'
import { katakanaChart, katakanaConfusables, katakanaInfo, toHiragana, toKatakana } from './katakana'
import { katakanaLessons, learnedThrough, lessons } from './lessons'
import { allWords, katakanaWords } from './words'

describe('katakana', () => {
  it('tiene 46 básicos, 25 con dakuten, 33 combinados y 19 extendidos', () => {
    const count = (group: string) => katakana.filter((k) => k.group === group).length
    expect([count('basic'), count('dakuten'), count('yoon'), count('extended')]).toEqual([46, 25, 33, 19])
  })

  it('cada celda de la tabla tiene datos y cada fila tantas celdas como columnas', () => {
    for (const section of katakanaChart) {
      for (const row of section.rows) {
        expect(row.cells.length).toBe(section.columns.length)
        for (const c of row.cells) if (c) expect(katakanaInfo[c], c).toBeDefined()
      }
    }
  })

  it('no hay caracteres ni ids repetidos entre los dos silabarios', () => {
    expect(new Set(allKana.map((k) => k.char)).size).toBe(allKana.length)
    expect(new Set(allKana.map((k) => k.id)).size).toBe(allKana.length)
  })

  it('cada parte dibujable tiene trazos', () => {
    for (const kana of katakana) for (const part of kana.parts) expect(getStrokes(part)?.strokes.length, part).toBeGreaterThan(0)
    expect(getStrokes('ー')?.strokes.length).toBe(1)
  })

  it('todos los básicos tienen mnemotecnia', () => {
    for (const kana of katakana.filter((k) => k.group === 'basic')) expect(kana.mnemonic, kana.char).toBeTruthy()
  })

  it('convierte entre silabarios y encuentra la pareja', () => {
    expect(toKatakana('きゃっ')).toBe('キャッ')
    expect(toHiragana('キャッー')).toBe('きゃっー')
    expect(counterpart(kanaByChar.get('か')!)?.char).toBe('カ')
    expect(counterpart(kanaByChar.get('ファ')!)).toBeUndefined()
  })
})

describe('romaji del katakana', () => {
  it('ー alarga la vocal anterior y se acepta sin alargar o con macrón', () => {
    expect(toRomaji('コーヒー')).toBe('koohii')
    for (const answer of ['koohii', 'kohi', 'kōhī', 'ko-hi-']) expect(matchesReading(answer, romajiReadings('コーヒー')), answer).toBe(true)
    expect(matchesReading('otōsan', romajiReadings('おとうさん'))).toBe(true)
  })

  it('lee extendidos, combinados y la ッ', () => {
    expect(toRomaji('パーティー')).toBe('paatii')
    expect(toRomaji('ヴァイオリン')).toBe('vaiorin')
    expect(toRomaji('サンドイッチ')).toBe('sandoitchi')
    expect(toRomaji('メニュー')).toBe('menyuu')
  })
})

describe('palabras en katakana', () => {
  it('no se repiten y su romaji se puede calcular', () => {
    const kana = allWords.map((w) => w.kana)
    expect(new Set(kana).size).toBe(kana.length)
    for (const w of katakanaWords) expect(() => toRomaji(w.kana), w.kana).not.toThrow()
  })

  it('todas se pueden leer al terminar el katakana', () => {
    const learned = learnedThrough(katakanaLessons.at(-1)!.id)
    expect(wordsReadableWith(learned).filter((w) => katakanaWords.includes(w))).toHaveLength(katakanaWords.length)
  })

  it('con las vocales y la fila K ya hay palabras (ケーキ usa ー)', () => {
    const pool = [...learnedThrough('kata-k')].flatMap((c) => kanaByChar.get(c) ?? [])
    expect(wordsForPool(pool).map((w) => w.kana)).toContain('ケーキ')
  })
})

describe('lecciones de katakana', () => {
  it('enseñan cada katakana una vez y en su grupo', () => {
    const taught = katakanaLessons.flatMap((l) => l.chars)
    expect(new Set(taught).size).toBe(taught.length)
    expect(new Set(taught)).toEqual(new Set(katakana.map((k) => k.char)))
    for (const l of katakanaLessons) for (const c of l.chars) expect(kanaByChar.get(c)?.group, c).toBe(l.group)
  })

  it('se abren al terminar los básicos del hiragana', () => {
    expect(unlockedLessons({}, false).has('kata-vocales')).toBe(false)
    expect(unlockedLessons({ w: { correct: 3, total: 3 } }, false).has('kata-vocales')).toBe(true)
    expect(unlockedLessons({}, true).size).toBe(lessons.length)
  })
})

describe('juegos y pares confusos', () => {
  it('une hiragana con katakana sin importar en qué silabario esté el pool', () => {
    const pool = ['か', 'キ', 'ファ'].map((c) => kanaByChar.get(c)!)
    expect(scriptPairItems(pool).map((p) => `${p.left}${p.right}`)).toEqual(['かカ', 'きキ'])
  })

  it('los pares confusos del katakana existen y las opciones son del mismo silabario', () => {
    for (const g of katakanaConfusables) for (const c of g.chars) expect(kanaByChar.get(c), c).toBeDefined()
    const pool = katakana.filter((k) => k.group === 'basic')
    for (const q of buildConfusableSession({ pool, count: 30 })) {
      if (q.type === 'romaji-to-kana') expect(q.options.every((k) => k.script === 'katakana')).toBe(true)
    }
  })
})

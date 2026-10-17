import { describe, expect, it } from 'vitest'
import { conjugateAdjective, conjugateVerb } from '../../lib/conjugation'
import { romajiReadings } from '../../lib/romaji'
import { iAdjectives, verbs, vocab, vocabLessons, vocabLessonsHira, vocabLessonsKata, vocabLessonsN4, vocabN4 } from './vocab'
import { allWords } from './words'

describe('vocabulario N5', () => {
  it('tiene unas 800 palabras con identificadores únicos', () => {
    expect(vocab.length).toBeGreaterThanOrEqual(800)
    expect(new Set(vocab.map((v) => v.id)).size).toBe(vocab.length)
  })

  it('incluye todas las palabras de siempre', () => {
    const kana = new Set(vocab.map((v) => v.kana))
    for (const w of allWords) expect(kana.has(w.kana), w.kana).toBe(true)
  })

  it('todas se pueden leer en romaji', () => {
    for (const v of vocab) expect(() => romajiReadings(v.kana), v.kana).not.toThrow()
  })

  it('cada verbo tiene grupo y se conjuga', () => {
    expect(verbs.length).toBeGreaterThanOrEqual(100)
    for (const v of verbs) {
      expect(v.group, v.kana).toBeDefined()
      expect(() => conjugateVerb(v.kana, v.group!, 'te'), v.kana).not.toThrow()
    }
    for (const a of iAdjectives) expect(() => conjugateAdjective(a.kana, 'i', 'negative'), a.kana).not.toThrow()
  })

  it('lecciones: todas las palabras en alguna, sin katakana en las de hiragana', () => {
    const inLessons = vocabLessons.flatMap((l) => l.words)
    expect(inLessons.length).toBe(vocab.length)
    expect(new Set(vocabLessons.map((l) => l.id)).size).toBe(vocabLessons.length)
    for (const l of vocabLessonsHira) for (const w of l.words) expect(w.kana, l.id).not.toMatch(/[゠-ヿ]/)
    for (const l of vocabLessonsKata) expect(l.words.some((w) => /[゠-ヿ]/.test(w.kana)), l.id).toBe(true)
    for (const l of vocabLessons) expect(l.words.length, l.id).toBeLessThanOrEqual(12)
  })

  it('homónimos con clases distintas se separan', () => {
    expect(vocab.filter((v) => v.kana === 'きる').map((v) => v.group).sort()).toEqual(['godan', 'ichidan'])
    expect(vocab.find((v) => v.id === 'かえる·v1')?.pos).toBe('verb')
    expect(vocab.find((v) => v.id === 'かえる·n')?.meaning).toBe('rana')
  })

  it('N4: unas 600 palabras nuevas que no cambian los ids del N5', () => {
    const n5 = vocab.filter((v) => v.level === 'N5')
    // Los ids del N5 son la clave de las tarjetas guardadas: no pueden cambiar.
    expect(n5).toHaveLength(903)
    expect(n5.find((v) => v.id === 'たべる')?.level).toBe('N5')
    expect(n5.filter((v) => v.kana === 'かえる').map((v) => v.id).sort()).toEqual(['かえる·n', 'かえる·v1'])
    expect(vocabN4.length).toBeGreaterThanOrEqual(580)
    expect(vocabN4.find((v) => v.kana === 'かえる')?.id).toBe('かえる·v2')
    // Ninguna palabra N4 repite una del N5 con la misma clase.
    const n5Keys = new Set(n5.map((v) => `${v.kana}|${v.pos}|${v.group ?? ''}`))
    for (const v of vocabN4) expect(n5Keys.has(`${v.kana}|${v.pos}|${v.group ?? ''}`), v.kana).toBe(false)
  })

  it('N4: lecciones de hasta 10 palabras, todas del N4', () => {
    expect(vocabLessonsN4.length).toBeGreaterThanOrEqual(55)
    for (const l of vocabLessonsN4) {
      expect(l.words.length, l.id).toBeLessThanOrEqual(10)
      for (const w of l.words) expect(w.level, l.id).toBe('N4')
    }
    for (const l of [...vocabLessonsHira, ...vocabLessonsKata]) for (const w of l.words) expect(w.level, l.id).toBe('N5')
  })
})

import { describe, expect, it } from 'vitest'
import { hiraganaConfusables } from '../content/hiragana'
import { kanaByChar } from '../content/kana'
import { learnedThrough } from '../content/lessons'
import { buildMemoryCards, buildPairsRounds, uniqueByRomaji } from './pairs'
import { buildConfusableSession, buildReadingSession } from './quiz'
import { matchesReading, romajiReadings } from './romaji'
import { wordReadings } from './words'

const kana = (chars: string) => [...chars].map((c) => kanaByChar.get(c)!)

describe('lecturas aceptadas', () => {
  it('acepta las variantes de romanización', () => {
    expect(romajiReadings('し')).toEqual(['shi', 'si'])
    expect(romajiReadings('ふじ')).toEqual(expect.arrayContaining(['fuji', 'huzi', 'fuzi', 'huji']))
    expect(matchesReading('densya', romajiReadings('でんしゃ'))).toBe(true)
    expect(matchesReading('matcha', romajiReadings('まっちゃ'))).toBe(true)
  })

  it('ignora mayúsculas, espacios y apóstrofos', () => {
    expect(matchesReading(' Neko ', romajiReadings('ねこ'))).toBe(true)
    expect(matchesReading('kinen', romajiReadings('きんえん'))).toBe(true)
    expect(matchesReading("kin'en", romajiReadings('きんえん'))).toBe(true)
  })

  it('rechaza respuestas vacías o incorrectas', () => {
    expect(matchesReading('', romajiReadings('ね'))).toBe(false)
    expect(matchesReading('nu', romajiReadings('ね'))).toBe(false)
  })

  it('usa la lectura escrita a mano cuando existe (partícula は)', () => {
    const hello = { kana: 'こんにちは', meaning: 'hola', theme: 'saludos' as const, romaji: 'konnichiwa' }
    expect(matchesReading('konnichiwa', wordReadings(hello))).toBe(true)
    expect(matchesReading('konnichiha', wordReadings(hello))).toBe(false)
  })
})

describe('sesión de lectura', () => {
  const pool = kana('あいうえおかきくけこ')

  it('tiene 10 preguntas sobre el pool', () => {
    const session = buildReadingSession({ pool, types: ['kana-to-romaji', 'romaji-to-kana', 'type-romaji'] })
    expect(session).toHaveLength(10)
    for (const q of session) if ('kana' in q) expect(pool).toContain(q.kana)
  })

  it('las preguntas de palabras solo usan lo aprendido', () => {
    const learned = learnedThrough('k')
    const session = buildReadingSession({ pool, types: ['type-word'] })
    for (const q of session) {
      expect(q.type).toBe('type-word')
      if (q.type === 'type-word') expect([...q.word.kana].every((c) => learned.has(c))).toBe(true)
    }
  })

  it('sin palabras disponibles usa otros tipos', () => {
    const session = buildReadingSession({ pool: kana('ぬね'), types: ['type-word'] })
    expect(session.every((q) => q.type === 'kana-to-romaji')).toBe(true)
  })

  it('las opciones incluyen la respuesta', () => {
    for (const q of buildReadingSession({ pool, types: ['kana-to-romaji', 'romaji-to-kana'], count: 50 })) {
      if (q.type === 'kana-to-romaji') expect(q.options).toContain(q.kana.romaji)
      if (q.type === 'romaji-to-kana') expect(q.options).toContain(q.kana)
    }
  })
})

describe('pares confusos', () => {
  it('los caracteres de cada grupo existen', () => {
    for (const g of hiraganaConfusables) for (const c of g.chars) expect(kanaByChar.get(c), c).toBeDefined()
  })

  it('las opciones incluyen a todo el grupo y la clave', () => {
    for (const q of buildConfusableSession({ pool: kana('なにぬねのまみむめも'), count: 30 })) {
      expect(['kana-to-romaji', 'romaji-to-kana']).toContain(q.type)
      if (q.type !== 'kana-to-romaji' && q.type !== 'romaji-to-kana') continue
      expect(q.tip).toBeTruthy()
      const group = hiraganaConfusables.find((g) => g.tip === q.tip)!
      expect(group.chars).toContain(q.kana.char)
      const shown = q.type === 'kana-to-romaji' ? q.options : q.options.map((k) => k.romaji)
      for (const c of group.chars) expect(shown).toContain(kanaByChar.get(c)!.romaji)
    }
  })
})

describe('juegos de parejas', () => {
  it('no mezcla caracteres que se escriben igual', () => {
    expect(uniqueByRomaji(kana('じぢずづ')).map((k) => k.char)).toEqual(['じ', 'ず'])
  })

  it('reparte en rondas de hasta 6 con las dos columnas iguales', () => {
    const rounds = buildPairsRounds(kana('あいうえおかきくけこさしすせそ'))
    expect(rounds.map((r) => r.left.length)).toEqual([6, 6, 3])
    for (const r of rounds) expect(new Set(r.right)).toEqual(new Set(r.left))
  })

  it('no deja una ronda final de una sola pareja', () => {
    const rounds = buildPairsRounds(kana('あいうえおかき'))
    expect(rounds.every((r) => r.left.length >= 2)).toBe(true)
  })

  it('cada carta de memoria tiene su pareja', () => {
    const cards = buildMemoryCards(kana('あいうえおかきく'))
    expect(cards).toHaveLength(12)
    for (const card of cards) {
      expect(cards.filter((c) => c.kana === card.kana).map((c) => c.face).sort()).toEqual(['kana', 'romaji'])
    }
  })
})

import { describe, expect, it } from 'vitest'
import { syllables, toRomaji } from './romaji'
import { wordsContaining } from './words'

describe('syllables', () => {
  it('une los combinados en una sílaba', () => {
    expect(syllables('でんしゃ')).toEqual(['で', 'ん', 'しゃ'])
    expect(syllables('がっこう')).toEqual(['が', 'っ', 'こ', 'う'])
  })

  it('una palabra con しゃ no cuenta como ejemplo de し', () => {
    const examples = wordsContaining('し', 100).map((w) => w.kana)
    expect(examples).toContain('すし')
    expect(examples).not.toContain('でんしゃ')
  })
})

describe('toRomaji', () => {
  it('convierte caracteres básicos', () => {
    expect(toRomaji('ねこ')).toBe('neko')
    expect(toRomaji('しつち')).toBe('shitsuchi')
    expect(toRomaji('ふじ')).toBe('fuji')
  })

  it('convierte combinados de dos caracteres', () => {
    expect(toRomaji('きょう')).toBe('kyou')
    expect(toRomaji('でんしゃ')).toBe('densha')
    expect(toRomaji('じゅう')).toBe('juu')
  })

  it('duplica la consonante después de っ', () => {
    expect(toRomaji('がっこう')).toBe('gakkou')
    expect(toRomaji('きって')).toBe('kitte')
    expect(toRomaji('まっちゃ')).toBe('matcha')
  })

  it('separa ん de una vocal o y siguiente', () => {
    expect(toRomaji('きんえん')).toBe("kin'en")
    expect(toRomaji('ほんや')).toBe("hon'ya")
    expect(toRomaji('みかん')).toBe('mikan')
  })

  it('falla con caracteres desconocidos', () => {
    expect(() => toRomaji('ねこa')).toThrow()
  })
})

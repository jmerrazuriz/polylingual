import { describe, expect, it } from 'vitest'
import { finishKana, matchesKana, romajiToKana } from './kanaInput'

describe('entrada en kana', () => {
  it('convierte sílabas, combinados y variantes', () => {
    expect(romajiToKana('taberu')).toBe('たべる')
    expect(romajiToKana('shashin')).toBe('しゃしn')
    expect(romajiToKana('sisyo')).toBe('ししょ')
    expect(romajiToKana('tsukue')).toBe('つくえ')
  })

  it('consonante doble → っ, y «tch»', () => {
    expect(romajiToKana('gakkou')).toBe('がっこう')
    expect(romajiToKana('matcha')).toBe('まっちゃ')
  })

  it('ん antes de consonante, con nn o al final', () => {
    expect(romajiToKana('shinbun')).toBe('しんぶn')
    expect(finishKana('shinbun')).toBe('しんぶん')
    expect(romajiToKana('konnichiha')).toBe('こんにちは')
    expect(finishKana("kin'en")).toBe('きんえん')
    expect(romajiToKana('hon\'ya')).toBe('ほんや')
  })

  it('deja lo incompleto en romaji para seguir escribiendo', () => {
    expect(romajiToKana('tab')).toBe('たb')
    expect(romajiToKana('ky')).toBe('ky')
  })

  it('extendidos, guion largo y pequeños', () => {
    expect(romajiToKana('fairu')).toBe('ふぁいる')
    expect(romajiToKana('ko-hi-')).toBe('こーひー')
    expect(romajiToKana('xtsu')).toBe('っ')
  })

  it('compara sin importar hiragana/katakana ni la vocal larga', () => {
    expect(matchesKana('ko-hi-', ['コーヒー'])).toBe(true)
    expect(matchesKana('koohii', ['コーヒー'])).toBe(true)
    expect(matchesKana('こうひい', ['コーヒー'])).toBe(false)
    expect(matchesKana('tabemasu', ['たべます'])).toBe(true)
    expect(matchesKana('honn', ['ほん'])).toBe(true)
    expect(matchesKana('', ['ほん'])).toBe(false)
  })
})

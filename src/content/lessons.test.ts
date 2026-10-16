import { describe, expect, it } from 'vitest'
import { romajiOptions } from '../lib/quiz'
import { wordsReadableWith } from '../lib/words'
import { hiragana, kanaByChar } from './kana'
import { hiraganaLessons, learnedThrough } from './lessons'

describe('lecciones', () => {
  it('enseñan cada hiragana exactamente una vez', () => {
    const taught = hiraganaLessons.flatMap((l) => l.chars)
    expect(new Set(taught).size).toBe(taught.length)
    expect(new Set(taught)).toEqual(new Set(hiragana.map((k) => k.char)))
  })

  it('cada lección pertenece al grupo de sus caracteres', () => {
    for (const lesson of hiraganaLessons) {
      for (const char of lesson.chars) expect(kanaByChar.get(char)?.group, char).toBe(lesson.group)
    }
  })

  it('los ids no se repiten', () => {
    const ids = hiraganaLessons.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todos los básicos tienen mnemotecnia', () => {
    for (const kana of hiragana.filter((k) => k.group === 'basic')) expect(kana.mnemonic, kana.char).toBeTruthy()
  })

  it('learnedThrough acumula las lecciones anteriores', () => {
    expect([...learnedThrough('vocales')]).toEqual(['あ', 'い', 'う', 'え', 'お'])
    const k = learnedThrough('k')
    expect(k.has('あ') && k.has('こ') && !k.has('さ')).toBe(true)
    expect(learnedThrough('t').has('っ')).toBe(true)
  })

  it('las palabras de una lección solo usan lo aprendido', () => {
    const vowelWords = wordsReadableWith(learnedThrough('vocales')).map((w) => w.kana)
    expect(vowelWords).toEqual(expect.arrayContaining(['いえ', 'あお', 'いいえ']))
    expect(vowelWords.every((w) => [...w].every((c) => 'あいうえお'.includes(c)))).toBe(true)
  })
})

describe('romajiOptions', () => {
  it('incluye la respuesta y no repite romaji', () => {
    const ji = kanaByChar.get('ぢ')!
    const pool = ['じ', 'ぢ', 'ず', 'づ', 'ざ', 'ぜ', 'ぞ'].map((c) => kanaByChar.get(c)!)
    for (let i = 0; i < 20; i++) {
      const options = romajiOptions(ji, pool)
      expect(options).toContain('ji')
      expect(options).toHaveLength(4)
      expect(new Set(options).size).toBe(4)
    }
  })

  it('funciona con pocos distractores', () => {
    const a = kanaByChar.get('あ')!
    expect(romajiOptions(a, [a, kanaByChar.get('い')!])).toHaveLength(2)
  })
})

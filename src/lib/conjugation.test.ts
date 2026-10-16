import { describe, expect, it } from 'vitest'
import { conjugateAdjective, conjugateVerb, type VerbForm } from './conjugation'

const all = (verb: string, group: Parameters<typeof conjugateVerb>[1], forms: VerbForm[]) =>
  forms.map((f) => conjugateVerb(verb, group, f))

describe('conjugación de verbos', () => {
  it('grupo 2 (ichidan): たべる', () => {
    expect(all('たべる', 'ichidan', ['masu', 'nai', 'ta', 'te', 'tai', 'potential', 'volitional', 'ba', 'passive', 'causative', 'imperative'])).toEqual([
      'たべます', 'たべない', 'たべた', 'たべて', 'たべたい', 'たべられる', 'たべよう', 'たべれば', 'たべられる', 'たべさせる', 'たべろ',
    ])
  })

  it('grupo 1 (godan): formas て/た según la última sílaba', () => {
    const te = (v: string) => conjugateVerb(v, 'godan', 'te')
    expect(['かう', 'まつ', 'とる', 'のむ', 'あそぶ', 'しぬ', 'かく', 'およぐ', 'はなす'].map(te)).toEqual([
      'かって', 'まって', 'とって', 'のんで', 'あそんで', 'しんで', 'かいて', 'およいで', 'はなして',
    ])
    expect(conjugateVerb('かう', 'godan', 'nai')).toBe('かわない')
    expect(conjugateVerb('のむ', 'godan', 'ta')).toBe('のんだ')
  })

  it('grupo 1: resto de formas con のむ', () => {
    expect(all('のむ', 'godan', ['masu', 'masen', 'mashita', 'masendeshita', 'mashou', 'nai', 'nakatta', 'tai', 'potential', 'volitional', 'imperative', 'ba', 'tara', 'passive', 'causative'])).toEqual([
      'のみます', 'のみません', 'のみました', 'のみませんでした', 'のみましょう', 'のまない', 'のまなかった', 'のみたい', 'のめる', 'のもう', 'のめ', 'のめば', 'のんだら', 'のまれる', 'のませる',
    ])
  })

  it('excepciones: いく, ある y verbos del grupo 1 que terminan en «eru/iru»', () => {
    expect(conjugateVerb('いく', 'godan', 'te')).toBe('いって')
    expect(conjugateVerb('いく', 'godan', 'ta')).toBe('いった')
    expect(conjugateVerb('もっていく', 'godan', 'te')).toBe('もっていって')
    expect(conjugateVerb('ある', 'godan', 'nai')).toBe('ない')
    expect(conjugateVerb('ある', 'godan', 'nakatta')).toBe('なかった')
    expect(conjugateVerb('かえる', 'godan', 'masu')).toBe('かえります')
    expect(conjugateVerb('はいる', 'godan', 'te')).toBe('はいって')
    expect(conjugateVerb('きく', 'godan', 'te')).toBe('きいて')
  })

  it('irregulares: する, くる y compuestos', () => {
    expect(all('する', 'irregular', ['masu', 'nai', 'te', 'ta', 'potential'])).toEqual(['します', 'しない', 'して', 'した', 'できる'])
    expect(all('くる', 'irregular', ['masu', 'nai', 'te', 'ta', 'volitional'])).toEqual(['きます', 'こない', 'きて', 'きた', 'こよう'])
    expect(conjugateVerb('べんきょうする', 'irregular', 'masu')).toBe('べんきょうします')
    expect(conjugateVerb('べんきょうする', 'irregular', 'te')).toBe('べんきょうして')
  })

  it('rechaza un verbo mal clasificado', () => {
    expect(() => conjugateVerb('のむ', 'ichidan', 'te')).toThrow()
  })
})

describe('conjugación de adjetivos', () => {
  it('adjetivos い', () => {
    expect(['negative', 'past', 'pastNegative', 'te', 'adverb', 'politeNegative', 'politePast'].map((f) => conjugateAdjective('たかい', 'i', f as never))).toEqual([
      'たかくない', 'たかかった', 'たかくなかった', 'たかくて', 'たかく', 'たかくないです', 'たかかったです',
    ])
  })

  it('いい se conjuga desde よい', () => {
    expect(conjugateAdjective('いい', 'i', 'negative')).toBe('よくない')
    expect(conjugateAdjective('いい', 'i', 'past')).toBe('よかった')
    expect(conjugateAdjective('いい', 'i', 'present')).toBe('いい')
  })

  it('adjetivos な', () => {
    expect(['present', 'negative', 'past', 'te', 'adverb', 'polite', 'politePast'].map((f) => conjugateAdjective('しずか', 'na', f as never))).toEqual([
      'しずかだ', 'しずかじゃない', 'しずかだった', 'しずかで', 'しずかに', 'しずかです', 'しずかでした',
    ])
  })
})

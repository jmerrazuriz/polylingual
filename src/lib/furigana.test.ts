import { describe, expect, it } from 'vitest'
import { japaneseSpeech } from './audio/useSpeech'
import { furiganaToKana, furiganaToPlain, hasFurigana, parseFurigana } from './furigana'
import { glossary, lineTokens } from './readings'

describe('furigana', () => {
  const text = '駅[えき]まで 歩[ある]いて 五分[ごふん]で 行[い]けます。'

  it('separa los kanji con su lectura del resto', () => {
    expect(parseFurigana('駅[えき]まで')).toEqual([{ text: '駅', ruby: 'えき' }, { text: 'まで' }])
    expect(parseFurigana('五分[ごふん]で').map((s) => s.ruby)).toEqual(['ごふん', undefined])
    expect(parseFurigana('かな だけ')).toEqual([{ text: 'かな だけ' }])
  })

  it('se convierte a kana o a escritura normal', () => {
    expect(furiganaToKana(text)).toBe('えきまで あるいて ごふんで いけます。')
    expect(furiganaToPlain(text)).toBe('駅まで 歩いて 五分で 行けます。')
    expect(hasFurigana(text)).toBe(true)
    expect(hasFurigana('ひらがな')).toBe(false)
  })

  it('la voz lee la lectura y el glosario reconoce la palabra conjugada', () => {
    expect(japaneseSpeech(text)).toBe('えきまで あるいて ごふんで いけます。')
    expect(lineTokens('行[い]けます。')).toEqual(['いけます'])
    expect(glossary(lineTokens('食[た]べました')[0])?.entry.kana).toBe('たべる')
    expect(glossary(lineTokens('銀行[ぎんこう]も')[0])?.entry.meaning).toBe('banco')
  })
})

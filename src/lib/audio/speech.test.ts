import { describe, expect, it } from 'vitest'
import { japaneseSpeech } from './useSpeech'

describe('voz japonesa', () => {
  it('lee solo la parte en japonés', () => {
    expect(japaneseSpeech('¿Cómo se lee «か»?')).toBe('か')
    expect(japaneseSpeech('«comer» → たべる (verbo)')).toBe('たべる')
    expect(japaneseSpeech('わたし は がくせい です。')).toBe('わたし は がくせい です。')
    expect(japaneseSpeech('コーヒー')).toBe('コーヒー')
    expect(japaneseSpeech('山')).toBe('山')
  })

  it('no lee nada si todo está en español', () => {
    expect(japaneseSpeech('¿Cómo se dice «comer»?')).toBe('')
    expect(japaneseSpeech('Es profesor.')).toBe('')
  })
})

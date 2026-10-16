import { useCallback, useEffect, useState } from 'react'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

function findJapaneseVoice(): SpeechSynthesisVoice | undefined {
  if (!supported) return undefined
  return speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').toLowerCase().startsWith('ja'))
}

/**
 * Voz japonesa del navegador (Web Speech API). `available` es false si el
 * dispositivo no tiene una voz ja-JP; en ese caso se oculta el botón de audio.
 */
export function useSpeech() {
  const [voice, setVoice] = useState(findJapaneseVoice)

  useEffect(() => {
    if (!supported) return
    // Algunos navegadores cargan las voces de forma asíncrona.
    const update = () => setVoice(findJapaneseVoice())
    speechSynthesis.addEventListener('voiceschanged', update)
    return () => speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!voice) return
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    },
    [voice],
  )

  return { available: voice !== undefined, speak }
}

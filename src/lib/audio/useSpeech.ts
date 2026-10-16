import { useCallback, useEffect, useState } from 'react'
import { useProgress } from '../progress/store'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

function findJapaneseVoice(): SpeechSynthesisVoice | undefined {
  if (!supported) return undefined
  return speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').toLowerCase().startsWith('ja'))
}

/**
 * Voz japonesa del navegador (Web Speech API). `available` es false si el
 * dispositivo no tiene una voz ja-JP o si el audio está apagado en los ajustes;
 * en ese caso se ocultan los botones de audio.
 */
export function useSpeech() {
  const [voice, setVoice] = useState(findJapaneseVoice)
  const enabled = useProgress((s) => s.settings.audio)
  const rate = useProgress((s) => s.settings.speechRate)

  useEffect(() => {
    if (!supported) return
    // Algunos navegadores cargan las voces de forma asíncrona.
    const update = () => setVoice(findJapaneseVoice())
    speechSynthesis.addEventListener('voiceschanged', update)
    return () => speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!voice || !enabled) return
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = rate
      speechSynthesis.speak(utterance)
    },
    [voice, enabled, rate],
  )

  return { available: voice !== undefined && enabled, voiceFound: voice !== undefined, speak }
}

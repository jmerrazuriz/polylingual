import { useCallback, useEffect, useState } from 'react'
import { furiganaToKana } from '../furigana'
import { useProgress } from '../progress/store'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

function findJapaneseVoice(): SpeechSynthesisVoice | undefined {
  if (!supported) return undefined
  return speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').toLowerCase().startsWith('ja'))
}

const JAPANESE = /[぀-ヿ㐀-鿿々]/
/** Letras latinas (con tildes), signos del español, comillas y flechas: no se leen con la voz japonesa. */
const NOT_JAPANESE = /[A-Za-zÀ-ÿ¿¡«»"“”'‘’()?!.,:;→+·/[\]=-]+/g

/**
 * Solo la parte en japonés de un texto («¿Cómo se lee «か»?» → «か»). Si no queda
 * nada en japonés devuelve '' y no se lee nada (la voz japonesa leería mal el español).
 */
export function japaneseSpeech(text: string): string {
  // Con furigana se lee la lectura (駅[えき] → えき), que es la pronunciación correcta.
  const parts = furiganaToKana(text)
    .replace(NOT_JAPANESE, '\n')
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => JAPANESE.test(p))
  return parts.join('、')
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
      const spoken = japaneseSpeech(text)
      if (!spoken) return
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(spoken)
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = rate
      speechSynthesis.speak(utterance)
    },
    [voice, enabled, rate],
  )

  /** Lee varias frases seguidas; en los diálogos, cada persona con un tono distinto. */
  const speakLines = useCallback(
    (lines: readonly { text: string; speaker?: string }[], onEnd?: () => void) => {
      if (!voice || !enabled) return
      speechSynthesis.cancel()
      const speakers = [...new Set(lines.map((l) => l.speaker ?? ''))]
      const spokenLines = lines.map((l) => japaneseSpeech(l.text))
      const last = spokenLines.findLastIndex(Boolean)
      lines.forEach((line, i) => {
        const spoken = spokenLines[i]
        if (!spoken) return
        const utterance = new SpeechSynthesisUtterance(spoken)
        utterance.voice = voice
        utterance.lang = voice.lang
        utterance.rate = rate
        // Dos voces distintas con la misma voz japonesa: una más grave y otra más aguda.
        utterance.pitch = speakers.indexOf(line.speaker ?? '') % 2 === 0 ? 0.85 : 1.35
        if (i === last) utterance.onend = () => onEnd?.()
        speechSynthesis.speak(utterance)
      })
    },
    [voice, enabled, rate],
  )

  const stop = useCallback(() => {
    if (supported) speechSynthesis.cancel()
  }, [])

  return { available: voice !== undefined && enabled, voiceFound: voice !== undefined, speak, speakLines, stop }
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { courseById } from '../../courses'
import { furiganaToKana } from '../furigana'
import { useProgress } from '../progress/store'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

/** Voces del navegador para un idioma («ja-JP» → todas las «ja…»). */
function voicesFor(lang: string): SpeechSynthesisVoice[] {
  if (!supported) return []
  const prefix = lang.slice(0, 2).toLowerCase()
  return speechSynthesis.getVoices().filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(prefix))
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

/** Texto alemán para leer: sin huecos «＿», comillas ni signos de la interfaz. */
export function germanSpeech(text: string): string {
  return text.replace(/＿+/g, ' ').replace(/[«»"“”]/g, '').replace(/\s+/g, ' ').trim()
}

/**
 * Voz del navegador (Web Speech API) en el idioma del curso activo. `available` es false si
 * el dispositivo no tiene una voz de ese idioma o si el audio está apagado en los ajustes;
 * en ese caso se ocultan los botones de audio.
 */
export function useSpeech() {
  const lang = courseById(useProgress((s) => s.course)).speechLang
  const [allVoices, setAllVoices] = useState(() => (supported ? speechSynthesis.getVoices() : []))
  const voices = useMemo(() => (allVoices.length ? voicesFor(lang) : []), [allVoices, lang])
  const voice = voices[0]
  const enabled = useProgress((s) => s.settings.audio)
  const rate = useProgress((s) => s.settings.speechRate)
  const toSpeech = lang.startsWith('ja') ? japaneseSpeech : germanSpeech

  useEffect(() => {
    if (!supported) return
    // Algunos navegadores cargan las voces de forma asíncrona.
    const update = () => setAllVoices(speechSynthesis.getVoices())
    speechSynthesis.addEventListener('voiceschanged', update)
    return () => speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!voice || !enabled) return
      const spoken = toSpeech(text)
      if (!spoken) return
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(spoken)
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = rate
      speechSynthesis.speak(utterance)
    },
    [voice, enabled, rate, toSpeech],
  )

  /** Lee varias frases seguidas; en los diálogos, cada persona con otra voz (si hay) o con otro tono. */
  const speakLines = useCallback(
    (lines: readonly { text: string; speaker?: string }[], onEnd?: () => void) => {
      if (!voice || !enabled) return
      speechSynthesis.cancel()
      const speakers = [...new Set(lines.map((l) => l.speaker ?? ''))]
      const spokenLines = lines.map((l) => toSpeech(l.text))
      const last = spokenLines.findLastIndex(Boolean)
      lines.forEach((line, i) => {
        const spoken = spokenLines[i]
        if (!spoken) return
        const who = speakers.indexOf(line.speaker ?? '')
        const utterance = new SpeechSynthesisUtterance(spoken)
        utterance.voice = voices[who % voices.length] ?? voice
        utterance.lang = utterance.voice.lang
        utterance.rate = rate
        // Con una sola voz, dos tonos distintos: uno más grave y otro más agudo.
        utterance.pitch = voices.length > 1 ? 1 : who % 2 === 0 ? 0.85 : 1.35
        if (i === last) utterance.onend = () => onEnd?.()
        speechSynthesis.speak(utterance)
      })
    },
    [voice, voices, enabled, rate, toSpeech],
  )

  const stop = useCallback(() => {
    if (supported) speechSynthesis.cancel()
  }, [])

  return { available: voice !== undefined && enabled, voiceFound: voice !== undefined, speak, speakLines, stop }
}

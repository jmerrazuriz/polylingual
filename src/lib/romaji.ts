import { hiraganaInfo, smallHiragana } from '../content/hiragana.ts'

const table = new Map<string, string>([
  ...Object.entries(hiraganaInfo).map(([char, info]) => [char, info.romaji] as const),
  ...Object.entries(smallHiragana),
])

/** Separa en sílabas, uniendo los combinados: でんしゃ → ['で', 'ん', 'しゃ']. */
export function syllables(kana: string): string[] {
  const chars = [...kana]
  const out: string[] = []
  for (let i = 0; i < chars.length; ) {
    const pair = chars[i] + (chars[i + 1] ?? '')
    const key = chars[i + 1] && table.has(pair) ? pair : chars[i]
    out.push(key)
    i += [...key].length
  }
  return out
}

/**
 * Convierte kana a romaji Hepburn, escribiendo las vocales largas tal como están
 * en kana (おとうさん → otousan) para que se puedan teclear.
 * Lanza un error si encuentra un carácter desconocido.
 */
export function toRomaji(kana: string): string {
  let out = ''
  let doubleNext = false
  let prevWasN = false

  for (const key of syllables(kana)) {
    if (key === 'っ') {
      doubleNext = true
      continue
    }

    let syllable = table.get(key)
    if (syllable === undefined) throw new Error(`Carácter sin romaji: ${key}`)

    // っ duplica la consonante siguiente: がっこう → gakkou, まっちゃ → matcha
    if (doubleNext) {
      syllable = (syllable.startsWith('ch') ? 't' : syllable[0]) + syllable
      doubleNext = false
    }
    // ん antes de vocal o y se separa con apóstrofo: きんえん → kin'en
    if (prevWasN && /^[aeiouy]/.test(syllable)) out += "'"

    out += syllable
    prevWasN = key === 'ん'
  }
  return out
}
